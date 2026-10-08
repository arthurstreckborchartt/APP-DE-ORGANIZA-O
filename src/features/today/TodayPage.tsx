import { AnimatePresence, motion } from "motion/react";
import { PartyPopper } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { ProgressRing } from "@/components/ui/ProgressRing";
import { Spinner } from "@/components/ui/Spinner";
import { fromISODate } from "@/lib/dates";
import { useToday } from "@/lib/useToday";
import { usePriorities } from "./usePriorities";
import { progress, SLOTS, toSlots } from "./slots";
import { PriorityRow } from "./PriorityRow";
import { EmptySlot } from "./EmptySlot";

export function TodayPage() {
  const today = useToday();
  const { items, loading, error, add, toggle, rename, remove } = usePriorities(today);
  const slots = toSlots(items);
  const { done, total, allDone } = progress(items);
  const firstEmpty = slots.findIndex((s) => s === null);

  const dateLabel = fromISODate(today).toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <>
      <PageHeader
        title="Hoje"
        subtitle={dateLabel}
        action={total > 0 ? <ProgressRing value={done} total={total} /> : undefined}
      />

      <p className="-mt-3 mb-5 text-sm text-muted">Até 3 prioridades. Se fizer só elas, o dia valeu.</p>

      {loading ? (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      ) : (
        <div className="space-y-3">
          {slots.map((item, i) =>
            item ? (
              <PriorityRow
                key={item.id}
                item={item}
                onToggle={() => toggle(item)}
                onRename={(t) => rename(item, t)}
                onRemove={() => remove(item)}
              />
            ) : (
              <EmptySlot
                key={`empty-${SLOTS[i]}`}
                position={SLOTS[i]}
                onAdd={(t) => add(SLOTS[i], t)}
                autoFocus={total === 0 && i === firstEmpty && window.matchMedia("(min-width: 768px)").matches}
              />
            ),
          )}
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.p
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mt-4 text-sm text-rose-400"
            role="alert"
          >
            {error}
          </motion.p>
        )}
        {allDone && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 300, damping: 22 }}
            className="mt-6 flex items-center gap-4 rounded-3xl border border-accent/30 bg-gradient-to-br from-accent/15 to-accent-2/10 p-5"
          >
            <motion.div
              initial={{ rotate: -20 }}
              animate={{ rotate: [0, -12, 12, 0] }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="grid size-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-accent to-accent-2"
            >
              <PartyPopper className="size-6 text-white" />
            </motion.div>
            <div>
              <p className="font-semibold">Dia ganho!</p>
              <p className="text-sm text-muted">Você concluiu todas as prioridades de hoje.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
