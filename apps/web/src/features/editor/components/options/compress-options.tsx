"use client";

import { Lock } from "lucide-react";
import { formatLabel, supportsQuality } from "@/features/images/utils/format-utils";
import { useEditor } from "../../state/editor-context";
import { Note } from "./note";
import { OutputSummary } from "./output-summary";
import { QualityField } from "./quality-field";

export function CompressOptions() {
  const { state, actions } = useEditor();
  const { source } = state;
  const options = state.options.compress;
  const format = source?.format ?? null;
  const known = source !== null && format !== null;
  const hasQuality = supportsQuality(format);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3 rounded-lg border border-border p-3.5">
        <Lock aria-hidden className="size-[18px] text-brand" />
        <div>
          <p className="font-semibold">{known ? `Format kept as ${formatLabel(format)}` : "Original format kept"}</p>
          <p className="text-sm text-muted-foreground">Compression never changes the file type.</p>
        </div>
      </div>
      {hasQuality ? (
        <QualityField value={options.quality} onChange={(quality) => actions.patchOptions("compress", { quality })} />
      ) : (
        <Note title="PNG is lossless.">Your image keeps every pixel, so there is no quality slider.</Note>
      )}
      {!source && (
        <Note>Quality applies to JPEG, WebP and AVIF. PNG files are compressed losslessly, with no quality setting.</Note>
      )}
      <OutputSummary text={`${known ? formatLabel(format) : "Original format"}${hasQuality ? `, quality ${options.quality}%` : ", lossless"}`} />
    </div>
  );
}
