import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ArrowRight, Check, Pencil, Trophy } from "lucide-react";
import type { Goal } from "@/types/db";
import { cleanStep } from "./goals";
import type { GoalChanges } from "./useGoals";

type Props = {
  goal: Goal;
  index: number;
  onUpdate: (changes: GoalChanges) => Promise<boolean>;
  onEdit: () => void;
};

export function GoalCard({ goal, index, onUpdate, onEdit }: Props) {
  // Ao concluir um passo (ou se não houver passo), pede o próximo.
  const [asking, setAsking] = useState(false);
  const [draft, setDraft] = useState("");

  async function saveStep(e: FormEvent) {
    e.preventDefault();
    if (await onUpdate({ next_step: cleanStep(draft) })) {
      setAsking(false);
      setDraft("");
    }
  }

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="rounded-3xl border border-line bg-surface p-5"
    >
      <div className="mb-4 flex items-start gap-3">
        <span className="grid size-8 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent/25 to-accent-2/20 text-sm font-bold text-accent">
          {index + 1}
        </span>
        <h3 className="min-w-0 flex-1 pt-0.5 text-lg leading-snug font-semibold break-words">{goal.title}</h3>
        <button
          onClick={onEdit}
          aria-label={`Editar "${goal.title}"`}
          className="grid size-9 shrink-0 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-zinc-200"
        >
          <Pencil className="size-4" />
        </button>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        {asking || !goal.next_step ? (
          <motion.form
            key="ask"
            onSubmit={saveStep}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-2 rounded-2xl border border-dashed border-accent/40 bg-accent/5 p-2 pl-4"
          >
            <input
              value={draft}
              autoFocus={asking}
              maxLength={200}
              onChange={(e) => setDraft(e.target.value)}
              placeholder={asking ? "E o próximo passo?" : "Defina o próximo passo"}
              enterKeyHint="done"
              className="min-w-0 flex-1 bg-transparent py-2 outline-none placeholder:text-zinc-500"
            />
            {asking && (
              <button
                type="button"
                onClick={() => {
                  setAsking(false);
                  setDraft("");
                }}
                className="h-9 rounded-xl px-3 text-sm text-muted transition hover:text-zinc-200"
              >
                Depois
              </button>
            )}
            <button
              type="submit"
              disabled={!draft.trim()}
              aria-label="Salvar próximo passo"
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-accent to-accent-2 text-white transition disabled:opacity-30"
            >
              <ArrowRight className="size-4" />
            </button>
          </motion.form>
        ) : (
          <motion.div
            key="step"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-center gap-3 rounded-2xl bg-surface-2 p-2 pl-4"
          >
            <div className="min-w-0 flex-1 py-1">
              <p className="text-[11px] font-semibold tracking-wider text-accent uppercase">Próximo passo</p>
              <p className="break-words">{goal.next_step}</p>
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={async () => {
                if (await onUpdate({ next_step: null })) setAsking(true);
              }}
              className="flex h-10 shrink-0 items-center gap-1.5 rounded-xl bg-emerald-500/15 px-3 text-sm font-semibold text-emerald-300 transition hover:bg-emerald-500/25"
            >
              <Check className="size-4" /> Feito
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => onUpdate({ status: "done" })}
          className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm text-muted transition hover:bg-surface-2 hover:text-amber-300"
        >
          <Trophy className="size-4" /> Concluir meta
        </button>
        <button
          onClick={() => onUpdate({ status: "archived" })}
          className="flex h-9 items-center gap-1.5 rounded-xl px-3 text-sm text-muted transition hover:bg-surface-2 hover:text-zinc-200"
        >
          <Archive className="size-4" /> Arquivar
        </button>
      </div>
    </motion.article>
  );
}
