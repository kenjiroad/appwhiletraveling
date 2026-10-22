-- Debout — comptes + ligue de la semaine.
-- À coller une fois dans Supabase : SQL Editor → New query → Run.

-- 1. Un profil par compte (le compte est créé par la connexion anonyme de l'app).
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default 'Anonyme' check (char_length(name) between 1 and 40),
  level smallint not null default 1 check (level between 1 and 8),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 2. Une ligne par jour et par joueur : le total de répétitions du jour (l'app renvoie le total, pas un ajout,
--    donc renvoyer deux fois la même journée ne compte pas double).
create table if not exists public.sessions (
  user_id uuid not null references auth.users (id) on delete cascade,
  day date not null,
  reps integer not null default 0 check (reps between 0 and 5000),
  done boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, day)
);

-- 3. Sécurité (RLS) : chacun ne voit et ne modifie que ses propres lignes.
alter table public.profiles enable row level security;
alter table public.sessions enable row level security;

drop policy if exists "profil : lire le sien" on public.profiles;
drop policy if exists "profil : créer le sien" on public.profiles;
drop policy if exists "profil : modifier le sien" on public.profiles;
create policy "profil : lire le sien" on public.profiles for select to authenticated using (id = auth.uid());
create policy "profil : créer le sien" on public.profiles for insert to authenticated with check (id = auth.uid());
create policy "profil : modifier le sien" on public.profiles for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

drop policy if exists "séances : lire les siennes" on public.sessions;
drop policy if exists "séances : créer les siennes" on public.sessions;
drop policy if exists "séances : modifier les siennes" on public.sessions;
create policy "séances : lire les siennes" on public.sessions for select to authenticated using (user_id = auth.uid());
create policy "séances : créer les siennes" on public.sessions for insert to authenticated with check (user_id = auth.uid());
create policy "séances : modifier les siennes" on public.sessions for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

-- 4. La ligue : classement de la semaine en cours (lundi → dimanche, heure de Paris).
--    La fonction ne renvoie que le prénom, le niveau et le score : jamais l'identifiant des autres joueurs.
create or replace function public.weekly_league(max_players integer default 50)
returns table (name text, level smallint, week_reps bigint, is_me boolean)
language sql
stable
security definer
set search_path = public
as $$
  with week as (
    select date_trunc('week', now() at time zone 'Europe/Paris')::date as monday
  ),
  scores as (
    select p.id, p.name, p.level, coalesce(sum(s.reps), 0) as week_reps
    from public.profiles p
    left join public.sessions s
      on s.user_id = p.id and s.day >= (select monday from week) and s.day < (select monday from week) + 7
    group by p.id
  ),
  ranked as (
    select *, row_number() over (order by week_reps desc, name) as place from scores
  )
  select name, level, week_reps, id = auth.uid() as is_me
  from ranked
  where (week_reps > 0 and place <= least(max_players, 100)) or id = auth.uid()
  order by week_reps desc, name;
$$;

revoke all on function public.weekly_league(integer) from public, anon;
grant execute on function public.weekly_league(integer) to authenticated;
