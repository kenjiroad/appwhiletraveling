# Étape — Comptes + vraie ligue (Supabase)

_Date : 22 octobre 2026 · code prêt, en attente du projet Supabase de Kenji_

Jusqu'ici, la ligue était remplie de **joueurs fictifs**. Maintenant le code sait utiliser de **vrais comptes**
et une **vraie ligue** : tes pompes de la semaine contre celles des autres joueurs de Debout.

## Les mots à connaître

- **Supabase** : un service en ligne qui garde les données de l'app (une base de données + les comptes).
  Gratuit au départ. On choisit des serveurs en Europe (RGPD).
- **Connexion anonyme** : au premier lancement, l'app crée toute seule un compte, sans e-mail ni mot de passe.
  L'utilisateur ne voit rien. (« Se connecter avec Apple » viendra plus tard, pour retrouver son compte sur un
  nouveau téléphone.)
- **RLS (Row Level Security)** : des règles posées dans la base. Chacun ne peut lire et modifier **que ses
  propres lignes**. Pour la ligue, une fonction spéciale ne renvoie que le **prénom, le niveau et le score**
  des autres, jamais leur identifiant.
- **Clé « anon »** : la clé que l'app utilise pour parler à Supabase. Elle est **publique par nature** (elle
  est dans l'app que tout le monde télécharge) : c'est normal, ce sont les règles RLS qui protègent les
  données. À ne **jamais** mettre dans l'app : la clé `service_role` (elle passe outre les règles).

## Comment ça marche

1. Au lancement, l'app crée (ou retrouve) le compte anonyme.
2. À la fin de l'onboarding, elle envoie ton prénom ; à la fin de chaque défi, ton total du jour et ton niveau.
3. Sans réseau, rien ne bloque : la journée est gardée « en attente » et renvoyée au prochain lancement ou au
   prochain défi. On envoie le **total du jour** (pas un ajout), donc un renvoi ne compte jamais double.
4. L'onglet Ligue affiche d'abord ton score (tout de suite), puis le vrai classement de la semaine
   (lundi → dimanche, heure de Paris), top 50.

**Sans projet Supabase** (pas de fichier `app/.env`), l'app marche exactement comme avant : tout en local,
ligue de démo avec la mention « joueurs fictifs ».

## Ce que Kenji doit faire (10 minutes, sur ton Mac)

1. Va sur **supabase.com** → crée un compte → **New project**. Nom : `debout`. Région : **Europe (Paris
   ou Frankfurt)**. Note le mot de passe de la base quelque part (tu n'en auras pas besoin dans l'app).
2. Dans le projet : **SQL Editor** → **New query** → colle tout le fichier
   `app/supabase/migrations/0001_init.sql` → **Run**. Ça crée les tables, les règles et la ligue.
3. **Authentication** → **Sign In / Providers** (ou **Settings**) → active **« Allow anonymous sign-ins »**.
4. **Project Settings** → **API** : copie **Project URL** et la clé **anon public**.
5. Dans le dossier `app/` sur ton Mac, copie `.env.example` en `.env` et colle les deux valeurs.
   Ce fichier ne part pas sur GitHub (il est ignoré). **Ne colle pas la clé dans le chat.**
6. Relance `npx expo start` : l'onglet Ligue n'affiche plus les joueurs fictifs.

Pour le build EAS (l'app installée), il faudra aussi donner ces deux valeurs à EAS (variables
d'environnement du projet sur expo.dev). On le fera ensemble au moment du build.

## Fichiers

- `app/src/lib/supabase.ts` — connexion à Supabase, compte anonyme, session gardée dans le trousseau iOS.
- `app/src/lib/sync.ts` — envoi du profil et des journées en attente.
- `app/src/lib/league.ts` — vraie ligue si Supabase est configuré, sinon démo.
- `app/supabase/migrations/0001_init.sql` — tables `profiles` et `sessions`, règles RLS, fonction `weekly_league`.
- `app/.env.example` — modèle du fichier de clés.

## Pas encore fait / à vérifier

- Pas testé contre un vrai projet Supabase (il n'existe pas encore, et le réseau de l'environnement de
  Claude bloque supabase.co). Testé : le mode démo (identique à avant) et le mode « configuré mais hors
  ligne » (pas de plantage, la journée reste en attente).
- « Se connecter avec Apple » pour garder son compte en changeant de téléphone.
- Une ligue = tous les joueurs pour l'instant (top 50). Plus tard : groupes de 30 joueurs, montées et
  descentes Bronze → Argent → Or.
- Ajouter ses potes (code ami) pour une ligue privée.
