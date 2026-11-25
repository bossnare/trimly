import { useId } from "react";
import { Slider } from "@/components/ui/slider";
import { QUALITY, QUALITY_PRESETS } from "@/features/images/constants";
import { cn } from "@/lib/utils/cn";

function qualityHint(value: number): string {
  if (value >= 90) return "Best quality, larger file.";
  if (value >= 70) return "Good balance of size and quality.";
  return "Smallest file, some visible quality loss.";
}

interface QualityFieldProps {
  value: number;
  onChange: (value: number) => void;
}

export function QualityField({ value, onChange }: QualityFieldProps) {
  const id = useId();
  return (
    <div className="space-y-2">
      <div className="flex items-baseline justify-between">
        <label htmlFor={id} className="text-sm font-semibold">
          Quality
        </label>
        <span className="font-heading text-3xl font-extrabold tracking-tight">{value}%</span>
      </div>
      <Slider id={id} value={value} min={QUALITY.min} max={QUALITY.max} onValueChange={onChange} />
      <div className="flex justify-between text-sm text-muted-foreground">
        <span>Smaller file</span>
        <span>Better quality</span>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {QUALITY_PRESETS.map((preset) => (
          <button
            key={preset.value}
            type="button"
            aria-pressed={value === preset.value}
            onClick={() => onChange(preset.value)}
            className={cn(
              "min-h-11 cursor-pointer rounded-full border px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
              value === preset.value ? "border-brand bg-muted" : "border-input hover:bg-accent",
            )}
          >
            {preset.label} {preset.value}
          </button>
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{qualityHint(value)}</p>
    </div>
  );
}
