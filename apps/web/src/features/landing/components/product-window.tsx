"use client";

import { useState } from "react";
import { CompareSlider } from "@/components/shared/compare-slider";
import { SampleScene } from "@/components/shared/sample-scene";
import { buttonVariants } from "@/components/ui/button";
import { TOOLS } from "@/features/editor/tool-meta";
import type { ToolId } from "@/features/images/types";
import { cn } from "@/lib/utils/cn";
import { DEMO } from "../content";

/** Interactive product shot: tabs and the before/after slider really work. */
export function ProductWindow() {
  const [tool, setTool] = useState<ToolId>("removeBackground");
  const demo = DEMO[tool];
  const isCutout = tool === "removeBackground";

  return (
    <section className="relative mx-auto max-w-[1080px] px-5 pt-[72px] md:px-8" aria-label="Product preview">
      <div aria-hidden className="glow pointer-events-none absolute top-10 left-1/2 h-[520px] w-[900px] max-w-full -translate-x-1/2" />
      <div className="relative rounded-[28px] border border-input bg-card p-2">
        <div className="overflow-hidden rounded-[20px] border border-border bg-background">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-3 pt-1.5">
            <div role="tablist" aria-label="Tools" className="flex flex-wrap">
              {TOOLS.map(({ id, label }) => (
                <button
                  key={id}
                  role="tab"
                  type="button"
                  aria-selected={tool === id}
                  onClick={() => setTool(id)}
                  className={cn(
                    "min-h-12 cursor-pointer border-b-2 px-3.5 text-[15px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-ring",
                    tool === id ? "border-brand text-foreground" : "border-transparent text-muted-foreground hover:text-foreground",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <span className="px-2 text-sm text-muted-foreground">sunset-vase.jpg</span>
          </div>
          <div role="tabpanel" className="flex flex-wrap gap-5 p-5 text-left">
            <div className="min-w-0 flex-[1.6_1_380px]">
              <CompareSlider
                className="rounded-2xl border border-input"
                before={<SampleScene />}
                after={<SampleScene variant={isCutout ? "cutout" : "full"} />}
                checkerboardAfter={isCutout}
              />
            </div>
            <dl className="flex min-w-0 flex-[1_1_240px] flex-col gap-2.5">
              {demo.fields.map((field) => (
                <div key={field.label} className="flex flex-col gap-1 rounded-xl border border-border bg-card px-3.5 py-3">
                  <dt className="text-[13px] text-muted-foreground">{field.label}</dt>
                  <dd className="font-semibold">{field.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-5 py-3.5 text-left">
            <p className="flex flex-wrap items-baseline gap-2.5">
              <span className="text-muted-foreground">{demo.from}</span>
              <span aria-hidden className="text-muted-foreground">
                to
              </span>
              <span className="font-heading text-2xl font-semibold tracking-tight">{demo.to}</span>
              <span className="text-sm font-semibold text-brand">{demo.saved}</span>
            </p>
            <span aria-hidden className={buttonVariants({ size: "sm" })}>
              {demo.download}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
