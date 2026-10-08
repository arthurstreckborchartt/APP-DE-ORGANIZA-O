/** Data local no formato YYYY-MM-DD (o que vai para colunas `date`). */
export function toISODate(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Converte YYYY-MM-DD em Date à meia-noite local. */
export function fromISODate(s: string): Date {
  const [y, m, d] = s.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Dias de `from` até `to` (positivo se `to` é depois). */
export function daysBetween(from: string, to: string): number {
  const ms = fromISODate(to).getTime() - fromISODate(from).getTime();
  return Math.round(ms / 86_400_000);
}

export function addDays(iso: string, n: number): string {
  const d = fromISODate(iso);
  d.setDate(d.getDate() + n);
  return toISODate(d);
}
