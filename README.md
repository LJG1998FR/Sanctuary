# 🎬 The Sanctuary

> **Stack** : Backend Symfony 7.4 (API REST + Admin Twig) · Frontend React 19 (Create React App) · Auth JWT + Refresh Token · Doctrine ORM · MySQL 8.0

---

## 📋 Table des matières

1. [Prérequis](#-prérequis)
2. [Structure du projet](#-structure-du-projet)
3. [Installation du Backend (Symfony)](#-installation-du-backend-symfony)
4. [Configuration des variables d'environnement](#-configuration-des-variables-denvironnement)
5. [Génération des clés JWT](#-génération-des-clés-jwt--étape-critique)
6. [Base de données & Migrations](#-base-de-données--migrations)
7. [Installation du Frontend (React)](#-installation-du-frontend-react)
8. [Lancer le projet](#-lancer-le-projet)
9. [Routes API disponibles](#-routes-api-disponibles)
10. [Flux d'authentification JWT](#-flux-dauthentification-jwt)
11. [CORS — Communication Frontend / Backend](#-cors--communication-frontend--backend)
12. [Administration (Backoffice Twig)](#-administration-backoffice-twig)
13. [Tests](#-tests)
14. [Sécurité — Checklist production](#-sécurité--checklist-production)

---

## ✅ Prérequis

Avant de commencer, assure-toi d'avoir les outils suivants installés sur ta machine :

| Outil | Version minimale | Vérification |
|---|---|---|
| PHP | `>= 8.2` | `php -v` |
| Composer | `>= 2.x` | `composer -V` |
| Node.js | `>= 14.x` | `node -v` |
| npm | `>= 6.x` | `npm -v` |
| MySQL | `8.0` | `mysql --version` |
| OpenSSL | any | `openssl version` |
| Symfony CLI *(optionnel mais recommandé)* | latest | `symfony version` |

> 💡 **Pourquoi OpenSSL ?** Les tokens JWT sont signés avec l'algorithme asymétrique `RS256`, ce qui nécessite une paire de clés RSA. OpenSSL est l'outil standard pour les générer.

---

## 📁 Structure du projet

```
/
├── src/                        # Code source PHP (Symfony)
│   ├── Controller/
│   │   ├── Api/                # Contrôleurs de l'API REST
│   │   │   ├── AuthController.php      # Register / Logout
│   │   │   └── VideoController.php     # Liste paginée des vidéos
│   │   └── Admin/              # Contrôleurs backoffice Twig
│   ├── Entity/                 # Entités Doctrine (User, Video, RefreshToken...)
│   ├── Repository/             # Repositories Doctrine
│   ├── EventListener/          # Listeners (AuthSuccess, ApiException...)
│   └── Helper/                 # Services utilitaires (FileManager...)
├── config/
│   ├── jwt/                    # Clés RSA (à générer — NE PAS COMMITTER)
│   ├── packages/
│   │   ├── security.yaml               # Firewalls, access_control
│   │   ├── lexik_jwt_authentication.yaml  # Config JWT
│   │   ├── gesdinet_jwt_refresh_token.yaml  # Config Refresh Token
│   │   └── nelmio_cors.yaml            # Config CORS
│   └── routes.yaml             # Routes principales
├── public/
│   └── uploads/                # Fichiers uploadés (vidéos, photos, thumbnails...)
├── front/                      # Application React (CRA)
│   ├── src/
│   └── package.json
├── .env.example                # Template des variables d'environnement (commité)
└── composer.json
```

---

## 🔧 Installation du Backend (Symfony)

### 1. Cloner le projet

```bash
git clone <URL_DU_REPO>
cd the-sanctuary
```

### 2. Installer les dépendances PHP

```bash
composer install
```

> Cette commande installe toutes les librairies déclarées dans `composer.json`, notamment :
> - `lexik/jwt-authentication-bundle` — gestion des tokens JWT
> - `gesdinet/jwt-refresh-token-bundle` — gestion des refresh tokens
> - `nelmio/cors-bundle` — gestion des headers CORS pour le frontend React
> - `doctrine/orm` + `doctrine/doctrine-migrations-bundle` — ORM et migrations BDD
> - `jms/serializer-bundle` — sérialisation JSON avancée

---

## ⚙️ Configuration des variables d'environnement

Le projet fournit un fichier `.env.example` avec toutes les variables nécessaires et des valeurs de test. Copie-le en `.env.local` (jamais commité) :

```bash
cp .env.example .env.local
```

Édite ensuite `.env.local` et adapte les valeurs à ton environnement local :

```dotenv
# ─── Application ───────────────────────────────────────────────────────────────
APP_ENV=dev
APP_SECRET=change_me_with_a_random_string_in_production
APP_NAME="The Sanctuary"
ASSETS_PREFIX=http://localhost:8000

# ─── Base de données (MySQL 8.0) ───────────────────────────────────────────────
DATABASE_URL="mysql://DB_USER:DB_PASSWORD@127.0.0.1:3306/DB_NAME?serverVersion=8.0&charset=utf8mb4"
# Exemple : DATABASE_URL="mysql://root:password@127.0.0.1:3306/the_sanctuary?serverVersion=8.0"

# ─── JWT — Clés RSA ─────────────────────────────────────────────────────────────
JWT_SECRET_KEY=%kernel.project_dir%/config/jwt/private.pem
JWT_PUBLIC_KEY=%kernel.project_dir%/config/jwt/public.pem
JWT_PASSPHRASE=ta_passphrase_ici        # ⚠️ Doit correspondre à la passphrase utilisée lors de la génération des clés
JWT_TTL=3600                            # Durée de vie du token en secondes (ici : 1h)

# ─── Refresh Token ─────────────────────────────────────────────────────────────
REFRESH_TOKEN_TTL=2592000               # Durée de vie du refresh token (ici : 30 jours)
```

> 🔑 **Point clé sur `JWT_PASSPHRASE`** : c'est la passphrase qui **chiffre ta clé privée RSA** sur le disque. Elle doit être **strictement identique** entre la génération des clés (étape suivante) et cette variable. Un mismatch provoque une erreur `Unable to load key` au login — difficile à debugger pour un junior, d'où l'importance de bien l'annoter.

---

## 🔑 Génération des clés JWT — Étape critique

The Sanctuary utilise **LexikJWTAuthenticationBundle** avec l'algorithme `RS256` (asymétrique). Contrairement à HS256 (secret partagé), RS256 utilise **deux clés distinctes** :

- **Clé privée** → utilisée par le serveur pour **signer** le token
- **Clé publique** → utilisée pour **vérifier** la signature (peut être partagée)

### Option A — Via Symfony (recommandée ✅)

```bash
php bin/console lexik:jwt:generate-keypair
```

Cette commande lit automatiquement `JWT_PASSPHRASE` depuis `.env.local` et génère les deux fichiers dans `config/jwt/`. C'est la méthode la plus simple et la moins risquée.

### Option B — Via OpenSSL manuellement

```bash
# Étape 1 : créer le répertoire
mkdir -p config/jwt

# Étape 2 : générer la clé privée RSA chiffrée (la passphrase sera demandée interactivement)
openssl genrsa -out config/jwt/private.pem -aes256 4096

# Étape 3 : extraire la clé publique depuis la clé privée (passphrase demandée à nouveau)
openssl rsa -pubout -in config/jwt/private.pem -out config/jwt/public.pem
```

### Résultat attendu

```
config/jwt/
├── private.pem     # 🔴 Clé privée RSA — NE JAMAIS COMMITTER
└── public.pem      # 🟢 Clé publique RSA
```

> ⚠️ **Vérifie ton `.gitignore`** : `config/jwt/` doit impérativement y figurer. Ces fichiers sont des **secrets applicatifs** au même titre que des mots de passe.

### Schéma de fonctionnement RS256

```
[Client]  ─── POST /api/login ─────────────►  [Symfony]
                                                   │
                                           Vérifie username/password en BDD
                                                   │
                                           Signe le JWT avec la clé PRIVÉE (private.pem)
                                                   │
          ◄── { token, refresh_token } ────────────

[Client]  ─── GET /api/videos ─────────────►  [Symfony]
              Authorization: Bearer <token>        │
                                           Vérifie la signature avec la clé PUBLIQUE (public.pem)
                                                   │
          ◄── { data } ────────────────────────────
```

---

## 🗄️ Base de données & Migrations

### 1. Créer la base de données

```bash
php bin/console doctrine:database:create
```

### 2. Exécuter les migrations

```bash
php bin/console doctrine:migrations:migrate
```

> Cette commande crée toutes les tables : `user`, `video`, `refresh_tokens`, etc.

### Commandes utiles

```bash
# Voir l'état des migrations
php bin/console doctrine:migrations:status

# Générer une migration après modification d'une entité
php bin/console make:migration

# Vérifier le schéma BDD vs les entités (diagnostic)
php bin/console doctrine:schema:validate
```

---

## 🎨 Installation du Frontend (React)

Le frontend se trouve dans le dossier `front/`.

```bash
cd front
npm install
```

> Le projet utilise **React 19**, **Create React App 5**, **Tailwind CSS 3** et la suite de tests **Testing Library**.

### Note sur le proxy de développement

Pour éviter les erreurs CORS lors des appels API en développement, tu peux ajouter une clé `proxy` dans `front/package.json` :

```json
{
  "proxy": "http://localhost:8000"
}
```

> Cela redirige automatiquement les appels `fetch('/api/...')` vers Symfony. **Attention** : cette configuration est ignorée en production (build).

---

## 🚀 Lancer le projet

### Backend Symfony

**Avec Symfony CLI (recommandé) :**

```bash
symfony server:start
# Disponible sur https://localhost:8000
```

**Avec le serveur PHP intégré :**

```bash
php -S localhost:8000 -t public/
```

### Frontend React

Dans un **second terminal** :

```bash
cd front
npm start
# Disponible sur http://localhost:3000
```

---

## 📡 Routes API disponibles

Toutes les routes sont préfixées par `/api`.

| Méthode | Route | Auth requise | Description |
|---|---|---|---|
| `POST` | `/api/register` | ❌ Non | Créer un compte utilisateur |
| `POST` | `/api/login` | ❌ Non | Connexion → retourne `token` + `refresh_token` |
| `POST` | `/api/token/refresh` | ❌ Non | Renouveler le JWT via le refresh token |
| `POST` | `/api/logout` | ✅ Oui | Invalider le refresh token |
| `POST` | `/api/token/invalidate` | ✅ Oui | Invalider la session JWT |
| `GET` | `/api/videos` | ✅ Oui (`ROLE_USER`) | Liste paginée des vidéos |

### Paramètres de query — `GET /api/videos`

| Paramètre | Type | Défaut | Valeurs acceptées |
|---|---|---|---|
| `page` | int | `1` | tout entier > 0 |
| `limit` | int | `5` | `5`, `10`, `50` (max : 100) |
| `field` | string | `title` | `title`, `createdAt` |
| `order` | string | `ASC` | `ASC`, `DESC` |
| `search` | string | `""` | tout texte |

### Exemples de requêtes cURL

**Inscription :**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "MonMotDePasse123!"}'
```

**Connexion :**
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"username": "john", "password": "MonMotDePasse123!"}'
```

**Réponse de connexion :**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9...",
  "refresh_token": "def502...",
  "refresh_token_expiration": "2026-03-25T12:00:00+00:00"
}
```

**Appel authentifié :**
```bash
curl http://localhost:8000/api/videos?page=1&limit=10 \
  -H "Authorization: Bearer <ton_token_jwt>"
```

**Rafraîchir le token :**
```bash
curl -X POST http://localhost:8000/api/token/refresh \
  -d "refresh_token=<ton_refresh_token>"
```

**Déconnexion :**
```bash
curl -X POST http://localhost:8000/api/logout \
  -H "Authorization: Bearer <ton_token_jwt>" \
  -d "refresh_token=<ton_refresh_token>"
```

---

## 🔄 Flux d'authentification JWT

Ce projet implémente un système à **double token** — un pattern standard pour les APIs stateless :

```
┌─────────────────────────────────────────────────────────────┐
│                    CYCLE DE VIE DES TOKENS                   │
├──────────────────┬──────────────────────────────────────────┤
│   JWT Token      │  TTL : JWT_TTL (défaut : 3600s = 1h)    │
│                  │  Transmis dans le header Authorization    │
│                  │  Stateless — non stocké en base           │
├──────────────────┼──────────────────────────────────────────┤
│  Refresh Token   │  TTL : REFRESH_TOKEN_TTL (30 jours)      │
│                  │  Stocké en base de données                │
│                  │  Single-use : remplacé à chaque refresh   │
│                  │  Révoqué à la déconnexion                 │
│                  │  Révoqué à chaque nouvelle connexion      │
└──────────────────┴──────────────────────────────────────────┘
```

> **Comportement important — session unique** : à chaque login réussi, **tous les anciens refresh tokens de l'utilisateur sont révoqués** automatiquement par `AuthenticationSuccessListener`. Concrètement, un utilisateur qui se connecte sur un nouvel appareil invalide automatiquement ses sessions précédentes.

---

## 🌐 CORS — Communication Frontend / Backend

Le projet utilise `nelmio/cors-bundle` pour gérer les headers CORS, nécessaires car le frontend React (port `3000`) fait des requêtes vers Symfony (port `8000`) — deux origines différentes.

La configuration se trouve dans `config/packages/nelmio_cors.yaml`. En développement, les appels depuis `http://localhost:3000` sont autorisés. **En production, pense à restreindre `allow_origin` à ton domaine réel.**

Si tu rencontres des erreurs CORS du type `Access-Control-Allow-Origin missing`, vérifie :
1. Que `nelmio/cors-bundle` est bien installé (`composer show nelmio/cors-bundle`)
2. Que la route appelée est couverte par la configuration CORS
3. Que le header `Authorization` est bien listé dans `allow_headers`

---

## 🛠️ Administration (Backoffice Twig)

Une interface d'administration est accessible à `/admin` — protégée par `ROLE_ADMIN`.

Elle permet de gérer les vidéos directement via des vues Twig (upload, édition, suppression) sans passer par l'API REST.

Pour créer un compte administrateur, utilise la console Symfony :

```bash
# Exemple via une commande personnalisée si elle existe
php bin/console app:create-admin

# Ou manuellement via Doctrine
php bin/console doctrine:fixtures:load  # si des fixtures sont disponibles
```

---

## 🧪 Tests

### Backend (PHPUnit)

```bash
php bin/phpunit
```

### Frontend (React Testing Library)

```bash
cd front
npm test
```

---

## 🔒 Sécurité — Checklist production

Avant tout déploiement en production, vérifie les points suivants :

- [ ] `APP_ENV=prod` dans `.env.local`
- [ ] `APP_SECRET` est une valeur longue, aléatoire et unique
- [ ] `config/jwt/` est dans `.gitignore` et les fichiers ne sont pas sur le dépôt
- [ ] `JWT_PASSPHRASE` est forte et stockée de façon sécurisée (coffre-fort de secrets)
- [ ] `JWT_TTL` réduit (recommandé : `900` = 15 min en prod)
- [ ] `nelmio_cors.yaml` configuré avec les vrais domaines de production (pas `*`)
- [ ] HTTPS activé sur le serveur
- [ ] `APP_DEBUG=false`
