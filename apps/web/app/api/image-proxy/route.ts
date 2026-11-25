import { lookup } from "node:dns/promises";
import { isIP } from "node:net";
import { NextResponse, type NextRequest } from "next/server";
import { env } from "@/config/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_BYTES = env.NEXT_PUBLIC_MAX_UPLOAD_MB * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);
const MAX_REDIRECTS = 3;
const TIMEOUT_MS = 15_000;

function fail(status: number, message: string) {
  return NextResponse.json({ message }, { status });
}

function isPrivateIPv4(ip: string): boolean {
  const [a = 0, b = 0] = ip.split(".").map(Number);
  return (
    a === 0 || a === 10 || a === 127 ||
    (a === 100 && b >= 64 && b <= 127) ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
}

function isPrivateIP(ip: string): boolean {
  const family = isIP(ip);
  if (family === 4) return isPrivateIPv4(ip);
  if (family === 6) {
    const lower = ip.toLowerCase();
    if (lower === "::1" || lower === "::") return true;
    if (lower.startsWith("fc") || lower.startsWith("fd") || lower.startsWith("fe8") || lower.startsWith("fe9") || lower.startsWith("fea") || lower.startsWith("feb")) return true;
    const mapped = lower.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
    return mapped?.[1] ? isPrivateIPv4(mapped[1]) : false;
  }
  return true;
}

/** Blocks localhost, private ranges and hostnames that resolve to them (SSRF protection). */
async function assertPublicHost(url: URL): Promise<void> {
  const host = url.hostname.replace(/^\[|\]$/g, "");
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) throw new Error("PRIVATE");
  if (isIP(host)) {
    if (isPrivateIP(host)) throw new Error("PRIVATE");
    return;
  }
  const addresses = await lookup(host, { all: true });
  if (addresses.length === 0 || addresses.some((a) => isPrivateIP(a.address))) throw new Error("PRIVATE");
}

async function fetchWithRedirects(start: URL, signal: AbortSignal): Promise<Response> {
  let current = start;
  for (let hop = 0; hop <= MAX_REDIRECTS; hop += 1) {
    await assertPublicHost(current);
    const response = await fetch(current, { redirect: "manual", signal, headers: { accept: "image/*" } });
    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get("location");
      if (!location) throw new Error("BAD_REDIRECT");
      current = new URL(location, current);
      if (current.protocol !== "http:" && current.protocol !== "https:") throw new Error("BAD_REDIRECT");
      continue;
    }
    return response;
  }
  throw new Error("TOO_MANY_REDIRECTS");
}

async function readLimited(response: Response): Promise<Uint8Array | null> {
  const reader = response.body?.getReader();
  if (!reader) return null;
  const chunks: Uint8Array[] = [];
  let received = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    received += value.byteLength;
    if (received > MAX_BYTES) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  const merged = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    merged.set(chunk, offset);
    offset += chunk.byteLength;
  }
  return merged;
}

export async function GET(request: NextRequest) {
  const raw = request.nextUrl.searchParams.get("url");
  if (!raw) return fail(400, "Add an image URL.");

  let target: URL;
  try {
    target = new URL(raw);
  } catch {
    return fail(400, "This isn't a valid URL.");
  }
  if (target.protocol !== "http:" && target.protocol !== "https:") {
    return fail(400, "Only http and https links are supported.");
  }

  try {
    const upstream = await fetchWithRedirects(target, AbortSignal.timeout(TIMEOUT_MS));
    if (!upstream.ok) {
      return fail(upstream.status === 404 ? 404 : 502, upstream.status === 404 ? "No image found at this URL." : "The image host refused the request.");
    }

    const type = (upstream.headers.get("content-type") ?? "").split(";")[0]?.trim().toLowerCase() ?? "";
    if (!ALLOWED_TYPES.has(type)) return fail(415, "This link isn't a PNG, JPEG, WebP or AVIF image.");

    const declared = Number(upstream.headers.get("content-length"));
    if (Number.isFinite(declared) && declared > MAX_BYTES) {
      return fail(413, `This image is over ${env.NEXT_PUBLIC_MAX_UPLOAD_MB} MB.`);
    }

    const bytes = await readLimited(upstream);
    if (!bytes) return fail(413, `This image is over ${env.NEXT_PUBLIC_MAX_UPLOAD_MB} MB.`);

    return new NextResponse(bytes as unknown as BodyInit, {
      status: 200,
      headers: { "content-type": type, "cache-control": "no-store" },
    });
  } catch (error) {
    if (error instanceof Error && error.message === "PRIVATE") return fail(400, "This address isn't allowed.");
    if (error instanceof Error && (error.name === "TimeoutError" || error.name === "AbortError")) {
      return fail(504, "The image host took too long to respond.");
    }
    return fail(502, "Couldn't download this image. Check the link and try again.");
  }
}
