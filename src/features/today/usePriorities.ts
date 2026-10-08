import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Priority } from "@/types/db";
import type { Slot } from "./slots";

/**
 * Prioridades de um dia. As alterações aparecem na hora (otimista)
 * e voltam ao estado anterior se o Supabase recusar.
 */
export function usePriorities(day: string) {
  const [items, setItems] = useState<Priority[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("priorities")
      .select("*")
      .eq("day", day)
      .order("position");
    if (error) setError("Não foi possível carregar suas prioridades.");
    else {
      setItems(data as Priority[]);
      setError(null);
    }
    setLoading(false);
  }, [day]);

  useEffect(() => {
    load();
  }, [load]);

  async function mutate(optimistic: Priority[], run: () => PromiseLike<{ error: unknown }>) {
    const previous = items;
    setItems(optimistic);
    const { error } = await run();
    if (error) {
      setItems(previous);
      setError("Não foi possível salvar. Verifique sua conexão.");
      return false;
    }
    setError(null);
    return true;
  }

  async function add(position: Slot, title: string) {
    const { data, error } = await supabase
      .from("priorities")
      .insert({ day, position, title })
      .select()
      .single();
    if (error) {
      setError("Não foi possível adicionar.");
      return false;
    }
    setItems((cur) => [...cur, data as Priority].sort((a, b) => a.position - b.position));
    setError(null);
    return true;
  }

  const toggle = (item: Priority) =>
    mutate(
      items.map((p) => (p.id === item.id ? { ...p, done: !p.done } : p)),
      () => supabase.from("priorities").update({ done: !item.done }).eq("id", item.id),
    );

  const rename = (item: Priority, title: string) =>
    mutate(
      items.map((p) => (p.id === item.id ? { ...p, title } : p)),
      () => supabase.from("priorities").update({ title }).eq("id", item.id),
    );

  const remove = (item: Priority) =>
    mutate(
      items.filter((p) => p.id !== item.id),
      () => supabase.from("priorities").delete().eq("id", item.id),
    );

  return { items, loading, error, add, toggle, rename, remove, reload: load };
}
