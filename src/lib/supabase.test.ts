import { describe, expect, it } from "vitest";
import { normalizeSupabaseUrl, parseAuthRedirect } from "./supabase";

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

describe("parseAuthRedirect", () => {
  it("detecta link de recuperação de senha", () => {
    expect(parseAuthRedirect("#access_token=abc&type=recovery&expires_in=3600")).toEqual({
      recovery: true,
      error: null,
    });
  });

  it("detecta link expirado", () => {
    expect(
      parseAuthRedirect("#error=access_denied&error_code=otp_expired&error_description=Email+link+is+invalid"),
    ).toEqual({ recovery: false, error: "otp_expired" });
  });

  it("ignora URLs sem retorno de autenticação", () => {
    expect(parseAuthRedirect("")).toEqual({ recovery: false, error: null });
  });
});
