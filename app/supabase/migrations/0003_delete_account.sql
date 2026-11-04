-- « Supprimer mon compte » (obligatoire pour Apple) : efface l'utilisateur connecté et, en cascade,
-- son profil, ses séances et sa nuit en cours. Appelé depuis l'app avec supabase.rpc('delete_my_account').

create or replace function public.delete_my_account()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  delete from public.sleep_activities where user_id = auth.uid();
  delete from public.sessions where user_id = auth.uid();
  delete from public.profiles where id = auth.uid();
  delete from auth.users where id = auth.uid();
end;
$$;

revoke all on function public.delete_my_account() from public, anon;
grant execute on function public.delete_my_account() to authenticated;
