import { useCallback } from "react";
import { buildOutputFilename, downloadBlob } from "@/features/images/utils/download";
import { downloadLabel } from "../action-labels";
import { useEditor } from "../state/editor-context";
import { useProcessing } from "../state/processing-context";

export function useDownload() {
  const { state } = useEditor();
  const { result } = useProcessing();
  const { source, tool } = state;

  const download = useCallback(() => {
    if (!source || !result) return;
    downloadBlob(result.blob, buildOutputFilename(source.name, tool, result.format));
  }, [source, result, tool]);

  return { canDownload: Boolean(source && result), download, label: downloadLabel(tool, result?.format ?? null) };
}
