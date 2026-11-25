import { cn } from "@/lib/utils/cn";

interface SliderProps {
  id: string;
  value: number;
  min: number;
  max: number;
  onValueChange: (value: number) => void;
  className?: string;
}

export function Slider({ id, value, min, max, onValueChange, className }: SliderProps) {
  return (
    <input
      id={id}
      type="range"
      min={min}
      max={max}
      value={value}
      onChange={(e) => onValueChange(Number(e.target.value))}
      className={cn("h-8 w-full cursor-pointer accent-primary", className)}
    />
  );
}
