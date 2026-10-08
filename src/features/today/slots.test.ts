import { describe, expect, it } from "vitest";
import type { Priority } from "@/types/db";
import { progress, toSlots } from "./slots";

const p = (position: 1 | 2 | 3, done = false): Priority => ({
  id: `id${position}`,
  user_id: "u",
  day: "2026-10-08",
  position,
  title: `t${position}`,
  done,
  created_at: "",
});

describe("toSlots", () => {
  it("coloca cada prioridade na sua posição e deixa vagas como null", () => {
    const slots = toSlots([p(3), p(1)]);
    expect(slots.map((s) => s?.position ?? null)).toEqual([1, null, 3]);
  });
});

describe("progress", () => {
  it("sem prioridades não conta como tudo feito", () => {
    expect(progress([])).toEqual({ done: 0, total: 0, allDone: false });
  });

  it("conta feitas e detecta dia concluído", () => {
    expect(progress([p(1, true), p(2)])).toMatchObject({ done: 1, total: 2, allDone: false });
    expect(progress([p(1, true), p(2, true)]).allDone).toBe(true);
  });
});
