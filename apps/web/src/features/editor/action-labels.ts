import type { ImageFormat, ToolId } from "@/features/images/types";
import { formatLabel } from "@/features/images/utils/format-utils";

/** Label of the main action before an image exists. */
export const ACTION_LABEL: Record<ToolId, string> = {
  resize: "Resize image",
  convert: "Convert image",
  compress: "Compress image",
  removeBackground: "Remove background",
};

/** Label of the download button: follows the real output format (e.g. "Download AVIF"). */
export function downloadLabel(tool: ToolId, format: ImageFormat | null): string {
  if ((tool === "convert" || tool === "removeBackground") && format) return `Download ${formatLabel(format)}`;
  return "Download image";
}
