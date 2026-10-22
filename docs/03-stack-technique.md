# Étape 3 — La stack technique

Choisie pour quelqu'un qui **débute** et qui **voyage** (un seul ordinateur portable, pas
forcément un Mac, connexion variable).

| Besoin | Outil | Pourquoi | Coût au départ |
|---|---|---|---|
| App iPhone | **Expo (React Native) + TypeScript**, SDK 58 | Pas besoin de Mac : on teste sur son iPhone avec l'app _Expo Go_, et Apple compile dans le cloud. Android gratuit plus tard. | 0 € |
| Navigation | **Expo Router** | Un fichier = un écran, simple | 0 € |
| Compilation + envoi App Store | **EAS Build / EAS Submit** | Construit l'app iOS dans le cloud et l'envoie sur TestFlight | Gratuit (file d'attente) |
| Compte, base de données, fichiers, chat | **Supabase** (région UE — Paris/Francfort) | Tout-en-un : connexion, base Postgres, stockage, temps réel pour le chat. Données en Europe → RGPD | 0 € puis 25 $/mois |
| Vidéos d'exercices | **Supabase Storage** au début, puis **Cloudflare Stream** ou **Mux** | Vidéos courtes en boucle ; on passe au streaming pro quand le volume monte | 0 € puis ~5 $/mois |
| Abonnements / paiement | **RevenueCat** + achats intégrés Apple | Gère essais, paywall, renouvellements, tests A/B de prix | Gratuit jusqu'à 2 500 $/mois de revenus |
| Connexion | **Sign in with Apple** + e-mail (Supabase Auth) | Obligatoire/attendu sur iOS, en 1 clic | 0 € |
| Notifications | **Expo Notifications** | « Ton nouveau programme est là » chaque dimanche | 0 € |
| Statistiques produit | **PostHog** (hébergement UE) | Entonnoirs, rétention, enregistrements de sessions | Gratuit jusqu'à 1 M d'événements |
| Crash / bugs | **Sentry** | Savoir quand l'app plante | Gratuit |
| Design | **Figma** | Maquettes avant de coder | Gratuit |
| Code | **GitHub** (ce dépôt) + **Claude Code** | Historique de tout, et je code avec toi | 0 € |

## Ce qu'il faut acheter / créer (à faire par toi)

- [ ] **Compte Apple Developer** : 99 $/an (developer.apple.com). Possible en nom propre.
- [ ] **Statut micro-entreprise** (gratuit sur autoentrepreneur.urssaf.fr) pour encaisser les revenus de l'App Store et payer les coachs.
- [ ] **Compte Expo** (expo.dev), **Supabase**, **RevenueCat**, **PostHog** — tous gratuits.
- [ ] Un **iPhone** pour tester (avec l'app Expo Go).

## Où est le code

```
appwhiletraveling/
├── README.md          ← le sommaire
├── docs/              ← toutes les étapes écrites
└── app/               ← l'application Expo (Cordée)
    ├── app.json       ← nom, icône, bundle id (fr.cordee.app)
    ├── package.json
    └── src/app/       ← les écrans (Expo Router)
```

## Lancer l'app sur ton iPhone (dès maintenant)

```bash
cd app
npm install
npx expo start
```

Puis scanne le QR code avec l'appareil photo de ton iPhone (après avoir installé **Expo Go**
depuis l'App Store). L'app de démo s'ouvre ; on la remplacera écran par écran.

## Si tu as un Mac

Rien ne change : on garde Expo. Le Mac permet en plus d'utiliser le simulateur iPhone
(`npm run ios`) et de compiler en local.
