"use client";

import { Button } from "@/components/ui/button";
import { useDownload } from "../hooks/use-download";
import { ACTION_LABEL } from "../action-labels";
import { useEditor } from "../state/editor-context";
import { useImport } from "../state/import-context";
import { useProcessing } from "../state/processing-context";

/** The single main action of the inspector. Its meaning follows the editor phase. */
export function ActionButton() {
  const { state } = useEditor();
  const { phase, retry, validationMessage } = useProcessing();
  const { openFilePicker } = useImport();
  const { canDownload, download, label } = useDownload();

  const config = {
    empty: { text: ACTION_LABEL[state.tool], hint: "Choose an image and Trimly runs this tool on it.", onClick: openFilePicker, disabled: false },
    processing: { text: "Processing…", hint: "This takes a few seconds.", onClick: undefined, disabled: true },
    error: { text: "Try again", hint: "Something went wrong with the last attempt.", onClick: retry, disabled: false },
    result: {
      text: label,
      hint: validationMessage ?? "Ready to download.",
      onClick: download,
      disabled: !canDownload,
    },
  }[phase];

  return (
    <div className="flex flex-col gap-2.5">
      <Button size="lg" className="w-full" isLoading={phase === "processing"} disabled={config.disabled} onClick={config.onClick}>
        {config.text}
      </Button>
      <p className="text-sm text-muted-foreground">{config.hint}</p>
    </div>
  );
}
