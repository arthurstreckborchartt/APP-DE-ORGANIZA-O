import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Bill } from "@/types/db";

export type BillInput = Pick<Bill, "name" | "amount" | "due_date">;

const normalize = (b: Bill): Bill => ({ ...b, amount: Number(b.amount) });

export function useBills() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from("bills").select("*").order("due_date");
    if (error) setError("Não foi possível carregar suas contas.");
    else {
      setBills((data as Bill[]).map(normalize));
      setError(null);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function mutate(optimistic: Bill[], run: () => PromiseLike<{ error: unknown }>) {
    const previous = bills;
    setBills(optimistic);
    const { error } = await run();
    if (error) {
      setBills(previous);
      setError("Não foi possível salvar. Verifique sua conexão.");
      return false;
    }
    setError(null);
    return true;
  }

  async function add(input: BillInput) {
    const { data, error } = await supabase.from("bills").insert(input).select().single();
    if (error) {
      setError("Não foi possível adicionar a conta.");
      return false;
    }
    setBills((cur) => [...cur, normalize(data as Bill)]);
    setError(null);
    return true;
  }

  const update = (bill: Bill, input: BillInput) =>
    mutate(
      bills.map((b) => (b.id === bill.id ? { ...b, ...input } : b)),
      () => supabase.from("bills").update(input).eq("id", bill.id),
    );

  function togglePaid(bill: Bill) {
    const paid_at = bill.paid_at ? null : new Date().toISOString();
    return mutate(
      bills.map((b) => (b.id === bill.id ? { ...b, paid_at } : b)),
      () => supabase.from("bills").update({ paid_at }).eq("id", bill.id),
    );
  }

  const remove = (bill: Bill) =>
    mutate(
      bills.filter((b) => b.id !== bill.id),
      () => supabase.from("bills").delete().eq("id", bill.id),
    );

  return { bills, loading, error, add, update, togglePaid, remove };
}
