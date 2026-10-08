import { describe, expect, it } from "vitest";
import { normalizeSupabaseUrl } from "./supabase";

describe("normalizeSupabaseUrl", () => {
  it("mantém só a origem da URL", () => {
    expect(normalizeSupabaseUrl("https://abc.supabase.co")).toBe("https://abc.supabase.co");
    expect(normalizeSupabaseUrl("https://abc.supabase.co/")).toBe("https://abc.supabase.co");
    expect(normalizeSupabaseUrl("https://abc.supabase.co/rest/v1/")).toBe("https://abc.supabase.co");
    expect(normalizeSupabaseUrl(' "https://abc.supabase.co" ')).toBe("https://abc.supabase.co");
  });

  it("rejeita valores vazios ou inválidos", () => {
    expect(normalizeSupabaseUrl(undefined)).toBeUndefined();
    expect(normalizeSupabaseUrl("")).toBeUndefined();
    expect(normalizeSupabaseUrl("abc.supabase.co")).toBeUndefined();
  });
});
