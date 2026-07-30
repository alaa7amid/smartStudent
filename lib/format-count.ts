// Compact number formatting for counters/badges: 1400 → "1.4K", 38000 → "38K", 2_500_000 → "2.5M".
// Keeps one decimal only when it adds information (1.4K, not 1.0K → "1K").

export function formatCount(value: number): string {
  if (!Number.isFinite(value)) return '0'
  const sign = value < 0 ? '-' : ''
  const n = Math.abs(value)

  if (n < 1_000) return sign + String(Math.trunc(n))

  const units = [
    { threshold: 1_000_000_000, suffix: 'B' },
    { threshold: 1_000_000, suffix: 'M' },
    { threshold: 1_000, suffix: 'K' },
  ]

  for (const { threshold, suffix } of units) {
    if (n >= threshold) {
      const scaled = n / threshold
      // Truncate (not round) to one decimal so 1999 → "1.9K", never "2.0K".
      const truncated = Math.trunc(scaled * 10) / 10
      const text = truncated % 1 === 0 ? String(truncated) : truncated.toFixed(1)
      return sign + text + suffix
    }
  }

  return sign + String(Math.trunc(n))
}
