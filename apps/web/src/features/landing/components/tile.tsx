import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface TileProps {
  title: string;
  description: string;
  children: ReactNode;
  className?: string;
}

/** One cell of the tools grid. */
export function Tile({ title, description, children, className }: TileProps) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-5 overflow-hidden rounded-xl border border-border bg-card p-6 sm:p-7", className)}>
      <div className="space-y-2">
        <h3 className="font-heading text-[28px] font-semibold tracking-[-0.03em]">{title}</h3>
        <p className="max-w-[480px] leading-relaxed text-muted-foreground">{description}</p>
      </div>
      {children}
    </div>
  );
}
