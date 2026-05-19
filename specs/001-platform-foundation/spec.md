# Feature Specification: Platform Foundation

**Feature Branch**: `001-platform-foundation`

**Created**: 2026-05-19

**Status**: Ready for planning

**Input**: User description: "Criar a fundacao tecnica inicial do Lancar.me, sem implementar funcionalidades de negocio. A specification deve cobrir monorepo, lancarme-web com React + TypeScript + Vite, lancarme-api com Java 21 + Spring Boot 3, PostgreSQL via Docker Compose, Flyway configurado, endpoint GET /api/v1/health, frontend exibindo status da API, .env.example para frontend e backend, testes minimos no backend e frontend, README com comandos de execucao e estrutura preparada para modulos futuros. Nao implementar auth, billing, IA real, upload, modulos de produto ou dashboard real."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Iniciar o ambiente base local (Priority: P1)

Como desenvolvedor do Lancar.me, quero subir a base local do produto com web, API e banco para validar que o repositorio esta pronto para receber os proximos blocos.

**Why this priority**: Sem uma base local executavel, nenhum modulo futuro pode ser desenvolvido, testado ou integrado com confianca.

**Independent Test**: Pode ser testado seguindo o README para iniciar banco, backend e frontend, depois confirmando que os tres componentes ficam disponiveis localmente sem secrets reais.

**Acceptance Scenarios**:

1. **Given** um clone limpo do repositorio com os pre-requisitos instalados, **When** o desenvolvedor segue os comandos documentados, **Then** o banco local, a API e a aplicacao web iniciam com configuracoes de exemplo.
2. **Given** que o ambiente usa arquivos de exemplo, **When** o desenvolvedor inspeciona as variaveis documentadas, **Then** encontra apenas placeholders seguros e nenhuma credencial real versionada.

---

### User Story 2 - Validar comunicacao entre web e API (Priority: P2)

Como desenvolvedor do Lancar.me, quero que a tela inicial consulte a API e mostre o status do servico para provar que a integracao basica entre frontend e backend funciona.

**Why this priority**: A comunicacao web/API e o primeiro contrato verificavel do monorepo e reduz risco antes da criacao dos modulos de negocio.

**Independent Test**: Pode ser testado abrindo a aplicacao web local e verificando que ela exibe, em PT-BR, o status retornado pelo healthcheck da API.

**Acceptance Scenarios**:

1. **Given** que a API esta ativa, **When** a aplicacao web carrega, **Then** a tela inicial exibe que a API esta operacional.
2. **Given** que a API esta indisponivel, **When** a aplicacao web tenta consultar o status, **Then** a tela inicial exibe uma mensagem clara de indisponibilidade sem quebrar a interface.

---

### User Story 3 - Proteger o escopo da fundacao (Priority: P3)

Como mantenedor do produto, quero que o bloco prepare a estrutura modular futura sem implementar autenticacao completa, billing, IA real, upload, dashboard real ou modulos de produto.

**Why this priority**: O bloco precisa criar uma base solida e pequena, evitando divida precoce e funcionalidades sem especificacao propria.

**Independent Test**: Pode ser testado inspecionando a estrutura criada e confirmando que existem apenas fundacao, healthcheck, configuracoes, testes minimos e documentacao.

**Acceptance Scenarios**:

1. **Given** a conclusao do bloco, **When** o repositorio e revisado, **Then** existem areas preparadas para modulos futuros sem regras de negocio desses modulos.
2. **Given** a conclusao do bloco, **When** os endpoints e telas disponiveis sao listados, **Then** apenas o healthcheck e a tela inicial de status fazem parte do escopo funcional.

### Edge Cases

