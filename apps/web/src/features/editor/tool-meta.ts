import { Minimize2, RefreshCw, Scaling, Sparkles, type LucideIcon } from "lucide-react";
import type { ToolId } from "@/features/images/types";

export interface ToolMeta {
  id: ToolId;
  label: string;
  /** Heading shown in the inspector. */
  title: string;
  icon: LucideIcon;
  description: string;
}

export const TOOLS: readonly ToolMeta[] = [
  { id: "resize", label: "Resize", title: "Resize image", icon: Scaling, description: "Set exact dimensions with five fit modes, from crop to contain." },
  { id: "convert", label: "Convert", title: "Convert format", icon: RefreshCw, description: "Switch between JPEG, PNG, WebP and AVIF in a click." },
  { id: "compress", label: "Compress", title: "Compress image", icon: Minimize2, description: "Shrink file size, keep your original format and choose the quality." },
  { id: "removeBackground", label: "Remove background", title: "Remove background", icon: Sparkles, description: "Cut out the subject and keep a transparent background." },
];

export const TOOL_BY_ID: Record<ToolId, ToolMeta> = Object.fromEntries(TOOLS.map((t) => [t.id, t])) as Record<ToolId, ToolMeta>;
