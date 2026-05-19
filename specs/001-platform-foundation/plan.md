# Implementation Plan: Platform Foundation

## Summary

Criar fundação técnica do Lançar.me com monorepo, frontend React/Vite, backend Spring Boot, PostgreSQL no Docker Compose, healthcheck e testes mínimos.

## Technical Context

- Frontend: React + TypeScript + Vite.
- Backend: Java 21 + Spring Boot 3 + Maven.
- Database: PostgreSQL via Docker Compose.
- Tests backend: JUnit 5/Spring Boot Test.
- Tests frontend: Vitest/React Testing Library.
- Styling: Tailwind preparado.

## Repository Structure

```txt
lancarme/
  lancarme-web/
  lancarme-api/
  docs/
  specs/
  docker-compose.yml
  README.md
  AGENTS.md
```

## Backend Structure

```txt
lancarme-api/src/main/java/br/com/lancarme/
  LancarmeApplication.java
  shared/
    config/
    exception/
    response/
  health/
    HealthController.java
    HealthResponse.java
```

## Frontend Structure

```txt
lancarme-web/src/
  app/
  components/
    ui/
    layout/
    shared/
  modules/
  services/
    api.ts
    health-service.ts
  types/
  tests/
```

## API Contract

### GET /api/v1/health

Response 200:

```json
{
  "status": "UP",
  "service": "lancarme-api",
  "version": "0.1.0"
}
```

## Validation Commands

Backend:

```bash
cd lancarme-api
./mvnw test
./mvnw package
```

Frontend:

```bash
cd lancarme-web
npm install
npm run lint
npm run typecheck
npm run test
npm run build
```

Docker:

```bash
docker compose config
docker compose up --build
```

## Risks

- Tooling versions may differ locally.
- Tailwind/shadcn setup can be deferred if it blocks foundation.
- Docker may require local permissions.

## Constitution Check

- No secrets.
- No business scope outside foundation.
- Tests included.
- Documentation included.
- Architecture matches React + Java decision.
