import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TooltipProps {
  content: string;
  children: ReactNode;
  className?: string;
}

/** CSS-only tooltip: shows on hover and keyboard focus of the wrapped control. */
export function Tooltip({ content, children, className }: TooltipProps) {
  return (
    <span className={cn("group/tooltip relative inline-flex", className)}>
      {children}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md bg-foreground px-3 py-2 text-xs leading-snug font-medium text-background opacity-0 transition-opacity group-focus-within/tooltip:opacity-100 group-hover/tooltip:opacity-100"
      >
        {content}
      </span>
    </span>
  );
}
