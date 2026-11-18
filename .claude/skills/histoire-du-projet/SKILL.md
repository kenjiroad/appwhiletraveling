---
name: histoire-du-projet
description: Raconte l'histoire de la création d'une app ou d'un projet (le parcours jour par jour, les pivots, les galères, les vraies phrases de l'utilisateur, les chiffres, les leçons) dans un fichier Markdown prêt pour créer du contenu (TikTok, Reels, LinkedIn, X, build in public). À utiliser dès que l'utilisateur commence un nouveau projet ou une nouvelle app (pour lancer le carnet d'histoire dès le jour 1), et chaque fois qu'il demande l'historique, le parcours, la story, le récap de tout ce qu'on s'est dit, « comment on a créé l'app », un fichier .md pour faire du contenu, ou les anciens designs — même s'il ne dit pas le mot « histoire ».
---

# Histoire du projet

Le but : qu'à la fin d'un projet, l'utilisateur ait **l'histoire vraie** de ce qu'il a construit, prête à transformer
en contenu. Une bonne histoire de création vend l'app mieux qu'une pub : les pivots, les « j'aime pas », les bugs
absurdes et le jour où tout marche enfin, c'est ça que les gens regardent.

Ce skill a deux moments : **au démarrage** (on prépare le terrain pour ne rien perdre) et **à la demande** (on écrit
l'histoire complète).

## Moment 1 — Au démarrage d'un projet

Quand l'utilisateur dit qu'il commence une app ou un projet (« je veux créer une app », « nouveau projet »…) :

1. **Crée le carnet** `docs/histoire/carnet.md` à partir de la partie « Carnet » de
   [references/modele.md](references/modele.md) : date et heure de début, idée de départ, contexte (où il est, pourquoi
   ce projet), et sa toute première phrase, recopiée telle quelle.
2. **Ajoute une règle au `CLAUDE.md` du projet** (crée le fichier s'il n'existe pas) :
   > Histoire du projet : à chaque étape marquante (pivot, design rejeté ou validé, premier test sur le vrai appareil,
   > bug, décision business, coût, lancement), ajouter une ligne datée dans `docs/histoire/carnet.md`, avec la phrase
   > exacte de l'utilisateur quand elle est marquante. Ne jamais supprimer un ancien design : le ranger dans `design/`
   > avec sa date.

   Cette règle compte : l'historique des conversations peut disparaître (nouvelle session, autre ordinateur), alors
   que le carnet est dans le projet.
3. Dis-le à l'utilisateur en une ligne, sans en faire un sujet, puis passe à son vrai travail.

Pendant le projet, quand une étape marquante arrive, ajoute la ligne au carnet en même temps que le reste du travail.
Les anciens designs comptent beaucoup pour le contenu (« avant / après ») : ne les écrase pas, ou retrouve-les dans
l'historique git.

## Moment 2 — Écrire l'histoire complète

Quand l'utilisateur demande l'histoire, le parcours ou un .md pour faire du contenu :

### 1. Rassembler les faits (ne rien inventer)

Lis, dans cet ordre (tout n'existe pas toujours, prends ce qui est là) :
- `docs/histoire/carnet.md`, puis le journal ou les docs du projet (`docs/`, `README.md`, `CLAUDE.md`) ;
- `git log --date=short --format="%ad %s"` : les vraies dates de chaque étape ;
- **les conversations** : lance `python3 scripts/extraire_messages.py` (depuis le dossier du skill, avec le chemin du
  projet en argument si besoin). Il sort chaque message de l'utilisateur avec sa date, en masquant les secrets. C'est
  là que se trouvent ses vraies phrases ;
- les visuels : `design/`, `docs/images/`, et les images supprimées depuis, retrouvées avec
  `git log --diff-filter=A --name-only -- '*.png' '*.jpg'` et récupérées par `git show <commit>:<chemin>`.

### 2. Trouver les chapitres

Un chapitre = un tournant, pas un jour. Cherche : l'idée de départ et les idées abandonnées, chaque design rejeté
(« trop… ») puis validé, le premier test sur le vrai appareil, les bugs marquants (surtout les drôles), les décisions
d'argent (prix, essai gratuit), l'administratif, les pannes, l'envoi ou la sortie. Donne à chaque chapitre une date et
un titre qui reprend une de ses phrases quand c'est possible (« Ça fait trop Discord »).

### 3. Écrire le fichier

Suis la partie « Histoire » de [references/modele.md](references/modele.md) et enregistre-le dans
`docs/histoire-de-<nom-du-projet>.md`. Les règles qui font la qualité (et la confiance) du document :
- **Ses vraies phrases**, entre guillemets, juste l'orthographe corrigée. Ce sont elles qui rendent l'histoire vivante.
- **Que des chiffres vrais** : dates, durée, coûts réellement payés. Les chiffres de marché seulement avec leur source,
  et « annoncé par le fondateur » quand c'est le cas. Pas de prévision inventée.
- **Rien de sensible** : ni clé, jeton, mot de passe, IBAN, adresse, téléphone, e-mail, identifiant de compte ou de
  projet. Si un incident de sécurité fait partie de l'histoire, raconte la leçon, pas la donnée.
- **Honnête sur l'état réel** : « envoyée à Apple » n'est pas « sur l'App Store ».
- **Simple**, dans la langue de l'utilisateur, avec les termes techniques expliqués en quelques mots.

### 4. Les visuels et la livraison

- Rassemble les designs dans un dossier daté par étape (premier jet, versions rejetées, version finale, mascotte,
  logo, captures du store, vidéos), puis fais un ZIP.
- Pour l'image « avant / après », lance `python3 scripts/planche_evolution.py` (voir l'aide `--help`) avec un écran
  par version.
- Envoie à l'utilisateur le .md, la planche et le ZIP (avec l'outil d'envoi de fichiers s'il existe), et ajoute une
  ligne au journal du projet.

Quand l'utilisateur redemande l'histoire plus tard, **mets à jour** le même fichier (nouveaux chapitres, chiffres,
« ce qui reste à faire ») au lieu d'en créer un autre.
