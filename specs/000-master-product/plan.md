# Implementation Plan: Lançar.me Master Product

## Technical Context

- Frontend: React + TypeScript + Vite.
- Backend: Java 21 + Spring Boot 3.
- Database: PostgreSQL.
- Migration: Flyway.
- Auth: Spring Security.
- Infra: Docker Compose + VPS.
- AI: Java AI Gateway with provider adapters.
- Tests: JUnit, Mockito, Testcontainers, Vitest, RTL, Cypress/Playwright.

## Architecture Decision

Use monorepo with separated frontend and backend:

```txt
lancarme-web/
lancarme-api/
docs/
specs/
```

No microservices at the beginning. Extract workers only when required.

## Constitution Compliance

- Security by design.
- LGPD by design.
- Workspace isolation.
- AI credit governance.
- Professional clean code.
- Tests by block.

## Phases

1. Foundation.
2. Auth & Workspace.
3. Strategy Core.
4. AI Gateway & Credits.
5. Launch Operations.
6. Content/Copy/Creative.
7. Traffic/Analytics.
8. MentorFlow/Proof Vault.
9. Billing/Storage/Audit.
10. Security/Observability/Deploy.

## Risk Register

| Risk | Mitigation |
|---|---|
| Scope too large | Execute by small Spec Kit features |
| AI cost explosion | Credit ledger and model tiers |
| Data leakage | Workspace isolation tests |
| Solo founder overload | Documentation and agents |
| DevOps mistakes | Docker, backup, restore, runbooks |
| LGPD gaps | Privacy checklist from foundation |
