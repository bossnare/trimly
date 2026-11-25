export type ImageFormat = "jpeg" | "png" | "webp" | "avif";

export type ToolId = "resize" | "convert" | "compress" | "removeBackground";

export type FitMode = "cover" | "contain" | "fill" | "inside" | "outside";

export interface ResizeOptions {
  width: number | null;
  height: number | null;
  fit: FitMode;
  withoutEnlargement: boolean;
}

export interface ConvertOptions {
  format: ImageFormat;
  /** 1–100. Ignored for lossless formats (PNG). */
  quality: number;
}

export interface CompressOptions {
  /** 1–100. Only sent for quality-based source formats (JPEG, WebP, AVIF). */
  quality: number;
}

export type BackgroundFill = "transparent" | "white" | "custom";

export interface RemoveBackgroundOptions {
  fill: BackgroundFill;
  /** Hex color, used when fill is "custom". */
  color: string;
}

export interface ToolOptionsMap {
  resize: ResizeOptions;
  convert: ConvertOptions;
  compress: CompressOptions;
  removeBackground: RemoveBackgroundOptions;
}

export type ToolOptions = ToolOptionsMap[ToolId];

/** Discriminated union: `tool` narrows `options`. */
export type ProcessRequest = {
  [K in ToolId]: { tool: K; file: File; options: ToolOptionsMap[K] };
}[ToolId];

export interface SourceImage {
  id: string;
  file: File;
  name: string;
  size: number;
  mime: string;
  /** null when the MIME type is not one of the four supported formats. */
  format: ImageFormat | null;
  width: number;
  height: number;
  objectUrl: string;
}

export interface ProcessedImage {
  blob: Blob;
  size: number;
  mime: string;
  format: ImageFormat | null;
}
