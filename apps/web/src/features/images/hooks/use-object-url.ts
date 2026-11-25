import { useMemo } from "react";

// One object URL per Blob, created lazily and released when the Blob is garbage collected.
// Keeping the URL tied to the Blob (instead of to a component effect) means it can't be revoked
// while still displayed, and it survives React StrictMode's double effects.
const urls = new WeakMap<Blob, string>();
const registry =
  typeof FinalizationRegistry === "undefined"
    ? null
    : new FinalizationRegistry<string>((url) => URL.revokeObjectURL(url));

function objectUrlFor(blob: Blob): string {
  let url = urls.get(blob);
  if (!url) {
    url = URL.createObjectURL(blob);
    urls.set(blob, url);
    registry?.register(blob, url);
  }
  return url;
}

export function useObjectUrl(blob: Blob | undefined): string | undefined {
  return useMemo(() => (blob ? objectUrlFor(blob) : undefined), [blob]);
}
