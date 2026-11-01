-- La marmotte qui avance pendant la nuit (Activité en direct sur l'écran verrouillé).
-- L'app enregistre ici le « jeton push » de l'activité + les heures de la nuit ; la fonction
-- `sleep-tick`, lancée toutes les 10 minutes, envoie à chaque iPhone la nouvelle position de la marmotte.

create table if not exists public.sleep_activities (
  user_id uuid primary key references auth.users (id) on delete cascade,
  push_token text not null,
  bedtime_at timestamptz not null,
  alarm_at timestamptz not null,
  updated_at timestamptz not null default now()
);

alter table public.sleep_activities enable row level security;

-- Chacun ne touche qu'à sa propre nuit. La fonction serveur, elle, passe par la clé « service_role ».
create policy "nuit : lire la sienne" on public.sleep_activities for select to authenticated using (user_id = auth.uid());
create policy "nuit : créer la sienne" on public.sleep_activities for insert to authenticated with check (user_id = auth.uid());
create policy "nuit : modifier la sienne" on public.sleep_activities for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "nuit : supprimer la sienne" on public.sleep_activities for delete to authenticated using (user_id = auth.uid());
