export type EditorPhase = "empty" | "ready" | "processing" | "result" | "error";

interface PhaseInput {
  hasSource: boolean;
  hasResult: boolean;
  isProcessing: boolean;
  hasError: boolean;
}

/** Derives the visible stage from the current image and explicit processing request. */
export function deriveEditorPhase({ hasSource, hasResult, isProcessing, hasError }: PhaseInput): EditorPhase {
  if (!hasSource) return "empty";
  if (hasError && !isProcessing) return "error";
  if (isProcessing) return "processing";
  if (hasResult) return "result";
  return "ready";
}
