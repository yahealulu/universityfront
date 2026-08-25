/**
 * Page indices (1-based) and ellipsis markers for a compact pagination control.
 */
export const getPatientListVisiblePages = (
  current: number,
  totalPages: number
): Array<number | 'ellipsis'> => {
  if (totalPages < 1) return [1]
  if (totalPages === 1) return [1]

  const pages = new Set<number>()
  pages.add(1)
  pages.add(totalPages)
  pages.add(current)
  pages.add(current - 1)
  pages.add(current + 1)

  for (const p of [...pages]) {
    if (p < 1 || p > totalPages) pages.delete(p)
  }

  const sorted = [...pages].sort((a, b) => a - b)
  const out: Array<number | 'ellipsis'> = []
  let prev = 0
  for (const p of sorted) {
    if (prev > 0 && p - prev > 1) {
      out.push('ellipsis')
    }
    out.push(p)
    prev = p
  }
  return out
}
