"use client";

import { CompareSlider } from "@/components/shared/compare-slider";
import { PreviewImage } from "@/components/shared/preview-image";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { computeSavings } from "@/features/images/utils/savings";
import { formatBytes } from "@/lib/utils/format";
import { useEditor } from "../../state/editor-context";
import { useProcessing } from "../../state/processing-context";

export function ResultStage() {
  const { state } = useEditor();
  const { result, resultUrl, isUpdating, validationMessage } = useProcessing();
  const { source } = state;
  if (!source) return null;

  // Invalid settings and nothing processed yet: show the original with the reason.
  if (!result || !resultUrl) {
    return (
      <div className="flex flex-col gap-4">
        <div className="aspect-[4/3] overflow-hidden rounded-xl border border-input bg-muted">
          <PreviewImage src={source.objectUrl} alt={`Original image: ${source.name}`} />
        </div>
        {validationMessage && <Alert tone="error">{validationMessage}</Alert>}
      </div>
    );
  }

  const savings = computeSavings(source.size, result.size);
  const isCutout = state.tool === "removeBackground" && state.options.removeBackground.fill === "transparent";

  return (
    <div className="flex flex-col gap-4">
      <CompareSlider
        className="rounded-xl border border-input"
        before={<PreviewImage src={source.objectUrl} alt={`Original image: ${source.name}`} />}
        after={<PreviewImage src={resultUrl} alt="Processed result" />}
        checkerboardAfter={isCutout}
        overlay={
          isUpdating ? (
            <span role="status" className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-white">
              Updating…
            </span>
          ) : null
        }
      />
      {/* On small screens the sticky bar carries these numbers. */}
      <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 rounded-full border border-input bg-card px-5 py-3 max-lg:hidden">
        <span className="text-muted-foreground">{formatBytes(source.size)}</span>
        <span aria-hidden className="text-muted-foreground">
          to
        </span>
        <span className="font-heading text-xl font-semibold tracking-tight">{formatBytes(result.size)}</span>
        <Badge tone={savings.kind === "larger" ? "warning" : "accent"}>{savings.label}</Badge>
      </div>
    </div>
  );
}
