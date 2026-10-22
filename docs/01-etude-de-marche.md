# Étape 1 — Étude de marché : quelle app US copier pour la France ?

_Date : 22 octobre 2026_

## Méthode

1. Regarder les classements US (Top Gratuit, Top Revenus) et les apps qui montent le plus vite.
2. Écarter les apps impossibles à copier seul (ChatGPT, TikTok, YouTube, Meta…).
3. Pour chaque candidate restante, vérifier :
   - Est-ce qu'elle gagne vraiment de l'argent (abonnement) ?
   - Existe-t-elle déjà en français / en France ?
   - Un débutant peut-il construire la V1 en 2–3 mois ?
4. Noter avec la grille de critères (voir `02-criteres-bonne-app.md`) et choisir.

> Limite : les classements officiels Apple étaient bloqués par le réseau de cet environnement.
> Les chiffres ci-dessous viennent d'articles et d'estimations tierces (Sensor Tower, AppMagic,
> RevenueCat, presse). Ce sont des ordres de grandeur, pas des chiffres officiels.

## Ce que montrent les classements US (octobre 2026)

- **Top revenus US** : ChatGPT n°1 (22 jours de suite début octobre), puis YouTube, TikTok. Claude est dans le top 10.
- **Top gratuit US** : Muse (Meta), **Vinted**, ChatGPT.
- **Montées rapides** : apps de « micro-dramas » (DramaBox, ShortMax, NetShort), apps de revente (Vinted, Depop, Whatnot).
- **Santé & Fitness** : **Ladder** était l'app fitness n°1 mondiale en revenus en janvier 2026 (AppMagic/Statista), estimée entre 3,9 et 23,8 M$/mois en octobre 2026 (AppGazers, 3e de sa catégorie).

## Candidates étudiées

| App US | Ce qu'elle fait | Revenus / traction | Existe déjà en France ? | Faisable seul ? | Verdict |
|---|---|---|---|---|---|
| **Ladder** | Musculation guidée par des coachs, en « équipes », nouveau programme chaque semaine | ~150 000 abonnés payants fin 2024 (x3 en un an), 29,99 $/mois, n°1 fitness mondial en revenus jan. 2026 | **Non** — anglais uniquement, pays principaux : US, UK, Canada | Oui (app = lecteur d'entraînements + chat + abonnement) | ✅ **Choisie** |
| Opal | Bloque les apps pour réduire le temps d'écran | 10 M$ ARR, 1 M d'utilisateurs actifs/jour, 11 personnes | Oui : **Jomo** (app française) + Opal traduite | Moyen (API Screen Time d'Apple, autorisation spéciale) | ❌ déjà pris |
| Cal AI | Photo du repas → calories par IA | Racheté par MyFitnessPal (2026) | Oui : **Foodvisor** est française | Oui | ❌ déjà pris |
| Partiful | Invitations de soirées | +400 % utilisateurs/an (2025) | Non | Oui | ❌ gratuit, pas de revenus, effet réseau difficile |
| Hallow | Prière catholique, abonnement | Très gros aux US | Oui : **Hozana** ; marché plus petit (France laïque) | Oui | ❌ |
| Vinted | Revente de vêtements | n°2 Top gratuit US | **C'est une app lituanienne déjà n°1 en France** | Non | ❌ |
| DramaBox / ShortMax | Séries verticales de 1 min | En forte montée | Partiellement | Non (il faut produire des séries) | ❌ trop cher |

## Décision : on fait le « Ladder français »

**Pourquoi Ladder :**

1. **Ça rapporte vraiment** : abonnement cher (~30 $/mois) et des centaines de milliers d'abonnés. Les gens paient pour un coach.
2. **Personne ne le fait en France** : Ladder est en anglais seulement. Les apps françaises existantes (SP Training, apps d'influenceuses fitness, Fizzup) sont soit des carnets de suivi, soit des programmes maison d'un seul coach — pas de concept « choisis ton coach, rejoins son équipe ».
3. **La tendance est forte** : la musculation explose chez les 18–40 ans, en France comme aux US.
4. **Faisable par un débutant** : la partie technique est simple (vidéos courtes, minuteur, chat, paiement). Le vrai travail, c'est le contenu des coachs — et on peut démarrer avec **1 à 3 coachs** français.
5. **Distribution intégrée** : chaque coach a déjà une audience Instagram/TikTok. Ils ramènent leurs abonnés dans l'app contre une part des revenus.

**Le concept en une phrase :**
> Choisis ton coach, rejoins son équipe, reçois ton programme de muscu chaque dimanche — en français.

**Nom de travail : _Cordée_** (une cordée = une équipe en montagne, on grimpe ensemble, comme une « ladder »). À valider (disponibilité App Store, nom de domaine, INPI).

## Risques identifiés

- **Il faut des coachs** : sans coach, pas de contenu. → Action prioritaire : trouver 1 coach partenaire avant d'écrire trop de code.
- **Ladder peut arriver en France** (ils ont levé ~105 M$ pour s'étendre). → Aller vite, miser sur des coachs français connus et la communauté locale.
- **Abonnement cher** : en France on testera un prix plus bas (ex. 14,99 €/mois, 89,99 €/an).

## Sources

- [Top Grossing iOS Apps — octobre 2026 (getappniche)](https://getappniche.com/top-grossing-ios-apps)
- [Top Grossing Apps US (applyra)](https://www.applyra.io/tools/top-charts/app-store/us/overall/grossing)
- [Top Free US (appstorestatistics)](https://appstorestatistics.com/charts/us/top-free)
- [US App Store Download Trends 2025–2026 (consultmyapp)](https://www.consultmyapp.com/blog/the-definitive-guide-to-us-app-store-download-trends-2025-to-2026)
- [Top fitness apps by revenue 2026 (Statista)](https://www.statista.com/statistics/1239716/top-fitness-and-sport-apps-by-revenue/)
- [Top Grossing Health & Fitness (AppGazers)](https://appgazers.com/reports/top-grossing-apps/health-and-fitness)
- [Ladder : croissance des utilisateurs (Fortune)](https://www.fortune.com/2024/12/10/strength-training-ladder-app-users-growth)
- [Ladder lève 105 M$ (FitTech)](https://www.fittechglobal.com/fit-tech-news/Ladder-raises-US105-million-to-grow-its-strength-training-app/354576)
- [Ladder — fonctionnement et prix (joinladder.com/llms.txt)](https://www.joinladder.com/llms.txt)
- [Paywall Ladder (Adapty)](https://adapty.io/paywall-library/ladder/)
- [Opal : 10 M$ ARR (RevenueCat)](https://www.revenuecat.com/blog/growth/kenneth-schlenker-sub-club-podcast-2026)
- [Opal : 10 M$ ARR avec 11 personnes (Speedinvest)](https://www.speedinvest.com/knowledge/scaling-smart-how-opal-built-a-10m-arr-business-in-just-2-years)
- [Partiful (CNBC)](https://www.cnbc.com/2025/04/19/meet-partiful-the-gen-z-party-planning-staple-thats-taking-on-apple.html)
- [Comparatif apps calories IA 2026](https://www.fitness-reviewed.com/articles/best-ai-calorie-tracking-apps-comparison/)
