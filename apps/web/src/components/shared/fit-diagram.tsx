import type { FitModeInfo } from "@/features/images/constants";
import { cn } from "@/lib/utils/cn";

/** Tiny diagram showing how an image meets the target box for a given fit mode. */
export function FitDiagram({ diagram, className }: { diagram: FitModeInfo["diagram"]; className?: string }) {
  const [x, y, w, h] = diagram.image;
  return (
    <svg viewBox="0 0 64 48" aria-hidden className={cn("h-9 w-12", className)}>
      <rect x="14" y="10" width="36" height="28" className={diagram.boxFilled ? "fill-muted" : "fill-transparent"} />
      <rect x={x} y={y} width={w} height={h} rx="2" className="fill-brand opacity-85" />
      <rect
        x="14"
        y="10"
        width="36"
        height="28"
        fill="none"
        strokeWidth="1.5"
        className="stroke-muted-foreground"
        strokeDasharray={diagram.dashed ? "3 2" : undefined}
      />
    </svg>
  );
}
