import { ACCEPTED_MIME_TYPES, MAX_UPLOAD_MB } from "../constants";
import { formatFromMime } from "./format-utils";

export type FileValidationCode = "EMPTY" | "TOO_LARGE" | "UNSUPPORTED";

export interface FileValidationError {
  code: FileValidationCode;
  message: string;
}

export function validateImageFile(file: File, maxBytes: number): FileValidationError | null {
  if (file.size === 0) {
    return { code: "EMPTY", message: "This file is empty. Choose another image." };
  }
  if (formatFromMime(file.type) === null || !ACCEPTED_MIME_TYPES.some((m) => m === file.type || file.type === "image/jpg")) {
    return { code: "UNSUPPORTED", message: "Unsupported file. Use a PNG, JPEG, WebP or AVIF image." };
  }
  if (file.size > maxBytes) {
    return { code: "TOO_LARGE", message: `This image is over ${MAX_UPLOAD_MB} MB. Choose a smaller file.` };
  }
  return null;
}

/** Accepts only http(s) URLs. */
export function parseImageUrl(input: string): URL | null {
  try {
    const url = new URL(input.trim());
    return url.protocol === "http:" || url.protocol === "https:" ? url : null;
  } catch {
    return null;
  }
}
