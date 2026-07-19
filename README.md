# SGRH — Web, API et mobile

Système de gestion des ressources humaines de l'administration publique malgache. Le dépôt contient trois applications partageant la même base MySQL et la même authentification JWT :

- `src/` : application web React/Vite ;
- `backend/` : API Java 17 / Spring Boot ;
- `mobile/` : application React Native avec Expo.

## Prérequis

- Node.js 20 ou supérieur ;
- Java 17 et Maven ;
- MySQL 8 ;
- Expo Go sur un téléphone, ou un émulateur Android/iOS.

## 1. Base et backend

Créez la base avec `bdd/RH.sql`, puis adaptez au besoin les variables de connexion Spring. Par défaut, l'API utilise `root` sans mot de passe sur la base `sgrh_public`.

```powershell
cd backend
mvn spring-boot:run
```

Au premier démarrage, le backend crée les références essentielles et un administrateur :

- utilisateur : `admin`
- mot de passe : `Admin@123`

Changez ces valeurs hors développement avec `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` et surtout `JWT_SECRET`.

## 2. Application web

```powershell
npm install
npm run dev
```

Le site est accessible sur `http://localhost:3000`. L'URL API peut être définie dans `.env.local` :

```env
VITE_API_URL=http://localhost:3030/api
```

## 3. Application mobile React Native

```powershell
cd mobile
npm install
Copy-Item .env.example .env
npm start
```

Dans `mobile/.env`, remplacez l'adresse exemple par l'adresse IP locale de l'ordinateur :

```env
EXPO_PUBLIC_API_URL=http://192.168.1.100:3030/api
```

Le téléphone et l'ordinateur doivent être sur le même réseau. Pour l'émulateur Android, la valeur par défaut `http://10.0.2.2:3030/api` fonctionne généralement.

## Contrôles

```powershell
npm run lint
npm run build
cd backend
mvn test
cd ..\mobile
npm run typecheck
npx expo export --platform android
```

Les routes métier sous `/api/**` nécessitent un jeton `Bearer`. Seule `/api/auth/login` est publique.
