"use client";

import { SegmentedControl, type SegmentedOption } from "@/components/ui/segmented-control";
import type { BackgroundFill } from "@/features/images/types";
import { useEditor } from "../../state/editor-context";
import { Note } from "./note";
import { OutputSummary } from "./output-summary";

const FILL_OPTIONS: readonly SegmentedOption<BackgroundFill>[] = [
  { value: "transparent", label: "Transparent" },
  { value: "white", label: "White" },
  { value: "custom", label: "Custom" },
];

const FILL_SUMMARY: Record<BackgroundFill, string> = {
  transparent: "transparent background",
  white: "white background",
  custom: "custom background",
};

export function RemoveBackgroundOptions() {
  const { state, actions } = useEditor();
  const options = state.options.removeBackground;

  return (
    <div className="flex flex-col gap-5">
      <div className="space-y-2">
        <span className="block text-sm font-semibold">Replace background with</span>
        <SegmentedControl
          ariaLabel="Background fill"
          value={options.fill}
          options={FILL_OPTIONS}
          onValueChange={(fill) => actions.patchOptions("removeBackground", { fill })}
        />
      </div>
      {options.fill === "custom" && (
        <div className="flex items-center gap-3">
          <input
            id="bg-color"
            type="color"
            value={options.color}
            aria-label="Background color"
            onChange={(event) => actions.patchOptions("removeBackground", { color: event.target.value })}
            className="size-11 cursor-pointer rounded-md border border-input bg-background p-0.5"
          />
          <label htmlFor="bg-color" className="text-sm text-muted-foreground">
            {options.color}
          </label>
        </div>
      )}
      <Note>Exported as PNG so transparency is kept.</Note>
      <OutputSummary text={`PNG, ${FILL_SUMMARY[options.fill]}`} />
    </div>
  );
}
