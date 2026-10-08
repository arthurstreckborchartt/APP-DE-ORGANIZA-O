import { describe, expect, it } from "vitest";
import type { Bill } from "@/types/db";
import { billStatus, dueLabel, groupBills, parseAmount, summarize } from "./billStatus";

const today = "2026-10-08";
const bill = (id: string, due_date: string, amount = 100, paid_at: string | null = null): Bill => ({
  id,
  user_id: "u",
  name: id,
  amount,
  due_date,
  paid_at,
  created_at: "",
});

describe("billStatus", () => {
  it("classifica pelo vencimento", () => {
    expect(billStatus(bill("a", "2026-10-07"), today)).toBe("overdue");
    expect(billStatus(bill("a", "2026-10-08"), today)).toBe("today");
    expect(billStatus(bill("a", "2026-10-15"), today)).toBe("soon");
    expect(billStatus(bill("a", "2026-10-16"), today)).toBe("later");
  });

  it("paga ignora o vencimento", () => {
    expect(billStatus(bill("a", "2026-01-01", 1, "2026-01-01T10:00:00Z"), today)).toBe("paid");
  });
});

describe("dueLabel", () => {
  it("gera textos amigáveis", () => {
    expect(dueLabel(bill("a", "2026-10-05"), today)).toBe("Atrasada há 3 dias");
    expect(dueLabel(bill("a", "2026-10-07"), today)).toBe("Venceu ontem");
    expect(dueLabel(bill("a", "2026-10-08"), today)).toBe("Vence hoje");
    expect(dueLabel(bill("a", "2026-10-09"), today)).toBe("Vence amanhã");
    expect(dueLabel(bill("a", "2026-10-12"), today)).toBe("Vence em 4 dias");
  });
});

describe("groupBills / summarize", () => {
  const bills = [
    bill("later", "2026-11-20", 300),
    bill("overdue", "2026-10-01", 50),
    bill("soon", "2026-10-10", 25.5),
    bill("paid", "2026-10-02", 999, "2026-10-02T00:00:00Z"),
  ];

  it("separa em grupos ordenados por vencimento", () => {
    const g = groupBills(bills, today);
    expect(g.attention.map((b) => b.id)).toEqual(["overdue", "soon"]);
    expect(g.later.map((b) => b.id)).toEqual(["later"]);
    expect(g.paid.map((b) => b.id)).toEqual(["paid"]);
  });

  it("soma o que precisa de atenção e o total em aberto", () => {
    expect(summarize(bills, today)).toEqual({
      overdue: 1,
      attentionCount: 2,
      attentionTotal: 75.5,
      openTotal: 375.5,
    });
  });
});

describe("parseAmount", () => {
  it.each([
    ["1.234,56", 1234.56],
    ["1234,5", 1234.5],
    ["1234.56", 1234.56],
    ["R$ 50", 50],
    ["1.500", 1500],
  ])("%s → %d", (input, out) => expect(parseAmount(input)).toBe(out));

  it("rejeita inválidos", () => {
    expect(parseAmount("")).toBeNull();
    expect(parseAmount("abc")).toBeNull();
    expect(parseAmount("1,234")).toBeNull();
  });
});
