import { addDays, daysBetween } from "@/lib/dates";

/**
 * Sequência atual de dias seguidos.
 * Se hoje ainda não foi marcado, a sequência que vem até ontem continua valendo
 * (o dia ainda não acabou).
 */
export function currentStreak(days: Set<string>, today: string): number {
  let cursor = days.has(today) ? today : addDays(today, -1);
  let count = 0;
  while (days.has(cursor)) {
    count++;
    cursor = addDays(cursor, -1);
  }
  return count;
}

/** Maior sequência de dias seguidos já registrada. */
export function bestStreak(days: Set<string>): number {
  const sorted = [...days].sort();
  let best = 0;
  let run = 0;
  for (let i = 0; i < sorted.length; i++) {
    run = i > 0 && daysBetween(sorted[i - 1], sorted[i]) === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }
  return best;
}

/** Os últimos `n` dias terminando em `today` (mais antigo primeiro). */
export function lastDays(today: string, n: number): string[] {
  return Array.from({ length: n }, (_, i) => addDays(today, i - (n - 1)));
}
