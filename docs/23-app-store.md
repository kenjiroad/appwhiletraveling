# Le kit App Store — tout ce qu'il faut pour publier Debout

_Date : 4 novembre 2026_

Ce document contient les textes à copier-coller dans **App Store Connect** (le site d'Apple pour gérer les apps),
les réponses aux questionnaires d'Apple et la liste des étapes, dans l'ordre.

Les captures d'écran sont dans `design/app-store/`. La page légale (confidentialité, conditions, support) est
`docs/legal/index.html` : elle doit être mise en ligne (voir « Héberger la page légale »).

---

## 1. Le nom

Sur l'App Store, deux apps ne peuvent pas avoir exactement le même nom. Recherche faite le 4/11/2026 : aucune app
de réveil ne s'appelle « Debout » ; la seule app trouvée avec ce mot est un livre pour enfants
(« Debout, petit Mo ! », StoryToys). Mais « Debout » seul pourrait déjà être réservé sans être visible : on ajoute
donc des mots qui aident aussi à être trouvé dans la recherche.

| Proposition | Caractères (30 max) |
|---|---|
| **Debout – Réveil sportif** ⭐ recommandé | 23 |
| Debout : réveil pompes | 22 |
| Debout – Réveil & Pompes | 24 |

Sous l'icône sur l'écran d'accueil, l'iPhone affiche toujours « Debout » (c'est le nom court de l'app, déjà réglé).

## 2. Les textes de la fiche

**Sous-titre** (30 max, 28) :
> Le réveil qui te fait bouger

**Texte promotionnel** (170 max, 140 — modifiable à tout moment sans repasser par Apple) :
> Ton réveil ne s'arrête que quand tu bouges : quelques pompes ou squats devant la caméra, l'IA compte, le soleil se lève. 1 semaine gratuite.

**Mots-clés** (100 max, 100 — séparés par des virgules, sans espace ; inutile de répéter les mots du nom) :
> alarme,pompes,squats,matin,motivation,habitude,sport,lever,routine,discipline,fitness,série,coach,ia

**Catégorie principale** : Santé et forme. **Catégorie secondaire** : Mode de vie.

**Description** (4000 max) :

> Fini la marmotte.
>
> Debout, c'est le réveil qui ne s'arrête que quand tu bouges. Le matin, ton alarme sonne, tu poses ton téléphone par terre, et tu fais tes pompes ou tes squats devant la caméra. L'IA compte chaque répétition. À la dernière, le soleil se lève sur ton écran… et le réveil se tait.
>
> Plus de « encore 5 minutes ». Tu commences la journée réveillé, fier, et déjà en mouvement.
>
> COMMENT ÇA MARCHE
> • Choisis ton heure, ton exercice (pompes ou squats) et ton nombre de répétitions.
> • Le matin, Debout sonne comme un vrai réveil, même en mode silencieux.
> • Fais tes répétitions devant la caméra, de face ou de profil : l'IA les compte toute seule.
> • « Arrêter » ne coupe que 2 minutes : seul le défi éteint vraiment le réveil.
>
> TA MARMOTTE ÉVOLUE AVEC TOI
> Chaque répétition te rapporte de l'XP. Ta marmotte passe par 8 niveaux, de la Marmotte en pyjama à la Légende couronnée. Les niveaux suivants restent cachés : à toi de les découvrir.
>
> RESTE DANS LA SÉRIE
> • Ta série de jours compte chaque matin gagné.
> • Les jokers protègent ta série si tu rates un matin : un offert, un de plus tous les 7 jours.
> • Malade ou blessé ? Un bouton arrête le réveil pour la journée.
>
> DÉFIE TES POTES
> La ligue de la semaine classe les joueurs par répétitions, du lundi au dimanche. Partage ta story du matin en un geste.
>
> LA NUIT AUSSI
> Dis « Bonne nuit » et ta marmotte s'installe sur ton écran verrouillé : l'heure du réveil, le temps de sommeil restant et tes cycles de sommeil. Un rappel t'aide à te coucher à l'heure.
>
> TA VIE PRIVÉE
> La caméra est analysée directement sur ton iPhone. Aucune image n'est envoyée ni enregistrée. Pas de pub, pas de pistage.
>
> DEBOUT PRO
> Debout s'utilise avec un abonnement :
> • Annuel : 29,99 € par an, avec 1 semaine d'essai gratuit
> • Mensuel : 7,99 € par mois
> Le paiement est débité sur ton compte Apple à la confirmation de l'achat (à la fin de l'essai gratuit). L'abonnement se renouvelle automatiquement sauf s'il est annulé au moins 24 heures avant la fin de la période en cours. Tu peux le gérer ou l'annuler à tout moment dans les réglages de ton compte Apple.
>
> Conditions d'utilisation : [URL]/#conditions
> Politique de confidentialité : [URL]/#confidentialite
>
> Debout ne remplace pas un avis médical : si tu as une douleur, une blessure ou un problème de santé, demande l'avis d'un médecin avant de faire de l'exercice.

