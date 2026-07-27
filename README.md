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

Pour charger le jeu de démonstration complet (données réalistes mais identités fictives), exécutez ensuite `bdd/RH_test_data.sql`. Ce script alimente les 41 tables et peut être relancé sans dupliquer les lignes possédant les mêmes identifiants :

```powershell
cmd /c "mysql -u root < bdd\RH.sql"
cmd /c "mysql -u root sgrh_public < bdd\RH_test_data.sql"
```

Les comptes créés par ce jeu de test utilisent temporairement le mot de passe `Demo@2026`. Dans la configuration locale demandée, les mots de passe sont stockés en clair avec `PASSWORD_STORAGE=plaintext`. Ce mode est strictement réservé à la démonstration locale ; utilisez `PASSWORD_STORAGE=bcrypt` avant tout déploiement ou accès réseau.

```powershell
cd backend
mvn spring-boot:run
```

Au premier démarrage, le backend crée les références essentielles et un administrateur :

- utilisateur : `admin`
- mot de passe : `Admin@123`

Changez ces valeurs hors développement avec `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_EMAIL` et surtout `JWT_SECRET`.

La connexion utilise une double authentification par e-mail. Après validation du mot de passe, un code à 6 chiffres valable 5 minutes est envoyé à l'adresse du compte. Configurez un serveur SMTP avant de démarrer l'API (Mailpit ou MailHog sur le port `1025` conviennent en local) :

```env
MAIL_HOST=localhost
MAIL_PORT=1025
MAIL_FROM=no-reply@sgrh.gov.mg
MAIL_USERNAME=
MAIL_PASSWORD=
MAIL_SMTP_AUTH=false
MAIL_STARTTLS=false
OTP_EXPIRATION_SECONDS=300
```

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

Les routes métier sous `/api/**` nécessitent un jeton `Bearer`. Seules `/api/auth/login` et `/api/auth/verify-otp` sont publiques.
