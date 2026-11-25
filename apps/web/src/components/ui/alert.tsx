import { CircleAlert, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

interface AlertProps {
  tone?: "error" | "info";
  title?: string;
  children: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function Alert({ tone = "info", title, children, action, className }: AlertProps) {
  const Icon = tone === "error" ? CircleAlert : Info;
  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex flex-col flex-wrap items-start gap-3 rounded-lg border p-4 text-sm md:flex-row",
        tone === "error" ? "border-destructive/40 bg-destructive/10" : "border-border bg-muted",
        className,
      )}
    >
      <Icon
        aria-hidden
        className={cn(
          "mt-0.5 size-5 shrink-0",
          tone === "error" ? "text-destructive" : "text-accent-foreground",
        )}
      />
      <div className="flex-1 min-w-0 space-y-1">
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-muted-foreground">{children}</div>
      </div>
      {action}
    </div>
  );
}
