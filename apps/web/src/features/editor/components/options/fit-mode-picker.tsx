import { FitDiagram } from "@/components/shared/fit-diagram";
import { Tooltip } from "@/components/ui/tooltip";
import { FIT_MODES } from "@/features/images/constants";
import type { FitMode } from "@/features/images/types";
import { cn } from "@/lib/utils/cn";
import { Note } from "./note";

interface FitModePickerProps {
  value: FitMode;
  onChange: (mode: FitMode) => void;
}

export function FitModePicker({ value, onChange }: FitModePickerProps) {
  const active = FIT_MODES.find((mode) => mode.id === value) ?? FIT_MODES[0];
  return (
    <fieldset className="space-y-2.5">
      <legend className="mb-2 text-sm font-semibold">Fit mode</legend>
      <div className="flex flex-wrap gap-2">
        {FIT_MODES.map((mode) => (
          <Tooltip key={mode.id} content={mode.description} className="flex-1 basis-[84px]">
            <button
              type="button"
              aria-pressed={mode.id === value}
              onClick={() => onChange(mode.id)}
              className={cn(
                "flex min-h-11 w-full cursor-pointer flex-col items-center gap-1 rounded-lg border px-1.5 py-2 text-[13px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                mode.id === value ? "border-brand bg-muted" : "border-border hover:bg-accent",
              )}
            >
              <FitDiagram diagram={mode.diagram} />
              {mode.label}
            </button>
          </Tooltip>
        ))}
      </div>
      {active && <Note title={`${active.label}.`}>{active.description}</Note>}
    </fieldset>
  );
}
