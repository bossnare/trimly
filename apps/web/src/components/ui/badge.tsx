import { cva, type VariantProps } from "class-variance-authority";
import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils/cn";

const badgeVariants = cva("inline-flex items-center rounded-full px-3 py-1.5 text-sm font-semibold", {
  variants: {
    tone: {
      accent: "bg-accent text-accent-foreground",
      warning: "bg-chart-4/20 text-foreground",
      primary: "bg-primary text-primary-foreground",
    },
  },
  defaultVariants: { tone: "accent" },
});

export function Badge({ className, tone, ...props }: HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
