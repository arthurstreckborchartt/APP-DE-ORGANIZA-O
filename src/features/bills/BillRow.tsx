import { motion } from "motion/react";
import { CheckButton } from "@/components/ui/CheckButton";
import type { Bill } from "@/types/db";
import { billStatus, dueLabel, formatBRL, type BillStatus } from "./billStatus";

const labelColor: Record<BillStatus, string> = {
  overdue: "text-rose-400",
  today: "text-amber-300",
  soon: "text-amber-300/90",
  later: "text-muted",
  paid: "text-muted",
};

const dot: Partial<Record<BillStatus, string>> = {
  overdue: "bg-rose-400",
  today: "bg-amber-300",
  soon: "bg-amber-300/70",
};

type Props = { bill: Bill; today: string; onTogglePaid: () => void; onEdit: () => void };

export function BillRow({ bill, today, onTogglePaid, onEdit }: Props) {
  const status = billStatus(bill, today);
  const paid = status === "paid";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ type: "spring", stiffness: 400, damping: 34 }}
      className={`flex items-center gap-3 rounded-2xl border px-4 py-3 transition-colors ${
        paid ? "border-line/60 bg-surface/50" : "border-line bg-surface"
      }`}
    >
      <CheckButton
        checked={paid}
        onClick={onTogglePaid}
        label={paid ? `Marcar "${bill.name}" como não paga` : `Marcar "${bill.name}" como paga`}
      />
      <button type="button" onClick={onEdit} className="flex min-w-0 flex-1 items-center gap-3 text-left">
        <div className="min-w-0 flex-1">
          <p className={`truncate font-medium ${paid ? "text-muted line-through" : ""}`}>{bill.name}</p>
          <p className={`flex items-center gap-1.5 text-xs ${labelColor[status]}`}>
            {dot[status] && <span className={`size-1.5 rounded-full ${dot[status]}`} />}
            {dueLabel(bill, today)}
          </p>
        </div>
        <span className={`shrink-0 font-semibold tabular-nums ${paid ? "text-muted" : ""}`}>
          {formatBRL(bill.amount)}
        </span>
      </button>
    </motion.div>
  );
}
