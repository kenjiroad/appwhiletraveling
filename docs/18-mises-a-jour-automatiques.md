# Mises à jour automatiques (EAS Update + EAS Workflows) — configuré

_Date : 28 octobre 2026_

## Le but

Plus de ZIP ni de Terminal pour Kenji. Claude envoie le code sur GitHub → Expo s'occupe du reste.

## Comment ça marche

À chaque envoi sur la branche `claude/compassionate-goldberg-gfgu0j`, Expo lance le « workflow »
`app/.eas/workflows/preview.yml` :

1. Il calcule l'**empreinte** du code natif (Swift, outils natifs, réglages `app.json`).
2. **Empreinte déjà connue** (seul le code de l'app a changé) → il envoie une **mise à jour à distance**
   (EAS Update). L'app sur l'iPhone la télécharge toute seule et l'applique au **lancement suivant**.
3. **Empreinte nouvelle** (code natif changé) → il fabrique un **nouveau build**. Kenji l'installe depuis
   expo.dev → projet debout → Builds (lien / QR code).

## Réglages ajoutés

| Fichier | Quoi |
|---|---|
| `app/app.json` | `owner: kenjiroad`, Project ID `e3e7b9e6-…`, `runtimeVersion: fingerprint`, adresse des mises à jour |
| `app/eas.json` | un « canal » par profil (`development`, `preview`, `production`) |
| `app/package.json` | `expo-updates` (l'outil qui reçoit les mises à jour) |
| `app/.eas/workflows/preview.yml` | la règle automatique ci-dessus |

## Ce que Kenji doit faire (une fois)

1. expo.dev → projet **debout** → **Project settings** → **GitHub** → connecter le dépôt
   `kenjiroad/appwhiletraveling`, **Base directory** : `app`.
2. C'est tout. Le build lancé le 28/10 n'a pas encore l'outil de mise à jour : le prochain envoi sur GitHub
   déclenchera automatiquement un nouveau build (empreinte nouvelle). L'installer ; ensuite les mises à jour
   arrivent seules.

## Limites

- Offre gratuite d'Expo : builds et mises à jour limités par mois (voir expo.dev → Billing).
- La règle suit la branche de travail actuelle ; à changer pour `main` le jour où on fusionne.

## Mise à jour du 29/10 : ce qui bloquait, et le plan

- Les builds lancés depuis expo.dev partaient en profil **production**, qui demande une validation Apple
  interactive (identifiant + code) : impossible sans Terminal.
- **Plan retenu : Claude lance lui-même les builds et les mises à jour** depuis sa session, avec un jeton Expo.
  - Kenji crée un jeton sur expo.dev → Account settings → **Access tokens** → Create, et le met dans les réglages
    de l'environnement Claude (menu de l'environnement → **Edit** → Network secrets / variables) sous le nom
    `EXPO_TOKEN`. Jamais dans le chat.
  - Domaines à autoriser dans **Network access → Allowed domains** : `expo.dev`, `api.expo.dev`, `u.expo.dev`,
    `storage.googleapis.com` (envoi du code vers les serveurs d'Expo).
  - Ensuite : petit changement → Claude envoie une **mise à jour à distance** (`eas update`), l'app la prend au
    prochain lancement ; gros changement → Claude lance le **build** (`eas build --non-interactive`) et lit
    lui-même les erreurs. Kenji n'a plus qu'à toucher « Install ».
- Limite : quand on ajoute une nouvelle extension (comme la marmotte de nuit), Apple veut une fois l'identifiant
  de Kenji → un build depuis le Terminal, ce jour-là seulement.
