# À faire — Kenji

Ta liste perso, dans l'ordre. Je la mets à jour à chaque étape.

## 🚀 Lancement App Store (depuis le 04/11)

- [x] Le réveil sonne et ne s'arrête qu'avec les pompes ✅ 04/11
- [ ] App Store Connect → **Accords, taxes et banque** : accord « Applications payantes » + compte bancaire + fiscalité
- [ ] App Store Connect → **Apps → + → Nouvelle app** (nom « Debout » ; s'il est pris : « Debout – Réveil Pompes »),
      identifiant `fr.debout.app`, SKU `debout`
- [ ] Abonnements : groupe « Debout Pro », `debout_pro_yearly` 29,99 €/an + offre gratuite **1 semaine**,
      `debout_pro_monthly` 7,99 €/mois (voir [17-abonnements-revenuecat.md](17-abonnements-revenuecat.md))
- [ ] RevenueCat + clé publique `appl_…` dans expo.dev → Environment variables
- [ ] Supabase (vraie ligue) + 2 variables dans expo.dev
- [ ] Build Store : `npx eas-cli build --profile production --platform ios --auto-submit`
- [ ] TestFlight : tester réveil, défi, achat (compte Sandbox)
- [ ] Fiche App Store (textes + captures préparés par Claude) → **Soumettre pour vérification**

## Maintenant : l'app sur ton iPhone

- [x] **Enregistrer l’iPhone (QR code n°1)** ✅ 28/10 : dans le dossier `app`, `npx eas-cli device:create` → **Website**
      → scanner avec l'appareil photo → Safari → **Download Provisioning Profile** → **Autoriser** →
      Réglages → **Profil téléchargé** → **Installer** (attendre l'heure de sécurité si demandée).
- [x] **Premier build (QR code n°2)** ✅ 28/10 — réussi, app installée : `npx eas-cli build --profile preview --platform ios` → **Y** à tout →
      20 min → scanner le QR code → **Installer**. Raté ? expo.dev → projet debout → **Builds**.
- [x] Mode développeur activé ✅ 28/10
- [x] Premier test fait ✅ 28/10 (retours corrigés : voir [20-retours-premier-test.md](20-retours-premier-test.md))
- [x] Nouveau build installé ✅ 29/10 (corrections caméra, réveil, roue de l'heure) : expo.dev → debout → **Builds**
      (ou **Workflows**) ; s'il n'y en a pas : **Build from GitHub** → branche `claude/compassionate-goldberg-gfgu0j`, iOS, `preview`.
- [ ] Réglages → **Vérifier le réveil** : envoyer une capture à Claude, puis **Tester dans 1 minute** (téléphone verrouillé).
- [x] Pompes de face : ça marche ✅ 29/10
- [ ] Préciser le « petit défaut » de la première page (capture).

## Dans l'ordre (01/11) : logo → Supabase → un seul build

- [x] **Logo choisi : C** ✅ 01/11 (version C2 intégrée ; dire « C1 » pour changer, voir `design/marque/logo/planche-c.png`).
- [ ] **Supabase** (15 min) : projet + 2 fichiers SQL + connexion anonyme + 2 variables sur expo.dev.
- [ ] **Un seul build** ensuite, qui contient tout (logo, comptes, marmotte de nuit…).

## Pour le prochain build (joker, story, marmotte de nuit)

- [ ] Réglages → **Vérifier le réveil** : capture à Claude (pour comprendre pourquoi l'alarme n'a pas sonné).
- [ ] **Apple Team ID** : developer.apple.com/account → **Membership details** → Team ID (pas secret, en texte).
      ⚠️ Le fichier `AuthKey_….p8` envoyé le 01/11 n'était pas le Team ID mais une clé de push : supprimée ✅.
- [ ] Puis nouveau build depuis le Terminal (nouveau ZIP → `cd …/app` → `npm install` →
      `npx eas-cli build --profile preview --platform ios`) : Apple redemande ton identifiant pour la nouvelle extension.
- [ ] Tester : « Bonne nuit 🌙 » le soir + écran verrouillé, story après le défi, « Toujours debout ? », « Malade ou blessé ? ».

## La marmotte qui avance la nuit (voir [22-marmotte-qui-avance.md](22-marmotte-qui-avance.md))

- [ ] Envoyer à Claude 2-3 **références** d'écran verrouillé (Uber, Flighty, Dribbble) + capture de la version actuelle.
- [ ] Créer le projet **Supabase** (10 min, [15-comptes-et-ligue.md](15-comptes-et-ligue.md)) + coller `0002_sleep_activities.sql`.
- [ ] Créer une **nouvelle clé de push Apple** (l'ancienne a été supprimée) et la mettre dans les secrets Supabase.
- [ ] Déployer la fonction `sleep-tick` + tâche Cron toutes les 10 min (ou laisser Claude le faire).

## Étape 3 : bloquer les apps (Temps d'écran)

- [ ] Demander à Apple l'autorisation « Family Controls » (formulaire sur le site Apple Developer, délai de
      plusieurs jours) : Claude te guidera le moment venu.

## Ensuite : les mises à jour automatiques (Claude build tout seul)

- [ ] Créer un jeton Expo : expo.dev → Account settings → **Access tokens** → Create. Le mettre dans les réglages
      de l'environnement Claude sous le nom `EXPO_TOKEN` (jamais dans le chat).
- [ ] Autoriser les domaines `expo.dev`, `api.expo.dev`, `u.expo.dev`, `storage.googleapis.com`
      (Network access → Allowed domains).

- [x] Envoyer à Claude le **Project ID** ✅ 28/10
- [x] GitHub connecté sur expo.dev ✅ 28/10 (à vérifier : **Base directory** = `app`)
- [ ] Installer le build automatique qui suivra (expo.dev → Builds). Ensuite : plus rien à faire, les mises à jour
      arrivent toutes seules au lancement de l'app.

## Sécurité (urgent)

- [ ] Changer les clés exposées dans la capture : TrustMRR, Perplexity, Cal.com, clé Google/YouTube, secret
      Google OAuth (`GOCSPX-`). Puis `claude mcp remove trustmrr` / `perplexity` et les rajouter.
- [ ] Ranger les nouvelles clés dans l'app **Mots de passe**, les supprimer de Notes.

## Plus tard

- [ ] Supabase (10 min) : voir [15-comptes-et-ligue.md](15-comptes-et-ligue.md).
- [ ] App Store Connect + RevenueCat : voir [17-abonnements-revenuecat.md](17-abonnements-revenuecat.md).
- [ ] Statut pour vendre (micro-entreprise ?) : demander à un comptable.
