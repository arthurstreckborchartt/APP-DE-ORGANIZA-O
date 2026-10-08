import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Archive, ChevronDown, Plus, RotateCcw, Target, Trash2, Trophy } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sheet } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import type { Goal } from "@/types/db";
import { canAddActive, MAX_ACTIVE, splitGoals } from "./goals";
import { useGoals } from "./useGoals";
import { GoalCard } from "./GoalCard";
import { GoalForm } from "./GoalForm";

type Editing = { mode: "new" } | { mode: "edit"; goal: Goal } | null;

export function GoalsPage() {
  const { goals, loading, error, add, update, remove } = useGoals();
  const [editing, setEditing] = useState<Editing>(null);
  const [showClosed, setShowClosed] = useState(false);

  const { active, closed } = splitGoals(goals);
  const canAdd = canAddActive(goals);
  const close = () => setEditing(null);

  async function save(input: Pick<Goal, "title" | "next_step">) {
    const ok = editing?.mode === "edit" ? await update(editing.goal, input) : await add(input);
    if (ok) close();
    return ok;
  }

  return (
    <>
      <PageHeader
        title="Metas"
        subtitle="Foco"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setEditing({ mode: "new" })}
            disabled={!canAdd}
            className="flex h-11 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-accent to-accent-2 px-4 font-semibold text-white shadow-lg shadow-accent/20 transition disabled:opacity-40 disabled:shadow-none"
          >
            <Plus className="size-5" /> Nova
          </motion.button>
        }
      />

      {!loading && active.length > 0 && (
        <p className="-mt-3 mb-5 text-sm text-muted">
          {canAdd
            ? `${active.length} de ${MAX_ACTIVE} metas ativas. Foque no próximo passo de cada uma.`
            : `Limite de ${MAX_ACTIVE} metas ativas. Conclua ou arquive uma para criar outra.`}
        </p>
      )}

      {loading ? (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      ) : active.length === 0 ? (
        <EmptyState
          icon={Target}
          title={closed.length ? "Nenhuma meta ativa" : "Nenhuma meta ainda"}
          text={`Escolha até ${MAX_ACTIVE} metas e defina o próximo passo concreto de cada uma.`}
        />
      ) : (
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {active.map((g, i) => (
              <GoalCard
                key={g.id}
                goal={g}
                index={i}
                onUpdate={(changes) => update(g, changes)}
                onEdit={() => setEditing({ mode: "edit", goal: g })}
              />
            ))}
          </AnimatePresence>
        </div>
      )}

      {closed.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowClosed((v) => !v)}
            className="mb-3 flex w-full items-center gap-2 text-sm font-semibold text-muted transition hover:text-zinc-300"
          >
            Concluídas e arquivadas ({closed.length})
            <motion.span animate={{ rotate: showClosed ? 180 : 0 }}>
              <ChevronDown className="size-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showClosed && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {closed.map((g) => (
                  <ClosedGoal
                    key={g.id}
                    goal={g}
                    canReopen={canAdd}
                    onReopen={() => update(g, { status: "active" })}
                    onDelete={() => remove(g)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {error && (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      <Sheet open={editing !== null} onClose={close} title={editing?.mode === "edit" ? "Editar meta" : "Nova meta"}>
        {editing && (
          <GoalForm
            key={editing.mode === "edit" ? editing.goal.id : "new"}
            initial={editing.mode === "edit" ? editing.goal : undefined}
            onSubmit={save}
            onDelete={
              editing.mode === "edit"
                ? async () => {
                    if (await remove(editing.goal)) close();
                  }
                : undefined
            }
          />
        )}
      </Sheet>
    </>
  );
}

type ClosedProps = { goal: Goal; canReopen: boolean; onReopen: () => void; onDelete: () => void };

function ClosedGoal({ goal, canReopen, onReopen, onDelete }: ClosedProps) {
  const done = goal.status === "done";
  const Icon = done ? Trophy : Archive;
  return (
    <motion.div layout className="flex items-center gap-3 rounded-2xl border border-line/60 bg-surface/50 px-4 py-3">
      <Icon className={`size-5 shrink-0 ${done ? "text-amber-300" : "text-muted"}`} />
      <div className="min-w-0 flex-1">
        <p className="truncate text-zinc-300">{goal.title}</p>
        <p className="text-xs text-muted">{done ? "Concluída" : "Arquivada"}</p>
      </div>
      <button
        onClick={onReopen}
        disabled={!canReopen}
        title={canReopen ? "Reativar" : `Limite de ${MAX_ACTIVE} metas ativas`}
        aria-label={`Reativar "${goal.title}"`}
        className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-zinc-200 disabled:opacity-30"
      >
        <RotateCcw className="size-4" />
      </button>
      <button
        onClick={onDelete}
        aria-label={`Apagar "${goal.title}"`}
        className="grid size-9 place-items-center rounded-xl text-muted/60 transition hover:bg-rose-500/10 hover:text-rose-400"
      >
        <Trash2 className="size-4" />
      </button>
    </motion.div>
  );
}
