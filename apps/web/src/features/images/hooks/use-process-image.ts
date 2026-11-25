import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { ApiError, isApiError } from "@/lib/http/errors";
import { processImage } from "../api/images.api";
import { imageKeys } from "../query-keys";
import { validateOptions } from "../schemas";
import type { ProcessRequest, SourceImage, ToolId, ToolOptions } from "../types";
import { useDebouncedValue } from "./use-debounced-value";

const DEBOUNCE_MS = 400;
const MAX_RETRIES = 2;

interface Params {
  source: SourceImage | null;
  tool: ToolId;
  options: ToolOptions;
}

/**
 * Auto-preview: every settled change of (image, tool, options) triggers one request.
 * - Debounced, so dragging a slider doesn't flood the backend.
 * - Stale requests are aborted through the AbortSignal TanStack Query provides.
 * - Results are cached per (image, tool, options): going back to a previous setting is instant.
 * - Only retryable failures (network, timeout, 429, 5xx) are retried, at most twice.
 */
export function useProcessImage({ source, tool, options }: Params) {
  const debouncedOptions = useDebouncedValue(options, DEBOUNCE_MS);
  const isSettling = debouncedOptions !== options;

  const validation = useMemo(
    () => validateOptions(tool, debouncedOptions as never),
    [tool, debouncedOptions],
  );

  const query = useQuery({
    queryKey: imageKeys.process(source?.id, tool, debouncedOptions),
    queryFn: ({ signal }) =>
      processImage({ tool, file: source!.file, options: debouncedOptions } as ProcessRequest, signal),
    enabled: source !== null && validation.valid,
    staleTime: Infinity,
    gcTime: 5 * 60_000,
    refetchOnWindowFocus: false,
    structuralSharing: false, // results hold Blobs
    retry: (failureCount, error) => isApiError(error) && error.retryable && failureCount < MAX_RETRIES,
    // Keep the previous preview on screen while new settings load, but only for the same tool.
    placeholderData: (previous, previousQuery) =>
      previousQuery?.queryKey[3] === tool ? keepPreviousData(previous) : undefined,
  });

  const error = query.error instanceof ApiError ? query.error : query.error ? new ApiError("UNKNOWN", "Processing failed.") : null;

  return {
    result: query.data,
    isProcessing: query.isFetching || isSettling,
    isUpdating: query.isPlaceholderData || (isSettling && Boolean(query.data)),
    error: query.isError ? error : null,
    validationMessage: validation.valid ? null : validation.message,
    retry: () => void query.refetch(),
  };
}
