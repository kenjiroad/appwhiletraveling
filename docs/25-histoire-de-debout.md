# L'histoire de Debout — de l'idée à l'App Store en 28 jours

_Écrit le 18 novembre 2026, le soir de l'envoi à Apple. Pour créer du contenu (TikTok, Instagram, LinkedIn, X)._

> **Debout**, c'est le réveil qui ne s'arrête que quand tu fais tes pompes ou tes squats, comptés par l'IA de
> la caméra. Kenji l'a créé en voyageant, avec Claude, **sans jamais ouvrir Xcode** : c'était sa première app.
> Commencée le 22 octobre 2026, envoyée à Apple le 18 novembre, **acceptée et publiée le 19 novembre 2026**.

Les phrases de Kenji sont citées telles qu'il les a écrites, avec l'orthographe juste corrigée. Les clés, les
identifiants et les infos bancaires vus pendant le projet ne sont **pas** dans ce document.

---

## En chiffres

| | |
|---|---|
| Début | mercredi **22 octobre 2026**, au réveil, en partant pour Berlin |
| Envoi à Apple | mercredi **18 novembre 2026** (27 jours plus tard) |
| Acceptée par Apple | jeudi **19 novembre 2026**, du premier coup (28 jours après la première idée) |
| Idées envisagées avant Debout | une app de musculation en équipe (Cordée), une app d'alternance IA, une app de couple, un nettoyeur de photos (Ménage, codé puis abandonné le jour même)… |
| Directions artistiques | 3 : le premier jet, le « néon » (rejeté), « l'Aube » (gardée) |
| Logos proposés | 4 pistes, puis 2 versions de la piste C |
| Images générées par IA | 16 pour la mascotte + 14 détourages, puis les logos (≈ 58 crédits Higgsfield, ≈ 3 $) |
| Dépensé spécialement pour Debout | **99 €** : le compte Apple Developer (par an) |
| Outils déjà payés pour d'autres projets | Claude 100 €/mois, Higgsfield 59 $/mois |
| Gratuit au départ | Expo (les builds), Supabase (comptes + ligue), RevenueCat (abonnements), Netlify (page légale) |
| Prix de l'app | 29,99 €/an avec **1 semaine gratuite**, ou 7,99 €/mois |

---

## Chapitre 1 — Le matin du départ (22 octobre)

Tout commence par un message envoyé au réveil :

> « Je veux créer une application while I'm traveling. An iOS app, it's gonna be my first app. »

La première idée : aller voir ce qui explose sur l'App Store aux États-Unis et faire la même chose pour la
France. Une étude de marché plus tard, Claude propose de refaire **Ladder** (de la musculation coachée en équipe).
Kenji coupe court :

> « Il faut qu'on enlève la barrière de contacter des gens. Il faudrait que l'app se distribue seule, via du
> contenu organique ou des pubs. »

Donc pas de coachs, pas de partenaires : une app qui se fait connaître toute seule, avec des vidéos. Veille sur X,
nouvelles idées (alternance IA, app de couple…), puis une nouvelle contrainte :

> « Je cherche une app fun to build in 1 day. Je pars à Berlin, je veux m'amuser, et qu'elle fasse de l'argent vite. »

Claude code en quelques heures **« Ménage »**, un nettoyeur de photos où l'on swipe comme sur Tinder. Kenji n'y
croit pas :

> « J'ai pas l'impression que c'est super génial, ça ne répond pas à un vrai problème. Vois plus loin, analyse
> la douleur des gens, et ce qui peut rendre le tout fun. »

Puis vient la remarque qui change tout :

> « Si c'est une app qui existe depuis des années, c'est normal que ça fonctionne. L'idée, c'est de créer un truc
> qui peut marcher au bout d'un mois. »

