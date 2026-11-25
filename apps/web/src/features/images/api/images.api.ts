import { backendClient } from "@/lib/http/clients";
import { ApiError } from "@/lib/http/errors";
import type { ProcessRequest, ProcessedImage } from "../types";
import { formatFromMime } from "../utils/format-utils";
import { IMAGE_ENDPOINTS } from "./endpoints";
import { buildFormData, expectedOutputFormat } from "./request-mappers";

/** Sends one image to the backend and returns the processed binary. */
export async function processImage(request: ProcessRequest, signal?: AbortSignal): Promise<ProcessedImage> {
  const response = await backendClient.post<Blob>(IMAGE_ENDPOINTS[request.tool], buildFormData(request), {
    responseType: "blob",
    signal,
  });

  const blob = response.data;
  const mime = blob.type || String(response.headers["content-type"] ?? "");
  if (blob.size === 0 || (mime && !mime.startsWith("image/"))) {
    throw new ApiError("UNKNOWN", "The server returned something that isn't an image.");
  }

  return {
    blob,
    size: blob.size,
    mime,
    format: formatFromMime(mime) ?? expectedOutputFormat(request),
  };
}
