/** Traduz as mensagens mais comuns do Supabase Auth. */
export function translateAuthError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login credentials")) return "E-mail ou senha incorretos.";
  if (m.includes("email not confirmed")) return "Confirme seu e-mail antes de entrar (veja sua caixa de entrada).";
  if (m.includes("user already registered")) return "Já existe uma conta com esse e-mail.";
  if (m.includes("password should be at least")) return "A senha precisa ter pelo menos 6 caracteres.";
  if (m.includes("unable to validate email") || m.includes("invalid email")) return "E-mail inválido.";
  if (m.includes("otp_expired") || m.includes("auth session missing") || m.includes("link is invalid"))
    return "O link expirou ou já foi usado. Peça um novo.";
  if (m.includes("should be different from the old password")) return "A nova senha precisa ser diferente da atual.";
  if (m.includes("for security purposes")) return "Aguarde alguns segundos antes de pedir outro link.";
  if (m.includes("rate limit")) return "Muitas tentativas. Espere um pouco e tente de novo.";
  if (m.includes("invalid path specified"))
    return "Endereço do Supabase incorreto. No .env, use só https://SEU-PROJETO.supabase.co e reinicie o npm run dev.";
  if (m.includes("invalid api key")) return "Chave do Supabase incorreta. Confira a VITE_SUPABASE_ANON_KEY no .env.";
  if (m.includes("failed to fetch")) return "Sem conexão com o servidor.";
  return message;
}
