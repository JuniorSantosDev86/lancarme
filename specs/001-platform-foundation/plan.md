# Implementation Plan: Platform Foundation

**Branch**: `001-platform-foundation` | **Date**: 2026-05-20 | **Spec**: `specs/001-platform-foundation/spec.md`

**Input**: Feature specification from `specs/001-platform-foundation/spec.md`, including clarifications recorded on 2026-05-20.

## Summary

Planejar a fundacao tecnica inicial do Lancar.me em monorepo, preparando `lancarme-web` e `lancarme-api` para implementacao futura sem criar funcionalidades de negocio. O bloco deve definir a estrutura esperada para React + TypeScript + Vite com Tailwind preparado, Java 21 + Spring Boot 3 + Maven, PostgreSQL via Docker Compose, Flyway, `GET /api/v1/health`, frontend consumindo o healthcheck, `.env.example` por aplicacao, testes minimos, README com comandos reais e estrutura modular para proximos blocos.

O escopo e deliberadamente pequeno: fundacao executavel e verificavel, sem auth completa, billing, IA real, upload, dashboard real ou modulos de produto. As clarificacoes atuais adicionam tres decisoes tecnicas: CORS local restrito a `http://localhost:5173`, Playwright como ferramenta E2E futura sem instalacao neste bloco, e healthcheck como liveness da aplicacao sem consulta ao PostgreSQL.

## Technical Context

**Language/Version**: Frontend: TypeScript com React em Vite. Backend: Java 21 com Spring Boot 3.

**Primary Dependencies**: Frontend: Vite, React, TypeScript, Tailwind CSS, TanStack Query, Vitest, React Testing Library. Backend: Spring Web, Spring Security preparado, Spring Data JPA, PostgreSQL driver, Flyway, Bean Validation, JUnit 5, Mockito, Spring Boot Test, Testcontainers quando houver teste de integracao com banco.

**Storage**: PostgreSQL local via Docker Compose. Flyway governa migrations futuras. Este bloco nao modela entidades de negocio nem dados multi-tenant. O endpoint `GET /api/v1/health` nao consulta PostgreSQL; prontidao do banco e validada por Docker Compose, startup da API/Flyway e troubleshooting documentado.

**Testing**: Backend com JUnit 5 e teste do healthcheck. Frontend com Vitest + React Testing Library para renderizacao da tela inicial e estados do healthcheck. Docker Compose validado com `docker compose config`. Playwright fica definido como ferramenta E2E padrao futura, mas nao deve ser instalado, configurado ou usado neste bloco.

**Target Platform**: Desenvolvimento local em Linux. Backend local em `http://localhost:8080`. Frontend Vite local em `http://localhost:5173`. Base futura para VPS Linux com reverse proxy, PostgreSQL e Cloudflare, sem deploy neste bloco.

**Project Type**: Aplicacao web full stack em monorepo com frontend e backend separados.

**Performance Goals**: Healthcheck deve responder localmente de forma simples e sem dependencia de usuario, workspace, banco, IA, billing ou upload. A tela inicial deve informar o estado da API em ate 3 segundos em ambiente local quando web e API estiverem ativos.

**Constraints**: Sem secrets reais versionados; UI em PT-BR; backend como fonte de autoridade; contratos versionados sob `/api/v1`; controllers sem regra de negocio; nenhuma entidade JPA exposta como DTO publico; sem funcionalidades fora do escopo. CORS no perfil local deve permitir somente `http://localhost:5173` para `GET /api/v1/health`, sem wildcard `*`.

