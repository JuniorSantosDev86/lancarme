# Feature Specification: Lançar.me Master Product

**Feature Branch:** `000-master-product`  
**Created:** 2026-05-19  
**Status:** Draft  
**Input:** Plataforma SaaS robusta para lançamentos digitais com IA, construída com React frontend e Java/Spring Boot backend.

## User Scenarios & Testing

### User Story 1 — Estruturar uma oferta de lançamento

Como infoprodutor, quero cadastrar meu produto, avatar e oferta para que o sistema gere campanhas coerentes com minha estratégia.

**Acceptance Criteria**

1. Usuário cria produto dentro do seu workspace.
2. Usuário cria avatar vinculado ao produto.
3. Usuário cria oferta com promessa, mecanismo, preço, bônus, provas e objeções.
4. Dados ficam isolados por workspace.

### User Story 2 — Gerar campanha com IA por créditos

Como usuário pagante, quero gerar plano de lançamento, conteúdo, copy e criativos usando créditos de IA para controlar meu consumo e custo.

**Acceptance Criteria**

1. Sistema mostra saldo de créditos.
2. Ação sem saldo suficiente é bloqueada antes de chamar provider.
3. Ação bem-sucedida debita créditos e salva log.
4. Falha antes da chamada não debita.
5. Output é editável.

### User Story 3 — Acompanhar execução e métricas

Como gestor de lançamento, quero visualizar tarefas, calendário, funil e métricas para saber o que fazer e onde está o gargalo.

**Acceptance Criteria**

1. Command Center mostra próximas ações.
2. Tarefas possuem fase, prazo e status.
3. Métricas são registradas por lançamento.
4. Diagnóstico não promete resultado garantido.

### User Story 4 — Transformar entrega em prova social

Como mentor ou expert, quero acompanhar alunos/clientes e transformar resultados autorizados em provas para o próximo lançamento.

**Acceptance Criteria**

1. Sistema cadastra aluno/cliente.
2. Sistema registra progresso e sessões.
3. Proof Vault armazena depoimentos/prints/resultados.
4. Prova sem autorização não é sugerida para uso público.

## Functional Requirements

- FR-001: Sistema deve suportar workspaces multi-tenant.
- FR-002: Sistema deve suportar usuários e membros por workspace.
- FR-003: Sistema deve suportar Strategy Core.
- FR-004: Sistema deve suportar lançamentos e fases.
- FR-005: Sistema deve suportar ConteúdoMatriz.
- FR-006: Sistema deve suportar Copy Room.
- FR-007: Sistema deve suportar Creative Room.
- FR-008: Sistema deve suportar Traffic Room.
- FR-009: Sistema deve suportar Funnel Map.
- FR-010: Sistema deve suportar Calendar & Execution.
- FR-011: Sistema deve suportar MentorFlow.
- FR-012: Sistema deve suportar Proof Vault.
- FR-013: Sistema deve suportar Analytics.
- FR-014: Sistema deve suportar IA por créditos.
- FR-015: Sistema deve suportar planos e billing.
- FR-016: Sistema deve suportar upload privado.
- FR-017: Sistema deve gerar audit logs para ações críticas.
- FR-018: Sistema deve respeitar LGPD.

## Non-Functional Requirements

- NFR-001: Backend principal deve ser Java 21/Spring Boot 3.
- NFR-002: Frontend deve ser React/TypeScript.
- NFR-003: Banco principal deve ser PostgreSQL.
- NFR-004: Migrations devem usar Flyway.
- NFR-005: Código deve ser modular e testável.
- NFR-006: Segurança server-side obrigatória.
- NFR-007: UI em PT-BR.
- NFR-008: Deploy inicial via Docker Compose em VPS.
- NFR-009: IA deve ser governada por AI Gateway.
- NFR-010: Sem IA ilimitada.

## Key Entities

User, Workspace, WorkspaceMember, Product, Avatar, Offer, Launch, Task, ContentPiece, CopyDocument, CreativeBrief, TrafficPlan, FunnelNode, MetricSnapshot, StudentOrClient, ProofItem, FileAsset, AiActionLog, AiCreditLedger, Subscription, PaymentEvent, AuditLog.

## Success Metrics

- Usuário cria primeira oferta em até 30 minutos.
- Workspace gera campanha com pelo menos 3 ativos salvos em até 7 dias.
- Custo médio de IA por workspace fica abaixo da margem planejada.
- Nenhum teste de isolamento por workspace falha.
- Fluxos críticos têm E2E antes do beta.
