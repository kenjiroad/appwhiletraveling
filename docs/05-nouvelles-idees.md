# Étape 5 — Nouvelles idées : des apps qui se distribuent seules

_Date : 22 octobre 2026_

## Pourquoi on change

Cordée (Ladder en français) avait besoin de **coachs** pour exister : il fallait contacter des
gens avant même de lancer. Nouvelle règle :

> **L'app doit marcher sans dépendre de personne.** Le contenu est produit par l'app (IA,
> données publiques), et les utilisateurs arrivent par du **contenu organique** (TikTok /
> Reels sans montrer son visage), puis par la pub payante. Les influenceurs viendront
> plus tard, en phase 2.

## Comment les petites apps grandissent en organique en 2026

Le format qui revient le plus : **les slideshows TikTok « faceless »**, c'est-à-dire des carrousels de 5 à 8 images
avec du texte, postés tous les jours sur 2 ou 3 comptes. On peut les faire depuis son téléphone,
en voyage.

| App | Ce qu'elle fait | Résultat annoncé (non vérifié) | Comment elle a grandi |
|---|---|---|---|
| **Stronger** | Programme de muscu par IA, gamifié | ~600 k$/an, 1,2 M d'utilisateurs | 725 vidéos en 295 jours, dont 98 % de slideshows |
| **Sprout** | IA pour trouver un job (étudiants) | Jusqu'à 250 k$/mois en 8 mois, ~100 M de vues/mois | Slideshows + codes de parrainage + petits créateurs |
| **Glam Up** | Selfie → colorimétrie et maquillage par IA | Jusqu'à 150 k$/mois en 6 mois | Avant/après en slideshow |
| **Quittr** | Arrêter le porno (série de jours, IA, communauté) | « 35 k$/jour » (source unique) | Influenceurs et pub |
| **Cal AI** | Photo du repas → calories | ~30 M$ de revenus | TikTok d'abord, puis +1 M$/mois de pub |

Points communs : **une promesse comprise en 3 secondes**, **un résultat qu'on peut montrer
en vidéo** (avant/après, score, chiffre), **paywall dès l'onboarding** et **abonnement**.

## Grille de notation (sur 5)

- **Vrai problème** : est-ce que ça fait mal, souvent ?
- **Autonome** : est-ce que ça marche sans partenaire, coach ou contenu à produire ?
- **Organique** : est-ce qu'il est facile de faire des slideshows qui tournent ?
- **Trou en France** : est-ce que personne ne le fait bien en français ?
- **Fun et faisable** : est-ce que c'est plaisant à coder seul, avec une V1 en moins de 8 semaines ?

| # | Idée (modèle US) | Problème | Autonome | Organique | Trou FR | Fun/faisable | **Total** |
|---|---|---|---|---|---|---|---|
| 1 | **App alternance IA** (Sprout) | 5 | 5 | 5 | 4 | 4 | **23** |
| 2 | **Coach muscu IA gamifié** (Stronger) | 4 | 5 | 5 | 3 | 5 | **22** |
| 3 | Colorimétrie / beauté IA (Glam Up) | 3 | 5 | 5 | 2 | 4 | 19 |
| 4 | Arrêter une addiction (Quittr) | 5 | 5 | 2 | 3 | 4 | 19 |
| 5 | Nettoyeur de photos par swipe | 3 | 5 | 4 | 1 | 5 | 18 |

### 1. App alternance IA 🥇 — « Trouve ton alternance »

**Le problème en France, en ce moment :**
- Environ 900 000 contrats ont été signés en 2024, puis il y a eu une baisse de 4,4 % en 2025.
- Les offres publiées ont chuté d'environ 22 % (mars–juillet 2025), alors qu'il y a plus de candidats par offre.
- Depuis janvier 2026, les aides à l'embauche ne couvrent plus BTS, licence et master. Ces profils coûtent donc plus cher aux entreprises.
- Un exemple relayé par la presse : 944 candidatures pour 3 entretiens en 10 mois.
- Sans entreprise, l'étudiant risque de **perdre sa place en formation**. La douleur est énorme et urgente.

**L'app :**
1. On swipe des **offres** et des **entreprises qui recrutent sans annonce**. Les données viennent de l'**API publique et gratuite La bonne alternance** (ministère du Travail), qui prédit les entreprises susceptibles d'embaucher un alternant. On n'a besoin d'aucun partenaire.
2. En 1 tap, l'**IA adapte le CV et la lettre de motivation** à chaque entreprise.
3. Un **suivi des candidatures** façon tableau (envoyée → relance → entretien), avec des relances automatiques proposées.
4. Une **préparation d'entretien** par IA, avec questions et retours.

