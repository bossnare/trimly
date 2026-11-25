import type { ImageFormat, ProcessRequest } from "../types";
import { formatFromMime, supportsQuality } from "../utils/format-utils";

/**
 * Maps typed UI options to the multipart fields the backend expects.
 * Fields that don't apply are omitted (e.g. no quality for PNG output).
 */
export function buildFormData(request: ProcessRequest): FormData {
  const form = new FormData();
  form.append("file", request.file);

  switch (request.tool) {
    case "resize": {
      const { width, height, fit, withoutEnlargement } = request.options;
      if (width !== null) form.append("width", String(width));
      if (height !== null) form.append("height", String(height));
      form.append("fit", fit);
      form.append("withoutEnlargement", String(withoutEnlargement));
      break;
    }
    case "convert": {
      const { format, quality } = request.options;
      form.append("format", format);
      if (supportsQuality(format)) form.append("quality", String(quality));
      break;
    }
    case "compress": {
      // The backend keeps the original format. PNG is lossless: no quality sent.
      const sourceFormat = formatFromMime(request.file.type);
      if (supportsQuality(sourceFormat)) form.append("quality", String(request.options.quality));
      break;
    }
    case "removeBackground": {
      const { fill, color } = request.options;
      form.append("fill", fill);
      if (fill === "custom") form.append("color", color);
      break;
    }
  }
  return form;
}

/** Format we expect back when the response has no usable Content-Type. */
export function expectedOutputFormat(request: ProcessRequest): ImageFormat | null {
  switch (request.tool) {
    case "convert":
      return request.options.format;
    case "removeBackground":
      return "png";
    default:
      return formatFromMime(request.file.type);
  }
}