**Scale/Scope**: Um endpoint publico de status, uma tela tecnica inicial, configuracao local de banco, envs de exemplo, testes minimos e estrutura modular futura.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Plan Response |
|-----------|--------|---------------|
| Produto orientado a lancamentos | PASS | O bloco cria apenas a base para os modulos de lancamento futuros, sem mudar posicionamento do produto. |
| Stack oficial e arquitetura modular | PASS | Monorepo com `lancarme-web`, `lancarme-api`, `docs`, `specs` e `docker-compose.yml`; React/TS/Vite e Java 21/Spring Boot 3. |
| Seguranca, LGPD e multi-tenancy | PASS | Healthcheck publico nao retorna dados privados; CORS local e restrito; envs usam placeholders; nenhum dado de workspace sera criado neste bloco. |
| Backend como fonte de autoridade | PASS | O unico contrato backend sera DTO minimo de healthcheck; frontend apenas consome status e nao decide regra sensivel. |
| IA governada por gateway e creditos | PASS | IA real, providers, prompts e creditos ficam fora do escopo. |
| Billing, webhooks e auditoria | PASS | Billing e webhooks ficam fora do escopo. |
| Arquivos privados e dados protegidos | PASS | Upload e storage ficam fora do escopo. |
| Qualidade, testes e clean code | PASS | Plano exige testes minimos de backend/frontend, lint/typecheck/build e Docker Compose config. |
| UI em PT-BR e experiencia profissional | PASS | Tela inicial e mensagens de loading/erro/status devem estar em PT-BR. |
| Documentacao viva e execucao em blocos | PASS | Plano registra decisoes, contratos, riscos, comandos, criterios e arquivos esperados para futura implementacao. |

Nao ha violacoes constitucionais ou clarificacoes pendentes para este plano.

## Project Structure

### Documentation (this feature)

```text
specs/001-platform-foundation/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   └── healthcheck.openapi.yaml
├── checklists/
│   └── requirements.md
└── tasks.md
```

### Source Code (repository root)

Estrutura esperada para a futura implementacao do bloco. Este plano nao cria esses arquivos de aplicacao.

```text
lancarme/
├── lancarme-web/
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── vitest.config.ts
│   ├── tailwind.config.ts
│   ├── postcss.config.js
│   └── src/
│       ├── app/
│       │   ├── App.tsx
│       │   ├── index.css
│       │   └── main.tsx
│       ├── components/
│       │   ├── ui/
│       │   ├── layout/
│       │   └── shared/
│       ├── hooks/
│       │   └── useHealthStatus.ts
│       ├── modules/
│       │   ├── strategy/
│       │   ├── launch/
│       │   ├── content-matrix/
│       │   ├── copy-room/
│       │   ├── creative-room/
│       │   ├── traffic-room/
│       │   ├── funnel-map/
│       │   ├── calendar-execution/
│       │   ├── mentor-flow/
│       │   ├── proof-vault/
│       │   ├── analytics/
│       │   ├── billing/
│       │   └── ai/
│       ├── services/
│       │   ├── apiClient.ts
│       │   └── healthService.ts
│       ├── schemas/
│       ├── tests/
│       │   ├── setup.ts
│       │   └── App.test.tsx
│       └── types/
│           └── health.ts
├── lancarme-api/
│   ├── .env.example
│   ├── pom.xml
│   ├── mvnw
│   ├── mvnw.cmd
│   └── src/
│       ├── main/
│       │   ├── java/br/com/lancarme/
│       │   │   ├── LancarmeApplication.java
│       │   │   ├── shared/
│       │   │   │   ├── config/
│       │   │   │   ├── exception/
│       │   │   │   ├── response/
│       │   │   │   ├── security/
│       │   │   │   │   └── SecurityConfig.java
│       │   │   │   └── validation/
│       │   │   ├── health/
│       │   │   │   ├── controller/
│       │   │   │   │   └── HealthController.java
│       │   │   │   └── dto/
│       │   │   │       └── HealthResponse.java
│       │   │   ├── auth/
│       │   │   ├── workspace/
│       │   │   ├── strategy/
│       │   │   ├── launch/
│       │   │   ├── contentmatrix/
│       │   │   ├── copyroom/
│       │   │   ├── creativeroom/
│       │   │   ├── trafficroom/
│       │   │   ├── funnelmap/
│       │   │   ├── calendarexecution/
│       │   │   ├── mentorflow/
│       │   │   ├── proofvault/
│       │   │   ├── analytics/
│       │   │   ├── ai/
│       │   │   └── billing/
│       │   └── resources/
│       │       ├── application.yml
│       │       ├── application-local.yml
│       │       └── db/migration/
│       │           └── V1__platform_foundation.sql
│       └── test/
│           └── java/br/com/lancarme/
│               ├── LancarmeApplicationTest.java
│               └── health/
│                   └── HealthControllerTest.java
├── docs/
├── specs/
├── docker-compose.yml
├── AGENTS.md
└── README.md
```

