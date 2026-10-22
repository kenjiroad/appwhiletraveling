# Design & marketing : Debout (sur le modèle de Floup)

Même méthode que pour Floup (skill design-marketing), adaptée à notre cas : **Debout n'est pas
un projet client, c'est l'app de Kenji.** Il n'y a donc ni devis ni décideur à convaincre. La
proposition PDF devient un **dossier produit** pour présenter l'app (bêta-testeurs, partenaires,
démo), et le « test ×3 » devient **le calcul de rentabilité de l'app**.

## La demande

Créer une app grand public iOS, en voyageant, qui règle un vrai problème, qui soit fun, qui
contienne de l'IA, qui soit cool à présenter et qui puisse marcher vite, **sans dépendre de personne**
(pas de coachs ni de partenaires à démarcher ; distribution organique d'abord, influenceurs plus tard).
Après la recherche (docs 01 à 08), le choix s'est fait sur **Debout** : le réveil qui ne s'arrête que quand
tu fais tes pompes ou tes squats, comptés par l'IA de la caméra. Concept inspiré d'Erly (0 → 50 k$/mois en 4 mois,
d'après le fondateur).

Mots de Kenji sur la V1 : « l'interface fait trop vieille », « il faut que ce soit fun », « des
possibilités d'évolution de statut », « savoir qui fait le plus de pompes ».

## Partie 1 : la réflexion produit et marketing

- **Le vrai sujet** : ce n'est pas le comptage des pompes (quelques jours de dev). C'est
  **l'habitude** (est-ce qu'on revient le matin au jour 7 et au jour 30 ?) et **la distribution** (est-ce que
  les vidéos tournent sur TikTok ?). Une app de réveil qu'on désinstalle au 3e jour ne vaut rien.
- **Contourner le blocage** (pas d'influenceurs, pas de budget) : c'est **l'app qui fabrique le contenu**.
  Chaque défi réussi produit une carte de série à partager, et bientôt une courte vidéo du compteur.
  La ligue entre amis oblige à inviter (« Défier un pote ») : chaque utilisateur en amène d'autres.
- **Le format** : **app native obligatoire** (caméra, vrai réveil AlarmKit, notifications), pas de web app.
  Le web sert seulement à l'aperçu et, plus tard, à une page d'atterrissage.
- **L'argument pour un partenaire ou un investisseur** : les données de la ligue et des séries
  montrent l'habitude (rétention). « Combien de gens font leurs pompes 5 matins sur 7 », c'est la
  preuve que l'app crée un comportement, pas juste des téléchargements.
- **Le calcul de rentabilité** (on ne s'invente pas de prévision) :
  - Coûts fixes la 1re année : 99 $ (Apple) + 0 € (EAS, RevenueCat sous 2 500 $/mois, Supabase gratuit au début).
  - Revenu net par abonné annuel ≈ 29,99 € − la part d'Apple (15 % avec le programme Small Business) − la TVA.
  - **Formule** : abonnés payants = installations × fin d'onboarding × démarrage d'essai × conversion essai → payant.
  - **Les 4 chiffres à mesurer dès la bêta** : installations/jour, % de fin d'onboarding, % d'essais démarrés,
    % d'essais convertis. Avec ces 4 chiffres, on sait si un format TikTok rapporte plus qu'il ne coûte en temps,
    et à partir de quand la pub devient rentable.
- **La distribution sans budget** :
  - *Ce que l'app fait seule* : carte de série à partager, invitations de ligue, relances le matin, et à venir
    la vidéo du défi (compteur en surimpression), prête pour TikTok.
  - *Ce que Kenji fait gratuitement* : 2 ou 3 comptes TikTok sans visage, 2 posts par jour, toujours le même
    format qui marche (« Je ne peux pas couper mon réveil sans 20 pompes », la vidéo du jour 1 au jour 30,
    l'évolution 😴 → 👑).
  - *Plus tard* : clipping payé à la vue, puis TikTok Ads sur les formats qui ont prouvé qu'ils marchent, puis influenceurs.
- **Les rôles** : Kenji est le fondateur (décisions, comptes Apple et TikTok, contenu). Claude
  construit le produit et propose les idées marketing ; c'est Kenji qui les exécute.
- **Erreurs rattrapées en route** :
  - Une app qui existe depuis 10 ans ne prouve pas qu'on peut démarrer vite. On ne garde que des apps récentes.
  - L'API TrustMRR interdit de chercher des apps « à copier » : on s'en sert seulement pour des tendances par catégorie.
  - Le code Swift n'a pas encore été compilé (pas de Mac ici).
  - La ligue affiche des joueurs fictifs, et c'est écrit dans l'app.

## Partie 2 : la DA

**Références de Kenji** : 🟡 *à fournir*. Pour Floup, deux shots Dribbble (une carte et une app) ont
tout débloqué. Pour Debout, il faut 1 ou 2 références d'app que Kenji trouve « premium et fun ».

**Où en est la DA actuelle (étape 10) face à la recette premium de Floup :**

| Recette premium | Debout aujourd'hui |
|---|---|
| Une couleur dominante en dégradé | ✅ violet → rose |
| Grands chiffres | ✅ compteur et XP géants |
| Cartes très arrondies | ✅ |
| Grotesk + **italique serif** | ❌ grotesk seule (Bricolage) |
| Transparence (effet verre) | ❌ cartes pleines |
| Navigation en **pilule sombre flottante** | ❌ barre d'onglets classique collée en bas |
| **Peu d'éléments par écran** | ❌ l'accueil est trop chargé (réveil + 2 stats + rang + défi + bouton) |
| Mascotte / personnage | ❌ emojis Apple (ça fait « vite fait ») |

**Plan de DA proposé :**
- **Couleurs** : nuit `#0D0A1E` → violet `#7B5CFF` → rose `#FF4FA3` → orange aube `#FF8A1F`, c'est-à-dire un
  **dégradé de lever de soleil** (le produit, c'est le réveil). Vert néon `#C8FF2E` réservé à l'action (boutons,
  compteur). Texte blanc et lavande `#A9A2C9`.
- **Typo** : Bricolage Grotesque (interface) + **Instrument Serif italique** (grands chiffres, rangs, voix de la mascotte).
- **Signature : « l'aube »**. Pendant le défi, le fond passe de la nuit au lever du soleil au fil des répétitions :
  0 pompe = nuit noire, la dernière = plein jour. Elle naît du croisement entre le produit (un réveil) et le vrai
  problème (rester au lit). On la retrouve partout : icône, cartes de série, vidéos TikTok.
- **Élément héros : la mascotte qui évolue**. Un seul personnage (une marmotte) qui change à chaque rang :
  marmotte en pyjama → … → coq → légende couronnée. Ça remplace les emojis et rend l'évolution désirable
  (« je veux voir le prochain »).
- **Logo de l'app** : la tête de la mascotte (rang Coq) sur le dégradé de l'aube.
- **Navigation** : pilule sombre flottante en verre, 3 entrées (Réveil, Ligue, Évolution).
- **Accueil allégé** : l'heure, la mascotte au rang actuel, la série 🔥, un seul bouton. Le reste va dans Évolution.

## Partie 3 : les livrables

Dans le dépôt (même logique de dossiers que Floup, sans la partie client) :

```
appwhiletraveling/
├── CLAUDE.md            contexte, décisions datées, ce qui est à confirmer (🟡)
├── docs/                étapes 00 à 11 (recherche, choix, DA, ce document)
├── design/
│   ├── marque/          mascotte : character sheet, détourages par rang, logo, icône
│   ├── maquettes/       maquettes.html : la planche premium + aperçus PNG
│   └── dossier/         dossier-debout.html/.pdf : le dossier produit avec PRD léger
└── app/                 l'app Expo
```

**Planche de maquettes** (HTML, comme Floup) :
- un hero avec 3 téléphones en éventail et la mascotte ;
- une bande « l'aube » qui montre le fond pendant le défi, de 0 à 15 pompes ;
- l'échelle d'évolution de la mascotte (8 rangs) ;
- la ligue avec son podium ;
- le parcours en 5 écrans (réveil → défi → ÉVOLUTION ! → partage → ligue).

**Dossier produit PDF (8 à 10 pages A4, aux couleurs de la DA) :**
1. Couverture (mascotte, « Debout — le réveil qui ne s'arrête que quand tu bouges »)
2. Le problème (chiffres sources : écrans, réveil, motivation) et « le vrai sujet »
3. La solution en une page + pourquoi une app native
4. Comment ça marche (écrans clés de la planche)
5. **PRD léger** (2 pages, voir ci-dessous)
6. Le modèle économique : la formule et les 4 chiffres à mesurer, sans prévision inventée
7. La distribution : ce que fait l'app, ce que fait Kenji
8. Calendrier (bêta → lancement) et prochaines étapes

### PRD léger (V1)

- **Objectif produit** : faire sortir du lit, chaque matin, en 2 minutes, avec un défi physique vérifié.
- **Objectifs business** : 1ers abonnés payants en moins de 30 jours après le lancement ; rétention J7 > 40 % ; 1 format TikTok qui rapporte des essais.
- **Utilisateurs** : 18–35 ans en France, qui « snoozent » et veulent se remettre au sport.

| Fonctionnalité | V1 (lancement) | Plus tard |
|---|---|---|
| Réveil + défi pompes/squats compté par la caméra | ✅ | |
| Vrai réveil même en silencieux (AlarmKit) | ✅ | |
| XP, 8 rangs, mascotte qui évolue, série 🔥 | ✅ | |
| Carte de série à partager | ✅ | |
| Abonnement (RevenueCat), essai 3 jours | ✅ | |
| Comptes + vraie ligue entre amis (Supabase) | ✅ | |
| Vidéo du défi prête pour TikTok | | ✅ |
| Autres exercices (gainage, jumping jacks) | | ✅ |
| Android | | ✅ |

- **Règles métier** : 1 répétition = 1 XP ; matin réussi = +25 XP ; le réveil insiste chaque minute
  (10 fois) tant que le défi n'est pas fait ; aucune image ne quitte le téléphone.
- **Hors périmètre V1** : coaching, programmes d'entraînement, nutrition, Apple Watch.
- **Indicateurs** : % de fin d'onboarding, % d'essais démarrés, % de conversion, rétention J1/J7/J30, matins réussis par semaine.

## À faire valider par Kenji

- 🟡 1 ou 2 références visuelles (Dribbble/Behance).
- 🟡 La mascotte : une marmotte qui évolue ? Nom ?
- 🟡 Génération de la mascotte avec Higgsfield (character sheet) : environ 2 crédits par image, on vérifie le solde avant.
- 🟡 Les prix (29,99 €/an, 7,99 €/mois) et la promesse « 3 jours gratuits ».
- 🟡 Les noms et scores fictifs de la ligue sur les maquettes (à écrire en bas des pages concernées).
