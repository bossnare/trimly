export type ApiErrorCode =
  | "NETWORK"
  | "TIMEOUT"
  | "CANCELED"
  | "VALIDATION"
  | "TOO_LARGE"
  | "UNSUPPORTED"
  | "RATE_LIMITED"
  | "SERVER"
  | "UNKNOWN";

const RETRYABLE: ApiErrorCode[] = ["NETWORK", "TIMEOUT", "RATE_LIMITED", "SERVER"];

/** Normalised error thrown by every HTTP call. UI never sees raw axios errors. */
export class ApiError extends Error {
  readonly code: ApiErrorCode;
  readonly status?: number;
  /** Seconds to wait before retrying (429 only). */
  readonly retryAfter?: number;

  constructor(code: ApiErrorCode, message: string, options?: { status?: number; retryAfter?: number }) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = options?.status;
    this.retryAfter = options?.retryAfter;
  }

  get retryable(): boolean {
    return RETRYABLE.includes(this.code);
  }
}

export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

export function getErrorMessage(error: unknown, fallback = "Something went wrong. Try again."): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
