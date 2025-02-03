export function formatNumber(value: number, shortFormat = false): string {
  if (shortFormat) {
    return new Intl.NumberFormat("en-US", {
      notation: "compact",
      compactDisplay: "short",
    }).format(value);
  }
  return new Intl.NumberFormat("de-DE").format(value);
}
