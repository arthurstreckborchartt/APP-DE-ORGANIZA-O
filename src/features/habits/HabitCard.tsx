import { motion } from "motion/react";
import { Check, Flame } from "lucide-react";
import { fromISODate } from "@/lib/dates";
import type { Habit } from "@/types/db";
import { bestStreak, currentStreak, lastDays } from "./streak";

type Props = {
  habit: Habit;
  days: Set<string>;
  today: string;
  onToggle: (day: string) => void;
  onEdit: () => void;
};

const weekdayLetter = (iso: string) =>
  fromISODate(iso).toLocaleDateString("pt-BR", { weekday: "short" }).charAt(0).toUpperCase();

function streakText(streak: number, doneToday: boolean) {
  if (streak === 0) return "Comece hoje";
  const d = streak === 1 ? "1 dia seguido" : `${streak} dias seguidos`;
  return doneToday ? d : `${d} · falta hoje`;
}

export function HabitCard({ habit, days, today, onToggle, onEdit }: Props) {
  const doneToday = days.has(today);
  const streak = currentStreak(days, today);
  const best = bestStreak(days);
  const week = lastDays(today, 7);

  const flameColor = streak === 0 ? "text-muted" : doneToday ? "text-orange-400" : "text-orange-400/50";

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ type: "spring", stiffness: 380, damping: 32 }}
      className="rounded-3xl border border-line bg-surface p-5"
    >
      <div className="flex items-center gap-4">
        <button onClick={onEdit} className="min-w-0 flex-1 text-left" title="Toque para editar">
          <h3 className="truncate text-lg font-semibold">{habit.name}</h3>
          <p className="mt-0.5 flex items-center gap-1.5 text-sm text-muted">
            <motion.span
              key={`${streak}-${doneToday}`}
              initial={{ scale: doneToday ? 1.6 : 1 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <Flame className={`size-4 ${flameColor}`} fill={doneToday && streak > 0 ? "currentColor" : "none"} />
            </motion.span>
            <span className="truncate">{streakText(streak, doneToday)}</span>
          </p>
        </button>

        <motion.button
          whileTap={{ scale: 0.88 }}
          onClick={() => onToggle(today)}
          role="checkbox"
          aria-checked={doneToday}
          aria-label={`Marcar "${habit.name}" como feito hoje`}
          className={`grid size-14 shrink-0 place-items-center rounded-2xl border-2 transition-colors ${
            doneToday
              ? "border-transparent bg-gradient-to-br from-accent to-accent-2 shadow-lg shadow-accent/25"
              : "border-dashed border-line hover:border-accent"
          }`}
        >
          <motion.span
            initial={false}
            animate={{ scale: doneToday ? 1 : 0, rotate: doneToday ? 0 : -45 }}
            transition={{ type: "spring", stiffness: 500, damping: 20 }}
          >
            <Check className="size-7 text-white" strokeWidth={3} />
          </motion.span>
        </motion.button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-1.5">
        {week.map((day) => {
          const done = days.has(day);
          const isToday = day === today;
          return (
            <button
              key={day}
              onClick={() => onToggle(day)}
              aria-label={`${fromISODate(day).toLocaleDateString("pt-BR")}: ${done ? "feito" : "não feito"}`}
              className="flex flex-col items-center gap-1.5"
            >
              <span className={`text-[11px] font-medium ${isToday ? "text-zinc-200" : "text-muted"}`}>
                {weekdayLetter(day)}
              </span>
              <span
                className={`h-2.5 w-full rounded-full transition-colors duration-300 ${
                  done ? "bg-gradient-to-r from-accent to-accent-2" : "bg-surface-2"
                } ${isToday ? "ring-1 ring-zinc-500 ring-offset-2 ring-offset-surface" : ""}`}
              />
            </button>
          );
        })}
      </div>

      {best > 1 && <p className="mt-3 text-xs text-muted">Recorde: {best} dias</p>}
    </motion.article>
  );
}
