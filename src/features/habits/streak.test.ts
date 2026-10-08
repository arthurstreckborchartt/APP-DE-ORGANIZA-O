import { describe, expect, it } from "vitest";
import { bestStreak, currentStreak, lastDays } from "./streak";

const today = "2026-10-08";
const set = (...d: string[]) => new Set(d);

describe("currentStreak", () => {
  it("zero sem registros", () => {
    expect(currentStreak(set(), today)).toBe(0);
  });

  it("conta dias seguidos incluindo hoje", () => {
    expect(currentStreak(set("2026-10-06", "2026-10-07", "2026-10-08"), today)).toBe(3);
  });

  it("mantém a sequência até ontem se hoje ainda não foi marcado", () => {
    expect(currentStreak(set("2026-10-06", "2026-10-07"), today)).toBe(2);
  });

  it("zera se falhou ontem e não marcou hoje", () => {
    expect(currentStreak(set("2026-10-05", "2026-10-06"), today)).toBe(0);
  });

  it("buraco interrompe a contagem", () => {
    expect(currentStreak(set("2026-10-04", "2026-10-06", "2026-10-07", "2026-10-08"), today)).toBe(3);
  });

  it("atravessa a virada de mês e ano", () => {
    expect(currentStreak(set("2026-12-30", "2026-12-31", "2027-01-01"), "2027-01-01")).toBe(3);
  });
});

describe("bestStreak", () => {
  it("encontra a maior sequência", () => {
    expect(bestStreak(set())).toBe(0);
    expect(bestStreak(set("2026-01-01"))).toBe(1);
    expect(
      bestStreak(set("2026-01-01", "2026-01-02", "2026-01-05", "2026-01-06", "2026-01-07", "2026-01-09")),
    ).toBe(3);
  });
});

describe("lastDays", () => {
  it("lista os últimos dias terminando hoje", () => {
    expect(lastDays("2026-03-02", 4)).toEqual(["2026-02-27", "2026-02-28", "2026-03-01", "2026-03-02"]);
  });
});
