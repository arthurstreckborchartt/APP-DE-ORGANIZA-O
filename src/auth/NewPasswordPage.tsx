import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Spinner } from "@/components/ui/Spinner";
import { useAuth } from "./AuthProvider";
import { translateAuthError } from "./authErrors";
import { AuthCard, FormMessage } from "./AuthCard";

/** Tela aberta pelo link de "esqueci minha senha" recebido por e-mail. */
export function NewPasswordPage() {
  const { session, loading, endRecovery } = useAuth();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password.length < 6) return setError("A senha precisa ter pelo menos 6 caracteres.");
    if (password !== confirm) return setError("As senhas não são iguais.");
    setBusy(true);
    setError(null);
    const { error } = await supabase.auth.updateUser({ password });
    setBusy(false);
    if (error) return setError(translateAuthError(error.message));
    setDone(true);
    endRecovery();
    setTimeout(() => navigate("/", { replace: true }), 1500);
  }

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center">
        <Spinner />
      </div>
    );
  }

  if (!session) {
    return (
      <AuthCard subtitle="Criar nova senha">
        <p className="mb-5 text-sm text-muted">
          Este link expirou ou já foi usado. Peça um novo na tela de login, em “Esqueci minha senha”.
        </p>
        <Link
          to="/login"
          className="flex h-12 items-center justify-center rounded-2xl bg-gradient-to-r from-accent to-accent-2 font-semibold text-white"
        >
          Ir para o login
        </Link>
      </AuthCard>
    );
  }

  if (done) {
    return (
      <AuthCard subtitle="Criar nova senha">
        <div className="flex flex-col items-center py-4 text-center">
          <CheckCircle2 className="mb-3 size-10 text-emerald-400" />
          <p className="font-semibold">Senha alterada!</p>
          <p className="text-sm text-muted">Entrando no app…</p>
        </div>
      </AuthCard>
    );
  }

  return (
    <AuthCard subtitle="Criar nova senha">
      <p className="mb-5 text-sm text-muted">
        Conta: <span className="text-zinc-200">{session.user.email}</span>
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nova senha"
          name="new-password"
          type="password"
          autoComplete="new-password"
          autoFocus
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Mínimo 6 caracteres"
        />
        <Input
          label="Confirme a nova senha"
          name="confirm-password"
          type="password"
          autoComplete="new-password"
          required
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
        />
        <FormMessage error={error} />
        <Button type="submit" loading={busy} className="w-full">
          Salvar nova senha
        </Button>
      </form>
    </AuthCard>
  );
}
