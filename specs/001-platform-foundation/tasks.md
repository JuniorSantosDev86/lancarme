# Tasks: Platform Foundation

**Input**: Design documents from `/specs/001-platform-foundation/`

**Prerequisites**: `plan.md`, `spec.md`, `research.md`, `data-model.md`, `contracts/healthcheck.openapi.yaml`, `quickstart.md`, `checklists/requirements.md`, `.specify/memory/constitution.md`, `AGENTS.md`

**Tests**: Required by FR-011, FR-012, constitution, AGENTS.md, and the Bloco 1 quality checklist.

**Organization**: Tasks are grouped by setup/infra, backend foundation, frontend foundation, then user stories. User story phases include tests before implementation where behavior is introduced. Documentation and validation tasks close the block.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel because it touches different files and does not depend on an incomplete task
- **[Story]**: Required only for user story phases and maps to `spec.md`
- Every task includes expected file paths

## Phase 1: Setup & Infra (Shared Foundation)

**Purpose**: Create the monorepo skeleton, local infrastructure, and safe environment templates without application behavior.

- [X] T001 Create root monorepo directories `lancarme-web/`, `lancarme-api/`, `docs/`, and keep `specs/` at repository root
- [X] T002 Create root `.gitignore` ignoring `.env`, `lancarme-api/target/`, `lancarme-web/node_modules/`, `lancarme-web/dist/`, coverage output, and local IDE/build artifacts
- [X] T003 Create root `docker-compose.yml` with PostgreSQL service `postgres`, local-only port mapping, named volume, healthcheck, and safe placeholder environment values
- [X] T004 [P] Create backend environment template in `lancarme-api/.env.example` with `SPRING_PROFILES_ACTIVE=local`, `SERVER_PORT=8080`, `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`, and `APP_VERSION=0.1.0` using no real secrets
- [X] T005 [P] Create frontend environment template in `lancarme-web/.env.example` with `VITE_API_BASE_URL=http://localhost:8080/api/v1` and no private endpoints or secrets
- [X] T006 Create initial root `README.md` sections for prerequisites, repository structure, environment files, PostgreSQL, backend, frontend, tests, build, troubleshooting, Playwright future decision, and scope guard

**Checkpoint**: Repository has safe local infrastructure and environment documentation placeholders.

---

## Phase 2: Backend Foundation (Blocking)

**Purpose**: Establish the Java 21/Spring Boot 3 backend base, configuration, Flyway, security surface, and package structure required before API behavior.

**Critical**: Complete this phase before backend user story behavior.

- [X] T007 Create Java 21 Spring Boot 3 Maven project files in `lancarme-api/pom.xml`, `lancarme-api/mvnw`, and `lancarme-api/mvnw.cmd`
- [X] T008 Configure backend dependencies in `lancarme-api/pom.xml` for Spring Web, Spring Security, Spring Data JPA, PostgreSQL driver, Flyway, Bean Validation, Spring Boot Test, JUnit 5, Mockito, and Testcontainers
- [X] T009 Create backend application entrypoint in `lancarme-api/src/main/java/br/com/lancarme/LancarmeApplication.java`
- [X] T010 Configure backend base settings in `lancarme-api/src/main/resources/application.yml` using environment variables for server port, app version, datasource, and Flyway
- [X] T011 Configure local profile settings in `lancarme-api/src/main/resources/application-local.yml` for local PostgreSQL and local CORS origin `http://localhost:5173`
- [X] T012 Configure Flyway with initial no-op foundation migration in `lancarme-api/src/main/resources/db/migration/V1__platform_foundation.sql`
- [X] T013 [P] Create backend shared package structure under `lancarme-api/src/main/java/br/com/lancarme/shared/` for `config`, `exception`, `response`, `security`, and `validation`
- [X] T014 [P] Create backend health package structure under `lancarme-api/src/main/java/br/com/lancarme/health/` for `controller` and `dto`
- [X] T015 [P] Create backend future domain package placeholders under `lancarme-api/src/main/java/br/com/lancarme/` for `auth`, `workspace`, `strategy`, `launch`, `contentmatrix`, `copyroom`, `creativeroom`, `trafficroom`, `funnelmap`, `calendarexecution`, `mentorflow`, `proofvault`, `analytics`, `ai`, and `billing`
- [X] T016 Create Spring Security foundation in `lancarme-api/src/main/java/br/com/lancarme/shared/security/SecurityConfig.java` prepared to permit only `GET /api/v1/health` publicly without implementing auth flows
- [X] T017 Create local CORS configuration in `lancarme-api/src/main/java/br/com/lancarme/shared/config/CorsConfig.java` allowing only `http://localhost:5173` for local `GET /api/v1/health` and no wildcard `*`

