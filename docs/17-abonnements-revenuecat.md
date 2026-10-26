# Les abonnements (RevenueCat) — code prêt

_Date : 26 octobre 2026_

## C'est quoi RevenueCat ?

Pour vendre un abonnement dans une app iPhone, on passe obligatoirement par Apple (achats intégrés).
**RevenueCat** est un service qui fait l'intermédiaire avec Apple : il gère les achats, les essais gratuits,
les renouvellements, les remboursements, et nous dit simplement « cette personne est abonnée ou non ».
Gratuit jusqu'à 2 500 $ de revenus par mois.

## Ce qui est codé

| Fichier | Rôle |
|---|---|
| `app/src/lib/purchases.ts` | Connexion à RevenueCat, prix réels de l'App Store, achat, restauration, « est abonné ? » |
| `app/src/app/paywall.tsx` | Affiche les vrais prix (dans la monnaie de l'acheteur), message clair si l'achat échoue, « Restaurer mes achats » |
| `app/src/app/_layout.tsx` | Démarre RevenueCat au lancement et le relie au compte Supabase |

- Abonnement « **pro** » débloqué par les deux offres : **annuel** (29,99 €, 3 jours gratuits) et **mensuel** (7,99 €). 🟡 prix à confirmer.
- Sans la clé RevenueCat (ou sur le web, ou dans Expo Go), les achats restent **factices** : tout le parcours se teste quand même.

## Ce que Kenji doit faire (quand le premier build marche)

**1. App Store Connect** (appstoreconnect.apple.com)
1. **Accords, taxes et banque** : signer l'accord « Applications payantes », ajouter ton compte bancaire et
   remplir les infos fiscales. Sans ça, Apple bloque toute vente.
2. **Apps → +** → Nouvelle app : nom « Debout », langue Français, identifiant `fr.debout.app`.
3. Dans l'app → **Abonnements** : créer un groupe « Debout Pro » avec deux abonnements :
   - `debout_pro_yearly` : 1 an, 29,99 €, avec une **offre de lancement** « gratuite » de 3 jours ;
   - `debout_pro_monthly` : 1 mois, 7,99 €.

**2. RevenueCat** (app.revenuecat.com, compte gratuit)
1. Créer un projet « Debout », ajouter une app **App Store** avec l'identifiant `fr.debout.app`.
2. Suivre leur guide pour relier App Store Connect (une clé « In-App Purchase » à créer chez Apple).
3. **Entitlements** : créer `pro` et y attacher les deux abonnements.
4. **Offerings** : l'offre `default` avec deux « packages » : **Annual** → `debout_pro_yearly`, **Monthly** → `debout_pro_monthly`.
5. **API keys** : copier la clé publique iOS (commence par `appl_`). Elle est faite pour être dans l'app : pas secrète.

**3. Brancher la clé**
- Dans `app/.env` sur ton Mac : `EXPO_PUBLIC_REVENUECAT_IOS_KEY=appl_…` (voir `.env.example`).
- Pour les builds EAS, le fichier `.env` n'est pas envoyé : mettre la même valeur (et celles de Supabase) sur
  expo.dev → ton projet → **Environment variables**.

**4. Tester sans payer**
Sur l'iPhone : Réglages → App Store → **Compte Sandbox** (un compte de test créé dans App Store Connect →
Utilisateurs et accès → Sandbox). Les achats de test sont gratuits.

## À décider (🟡)

- **Qu'est-ce que l'abonnement débloque ?** Aujourd'hui le paywall s'affiche après l'onboarding, mais
  « Plus tard » laisse tout utiliser gratuitement. Options : paywall obligatoire (comme Erly, essai de 3 jours
  puis payant), ou version gratuite limitée (ex. pompes seulement, pas de ligue).
- Le code Swift n'est pas concerné, mais le SDK RevenueCat n'a été testé que sur le web (achats factices) :
  à vérifier dans le build.
