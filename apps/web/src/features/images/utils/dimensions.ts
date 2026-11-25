/** Keeps the aspect ratio when one side changes. `null` stays `null` (empty field). */
export function linkedDimension(value: number | null, ratio: number): number | null {
  if (value === null || !Number.isFinite(value) || value <= 0) return null;
  return Math.max(1, Math.round(value * ratio));
}

/** Default resize target: source size, capped at maxWidth, never enlarged. */
export function defaultResizeTarget(source: { width: number; height: number }, maxWidth: number) {
  const width = Math.min(source.width, maxWidth);
  return { width, height: Math.max(1, Math.round((width * source.height) / source.width)) };
}
