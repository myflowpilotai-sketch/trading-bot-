# XAU Signal Engine

Dashboard web pour le projet **XAU Signal Engine** : analyse multi-timeframe, signaux LONG/SHORT, graphique, paper trading et statistiques.

## Important

Cette version est une **interface front-end / paper trading**. Les prix, positions et statistiques actuellement affichés dans la démo sont des données d'interface et ne doivent pas être considérés comme des performances réelles.

Aucun ordre n'est envoyé à un broker.

## Fonctionnalités UI

- Dashboard XAUUSD M5
- Graphique chandeliers avec Entry / SL / TP
- Marquage visuel BOS M15 et signal LONG/SHORT
- Conditions H4 / H1 / M15 / M5
- Historique des signaux
- Vue Paper Trading
- Statistiques et scénarios RR
- Page Configuration
- Responsive desktop/mobile

## Mise en ligne avec GitHub Pages

1. Ouvrir **Settings → Pages** dans ce dépôt.
2. Dans **Build and deployment**, choisir **Deploy from a branch**.
3. Sélectionner `main` et `/ (root)`.
4. Enregistrer.

Le site sera alors servi par GitHub Pages.

## Prochaine étape : données réelles

Pour passer de la maquette au système complet, il faut connecter :

`TradingView Pine v6 → Webhook HTTPS → API backend → PostgreSQL → WebSocket/API → Dashboard`

Le backend devra valider le secret applicatif, le symbole, la direction, le timestamp, dédupliquer les signaux et enregistrer les événements avant de les pousser au dashboard.

Le projet d'origine exige également des tests anti-repaint, des backtests reproductibles et une séparation in-sample/out-of-sample avant toute interprétation de performance.
