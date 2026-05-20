# Tasks: Platform Foundation

**Input**: Design documents from `/specs/001-platform-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/healthcheck.openapi.yaml`, `quickstart.md`, `.specify/memory/constitution.md`, `AGENTS.md`

**Tests**: Required for this block by FR-011, FR-012, constitution, and AGENTS.md.

**Organization**: Tasks are grouped by setup, foundation, then user stories so each increment can be implemented and tested independently.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on an incomplete task
- **[Story]**: Maps implementation tasks to user stories from `spec.md`
- Every task includes expected file paths

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Create the monorepo skeleton and shared project guardrails without application behavior.

- [ ] T001 Create root monorepo directories `lancarme-web/`, `lancarme-api/`, `docs/`, and keep `specs/` at repository root
- [ ] T002 Create root `.gitignore` ignoring `.env`, `lancarme-api/target/`, `lancarme-web/node_modules/`, `lancarme-web/dist/`, and local IDE/build artifacts
- [ ] T003 Create root `docker-compose.yml` with a PostgreSQL service named `postgres`, local-only port mapping, named volume, healthcheck, and safe placeholder environment values
- [ ] T004 [P] Create backend environment template in `lancarme-api/.env.example` with `SPRING_PROFILES_ACTIVE`, `SERVER_PORT`, `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `APP_VERSION`
- [ ] T005 [P] Create frontend environment template in `lancarme-web/.env.example` with `VITE_API_BASE_URL=http://localhost:8080/api/v1`
- [ ] T006 Create initial root `README.md` sections for prerequisites, repository structure, environment files, database, backend, frontend, tests, build, and troubleshooting commands

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish backend and frontend project bases, configuration, and empty future module structure required before user story work.

**Critical**: No user story work can begin until this phase is complete.

- [ ] T007 Create Java 21 Spring Boot 3 Maven project files in `lancarme-api/pom.xml`, `lancarme-api/mvnw`, and `lancarme-api/mvnw.cmd`
- [ ] T008 Configure backend dependencies in `lancarme-api/pom.xml` for Spring Web, Spring Security, Spring Data JPA, PostgreSQL driver, Flyway, Bean Validation, Spring Boot Test, JUnit 5, Mockito, and Testcontainers
- [ ] T009 Create backend application entrypoint in `lancarme-api/src/main/java/br/com/lancarme/LancarmeApplication.java`
- [ ] T010 Configure backend local settings in `lancarme-api/src/main/resources/application.yml` and `lancarme-api/src/main/resources/application-local.yml` using environment variables from `lancarme-api/.env.example`
- [ ] T011 Configure Flyway with initial no-op foundation migration in `lancarme-api/src/main/resources/db/migration/V1__platform_foundation.sql`
- [ ] T012 [P] Create backend shared package structure under `lancarme-api/src/main/java/br/com/lancarme/shared/` for `config`, `exception`, `response`, `security`, and `validation`
- [ ] T013 [P] Create backend future domain package placeholders under `lancarme-api/src/main/java/br/com/lancarme/` for `auth`, `workspace`, `strategy`, `launch`, `contentmatrix`, `copyroom`, `creativeroom`, `trafficroom`, `funnelmap`, `calendarexecution`, `mentorflow`, `proofvault`, `analytics`, `ai`, and `billing`
- [ ] T014 Create React TypeScript Vite project files in `lancarme-web/package.json`, `lancarme-web/index.html`, `lancarme-web/tsconfig.json`, `lancarme-web/tsconfig.node.json`, and `lancarme-web/vite.config.ts`
- [ ] T015 Configure frontend scripts and dependencies in `lancarme-web/package.json` for `dev`, `build`, `lint`, `typecheck`, `test`, React, TypeScript, Vite, TanStack Query, Vitest, React Testing Library, jsdom, and Tailwind tooling
- [ ] T016 Configure Tailwind in `lancarme-web/tailwind.config.ts`, `lancarme-web/postcss.config.js`, and `lancarme-web/src/app/index.css`
- [ ] T017 [P] Create frontend source structure under `lancarme-web/src/` for `app`, `components/ui`, `components/layout`, `components/shared`, `hooks`, `services`, `schemas`, `tests`, `types`, and `modules`
- [ ] T018 [P] Create frontend future module placeholders under `lancarme-web/src/modules/` for `strategy`, `launch`, `content-matrix`, `copy-room`, `creative-room`, `traffic-room`, `funnel-map`, `calendar-execution`, `mentor-flow`, `proof-vault`, `analytics`, `billing`, and `ai`
- [ ] T019 Configure Vitest and React Testing Library setup in `lancarme-web/vitest.config.ts` and `lancarme-web/src/tests/setup.ts`

**Checkpoint**: Foundation ready - user story implementation can now begin.

---

## Phase 3: User Story 1 - Iniciar o ambiente base local (Priority: P1) MVP

**Goal**: A developer can start database, backend, and frontend locally using documented commands and safe example configuration.

