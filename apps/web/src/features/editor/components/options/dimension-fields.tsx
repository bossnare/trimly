import { Link2, Link2Off } from "lucide-react";
import { NumberField } from "@/components/ui/number-field";
import { DIMENSION_LIMITS } from "@/features/images/constants";
import { cn } from "@/lib/utils/cn";

interface DimensionFieldsProps {
  width: number | null;
  height: number | null;
  locked: boolean;
  originalLabel?: string;
  invalid?: boolean;
  onWidthChange: (value: number | null) => void;
  onHeightChange: (value: number | null) => void;
  onToggleLock: () => void;
}

export function DimensionFields({
  width,
  height,
  locked,
  originalLabel,
  invalid,
  onWidthChange,
  onHeightChange,
  onToggleLock,
}: DimensionFieldsProps) {
  const LockIcon = locked ? Link2 : Link2Off;
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <span className="text-sm font-semibold">Dimensions (px)</span>
        {originalLabel && <span className="text-sm text-muted-foreground">Original {originalLabel}</span>}
      </div>
      <div className="flex items-end gap-2">
        <NumberField label="Width" value={width} onValueChange={onWidthChange} min={DIMENSION_LIMITS.min} max={DIMENSION_LIMITS.max} placeholder="Auto" invalid={invalid} />
        <button
          type="button"
          aria-pressed={locked}
          aria-label="Lock aspect ratio"
          onClick={onToggleLock}
          className={cn(
            "flex size-11 shrink-0 cursor-pointer items-center justify-center rounded-md border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
            locked ? "border-brand bg-muted text-brand" : "border-input text-muted-foreground",
          )}
        >
          <LockIcon aria-hidden className="size-[18px]" />
        </button>
        <NumberField label="Height" value={height} onValueChange={onHeightChange} min={DIMENSION_LIMITS.min} max={DIMENSION_LIMITS.max} placeholder="Auto" invalid={invalid} />
      </div>
      <p className="text-sm text-muted-foreground">Leave one side empty to scale proportionally.</p>
    </div>
  );
}
