import type { ImageFormat, ToolId } from "../types";
import { getFormatInfo } from "./format-utils";

/** "sunset-vase.jpg" + webp -> "sunset-vase-trimly.webp" */
export function buildOutputFilename(originalName: string, _tool: ToolId, format: ImageFormat | null): string {
  const dot = originalName.lastIndexOf(".");
  const base = dot > 0 ? originalName.slice(0, dot) : originalName;
  const ext = format ? getFormatInfo(format).extension : dot > 0 ? originalName.slice(dot + 1) : "img";
  return `${base}-trimly.${ext}`;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  // Give the browser a tick to start the download before releasing the blob.
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
