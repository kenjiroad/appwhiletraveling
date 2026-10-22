# Étape 12 — DA premium « Aube » + animations

_Date : 22 octobre 2026_

Retour de Kenji sur la DA néon (étape 10) : « ça fait trop Discord ». On garde la gamification (XP,
8 niveaux, ligue), mais on passe à la **DA premium** prévue dans le plan de l'étape 11, avec des
**animations** et une UI qui donne envie de faire ses pompes.

## Le concept : l'aube

Le produit, c'est le réveil. Toute l'app va **de la nuit au lever du soleil**.

- **Signature, pendant le défi** : le ciel se réchauffe et un soleil monte du bas de l'écran à
  chaque pompe. 0 pompe = nuit noire ; la dernière = plein jour. L'anneau de progression se remplit
  en dégradé or → rose, et le chiffre « saute » à chaque répétition (vibration + rebond).
- **Les niveaux = un soleil qui se lève** : l'emblème de chaque niveau est un soleil sur l'horizon.
  Plus le niveau est haut, plus le soleil est haut et plus il a de rayons, qui « respirent ».
  Ça remplace les emojis, qui faisaient bricolé.
- **Écran de victoire** : plein lever de soleil, « Réveillé. » ou « Niveau 3 », XP qui défile (+40 XP),
  puis « Tu deviens Poussin. ».

## Le système

| | |
|---|---|
| **Couleurs** | nuit `#0A0B1A` ; aube violet → rose → orange → or ; action en dégradé or `#FFC46B` → orange `#FF7A45` → rose `#FF5E8A` ; texte crème `#F6F1EA` |
| **Typo** | Instrument Sans (interface) + **Instrument Serif italique** (heures, chiffres, titres, niveaux) |
| **Matières** | cartes en verre dépoli (flou + bord fin), lumières d'aurore qui dérivent lentement en fond |
| **Navigation** | pilule sombre flottante en verre : Réveil · Ligue · Évolution |
| **Moins d'éléments** | l'accueil = date, niveau, l'heure en très grand, la semaine (soleils allumés), un seul bouton. Les réglages passent dans une fenêtre à part |

## Les animations

- Fond « aurore » : 3 lumières qui dérivent en boucle (9 à 13 s).
- Bouton principal : halo qui respire, rebond à l'appui.
- Entrées en cascade (fondu vers le haut) sur chaque écran.
- Défi : ciel qui se réchauffe, soleil qui monte, anneau qui se remplit, chiffre qui rebondit, phrase qui change.
- Victoire : emblème qui apparaît en zoom, XP qui défile, cartes en cascade.
- Podium de la ligue qui « pousse » du sol ; soleils de la semaine qui apparaissent un par un.

Fichiers : `app/src/lib/theme.ts`, `app/src/components/` (`aurora`, `ui`, `sun-badge`, `progress-ring`,
`week-dots`, `pill-tab-bar`).

## Aperçu

L'app (accueil, ligue, évolution, réglages) :

_(captures remplacées : voir l’étape 13)_

Le défi, de 0 à 15 pompes, puis le passage de niveau :



L'onboarding et le paywall :



Vidéos : [parcours complet](images/debout-demo.mp4) · [le défi seul](images/debout-defi.mp4)

Les captures et vidéos viennent d'un navigateur au format iPhone, en mode démo : on touche l'écran à la
place de la caméra. L'historique de 6 jours et les joueurs de la ligue sont fictifs.

## Pas fait

- Les références Dribbble n'ont pas pu être regardées : Dribbble est bloqué par le réseau de l'environnement.
  Ajouter `dribbble.com` et `cdn.dribbble.com` aux domaines autorisés pour la prochaine passe.
- La mascotte (Higgsfield) n'est pas faite : elle attend le feu vert de Kenji, parce qu'elle coûte des crédits.