🟡 Remplacer `[URL]` par l'adresse de la page légale une fois en ligne. Les prix sont ceux prévus (🟡 à confirmer).

## 3. Classification par âge (questionnaire d'Apple)

Réponses à donner : **Aucun** / **Non** partout (pas de violence, pas de contenu sexuel, pas de jeux d'argent, pas
d'alcool ni de drogue, pas de contenu médical ou de traitement, pas de navigateur web, pas de messagerie entre
joueurs, pas de publicité).

Un seul point à signaler : dans la ligue, les joueurs voient le **pseudo** choisi par les autres (16 caractères
maximum, pas de discussion, pas de photo). Si le questionnaire demande s'il y a du « contenu généré par les
utilisateurs » ou des « interactions entre utilisateurs », répondre **Non** pour la messagerie et décrire les
pseudos dans les notes. Classification attendue : **4+** (au pire 9+).

## 4. Confidentialité de l'app (questionnaire « Données collectées »)

Basé sur le code actuel (`app/src/lib/`, `app/supabase/`). À la question « Collectez-vous des données ? » → **Oui**.

| Type de données (Apple) | Ce que c'est dans Debout | Lié à l'utilisateur ? | Pistage ? | Finalité |
|---|---|---|---|---|
| **Identifiants → ID utilisateur** | Identifiant anonyme créé automatiquement par Supabase (aucun e-mail, aucun mot de passe) | Oui | Non | Fonctionnalités de l'app |
| **Coordonnées → Nom** | Le pseudo choisi à l'inscription, affiché dans la ligue | Oui | Non | Fonctionnalités de l'app |
| **Santé et forme → Forme physique** | Nombre de répétitions par jour, défi réussi ou non, niveau | Oui | Non | Fonctionnalités de l'app |
| **Achats → Historique d'achats** | Abonnement Debout Pro (via Apple et RevenueCat) | Oui | Non | Fonctionnalités de l'app |

À **ne pas** déclarer :
- **Caméra / photos / vidéos** : les images sont analysées sur l'iPhone et jamais envoyées ni enregistrées.
- **Réglages** (heure du réveil, exercice) : restent sur le téléphone. Seul l'**horaire de la nuit** (coucher et
  réveil) est envoyé au serveur quand on dit « Bonne nuit », avec le jeton de l'Activité en direct, pour faire
  avancer la marmotte ; il est effacé une heure après le réveil. 🟡 À vérifier au moment de remplir : si Apple le
  demande, le déclarer comme « Autres données d'utilisation », lié, sans pistage, fonctionnalités de l'app.
- **Diagnostics** : l'app n'intègre aucun outil de suivi des plantages ni de statistiques.
- **Pistage** (« Tracking ») : **Non**, pour tout. Pas de pub, pas de partage avec des courtiers de données.

## 5. Informations pour la vérification d'Apple (App Review)

