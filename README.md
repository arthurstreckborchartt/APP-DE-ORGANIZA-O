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
| `npm run android` | Gera o build, copia para o projeto Android e abre no Android Studio |
| `npm run android:sync` | Só gera o build e copia para o projeto Android |

## App Android

O mesmo código vira app Android com o [Capacitor](https://capacitorjs.com). O projeto nativo fica em `android/`.

**Pré-requisitos (uma vez só):**
1. Instale o [Android Studio](https://developer.android.com/studio). Ele já traz o SDK e o Java.
2. Tenha o `.env` configurado (as chaves do Supabase entram no app no momento do build).

**Rodar no celular ou emulador:**
1. `npm run android`. Isso compila o site, copia para `android/` e abre o Android Studio.
2. No celular, ative *Opções do desenvolvedor → Depuração USB* e conecte no PC
   (ou crie um emulador em *Device Manager*).
3. No Android Studio, clique em ▶ *Run*.

**Gerar o APK para instalar sem cabo:**
*Build → Generate App Bundles or APKs → Generate APKs*. O arquivo sai em
`android/app/build/outputs/apk/debug/app-debug.apk`. Mande para o celular e instale
(o Android pede para permitir "fontes desconhecidas").

**Sempre que mudar o código:** rode `npm run android:sync` (ou `npm run android`) antes de rodar de novo.

**Ícone e tela de abertura:** as imagens-fonte ficam em `assets/`. Depois de trocar, rode
`npx @capacitor/assets generate --android --iconBackgroundColor '#0b0b12' --splashBackgroundColor '#0b0b12' --splashBackgroundColorDark '#0b0b12'`.

**Antes de publicar na Play Store:** troque o `appId` em `capacitor.config.ts` e o
`applicationId` em `android/app/build.gradle` (hoje `br.com.organiza.app`). Depois de publicado, ele não muda mais.

> **Confirmação de e-mail no celular:** o link de confirmação abre no navegador. Depois de confirmar,
> volte ao app e entre normalmente. Em *Authentication → URL Configuration → Site URL* do Supabase,
> coloque o endereço onde o site estiver publicado.

## Estrutura

```
src/
  auth/        login, sessão e proteção de rotas
  components/  layout (abas no celular, menu lateral no PC) e componentes de UI
  features/    uma pasta por tela: today, bills, goals, habits
  lib/         cliente Supabase e utilitários de data
  types/       tipos das tabelas
supabase/migrations/  SQL das tabelas e políticas RLS
android/     projeto nativo Android (gerado pelo Capacitor)
assets/      imagens-fonte do ícone e da tela de abertura
```

## Segurança

Todas as tabelas têm **RLS** ligada: cada usuário só lê e altera as próprias linhas.
O `user_id` é preenchido pelo próprio banco (`auth.uid()`).