**Structure Decision**: Usar monorepo com duas aplicacoes independentes e contratos/documentacao no repositorio raiz. O backend tera pacote `health` para o contrato publico deste bloco e pacotes vazios/preparados para os dominios futuros. O frontend tera tela inicial tecnica em `app`, client HTTP em `services` e hook de server state para healthcheck, mantendo modulos de produto apenas como estrutura futura.

## Technical Decisions

| Decision | Rationale | Alternatives Considered |
|----------|-----------|-------------------------|
| Monorepo com `lancarme-web` e `lancarme-api` | Simplifica desenvolvimento solo, versionamento conjunto, contratos e onboarding local. | Repos separados aumentariam overhead sem ganho neste inicio. |
| Maven no backend | Compatibilidade direta com Spring Boot 3, wrapper versionado e comandos previsiveis no README. | Gradle e viavel, mas nao foi solicitado e adiciona variacao desnecessaria. |
| Healthcheck publico em `/api/v1/health` | Nao expoe dados privados e permite validar integracao local rapidamente. | Actuator puro foi rejeitado como contrato principal porque pode expor superficie maior se mal configurado. |
| Healthcheck como liveness sem PostgreSQL | Mantem contrato minimo, rapido e desacoplado de infraestrutura; prontidao do banco fica em Docker Compose, startup/Flyway e troubleshooting. | Consultar banco no healthcheck foi rejeitado por acoplar liveness a infraestrutura e ampliar a semantica do endpoint. |
| DTO minimo para healthcheck | Cumpre a regra de nao expor entidade JPA e evita acoplamento a infraestrutura interna. | Texto puro seria simples, mas menos extensivel para frontend e testes. |
| CORS local restrito a `http://localhost:5173` | Permite Vite consumir a API local sem abrir wildcard e sem antecipar politicas de rotas privadas. | CORS wildcard foi rejeitado por seguranca; proxy Vite foi rejeitado como padrao porque esconde configuracao real do backend. |
| Flyway configurado desde o bloco 1 | Garante trilha de migracoes desde a fundacao, mesmo sem entidades de negocio. | Adiar Flyway criaria migracao retroativa e risco de banco fora de governanca. |
| PostgreSQL via Docker Compose | Replica a base oficial local sem depender de instalacao global. | H2 foi rejeitado porque mascara diferencas do PostgreSQL. Banco instalado globalmente foi rejeitado por prejudicar onboarding. |
| TanStack Query preparado para healthcheck | Padroniza server state desde o primeiro consumo da API. | `fetch` direto em `useEffect` foi rejeitado por criar padrao menos escalavel. Estado global foi rejeitado por ser desnecessario. |
| Tailwind preparado, sem design system completo | Deixa styling pronto sem antecipar shadcn/Radix ou componentes de produto. | Instalar shadcn agora seria prematuro porque nao ha UI real de produto neste bloco. |
| Playwright como E2E futuro, fora do Bloco 1 | Define direcao futura sem instalar ou configurar ferramenta antes de haver fluxo real de produto. | Cypress continua compativel com a constitution, mas Playwright foi escolhido para padrao futuro; configurar E2E agora foi rejeitado por escopo. |

## API Contract

Contrato detalhado em `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml`.

Endpoint planejado:

```http
GET /api/v1/health
Accept: application/json
Origin: http://localhost:5173
```

Resposta `200 OK`:

