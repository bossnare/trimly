"use client";

import { useState } from "react";
import { FitDiagram } from "@/components/shared/fit-diagram";
import { FIT_MODES } from "@/features/images/constants";
import type { FitMode } from "@/features/images/types";
import { cn } from "@/lib/utils/cn";

export function FitDemo() {
  const [fit, setFit] = useState<FitMode>("cover");
  const active = FIT_MODES.find((mode) => mode.id === fit) ?? FIT_MODES[0];
  return (
    <div className="flex flex-col gap-3.5 rounded-2xl border border-border bg-background p-4">
      <div className="flex flex-wrap gap-2">
        {FIT_MODES.map((mode) => (
          <button
            key={mode.id}
            type="button"
            aria-pressed={mode.id === fit}
            onClick={() => setFit(mode.id)}
            className={cn(
              "flex min-h-11 flex-[1_1_84px] cursor-pointer flex-col items-center gap-1 rounded-xl border px-1.5 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              mode.id === fit ? "border-brand bg-muted" : "border-border",
            )}
          >
            <FitDiagram diagram={mode.diagram} />
            {mode.label}
          </button>
        ))}
      </div>
      {active && (
        <p className="text-[15px] leading-normal text-muted-foreground">
          <strong className="text-foreground">{active.label}.</strong> {active.description}
        </p>
      )}
    </div>
  );
}
