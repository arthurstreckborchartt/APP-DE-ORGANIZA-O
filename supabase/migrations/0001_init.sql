-- Organiza — esquema inicial
-- Rode este arquivo inteiro no painel do Supabase: SQL Editor > New query > Run.
-- Toda tabela tem user_id preenchido automaticamente com o usuário logado,
-- e a RLS garante que cada pessoa só lê e altera as próprias linhas.

-- ---------------------------------------------------------------------------
-- Hoje: até 3 prioridades por dia
-- ---------------------------------------------------------------------------
create table public.priorities (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  day         date not null,
  position    smallint not null check (position between 1 and 3),
  title       text not null check (char_length(title) between 1 and 200),
  done        boolean not null default false,
  created_at  timestamptz not null default now(),
  unique (user_id, day, position)
);

-- ---------------------------------------------------------------------------
-- Contas a pagar
-- ---------------------------------------------------------------------------
create table public.bills (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 120),
  amount      numeric(12, 2) not null check (amount >= 0),
  due_date    date not null,
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);
create index bills_user_due_idx on public.bills (user_id, due_date);

-- ---------------------------------------------------------------------------
-- Metas, cada uma com o próximo passo
-- ---------------------------------------------------------------------------
create table public.goals (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  title       text not null check (char_length(title) between 1 and 160),
  next_step   text check (char_length(next_step) <= 200),
  status      text not null default 'active' check (status in ('active', 'done', 'archived')),
  created_at  timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Hábitos e os dias em que foram feitos
-- ---------------------------------------------------------------------------
create table public.habits (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null check (char_length(name) between 1 and 80),
  archived    boolean not null default false,
  created_at  timestamptz not null default now()
);

create table public.habit_logs (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  habit_id    uuid not null references public.habits (id) on delete cascade,
  day         date not null,
  unique (habit_id, day)
);
create index habit_logs_user_day_idx on public.habit_logs (user_id, day);

-- ---------------------------------------------------------------------------
-- RLS: cada usuário só enxerga e altera os próprios dados
-- ---------------------------------------------------------------------------
alter table public.priorities enable row level security;
alter table public.bills      enable row level security;
alter table public.goals      enable row level security;
alter table public.habits     enable row level security;
alter table public.habit_logs enable row level security;

create policy "own rows" on public.priorities
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own rows" on public.bills
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own rows" on public.goals
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

create policy "own rows" on public.habits
  for all using (user_id = auth.uid()) with check (user_id = auth.uid());

-- Além de ser dono do registro, o hábito referenciado também precisa ser seu.
create policy "own rows" on public.habit_logs
  for all
  using (user_id = auth.uid())
  with check (
    user_id = auth.uid()
    and exists (
      select 1 from public.habits h
      where h.id = habit_id and h.user_id = auth.uid()
    )
  );
