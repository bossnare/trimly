"use client";

import { getFormatInfo, supportsQuality } from "@/features/images/utils/format-utils";
import { useEditor } from "../../state/editor-context";
import { FormatPicker } from "./format-picker";
import { Note } from "./note";
import { OutputSummary } from "./output-summary";
import { QualityField } from "./quality-field";

export function ConvertOptions() {
  const { state, actions } = useEditor();
  const options = state.options.convert;
  const hasQuality = supportsQuality(options.format);

  return (
    <div className="flex flex-col gap-5">
      <FormatPicker value={options.format} onChange={(format) => actions.patchOptions("convert", { format })} />
      {hasQuality ? (
        <QualityField value={options.quality} onChange={(quality) => actions.patchOptions("convert", { quality })} />
      ) : (
        <Note title="PNG is lossless.">Output keeps every pixel and any transparency, so there is no quality slider.</Note>
      )}
      {options.format === "jpeg" && <Note>JPEG has no transparency, so transparent areas are flattened.</Note>}
      <OutputSummary text={`${getFormatInfo(options.format).label}${hasQuality ? `, quality ${options.quality}%` : ", lossless"}`} />
    </div>
  );
}
