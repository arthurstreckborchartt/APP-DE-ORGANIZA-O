import { describe, expect, it } from "vitest";
import { translateAuthError } from "./authErrors";

describe("translateAuthError", () => {
  it("traduz erros conhecidos", () => {
    expect(translateAuthError("Invalid login credentials")).toBe("E-mail ou senha incorretos.");
    expect(translateAuthError("User already registered")).toBe("Já existe uma conta com esse e-mail.");
  });

  it("explica erros de configuração do Supabase", () => {
    expect(translateAuthError("Invalid path specified in request URL")).toContain("Endereço do Supabase incorreto");
    expect(translateAuthError("Invalid API key")).toContain("Chave do Supabase incorreta");
  });

  it("traduz erros da recuperação de senha", () => {
    expect(translateAuthError("otp_expired")).toBe("O link expirou ou já foi usado. Peça um novo.");
    expect(translateAuthError("Auth session missing!")).toBe("O link expirou ou já foi usado. Peça um novo.");
    expect(translateAuthError("New password should be different from the old password.")).toBe(
      "A nova senha precisa ser diferente da atual.",
    );
    expect(translateAuthError("For security purposes, you can only request this after 42 seconds.")).toBe(
      "Aguarde alguns segundos antes de pedir outro link.",
    );
  });

  it("mantém mensagens desconhecidas", () => {
    expect(translateAuthError("Algo estranho")).toBe("Algo estranho");
  });
});
