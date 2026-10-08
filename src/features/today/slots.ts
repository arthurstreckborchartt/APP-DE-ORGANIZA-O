import type { Priority } from "@/types/db";

export const SLOTS = [1, 2, 3] as const;
export type Slot = (typeof SLOTS)[number];

/** Organiza as prioridades nas 3 posições fixas (null = vaga livre). */
export function toSlots(items: Priority[]): (Priority | null)[] {
  return SLOTS.map((pos) => items.find((p) => p.position === pos) ?? null);
}

export function progress(items: Priority[]) {
  const done = items.filter((p) => p.done).length;
  return { done, total: items.length, allDone: items.length > 0 && done === items.length };
}
