# Retours du premier test sur iPhone — corrigés

_Date : 28 octobre 2026_

Kenji a installé le premier build (preview) et testé l'app. Ses retours et ce qui a changé :

| Retour de Kenji | Correction |
|---|---|
| Impossible de revenir en arrière dans l'onboarding | Flèche **‹** en haut à gauche de chaque étape (sauf la première) |
| Régler l'heure avec −1h / −5 / +5 / +1h, c'est pénible | **Roue iOS** (comme l'app Horloge) : on choisit la minute exacte. Les boutons restent seulement dans l'aperçu navigateur |
| Le réveil n'a pas sonné | 1) Si le réveil iOS (AlarmKit) échoue, les notifications prennent le relais au lieu de rien. 2) Nouveau bloc **« Vérifier le réveil »** dans les réglages : mode utilisé, nombre de sonneries programmées, message si problème. 3) Bouton **« Tester le réveil dans 1 minute »** |
| Les pompes ne comptent que de profil | L'IA essaie maintenant plusieurs orientations de l'image et garde la meilleure, et compte aussi **la descente des épaules** (de face) en plus de l'angle du coude (de profil). Un même mouvement vu par les deux méthodes ne compte qu'une fois. Squats : pareil avec les hanches |

## À vérifier sur l'iPhone

- Ces changements touchent le code natif (caméra, réveil, roue) : il faut **un nouveau build**.
- Pompes de face : téléphone posé par terre devant toi, debout contre un objet, tu dois être entier dans l'image.
  Les seuils (descente = 0,6 × longueur du bras) sont à régler avec tes retours.
- Réveil : ouvrir Réglages → « Vérifier le réveil », noter ce qui est écrit, puis « Tester dans 1 minute ».

## Pas encore compris

- Le « petit défaut » sur la première page : à préciser par Kenji (capture).
