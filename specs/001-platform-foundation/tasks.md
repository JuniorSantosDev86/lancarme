# Tasks: Platform Foundation

## Setup

- [ ] T001 Create root monorepo directories: `lancarme-web/`, `lancarme-api/`, `docs/`, `specs/`.
- [ ] T002 Copy `AGENTS.md` and constitution into the repository.
- [ ] T003 Create root `README.md` with project overview and local commands.

## Backend

- [ ] T004 Create Spring Boot 3 project in `lancarme-api/` using Java 21 and Maven.
- [ ] T005 Add dependencies: Spring Web, Validation, Actuator optional, Spring Boot Test.
- [ ] T006 Create package `br.com.lancarme`.
- [ ] T007 Create `HealthController` at `lancarme-api/src/main/java/br/com/lancarme/health/HealthController.java`.
- [ ] T008 Create `HealthResponse` DTO.
- [ ] T009 Configure route `GET /api/v1/health`.
- [ ] T010 Add backend `.env.example` or document expected envs.
- [ ] T011 Add backend test for health endpoint.

## Frontend

- [ ] T012 Create React + TypeScript + Vite project in `lancarme-web/`.
- [ ] T013 Configure basic scripts: dev, build, test, typecheck, lint.
- [ ] T014 Prepare Tailwind CSS.
- [ ] T015 Create API client in `lancarme-web/src/services/api.ts`.
- [ ] T016 Create health service in `lancarme-web/src/services/health-service.ts`.
- [ ] T017 Create initial PT-BR page showing product name and API status.
- [ ] T018 Add frontend `.env.example` with `VITE_API_BASE_URL`.
- [ ] T019 Add frontend component/render test.

## Docker

- [ ] T020 Create root `docker-compose.yml` with PostgreSQL service.
- [ ] T021 Add database env variables with safe placeholders.
- [ ] T022 Ensure PostgreSQL is not publicly exposed for production assumptions.

## Documentation

- [ ] T023 Update README with prerequisites.
- [ ] T024 Add commands for backend, frontend and docker.
- [ ] T025 Add troubleshooting section.

## Validation

- [ ] T026 Run backend tests.
- [ ] T027 Run frontend tests.
- [ ] T028 Run frontend build.
- [ ] T029 Run docker compose config.
- [ ] T030 Produce final implementation report with changed files, validations, risks and next steps.
