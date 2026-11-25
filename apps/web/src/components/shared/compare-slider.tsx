"use client";

import { ChevronsLeftRight } from "lucide-react";
import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface CompareSliderProps {
  before: ReactNode;
  after: ReactNode;
  /** Shows a transparency grid behind the "after" layer (cut-out images). */
  checkerboardAfter?: boolean;
  position?: number;
  defaultPosition?: number;
  onPositionChange?: (position: number) => void;
  /** Rendered on top of everything, e.g. a processing overlay. */
  overlay?: ReactNode;
  className?: string;
}

const tagClass = "absolute top-3 rounded-full bg-black/65 px-3 py-1 text-xs font-semibold text-white";

/**
 * Before/after comparison. Fully keyboard accessible: the native range input sits on top
 * (invisible) so dragging, arrow keys and screen readers all work.
 */
export function CompareSlider({
  before,
  after,
  checkerboardAfter = false,
  position,
  defaultPosition = 50,
  onPositionChange,
  overlay,
  className,
}: CompareSliderProps) {
  const [internal, setInternal] = useState(defaultPosition);
  const value = position ?? internal;

  const update = (next: number) => {
    setInternal(next);
    onPositionChange?.(next);
  };

  return (
    <div
      className={cn(
        "relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted select-none focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-ring",
        className,
      )}
    >
      <div className={cn("absolute inset-0", checkerboardAfter && "checkerboard")}>{after}</div>
      <div className="absolute inset-0 bg-muted" style={{ clipPath: `inset(0 ${100 - value}% 0 0)` }}>
        {before}
      </div>
      <span className={cn(tagClass, "left-3")}>Before</span>
      <span className={cn(tagClass, "right-3")}>After</span>
      <div className="pointer-events-none absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white" style={{ left: `${value}%` }}>
        <div className="absolute top-1/2 left-1/2 flex size-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-neutral-900 shadow-lg">
          <ChevronsLeftRight aria-hidden className="size-5" />
        </div>
      </div>
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        aria-label="Compare before and after"
        onChange={(e) => update(Number(e.target.value))}
        className="absolute inset-0 m-0 h-full w-full cursor-ew-resize opacity-0"
      />
      {overlay}
    </div>
  );
}