**Checkpoint**: Backend base is ready for the healthcheck without auth, business modules, or sensitive public surface.

---

## Phase 3: Frontend Foundation (Blocking)

**Purpose**: Establish the React/TypeScript/Vite frontend base, Tailwind preparation, test harness, and folder structure required before the status screen.

**Critical**: Complete this phase before frontend user story behavior.

- [X] T018 Create React TypeScript Vite project files in `lancarme-web/package.json`, `lancarme-web/index.html`, `lancarme-web/tsconfig.json`, `lancarme-web/tsconfig.node.json`, and `lancarme-web/vite.config.ts`
- [X] T019 Configure frontend scripts and dependencies in `lancarme-web/package.json` for `dev`, `build`, `lint`, `typecheck`, `test`, React, TypeScript, Vite, TanStack Query, Vitest, React Testing Library, jsdom, and Tailwind tooling
- [X] T020 Ensure `lancarme-web/package.json` does not include Playwright dependencies, Playwright scripts, or E2E test setup in this block
- [X] T021 Configure Tailwind in `lancarme-web/tailwind.config.ts`, `lancarme-web/postcss.config.js`, and `lancarme-web/src/app/index.css`
- [X] T022 [P] Create frontend source structure under `lancarme-web/src/` for `app`, `components/ui`, `components/layout`, `components/shared`, `hooks`, `services`, `schemas`, `tests`, `types`, and `modules`
- [X] T023 [P] Create frontend future module placeholders under `lancarme-web/src/modules/` for `strategy`, `launch`, `content-matrix`, `copy-room`, `creative-room`, `traffic-room`, `funnel-map`, `calendar-execution`, `mentor-flow`, `proof-vault`, `analytics`, `billing`, and `ai`
- [X] T024 Configure Vitest and React Testing Library setup in `lancarme-web/vitest.config.ts` and `lancarme-web/src/tests/setup.ts`

**Checkpoint**: Frontend base is ready for the technical status screen without dashboard or business module behavior.

---

## Phase 4: User Story 1 - Iniciar o ambiente base local (Priority: P1) MVP

**Goal**: A developer can start PostgreSQL, backend, and frontend locally using documented commands and safe example configuration.

**Independent Test**: Follow `README.md` from a clean clone, copy both `.env.example` files to `.env`, start PostgreSQL, run backend and frontend, and confirm no real secrets are required.

### Tests for User Story 1

- [X] T025 [P] [US1] Add backend application context test in `lancarme-api/src/test/java/br/com/lancarme/LancarmeApplicationTest.java`
- [X] T026 [P] [US1] Add frontend smoke render test for the PT-BR technical app shell in `lancarme-web/src/tests/App.test.tsx`
- [X] T027 [P] [US1] Add Docker Compose validation instructions to `README.md` matching root `docker compose config` and `docker compose up -d postgres`

### Implementation for User Story 1

