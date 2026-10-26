# Journal de bord — chaque étape, dans l'ordre

On ajoute une ligne à chaque étape franchie. Le plus récent en bas.

## Étape 1 — Étude de marché ✅ (22/10/2026)
Analyse des classements US et des apps qui montent. 7 candidates comparées.
**Choix : refaire Ladder (musculation coachée en équipes) pour la France.**
→ Détails : [01-etude-de-marche.md](01-etude-de-marche.md)

## Étape 2 — Critères d'une bonne app ✅ (22/10/2026)
20 critères (idée, produit, lancement) + chiffres repères à viser.
→ Détails : [02-criteres-bonne-app.md](02-criteres-bonne-app.md)

## Étape 3 — Stack technique ✅ (22/10/2026)
Expo (React Native) + Supabase (UE) + RevenueCat + PostHog + Sentry.
Projet Expo SDK 58 créé dans `app/`, nom de travail **Cordée**, bundle id `fr.cordee.app`.
→ Détails : [03-stack-technique.md](03-stack-technique.md)

## Étape 4 — Feuille de route ✅ (22/10/2026)
Plan en 5 phases, de la validation au lancement (~12 semaines).
→ Détails : [04-feuille-de-route.md](04-feuille-de-route.md)

## Étape 5 — Changement de cap : apps qui se distribuent seules ✅ (22/10/2026)
Nouvelle règle : pas besoin de contacter qui que ce soit (pas de coachs). La distribution passe par
l'organique (slideshows TikTok faceless), puis par la pub ; les influenceurs viendront en phase 2.
Cordée est mise en pause. 5 nouvelles idées notées.
**Recommandation : app alternance IA** (modèle Sprout). Plan B : coach muscu IA gamifié (modèle Stronger).
→ Détails : [05-nouvelles-idees.md](05-nouvelles-idees.md)

## Étape 6 — Veille sur X ✅ (22/10/2026)
6 leçons des créateurs d'apps sur X (contenu > code, copier les gagnants, V1 en 7–14 jours, volume de
slideshows, agents IA pour le contenu, clipping payé à la vue = distribution sans contacter personne).
4 nouvelles idées notées. Recommandation inchangée : **app alternance IA** ; option fun : **app couple**.
→ Détails : [06-veille-x.md](06-veille-x.md)

## Étape 7 — App en 1 jour : « Ménage » ✅ (22/10/2026)
Nouveau cahier des charges : l'app doit se coder en 1 jour, être fun, gagner de l'argent vite et ne dépendre de personne.
Choix : **nettoyeur de photos par swipe** (modèle Swipewipe, racheté par le français MWM).
V1 codée : onboarding, liste des mois, swipe, suppression, partage du score, paywall (paiement factice).
TypeScript, lint et compilation iOS OK. Reste à faire : test sur iPhone, compte Apple, RevenueCat, publication.
→ Détails : [07-app-en-1-jour.md](07-app-en-1-jour.md)

> Ménage a été abandonnée (idée pas assez forte) : son code reste dans l'historique git.

## Étape 8 — Partir de la douleur, viser un démarrage rapide ✅ (22/10/2026)
Analyse des douleurs des Français et des apps **récentes** qui ont démarré vite (Starter Story).
Catégorie retenue : **discipline avec preuve physique vérifiée par l'IA**.
→ Détails : [08-recherche-douleurs-et-choix.md](08-recherche-douleurs-et-choix.md)

## Étape 9 — Debout V1 ✅ (22/10/2026)
Réveil qui ne s'arrête qu'avec des pompes ou des squats comptés par la caméra (Apple Vision, sur le téléphone).
Onboarding, accueil, défi caméra, série, partage, paywall (factice). Mode démo dans Expo Go.
Le Swift n'est pas encore compilé (pas de Mac ici) : ce sera fait au premier build EAS.
→ Détails : [09-debout-v1.md](09-debout-v1.md)

## Étape 10 — Nouvelle DA + gamification ✅ (22/10/2026)
Refonte complète : style néon/Bricolage Grotesque, XP, 8 rangs d'évolution (😴 → 👑), écran « ÉVOLUTION ! »,
ligue hebdo avec podium (joueurs fictifs en attendant les comptes), onglets Réveil / Ligue / Évolution.
→ Détails : [10-direction-artistique.md](10-direction-artistique.md)

## Étape 11 — Design & marketing, méthode Floup ✅ (22/10/2026)
Méthode du skill design-marketing (exemple Floup) appliquée à Debout : réflexion produit/marketing,
audit de la DA face à la recette premium, plan de DA (signature « l'aube », mascotte qui évolue),
livrables prévus (planche de maquettes, dossier produit avec PRD léger), CLAUDE.md du projet.
→ Détails : [11-design-marketing-debout.md](11-design-marketing-debout.md)

## Étape 12 — DA premium « Aube » + animations ✅ (22/10/2026)
La DA néon « faisait trop Discord » : passage à la DA premium. Signature « l'aube » (le ciel se lève
pendant le défi), niveaux en soleils levants, verre dépoli, serif italique, pilule flottante, animations partout.
→ Détails : [12-da-aube.md](12-da-aube.md)

## Étape 13 — La mascotte ✅ (22/10/2026)
Marmotte 3D (piste A) générée avec Higgsfield : 8 niveaux d'évolution + 6 poses, détourées et intégrées
partout dans l'app avec des animations (respire, saute à chaque pompe, silhouettes mystère).
→ Détails : [13-mascotte.md](13-mascotte.md)

## Étape 14 — DA validée par Kenji ✅ (22/10/2026)
DA « Aube » + mascotte validées. On passe à la technique.

## Carnet de bord + finances ✅ (22/10/2026)
Page « jour par jour » + tout ce que l'app coûte (Apple 99 €/an payé, 46 crédits Higgsfield ≈ 2,30 $, outils 100 € + 59 $ par mois).
→ Détails : [14-carnet-de-bord.md](14-carnet-de-bord.md)

## Comptes + vraie ligue — code prêt ✅ (22/10/2026)
Supabase : compte anonyme créé au lancement, séances envoyées (avec renvoi si hors ligne), vraie ligue de la semaine.
Sans fichier `app/.env`, l'app reste en mode démo comme avant. Reste à Kenji : créer le projet Supabase (10 min).
→ Détails : [15-comptes-et-ligue.md](15-comptes-et-ligue.md)

## Vrai réveil (AlarmKit) — code prêt ✅ (22/10/2026)
Sur iOS 26, Debout sonne comme l'app Horloge, même en silencieux. « Mes pompes » ouvre le défi ;
« Arrêter » ne coupe que 2 minutes. Notifications gardées en secours. À tester au premier build.
→ Détails : [16-reveil-alarmkit.md](16-reveil-alarmkit.md)

## Abonnements (RevenueCat) — code prêt ✅ (26/10/2026)
Vrais achats via RevenueCat : prix de l'App Store, achat, restauration, lien avec le compte Supabase.
Sans clé, achats factices comme avant. Reste à Kenji : App Store Connect + RevenueCat (voir doc).
Décision : paywall obligatoire (essai 3 jours puis abonnement, comme Erly).
→ Détails : [17-abonnements-revenuecat.md](17-abonnements-revenuecat.md)

## Étape 15 — Compte Apple Developer + premier build EAS (à faire)
