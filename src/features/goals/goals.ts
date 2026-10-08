import type { Goal } from "@/types/db";

/** Poucas metas: acima disso, o foco se perde. */
export const MAX_ACTIVE = 5;

export function splitGoals(goals: Goal[]) {
  const byCreated = [...goals].sort((a, b) => a.created_at.localeCompare(b.created_at));
  return {
    active: byCreated.filter((g) => g.status === "active"),
    // finalizadas mais recentes primeiro
    closed: byCreated.filter((g) => g.status !== "active").reverse(),
  };
}

export const canAddActive = (goals: Goal[]) => goals.filter((g) => g.status === "active").length < MAX_ACTIVE;

/** Texto vazio vira null (meta sem próximo passo definido). */
export const cleanStep = (s: string) => s.trim() || null;