- [X] T028 [US1] Wire Spring Boot local datasource and Flyway startup using PostgreSQL env variables in `lancarme-api/src/main/resources/application-local.yml`
- [X] T029 [US1] Create frontend entrypoint in `lancarme-web/src/app/main.tsx` with React root and TanStack Query provider
- [X] T030 [US1] Create initial frontend app shell in `lancarme-web/src/app/App.tsx` with PT-BR technical status copy and no dashboard or business module behavior
- [X] T031 [US1] Update `README.md` with exact setup commands for `docker compose up -d postgres`, `cd lancarme-api && cp .env.example .env && ./mvnw spring-boot:run`, and `cd lancarme-web && cp .env.example .env && npm install && npm run dev`
- [X] T032 [US1] Document `.env.example` placeholder policy and ignored `.env` files in `README.md`, ensuring no task asks for real secrets in `lancarme-api/.env.example` or `lancarme-web/.env.example`
- [X] T033 [US1] Update `specs/001-platform-foundation/quickstart.md` only if implemented command names differ from documented scripts, keeping README and quickstart consistent

**Checkpoint**: User Story 1 is independently testable as a local runnable base.

---

## Phase 5: User Story 2 - Validar comunicacao entre web e API (Priority: P2)

**Goal**: The initial web screen calls `GET /api/v1/health` and shows loading, operational, and unavailable states in PT-BR.

**Independent Test**: Start API and web app, open the web app, confirm it displays the health status, then stop the API and confirm a clear unavailable message without UI breakage.

### Tests for User Story 2

- [X] T034 [US2] Add backend MockMvc test for `GET /api/v1/health` status and JSON body in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java`
- [X] T035 [US2] Add backend test or assertion in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java` proving the health response contains only `status`, `service`, and `version`
- [X] T036 [US2] Add backend MockMvc/WebMvcTest or equivalent controller/endpoint test in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java` proving `GET /api/v1/health` does not start, require, or query PostgreSQL/DataSource, and asserting the response contains only `status`, `service`, and `version` with no database or infrastructure state
- [X] T037 [US2] Add backend CORS test in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java` allowing origin `http://localhost:5173` for `GET /api/v1/health`
- [X] T038 [US2] Add backend CORS negative test in `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java` proving wildcard or an unapproved origin is not allowed
- [X] T039 [P] [US2] Add frontend health service tests for success, invalid response, timeout/network failure, and unavailable states in `lancarme-web/src/tests/healthService.test.ts`
- [X] T040 [P] [US2] Add frontend app tests for loading, operational, and unavailable health states in PT-BR in `lancarme-web/src/tests/App.test.tsx`

### Backend Implementation for User Story 2

- [X] T041 [P] [US2] Create health response DTO in `lancarme-api/src/main/java/br/com/lancarme/health/dto/HealthResponse.java` with only `status`, `service`, and `version`
- [X] T042 [US2] Create public health controller in `lancarme-api/src/main/java/br/com/lancarme/health/controller/HealthController.java` for `GET /api/v1/health` returning the minimal DTO
- [X] T043 [US2] Ensure `HealthController` in `lancarme-api/src/main/java/br/com/lancarme/health/controller/HealthController.java` does not inject datasource, repositories, Flyway, entity managers, or PostgreSQL health indicators
- [X] T044 [US2] Ensure `SecurityConfig` in `lancarme-api/src/main/java/br/com/lancarme/shared/security/SecurityConfig.java` permits `GET /api/v1/health` publicly without creating login, JWT, roles, or workspace authorization
- [X] T045 [US2] Ensure local CORS configuration in `lancarme-api/src/main/java/br/com/lancarme/shared/config/CorsConfig.java` allows only `http://localhost:5173` and never `*`

### Frontend Implementation for User Story 2

- [X] T046 [P] [US2] Create frontend health type in `lancarme-web/src/types/health.ts` matching `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml`
- [X] T047 [P] [US2] Create base API client in `lancarme-web/src/services/apiClient.ts` using `VITE_API_BASE_URL` with timeout and sanitized error handling
- [X] T048 [US2] Create health service in `lancarme-web/src/services/healthService.ts` to call `/health` and validate the minimal response shape without exposing technical stack traces
- [X] T049 [US2] Create `useHealthStatus` hook in `lancarme-web/src/hooks/useHealthStatus.ts` using TanStack Query for loading, success, refetch, and error states
- [X] T050 [US2] Update `lancarme-web/src/app/App.tsx` to render API loading, operational, and unavailable states in PT-BR with no dashboard or business module UI

