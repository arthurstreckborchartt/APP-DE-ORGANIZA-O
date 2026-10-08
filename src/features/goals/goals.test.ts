import { describe, expect, it } from "vitest";
import type { Goal, GoalStatus } from "@/types/db";
import { canAddActive, cleanStep, MAX_ACTIVE, splitGoals } from "./goals";

const goal = (id: string, status: GoalStatus, created_at: string): Goal => ({
  id,
  user_id: "u",
  title: id,
  next_step: null,
  status,
  created_at,
});

describe("splitGoals", () => {
  it("separa ativas (mais antigas primeiro) e finalizadas (mais recentes primeiro)", () => {
    const { active, closed } = splitGoals([
      goal("b", "active", "2026-02"),
      goal("x", "done", "2026-01"),
      goal("a", "active", "2026-01"),
      goal("y", "archived", "2026-03"),
    ]);
    expect(active.map((g) => g.id)).toEqual(["a", "b"]);
    expect(closed.map((g) => g.id)).toEqual(["y", "x"]);
  });
});

describe("canAddActive", () => {
  it(`limita a ${MAX_ACTIVE} metas ativas, ignorando finalizadas`, () => {
    const four = Array.from({ length: 4 }, (_, i) => goal(`g${i}`, "active", ""));
    expect(canAddActive(four)).toBe(true);
    expect(canAddActive([...four, goal("d", "done", "")])).toBe(true);
    expect(canAddActive([...four, goal("g5", "active", "")])).toBe(false);
  });
});

describe("cleanStep", () => {
  it("normaliza o próximo passo", () => {
    expect(cleanStep("  Ligar pro banco ")).toBe("Ligar pro banco");
    expect(cleanStep("   ")).toBeNull();
  });
});
