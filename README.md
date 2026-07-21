# 🛡️ Sentinel Ops

> Plateforme de monitoring d'infrastructure asynchrone et sécurisée, conçue pour les environnements Cloud modernes.

Sentinel Ops est une solution SaaS B2B permettant de surveiller la disponibilité et la latence des services web en temps réel. L'architecture est totalement découplée (Micro-services) pour garantir une haute disponibilité.

🔗 **[Voir le projet en direct](https://sentinel-ops-chi.vercel.app/)**

---

## ⚙️ Architecture Technique

*   **Frontend :** Next.js 14, React, Tailwind CSS V4. Déployé sur Vercel.
*   **Backend :** Python, FastAPI, SQLAlchemy. Gère l'authentification Zero-Trust (JWT) et le CORS. Déployé sur Render.
*   **Database :** PostgreSQL relationnelle, sécurisée par des UUIDs v4 (extension uuid-ossp).
*   **Asynchrone :** Tâches de fond détachées de l'Event Loop de l'API.

## ✨ Cybersécurité
*   Authentification par jetons cryptographiques (JWT).
*   Mots de passe protégés par hachage asymétrique (Bcrypt).
*   Protection CORS configurée pour isoler les requêtes front/back.

---
*Conçu et développé dans une optique de robustesse industrielle.*
