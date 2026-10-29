# Debout — contexte du projet

App iOS grand public de Kenji : **le réveil qui ne s'arrête que quand tu fais tes pompes ou tes
squats**, comptés par l'IA de la caméra (Apple Vision, sur le téléphone). Marché : France, 18–35 ans.
Construite en voyageant, sans Mac : Expo + EAS Build.

- App : `app/` (Expo SDK 58, Expo Router, TypeScript). Module natif de comptage : `app/modules/rep-counter/`.
- Liste de ce que Kenji doit faire : `docs/A-FAIRE-KENJI.md` (à tenir à jour et à lui rappeler).
- Étapes et décisions : `docs/00-journal.md` (une ligne par étape). Design & marketing : `docs/11-design-marketing-debout.md`.
- Tout écrire en français, simplement. Kenji débute : expliquer les termes techniques.

## Règles de travail

- **Ne rien lancer sans le feu vert de Kenji** quand il s'agit d'une nouvelle direction (il l'a demandé le 22/10/2026).
- Chaque étape terminée est écrite dans `docs/` et ajoutée au journal.
- Ne jamais présenter un chiffre inventé comme une prévision ; sourcer les chiffres de marché.
- TrustMRR : API seulement pour des tendances par catégorie (leurs conditions interdisent de chercher des apps à copier).

## Décisions

- 22/10/2026 — Idée retenue : Debout (après Cordée, Ménage, alternance, Écho…). Voir `docs/08`.
- 22/10/2026 — Stack : Expo + EAS (pas de Mac), Supabase (UE) pour les comptes, RevenueCat pour les abonnements.
- 22/10/2026 — DA « néon » rejetée (« trop Discord ») → DA premium « Aube » + animations (`docs/12`). Gamification gardée.
- 22/10/2026 — Mascotte : marmotte 3D (piste A), 8 niveaux + 6 poses, dans `app/assets/mascot/` (`docs/13`).
- 22/10/2026 — DA « Aube » + mascotte **validées** par Kenji.
- 26/10/2026 — Paywall **obligatoire** (option A, comme Erly) : essai 3 jours puis abonnement (`docs/17`).
- 29/10/2026 — Feu vert : joker de série, story à partager, « Toujours debout ? », sortie de secours, rappel du coucher + Activité en direct « sommeil » (`docs/21`). Blocage des apps = étape 3.
- 22/10/2026 — Ordre : valider la DA → compte Apple Developer + premier build EAS → comptes + vraie ligue → AlarmKit + RevenueCat.

## À confirmer (🟡)

- 🟡 Vérifier les conditions d'usage commercial des images Higgsfield (mascotte) avant le lancement.
- 🟡 Prix : 29,99 €/an (3 jours gratuits), 7,99 €/mois.
- 🟡 Liens Conditions d'utilisation + Politique de confidentialité à rédiger avant l'envoi à Apple.
- 🟡 Statut pour vendre (micro-entreprise ?) : à vérifier avec un comptable.
- 🟡 Code Swift compilé au 1er build EAS (28/10) ✅. Extension « sommeil » (Live Activity) jamais compilée ; Apple Team ID à ajouter dans `app.json`.
- 🟡 La ligue utilise des joueurs fictifs tant que le projet Supabase n'est pas créé (code prêt : `docs/15`). Sign in with Apple : plus tard.