On ne regarde plus que les apps **lancées récemment qui ont démarré vite** (Starter Story). Une catégorie
ressort : **la discipline avec une preuve physique vérifiée par l'IA**. Exemple : Erly, un réveil qu'on arrête en
faisant des pompes devant la caméra. Son fondateur déclare environ 50 000 $ de ventes sur ses 28 derniers jours
(chiffre annoncé par lui-même, Starter Story 2026).

> « Allez, go, build something like Erly. »

Le jour même, **Debout V1** existe : onboarding, réveil, défi caméra, série de jours, partage, paywall.

📎 Visuel : `1-premiere-version-22-10/parcours-debout.png`

---

## Chapitre 2 — « Ça fait trop Discord » (22 octobre, après-midi)

Kenji découvre le parcours de l'app et ne le sent pas :

> « J'aime pas du tout l'interface. Elle est trop en mode vieille. Il faut que ce soit fun, qu'il y ait des
> possibilités d'évolution de statut, savoir qui fait le plus de pompes. »

Deuxième version : du néon, de l'XP, 8 rangs d'évolution (de l'escargot au roi), une ligue avec podium.

> « Non, ça fait trop Discord. Garde la DA premium. Il faut des animations, faire quelque chose de design qu'on a
> envie d'utiliser pour faire des pompes. »

Troisième version : **« l'Aube »**. Le ciel se lève pendant le défi, un serif italique, du verre dépoli, des
animations partout. Ensuite vient la **mascotte** : une marmotte 3D (la piste A) générée avec Higgsfield, avec
8 niveaux, de la Marmotte en pyjama à la Légende couronnée, et 6 poses (dort, pompe, squat, réveil, téléphone,
victoire). La marmotte, c'est le clin d'œil : celle qui ne veut pas se lever.

Le soir même, la DA et la mascotte sont **validées**. Le premier jour se termine sur le Mac de Kenji, avec l'app
qui s'ouvre enfin dans le navigateur après une série d'erreurs :

> « Oui ça s'ouvre, ça a l'air pas mal en vrai. »

📎 Visuels : `2-da-neon-rejetee-22-10/`, `3-da-aube-22-10/`, `4-mascotte/`, `0-evolution-du-design.png`

---

## Chapitre 3 — L'app sur le vrai iPhone (23 au 28 octobre)

Kenji paie le compte **Apple Developer** (99 €/an) et apprend tout le vocabulaire d'un coup : Terminal, build,
QR code, profil d'installation… L'app est fabriquée sur les **serveurs d'Expo**, pas sur son ordinateur.

Les petits obstacles de cette semaine :
- le Terminal qui ne finit pas par `app %` : on n'est pas dans le bon dossier (ça reviendra souvent 😅) ;
- le code à 6 chiffres d'Apple qu'il faut retrouver ;
- la **protection en cas de vol** de l'iPhone, qui impose **1 heure d'attente** avant d'installer le profil.

Le 26 octobre, première vraie décision business : le **paywall obligatoire**, comme Erly. Kenji demande pourquoi
on passe par RevenueCat plutôt que Stripe. Réponse : Apple **oblige** à vendre les abonnements d'une app iPhone
par ses achats intégrés, et RevenueCat gère tout autour (essai, renouvellements, « est-il abonné ? »).

Le 28 octobre, l'app est **installée sur son iPhone**. Premier test, premiers retours : pas de retour en arrière
dans l'onboarding, une roue pour choisir l'heure, l'alarme qui n'a pas sonné, les pompes de face pas comptées.
Tout est corrigé dans la soirée.

---

## Chapitre 4 — Les builds qui ratent, puis les idées qui fusent (29 octobre)

> « Mon build a fail. » … « Fail again. » … « J'ai que des erreurs. »

Puis ça passe. Nouveau test :

> « J'ai l'impression que ça fonctionne. Le seul problème : quand je fais des pompes, l'écran se met en veille. »

Corrigé : l'écran reste allumé pendant le défi. Et Kenji enchaîne les idées : bloquer TikTok et Instagram tant
qu'on n'a pas fait ses pompes (gardé pour « l'étape 3 »), et la marmotte sur l'écran verrouillé. Feu vert pour
tout un paquet de fonctionnalités qui donnent envie de revenir chaque jour :
- le **joker** qui protège ta série ;
- la **story à partager** après le réveil ;
- « **Toujours debout ?** », qui revérifie quelques minutes après le réveil ;
- la **sortie de secours** « Malade ou blessé ? » ;
- le **rappel du coucher** ;
- la **marmotte qui dort** sur l'écran verrouillé, avec le compte à rebours jusqu'au réveil.

---

## Chapitre 5 — « On dirait pas Uber » (1er novembre)

L'alarme ne sonne toujours pas le matin. Claude renforce le **vrai réveil d'iOS 26 (AlarmKit)**, celui qui sonne
comme l'app Horloge même en silencieux, et ajoute un plan B automatique et un écran « Vérifier le réveil ».

Un moment de stress : Kenji envoie dans le chat un fichier de clé Apple en pensant que c'est son identifiant.
Claude l'efface tout de suite et lui fait **supprimer la clé** chez Apple. Leçon retenue : **on n'envoie jamais
une clé ou un mot de passe dans un chat.**

Côté design, Kenji n'aime pas l'écran verrouillé :

> « J'ai pas aimé l'animation sur l'écran de verrouillage, on dirait pas Uber. Je veux aussi la marmotte qui
> avance dans la nuit. »

Il envoie une référence Dribbble, et l'écran est refait : la marmotte avance le long de la nuit, avec les cycles de
sommeil et l'heure du réveil. Puis c'est le **logo** :

> « J'aime pas en fait le logo. C'est vrai qu'on n'en a jamais discuté. »

4 pistes générées, et Kenji choisit la **C** : la marmotte qui se réveille, un œil ouvert.

📎 Visuels : `5-logo-01-11/`, `6-ecran-verrouille-01-11/`

---

## Chapitre 6 — « On le met sur le Store aujourd'hui ? » (4 novembre)

> « J'aimerais le déployer sur le Store today, tu penses que c'est possible ? »

D'abord, la bonne nouvelle :

> « Ça sonne, et pour éteindre la sonnerie je suis obligé de faire mes pompes. »

Les décisions du jour : l'app sera **payante avec 1 semaine gratuite**, avec une **vraie ligue** (de vrais
joueurs à la place des joueurs fictifs), et le nom **Debout** (la marmotte reste la mascotte).

Puis le bug le plus drôle du projet :

> « En fait, il compte même si ton téléphone bouge. Je le mets en bas, je me lève, je fais des mouvements de
> va-et-vient… ça compte même si je ne fais pas de pompes. »

Correctif : une pompe ne compte que si les épaules descendent **et** que les mains restent au sol. La même journée,
on passe toute l'app au peigne fin avec les méthodes de designers reconnus (Emil Kowalski pour les animations,
Impeccable pour l'interface). Kenji met en ligne la page légale sur Netlify, crée la base de données Supabase pour
la ligue, et remplit toute la partie administrative d'Apple : contrat, banque, formulaire fiscal américain W-8BEN
(on n'est pas américain, donc 0 % de retenue grâce à la convention France–États-Unis), statut de commerçant
européen.

> « C'est bon je crois, mais on ne m'a rien demandé sur ma société. »

---

## Chapitre 7 — Abonnements, RevenueCat et le build final (5 et 6 novembre)

Création des abonnements chez Apple : **Annuel à 29,99 €** et **Mensuel à 7,99 €**. Il y a plein de champs
inconnus (nom d'affichage, message de fidélisation, capture pour la vérification…), et le premier abonnement ne
peut partir qu'**avec** la première version de l'app.

Pendant la configuration de RevenueCat, Kenji pense déjà à ses proches :

> « On peut donner des codes pour que des gens de la famille l'utilisent gratuitement sur le long terme ? »

Réponse : oui, de deux façons. Un accès offert à vie depuis RevenueCat, ou des codes Apple (jusqu'à 1 an gratuit).

Le 6 novembre, le **build pour l'App Store** est envoyé chez Apple. Et la question du jour :

> « Quand est-ce que mon app sera sur l'App Store ? Je veux que les gens la testent le plus vite possible,
> si possible aujourd'hui. »

---

## Chapitre 8 — TestFlight, la vraie épreuve (8 au 17 novembre)

TestFlight, c'est l'app d'Apple pour tester avant la sortie. Trois surprises :

1. **La semaine gratuite n'apparaît pas.**
   > « Je vois pas l'option gratuite pendant 7 jours. »

   Elle n'avait jamais été créée chez Apple (« offres d'introduction : 0 »). On la crée pour 175 pays, et les prix
   s'affichent en dollars, sans doute parce que le compte Apple de test est réglé sur les États-Unis (en France,
   ce sera bien 29,99 €).
2. **« Même moi je dois payer ? »** Non : dans TestFlight, tous les achats sont gratuits, c'est un bac à sable.
3. **Les pompes ne sont plus comptées du tout.**
   > « Les pompes ne se comptent pas, je sais pas pourquoi, je suis bien en face. »

   Le correctif anti-triche du 4 novembre était trop sévère. Dès que l'IA perdait une main une fraction de
   seconde, elle croyait que les mains avaient bougé et refusait tout. Nouvelle méthode : chaque main est suivie
   à part, et c'est le **gyroscope** du téléphone qui détecte s'il bouge. Au passage, on découvre aussi que le
   bouton « tester le réveil dans 1 minute » effaçait son propre test en revenant à l'accueil. Corrigé aussi.

Le 17 novembre, nouveau build :

> « Oui, ça compte les pompes et le réveil sonne. »

---

## Chapitre 9 — Le jour où Apple est tombé en panne (17 novembre)

Juste au moment d'envoyer l'app, App Store Connect affiche des cadres vides, puis « **503 Service Temporarily
Unavailable** », puis « **Fail to verify your identity** ».

> « Je sais pas ce qu'il se passe, mais il n'a plus accès à mon app. »

Ce n'était pas lui : ce jour-là, une **panne mondiale** touchait iCloud, l'App Store, Apple Pay et App Store
Connect. Apple a expliqué qu'elle venait d'une mise à jour interne, et pas d'une attaque. Le conseil le plus
important de la soirée : **arrêter d'essayer d'autres mots de passe** (sinon Apple bloque le compte) et attendre.

---

## Chapitre 10 — L'envoi (18 novembre)

> « Je suis reconnecté, envoie-moi maintenant tout ce que je dois faire. »

La dernière ligne droite :
- le **questionnaire de confidentialité** : 4 types de données, utilisées uniquement pour faire marcher l'app, sans
  pistage et sans pub ;
- des **captures pour un nouveau format d'iPhone**, qu'Apple exige désormais (« écran moyen », 6,3 pouces) ;
- le **nom du groupe d'abonnements**, qui manquait ;
- et une dernière frayeur :
  > « J'en ai envoyé 3 et pas 4, merde. »

  Le Mensuel était resté de côté. On retire la version, puis on renvoie **les 4 ensemble** : la version, le groupe,
  l'Annuel et le Mensuel.

> « C'est bon, let's gooo ! »

**Debout est « En attente de vérification » chez Apple.** 🎉

---

## Chapitre 11 — Acceptée du premier coup (19 novembre)

Le lendemain matin, Kenji ouvre App Store Connect et envoie une capture : à côté de « 1.0 », une **coche verte**
et les mots « **Prête pour la distribution** ».

> « Ça veut dire quoi ?? »

Ça veut dire qu'Apple a tout validé : l'app, les deux abonnements, la fiche. Comme on avait choisi « Publier
automatiquement », **Debout est en ligne sur l'App Store**, 28 jours après le message envoyé au réveil en partant
pour Berlin. 🎉

---

## Ce qui reste à faire

- Tester la marmotte de nuit sur l'écran verrouillé.
- S'inscrire au Small Business Program d'Apple (15 % de commission au lieu de 30 %).
- Lancer les premières vidéos.
- Plus tard : bloquer TikTok/Instagram tant que les pompes ne sont pas faites (« étape 3 »).

---

## 10 leçons à partager

1. **Partir d'un problème, pas d'une idée à la mode.** Le déclic : « une app qui existe depuis des années, c'est
   normal que ça marche ».
2. **Regarder les apps récentes qui ont démarré vite**, pas les géants installés depuis 10 ans.
3. **Penser la distribution dès le jour 1.** Une app qui se montre bien en vidéo (quelqu'un qui fait des pompes à
   6 h du matin) se vend toute seule.
4. **Le design, c'est trois essais.** Premier jet, néon « trop Discord », puis « l'Aube ». Il faut oser dire
   « j'aime pas ».
5. **Une mascotte donne une âme à l'app.** La marmotte qui ne veut pas se lever, c'est toute l'histoire en une image.
6. **Tester sur un vrai téléphone, tout de suite.** L'écran qui se met en veille, l'alarme qui ne sonne pas, les
   pompes fantômes : rien de tout ça ne se voit sur un ordinateur.
7. **Un correctif peut casser autre chose.** L'anti-triche a empêché de compter les vraies pompes. Il faut retester
   à chaque fois.
8. **Ne jamais envoyer une clé ou un mot de passe dans un chat.**
9. **Apple, c'est beaucoup d'administratif** : contrat, banque, fiscalité, captures, confidentialité, abonnements.
   Prévoir du temps pour ça.
10. **Parfois, le problème n'est pas toi.** Le jour J, c'est Apple qui était en panne.

---

## Idées de contenus

**Accroches (TikTok / Reels / Shorts)**
- « J'ai créé une app iPhone en 28 jours en voyageant, sans écrire une ligne de code. Apple l'a acceptée du premier coup. »
- « Mon réveil ne s'arrête que si je fais 15 pompes. Je l'ai codé avec une IA. »
- « L'IA comptait des pompes quand je bougeais juste le téléphone 💀 »
- « Le jour où je voulais publier mon app, Apple est tombé en panne dans le monde entier. »
- « Mon app m'a coûté 99 €. Voici tout ce que j'ai payé. »
- « J'ai montré mon design à l'IA, il faisait trop Discord. Voici les 3 versions. »
- « Pourquoi une marmotte ? »

**Formats**
- Série « Jour X de mon app » (les 11 chapitres ci-dessus = 11 épisodes).
- Avant / après du design (planche `0-evolution-du-design.png`).
- Carrousel « 10 leçons pour lancer sa première app ».
- Post LinkedIn : « De l'idée à l'App Store en 28 jours, avec une IA ».
- Vidéo face caméra au réveil : l'alarme sonne, les pompes, la victoire (et la marmotte qui se lève).

**Visuels disponibles** (dans le dossier `debout-designs`)
- `0-evolution-du-design.png` : les 4 versions côte à côte.
- `1-premiere-version-22-10/`, `2-da-neon-rejetee-22-10/`, `3-da-aube-22-10/` : les premiers designs.
- `4-mascotte/` : les 8 niveaux, les 6 poses, la planche.
- `5-logo-01-11/` : les 4 pistes de logo et la version choisie.
- `6-ecran-verrouille-01-11/` : la marmotte de nuit.
- `7-app-store-finale/` : les captures de la fiche App Store.
- `videos-demo/` : les deux premières démos vidéo (22 octobre).

---

_Sources des chiffres de marché : Starter Story (chiffres annoncés par les fondateurs), RevenueCat « State of
Subscription Apps 2026 ». Le détail est dans `08-recherche-douleurs-et-choix.md` et `19-concurrents.md`._
