import { useMutation } from "@tanstack/react-query";
import { useEffect, useMemo, useRef } from "react";
import { ApiError, isApiError } from "@/lib/http/errors";
import { processImage } from "../api/images.api";
import { validateOptions } from "../schemas";
import type { ProcessRequest, ProcessedImage, SourceImage, ToolId, ToolOptions } from "../types";

const MAX_RETRIES = 2;

interface Params {
  source: SourceImage | null;
  tool: ToolId;
  options: ToolOptions;
}

interface ProcessingVariables {
  source: SourceImage;
  tool: ToolId;
  options: ToolOptions;
  /** Stable identity for this exact source/tool/options combination. */
  fingerprint: string;
}

function fingerprint(source: SourceImage, tool: ToolId, options: ToolOptions) {
  return JSON.stringify([source.id, tool, options]);
}

/**
 * Explicit processing: importing an image or changing settings never sends a request.
 * The caller must invoke process() from a user action.
 */
export function useProcessImage({ source, tool, options }: Params) {
  const validation = useMemo(() => validateOptions(tool, options as never), [tool, options]);

  const mutation = useMutation<ProcessedImage, Error, ProcessingVariables>({
    mutationFn: ({ source: image, tool: selectedTool, options: selectedOptions }) =>
      processImage({ tool: selectedTool, file: image.file, options: selectedOptions } as ProcessRequest),
    retry: (failureCount, error) => isApiError(error) && error.retryable && failureCount < MAX_RETRIES,
  });

  const abortRef = useRef<AbortController | null>(null);
  useEffect(() => () => abortRef.current?.abort(), []);

  const currentFingerprint = source ? fingerprint(source, tool, options) : null;
  const matchesCurrent = Boolean(currentFingerprint && mutation.variables?.fingerprint === currentFingerprint);

  // Stop work for a previous image or settings snapshot when the editor changes.
  useEffect(() => {
    if (mutation.isPending && mutation.variables?.fingerprint !== currentFingerprint) {
      abortRef.current?.abort();
    }
  }, [currentFingerprint, mutation.isPending, mutation.variables?.fingerprint]);
  const result = matchesCurrent ? mutation.data : undefined;
  const error = matchesCurrent && mutation.error instanceof ApiError
    ? mutation.error
    : matchesCurrent && mutation.error
      ? new ApiError("UNKNOWN", "Processing failed.")
      : null;

  const process = () => {
    if (!source || !validation.valid) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    mutation.mutate({
      source,
      tool,
      options: structuredClone(options),
      fingerprint: currentFingerprint!,
      signal: controller.signal,
    });
  };

  const retry = () => {
    if (mutation.variables) mutation.mutate(mutation.variables);
  };

  return {
    result,
    isProcessing: matchesCurrent && mutation.isPending,
    error: mutation.isError ? error : null,
    validationMessage: validation.valid ? null : validation.message,
    process,
    retry,
  };
}