### Documentation for User Story 2

- [X] T051 [US2] Update `README.md` with manual healthcheck validation using `curl http://localhost:8080/api/v1/health`, expected JSON, and explicit note that it is liveness only
- [X] T052 [US2] Update `README.md` troubleshooting so PostgreSQL startup/Flyway issues are documented separately from `GET /api/v1/health`
- [X] T053 [US2] Update `README.md` with local CORS expectations for `http://localhost:5173` and explicit prohibition of CORS wildcard `*`

**Checkpoint**: User Story 2 proves the first typed web/API contract, CORS guard, and liveness semantics.

---

## Phase 6: User Story 3 - Proteger o escopo da fundacao (Priority: P3)

**Goal**: Keep the foundation small and prepared for future modules without auth, billing, real AI, upload, dashboard, or product modules.

**Independent Test**: Inspect repository structure, endpoints, dependencies, scripts, and UI and confirm only foundation, healthcheck, configuration, tests, and documentation exist.

### Tests and Scope Guards for User Story 3

- [X] T054 [P] [US3] Add scope guard checklist to `README.md` confirming no auth flow, billing, real AI, upload, dashboard, payment, workspace, or business module endpoint exists in this block
- [X] T055 [US3] Add dependency scope note to `README.md` confirming Playwright is future-only and absent from `lancarme-web/package.json`

### Implementation for User Story 3

- [X] T056 [P] [US3] Ensure backend future domain packages under `lancarme-api/src/main/java/br/com/lancarme/` contain no controllers, services, entities, repositories, endpoints, migrations, or business rules beyond placeholders
- [X] T057 [P] [US3] Ensure frontend future module directories under `lancarme-web/src/modules/` contain no routes, dashboard screens, API calls, forms, analytics, or business rules beyond placeholders
- [X] T058 [US3] Document current public surface in `README.md` as only `GET /api/v1/health` and the technical PT-BR initial status screen
- [X] T059 [US3] Review `lancarme-api/pom.xml` and `lancarme-web/package.json` to ensure no auth provider, billing SDK, AI provider, upload/storage library, dashboard package, or Playwright dependency was added in this block
- [X] T060 [US3] Review `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml` against `HealthResponse` implementation to ensure no hostname, IP, datasource, workspace, user, secret, environment, or infrastructure detail is returned

**Checkpoint**: User Story 3 confirms scope control and future module preparation without premature product behavior.

---

## Phase 7: Documentation & Validation

**Purpose**: Align documentation, run validations, and produce the final implementation report.

- [X] T061 Update `README.md` with final repository tree matching `lancarme-web/`, `lancarme-api/`, `docs/`, `specs/`, `docker-compose.yml`, `AGENTS.md`, and `README.md`
- [X] T062 Align `README.md` and `specs/001-platform-foundation/quickstart.md` so prerequisites, env setup, PostgreSQL commands, backend commands, frontend commands, tests, build, healthcheck, CORS, Playwright future decision, and troubleshooting are consistent
- [X] T063 [P] Validate backend with `cd lancarme-api && ./mvnw test` and record result in the final implementation report
- [X] T064 [P] Validate backend with `cd lancarme-api && ./mvnw verify` and record result in the final implementation report
- [X] T065 [P] Validate frontend with `cd lancarme-web && npm run lint` and record result in the final implementation report
- [X] T066 [P] Validate frontend with `cd lancarme-web && npm run typecheck` and record result in the final implementation report
- [X] T067 [P] Validate frontend with `cd lancarme-web && npm run test` and record result in the final implementation report
- [X] T068 [P] Validate frontend with `cd lancarme-web && npm run build` and record result in the final implementation report
- [X] T069 [P] Validate integration configuration with root `docker compose config` and record result in the final implementation report
- [X] T070 Validate quickstart end to end using `specs/001-platform-foundation/quickstart.md` and update `README.md` or `quickstart.md` if any documented command differs from implemented scripts
- [X] T071 Produce final implementation report from `README.md` and validation results with changed files, scope exclusions, CORS result, healthcheck liveness result, Playwright exclusion, and remaining risks in the delivery response

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup & Infra (Phase 1)**: No dependencies - can start immediately.
- **Backend Foundation (Phase 2)**: Depends on Phase 1 for `lancarme-api/` and env template.
- **Frontend Foundation (Phase 3)**: Depends on Phase 1 for `lancarme-web/` and env template.
- **US1 (Phase 4)**: Depends on Phases 2 and 3.
- **US2 (Phase 5)**: Depends on Phases 2 and 3; should follow US1 in solo execution because it uses the app shell and local setup.
- **US3 (Phase 6)**: Depends on Phases 2 and 3; final review should follow US1 and US2.
- **Documentation & Validation (Phase 7)**: Depends on selected user stories being complete.

