import type { ToolId } from "../types";

/** Adjust these paths if your backend routes differ. They are the only place that knows them. */
export const IMAGE_ENDPOINTS: Record<ToolId, string> = {
  resize: "/images/resize",
  convert: "/images/convert",
  compress: "/images/compress",
  removeBackground: "/images/remove-background",
};
