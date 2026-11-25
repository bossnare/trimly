export type SavingsKind = "smaller" | "larger" | "same";

export interface Savings {
  kind: SavingsKind;
  /** Absolute rounded percentage, e.g. 73 */
  percent: number;
  label: string;
}

/** −73% when smaller, +12% when the result grew (e.g. PNG output), "No change" otherwise. */
export function computeSavings(originalBytes: number, resultBytes: number): Savings {
  if (originalBytes <= 0) return { kind: "same", percent: 0, label: "No change" };
  const diff = ((resultBytes - originalBytes) / originalBytes) * 100;
  const percent = Math.round(Math.abs(diff));
  if (percent === 0) return { kind: "same", percent: 0, label: "No change" };
  return diff < 0
    ? { kind: "smaller", percent, label: `−${percent}%` }
    : { kind: "larger", percent, label: `+${percent}%` };
}
