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

  it("mantém mensagens desconhecidas", () => {
    expect(translateAuthError("Algo estranho")).toBe("Algo estranho");
  });
});
