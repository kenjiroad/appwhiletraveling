# Le vrai réveil (AlarmKit) — code prêt

_Date : 22 octobre 2026_

## Le problème

Jusqu'ici, Debout « sonnait » avec des **notifications** : un petit son, et rien du tout si le téléphone
est en silencieux ou en mode Concentration. Pour un réveil, ce n'est pas acceptable.

## La solution : AlarmKit

**AlarmKit** est l'outil d'Apple (iOS 26 et plus) qui permet à une app de sonner **comme l'app Horloge** :
plein écran, sur l'écran verrouillé, même en silencieux.

Ce que voit l'utilisateur quand ça sonne :

- le titre « Debout ! 15 pompes » ;
- un bouton **« Mes pompes »** : il coupe la sonnerie et ouvre l'app directement sur le défi ;
- un bouton **« Arrêter »** : il coupe la sonnerie… mais seulement 2 minutes. Le réveil resonne
  toutes les 2 minutes (6 fois) tant que le défi n'est pas fait.

Dès que les pompes sont faites, les sonneries restantes du jour sont annulées.
Et si on ouvre l'app dans l'heure qui suit l'alarme sans avoir fait le défi, elle va directement sur le défi.

## Comment c'est fait

| Fichier | Rôle |
|---|---|
| `app/modules/debout-alarm/` | Nouveau module natif (Swift) : programme et annule les alarmes AlarmKit, bouton « Mes pompes » |
| `app/src/lib/alarm.ts` | AlarmKit si disponible et autorisé (3 jours à l'avance), sinon les notifications comme avant |
| `app/src/lib/use-alarm-response.ts` | Ouvre le défi quand l'app s'ouvre pendant que l'alarme est due |
| `app/src/app/onboarding.tsx` | Demande l'autorisation « Réveil » en plus des notifications |
| `app/app.json` | Phrase d'autorisation affichée par iOS (`NSAlarmKitUsageDescription`) |

Sur un iPhone en iOS 25 ou moins, dans Expo Go ou dans le navigateur, rien ne change : les notifications
prennent le relais.

## À vérifier au premier build (🟡)

- Le Swift n'a jamais été compilé (pas de Mac dans mon environnement). Les noms exacts de l'API AlarmKit
  peuvent demander de petites corrections.
- Le build EAS doit utiliser **Xcode 26** (nécessaire pour AlarmKit).
- Le bouton « Mes pompes » repose sur une « App Intent » (une action qu'iOS peut lancer). Placée dans un
  module, iOS pourrait ne pas la trouver. Si le bouton ne fait rien, on la déplacera dans l'app elle-même.
  En attendant, « Arrêter » + ouvrir l'app mène quand même au défi.
- Combien d'alarmes une app peut programmer à l'avance (on en programme 18).