**Independent Test**: Follow `README.md` from a clean clone, copy both `.env.example` files to `.env`, start PostgreSQL, run the backend and frontend, and confirm no real secrets are required.

### Tests for User Story 1

- [ ] T020 [P] [US1] Add backend application context test in `lancarme-api/src/test/java/br/com/lancarme/LancarmeApplicationTest.java`
- [ ] T021 [P] [US1] Add Docker Compose validation instructions to `README.md` matching `docker compose config` and `docker compose up -d postgres`
- [ ] T022 [P] [US1] Add frontend smoke render test in `lancarme-web/src/tests/App.test.tsx` for the initial app shell in PT-BR

### Implementation for User Story 1

- [ ] T023 [US1] Wire Spring Boot local datasource and Flyway startup using PostgreSQL env variables in `lancarme-api/src/main/resources/application-local.yml`
- [ ] T024 [US1] Create frontend entrypoint in `lancarme-web/src/app/main.tsx` with React root and TanStack Query provider
- [ ] T025 [US1] Create initial frontend app shell in `lancarme-web/src/app/App.tsx` with PT-BR product/status copy and no dashboard or business module behavior
- [ ] T026 [US1] Update `README.md` with exact local setup commands for `docker compose up -d postgres`, `cd lancarme-api && cp .env.example .env && ./mvnw spring-boot:run`, and `cd lancarme-web && cp .env.example .env && npm install && npm run dev`
- [ ] T027 [US1] Document safe placeholder policy for `.env.example` and ignored `.env` files in `README.md`

**Checkpoint**: User Story 1 is independently testable as a local runnable base.

---

## Phase 4: User Story 2 - Validar comunicacao entre web e API (Priority: P2)

**Goal**: The initial web screen calls `GET /api/v1/health` and shows loading, operational, and unavailable states in PT-BR.

**Independent Test**: Start the API and web app, open the web app, and confirm it displays the health status; then stop the API and confirm a clear unavailable message without UI breakage.

### Tests for User Story 2

- [ ] T028 [P] [US2] Add backend MockMvc test for `GET /api/v1/health` response status and JSON body in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java`
- [ ] T029 [P] [US2] Add frontend health service tests for success and failure states in `lancarme-web/src/tests/healthService.test.ts`
- [ ] T030 [P] [US2] Add frontend app tests for loading, success, and unavailable health states in `lancarme-web/src/tests/App.test.tsx`

### Implementation for User Story 2

- [ ] T031 [P] [US2] Create health response DTO in `lancarme-api/src/main/java/br/com/lancarme/health/dto/HealthResponse.java` with `status`, `service`, and `version`
- [ ] T032 [US2] Create public health controller in `lancarme-api/src/main/java/br/com/lancarme/health/controller/HealthController.java` for `GET /api/v1/health`
- [ ] T033 [US2] Configure Spring Security to permit `GET /api/v1/health` without implementing auth flows in `lancarme-api/src/main/java/br/com/lancarme/shared/security/SecurityConfig.java`
- [ ] T034 [P] [US2] Create frontend health type in `lancarme-web/src/types/health.ts` matching `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml`
- [ ] T035 [P] [US2] Create base API client in `lancarme-web/src/services/apiClient.ts` using `VITE_API_BASE_URL` and timeout/error handling
- [ ] T036 [US2] Create health service in `lancarme-web/src/services/healthService.ts` to call `/health` and validate the minimal response shape
- [ ] T037 [US2] Create `useHealthStatus` hook in `lancarme-web/src/hooks/useHealthStatus.ts` using TanStack Query for loading, success, refetch, and error states
- [ ] T038 [US2] Update `lancarme-web/src/app/App.tsx` to render API loading, operational, and unavailable states in PT-BR without exposing technical stack traces
- [ ] T039 [US2] Update `README.md` with manual healthcheck validation using `curl http://localhost:8080/api/v1/health` and expected JSON response

**Checkpoint**: User Story 2 proves the first web/API contract end to end.

---

## Phase 5: User Story 3 - Proteger o escopo da fundacao (Priority: P3)

**Goal**: Keep the foundation small and prepared for future modules without implementing auth, billing, real AI, upload, dashboard, or product modules.

**Independent Test**: Inspect the repository structure, endpoints, and UI and confirm only foundation, healthcheck, configuration, tests, and documentation exist.

### Tests for User Story 3

- [ ] T040 [P] [US3] Add scope guard checklist to `README.md` confirming no auth flow, billing, real AI, upload, dashboard, or business module endpoint exists in this block

### Implementation for User Story 3

- [ ] T041 [US3] Ensure backend future domain packages under `lancarme-api/src/main/java/br/com/lancarme/` contain no controllers, services, entities, repositories, or business rules beyond placeholders
- [ ] T042 [US3] Ensure frontend future module directories under `lancarme-web/src/modules/` contain no routes, dashboard screens, API calls, or business rules beyond placeholders
- [ ] T043 [US3] Document the current public surface in `README.md` as only `GET /api/v1/health` and the technical initial status screen
- [ ] T044 [US3] Verify healthcheck contract minimization against `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml`, ensuring no hostname, IP, datasource, workspace, user, secret, or environment details are returned

