"use client";

import { PreviewImage } from "@/components/shared/preview-image";
import { Spinner } from "@/components/ui/spinner";
import { TOOL_BY_ID } from "../../tool-meta";
import { useEditor } from "../../state/editor-context";

export function ProcessingStage() {
  const { state } = useEditor();
  if (!state.source) return null;
  return (
    <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-input bg-muted">
      <PreviewImage src={state.source.objectUrl} alt={`Original image: ${state.source.name}`} />
      <div role="status" className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/60 text-white">
        <Spinner className="size-9" />
        <span className="font-semibold">Processing…</span>
        <span className="text-sm opacity-85">{TOOL_BY_ID[state.tool].title}</span>
      </div>
    </div>
  );
}
