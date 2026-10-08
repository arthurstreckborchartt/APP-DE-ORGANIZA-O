import { useState, type FormEvent } from "react";
import { Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "motion/react";
import { ArrowLeft } from "lucide-react";
import { authRedirect, isSupabaseConfigured, supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useAuth } from "./AuthProvider";
import { translateAuthError } from "./authErrors";
import { AuthCard, FormMessage } from "./AuthCard";

type Mode = "signin" | "signup" | "reset";

export function LoginPage() {
  const { session } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  // Link de e-mail expirado cai aqui (ex.: recuperação de senha antiga).
  const [error, setError] = useState<string | null>(
    authRedirect.error ? translateAuthError(authRedirect.error) : null,
  );
  const [info, setInfo] = useState<string | null>(null);

  if (session) return <Navigate to="/" replace />;

  function switchMode(m: Mode) {
    setMode(m);
    setError(null);
    setInfo(null);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    setInfo(null);

    if (mode === "signin") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(translateAuthError(error.message));
    } else if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) setError(translateAuthError(error.message));
      else if (!data.session) setInfo("Conta criada! Enviamos um link de confirmação para o seu e-mail.");
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/nova-senha`,
      });
      if (error) setError(translateAuthError(error.message));
      else setInfo("Se existir uma conta com esse e-mail, você vai receber um link para criar uma nova senha.");
    }
    setBusy(false);
  }

  return (
    <AuthCard subtitle="Seu dia, suas contas, metas e hábitos.">
      {!isSupabaseConfigured && (
        <p className="mb-4 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-300">
          Supabase não configurado. Crie o arquivo <code>.env</code> a partir do <code>.env.example</code>.
        </p>
      )}

      {mode === "reset" ? (
        <div className="mb-5">
          <button
            type="button"
            onClick={() => switchMode("signin")}
            className="mb-3 flex items-center gap-1.5 text-sm text-muted transition hover:text-zinc-200"
          >
            <ArrowLeft className="size-4" /> Voltar para o login
          </button>
          <h2 className="text-xl font-bold">Recuperar senha</h2>
          <p className="mt-1 text-sm text-muted">Informe seu e-mail e enviaremos um link para criar uma nova senha.</p>
        </div>
      ) : (
        <div className="relative mb-6 grid grid-cols-2 rounded-2xl bg-bg p-1">
          {(["signin", "signup"] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => switchMode(m)}
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
      )}

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

        <AnimatePresence initial={false}>
          {mode !== "reset" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
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
              {mode === "signin" && (
                <button
                  type="button"
                  onClick={() => switchMode("reset")}
                  className="mt-2 text-sm text-muted transition hover:text-accent"
                >
                  Esqueci minha senha
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        <FormMessage error={error} info={info} />

        <Button type="submit" loading={busy} className="w-full">
          {mode === "signin" ? "Entrar" : mode === "signup" ? "Criar conta" : "Enviar link"}
        </Button>
      </form>
    </AuthCard>
  );
}
