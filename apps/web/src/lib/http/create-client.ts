import axios, { AxiosError, isCancel, type AxiosInstance } from "axios";
import { ApiError } from "./errors";

/** Error bodies come back as Blob when responseType is "blob". Extract a message if there is one. */
async function readServerMessage(data: unknown): Promise<string | undefined> {
  try {
    if (data instanceof Blob) {
      const parsed: unknown = JSON.parse(await data.text());
      return extractMessage(parsed);
    }
    return extractMessage(data);
  } catch {
    return undefined; // body was not JSON
  }
}

function extractMessage(value: unknown): string | undefined {
  if (value && typeof value === "object" && "message" in value) {
    const message = (value as { message?: unknown }).message;
    if (typeof message === "string") return message;
  }
  return undefined;
}

export async function toApiError(error: unknown): Promise<ApiError> {
  if (error instanceof ApiError) return error;
  if (isCancel(error)) return new ApiError("CANCELED", "The request was canceled.");

  if (error instanceof AxiosError) {
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      return new ApiError("TIMEOUT", "The server took too long to respond. Try again.");
    }
    if (!error.response) {
      return new ApiError("NETWORK", "Can't reach the server. Check your connection and try again.");
    }
    const { status, data, headers } = error.response;
    const serverMessage = await readServerMessage(data);

    if (status === 400 || status === 422) {
      return new ApiError("VALIDATION", serverMessage ?? "These settings aren't valid. Adjust them and try again.", { status });
    }
    if (status === 413) {
      return new ApiError("TOO_LARGE", serverMessage ?? "This image is too large to process.", { status });
    }
    if (status === 415) {
      return new ApiError("UNSUPPORTED", serverMessage ?? "This image format isn't supported.", { status });
    }
    if (status === 429) {
      const retryAfter = Number(headers["retry-after"]);
      return new ApiError("RATE_LIMITED", serverMessage ?? "Too many requests. Wait a moment and try again.", {
        status,
        retryAfter: Number.isFinite(retryAfter) ? retryAfter : undefined,
      });
    }
    if (status >= 500) {
      return new ApiError("SERVER", serverMessage ?? "The server hit an error. Try again in a moment.", { status });
    }
    return new ApiError("UNKNOWN", serverMessage ?? "The request failed.", { status });
  }

  return new ApiError("UNKNOWN", error instanceof Error ? error.message : "The request failed.");
}

export function createHttpClient(baseURL: string, timeout: number): AxiosInstance {
  const client = axios.create({ baseURL, timeout });
  client.interceptors.response.use(
    (response) => response,
    async (error: unknown) => Promise.reject(await toApiError(error)),
  );
  return client;
}
