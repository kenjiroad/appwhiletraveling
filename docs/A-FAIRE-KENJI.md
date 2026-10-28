# À faire — Kenji

Ta liste perso, dans l'ordre. Je la mets à jour à chaque étape.

## Maintenant : l'app sur ton iPhone

- [x] **Enregistrer l’iPhone (QR code n°1)** ✅ 28/10 : dans le dossier `app`, `npx eas-cli device:create` → **Website**
      → scanner avec l'appareil photo → Safari → **Download Provisioning Profile** → **Autoriser** →
      Réglages → **Profil téléchargé** → **Installer** (attendre l'heure de sécurité si demandée).
- [x] **Premier build (QR code n°2)** ✅ 28/10 — réussi, app installée : `npx eas-cli build --profile preview --platform ios` → **Y** à tout →
      20 min → scanner le QR code → **Installer**. Raté ? expo.dev → projet debout → **Builds**.
- [ ] Si l'app ne s'ouvre pas : Réglages → Confidentialité et sécurité → **Mode développeur**.
- [ ] Tester : onboarding, défi avec la vraie caméra, un réveil 2 minutes plus tard → dire à Claude ce qui marche.

## Ensuite : les mises à jour automatiques

- [x] Envoyer à Claude le **Project ID** ✅ 28/10
- [ ] expo.dev → projet debout → **Project settings** → **GitHub** → connecter `kenjiroad/appwhiletraveling`,
      **Base directory** : `app`.
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
