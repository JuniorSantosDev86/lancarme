# Feature Specification: Platform Foundation

**Feature Branch:** `001-platform-foundation`  
**Created:** 2026-05-19  
**Status:** Ready for planning  
**Input:** Criar a fundação técnica inicial do Lançar.me com React frontend e Java/Spring Boot backend.

## User Scenarios & Testing

### User Story 1 — Rodar o ambiente local

Como desenvolvedor solo, quero subir frontend, backend e banco localmente para iniciar o desenvolvimento do Lançar.me com uma base estável.

**Acceptance Criteria**

1. `docker compose up` sobe PostgreSQL e serviços configurados.
2. Backend Spring Boot sobe sem erro.
3. Frontend React sobe sem erro.
4. README explica comandos.

### User Story 2 — Validar comunicação frontend/backend

Como desenvolvedor, quero que o frontend consulte um healthcheck do backend para confirmar a integração inicial.

**Acceptance Criteria**

1. Backend expõe `GET /api/v1/health`.
2. Endpoint retorna status UP.
3. Frontend mostra status da API em uma tela inicial em PT-BR.
4. Erro de conexão é tratado com mensagem clara.

### User Story 3 — Preparar arquitetura para módulos futuros

Como mantenedor, quero uma estrutura modular limpa para permitir evolução segura.

**Acceptance Criteria**

1. Backend possui pacotes base para shared, auth, workspace, strategy, ai, billing.
2. Frontend possui estrutura base para components, modules, services, hooks, schemas e types.
3. Nenhuma regra de negócio futura é implementada fora do bloco.

## Functional Requirements

- FR-001: Criar monorepo `lancarme`.
- FR-002: Criar app `lancarme-web` com React + TypeScript + Vite.
- FR-003: Criar app `lancarme-api` com Java 21 + Spring Boot 3.
- FR-004: Configurar PostgreSQL via Docker Compose.
- FR-005: Criar endpoint `GET /api/v1/health`.
- FR-006: Criar tela inicial do frontend consumindo o healthcheck.
- FR-007: Criar `.env.example` para frontend e backend.
- FR-008: Criar README com instruções.
- FR-009: Criar estrutura modular inicial.
- FR-010: Criar testes mínimos.

## Non-Functional Requirements

- NFR-001: Nenhum secret real deve ser commitado.
- NFR-002: Código deve compilar.
- NFR-003: Testes mínimos devem passar.
- NFR-004: UI deve estar em PT-BR.
- NFR-005: O bloco não deve implementar auth, billing, IA real ou módulos de negócio.

## Out of Scope

- Login/cadastro.
- JWT.
- Workspaces reais.
- IA real.
- Billing.
- Upload.
- Módulos de lançamento.
- Deploy real.

## Key Entities

Nenhuma entidade de domínio obrigatória neste bloco. PostgreSQL deve estar pronto para uso futuro, mas sem modelagem completa.

## Success Criteria

- Ambiente local sobe.
- Healthcheck funciona.
- Frontend consome backend.
- Testes mínimos passam.
- Repositório fica pronto para Bloco 2.
