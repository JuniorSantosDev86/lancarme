# Research: Platform Foundation

## Decision: Monorepo com frontend e backend separados

**Rationale**: O projeto sera conduzido por um unico mantenedor com apoio de agentes. Um monorepo reduz overhead de sincronizacao, facilita contratos locais, documentacao conjunta, Docker Compose compartilhado e validacao integrada.

**Alternatives considered**: Repos separados para web e API foram rejeitados neste inicio porque aumentam custo operacional sem necessidade. Um unico projeto full stack tambem foi rejeitado porque conflita com a stack oficial de frontend React/Vite e backend Java/Spring separados.

## Decision: React + TypeScript + Vite com Tailwind preparado

**Rationale**: Alinha com constitution, entrega feedback rapido em desenvolvimento local e cria base consistente para UI em PT-BR, testes de componentes e futuros modulos de produto.

**Alternatives considered**: Next.js foi rejeitado por nao estar na stack oficial inicial. Create React App foi rejeitado por ser legado para este contexto. CSS puro foi rejeitado porque Tailwind ja e stack oficial.

## Decision: TanStack Query para consumo do healthcheck

**Rationale**: Mesmo sendo um endpoint simples, o healthcheck e server state. Usar TanStack Query desde o primeiro consumo define o padrao para loading, error e refetch sem colocar regra de integracao no componente.

**Alternatives considered**: `fetch` direto em `useEffect` foi rejeitado por criar padrao menos escalavel. Estado global foi rejeitado por ser desnecessario.

## Decision: Java 21 + Spring Boot 3 + Maven

**Rationale**: E a stack oficial do backend, com ecossistema forte para Spring Web, Security, JPA, Flyway, Bean Validation e testes. Maven com wrapper fornece comandos previsiveis para README e CI futura.

**Alternatives considered**: Gradle foi rejeitado por nao ter sido solicitado. Kotlin e Node.js foram rejeitados por conflitar com a stack oficial do backend.

## Decision: `GET /api/v1/health` publico e minimo

**Rationale**: O endpoint valida disponibilidade da API e contrato inicial web/API sem depender de autenticacao, workspace, billing, IA, upload ou dados privados. Como nao retorna informacao sensivel, pode ser publico.

**Alternatives considered**: Spring Actuator como contrato principal foi rejeitado por potencialmente expor endpoints operacionais demais se mal configurado. Healthcheck autenticado foi rejeitado porque impediria validacao simples da fundacao.

## Decision: DTO proprio para resposta do healthcheck

**Rationale**: Mantem padrao de contrato publico separado de entidades e evita exposicao acidental de detalhes internos. A resposta deve conter apenas `status`, `service` e `version`.

**Alternatives considered**: String simples foi rejeitada por dificultar consumo tipado no frontend. Retornar detalhes do banco ou ambiente foi rejeitado por seguranca e minimizacao.

## Decision: PostgreSQL via Docker Compose desde o bloco 1

**Rationale**: PostgreSQL e o banco oficial. Docker Compose reduz dependencia de instalacao local, prepara integracao futura e permite comandos reais no README.

**Alternatives considered**: H2 foi rejeitado porque mascara diferencas do PostgreSQL. Banco instalado globalmente foi rejeitado por prejudicar onboarding.

## Decision: Flyway configurado desde a fundacao

**Rationale**: Todas as mudancas de banco futuras devem passar por migrations. Configurar Flyway agora evita disciplina retroativa e cria trilha de evolucao desde o primeiro bloco.

**Alternatives considered**: Adiar Flyway foi rejeitado por aumentar risco de divergencia local. Hibernate DDL auto para criar schema foi rejeitado como mecanismo principal.

## Decision: Testes minimos por camada

**Rationale**: A constitution exige teste por bloco. Backend deve testar o healthcheck com JUnit/Spring Boot Test ou MockMvc. Frontend deve testar loading/sucesso/erro da tela inicial com Vitest e React Testing Library.

**Alternatives considered**: Apenas teste manual foi rejeitado por nao cumprir QA. E2E neste bloco foi considerado opcional e pode ser adiado porque ainda nao ha fluxo de usuario real.

## Decision: `.env.example` sem secrets reais

**Rationale**: O projeto precisa ser executavel localmente sem versionar credenciais reais. Os exemplos devem documentar nomes, portas e placeholders seguros.

**Alternatives considered**: Comitar `.env` real foi rejeitado por seguranca. Documentar variaveis apenas no README foi rejeitado por ser mais propenso a divergencia.
