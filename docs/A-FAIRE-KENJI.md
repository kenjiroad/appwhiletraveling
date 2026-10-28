# À faire — Kenji

Ta liste perso, dans l'ordre. Je la mets à jour à chaque étape.

## Maintenant : l'app sur ton iPhone

- [x] **Enregistrer l’iPhone (QR code n°1)** ✅ 28/10 : dans le dossier `app`, `npx eas-cli device:create` → **Website**
      → scanner avec l'appareil photo → Safari → **Download Provisioning Profile** → **Autoriser** →
      Réglages → **Profil téléchargé** → **Installer** (attendre l'heure de sécurité si demandée).
- [x] **Premier build (QR code n°2)** ✅ 28/10 — réussi, app installée : `npx eas-cli build --profile preview --platform ios` → **Y** à tout →
      20 min → scanner le QR code → **Installer**. Raté ? expo.dev → projet debout → **Builds**.
- [x] Mode développeur activé ✅ 28/10
- [x] Premier test fait ✅ 28/10 (retours corrigés : voir [20-retours-premier-test.md](20-retours-premier-test.md))
- [ ] Installer le **nouveau build** (corrections caméra, réveil, roue de l'heure) : expo.dev → debout → **Builds**
      (ou **Workflows**) ; s'il n'y en a pas : **Build from GitHub** → branche `claude/compassionate-goldberg-gfgu0j`, iOS, `preview`.
- [ ] Réglages → **Vérifier le réveil** : envoyer une capture à Claude, puis **Tester dans 1 minute** (téléphone verrouillé).
- [ ] Pompes **de face** : dire si ça compte bien.
- [ ] Préciser le « petit défaut » de la première page (capture).

## Ensuite : les mises à jour automatiques

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
