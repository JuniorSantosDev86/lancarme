# Prompt de guardrails para Codex/Claude antes de implementar

```txt
Antes de implementar, leia:
- .specify/memory/constitution.md
- AGENTS.md
- docs/architecture.md
- docs/security-lgpd.md
- specs/001-platform-foundation/spec.md
- specs/001-platform-foundation/plan.md
- specs/001-platform-foundation/tasks.md

Implemente somente o Bloco 1 — Platform Foundation.

Não implemente auth, billing, IA real, upload, módulos de produto ou qualquer feature fora do escopo.

Preserve arquitetura:
- React/TypeScript/Vite no lancarme-web;
- Java 21/Spring Boot 3 no lancarme-api;
- PostgreSQL no Docker Compose;
- healthcheck versionado em /api/v1/health;
- testes mínimos no frontend e backend;
- README com comandos.

Depois de implementar, entregue relatório com:
- arquivos criados/alterados;
- comandos executados;
- resultado dos testes;
- riscos conhecidos;
- próximos passos.
```
