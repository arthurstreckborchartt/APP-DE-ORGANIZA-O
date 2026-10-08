/** Traduz as mensagens mais comuns do Supabase Auth. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (m.includes("user already registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "E-mail inválido.";
  if (m.includes("rate limit")) return "Muitas tentativas. Espere um pouco e tente de novo.";
  if (m.includes("failed to fetch")) return "Sem conexão com o servidor.";
  return message;
}
