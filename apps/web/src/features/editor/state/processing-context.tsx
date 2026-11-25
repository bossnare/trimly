"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useObjectUrl } from "@/features/images/hooks/use-object-url";
import { useProcessImage } from "@/features/images/hooks/use-process-image";
import type { ProcessedImage } from "@/features/images/types";
import type { ApiError } from "@/lib/http/errors";
import { useEditor } from "./editor-context";
import { deriveEditorPhase, type EditorPhase } from "./editor-phase";

interface ProcessingContextValue {
  phase: EditorPhase;
  result: ProcessedImage | undefined;
  resultUrl: string | undefined;
  isUpdating: boolean;
  error: ApiError | null;
  validationMessage: string | null;
  retry: () => void;
}

const ProcessingContext = createContext<ProcessingContextValue | null>(null);

/** Single subscription to the processing query, shared by every component below it. */
export function ProcessingProvider({ children }: { children: ReactNode }) {
  const { state } = useEditor();
  const processing = useProcessImage({
    source: state.source,
    tool: state.tool,
    options: state.options[state.tool],
  });
  const resultUrl = useObjectUrl(processing.result?.blob);

  const value = useMemo<ProcessingContextValue>(
    () => ({
      phase: deriveEditorPhase({
        hasSource: state.source !== null,
        hasResult: processing.result !== undefined && resultUrl !== undefined,
        isProcessing: processing.isProcessing,
        hasError: processing.error !== null,
        hasValidationIssue: processing.validationMessage !== null,
      }),
      result: processing.result,
      resultUrl,
      isUpdating: processing.isUpdating,
      error: processing.error,
      validationMessage: processing.validationMessage,
      retry: processing.retry,
    }),
    [state.source, processing, resultUrl],
  );

  return <ProcessingContext.Provider value={value}>{children}</ProcessingContext.Provider>;
}

export function useProcessing(): ProcessingContextValue {
  const context = useContext(ProcessingContext);
  if (!context) throw new Error("useProcessing must be used inside <ProcessingProvider>");
  return context;
}