À coller dans **Notes** (en anglais, les vérificateurs lisent l'anglais) :

> Debout is an alarm clock that only stops when the user completes push-ups or squats, counted on-device with Apple Vision (VNDetectHumanBodyPoseRequest). No images ever leave the device.
>
> No login is required: an anonymous account is created automatically. To test:
> 1. Complete the short onboarding (any nickname, exercise, time).
> 2. On the paywall, start the 1-week free trial (yearly plan) with a sandbox account.
> 3. Home → "Lancer le défi": place the phone on the floor about 1 m away, front or side view, and do the reps. If you cannot exercise, tap "Malade ou blessé ?" (top left) to stop today's alarm.
> 4. Settings → "Tester le réveil dans 1 minute" schedules a real alarm (AlarmKit) one minute later.
> 5. In the evening, "Bonne nuit 🌙" on the home screen starts the sleep Live Activity on the lock screen.
>
> Subscription terms, Terms of Use and Privacy Policy are linked on the paywall and in the description.

Coordonnées de contact : Kenji Joachim, e-mail, téléphone (obligatoire, visible seulement par Apple).
Compte de démonstration : **non requis** (pas d'identifiant).

🟡 Le vérificateur doit vraiment faire des pompes (ou utiliser « Malade ou blessé ? »). Une option de démo
« toucher pour compter » réservée à la vérification réduirait le risque de refus.

## 6. Les étapes dans App Store Connect, dans l'ordre

**A. Une seule fois pour le compte**
1. **Accords, taxes et banque** → signer l'accord **Applications payantes**, ajouter le compte bancaire et remplir
   le formulaire fiscal. Sans ça, impossible de vendre des abonnements.

**B. Créer la fiche**
2. **Apps** → **+** → **Nouvelle app** : plateforme iOS, nom (section 1), langue principale **Français**, identifiant
   de lot **fr.debout.app**, SKU `debout-ios`, accès complet.
3. **Informations sur l'app** : sous-titre, catégories, URL de la politique de confidentialité, classification par
   âge (section 3), droits sur le contenu (« Non, ne contient pas de contenu tiers »).
4. **Prix et disponibilité** : app **gratuite** (les abonnements sont à part), pays : France (+ Belgique, Suisse,
   Luxembourg, Canada si on veut viser toute la francophonie).
5. **Confidentialité de l'app** : questionnaire de la section 4.

**C. Les abonnements** (voir aussi `17-abonnements-revenuecat.md`)
6. **Abonnements** → groupe **Debout Pro** → 2 abonnements : `debout_pro_yearly` (1 an, 29,99 €, offre de lancement
   gratuite 1 semaine) et `debout_pro_monthly` (1 mois, 7,99 €). Pour chacun : nom affiché et description en
   français, et une **capture du paywall** pour la vérification (`design/app-store/`).
7. **RevenueCat** : relier les deux abonnements, puis mettre la clé `appl_…` dans expo.dev → Environment variables
   (`EXPO_PUBLIC_REVENUECAT_IOS_KEY`). Sans elle, les achats restent factices.

**D. La version à vérifier**
8. Build **production** depuis le Terminal (la première fois, Apple demande ton identifiant) :
   `npx eas-cli build --profile production --platform ios`, puis l'envoi vers Apple :
   `npx eas-cli submit --platform ios --latest`.
9. **TestFlight** : installer cette version sur ton iPhone et refaire un parcours complet (achat en sandbox compris).
10. **Version 1.0** : captures 6,9 pouces (`design/app-store/`, 3 à 10 images), texte promotionnel, description,
    mots-clés, URL d'assistance (`…/#support`), copyright `2026 Kenji Joachim`, choisir le build, infos de
    vérification (section 5), et **ajouter les 2 abonnements à la version** (obligatoire pour les premiers).
11. **Soumettre pour vérification.** Apple répond en général sous 24 à 48 h. En cas de refus, le message explique
    quoi corriger : on corrige et on renvoie.
12. Une fois accepté : **Publier** (tout de suite ou à une date choisie).

## 7. Héberger la page légale

Apple veut une adresse web publique pour la politique de confidentialité et le support. Le plus simple :
1. Aller sur **app.netlify.com/drop** (gratuit, sans configuration).
2. Glisser le dossier `docs/legal/` dans la page : Netlify donne une adresse du type `https://xxxx.netlify.app`.
3. Utiliser `https://xxxx.netlify.app/#confidentialite`, `…/#conditions` et `…/#support` dans App Store Connect,
   la description et le paywall.

## 8. Ce qui manque encore avant d'envoyer (🟡)

- Les **liens** Conditions / Confidentialité **dans le paywall** de l'app (règle Apple pour les abonnements).
- Un moyen de **supprimer ses données** depuis l'app (Apple l'exige pour les apps qui créent un compte, même
  anonyme) ; en attendant, la page légale indique comment le demander par e-mail.
- Le projet Supabase, la clé RevenueCat et les abonnements créés dans App Store Connect.
- Vérifier les conditions d'usage commercial des images Higgsfield (mascotte, logo).