- A API pode estar fora do ar quando a tela inicial carregar; a web deve exibir um estado de erro em PT-BR sem travar.
- O banco local pode ainda nao estar pronto quando a API iniciar; o README deve orientar a ordem de execucao e troubleshooting basico.
- Variaveis de ambiente podem estar ausentes; os exemplos devem deixar claro quais valores sao esperados para execucao local.
- O healthcheck nao deve depender de usuario autenticado, workspace, billing, IA, upload ou dado privado.
- Configuracoes de exemplo nao podem expor secrets, tokens, senhas reais ou endpoints privados.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O repositorio MUST manter a organizacao monorepo inicial com `lancarme-web/`, `lancarme-api/`, `docs/`, `specs/`, `docker-compose.yml`, `AGENTS.md` e `README.md`.
- **FR-002**: O bloco MUST definir a aplicacao web `lancarme-web` usando React, TypeScript e Vite como base oficial do frontend.
- **FR-003**: O bloco MUST definir a API `lancarme-api` usando Java 21 e Spring Boot 3 como base oficial do backend.
- **FR-004**: O bloco MUST disponibilizar PostgreSQL local via Docker Compose com variaveis seguras de exemplo.
- **FR-005**: O bloco MUST configurar Flyway para governar migracoes futuras do banco, mesmo que este bloco nao modele entidades de negocio.
- **FR-006**: A API MUST expor `GET /api/v1/health` como endpoint publico de verificacao operacional.
- **FR-007**: O healthcheck MUST retornar uma resposta de sucesso que permita identificar que a API esta operacional.
- **FR-008**: A aplicacao web MUST exibir uma tela inicial em PT-BR com o status atual da API obtido pelo healthcheck.
- **FR-009**: A aplicacao web MUST tratar loading e falha de conexao com mensagens claras em PT-BR.
- **FR-010**: O bloco MUST incluir `.env.example` para frontend e backend, com nomes de variaveis necessarias e sem secrets reais.
- **FR-011**: O bloco MUST incluir testes minimos de backend cobrindo o healthcheck.
- **FR-012**: O bloco MUST incluir testes minimos de frontend cobrindo a renderizacao da tela inicial e/ou status da API.
- **FR-013**: O README MUST explicar pre-requisitos, configuracao de ambiente, comandos para banco, backend, frontend, testes e build.
- **FR-014**: A estrutura inicial MUST preparar os diretorios/pacotes para modulos futuros sem implementar regras de negocio desses modulos.
- **FR-015**: O bloco MUST manter a UI em PT-BR por padrao.
- **FR-016**: O bloco MUST NOT implementar autenticacao completa, billing, IA real, upload, pagamentos, dashboard real ou modulos de produto.
- **FR-017**: O bloco MUST NOT incluir secrets reais, tokens privados, chaves de provedores ou dados sensiveis versionados.
- **FR-018**: O backend MUST NOT expor entidades de dominio como DTO publico neste bloco; qualquer resposta publica deve usar contrato proprio e minimo.

### Key Entities

- **Status da API**: Representa a disponibilidade operacional basica do backend para a tela inicial e para validacao local. Deve conter informacao suficiente para indicar sucesso ou indisponibilidade, sem dados sensiveis.
- **Configuracao de ambiente local**: Representa variaveis documentadas para execucao local de web, API e banco. Deve usar placeholders seguros e separar configuracao de frontend e backend.
- **Estrutura modular futura**: Representa os pontos de extensao para dominios futuros do produto, sem dados, fluxos ou regras de negocio neste bloco.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Um desenvolvedor com os pre-requisitos instalados consegue iniciar o ambiente local documentado em ate 15 minutos a partir de um clone limpo.
- **SC-002**: O status operacional da API pode ser verificado por uma chamada simples e retorna sucesso em pelo menos 99% das execucoes locais quando a API esta ativa.
- **SC-003**: A tela inicial informa o estado da API em ate 3 segundos em ambiente local quando backend e frontend estao ativos.
- **SC-004**: 100% das variaveis obrigatorias para execucao local aparecem nos arquivos de exemplo ou no README sem conter valores secretos reais.
- **SC-005**: Os testes minimos de backend e frontend passam em ambiente local antes de qualquer modulo de negocio ser iniciado.
- **SC-006**: A revisao de escopo confirma zero funcionalidades de auth completa, billing, IA real, upload, pagamento, dashboard real ou modulo de produto implementadas neste bloco.

## Assumptions

- O publico direto deste bloco e o desenvolvedor/mantenedor do produto, nao usuarios finais pagantes.
- A tela inicial e apenas uma pagina tecnica de status em PT-BR, nao um dashboard real do SaaS.
- O healthcheck e publico porque nao retorna dado privado, workspace, billing, IA, arquivo ou informacao sensivel.
- PostgreSQL deve estar pronto para uso futuro, mas a modelagem de entidades multi-tenant fica fora deste bloco.
- Flyway deve estar configurado como mecanismo de migracao, mas migracoes de dominio pertencem a blocos futuros.
- A estrutura modular pode conter diretorios ou pacotes vazios/placeholder apenas quando isso ajudar organizacao futura sem criar regra de negocio.
- As validacoes esperadas para este bloco sao as minimas de fundacao: testes automatizados basicos, build/lint/typecheck quando aplicavel e validacao do Docker Compose.

## Out of Scope

- Cadastro, login, JWT, refresh token, roles e autorizacao real.
- Workspaces reais, membership, policies multi-tenant e dados privados.
- AI Gateway, prompt registry, providers, creditos de IA e ledger.
- Billing, assinaturas, pagamentos e webhooks.
- Upload, storage privado, arquivos e URLs assinadas.
- Modulos Strategy, Launch, Content Matrix, Copy Room, Creative Room, Traffic Room, Funnel Map, Calendar & Execution, MentorFlow, Proof Vault e Analytics.
- Dashboard real, metricas de negocio e telas operacionais do produto.
- Deploy em VPS, HTTPS, Cloudflare, observabilidade e backup de producao.
