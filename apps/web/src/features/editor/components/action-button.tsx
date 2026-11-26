"use client";

import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { useDownload } from "../hooks/use-download";
import { ACTION_LABEL } from "../action-labels";
import { useEditor } from "../state/editor-context";
import { useImport } from "../state/import-context";
import { useProcessing } from "../state/processing-context";

/** The primary action is explicit: importing only prepares the image. */
export function ActionButton() {
  const { state } = useEditor();
  const { phase, process, retry, validationMessage } = useProcessing();
  const { openFilePicker } = useImport();
  const { canDownload, download, label } = useDownload();

  const config = {
    empty: { text: ACTION_LABEL[state.tool], hint: "Choose an image to prepare it for processing.", onClick: openFilePicker, disabled: false },
    ready: { text: ACTION_LABEL[state.tool], hint: "Your image is ready. Start processing when you're happy with the settings.", onClick: process, disabled: Boolean(validationMessage) },
    processing: { text: "Processing…", hint: "This takes a few seconds.", onClick: undefined, disabled: true },
    error: { text: "Try again", hint: "Something went wrong with the last attempt.", onClick: retry, disabled: false },
    result: {
      text: label,
      hint: "Your processed image is ready to download.",
      onClick: download,
      disabled: !canDownload,
    },
  }[phase];

  return (
    <div className="flex flex-col gap-2.5">
      <Button size="lg" className="w-full" isLoading={phase === "processing"} disabled={config.disabled} onClick={config.onClick}>
        {config.text}
      </Button>
      {validationMessage && phase === "ready" ? (
        <Alert tone="error">{validationMessage}</Alert>
      ) : (
        <p className="text-sm text-muted-foreground">{config.hint}</p>
      )}
    </div>
  );
}
