import type { SourceImage } from "../types";
import { formatFromMime } from "./format-utils";

export class ImageDecodeError extends Error {
  constructor() {
    super("This image can't be read. The file may be corrupted.");
    this.name = "ImageDecodeError";
  }
}

function decodeDimensions(url: string): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
    img.onerror = () => reject(new ImageDecodeError());
    img.src = url;
  });
}

/** Decodes the file to read its real dimensions. Rejects on corrupted images. */
export async function loadSourceImage(file: File): Promise<SourceImage> {
  const objectUrl = URL.createObjectURL(file);
  try {
    const { width, height } = await decodeDimensions(objectUrl);
    if (!width || !height) throw new ImageDecodeError();
    return {
      id: crypto.randomUUID(),
      file,
      name: file.name,
      size: file.size,
      mime: file.type,
      format: formatFromMime(file.type),
      width,
      height,
      objectUrl,
    };
  } catch (error) {
    URL.revokeObjectURL(objectUrl);
    throw error instanceof ImageDecodeError ? error : new ImageDecodeError();
  }
}
