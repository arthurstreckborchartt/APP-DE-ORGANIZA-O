import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Habit, HabitLog } from "@/types/db";

type LogMap = Record<string, Set<string>>; // habit_id -> dias feitos

const PAGE = 1000; // limite padrão de linhas por consulta no Supabase

async function fetchAllLogs() {
  const all: Pick<HabitLog, "habit_id" | "day">[] = [];
  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("habit_logs")
      .select("habit_id, day")
      .order("day")
      .range(from, from + PAGE - 1);
    if (error) return { data: null, error };
    all.push(...data);
    if (data.length < PAGE) return { data: all, error: null };
  }
}

function withDay(logs: LogMap, habitId: string, day: string, done: boolean): LogMap {
  const next = new Set(logs[habitId]);
  if (done) next.add(day);
  else next.delete(day);
  return { ...logs, [habitId]: next };
}

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [logs, setLogs] = useState<LogMap>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const [h, l] = await Promise.all([supabase.from("habits").select("*").order("created_at"), fetchAllLogs()]);
    if (h.error || l.error) setError("Não foi possível carregar seus hábitos.");
    else {
      const map: LogMap = {};
      for (const log of l.data) (map[log.habit_id] ??= new Set()).add(log.day);
      setHabits(h.data as Habit[]);
      setLogs(map);
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function toggleDay(habit: Habit, day: string) {
    const done = logs[habit.id]?.has(day) ?? false;
    setLogs((cur) => withDay(cur, habit.id, day, !done));
    const { error } = done
      ? await supabase.from("habit_logs").delete().eq("habit_id", habit.id).eq("day", day)
      : await supabase.from("habit_logs").insert({ habit_id: habit.id, day });
    if (error) {
      setLogs((cur) => withDay(cur, habit.id, day, done));
      setError("Não foi possível salvar. Verifique sua conexão.");
    } else setError(null);
  }

  async function add(name: string) {
    const { data, error } = await supabase.from("habits").insert({ name }).select().single();
    if (error) {
      setError("Não foi possível criar o hábito.");
      return false;
    }
    setHabits((cur) => [...cur, data as Habit]);
    setError(null);
    return true;
  }

  async function update(habit: Habit, changes: Partial<Pick<Habit, "name" | "archived">>) {
    const previous = habits;
    setHabits(habits.map((h) => (h.id === habit.id ? { ...h, ...changes } : h)));
    const { error } = await supabase.from("habits").update(changes).eq("id", habit.id);
    if (error) {
      setHabits(previous);
      setError("Não foi possível salvar. Verifique sua conexão.");
      return false;
    }
    setError(null);
    return true;
  }

  async function remove(habit: Habit) {
    const previous = habits;
    setHabits(habits.filter((h) => h.id !== habit.id));
    // os registros do hábito são apagados junto (on delete cascade)
    const { error } = await supabase.from("habits").delete().eq("id", habit.id);
    if (error) {
      setHabits(previous);
      setError("Não foi possível apagar. Verifique sua conexão.");
      return false;
    }
    setError(null);
    return true;
  }

  return { habits, logs, loading, error, toggleDay, add, update, remove };
}
