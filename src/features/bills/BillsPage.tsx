import { useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import { AlertTriangle, CheckCircle2, ChevronDown, Plus, Wallet } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { Sheet } from "@/components/ui/Sheet";
import { Spinner } from "@/components/ui/Spinner";
import { useToday } from "@/lib/useToday";
import type { Bill } from "@/types/db";
import { formatBRL, groupBills, SOON_DAYS, summarize } from "./billStatus";
import { useBills, type BillInput } from "./useBills";
import { BillRow } from "./BillRow";
import { BillForm } from "./BillForm";

type Editing = { mode: "new" } | { mode: "edit"; bill: Bill } | null;

export function BillsPage() {
  const today = useToday();
  const { bills, loading, error, add, update, togglePaid, remove } = useBills();
  const [editing, setEditing] = useState<Editing>(null);
  const [showPaid, setShowPaid] = useState(false);

  const groups = groupBills(bills, today);
  const summary = summarize(bills, today);
  const close = () => setEditing(null);

  async function save(input: BillInput) {
    const ok = editing?.mode === "edit" ? await update(editing.bill, input) : await add(input);
    if (ok) close();
    return ok;
  }

  const row = (b: Bill) => (
    <BillRow
      key={b.id}
      bill={b}
      today={today}
      onTogglePaid={() => togglePaid(b)}
      onEdit={() => setEditing({ mode: "edit", bill: b })}
    />
  );

  return (
    <>
      <PageHeader
        title="Contas"
        subtitle="Financeiro"
        action={
          <motion.button
            whileTap={{ scale: 0.92 }}
            onClick={() => setEditing({ mode: "new" })}
            className="flex h-11 items-center gap-1.5 rounded-2xl bg-gradient-to-r from-accent to-accent-2 px-4 font-semibold text-white shadow-lg shadow-accent/20"
          >
            <Plus className="size-5" /> Nova
          </motion.button>
        }
      />

      {loading ? (
        <div className="grid place-items-center py-16">
          <Spinner />
        </div>
      ) : bills.length === 0 ? (
        <EmptyState
          icon={Wallet}
          title="Nenhuma conta ainda"
          text={`Cadastre suas contas e o app avisa o que vence nos próximos ${SOON_DAYS} dias.`}
        />
      ) : (
        <>
          <SummaryCard {...summary} />

          {groups.attention.length > 0 && (
            <Section title="Precisa de atenção">{groups.attention.map(row)}</Section>
          )}
          {groups.later.length > 0 && <Section title="Próximas">{groups.later.map(row)}</Section>}

          {groups.paid.length > 0 && (
            <div className="mt-8">
              <button
                onClick={() => setShowPaid((v) => !v)}
                className="mb-3 flex w-full items-center gap-2 text-sm font-semibold text-muted transition hover:text-zinc-300"
              >
                Pagas ({groups.paid.length})
                <motion.span animate={{ rotate: showPaid ? 180 : 0 }}>
                  <ChevronDown className="size-4" />
                </motion.span>
              </button>
              <AnimatePresence initial={false}>
                {showPaid && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-2 overflow-hidden"
                  >
                    {groups.paid.map(row)}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </>
      )}

      {error && (
        <p className="mt-4 text-sm text-rose-400" role="alert">
          {error}
        </p>
      )}

      <Sheet open={editing !== null} onClose={close} title={editing?.mode === "edit" ? "Editar conta" : "Nova conta"}>
        {editing && (
          <BillForm
            key={editing.mode === "edit" ? editing.bill.id : "new"}
            initial={editing.mode === "edit" ? editing.bill : undefined}
            defaultDate={today}
            onSubmit={save}
            onDelete={
              editing.mode === "edit"
                ? async () => {
                    if (await remove(editing.bill)) close();
                  }
                : undefined
            }
          />
        )}
      </Sheet>
    </>
  );
}

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 text-sm font-semibold text-muted">{title}</h2>
      <div className="space-y-2">
        <AnimatePresence initial={false}>{children}</AnimatePresence>
      </div>
    </section>
  );
}

function SummaryCard({ overdue, attentionCount, attentionTotal, openTotal }: ReturnType<typeof summarize>) {
  const tone =
    overdue > 0
      ? "border-rose-500/30 from-rose-500/15 to-rose-500/5"
      : attentionCount > 0
        ? "border-amber-400/30 from-amber-400/15 to-amber-400/5"
        : "border-emerald-400/25 from-emerald-400/12 to-emerald-400/5";

  const Icon = attentionCount > 0 ? AlertTriangle : CheckCircle2;
  const iconColor = overdue > 0 ? "text-rose-400" : attentionCount > 0 ? "text-amber-300" : "text-emerald-400";

  let headline: string;
  if (overdue > 0) headline = overdue === 1 ? "1 conta atrasada" : `${overdue} contas atrasadas`;
  else if (attentionCount > 0)
    headline =
      attentionCount === 1 ? `1 conta vence em até ${SOON_DAYS} dias` : `${attentionCount} contas vencem em até ${SOON_DAYS} dias`;
  else headline = "Tudo em dia";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-4 rounded-3xl border bg-gradient-to-br p-5 ${tone}`}
    >
      <Icon className={`size-7 shrink-0 ${iconColor}`} />
      <div className="min-w-0 flex-1">
        <p className="font-semibold">{headline}</p>
        <p className="text-sm text-muted">
          {attentionCount === 0 || attentionTotal === openTotal
            ? `${formatBRL(openTotal)} em aberto`
            : `${formatBRL(attentionTotal)} para pagar em breve · ${formatBRL(openTotal)} em aberto`}
        </p>
      </div>
    </motion.div>
  );
}
