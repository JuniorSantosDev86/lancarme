# Lançar.me — Architecture

## 1. Decisão arquitetural

O Lançar.me será construído em monorepo com frontend e backend separados:

```txt
lancarme/
  lancarme-web/   # React + TypeScript
  lancarme-api/   # Java + Spring Boot
  docs/
  specs/
  docker-compose.yml
```

Essa decisão prioriza carreira e maturidade técnica. O backend Java/Spring Boot fortalece portfólio profissional, enquanto React/TypeScript entrega uma interface moderna de SaaS.

## 2. Frontend

Stack:

- React;
- TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui ou Radix UI;
- TanStack Query;
- React Hook Form;
- Zod;
- Vitest;
- React Testing Library;
- Cypress ou Playwright.

Responsabilidades:

- UI;
- formulários;
- navegação;
- consumo da API;
- estados de loading/error/empty;
- validação UX;
- experiência responsiva;
- dashboards;
- editores;
- feedback visual de IA/créditos.

Proibido no frontend:

- chamar provider de IA;
- calcular permissão final;
- confiar em workspaceId enviado pelo usuário sem validação no backend;
- armazenar secrets;
- implementar regra crítica de billing;
- expor dados sensíveis em logs do browser.

## 3. Backend

Stack:

- Java 21;
- Spring Boot 3;
- Spring Web;
- Spring Security;
- Spring Data JPA;
- Hibernate;
- PostgreSQL;
- Flyway;
- Bean Validation;
- MapStruct opcional;
- JUnit 5;
- Mockito;
- Testcontainers.

Responsabilidades:

- autenticação;
- autorização;
- multi-tenancy;
- regra de negócio;
- validação server-side;
- persistência;
- IA Gateway;
- créditos de IA;
- billing;
- webhooks;
- arquivos;
- audit logs;
- segurança;
- LGPD;
- relatórios;
- integrações.

## 4. Estrutura backend recomendada

```txt
lancarme-api/src/main/java/br/com/lancarme/
  shared/
    config/
    security/
    exception/
    response/
    validation/
    audit/
    storage/
    email/
  auth/
  workspace/
  strategy/
    product/
    avatar/
    offer/
  launch/
  contentmatrix/
  copyroom/
  creativeroom/
  trafficroom/
  funnelmap/
  calendarexecution/
  mentorflow/
  proofvault/
  analytics/
  ai/
    controller/
    service/
    provider/
    prompt/
    credit/
    ledger/
    dto/
  billing/
```

Padrão por módulo:

```txt
<module>/
  controller/
  service/
  dto/
  entity/
  repository/
  mapper/
  policy/
  exception/
```

## 5. Estrutura frontend recomendada

```txt
lancarme-web/src/
  app/
  routes/
  components/
    ui/
    layout/
    shared/
  modules/
    strategy/
    launch/
    content-matrix/
    copy-room/
    creative-room/
    traffic-room/
    funnel-map/
    calendar-execution/
    mentor-flow/
    proof-vault/
    analytics/
    billing/
    ai/
  services/
  hooks/
  schemas/
  types/
  tests/
```

## 6. API

A API será REST versionada:

> Nota de escopo: os endpoints abaixo representam a visão futura do produto. No Bloco 1 — Platform Foundation, o único endpoint de API a implementar é `GET /api/v1/health`. Auth, billing, IA real, upload, dashboard real e módulos de negócio não pertencem ao Bloco 1.

```txt
/api/v1/auth
/api/v1/workspaces
/api/v1/products
/api/v1/avatars
/api/v1/offers
/api/v1/launches
/api/v1/content
/api/v1/copies
/api/v1/creatives
/api/v1/traffic
/api/v1/funnels
/api/v1/tasks
/api/v1/mentor-flow
/api/v1/proofs
/api/v1/analytics
/api/v1/ai/actions
/api/v1/billing
/api/v1/files
/api/v1/audit-logs
```

## 7. Multi-tenancy

Modelo inicial: multi-tenancy lógico por `workspaceId`.

Regras:

- toda entidade crítica possui `workspaceId`;
- toda query deve filtrar por workspace;
- toda operação deve validar membership;
- owners/admins têm permissões ampliadas;
- roles menores veem apenas o permitido;
- Agency pode ter workspaces/clientes vinculados futuramente.

## 8. Dados principais

Entidades centrais:

- User;
- Workspace;
- WorkspaceMember;
- Product;
- Avatar;
- Offer;
- Launch;
- LaunchPhase;
- Task;
- ContentPiece;
- CopyDocument;
- CreativeBrief;
- TrafficPlan;
- FunnelNode;
- MetricSnapshot;
- StudentOrClient;
- MentorshipSession;
- ProofItem;
- FileAsset;
- AiActionLog;
- AiCreditLedger;
- Subscription;
- PaymentEvent;
- AuditLog.

## 9. Fluxo de IA

```txt
React UI
  -> POST /api/v1/ai/actions/{action}
    -> Spring Controller
      -> AI Action Service
        -> Permission/Plan Check
        -> Credit Service
        -> Prompt Registry
        -> AI Gateway
        -> Provider Adapter
        -> Output Validator
        -> Credit Ledger
        -> Persistence
```

## 10. Transações

Operações críticas devem ser transacionais:

- debitar crédito + salvar log de IA;
- atualizar plano via webhook;
- criar workspace após cadastro;
- registrar pagamento;
- associar arquivo a entidade;
- converter prova em ativo;
- gerar campanha com múltiplos outputs.

## 11. Escalabilidade futura

Não criar microserviços cedo.

Extrair serviços apenas quando houver dor real:

- worker Python/FastAPI para embeddings/processamento pesado;
- worker Java separado para jobs longos;
- fila dedicada para IA;
- banco gerenciado;
- storage externo;
- analytics warehouse.

## 12. Decisão final

A arquitetura deve parecer simples para operar, mas madura para crescer: frontend React profissional, backend Java empresarial, banco PostgreSQL, IA governada por créditos, segurança por padrão e documentação viva.
