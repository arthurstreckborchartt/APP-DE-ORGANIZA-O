import { useState, type FormEvent } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import type { Goal } from "@/types/db";
import { cleanStep } from "./goals";

type Props = {
  initial?: Goal;
  onSubmit: (input: Pick<Goal, "title" | "next_step">) => Promise<boolean>;
  onDelete?: () => void;
};

export function GoalForm({ initial, onSubmit, onDelete }: Props) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [step, setStep] = useState(initial?.next_step ?? "");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim()) return setError("Escreva a meta.");
    setError(null);
    setBusy(true);
    await onSubmit({ title: title.trim(), next_step: cleanStep(step) });
    setBusy(false);
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input
        label="Meta"
        name="title"
        value={title}
        maxLength={160}
        autoFocus={!initial}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ex.: Correr 10 km, juntar R$ 5 mil"
      />
      <Input
        label="Próximo passo"
        name="next_step"
        value={step}
        maxLength={200}
        onChange={(e) => setStep(e.target.value)}
        placeholder="A menor ação concreta para avançar"
      />
      {error && (
        <p className="text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}
      <div className="flex gap-3 pt-2">
        {onDelete && (
          <Button type="button" variant="ghost" onClick={onDelete} aria-label="Apagar meta" className="text-rose-400">
            <Trash2 className="size-5" />
          </Button>
        )}
        <Button type="submit" loading={busy} className="flex-1">
          {initial ? "Salvar" : "Criar meta"}
        </Button>
      </div>
    </form>
  );
}
