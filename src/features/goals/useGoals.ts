import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Goal } from "@/types/db";

export type GoalChanges = Partial<Pick<Goal, "title" | "next_step" | "status">>;

export function useGoals() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("goals").select("*").order("created_at");
    if (error) setError("Não foi possível carregar suas metas.");
    else {
      setGoals(data as Goal[]);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function mutate(optimistic: Goal[], run: () => PromiseLike<{ error: unknown }>) {
    const previous = goals;
    setGoals(optimistic);
    const { error } = await run();
    if (error) {
      setGoals(previous);
      setError("Não foi possível salvar. Verifique sua conexão.");
      return false;
    }
    setError(null);
    return true;
  }

  async function add(input: Pick<Goal, "title" | "next_step">) {
    const { data, error } = await supabase.from("goals").insert(input).select().single();
    if (error) {
      setError("Não foi possível adicionar a meta.");
      return false;
    }
    setGoals((cur) => [...cur, data as Goal]);
    setError(null);
    return true;
  }

  const update = (goal: Goal, changes: GoalChanges) =>
    mutate(
      goals.map((g) => (g.id === goal.id ? { ...g, ...changes } : g)),
      () => supabase.from("goals").update(changes).eq("id", goal.id),
    );

  const remove = (goal: Goal) =>
    mutate(
      goals.filter((g) => g.id !== goal.id),
      () => supabase.from("goals").delete().eq("id", goal.id),
    );

  return { goals, loading, error, add, update, remove };
}