**Checkpoint**: User Story 3 confirms scope control and future module preparation without premature product behavior.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Final documentation, validation, and implementation report tasks for the whole block.

- [ ] T045 [P] Update `README.md` with final repository tree matching `lancarme-web/`, `lancarme-api/`, `docs/`, `specs/`, `docker-compose.yml`, `AGENTS.md`, and `README.md`
- [ ] T046 [P] Validate backend with `cd lancarme-api && ./mvnw test` and record result in the final implementation report
- [ ] T047 [P] Validate backend with `cd lancarme-api && ./mvnw verify` and record result in the final implementation report
- [ ] T048 [P] Validate frontend with `cd lancarme-web && npm run lint` and record result in the final implementation report
- [ ] T049 [P] Validate frontend with `cd lancarme-web && npm run typecheck` and record result in the final implementation report
- [ ] T050 [P] Validate frontend with `cd lancarme-web && npm run test` and record result in the final implementation report
- [ ] T051 [P] Validate frontend with `cd lancarme-web && npm run build` and record result in the final implementation report
- [ ] T052 [P] Validate integration configuration with `docker compose config` and record result in the final implementation report
- [ ] T053 Validate quickstart end to end using `specs/001-platform-foundation/quickstart.md` and update `README.md` if any documented command differs from the implemented scripts
- [ ] T054 Produce final implementation report with changed files, validations, scope exclusions, and remaining risks in the delivery response

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies - can start immediately.
- **Foundational (Phase 2)**: Depends on Setup completion - blocks all user stories.
- **User Story 1 (Phase 3)**: Depends on Foundational completion and is the MVP.
- **User Story 2 (Phase 4)**: Depends on Foundational completion; practically follows US1 because it uses the app shell and documented local environment.
- **User Story 3 (Phase 5)**: Depends on Foundational completion; best executed after US1 and US2 so scope can be inspected.
- **Polish (Phase 6)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: Can start after Phase 2; no dependency on US2 or US3.
- **US2 (P2)**: Can start after Phase 2, but should follow US1 in this solo implementation because it integrates with the frontend shell and local backend.
- **US3 (P3)**: Can start after Phase 2, but final verification depends on US1 and US2 implementation being complete.

### Within Each User Story

- Write or adjust tests before implementing matching behavior.
- Backend DTO before controller.
- API client and type before health service.
- Health service before `useHealthStatus`.
- Hook before app integration.
- README command updates after scripts and files exist.

### Parallel Opportunities

- T004 and T005 can run in parallel after root structure exists.
- T012, T013, T017, and T018 can run in parallel because they create separate placeholder structures.
- T020, T021, and T022 can run in parallel for US1 tests/documentation.
- T028, T029, and T030 can run in parallel for US2 tests.
- T031, T034, and T035 can run in parallel because they touch independent backend/frontend files.
- T045 through T052 can run in parallel where the local environment supports concurrent validation commands.

---

## Parallel Example: User Story 1

```bash
Task: "T020 [P] [US1] Add backend application context test in lancarme-api/src/test/java/br/com/lancarme/LancarmeApplicationTest.java"
Task: "T021 [P] [US1] Add Docker Compose validation instructions to README.md"
Task: "T022 [P] [US1] Add frontend smoke render test in lancarme-web/src/tests/App.test.tsx"
```

---

## Parallel Example: User Story 2

```bash
Task: "T028 [P] [US2] Add backend MockMvc test for GET /api/v1/health in lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java"
Task: "T029 [P] [US2] Add frontend health service tests in lancarme-web/src/tests/healthService.test.ts"
Task: "T030 [P] [US2] Add frontend app tests in lancarme-web/src/tests/App.test.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "T040 [P] [US3] Add scope guard checklist to README.md"
Task: "T045 [P] Update README.md with final repository tree"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup.
2. Complete Phase 2: Foundational.
3. Complete Phase 3: User Story 1.
4. Stop and validate local startup documentation from `README.md`.

### Incremental Delivery

1. Setup + Foundational creates the monorepo, backend base, frontend base, PostgreSQL, Flyway, env examples, and test harnesses.
2. US1 makes the local base runnable.
3. US2 proves the first typed web/API contract with healthcheck.
4. US3 verifies the scope stays limited to platform foundation.
5. Polish runs all validations and aligns README/quickstart.

### Scope Guard

- Do not implement auth, login, JWT, roles, workspace membership, billing, payments, webhooks, AI providers, prompt registry, credit ledger, upload, storage, dashboard, analytics, or product modules.
- Keep the only backend endpoint as `GET /api/v1/health`.
- Keep the only frontend screen as a technical PT-BR status screen.
- Keep `.env.example` values as local placeholders only.

