import type { ReactNode } from "react";

/** Quiet explanatory block used by every options panel. */
export function Note({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="rounded-lg bg-muted p-3.5 text-sm leading-relaxed text-muted-foreground">
      {title && <strong className="text-foreground">{title} </strong>}
      {children}
    </div>
  );
}
