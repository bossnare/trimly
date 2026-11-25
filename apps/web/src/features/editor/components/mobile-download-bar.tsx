"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { computeSavings } from "@/features/images/utils/savings";
import { formatBytes } from "@/lib/utils/format";
import { useDownload } from "../hooks/use-download";
import { useEditor } from "../state/editor-context";
import { useProcessing } from "../state/processing-context";

/** Sticky bottom bar (small screens only) so Download is always one tap away. */
export function MobileDownloadBar() {
  const { state } = useEditor();
  const { phase, result } = useProcessing();
  const { canDownload, download, label } = useDownload();
  if (phase !== "result" || !result || !state.source) return null;

  const savings = computeSavings(state.source.size, result.size);
  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-between gap-3 border-t border-input bg-card px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:hidden">
      <div className="flex flex-col gap-1">
        <Badge tone={savings.kind === "larger" ? "warning" : "accent"} className="w-fit">
          {savings.label}
        </Badge>
        <span className="text-sm text-muted-foreground">
          {formatBytes(state.source.size)} to {formatBytes(result.size)}
        </span>
      </div>
      <Button size="lg" onClick={download} disabled={!canDownload}>
        {label}
      </Button>
    </div>
  );
}
