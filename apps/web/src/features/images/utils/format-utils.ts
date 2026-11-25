import { FORMATS } from "../constants";
import type { FormatInfo } from "../constants";
import type { ImageFormat } from "../types";

export function getFormatInfo(format: ImageFormat): FormatInfo {
  const info = FORMATS.find((f) => f.id === format);
  if (!info) throw new Error(`Unknown format: ${format}`);
  return info;
}

export function formatFromMime(mime: string): ImageFormat | null {
  const normalised = mime.split(";")[0]?.trim().toLowerCase() ?? "";
  if (normalised === "image/jpg") return "jpeg";
  return FORMATS.find((f) => f.mime === normalised)?.id ?? null;
}

/** Unknown source format => true, so the quality slider stays available. */
export function supportsQuality(format: ImageFormat | null): boolean {
  return format === null ? true : getFormatInfo(format).supportsQuality;
}

export function formatLabel(format: ImageFormat | null): string {
  return format ? getFormatInfo(format).label : "Original";
}
