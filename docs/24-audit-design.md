# Étape 24 — Audit design et animations avant le lancement

_Date : 4 novembre 2026_

**Méthode** : relecture du code uniquement, sans détecteur automatique (il ne lit que du web, pas une app iOS).
J'ai appliqué les consignes des skills Impeccable (audit natif, iOS, critique, animation, finition, niveau minimum de
qualité) et Emil Kowalski (durées, courbes, interruptions, quand ne pas animer). Personne n'a pu répondre aux questions
du skill pendant l'audit : je me suis appuyé sur le brief, sur `docs/12` (DA « Aube »), sur `docs/20` (retours de test)
et sur les captures `design/app-store/brut-*.png` (format 6,9", faites **avant** l'ajout des liens légaux au paywall).
**Aucun fichier de code n'a été modifié.** Les chiffres de contraste et de hauteur viennent de calculs : ils sont à
vérifier sur un iPhone (voir la fin du document).

**Petit lexique** : _ms_ = millisecondes. _pt_ = points iOS (1 pt = 3 pixels sur un iPhone récent). _Ressort_
(« spring ») = animation qui imite un ressort : plus il est **amorti**, moins il rebondit (amortissement 1 = aucun
rebond, 0,1 = gelée). _Courbe_ (« easing ») = la façon dont une animation accélère et ralentit. _Contraste 4,5:1_ =
le minimum pour lire un texte normal (3:1 pour un très gros texte).

---

> **04/11 — les 6 P0 sont appliqués** (ressorts avec `mass: 1`, boutons « aube » sur la victoire, paywall qui
> tient et défile, bouton de l'onboarding au-dessus du clavier, contrastes, `userInterfaceStyle: dark`). Exception :
> le zoom part toujours de 0 (l'option `withInitialValues` cassait la mise en page dans l'aperçu web). Les P1 sont du
> JavaScript seul : ils pourront partir en mise à jour automatique après le lancement.

## 1. Verdict (5 lignes)

1. **Déjà premium** : la DA « Aube » tient debout. La nuit `#0A0B1A`, les gros chiffres en Instrument Serif italique
   (06:45, 9, « Réveillé. »), la marmotte 3D et ses 8 niveaux, et le ton des textes ont une vraie identité.
2. **Le meilleur moment** est l'écran du défi, où le ciel se réchauffe et le soleil monte à chaque pompe : c'est l'animation
   « signature » que le skill demande (une seule, propre au produit). L'écran verrouillé façon Uber est soigné, lui aussi.
3. **Ce qui fait amateur, n° 1** : les ressorts ont été réglés pour Reanimated 3, mais Reanimated 4 a changé le réglage
   par défaut. Résultat : les boutons tremblent environ 2 s après chaque appui, le compteur de pompes ne s'arrête jamais
   de bouger, et la marmotte de victoire grossit jusqu'à ~1,7 fois sa taille.
4. **N° 2** : des endroits illisibles ou qui débordent sur les écrans qui comptent. Le bouton « Partager ma story » est
   presque invisible sur l'écran de victoire (aussi sur la capture App Store n° 3). Sur un iPhone 15/16, le paywall
   pousse les liens légaux hors de l'écran. Pendant l'onboarding, le clavier cache « Continuer ».
5. **N° 3** : des détails qui font « bricolé ». Des emojis servent d'icônes (🛡 🌙 ☀︎ ✓), « Réglages » est un lien
   souligné comme sur un site web, et tous les écrans ont la même entrée en cascade, molle (~1 s avant de voir le bouton
   de l'accueil). Les 6 P0 se corrigent en **~1 h 30**, avant le build de production.

**Note technique** (grille Impeccable « audit natif », sur 20) : **10/20, « acceptable »**.

| Dimension | Note | Le problème principal |
|---|---|---|
| Accessibilité | 1/4 | boutons sans rôle VoiceOver, textes « faibles » à 2,6:1, aucune limite pour les très grandes tailles de texte |
| Performance | 3/4 | flous calculés à chaque image au-dessus de l'aurore qui bouge, halo animé sur l'ombre (mineur) |
| Thème | 3/4 | les couleurs sont rangées dans `theme.ts`, mais l'app suit le mode clair du système alors qu'elle est sombre |
| Respect d'iOS | 2/4 | lien souligné, emojis en guise d'icônes, gros bouton « Terminé » au milieu des réglages |
| Petits écrans | 1/4 | le paywall et l'accueil n'ont pas de défilement, donc ils débordent sur les iPhone 15/16/SE |

---

## 2. Problèmes, par priorité

### P0 — à corriger avant le build de lancement (petit effort, gros effet)

#### P0-1. Ressorts « en gelée » (le plus gros gain de ressenti)
- **Où** : `app/src/components/ui.tsx:59-60` (appui sur **tous** les boutons), `app/src/app/challenge.tsx:94` (chiffre
  du défi), `app/src/components/mascot.tsx:39` (saut de la marmotte), `challenge.tsx:165` et
  `app/src/app/(tabs)/profile.tsx:33` (marmotte qui apparaît en zoom), `app/src/app/(tabs)/league.tsx:64` (podium).
- **Problème** : Reanimated 4.7 donne par défaut une **masse de 4** aux ressorts (vérifié dans
  `node_modules/react-native-reanimated/src/animation/spring/spring.ts:65-67`), alors que les réglages ont été pensés
  pour une masse de 1. Chaque ressort est donc 2 fois plus lent et rebondit 2 fois plus :

  | Endroit | Réglage actuel | Amortissement réel | Repos après | Ce qu'on voit |
  |---|---|---|---|---|
  | appui bouton | damping 15, stiffness 300 | 0,22 | ~2,1 s | le bouton met 370 ms à s'enfoncer : un tap rapide ne montre rien |
  | relâche bouton | 12 / 200 | 0,21 | ~2,7 s | le bouton gonfle puis tremble |
  | chiffre du défi | 9 / 220 | 0,15 | ~3,5 s | il tremble encore quand la pompe suivante arrive |
  | saut de la marmotte | 7 / 180 | 0,13 | ~4,6 s | gelée permanente pendant le défi |
  | zoom victoire / évolution | `.damping(12)` / `(13)` | 0,10 | ~2,7 s | grossit jusqu'à ~1,7× (210 → ~360 pt) |
  | podium | `.damping(14)` | 0,12 | ~2,3 s | dépasse de ~17 pt |
- **Pourquoi** : Emil Kowalski demande un retour d'appui entre 100 et 160 ms, discret (échelle 0,95 à 0,98), et des
  rebonds subtils (0,1 à 0,3), gardés pour les moments ludiques. Il interdit aussi de partir d'une échelle de 0 (le
  zoom part de 0).
- **Correction** (toujours écrire `mass: 1`) :
  - `ui.tsx:59` → `scale.set(withTiming(0.97, { duration: 100, easing: Easing.out(Easing.quad) }))`
  - `ui.tsx:60` → `scale.set(withSpring(1, { mass: 1, damping: 20, stiffness: 400 }))` (repos en ~0,4 s, pas de
    rebond visible)
  - `challenge.tsx:94` → `withSequence(withTiming(1.12, { duration: 80, easing: Easing.out(Easing.quad) }), withSpring(1, { mass: 1, damping: 12, stiffness: 300 }))`
    (un seul petit rebond, repos en ~0,65 s)
  - `mascot.tsx:39` → `withSpring(0, { mass: 1, damping: 10, stiffness: 260 })` (on voit encore la marmotte s'écraser
    à l'atterrissage, repos en ~0,8 s)
  - `challenge.tsx:165` → `ZoomIn.withInitialValues({ transform: [{ scale: 0.6 }] }).springify().mass(1).damping(12).stiffness(200)`
    (pic à ~1,09×, repos en ~0,7 s)
  - `profile.tsx:33` → même chose avec `.damping(16)`, plus calme, car l'onglet s'ouvre souvent
  - `league.tsx:64` → `.springify().mass(1).damping(16).stiffness(180)`
- **Effort** : S (7 lignes).

#### P0-2. Écran de victoire : bouton « Partager ma story » illisible, bouton principal qui se fond dans le fond
- **Où** : `app/src/app/challenge.tsx:201-202`, la carte `:182` et `:327`. On le voit sur `brut-3-victoire.png` et sur
  la capture App Store `3-victoire.png`.
- **Problème** : le texte crème sur verre blanc, posé sur le pêche du bas du dégradé, donne un contraste de **≈ 1,6:1**.
  Le bouton dégradé or→rose est posé sur un fond or : son bord gauche disparaît. Le texte « Coq dans 3 XP » sur la carte
  brunâtre est à ≈ 3:1.
- **Pourquoi** : la règle du « peak-end » (critique) dit qu'on retient surtout la fin d'une expérience : la victoire,
  c'est la fin du matin. Le skill fixe un minimum de 4,5:1 pour le texte.
- **Correction** : ajouter `tone?: 'night' | 'dawn'` à `PrimaryButton` et `GhostButton` (`ui.tsx`). Sur l'écran de
  victoire, passer `tone="dawn"` :
  - bouton principal « dawn » : fond plein `colors.night` (#0A0B1A) sans dégradé, texte `colors.text`, ombre
    `shadowColor '#0A0B1A'`, opacité 0,3, rayon 16, décalage y 8. Contraste ≈ 17:1, et l'effet est très premium sur
    l'aube.
  - bouton secondaire « dawn » : `backgroundColor 'rgba(255,255,255,0.35)'`, `borderColor 'rgba(255,255,255,0.6)'`,
    texte `colors.onSun` (#1A0F0A). Contraste ≈ 12:1.
  - carte (`:182`) : ajouter `backgroundColor: 'rgba(10,11,26,0.35)'` et `borderColor: 'rgba(255,255,255,0.25)'`.
    `rankMuted` (`:327`) → `'rgba(255,255,255,0.9)'`.
  - Ensuite, refaire la capture App Store n° 3.
- **Effort** : S.

#### P0-3. Paywall : il déborde sur les iPhone 15/16 et sur l'iPhone SE (risque de refus par Apple)
- **Où** : `app/src/app/paywall.tsx:61-121` (pas de `ScrollView`), `:71` (marmotte de 150), `:73` (titre de 52).
- **Problème** : sur la capture 6,9" (le plus grand iPhone), il ne restait que ~60 pt de marge **avant** l'ajout du
  texte légal (3 lignes, ≈ 45 pt). D'après le calcul des hauteurs, sur un iPhone 16 Pro (874 pt de haut), le contenu
  dépasse d'environ 60 pt : les liens « Conditions · Confidentialité » sortent de l'écran et on ne peut pas faire
  défiler. Sur un iPhone SE (667 pt, compatible iOS 26), même le bouton d'essai peut disparaître. Or le paywall est
  **obligatoire**.
- **Pourquoi** : sur iOS, tout le contenu doit tenir dans la zone sûre (règle du skill). Apple exige aussi que les liens
  Conditions et Confidentialité soient visibles dans le paywall. Ses vérificateurs testent souvent les apps iPhone sur
  iPad, dans une fenêtre de la taille d'un iPhone.
- **Correction** :
  ```tsx
  const { height } = useWindowDimensions();
  const compact = height < 900; // tous les iPhone sauf les Plus / Pro Max
  <SafeAreaView style={{ flex: 1 }}>
    <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 24 }} showsVerticalScrollIndicator={false} bounces={false}>
      …même contenu ; le <View style={{ flex: 1 }} /> pousse toujours les offres en bas…
    </ScrollView>
  </SafeAreaView>
  // marmotte : size={compact ? 104 : 150} ; titre : fontSize compact ? 42 : 52, lineHeight compact ? 46 : 56
  ```
  Retirer `padding: 24` de `styles.safe` (`:128`), puisqu'il passe dans `contentContainerStyle`.
- **Effort** : S. Vérifier sur TestFlight avec un iPhone 15/16, ou dans le simulateur « iPhone SE ».

#### P0-4. Onboarding, étape « pseudo » : le clavier cache le bouton « Continuer »
- **Où** : `app/src/app/onboarding.tsx:68-189` et le champ `:94-102`.
- **Problème** : le `KeyboardAvoidingView` (la zone qui remonte au-dessus du clavier) entoure seulement le contenu. Le
  bouton « Continuer » est en dehors (`:185`), donc il reste en bas, **sous le clavier**, qui s'ouvre tout seul
  (`autoFocus`). Pour avancer, il faut deviner qu'on doit appuyer sur « retour ». C'est le 2ᵉ écran que voit chaque
  nouvel utilisateur.
- **Pourquoi** : sur iOS, aucun champ et aucun bouton ne doivent être cachés par le clavier (rubrique « petits écrans »
  de l'audit natif).
- **Correction** : mettre le bouton **dans** le `KeyboardAvoidingView` :
  `<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding"><View style={styles.body}>…</View><PrimaryButton …/></KeyboardAvoidingView>`.
  Sur le `TextInput`, ajouter `returnKeyType="next"`, `onSubmitEditing={next}` et `keyboardAppearance="dark"`.
- **Effort** : S.

#### P0-5. Textes « faibles » illisibles (dont le texte légal du paywall)
- **Où** : `app/src/lib/theme.ts:7` (`textFaint` 0,32). Il sert au texte légal 11 pt (`paywall.tsx:167`), aux lettres
  de la semaine, aux rangs de la ligue et au texte grisé du champ pseudo. Aussi le badge « −69 % », blanc sur rose
  (`paywall.tsx:154`).
- **Problème** : `textFaint` sur la nuit donne ≈ 2,6:1, et le blanc sur rose #FF5E8A ≈ 2,9:1.
- **Pourquoi** : le minimum du skill est 4,5:1 pour le texte normal.
- **Correction** : `textFaint: 'rgba(246,241,234,0.48)'` (≈ 4,6:1). Texte légal : `fontSize: 12, lineHeight: 16`.
  Badge : `color: '#1A0F0A'` (≈ 6,4:1).
- **Effort** : XS (3 lignes).

#### P0-6. L'app est sombre mais suit le mode clair d'iOS
- **Où** : `app/app.json:9` (`"userInterfaceStyle": "automatic"`).
- **Problème** : si l'iPhone est en mode clair, le clavier, les fenêtres d'alerte (« Malade ou blessé ? », « Supprimer
  ton compte ? ») et la fenêtre de partage s'affichent en **blanc** par-dessus la nuit.
- **Pourquoi** : quand une app n'a qu'une seule apparence, le skill demande qu'elle l'impose partout. Sinon les éléments
  natifs « cassent » le monde de l'app.
- **Correction** : `"userInterfaceStyle": "dark"`. ⚠️ C'est un réglage natif : il doit être dans le build de ce jour.
- **Effort** : XS.

### P1 — juste après le lancement

Tout ce qui suit est du code JavaScript, qui peut partir en **mise à jour automatique** (`docs/18`) sans repasser par
Apple, sauf mention contraire.

#### P1-1. Entrées en cascade lentes et toutes identiques
- **Où** : `(tabs)/index.tsx:64,73,85,100`, `onboarding.tsx:46`, `(tabs)/profile.tsx:36,43,58`, `(tabs)/league.tsx:53,79`,
  `paywall.tsx:70,76,87`, `challenge.tsx:172,181,200`.
- **Problème** : `FadeInDown` dure 500 à 600 ms avec la courbe par défaut de Reanimated (`Easing.inOut(Easing.quad)`, qui
  démarre lentement), avec un décalage de 90 à 120 ms entre éléments. Sur l'accueil, « Lancer le défi » n'est
  entièrement visible qu'au bout de **960 ms**, et le paywall au bout de 800 ms.
- **Pourquoi** : Emil veut qu'une entrée **décélère** (ease-out) et reste sous 300 à 400 ms sur une interface ; une cascade
  de 30 à 80 ms ne doit jamais bloquer l'action. Impeccable veut « un moment signé, pas le même effet d'entrée partout ».
- **Correction** : créer `app/src/lib/motion.ts` et l'utiliser partout :
  ```ts
  import { Easing, FadeInDown } from 'react-native-reanimated';
  export const easeOut = Easing.bezierFn(0.23, 1, 0.32, 1); // forte décélération
  export const enter = (i = 0) =>
    FadeInDown.duration(380).delay(Math.min(i, 3) * 50).easing(easeOut)
      .withInitialValues({ transform: [{ translateY: 12 }] });
  ```
  Sur l'accueil, `enter(0)` pour la marmotte et l'heure, `enter(1)` pour la semaine et le bouton : tout est visible en
  moins de 450 ms.
- **Effort** : S.

#### P1-2. Le halo « qui respire » ne s'arrête jamais
- **Où** : `app/src/components/ui.tsx:78-85`.
- **Problème** : quand `breathing` passe à `false`, la boucle continue. Le halo pulse donc aussi aux étapes 2 à 5 de
  l'onboarding et sur l'accueil après le défi gagné. En plus, l'animation change `shadowRadius`, ce qui force iOS à
  recalculer le flou de l'ombre à chaque image.
- **Pourquoi** : une animation doit avoir une raison d'être (Emil : « pourquoi ça bouge ? »). Et on anime de préférence
  ce qui ne coûte pas cher.
- **Correction** :
  `if (breathing) glow.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.sin) }), -1, true); else { cancelAnimation(glow); glow.value = withTiming(0, { duration: 200 }); }`.
  Animer seulement `shadowOpacity: 0.25 + glow.value * 0.3`, avec un `shadowRadius: 20` fixe dans
  `styles.primaryShadow`.
- **Effort** : XS.

#### P1-3. Défi : la caméra à 55 % recouvre l'aube, et les petits textes sont peu lisibles
- **Où** : `challenge.tsx:251-258` (`opacity: 0.55`), `:304` (« sur 15 pompes »), `:306` (conseil en bas).
- **Problème** : sur un vrai iPhone, l'image de la caméra (une chambre sombre à 6 h) passe **par-dessus** le ciel et le
  soleil. La signature de l'app se voit bien en démo, mais beaucoup moins en vrai. « sur 15 pompes » (texte faible sur
  le dégradé) est à ≈ 3:1 et se lit mal à 1 ou 2 m.
- **Pourquoi** : on protège le moment signé (Impeccable). Le contraste minimum est de 4,5:1.
- **Correction** : mettre la caméra dans un `Animated.View`, avec
  `cam.value = withTiming(bodyVisible ? 0.25 : 0.55, { duration: 600, easing: easeOut })` : on se voit pour se placer,
  puis l'aube prend le dessus. `target` et `hint` passent en `color: 'rgba(246,241,234,0.85)'`, avec
  `textShadowColor: 'rgba(10,11,26,0.5)'` et `textShadowRadius: 8`. `hint` passe en `fontSize: 15`.
- **Effort** : S. **À ressentir sur l'iPhone** : on doit encore pouvoir vérifier son cadrage.

#### P1-4. Victoire : passage brutal, et marmotte qui rebondit sans fin
- **Où** : `challenge.tsx:114-123` (700 ms d'attente, puis l'écran change d'un coup), `:161` (écran de victoire sans
  entrée), `app/src/components/mascot.tsx:33-34` (le mode `bounce` boucle à l'infini, avec une courbe sinus qui
  « flotte » au lieu de sauter).
- **Correction** : remplacer la `View` racine de l'écran de victoire par
  `<Animated.View entering={FadeIn.duration(300)} style={styles.screen}>`. Pour le saut :
  `withRepeat(withTiming(1, { duration: 380, easing: Easing.out(Easing.quad) }), 6, true)` donne 3 sauts. La montée
  décélère et la descente accélère, comme avec la gravité. Ensuite, la marmotte reste immobile.
- **Pourquoi** : on évite le changement d'état sec (Emil, « occasions manquées »). Une boucle décorative qui ne s'arrête
  pas devient du bruit.
- **Effort** : S.

#### P1-5. Accueil : « Réglages » en lien souligné, cible trop petite
- **Où** : `(tabs)/index.tsx:80-82` et `:131-132`.
- **Problème** : c'est le seul accès pour changer l'heure du réveil. Le lien souligné fait « site web », et sa zone
  tactile fait ~34 pt alors qu'iOS demande 44 pt.
- **Pourquoi** : le test « slop » iOS du skill repère les contrôles qui ressemblent à du web, et le skill fixe 44×44 pt
  minimum.
- **Correction** : rendre l'heure elle-même tactile, comme dans l'app Horloge :
  `<Pressable onPress={() => router.push('/settings')} accessibilityRole="button" accessibilityLabel={`Réveil à ${time}, modifier`}>`.
  Remplacer le lien par la `Pill` existante « Modifier le réveil » dans un `Pressable` avec `hitSlop={6}` et un retour
  d'appui `opacity: 0.7`.
- **Effort** : S.

#### P1-6. Accueil sur petit écran et avec un grand texte : le bouton passe sous la barre d'onglets
- **Où** : `(tabs)/index.tsx:98` (espace flexible), `:135` (`marginBottom: 110`), `:74`, `:130`, et les textes de
  `ui.tsx:19-41`.
- **Problème** : sur un iPhone SE, la page fait ~680 pt pour 667 disponibles, et ~750 pt le soir, quand « Bonne nuit »
  s'affiche. « Lancer le défi » glisse alors sous la barre flottante. Aucun texte n'a de limite de taille : avec le
  « texte plus grand » d'iOS, l'heure de 92 pt grossit encore et pousse tout vers le bas.
- **Correction** : entourer le contenu d'une `ScrollView` avec `contentContainerStyle={{ flexGrow: 1 }}` et
  `bounces={false}`. Si `height < 740` : marmotte 84, heure `fontSize: 76`, `lineHeight: 82`. Dans `ui.tsx`, ajouter
  `maxFontSizeMultiplier={1.15}` à `Serif`, `1.3` à `Eyebrow` et aux libellés de boutons, `1.4` à `Label` et `Body`.
  Ajouter `1.2` aux libellés de `pill-tab-bar.tsx:29`.
- **Effort** : S.

#### P1-7. Emojis à la place d'icônes
- **Où** : `(tabs)/index.tsx:91` (🛡), `:111` (🌙), `:118` (☀︎), `app/src/components/week-dots.tsx:29` (🛡),
  `app/src/app/settings.tsx:156,158` (✓ ⚠︎), `onboarding.tsx:59` (‹), `app/src/components/share-card.tsx:40` (🔥).
- **Problème** : on voit sur la capture que le 🛡 s'affiche comme un contour blanc. Mélangés au serif italique, les
  emojis font « bricolé ».
- **Pourquoi** : le skill (« craft floor ») refuse les emojis en guise d'icônes. Sur iOS, on utilise les SF Symbols.
- **Correction** : `expo-symbols` est déjà installé. Utiliser
  `<SymbolView name="shield.fill" size={14} tintColor={colors.gold} />`, et de même `moon.stars.fill`,
  `sun.max.fill`, `checkmark.seal.fill`, `exclamationmark.triangle.fill`, `chevron.left` (taille 20, épaisseur
  `semibold`). Ajouter une option `icon` à `GhostButton`. Sur la carte de partage, écrire simplement « 14 jours de
  suite ».
- **Effort** : S-M.

#### P1-8. VoiceOver : boutons et onglets sans rôle
- **Où** : `ui.tsx:88,101`, `pill-tab-bar.tsx:27`, `paywall.tsx:91`, `(tabs)/index.tsx:66,74`.
- **Problème** : un seul `accessibilityLabel` dans toute l'app (`onboarding.tsx:58`). VoiceOver ne dit pas « bouton »,
  ne sait pas quel onglet est actif, ni quelle offre est choisie.
- **Correction** : voir la partie 4 (rôles et états, valeurs exactes).
- **Effort** : S.

#### P1-9. Paywall : achat sans retour visuel et textes flous
- **Où** : `paywall.tsx:37-47` (`busy` n'affiche rien), `:105-108`, `app/src/lib/purchases.ts:37,40,113`.
- **Problème** : après l'appui, rien ne bouge le temps que la fenêtre d'Apple arrive. Avec l'offre mensuelle, le bouton
  dit seulement « Continuer ». « Annulable à tout moment » est collé au bouton « Restaurer » : toucher la promesse lance
  une restauration. « €/mois » se retrouve seul sur une 2ᵉ ligne (visible sur la capture).
- **Pourquoi** : on montre toujours l'état du système (critique, heuristique n° 1) et on rassure au moment où l'enjeu
  est fort.
- **Correction** :
  - pendant l'achat : `label="Un instant…"`, `opacity: 0.6`, bouton désactivé ;
  - offre mensuelle : CTA `S’abonner · 7,99 €/mois` ;
  - sous le bouton, une ligne 13 pt `textMuted` : « 7 jours gratuits, puis 29,99 €/an. Sans engagement. » (prix
    repris de l'offre) ;
  - « Restaurer mes achats » seul, comme lien ;
  - dans `purchases.ts:37`, une espace insécable : `'soit 2,50 €/mois'`.
- **Effort** : S.

### P2 — plus tard

- **Réglages** (`settings.tsx:183`) : le gros bouton dégradé « Terminé » au milieu de la page brouille le sens du bouton
  « soleil » (= l'action qui compte). Le remplacer par un « OK » en haut à droite (17 pt, or, 44 pt). On peut déjà
  fermer en glissant vers le bas. Agrandir la zone tactile des liens du bas (`:186-194`) avec `hitSlop={12}`.
- **Barre d'onglets** (`pill-tab-bar.tsx:28`) : `LinearTransition` ne fait rien, car la pastille active est recréée dans
  un autre onglet. Elle saute au lieu de glisser. Voir « Ajouter », partie 3.
- **Verre dépoli** (`ui.tsx:46`) : chaque carte a un `BlurView` au-dessus d'une aurore qui bouge, donc iOS recalcule le
  flou à chaque image (5 flous sur « Évolution »), pour un effet presque invisible sur un dégradé lisse. Garder le flou
  seulement sur la barre d'onglets. À essayer en compensant avec `backgroundColor: 'rgba(20,19,46,0.45)'`.
- **Aurore** (`app/src/components/aurora.tsx:14`) : elle continue de tourner sur les onglets cachés. La mettre en pause
  avec `useIsFocused()` et `cancelAnimation`.
- **Barre d'XP** (`ui.tsx:110-112`) : elle anime `width`, une propriété de mise en page. Animer plutôt `translateX` du
  remplissage. Durée 900 → 600 ms avec `easeOut`.
- **Surtitres** (« eyebrows ») redondants : `onboarding.tsx:90` (« Ton pseudo » au-dessus de « Comment on
  t'appelle ? »), `:113`, `:143`, `:162`, et `profile.tsx:30`. Le skill interdit les surtitres au-dessus d'un titre.
  Garder seulement ceux qui apportent une information (date, « Fin dans 4 jours », « Prochain réveil »).
- **Retours d'appui manquants** : la pastille de niveau (`(tabs)/index.tsx:66`), les offres (`paywall.tsx:91`) et les
  liens. Ajouter `opacity: 0.7` quand on appuie, et `Haptics.selectionAsync()` sur le choix d'une offre et dans
  `ChoiceRow`.
- **Écran verrouillé** (`app/targets/sleep/SleepLiveActivity.swift`) :
  - Dynamic Island compacte (`:94-97`) : un compte à rebours avec secondes (« 7:12:33 ») stresse au coucher et risque
    d'être coupé à 56 pt. Afficher plutôt l'heure : `Text(context.state.alarm, style: .time)`.
  - Pied (`:216-229`) : ajouter `.tracking(0.5)`, `.lineLimit(1)` et `.minimumScaleFactor(0.8)`.
  - Images décoratives (`:233-253`) : `.accessibilityHidden(true)`, sinon VoiceOver lit « marmotte-dort ».
  - Garder la police système : c'est le bon choix sur l'écran verrouillé.
- **Liquid Glass iOS 26** : `expo-glass-effect` est installé. À essayer sur la barre d'onglets, après le lancement.

---

## 3. Animations : garder, raccourcir, supprimer, ajouter

**À garder (c'est déjà juste)**

| Animation | Fichier | Pourquoi |
|---|---|---|
| Ciel qui se réchauffe (700 ms, ease-out) + soleil qui monte (`translateY`) | `challenge.tsx:93,98` | le moment signé, propre au produit |
| Anneau qui se remplit (450 ms, ease-out cubique) | `app/src/components/progress-ring.tsx:24` | il montre la progression, avec la bonne durée et la bonne courbe |
| Vibration forte à chaque pompe + vibration « succès » à la fin | `challenge.tsx:130,113` | le retour qui se sent sans regarder l'écran |
| Aurore qui dérive (9 à 13 s, sinus) | `aurora.tsx` | assez lente pour rester en fond (mettre en pause hors écran, P2) |
| Respiration de la marmotte (1 800 ms, 1,5 à 2,5 %) | `mascot.tsx` | subtile, elle donne de la vie sans distraire |
| Sortie d'étape d'onboarding (200 ms) | `onboarding.tsx:69` | une sortie plus courte que l'entrée : c'est la règle |

**À raccourcir ou corriger**

| Animation | Aujourd'hui | Cible |
|---|---|---|
| Appui sur les boutons | ressort mou, ~2 s | `withTiming(0.97, 100 ms)`, puis `withSpring(1, { mass: 1, damping: 20, stiffness: 400 })` |
| Entrées d'écran | 500-600 ms, ease-in-out, cascade 90-120 ms | 380 ms, `Easing.bezierFn(0.23, 1, 0.32, 1)`, cascade 50 ms (maximum 150), décalage de 12 pt |
| Halo du bouton | 1 600 ms, anime le rayon de l'ombre, ne s'arrête pas | 2 400 ms, seulement l'opacité 0,25 → 0,55, arrêt en 200 ms |
| Chiffre du défi | pic 1,18, ressort 3,5 s | pic 1,12 en 80 ms, puis `{ mass: 1, damping: 12, stiffness: 300 }` |
| Zoom des marmottes | depuis 0, pic 1,7× | depuis 0,6, `.mass(1).damping(12).stiffness(200)` |
| Barre d'XP | 900 ms, anime la largeur | 600 ms, `easeOut`, en `translateX` |

**À supprimer**

- `LinearTransition.springify()` dans `pill-tab-bar.tsx:28` : il ne fait rien. Le remplacer (voir ci-dessous) ou
  l'enlever.
- Le saut de victoire en boucle infinie : passer à 3 sauts, puis immobile.
- La cascade en 4 temps sur l'accueil, que l'on voit tous les jours : 2 temps maximum, et le bouton visible en moins de
  450 ms. Emil : plus un écran est vu souvent, moins il doit bouger.

**À ajouter (là où un vrai moment le mérite)**

1. **Entrée de la victoire** : fondu de 300 ms sur tout l'écran (P1-4).
2. **Barre d'XP de victoire qui part de l'ancien total** : enregistrer `xpBefore` dans `finish()`
   (`challenge.tsx:103`). Animer de l'ancienne progression vers la nouvelle (délai 500 ms, 700 ms `easeOut`), puis
   `Haptics.impactAsync(Light)` à l'arrivée. On **voit** alors ce qu'on vient de gagner.
3. **Passage de niveau** (`challenge.tsx:165-187`) : l'ancienne marmotte disparaît (échelle 1 → 0,9, opacité 0,
   200 ms), puis la nouvelle arrive (0,6 → 1, ressort `{ mass: 1, damping: 12, stiffness: 200 }`), avec deux
   vibrations (succès, puis forte 150 ms après). C'est le moment le plus fort de la gamification, et il est traité comme
   une victoire normale aujourd'hui.
4. **Pastille d'onglet qui glisse** : une seule pastille en position absolue. Mesurer chaque onglet avec `onLayout`,
   animer `translateX` et `width` avec `withSpring({ mass: 1, damping: 26, stiffness: 320 })` (pas de rebond, ~300 ms).
   Ajouter `Haptics.selectionAsync()` au changement d'onglet.
5. **Partage de story** (`challenge.tsx:207`) : la carte arrive depuis l'échelle 0,96 et 16 pt plus bas (300 ms,
   `easeOut`), en plus du fondu.
6. **Le ciel de l'accueil qui se réchauffe** au retour d'un matin gagné : animer `warmth` de l'aurore sur 1 200 ms au
   lieu de changer d'un coup (`(tabs)/index.tsx:62`).

---

## 4. Accessibilité rapide

**Contrastes** (minimum 4,5:1 pour le texte normal, 3:1 pour les gros titres)

| Élément | Aujourd'hui | Après correction |
|---|---|---|
| `textFaint` sur la nuit (texte légal, lettres de la semaine, rangs) | ≈ 2,6:1 ❌ | 0,48 → ≈ 4,6:1 (P0-5) |
| « Partager ma story » sur l'aube | ≈ 1,6:1 ❌ | texte foncé sur verre clair → ≈ 12:1 (P0-2) |
| « Coq dans 3 XP » sur la carte de victoire | ≈ 3:1 ❌ | ≈ 6:1 (P0-2) |
| « sur 15 pompes » pendant le défi | ≈ 3:1 ❌ | 0,85 + ombre portée (P1-3) |
| Badge « −69 % » blanc sur rose | ≈ 2,9:1 ❌ | texte #1A0F0A → ≈ 6,4:1 (P0-5) |
| `textMuted` sur la nuit | ≈ 6,3:1 ✅ | — |
| Texte des boutons soleil (#1A0F0A sur or→rose) | 6,4 à 12:1 ✅ | — |
| « ZONE DE PROMOTION » or sur la nuit | ≈ 12:1 ✅ | — |
| Écran verrouillé, texte gris sur la carte | ≈ 6:1 ✅ | — |

**Taille des zones tactiles** (minimum 44×44 pt) : « Réglages » sur l'accueil fait ~34 pt (P1-5). Les liens
« Conditions · Confidentialité » du paywall font ~15 pt : en faire deux `Pressable` séparés, `paddingVertical: 12`,
13 pt. Les liens du bas des réglages font ~18 pt (`hitSlop={12}`). Les onglets font ~43 pt : passer `paddingVertical`
de 12 à 13 dans `pill-tab-bar.tsx:49`. Tout le reste est bon : boutons 60 pt, choix 48 pt, « ‹ » 52 pt avec sa marge.

**Taille du texte** (le « texte plus grand » d'iOS) : React Native agrandit tous les textes sans limite, sur des écrans
qui ne défilent pas. Ajouter les limites `maxFontSizeMultiplier` de P1-6. En React 19, `Text.defaultProps` ne marche
plus : il faut les mettre dans chaque composant de `ui.tsx`.

**Réduire les animations** : bonne nouvelle, Reanimated 4 respecte déjà ce réglage par défaut (`ReduceMotion.System`,
vérifié dans `BaseAnimationBuilder.ts:14`). Quand il est activé, l'aurore et le halo s'arrêtent, et les entrées et les
ressorts sautent directement à la fin. C'est acceptable, parce que les vibrations et les changements d'état restent.
Pour faire mieux, dans `challenge.tsx`, `const reduce = useReducedMotion();` :
- si `reduce`, le soleil ne monte plus (`translateY` à 0) et n'apparaît qu'en fondu (son opacité garde la même formule) ;
- l'anneau garde son remplissage de 300 ms avec `reduceMotion: ReduceMotion.Never` : une barre qui se remplit
  n'est pas un mouvement qui donne la nausée, et elle aide à comprendre.

Test : Réglages iPhone → Accessibilité → Mouvement → Réduire les animations.

**VoiceOver** (P1-8, valeurs exactes) :
- `PrimaryButton` et `GhostButton` (`ui.tsx:88,101`) : `accessibilityRole="button"`, et
  `accessibilityState={{ disabled: busy }}` sur le paywall ;
- onglets (`pill-tab-bar.tsx:27`) : `accessibilityRole="tab"` et `accessibilityState={{ selected: active }}`. La barre :
  `accessibilityRole="tablist"` ;
- offres (`paywall.tsx:91`) : `accessibilityRole="radio"`, `accessibilityState={{ checked: isSelected }}`,
  `accessibilityLabel={`${plan.title}, ${plan.price}, ${plan.detail}`}` ;
- marmotte tactile (`(tabs)/index.tsx:74`) : `accessibilityLabel={`Ta marmotte, niveau ${index + 1}`}` ;
- compteur du défi (`challenge.tsx:263`) : `accessibilityLabel={`${count} ${label.plural} sur ${settings.reps}`}` ;
- écran verrouillé : `.accessibilityHidden(true)` sur le badge, la marmotte et les stations (P2).

---

## Ce qui n'a pas été vérifié

- Je n'avais ni simulateur ni iPhone. Les ressorts, les contrastes et les hauteurs sont **calculés** à partir du code.
  À contrôler dans TestFlight :
  - le paywall sur un iPhone 15 ou 16, et dans le simulateur « iPhone SE » ;
  - l'écran de victoire ;
  - l'étape « pseudo » avec le clavier ;
  - le ressenti des boutons (enregistrer l'écran au ralenti, puis regarder image par image).
- Les captures `brut-*` viennent du mode démo, sans caméra. Le point P1-3 (caméra sur l'aube) doit être jugé sur un
  vrai iPhone.
- Le journal (`docs/00-journal.md`) n'a pas été modifié, comme demandé.

## Prochaine étape — feu vert de Kenji

À décider par Kenji : **appliquer les 6 P0 avant le build de production d'aujourd'hui** ? Ça prend ~1 h 30, et P0-6
doit être dans le build. Les P1 peuvent suivre dans la semaine, en mise à jour automatique (sans nouvelle vérification
par Apple).
