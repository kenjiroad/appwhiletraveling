-- Debout — une seule ligue où l'on voit TOUS les joueurs (19/11/2026).
-- À coller une fois dans Supabase : SQL Editor → New query → Run. Rien à changer dans l'app.
--
-- Avant : la ligue ne montrait que les joueurs qui avaient fait au moins une répétition cette semaine (plus soi).
-- Un ami qui venait d'installer l'app restait donc invisible jusqu'à son premier défi.
-- Maintenant : tout le monde apparaît, même à 0, classé par répétitions de la semaine (lundi → dimanche, heure de
-- Paris), dans la limite des 50 premiers (plus soi, toujours).

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
  where place <= least(max_players, 100) or id = auth.uid()
  order by week_reps desc, name;
$$;

revoke all on function public.weekly_league(integer) from public, anon;
grant execute on function public.weekly_league(integer) to authenticated;
