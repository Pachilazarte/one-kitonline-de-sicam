/** "12.5" | "" | null → número seguro */
export const num = (v) => Number(v) || 0

const ARS = new Intl.NumberFormat('es-AR', {
  style: 'currency',
  currency: 'ARS',
  maximumFractionDigits: 0,
})

/** número → "$ 1.234.567" */
export function fmtMoney(n) {
  return ARS.format(num(n))
}
