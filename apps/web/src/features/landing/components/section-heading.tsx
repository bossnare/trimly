import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export function SectionHeading({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h2 className={cn("text-gradient font-heading text-[clamp(34px,5vw,56px)] leading-none font-extrabold tracking-[-0.04em]", className)}>
      {children}
    </h2>
  );
}