**Contenu organique tout trouvé :** « J'ai envoyé 300 candidatures sans réponse… voilà ce qui a
marché », « Les entreprises qui recrutent en alternance sans publier d'offre », « Ma lettre avant /
après l'IA ». Ce public vit sur TikTok.

**Concurrence :** Space Monk (candidatures spontanées), les sites (Indeed, HelloWork, Welcome to
the Jungle, La bonne alternance). **Aucune app mobile IA** qui fait tout le parcours.

**Le bon timing :** les étudiants cherchent surtout de **janvier à septembre**. On est fin octobre, donc on a
le temps de lancer en janvier pour la saison 2027.

**Risques :**
- L'activité est saisonnière. Plus tard, on pourra l'étendre aux stages et aux jobs étudiants.
- Les étudiants ont un petit budget : il faudra un prix étudiant (ex. 4,99 €/semaine ou 29,99 €/trimestre).
- Il faut une IA honnête : on ne fait pas d'envoi en masse de candidatures identiques.

### 2. Coach muscu IA gamifié 🥈 — la version « sans coachs » de Cordée

On garde l'idée fitness, mais c'est l'IA qui crée le programme. On y ajoute un **Score de force**, des niveaux,
des séries et des défis entre amis. C'est le modèle Stronger, qui a prouvé que les slideshows de muscu
tournent énormément. C'est **le plus fun à coder** et on peut réutiliser tout le travail fait sur Cordée.
Le point faible : la concurrence est plus forte en France (Hevy, Fitbod, SP Training).

### 3 à 5 — écartées pour l'instant

- **Colorimétrie** : plusieurs apps existent déjà en français (Dressika, YouCam). En plus, les données du visage posent un risque RGPD.
- **Addiction (Quittr)** : c'est un vrai problème, mais TikTok limite ce type de contenu, donc l'organique est difficile.
- **Nettoyeur de photos** : le marché est saturé et les prix sont bas.

## Sources

- [Stronger : 725 vidéos, slideshows (Shortimize)](https://shortimize.com/blog/the-slideshow-strategy-that-generated-700000-users-in-275-days)
- [Stronger : ~600 k$/an (Superwall)](https://api.superwall.me/blog/how-stronger-built-a-usd600k-app-using-viral-on-demand-tiktok-strategy)
- [Stronger sur l'App Store](https://apps.apple.com/us/app/-/id1621719397)
- [Glam Up & Sprout : 0 → 400 k$/mois](https://yumaueno.substack.com/p/two-ai-apps-0-400k-mrr-inside-the)
- [Glam Up & Sprout — playbook fondatrice (BetterLaunch)](https://www.betterlaunch.co/playbooks/nicole-glamup-sprout-2)
- [Nicole Cheung, Glam Up (Claremont McKenna)](https://www.cmc.edu/news/nicole-cheung-25-co-founds-ai-beauty-app-achieves-milestone)
- [Slideshows TikTok → 100 k$/mois (Social Growth Engineers)](https://www.socialgrowthengineers.com/100k-mrr-with-faceless-slideshows)
- [Playbook TikTok de Cal AI (Stormy)](https://stormy.ai/blog/cal-ai-tiktok-marketing-playbook-2026)
- [Quittr : 35 k$/jour (vc.ru)](https://vc.ru/growth/1762617-kak-quittr-dorosli-do-35k-den)
- [RevenueCat — State of Subscription Apps 2026](https://www.revenuecat.com/state-of-subscription-apps)
- [Alternance : la chasse au contrat, rentrée 2026 (L'Apprenti)](https://lapprenti.com/articles/infos_apprentissage/3460)
- [Alternance : les étudiants sans réseau exclus (L'Étudiant)](https://www.letudiant.fr/etudes/alternance/alternance-les-etudiants-sans-reseau-professionnel-ont-l-impression-d-avoir-ete-exclus-du-marche.html)
- [Alternance : le coup de froid (L'Express Éducation)](https://lexpress-education.com/articles/alternance-le-coup-de-froid-apres-lage-dor/)
- [API La bonne alternance (explorateur)](https://api.apprentissage.beta.gouv.fr/en/explorer)
- [La bonne alternance — guide (entreprises qui recrutent sans offre)](https://labonnealternance.apprentissage.beta.gouv.fr/guide-cfa/accompagner-vos-alternants)
- [Space Monk sur l'App Store](https://apps.apple.com/fr/app/space-monk-emploi-alternance/id1606954291)
- [Colorimétrie IA en français (YouCam)](https://www.perfectcorp.com/fr/consumer/blog/makeup/test-colorimetrie-savoir-quelle-couleur-me-va)
