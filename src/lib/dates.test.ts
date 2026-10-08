import { describe, expect, it } from "vitest";
import { addDays, daysBetween, toISODate } from "./dates";

describe("dates", () => {
  it("formata data local", () => {
    expect(toISODate(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("conta dias entre datas, atravessando meses", () => {
    expect(daysBetween("2026-01-30", "2026-02-02")).toBe(3);
    expect(daysBetween("2026-02-02", "2026-01-30")).toBe(-3);
  });

  it("soma dias", () => {
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(addDays("2026-03-01", -1)).toBe("2026-02-28");
  });
});
