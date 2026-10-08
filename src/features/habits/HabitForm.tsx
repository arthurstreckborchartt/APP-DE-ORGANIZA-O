import { useState, type FormEvent } from "react";
import { Archive, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Habit } from "@/types/db";

type Props = {
  initial?: Habit;
  onSubmit: (name: string) => Promise<boolean>;
  onArchive?: () => void;
  onDelete?: () => void;
};

const suggestions = ["Academia", "Estudar", "Ler", "Beber 2L de água", "Meditar", "Dormir antes da meia-noite"];

export function HabitForm({ initial, onSubmit, onArchive, onDelete }: Props) {
  const [name, setName] = useState(initial?.name ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim()) return setError("Dê um nome para o hábito.");
    setError(null);
    setBusy(true);
    await onSubmit(name.trim());
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Hábito"
        name="name"
        value={name}
        maxLength={80}
        autoFocus={!initial}
        onChange={(e) => setName(e.target.value)}
        placeholder="Ex.: Academia"
      />
      {!initial && (
        <div className="flex flex-wrap gap-2">
          {suggestions.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setName(s)}
              className="rounded-full border border-line px-3 py-1.5 text-sm text-muted transition hover:border-accent hover:text-zinc-200"
            >
              {s}
            </button>
          ))}
        </div>
      )}
      {error && (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        {onDelete && (
          <Button type="button" variant="ghost" onClick={onDelete} aria-label="Apagar hábito" className="text-rose-400">
            <Trash2 className="size-5" />
          </Button>
        )}
        {onArchive && (
          <Button type="button" variant="ghost" onClick={onArchive} aria-label="Arquivar hábito">
            <Archive className="size-5" />
          </Button>
        )}
        <Button type="submit" loading={busy} className="flex-1">
          {initial ? "Salvar" : "Criar hábito"}
        </Button>
      </div>
    </form>
  );
}
