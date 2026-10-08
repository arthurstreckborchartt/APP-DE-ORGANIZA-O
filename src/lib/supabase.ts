import { createClient } from "@supabase/supabase-js";

/**
 * Aceita a URL do projeto mesmo se vier com caminho a mais
 * (ex.: ".../rest/v1/" copiado do painel) e mantém só a origem.
 */
export function normalizeSupabaseUrl(raw: string | undefined): string | undefined {
  const value = raw?.trim().replace(/^["']|["']$/g, "");
  if (!value) return undefined;
  try {
    return new URL(value).origin;
  } catch {
    return undefined;
  }
}

export type AuthRedirect = { recovery: boolean; error: string | null };

/**
 * Lê o retorno dos links de e-mail do Supabase (ex.: "esqueci minha senha")
 * a partir do trecho após "#" da URL. Precisa rodar antes do createClient,
 * que consome e limpa esse trecho.
 */
export function parseAuthRedirect(hash: string): AuthRedirect {
  const params = new URLSearchParams(hash.replace(/^#/, ""));
  return {
    recovery: params.get("type") === "recovery",
    error: params.get("error_code") ?? params.get("error"),
  };
}

export const authRedirect: AuthRedirect =
  typeof window === "undefined" ? { recovery: false, error: null } : parseAuthRedirect(window.location.hash);

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim().replace(/^["']|["']$/g, "");

export const isSupabaseConfigured = Boolean(url && anonKey);

// Com .env ausente, o app mostra um aviso em vez de quebrar.
export const supabase = createClient(url ?? "http://localhost:54321", anonKey ?? "missing-anon-key");
