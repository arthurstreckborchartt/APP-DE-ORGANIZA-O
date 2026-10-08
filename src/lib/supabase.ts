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

const url = normalizeSupabaseUrl(import.meta.env.VITE_SUPABASE_URL as string | undefined);
const anonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim().replace(/^["']|["']$/g, "");

export const isSupabaseConfigured = Boolean(url && anonKey);

// Com .env ausente, o app mostra um aviso em vez de quebrar.
export const supabase = createClient(url ?? "http://localhost:54321", anonKey ?? "missing-anon-key");
