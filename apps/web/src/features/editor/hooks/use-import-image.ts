import { useMutation } from "@tanstack/react-query";
import { useCallback, useRef } from "react";
import { MAX_UPLOAD_BYTES } from "@/features/images/constants";
import { fetchRemoteImage } from "@/features/images/api/remote-image.api";
import type { SourceImage } from "@/features/images/types";
import { loadSourceImage } from "@/features/images/utils/read-image";
import { parseImageUrl, validateImageFile } from "@/features/images/utils/validate-file";
import { getErrorMessage, isApiError } from "@/lib/http/errors";

class ImportError extends Error {}

/**
 * Getting an image into the editor: from a local file or a remote URL.
 * Every failure becomes a single user-facing message (`error`).
 */
export function useImportImage(onLoaded: (source: SourceImage) => void) {
  const abortRef = useRef<AbortController | null>(null);

  const fileMutation = useMutation({
    mutationFn: async (file: File) => {
      const problem = validateImageFile(file, MAX_UPLOAD_BYTES);
      if (problem) throw new ImportError(problem.message);
      return loadSourceImage(file);
    },
    onSuccess: onLoaded,
  });

  const urlMutation = useMutation({
    mutationFn: async (rawUrl: string) => {
      const url = parseImageUrl(rawUrl);
      if (!url) throw new ImportError("Enter a full link starting with http:// or https://.");

      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      const file = await fetchRemoteImage(url.toString(), controller.signal);
      const problem = validateImageFile(file, MAX_UPLOAD_BYTES);
      if (problem) throw new ImportError(problem.message);
      return loadSourceImage(file);
    },
    onSuccess: onLoaded,
  });

  const active = urlMutation.isPending || urlMutation.isError ? urlMutation : fileMutation;
  const rawError = fileMutation.error ?? urlMutation.error;
  const canceled = isApiError(rawError) && rawError.code === "CANCELED";

  const reset = useCallback(() => {
    abortRef.current?.abort();
    fileMutation.reset();
    urlMutation.reset();
  }, [fileMutation, urlMutation]);

  return {
    importFile: (file: File) => {
      urlMutation.reset();
      fileMutation.mutate(file);
    },
    importUrl: (url: string) => {
      fileMutation.reset();
      urlMutation.mutate(url);
    },
    isPending: fileMutation.isPending || urlMutation.isPending,
    error: rawError && !canceled ? getErrorMessage(rawError) : null,
    reset,
    activeSource: active === urlMutation ? "url" : "file",
  } as const;
}