### User Story Dependencies

- **US1 (P1)**: First runnable MVP after foundation.
- **US2 (P2)**: Integrates web/API contract after foundation and app shell.
- **US3 (P3)**: Can start after foundation but final scope verification depends on US1 and US2 outputs.

### Within Each User Story

- Write or adjust tests before implementing matching behavior.
- Backend DTO before controller.
- Security/CORS configuration before CORS verification.
- Frontend type and API client before health service.
- Health service before `useHealthStatus`.
- Hook before app integration.
- README/quickstart command updates after scripts and files exist.

### Parallel Opportunities

- T004 and T005 can run in parallel after T001.
- T013, T014, T015, T022, and T023 can run in parallel because they touch independent structures.
- T025, T026, and T027 can run in parallel for US1.
- T039 and T040 can run in parallel after backend health tests are defined because they touch separate frontend test files.
- T041, T046, and T047 can run in parallel because they touch independent backend/frontend files.
- T063 through T069 can run in parallel where local machine resources allow separate validation commands.

---

## Parallel Example: User Story 1

```bash
Task: "T025 [P] [US1] Add backend application context test in lancarme-api/src/test/java/br/com/lancarme/LancarmeApplicationTest.java"
Task: "T026 [P] [US1] Add frontend smoke render test for the PT-BR technical app shell in lancarme-web/src/tests/App.test.tsx"
Task: "T027 [P] [US1] Add Docker Compose validation instructions to README.md"
```

---

## Parallel Example: User Story 2

```bash
Task: "T039 [P] [US2] Add frontend health service tests in lancarme-web/src/tests/healthService.test.ts"
Task: "T040 [P] [US2] Add frontend app tests in lancarme-web/src/tests/App.test.tsx"
```

---

## Parallel Example: User Story 3

```bash
Task: "T054 [P] [US3] Add scope guard checklist to README.md"
Task: "T056 [P] [US3] Ensure backend future domain packages contain no business rules"
Task: "T057 [P] [US3] Ensure frontend future module directories contain no business rules"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup & Infra.
2. Complete Phase 2: Backend Foundation.
3. Complete Phase 3: Frontend Foundation.
4. Complete Phase 4: User Story 1.
5. Stop and validate local startup documentation from `README.md`.

### Incremental Delivery

1. Setup + backend/frontend foundation creates monorepo, PostgreSQL, Flyway, env examples, and test harnesses.
2. US1 makes the local base runnable.
3. US2 proves the first typed web/API contract, liveness semantics, CORS guard, and frontend states.
4. US3 verifies the scope stays limited to platform foundation.
5. Documentation & Validation aligns README/quickstart and records command results.

### Scope Guard

- Do not implement auth, login, JWT, roles, workspace membership, billing, payments, webhooks, AI providers, prompt registry, credit ledger, upload, storage, dashboard, analytics, or product modules.
- Keep the only backend endpoint as `GET /api/v1/health`.
- Keep the only frontend screen as a technical PT-BR status screen.
- Keep `.env.example` values as placeholders or local-only defaults.
- Keep Playwright as a documented future E2E decision only; do not install, configure, script, or create Playwright tests in this block.
