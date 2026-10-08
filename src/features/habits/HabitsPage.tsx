import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronDown, Flame, Plus, RotateCcw, Trash2 } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Sheet } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { useToday } from "@/lib/useToday";
import type { Habit } from "@/types/db";
import { useHabits } from "./useHabits";
import { HabitCard } from "./HabitCard";
import { HabitForm } from "./HabitForm";

type Editing = { mode: "new" } | { mode: "edit"; habit: Habit } | null;

const EMPTY = new Set<string>();

export function HabitsPage() {
  const today = useToday();
  const { habits, logs, loading, error, toggleDay, add, update, remove } = useHabits();
  const [editing, setEditing] = useState<Editing>(null);
  const [showArchived, setShowArchived] = useState(false);

  const active = habits.filter((h) => !h.archived);
  const archived = habits.filter((h) => h.archived);
  const doneToday = active.filter((h) => logs[h.id]?.has(today)).length;
  const close = () => setEditing(null);

  async function save(name: string) {
    const ok = editing?.mode === "edit" ? await update(editing.habit, { name }) : await add(name);
    if (ok) close();
    return ok;
  }

  return (
    <>
      <PageHeader
        title="Hábitos"
        subtitle="Constância"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setEditing({ mode: "new" })}
            className="flex h-11 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-accent to-accent-2 px-4 font-semibold text-white shadow-lg shadow-accent/20"
          >
            <Plus className="size-5" /> Novo
          </motion.button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      ) : active.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="Nenhum hábito ainda"
          text="Crie hábitos como academia ou estudo e marque cada dia para manter a sequência."
        />
      ) : (
        <>
          <div className="mb-5 flex items-center gap-4 rounded-3xl border border-line bg-surface/60 p-4">
            <ProgressRing value={doneToday} total={active.length} size={52} />
            <div>
              <p className="font-semibold">
                {doneToday === active.length ? "Tudo feito hoje!" : `${doneToday} de ${active.length} feitos hoje`}
              </p>
              <p className="text-sm text-muted">Toque nos dias abaixo para corrigir um dia que esqueceu.</p>
            </div>
          </div>

          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {active.map((h) => (
                <HabitCard
                  key={h.id}
                  habit={h}
                  days={logs[h.id] ?? EMPTY}
                  today={today}
                  onToggle={(day) => toggleDay(h, day)}
                  onEdit={() => setEditing({ mode: "edit", habit: h })}
                />
              ))}
            </AnimatePresence>
          </div>
        </>
      )}

      {archived.length > 0 && (
        <div className="mt-8">
          <button
            onClick={() => setShowArchived((v) => !v)}
            className="mb-3 flex w-full items-center gap-2 text-sm font-semibold text-muted transition hover:text-zinc-300"
          >
            Arquivados ({archived.length})
            <motion.span animate={{ rotate: showArchived ? 180 : 0 }}>
              <ChevronDown className="size-4" />
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {showArchived && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2 overflow-hidden"
              >
                {archived.map((h) => (
                  <div
                    key={h.id}
                    className="flex items-center gap-3 rounded-2xl border border-line/60 bg-surface/50 px-4 py-3"
                  >
                    <p className="min-w-0 flex-1 truncate text-zinc-300">{h.name}</p>
                    <button
                      onClick={() => update(h, { archived: false })}
                      aria-label={`Reativar "${h.name}"`}
                      className="grid size-9 place-items-center rounded-xl text-muted transition hover:bg-surface-2 hover:text-zinc-200"
                    >
                      <RotateCcw className="size-4" />
                    </button>
                    <button
                      onClick={() => confirm(`Apagar "${h.name}" e todo o histórico?`) && remove(h)}
                      aria-label={`Apagar "${h.name}"`}
                      className="grid size-9 place-items-center rounded-xl text-muted/60 transition hover:bg-rose-500/10 hover:text-rose-400"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
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

      <Sheet open={editing !== null} onClose={close} title={editing?.mode === "edit" ? "Editar hábito" : "Novo hábito"}>
        {editing && (
          <HabitForm
            key={editing.mode === "edit" ? editing.habit.id : "new"}
            initial={editing.mode === "edit" ? editing.habit : undefined}
            onSubmit={save}
            onArchive={
              editing.mode === "edit"
                ? async () => {
                    if (await update(editing.habit, { archived: true })) close();
                  }
                : undefined
            }
            onDelete={
              editing.mode === "edit"
                ? async () => {
                    if (confirm(`Apagar "${editing.habit.name}" e todo o histórico?`) && (await remove(editing.habit)))
                      close();
                  }
                : undefined
            }
          />
        )}
      </Sheet>
    </>
  );
}
