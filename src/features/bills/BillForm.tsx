import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Bill } from "@/types/db";
import { parseAmount } from "./billStatus";
import type { BillInput } from "./useBills";

type Props = {
  initial?: Bill;
  defaultDate: string;
  onSubmit: (input: BillInput) => Promise<boolean>;
  onDelete?: () => void;
};

export function BillForm({ initial, defaultDate, onSubmit, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [amount, setAmount] = useState(initial ? initial.amount.toFixed(2).replace(".", ",") : "");
  const [dueDate, setDueDate] = useState(initial?.due_date ?? defaultDate);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const value = parseAmount(amount);
    if (!name.trim()) return setError("Dê um nome para a conta.");
    if (value === null) return setError("Valor inválido. Ex.: 150,90");
    if (!dueDate) return setError("Escolha a data de vencimento.");
    setError(null);
    setBusy(true);
    await onSubmit({ name: name.trim(), amount: value, due_date: dueDate });
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Nome"
        name="name"
        value={name}
        maxLength={120}
        autoFocus={!initial}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex.: Internet, aluguel, cartão"
      />
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Valor (R$)"
          name="amount"
          inputMode="decimal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0,00"
        />
        <Input
          label="Vencimento"
          name="due_date"
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="[color-scheme:dark]"
        />
      </div>
      {error && (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        {onDelete && (
          <Button type="button" variant="ghost" onClick={onDelete} aria-label="Apagar conta" className="text-rose-400">
            <Trash2 className="size-5" />
          </Button>
        )}
        <Button type="submit" loading={busy} className="flex-1">
          {initial ? "Salvar" : "Adicionar conta"}
        </Button>
      </div>
    </form>
  );
}
