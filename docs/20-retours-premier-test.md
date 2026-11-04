# Retours du premier test sur iPhone — corrigés

_Date : 28 octobre 2026_

Kenji a installé le premier build (preview) et testé l'app. Ses retours et ce qui a changé :

| Retour de Kenji | Correction |
|---|---|
| Impossible de revenir en arrière dans l'onboarding | Flèche **‹** en haut à gauche de chaque étape (sauf la première) |
| Régler l'heure avec −1h / −5 / +5 / +1h, c'est pénible | **Roue iOS** (comme l'app Horloge) : on choisit la minute exacte. Les boutons restent seulement dans l'aperçu navigateur |
| Le réveil n'a pas sonné | 1) Si le réveil iOS (AlarmKit) échoue, les notifications prennent le relais au lieu de rien. 2) Nouveau bloc **« Vérifier le réveil »** dans les réglages : mode utilisé, nombre de sonneries programmées, message si problème. 3) Bouton **« Tester le réveil dans 1 minute »** |
| Les pompes ne comptent que de profil | L'IA essaie maintenant plusieurs orientations de l'image et garde la meilleure, et compte aussi **la descente des épaules** (de face) en plus de l'angle du coude (de profil). Un même mouvement vu par les deux méthodes ne compte qu'une fois. Squats : pareil avec les hanches |

## Deuxième test (29/10)

| Retour de Kenji | Correction |
|---|---|
| Pompes de face : ça marche bien | — |
| L'écran se met en veille pendant les pompes | L'écran reste allumé pendant tout le défi (`useKeepAwake` dans `challenge.tsx`) |

## À vérifier sur l'iPhone

- Ces changements touchent le code natif (caméra, réveil, roue) : il faut **un nouveau build**.
- Pompes de face : téléphone posé par terre devant toi, debout contre un objet, tu dois être entier dans l'image.
  Les seuils (descente = 0,6 × longueur du bras) sont à régler avec tes retours.
- Réveil : ouvrir Réglages → « Vérifier le réveil », noter ce qui est écrit, puis « Tester dans 1 minute ».

## Pas encore compris

- Le « petit défaut » sur la première page : à préciser par Kenji (capture).

## Troisième test (29/10) : l'alarme n'a pas sonné

En attente de la capture « Vérifier le réveil ». Renforcements faits sans attendre :
- l'app redemande l'autorisation « réveil iOS » au lancement si elle n'a jamais été demandée (cas d'un onboarding
  fait sur un ancien build) ;
- diagnostic plus précis (autorisé / refusé / pas encore demandé / iOS trop ancien) avec un bouton pour corriger ;
- plan B natif : si iOS refuse le bouton « Mes pompes », l'alarme sonne quand même avec « Arrêter » seul.

## Quatrième test (04/11) : le réveil sonne ✅, mais des pompes « fantômes »

Kenji : ça compte même si le téléphone bouge, si on se lève, ou si on monte et descend juste une main.
Correction (`app/modules/rep-counter/ios/RepDetection.swift`) : avant de compter, l'app vérifie sur les 3 dernières
secondes que **les épaules ont vraiment bougé** (au moins 0,45 × la longueur du bras) **pendant que les mains sont
restées au sol** (elles ont bougé moins de 45 % de ce qu'ont bougé les épaules). Pour les squats : les hanches
bougent, les pieds restent. Si le téléphone bouge, tout bouge ensemble → pas de rep. Si seul le bras bouge, les
épaules restent → pas de rep. À tester au prochain build ; seuils à ajuster selon les retours.
