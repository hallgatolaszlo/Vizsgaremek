# Vizsgaremek

## Planova: Felhasználóbarát naptár alkalmazás szokáskövetéssel

## Adatbázis terv
https://drawsql.app/teams/susmaher/diagrams/vizsgaremek

## Projekt indítása:
### Production mód:
 - Git telepítése, repository klónozása
 - Docker telepítése után ./scripts/docker-start.ps1 powershellben a projekt mappájában

### Development mód:
 - Szükséges technológiák: node.js, .net 8.0, postgres 17.6
  Terminálban futtatandó kódok:
 - npm install -g pnpm
 - pnpm install
  User-secret megadása
 - dotnet user-secrets set {your-variable-name} {your-variable-value}
     - postgres-username (alapértelmezetten “postgres”)
     - postgres-password (postgres jelszó, amit telepítésnél megadtál)
     - jwt-secret-key (legalább 64 karakteres string)
 - Az összes szükséges dependency letöltése után terminálban: pnpm run dev
