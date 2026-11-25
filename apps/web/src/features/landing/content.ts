import { FIT_MODES, FORMATS, MAX_UPLOAD_MB, QUALITY } from "@/features/images/constants";
import type { ToolId } from "@/features/images/types";

export const NAV_LINKS = [
  { href: "#tools", label: "Tools" },
  { href: "#how", label: "How it works" },
  { href: "#numbers", label: "Limits" },
] as const;

export interface DemoData {
  fields: readonly { label: string; value: string }[];
  from: string;
  to: string;
  saved: string;
  download: string;
}

/** Sample results shown in the hero window. Illustrative, not measured. */
export const DEMO: Record<ToolId, DemoData> = {
  resize: {
    fields: [
      { label: "Width", value: "1920 px" },
      { label: "Height", value: "1440 px" },
      { label: "Fit mode", value: "Cover" },
      { label: "Prevent enlargement", value: "On" },
    ],
    from: "4032 × 3024 px",
    to: "1920 × 1440 px",
    saved: "0.9 MB, −63%",
    download: "Download image",
  },
  convert: {
    fields: [
      { label: "Output format", value: "WebP" },
      { label: "Quality", value: "80%" },
    ],
    from: "2.4 MB",
    to: "1.3 MB",
    saved: "−46%",
    download: "Download WebP",
  },
  compress: {
    fields: [
      { label: "Format", value: "Kept as JPEG" },
      { label: "Quality", value: "80%" },
    ],
    from: "2.4 MB",
    to: "640 KB",
    saved: "−73%",
    download: "Download image",
  },
  removeBackground: {
    fields: [
      { label: "Replace with", value: "Transparent" },
      { label: "Output", value: "PNG" },
    ],
    from: "2.4 MB",
    to: "1.8 MB",
    saved: "−25%",
    download: "Download PNG",
  },
};

export const STEPS = [
  { title: "Add your image", text: `Drop a file or paste a link. PNG, JPEG, WebP and AVIF work, up to ${MAX_UPLOAD_MB} MB.` },
  { title: "Adjust and compare", text: "Pick a tool, change the settings and drag the slider to compare with the original." },
  { title: "Download", text: "Save the result. It keeps your file name with a Trimly suffix." },
] as const;

/** Derived from the same constants the editor uses, so the page can't drift from the product. */
export const FACTS = [
  { value: String(FORMATS.length), label: "image formats" },
  { value: String(FIT_MODES.length), label: "fit modes" },
  { value: `${QUALITY.default}%`, label: "default quality" },
  { value: `${MAX_UPLOAD_MB} MB`, label: "per image" },
] as const;
