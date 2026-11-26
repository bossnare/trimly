"use client";

import { FileImage } from "lucide-react";
import { PreviewImage } from "@/components/shared/preview-image";
import { useEditor } from "../../state/editor-context";

export function ReadyStage() {
  const { state } = useEditor();
  const source = state.source;
  if (!source) return null;

  return (
    <div className="flex flex-col gap-3">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl border border-input bg-muted">
        <PreviewImage src={source.objectUrl} alt={`Original image: ${source.name}`} />
      </div>
      <div className="flex min-w-0 items-center gap-3 rounded-xl border border-input bg-card px-4 py-3">
        <FileImage aria-hidden className="size-5 shrink-0 text-brand" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold">{source.name}</p>
          <p className="text-xs text-muted-foreground">
            {source.width} × {source.height} px · {(source.size / 1024 / 1024).toFixed(2)} MB
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-muted-foreground">Ready</span>
      </div>
    </div>
  );
}
