import { FORMATS } from "@/features/images/constants";
import type { ImageFormat } from "@/features/images/types";
import { cn } from "@/lib/utils/cn";

interface FormatPickerProps {
  value: ImageFormat;
  onChange: (format: ImageFormat) => void;
}

export function FormatPicker({ value, onChange }: FormatPickerProps) {
  return (
    <div role="radiogroup" aria-label="Output format" className="space-y-2">
      <span className="block text-sm font-semibold">Output format</span>
      <div className="flex flex-wrap gap-2">
        {FORMATS.map((format) => {
          const selected = format.id === value;
          return (
            <button
              key={format.id}
              type="button"
              role="radio"
              aria-checked={selected}
              onClick={() => onChange(format.id)}
              className={cn(
                "flex min-h-11 flex-1 basis-[130px] cursor-pointer flex-col gap-0.5 rounded-lg border px-3 py-2.5 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
                selected ? "border-primary bg-primary text-primary-foreground" : "border-input hover:bg-accent",
              )}
            >
              <span className="font-semibold">{format.label}</span>
              <span className={cn("text-xs", selected ? "opacity-80" : "text-muted-foreground")}>{format.note}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
