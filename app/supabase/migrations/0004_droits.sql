-- Debout — droits d'accès des comptes de l'app sur les tables (19/11/2026).
-- À coller une fois dans Supabase : SQL Editor → New query → Run.
--
-- Pourquoi : les règles de sécurité (RLS) des fichiers 0001 et 0002 disent QUI peut lire ou écrire QUELLE ligne,
-- mais les nouveaux projets Supabase ne donnent plus forcément le droit de base d'utiliser les tables. Sans ces
-- lignes, les comptes se créent mais le pseudo et les séances sont refusés : la table `profiles` reste vide et la
-- ligue ne montre que soi-même. Ces droits ne contournent pas la RLS : chacun ne touche toujours que ses lignes.

grant usage on schema public to authenticated;

grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.sessions to authenticated;
grant select, insert, update, delete on public.sleep_activities to authenticated;
