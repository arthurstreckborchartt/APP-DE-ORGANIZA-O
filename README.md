# Organiza

App de organização pessoal: **Hoje** (3 prioridades), **Contas**, **Metas** e **Hábitos**.
Funciona como site (PC e celular) e como app Android (via Capacitor), no mesmo projeto.

**Stack:** React + TypeScript + Vite · Tailwind CSS · Motion (animações) · Supabase (login e banco) · Capacitor (Android).

## Rodando pela primeira vez

1. **Crie um projeto no [Supabase](https://supabase.com)** (plano gratuito serve).
2. **Crie as tabelas:** no painel, abra *SQL Editor → New query*, cole todo o conteúdo de
   `supabase/migrations/0001_init.sql` e clique em *Run*.
3. **Configure as chaves:** copie `.env.example` para `.env` e preencha com
   *Project Settings → API → Project URL* e a chave *anon public*.
4. **Instale e rode:**
   ```bash
   npm install
   npm run dev
   ```
   Abra o endereço que aparecer (normalmente http://localhost:5173).

> Por padrão o Supabase exige confirmação de e-mail no cadastro. Para testar mais rápido,
> dá para desligar em *Authentication → Sign In / Providers → Email → Confirm email*.

## Scripts

| Comando | O que faz |
|---|---|
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Checa tipos e gera a versão de produção em `dist/` |
| `npm test` | Roda os testes (Vitest) |

## Estrutura

```
src/
  auth/        login, sessão e proteção de rotas
  components/  layout (abas no celular, menu lateral no PC) e componentes de UI
  features/    uma pasta por tela: today, bills, goals, habits
  lib/         cliente Supabase e utilitários de data
  types/       tipos das tabelas
supabase/migrations/  SQL das tabelas e políticas RLS
```

## Segurança

Todas as tabelas têm **RLS** ligada: cada usuário só lê e altera as próprias linhas.
O `user_id` é preenchido pelo próprio banco (`auth.uid()`).
