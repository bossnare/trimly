"use client";

import { useState } from "react";
import { Slider } from "@/components/ui/slider";
import { QUALITY } from "@/features/images/constants";

export function QualityDemo() {
  const [value, setValue] = useState<number>(QUALITY.default);
  const label = value >= 90 ? "High" : value >= 70 ? "Balanced" : "Small";
  return (
    <div className="flex flex-col gap-1.5 rounded-2xl border border-border bg-background p-5">
      <div className="flex items-baseline justify-between">
        <span className="font-heading text-6xl leading-none font-extrabold tracking-[-0.04em]">{value}%</span>
        <span className="font-semibold text-brand">{label}</span>
      </div>
      <Slider id="quality-demo" value={value} min={QUALITY.min} max={QUALITY.max} onValueChange={setValue} />
      <label htmlFor="quality-demo" className="sr-only">
        Quality
      </label>
    </div>
  );
}
