# Étape 7 — L'app en 1 jour : « Ménage » 🧹

_Date : 22 octobre 2026_

## Le nouveau cahier des charges

- L'app doit se **coder en 1 jour**, et c'est **fun** à faire (en route pour Berlin).
- Elle **gagne de l'argent vite** : abonnement dès le jour 1.
- **Zéro dépendance** : pas de serveur, pas d'IA payante, pas de partenaires.
- On la fait connaître en **organique** (slideshows TikTok).

## Le choix : un nettoyeur de photos par swipe (modèle Swipewipe)

**Le concept :** tu swipes tes photos comme sur Tinder. À gauche, tu supprimes ; à droite, tu gardes. Tu libères des Go en quelques minutes.

**Pourquoi c'est le meilleur choix pour 1 jour :**

| Critère | Ménage |
|---|---|
| Vrai problème | « Stockage iPhone saturé » : tout le monde a vu ce message. En plus, un voyage = des centaines de photos à trier. |
| Preuve d'argent | **Swipewipe** a été racheté par l'éditeur français **MWM**, qui visait plus de 10 M€ de revenus annuels sur iOS (TechCrunch, juin 2024). Les estimations tierces vont de 0,5 à 1 M$/mois. |
| Faisable en 1 jour | ✅ 4 écrans, tout se passe dans le téléphone, aucun serveur |
| Coûts fixes | **0 €** (pas de serveur, pas d'API IA) |
| Contenu organique | ✅ Les vidéos de swipe sont satisfaisantes à regarder, le score « J'ai libéré 12 Go » se partage, et le format avant/après du stockage marche bien |
| Viralité intégrée | Bouton « Partager mon score » après chaque ménage |

**Les risques, en toute honnêteté :**
- Le marché est **encombré** (Swipewipe/MWM, Slidebox, Clean Up…). Un petit clone, PhotoClear, ne fait que 153 $/mois. **C'est la distribution qui fera la différence, pas le code.**
- Notre angle : on vise la **France**, on est **100 % en français**, on trie **par mois/voyage**, et on met en avant un **score de Go libérés** fait pour TikTok.

## Ce qui est construit (dans `app/`)

| Écran | Fichier | Ce qu'il fait |
|---|---|---|
| Accueil / onboarding | `src/app/index.tsx` | Promesse + demande d'accès aux photos, puis compteur « Go libérés » et liste des mois avec leur nombre de photos |
| Swipe | `src/app/swipe.tsx` + `src/components/swipe-card.tsx` | Cartes à swiper (geste ou boutons ✕ / ♥), retour arrière, vibrations, limite gratuite de **50 photos/jour** |
| Revue + suppression | dans `swipe.tsx` | Grille des photos sélectionnées, puis suppression. iOS demande confirmation et garde les photos 30 jours dans « Supprimés récemment ». Écran de célébration + partage |
| Paywall | `src/app/paywall.tsx` | Annuel 29,99 €/an ou hebdo 4,99 €/semaine avec 3 jours gratuits |

Vérifié ici : TypeScript ✅, lint ✅, la compilation iOS (`expo export`) ✅.
**Pas encore testé sur un vrai iPhone** : c'est la première chose à faire.

## ⚠️ Avant de publier sur l'App Store

`src/lib/purchases.ts` est un **faux paiement** : pour l'instant, le bouton débloque l'app sans
encaisser. Il faut le remplacer par RevenueCat. Ça nécessite le compte Apple Developer et un build EAS, car ça ne
marche pas dans Expo Go.

## Tester maintenant sur ton iPhone

```bash
cd app
npm install
npx expo start
```

Installe **Expo Go** sur ton iPhone, puis scanne le QR code.

## Les étapes jusqu'à l'argent

1. **Aujourd'hui** : tester sur iPhone et ajuster les sensations du swipe.
2. **Compte Apple Developer** (99 $/an). La validation peut prendre 24–48 h, donc il faut le lancer tout de suite.
3. **RevenueCat** : créer les 2 abonnements dans App Store Connect et brancher `purchases.ts`.
4. **Icône + 5 captures App Store** (titre : « Ménage : nettoyer ses photos »).
5. **Build EAS + TestFlight**, puis soumission (review Apple ~24–48 h).
6. **Contenu dès le jour 1** : 2 comptes TikTok, 2 posts/jour. Formats :
   - Enregistrement d'écran du swipe + « J'ai libéré 8 Go en 6 min »
   - Slideshow « Ton iPhone est plein ? Fais ça avant de payer iCloud »
   - « Je trie mes 600 photos de Berlin en 5 minutes » (le voyage = le contenu !)
7. Quand un format marche, on ajoute du **clipping payé à la vue**, puis des **TikTok Ads**.

## Sources

- [Swipewipe racheté par MWM (TechCrunch)](https://techcrunch.com/2024/06/25/gen-z-photos-app-swipewipe-sells-to-french-publisher-mwm-in-its-largest-acquisition-to-date)
- [Swipewipe — estimations (Sensor Tower)](https://app.sensortower.com/overview/1583884012?country=US)
- [Swipewipe — paywall (Adapty)](https://adapty.io/paywall-library/photo-cleaner-swipewipe/)
- [Comparatif apps de nettoyage photo 2026](https://miraphotos.com/blog/best-photo-cleanup-apps-iphone/)
- [PhotoClear — 153 $ MRR](https://www.whatsthe.app/photoclear)
