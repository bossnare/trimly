export type EditorPhase = "empty" | "processing" | "result" | "error";

interface PhaseInput {
  hasSource: boolean;
  hasResult: boolean;
  isProcessing: boolean;
  hasError: boolean;
  hasValidationIssue: boolean;
}

/**
 * The phase is derived, never stored: it can't drift out of sync with the real state.
 * - no image                          -> empty
 * - request failed                    -> error
 * - result on screen                  -> result (even while refreshing: the preview stays visible)
 * - waiting for the first result      -> processing
 * - invalid options and no result yet -> result view with the validation message
 */
export function deriveEditorPhase({ hasSource, hasResult, isProcessing, hasError, hasValidationIssue }: PhaseInput): EditorPhase {
  if (!hasSource) return "empty";
  if (hasError && !isProcessing) return "error";
  if (hasResult || hasValidationIssue) return "result";
  return "processing";
}
