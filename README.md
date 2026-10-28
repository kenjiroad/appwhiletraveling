# Debout ⏰💪 — le réveil qui ne s'arrête que quand tu bouges

Première app iOS, construite en voyageant. Le réveil sonne, et pour l'arrêter il faut faire ses pompes ou ses squats devant la
caméra. L'IA (Apple Vision, sur le téléphone) compte les répétitions. Pas de bouton « répéter ».

## Lancer l'app

```bash
cd app && npm install && npx expo start
```

Dans **Expo Go**, le défi passe en mode démo (tu tapes l'écran à chaque répétition). Pour la vraie caméra,
il faut un build EAS : voir [docs/09-debout-v1.md](docs/09-debout-v1.md).

## Les étapes (à lire dans l'ordre)

0. [Journal de bord](docs/00-journal.md) — ce qui a été fait, étape par étape
1. [Étude de marché](docs/01-etude-de-marche.md) — première idée (Ladder → Cordée, en pause)
2. [Critères d'une bonne app](docs/02-criteres-bonne-app.md)
3. [Stack technique](docs/03-stack-technique.md)
4. [Feuille de route](docs/04-feuille-de-route.md) — version Cordée
5. [Nouvelles idées](docs/05-nouvelles-idees.md) — apps qui se distribuent seules
6. [Veille sur X](docs/06-veille-x.md)
7. [L'app en 1 jour : Ménage](docs/07-app-en-1-jour.md) — abandonnée
8. [Partir de la douleur](docs/08-recherche-douleurs-et-choix.md) — comment on a choisi Debout
9. [Debout V1](docs/09-debout-v1.md) — fonctionnement, comment tester
10. [Direction artistique](docs/10-direction-artistique.md) — le design actuel, XP, rangs, ligue
11. [Design & marketing](docs/11-design-marketing-debout.md) — méthode Floup appliquée à Debout, PRD léger
12. [DA « Aube »](docs/12-da-aube.md) — le design actuel, animations
13. [La mascotte](docs/13-mascotte.md) — **la marmotte qui évolue**, vidéos de démo
14. [Carnet de bord](docs/14-carnet-de-bord.md) — jour par jour + finances
15. [Comptes + vraie ligue](docs/15-comptes-et-ligue.md) — Supabase, ce que Kenji doit configurer
16. [Vrai réveil (AlarmKit)](docs/16-reveil-alarmkit.md) — sonne même en silencieux
17. [Abonnements (RevenueCat)](docs/17-abonnements-revenuecat.md) — achats réels, ce que Kenji doit configurer
18. [Mises à jour automatiques](docs/18-mises-a-jour-automatiques.md) — GitHub → Expo → iPhone, sans Terminal
20. [Retours du premier test](docs/20-retours-premier-test.md) — corrections après le test sur iPhone
