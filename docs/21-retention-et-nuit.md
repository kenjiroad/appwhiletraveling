# Retenir les utilisateurs + la marmotte de nuit — code prêt

_Date : 29 octobre 2026_

Feu vert de Kenji pour les points 1 et 2 de l'analyse des concurrents (`19-concurrents.md`).
Le blocage des apps (Temps d'écran) est prévu en **étape 3**, après.

## 1. Les petits ajouts qui font revenir

| Ajout | Comment ça marche | Fichiers |
|---|---|---|
| **Joker de série** 🛡 | 1 joker offert, +1 tous les 7 jours de suite (2 max). Un matin raté est couvert automatiquement : la série continue (sans compter ce jour). Le jour sauvé affiche un bouclier dans la semaine | `lib/storage.ts`, `components/week-dots.tsx`, accueil |
| **Story à partager** | Après le défi : « Partager ma story » ouvre une carte 9:16 (heure du réveil, pompes, série, niveau, marmotte) → image partagée sur Instagram/TikTok/WhatsApp | `components/share-card.tsx`, `challenge.tsx` (react-native-view-shot) |
| **« Toujours debout ? »** | 5 min après le défi, une sonnerie de plus, au cas où on se recouche. Désactivable dans les Réglages | `challenge.tsx`, `lib/alarm.ts` |
| **Sortie de secours** | « Malade ou blessé ? » pendant le défi : le réveil s'arrête pour la journée, sans XP. Un joker protège la série s'il en reste | `challenge.tsx`, `lib/storage.ts` |

## 2. La marmotte sur l'écran verrouillé (Activité en direct)

- Bouton **« Bonne nuit 🌙 »** sur l'accueil, entre 12 h et 1 h avant le réveil.
- **Rappel du coucher** chaque soir (heure du réveil − objectif de sommeil, 8 h par défaut, réglable 7 h → 9 h).
  Toucher la notification lance directement la marmotte de nuit.
- Sur l'écran verrouillé et dans la Dynamic Island : la marmotte qui dort, « Réveil à 07:00 », « Encore 7:42:13
  de sommeil » qui défile en direct, et une barre qui se remplit. À l'heure du réveil, elle passe en « Debout !
  15 pompes » avec la marmotte réveillée. Elle disparaît quand le défi est fait.
- Limites Apple : pas d'animation libre (le compte à rebours et la barre bougent seuls), 8 h maximum d'activité.

Fichiers : `app/targets/sleep/` (le petit programme pour l'écran verrouillé, en SwiftUI, ajouté au projet par
`@bacons/apple-targets`), `app/modules/debout-alarm/ios/SleepActivity.swift`, `app/src/lib/sleep.ts`.

## À vérifier au prochain build (🟡)

- Nouveau code natif (Activité en direct, capture d'image) : **nouveau build obligatoire**, depuis le Terminal,
  car Apple doit créer un profil pour la nouvelle extension (`fr.debout.app.sleep`).
- Le Swift de l'extension n'a jamais été compilé.
- Le plugin demande l'**Apple Team ID** de Kenji (`ios.appleTeamId` dans `app.json`) : sans lui, la signature de
  l'extension peut échouer.
