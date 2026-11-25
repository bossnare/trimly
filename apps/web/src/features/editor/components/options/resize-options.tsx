"use client";

import { Collapsible } from "@/components/ui/collapsible";
import { Switch } from "@/components/ui/switch";
import { validateOptions } from "@/features/images/schemas";
import { linkedDimension } from "@/features/images/utils/dimensions";
import { useEditor } from "../../state/editor-context";
import { DimensionFields } from "./dimension-fields";
import { FitModePicker } from "./fit-mode-picker";
import { OutputSummary } from "./output-summary";

export function ResizeOptions() {
  const { state, actions } = useEditor();
  const { source, lockAspect } = state;
  const options = state.options.resize;
  const ratio = source ? source.height / source.width : null;
  const validation = validateOptions("resize", options);

  const changeWidth = (width: number | null) =>
    actions.patchOptions("resize", { width, ...(lockAspect && ratio ? { height: linkedDimension(width, ratio) } : {}) });
  const changeHeight = (height: number | null) =>
    actions.patchOptions("resize", { height, ...(lockAspect && ratio ? { width: linkedDimension(height, 1 / ratio) } : {}) });

  const summary = `${options.width ?? "auto"} × ${options.height ?? "auto"} px, ${options.fit}${
    options.withoutEnlargement ? ", no enlarging" : ""
  }`;

  return (
    <div className="flex flex-col gap-5">
      <DimensionFields
        width={options.width}
        height={options.height}
        locked={lockAspect}
        originalLabel={source ? `${source.width} × ${source.height}` : undefined}
        invalid={!validation.valid}
        onWidthChange={changeWidth}
        onHeightChange={changeHeight}
        onToggleLock={() => actions.setLockAspect(!lockAspect)}
      />
      {!validation.valid && (
        <p role="alert" className="text-sm text-destructive">
          {validation.message}
        </p>
      )}
      <FitModePicker value={options.fit} onChange={(fit) => actions.patchOptions("resize", { fit })} />
      <Collapsible title="Advanced options">
        <div className="flex items-center justify-between gap-4 py-2">
          <div className="space-y-0.5">
            <p className="font-medium">Prevent enlargement</p>
            <p className="text-sm text-muted-foreground">Images smaller than the target keep their original size.</p>
          </div>
          <Switch
            label="Prevent enlargement"
            checked={options.withoutEnlargement}
            onCheckedChange={(withoutEnlargement) => actions.patchOptions("resize", { withoutEnlargement })}
          />
        </div>
      </Collapsible>
      <OutputSummary text={summary} />
    </div>
  );
}
