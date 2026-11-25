import { env } from "@/config/env";
import type {
  FitMode,
  ImageFormat,
  ToolOptionsMap,
} from "./types";

export const MAX_UPLOAD_MB = env.NEXT_PUBLIC_MAX_UPLOAD_MB;
export const MAX_UPLOAD_BYTES = MAX_UPLOAD_MB * 1024 * 1024;

export const DIMENSION_LIMITS = { min: 1, max: 16_384 } as const;
export const QUALITY = { min: 1, max: 100, default: 80 } as const;

export const QUALITY_PRESETS = [
  { label: "Small", value: 60 },
  { label: "Balanced", value: 80 },
  { label: "High", value: 90 },
] as const;

export interface FormatInfo {
  id: ImageFormat;
  label: string;
  mime: string;
  extension: string;
  note: string;
  /** false for lossless formats: no quality slider is shown. */
  supportsQuality: boolean;
}

export const FORMATS: readonly FormatInfo[] = [
  { id: "jpeg", label: "JPEG", mime: "image/jpeg", extension: "jpg", note: "Photos, works everywhere", supportsQuality: true },
  { id: "png", label: "PNG", mime: "image/png", extension: "png", note: "Lossless, keeps transparency", supportsQuality: false },
  { id: "webp", label: "WebP", mime: "image/webp", extension: "webp", note: "Smaller files for the web", supportsQuality: true },
  { id: "avif", label: "AVIF", mime: "image/avif", extension: "avif", note: "Smallest, newest format", supportsQuality: true },
];

export const ACCEPTED_MIME_TYPES = FORMATS.map((f) => f.mime);
export const ACCEPT_ATTRIBUTE = ACCEPTED_MIME_TYPES.join(",");

export interface FitModeInfo {
  id: FitMode;
  label: string;
  description: string;
  /** Mini diagram geometry in a 64×48 viewBox. The target box is always (14, 10, 36, 28). */
  diagram: { image: [x: number, y: number, w: number, h: number]; boxFilled: boolean; dashed: boolean };
}

export const FIT_MODES: readonly FitModeInfo[] = [
  {
    id: "cover",
    label: "Cover",
    description: "Fills the whole box and crops anything that overflows. The output is exactly the size you set.",
    diagram: { image: [8, 10, 48, 28], boxFilled: false, dashed: false },
  },
  {
    id: "contain",
    label: "Contain",
    description: "Fits the whole image inside the box and adds empty margins to reach the exact size.",
    diagram: { image: [14, 17, 36, 14], boxFilled: true, dashed: false },
  },
  {
    id: "fill",
    label: "Fill",
    description: "Stretches the image to the exact size and ignores its proportions, so it may look distorted.",
    diagram: { image: [14, 10, 36, 28], boxFilled: true, dashed: false },
  },
  {
    id: "inside",
    label: "Inside",
    description: "Shrinks the image to fit within the box and keeps its proportions. Nothing is cropped or padded.",
    diagram: { image: [14, 17, 36, 14], boxFilled: false, dashed: true },
  },
  {
    id: "outside",
    label: "Outside",
    description: "Scales the image until it covers the box and keeps its proportions. One side can end up larger than the box.",
    diagram: { image: [6, 5, 52, 38], boxFilled: false, dashed: true },
  },
];

export const DEFAULT_OPTIONS: ToolOptionsMap = {
  resize: { width: null, height: null, fit: "cover", withoutEnlargement: true },
  convert: { format: "webp", quality: QUALITY.default },
  compress: { quality: QUALITY.default },
  removeBackground: { fill: "transparent", color: "#0c8477" },
};

/** Default width used when an image is loaded (never enlarge past the source). */
export const DEFAULT_RESIZE_WIDTH = 1920;