```json
{
  "status": "UP",
  "service": "lancarme-api",
  "version": "0.1.0"
}
```

Regras:

- endpoint publico, sem autenticacao;
- liveness da aplicacao: nao consulta PostgreSQL e nao retorna estado de infraestrutura;
- nao retorna hostname, IP, variaveis, banco, secrets, usuario, workspace ou dados sensiveis;
- `status` deve ser estavel para a UI;
- CORS no perfil local deve aceitar apenas `http://localhost:5173` para o consumo do frontend local;
- falhas de conexao devem ser tratadas pelo frontend com mensagem em PT-BR.

## Local Ports And URLs

| Component | Local URL | Notes |
|-----------|-----------|-------|
| Frontend Vite | `http://localhost:5173` | Origem permitida pelo CORS local da API. |
| Backend API | `http://localhost:8080` | Base versionada em `http://localhost:8080/api/v1`. |
| Healthcheck | `http://localhost:8080/api/v1/health` | Liveness da aplicacao; nao consulta PostgreSQL. |
| PostgreSQL | `localhost:5432` | Servico Docker Compose `postgres`; pronto para uso futuro via Flyway/startup. |

## Validation Commands

Comandos esperados para a futura implementacao:

```bash
# raiz
docker compose config

# backend
cd lancarme-api
./mvnw test
./mvnw verify

# frontend
cd lancarme-web
npm run lint
npm run typecheck
npm run test
npm run build
```

Comandos esperados de execucao local documentados no README futuro:

```bash
# raiz
docker compose up -d postgres

# backend
cd lancarme-api
cp .env.example .env
./mvnw spring-boot:run

# frontend
cd lancarme-web
cp .env.example .env
npm install
npm run dev
```

## Acceptance Criteria

- O repositorio mantem a estrutura monorepo esperada.
- A implementacao futura cria `lancarme-web` com React, TypeScript, Vite e Tailwind preparado.
- A implementacao futura cria `lancarme-api` com Java 21, Spring Boot 3 e Maven.
- PostgreSQL local fica disponivel via Docker Compose sem credenciais reais.
- Flyway fica configurado e pronto para migracoes futuras.
- `GET /api/v1/health` retorna JSON minimo e publico, sem dados sensiveis.
- `GET /api/v1/health` funciona como liveness da aplicacao, sem consultar PostgreSQL.
- A API em perfil local permite chamadas do frontend somente a partir de `http://localhost:5173`, sem CORS wildcard.
- A tela inicial em PT-BR consome o healthcheck e cobre loading, sucesso e erro.
- `.env.example` existe para frontend e backend com placeholders seguros.
- Testes minimos de backend e frontend passam localmente.
- README lista pre-requisitos, setup, execucao, testes, build e troubleshooting basico.
- Playwright fica documentado como E2E futuro, sem instalacao/configuracao neste bloco.
- Nenhuma funcionalidade de auth completa, billing, IA real, upload, dashboard real ou modulo de produto e implementada.

## Security & LGPD Impact

- O healthcheck e publico por decisao explicita, pois nao retorna dados pessoais, workspace, billing, IA, arquivos ou informacao operacional sensivel.
- O healthcheck nao consulta PostgreSQL e nao revela estado de infraestrutura, reduzindo acoplamento e superficie de informacao.
- `.env.example` deve conter apenas placeholders locais, como `changeme_local_only`, sem tokens reais.
- Logs da API e do frontend nao devem imprimir envs, secrets, payloads sensiveis ou detalhes internos de infraestrutura.
- Spring Security pode ser adicionado como dependencia/preparacao, mas este bloco deve liberar somente `/api/v1/health` e nao criar auth real.
- CORS local deve ser restrito a `http://localhost:5173` no perfil local; wildcard `*` e proibido neste bloco.
- Nao ha tratamento de dados pessoais, titulares, arquivos ou provas sociais neste bloco.
- A estrutura modular deve preservar a regra futura de que todo dado critico pertence a um workspace, mas nenhuma entidade multi-tenant sera criada agora.

## Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| Implementacao extrapolar para auth, dashboard ou modulos | Aumenta escopo e cria regras sem spec | Tasks futuras devem limitar arquivos e rejeitar endpoints/telas extras. |
| Healthcheck expor detalhes demais | Vazamento de infraestrutura | Contrato permite apenas `status`, `service` e `version`; endpoint nao consulta banco. |
| CORS local abrir wildcard | Aumenta superficie desnecessaria e cria padrao ruim | Configurar somente `http://localhost:5173` no perfil local e validar em teste/config review. |
| Docker Compose depender de secrets reais | Risco de vazamento | Usar placeholders locais e documentar que `.env` real nao deve ser versionado. |
| Flyway criado sem disciplina | Banco pode divergir cedo | Criar migration inicial minima e manter todas as mudancas futuras via `db/migration`. |
| Frontend acoplar chamada API dentro do componente | Padrao ruim para modulos futuros | Separar `services/healthService.ts` e hook `useHealthStatus.ts`. |
| E2E ser instalado cedo demais | Escopo cresce sem fluxo real para validar | Documentar Playwright como futuro e manter fora das dependencias do Bloco 1. |
| README ficar aspiracional | Onboarding falha | Comandos devem corresponder aos scripts reais criados no bloco de implementacao. |

## Expected Files For Future Implementation

Arquivos de raiz:

- `docker-compose.yml`
- `.gitignore`
- `README.md`
- `AGENTS.md`

Backend:

- `lancarme-api/pom.xml`
- `lancarme-api/.env.example`
- `lancarme-api/src/main/java/br/com/lancarme/LancarmeApplication.java`
- `lancarme-api/src/main/java/br/com/lancarme/shared/security/SecurityConfig.java`
- `lancarme-api/src/main/java/br/com/lancarme/health/controller/HealthController.java`
- `lancarme-api/src/main/java/br/com/lancarme/health/dto/HealthResponse.java`
- `lancarme-api/src/main/resources/application.yml`
- `lancarme-api/src/main/resources/application-local.yml`
- `lancarme-api/src/main/resources/db/migration/V1__platform_foundation.sql`
- `lancarme-api/src/test/java/br/com/lancarme/LancarmeApplicationTest.java`
- `lancarme-api/src/test/java/br/com/lancarme/health/HealthControllerTest.java`

Frontend:

- `lancarme-web/package.json`
- `lancarme-web/.env.example`
- `lancarme-web/index.html`
- `lancarme-web/vite.config.ts`
- `lancarme-web/vitest.config.ts`
- `lancarme-web/tailwind.config.ts`
- `lancarme-web/postcss.config.js`
- `lancarme-web/src/app/main.tsx`
- `lancarme-web/src/app/App.tsx`
- `lancarme-web/src/app/index.css`
- `lancarme-web/src/services/apiClient.ts`
- `lancarme-web/src/services/healthService.ts`
- `lancarme-web/src/hooks/useHealthStatus.ts`
- `lancarme-web/src/types/health.ts`
- `lancarme-web/src/tests/setup.ts`
- `lancarme-web/src/tests/App.test.tsx`

## Complexity Tracking

Nao ha violacoes constitucionais a justificar.

## Phase 0 Output

- `specs/001-platform-foundation/research.md`

## Phase 1 Output

- `specs/001-platform-foundation/data-model.md`
- `specs/001-platform-foundation/contracts/healthcheck.openapi.yaml`
- `specs/001-platform-foundation/quickstart.md`
- `AGENTS.md` referencia este plano entre os marcadores SPECKIT

## Post-Design Constitution Check

PASS. Os artefatos de design mantem o escopo restrito a fundacao, nao introduzem dados sensiveis, nao criam regras de dominio sem spec, preservam backend como autoridade e documentam validacoes minimas. As clarificacoes de CORS local, Playwright futuro e healthcheck sem PostgreSQL foram incorporadas sem ampliar o escopo funcional do Bloco 1.
