# Plateforme de Memecoins

## Introduction
Cette plateforme permet la création et la gestion de memecoins. Les utilisateurs peuvent s'inscrire, créer leurs propres tokens, et échanger des PSP Coins et ZTH.

## Fonctionnalités principales
- Inscription et connexion utilisateur
- Création de tokens personnalisés (memecoins)
- Système d'échange entre PSP Coins et ZTH
- Tableau de bord utilisateur
- Gestion des rôles utilisateur

## Structure de la base de données
La plateforme utilise une base de données PostgreSQL avec les modèles suivants :

### Utilisateurs (User)
- Identifiant unique
- Email et nom d'utilisateur uniques
- Mot de passe sécurisé
- Solde ZTH (valeur par défaut: 100)
- Solde PSP Coins
- Rôle (USER par défaut)

### Tokens (Token)
- Identifiant unique
- Nom et symbole
- Approvisionnement total
- Créateur (relation avec l'utilisateur)

### Statistiques du marché (MarketStats)
- Approvisionnement total en PSP
- Réserve ZTH
- Date de mise à jour

## Installation

1. Cloner le dépôt :
```bash
git clone <url-du-dépôt>
cd memecoin-platform
```

2. Installer les dépendances :
```bash
pnpm install
```

3. Configurer les variables d'environnement :
Créez un fichier `.env` avec les paramètres suivants :
```
DATABASE_URL="postgresql://username:password@localhost:5432/memecoin"
```

4. Exécuter les migrations Prisma :
```bash
pnpm dlx prisma migrate dev
```

5. Lancer l'application :
```bash
pnpm run dev
```

## Technologies utilisées
- Next.js
- Prisma ORM
- PostgreSQL
- TypeScript
