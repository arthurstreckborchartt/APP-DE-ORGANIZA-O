import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2 } from "lucide-react";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "./AuthProvider";
import { translateAuthError } from "./authErrors";

type Mode = "signin" | "signup";

export function LoginPage() {
  const { session } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  if (session) return <Navigate to="/" replace />;

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(translateAuthError(error.message));
    } else {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(translateAuthError(error.message));
      else if (!data.session) setInfo("Conta criada! Enviamos um link de confirmação para o seu e-mail.");
    }
    setBusy(false);
  }

  return (
    <div className="flex min-h-dvh items-center justify-center px-5 py-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 24 }}
        className="w-full max-w-sm"
      >
        <div className="mb-8 text-center">
          <img src="/icon.svg" alt="" className="mx-auto mb-4 size-14 drop-shadow-[0_8px_24px_rgb(139_92_246/0.45)]" />
          <h1 className="text-3xl font-bold tracking-tight">
            <span className="text-gradient">Organiza</span>
          </h1>
          <p className="mt-2 text-muted">Seu dia, suas contas, metas e hábitos.</p>
        </div>

        {!isSupabaseConfigured && (
          <p className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
            Supabase não configurado. Crie o arquivo <code>.env</code> a partir do <code>.env.example</code>.
          </p>
        )}

        <div className="rounded-3xl border border-line bg-surface/80 p-6 shadow-2xl shadow-black/40 backdrop-blur">
          <div className="relative mb-6 grid grid-cols-2 rounded-2xl bg-bg p-1">
            {(["signin", "signup"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => {
                  setMode(m);
                  setError(null);
                  setInfo(null);
                }}
                className={`relative z-10 h-10 rounded-xl text-sm font-semibold transition ${
                  mode === m ? "text-white" : "text-muted hover:text-zinc-300"
                }`}
              >
                {mode === m && (
                  <motion.span
                    layoutId="auth-tab"
                    className="absolute inset-0 -z-10 rounded-xl bg-surface-2"
                    transition={{ type: "spring", stiffness: 400, damping: 32 }}
                  />
                )}
                {m === "signin" ? "Entrar" : "Criar conta"}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="E-mail"
              name="email"
              type="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="voce@email.com"
            />
            <Input
              label="Senha"
              name="password"
              type="password"
              autoComplete={mode === "signin" ? "current-password" : "new-password"}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mínimo 6 caracteres"
            />

            <AnimatePresence mode="wait">
              {error && (
                <motion.p
                  key="error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="text-sm text-rose-400"
                  role="alert"
                >
                  {error}
                </motion.p>
              )}
              {info && (
                <motion.p
                  key="info"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-start gap-2 text-sm text-emerald-400"
                >
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0" />
                  {info}
                </motion.p>
              )}
            </AnimatePresence>

            <Button type="submit" loading={busy} className="w-full">
              {mode === "signin" ? "Entrar" : "Criar conta"}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
