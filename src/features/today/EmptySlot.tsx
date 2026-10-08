import { useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Plus } from "lucide-react";

type Props = { position: number; onAdd: (title: string) => Promise<boolean>; autoFocus?: boolean };

const hints = ["O mais importante de hoje", "Segunda prioridade", "Terceira prioridade"];

export function EmptySlot({ position, onAdd, autoFocus }: Props) {
  const [title, setTitle] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    const t = title.trim();
    if (!t || busy) return;
    setBusy(true);
    if (await onAdd(t)) setTitle("");
    setBusy(false);
  }

  return (
    <motion.form
      layout
      onSubmit={submit}
      className="flex min-h-16 items-center gap-3 rounded-2xl border border-dashed border-line px-4 py-3 transition focus-within:border-accent focus-within:bg-surface"
    >
      <span className="grid size-7 shrink-0 place-items-center rounded-full bg-surface-2 text-xs font-bold text-muted">
        {position}
      </span>
      <input
        value={title}
        autoFocus={autoFocus}
        maxLength={200}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={hints[position - 1]}
        enterKeyHint="done"
        className="min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-zinc-600"
      />
      {title.trim() && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          type="submit"
          disabled={busy}
          aria-label="Adicionar"
          className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white"
        >
          <Plus className="size-5" />
        </motion.button>
      )}
    </motion.form>
  );
}
