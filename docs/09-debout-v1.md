# Étape 9 — Debout V1 ⏰💪

_Date : 22 octobre 2026_

**Le concept :** le réveil sonne. Pour l'arrêter, tu fais tes pompes ou tes squats devant la caméra.
L'IA compte tes répétitions. Pas de bouton « répéter ».

## Le parcours en images

Les écrans ont été entièrement refaits à l'étape 10 : voir [10-direction-artistique.md](10-direction-artistique.md).

## Ce qui est construit (dans `app/`)

| Partie | Fichier | Rôle |
|---|---|---|
| Onboarding | `src/app/onboarding.tsx` | Promesse → choix du défi (pompes/squats, 10–30) → heure → autorisations → paywall |
| Accueil | `src/app/index.tsx` | Heure du réveil, interrupteur on/off, défi, série 🔥, bouton « Tester le défi » |
| Défi | `src/app/challenge.tsx` | Caméra plein écran + gros compteur ; à la fin : « Réveillé ! », série, partage |
| Paywall | `src/app/paywall.tsx` | 29,99 €/an (3 jours gratuits) ou 7,99 €/mois |
| Réveil | `src/lib/alarm.ts` | Notifications à l'heure choisie, puis rappel chaque minute (10 fois) tant que le défi n'est pas fait |
| Série / réglages | `src/lib/storage.ts` | Jours réussis, calcul de la série, réglages |
| **IA de comptage** | `modules/rep-counter/` | Module natif iOS (Swift) : caméra frontale + **Apple Vision** (détection du squelette) |

### Comment l'IA compte

- Vision repère les articulations du corps, environ 12 fois par seconde.
- Pour les **pompes**, on suit l'angle du coude (épaule–coude–poignet). Pour les **squats**, celui du genou (hanche–genou–cheville).
- Une répétition compte quand l'angle descend sous ~100–110° puis remonte au-dessus de ~150–155°.
- Les deux seuils sont espacés pour ne pas compter le tremblement autour d'un seul seuil.
- **Tout tourne sur le téléphone** : aucune image n'est envoyée ni enregistrée, donc 0 € de serveur.

## Ce qui est vérifié ici

- TypeScript ✅, lint ✅, compilation du bundle iOS ✅.
- Expo détecte bien le module natif ✅.
- La configuration iOS générée (`expo prebuild`) contient bien le texte d'autorisation caméra et les notifications « time-sensitive » ✅.

## ⚠️ Pas encore vérifié (impossible ici, il n'y a pas de Mac)

- **Le code Swift n'a pas été compilé.** Il le sera au premier build EAS. S'il y a une erreur, on la corrigera à ce moment-là.
- **Les seuils d'angle** sont des valeurs de départ : il faudra les ajuster en testant pour de vrai.
- **Le paiement est factice** (`src/lib/purchases.ts`). Il faut brancher RevenueCat avant la publication.
- **Le réveil passe par des notifications** : il ne sonne pas en mode silencieux. Il faudra passer à
  **AlarmKit** (iOS 26), comme Erly, pour un vrai réveil. C'est l'étape suivante une fois qu'on pourra compiler.

## Tester

**Tout de suite, dans Expo Go (mode démo)** : le module natif n'existe pas dans Expo Go, donc l'écran du défi
passe en **« tape l'écran à chaque pompe »**. Ça permet de tester tout le parcours sauf la caméra.

```bash
cd app && npm install && npx expo start
```

**Avec la vraie caméra (il faut le compte Apple Developer)** : build dans le cloud avec EAS, sans Mac.

```bash
npm install -g eas-cli
eas login
cd app
eas build --profile development --platform ios
```

Installe le build sur ton iPhone (lien/QR donné par EAS), puis `npx expo start` pour développer en direct.

## Prochaines étapes

1. Compte Apple Developer, puis premier build EAS. On corrige le Swift si besoin et on règle les seuils en vrai.
2. AlarmKit pour un vrai réveil.
3. RevenueCat (vrai paiement).
4. Icône, captures App Store, TestFlight.
5. Contenu TikTok : « Je ne peux pas couper mon réveil sans faire 20 pompes » (la démo, c'est la vidéo).
