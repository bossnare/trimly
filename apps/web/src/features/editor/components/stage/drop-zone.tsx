"use client";

import { Upload } from "lucide-react";
import { useState, type DragEvent } from "react";
import { Button } from "@/components/ui/button";
import { MAX_UPLOAD_MB } from "@/features/images/constants";
import { cn } from "@/lib/utils/cn";
import { useImport } from "../../state/import-context";

export function DropZone() {
  const { importFile, openFilePicker, isImporting } = useImport();
  const [dragging, setDragging] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setDragging(false);
    const files = Array.from(event.dataTransfer.files);
    const first = files[0];
    if (!first) return;
    setNotice(files.length > 1 ? "Only the first image was used." : null);
    importFile(first);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={cn(
        "flex min-h-[420px] flex-col items-center justify-center gap-3.5 rounded-xl border-[1.5px] border-dashed bg-card p-8 text-center transition-colors",
        dragging ? "border-brand bg-muted" : "border-input",
      )}
    >
      <div className="flex size-14 items-center justify-center rounded-full border border-input text-brand">
        <Upload aria-hidden className="size-6" />
      </div>
      <h1 className="font-heading text-4xl leading-tight font-extrabold tracking-tight">Drop an image to start.</h1>
      <p className="text-muted-foreground">Or choose a file from your device.</p>
      <Button size="lg" onClick={openFilePicker} isLoading={isImporting}>
        Choose file
      </Button>
      <p className="text-sm text-muted-foreground">PNG, JPEG, WebP and AVIF, up to {MAX_UPLOAD_MB} MB.</p>
      {notice && (
        <p role="status" className="text-sm text-muted-foreground">
          {notice}
        </p>
      )}
    </div>
  );
}
