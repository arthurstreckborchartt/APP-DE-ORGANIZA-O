import { daysBetween, fromISODate } from "@/lib/dates";
import type { Bill } from "@/types/db";

/** Quantos dias antes do vencimento a conta entra no alerta. */
export const SOON_DAYS = 7;

export type BillStatus = "paid" | "overdue" | "today" | "soon" | "later";

export function billStatus(bill: Pick<Bill, "due_date" | "paid_at">, today: string): BillStatus {
  if (bill.paid_at) return "paid";
  const days = daysBetween(today, bill.due_date);
  if (days < 0) return "overdue";
  if (days === 0) return "today";
  if (days <= SOON_DAYS) return "soon";
  return "later";
}

export function dueLabel(bill: Pick<Bill, "due_date" | "paid_at">, today: string): string {
  const days = daysBetween(today, bill.due_date);
  if (bill.paid_at) return `Paga · vencia ${shortDate(bill.due_date)}`;
  if (days < -1) return `Atrasada há ${-days} dias`;
  if (days === -1) return "Venceu ontem";
  if (days === 0) return "Vence hoje";
  if (days === 1) return "Vence amanhã";
  if (days <= SOON_DAYS) return `Vence em ${days} dias`;
  return `Vence ${shortDate(bill.due_date)}`;
}

export function shortDate(iso: string): string {
  return fromISODate(iso).toLocaleDateString("pt-BR", { day: "numeric", month: "short" }).replace(".", "");
}

export type BillGroups = {
  attention: Bill[]; // atrasadas, hoje e próximos 7 dias
  later: Bill[];
  paid: Bill[];
};

export function groupBills(bills: Bill[], today: string): BillGroups {
  const byDue = [...bills].sort((a, b) => a.due_date.localeCompare(b.due_date));
  const groups: BillGroups = { attention: [], later: [], paid: [] };
  for (const b of byDue) {
    const s = billStatus(b, today);
    if (s === "paid") groups.paid.push(b);
    else if (s === "later") groups.later.push(b);
    else groups.attention.push(b);
  }
  groups.paid.reverse(); // pagas mais recentes primeiro
  return groups;
}

export function summarize(bills: Bill[], today: string) {
  let overdue = 0;
  let attentionCount = 0;
  let attentionTotal = 0;
  let openTotal = 0;
  for (const b of bills) {
    const s = billStatus(b, today);
    if (s === "paid") continue;
    openTotal += Number(b.amount);
    if (s !== "later") {
      attentionCount++;
      attentionTotal += Number(b.amount);
    }
    if (s === "overdue") overdue++;
  }
  return { overdue, attentionCount, attentionTotal, openTotal };
}

const brl = new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" });
export const formatBRL = (n: number) => brl.format(n);

/** Aceita "1.234,56", "1234,56", "1234.56", "R$ 50". Retorna null se inválido. */
export function parseAmount(input: string): number | null {
  let s = input.replace(/[R$\s]/g, "");
  if (!s) return null;
  if (s.includes(",")) s = s.replace(/\./g, "").replace(",", ".");
  else if (/^\d{1,3}(\.\d{3})+$/.test(s)) s = s.replace(/\./g, "");
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  return Number.isFinite(n) ? n : null;
}
