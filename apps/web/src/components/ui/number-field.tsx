import { useId } from "react";
import { cn } from "@/lib/utils/cn";

interface NumberFieldProps {
  label: string;
  value: number | null;
  onValueChange: (value: number | null) => void;
  min?: number;
  max?: number;
  placeholder?: string;
  invalid?: boolean;
  className?: string;
}

export function NumberField({ label, value, onValueChange, min, max, placeholder, invalid, className }: NumberFieldProps) {
  const id = useId();
  return (
    <div className={cn("min-w-0 flex-1", className)}>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-muted-foreground">
        {label}
      </label>
      <input
        id={id}
        type="number"
        inputMode="numeric"
        min={min}
        max={max}
        value={value ?? ""}
        placeholder={placeholder}
        aria-invalid={invalid || undefined}
        onChange={(e) => onValueChange(e.target.value === "" ? null : Number(e.target.value))}
        className={cn(
          "h-11 w-full rounded-md border border-input bg-background px-3 text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring",
          invalid && "border-destructive",
        )}
      />
    </div>
  );
}
