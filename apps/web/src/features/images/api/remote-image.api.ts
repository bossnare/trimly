import { localClient } from "@/lib/http/clients";
import { FORMATS } from "../constants";

function filenameFromUrl(url: string, mime: string): string {
  const extension = FORMATS.find((f) => f.mime === mime)?.extension ?? "img";
  try {
    const last = new URL(url).pathname.split("/").filter(Boolean).pop();
    if (last && /\.[a-z0-9]{2,5}$/i.test(last)) return decodeURIComponent(last);
    if (last) return `${decodeURIComponent(last)}.${extension}`;
  } catch {
    /* fall through */
  }
  return `image.${extension}`;
}

/** Downloads a remote image through the Next.js proxy (avoids CORS) and wraps it in a File. */
export async function fetchRemoteImage(url: string, signal?: AbortSignal): Promise<File> {
  const response = await localClient.get<Blob>("/image-proxy", {
    params: { url },
    responseType: "blob",
    signal,
  });
  const blob = response.data;
  return new File([blob], filenameFromUrl(url, blob.type), { type: blob.type });
}
