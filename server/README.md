# Live Trading Terminal Backend

Backend placeholder for the production architecture: market data -> strategy engine -> signals -> paper trades -> history -> dashboard.

GitHub Pages serves only the frontend. A live backend must be deployed separately (Render, Railway, Fly.io, Cloud Run, etc.) and connected through `API_BASE` in the frontend.

The initial deployment remains PAPER MODE: no broker order execution is enabled.
