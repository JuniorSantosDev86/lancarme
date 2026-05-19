# Lançar.me — AGENTS.md

Este arquivo orienta Codex, Claude Code e qualquer agente de IA que trabalhar no repositório do **Lançar.me**.

O projeto será conduzido por um único humano, **Ademir dos Santos Junior**, com apoio de agentes de IA. A documentação é fonte de verdade. Agentes não devem improvisar arquitetura, stack, regras de segurança, billing, IA ou LGPD sem autorização explícita.

## 1. Missão do produto

O **Lançar.me** é uma plataforma SaaS robusta para infoprodutores, mentores, experts, agências, coprodutores, gestores de tráfego e criadores planejarem, criarem, executarem, acompanharem e analisarem lançamentos digitais com apoio de IA.

Promessa central:

> Transformar conhecimento em conteúdo, conteúdo em campanha, campanha em venda, venda em entrega e entrega em prova para o próximo lançamento.

## 2. Stack oficial

### Frontend

- React.
- TypeScript.
- Vite.
- Tailwind CSS.
- shadcn/ui ou Radix UI.
- TanStack Query para server state.
- React Hook Form + Zod para formulários.
- Vitest + React Testing Library para testes de UI.
- Cypress ou Playwright para E2E.

### Backend

- Java 21.
- Spring Boot 3.
- Spring Web.
- Spring Security.
- Spring Data JPA/Hibernate.
- PostgreSQL.
- Flyway.
- Bean Validation.
- JUnit 5.
- Mockito.
- Testcontainers.

### Infra

- Docker Compose.
- VPS Hostinger KVM 2 ou KVM 4 no começo.
- Cloudflare DNS/CDN/WAF básico.
- Caddy ou Nginx como reverse proxy.
- PostgreSQL.
- Redis quando necessário.
- Cloudflare R2 para arquivos.
- Resend/Brevo para e-mail transacional.
- Sentry/PostHog ou alternativa para observabilidade.

### IA

- AI Gateway implementado no backend Java.
- Provedores plugáveis: OpenAI, Claude, Gemini ou outros.
- Créditos de IA por workspace.
- Prompt registry versionado.
- Logs de uso, custo, modelo, ação, status e promptVersion.
- Python/FastAPI apenas como worker especializado futuro, se realmente necessário.

## 3. Leis permanentes

1. Segurança vem antes de velocidade.
2. LGPD entra desde a fundação, não no final.
3. Todo dado crítico pertence a um workspace.
4. Toda consulta multi-tenant precisa validar `workspaceId` no backend.
5. O frontend nunca é fonte de autorização.
6. A UI nunca chama provider de IA diretamente.
7. Não existe IA ilimitada.
8. Todo consumo de IA precisa passar pelo ledger de créditos.
9. Todo webhook de pagamento precisa ser idempotente.
10. Todo upload deve ser privado por padrão.
11. Logs não podem expor secrets, tokens, dados sensíveis ou conteúdo privado desnecessário.
12. Todo bloco deve ter teste mínimo.
13. Todo bloco deve ter documentação atualizada quando mudar regra de produto.
14. UI em PT-BR por padrão.
15. Não prometer faturamento, ROAS, aprovação de anúncios ou resultado garantido.
16. Não criar microserviços cedo sem necessidade.
17. Não misturar regra de negócio no componente React.
18. Não criar controllers Spring gordos.
19. Não usar `any` no frontend sem justificativa.
20. Não usar entidade JPA diretamente como DTO público.

## 4. Arquitetura esperada

Monorepo inicial:

```txt
lancarme/
  lancarme-web/
  lancarme-api/
  docs/
  specs/
  docker-compose.yml
  AGENTS.md
  README.md
```

Backend por domínio:

```txt
lancarme-api/src/main/java/br/com/lancarme/
  shared/
  auth/
  workspace/
  strategy/
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
  billing/
```

Frontend por módulo:

```txt
lancarme-web/src/
  app/
  components/
  modules/
  services/
  hooks/
  schemas/
  types/
  tests/
```

## 5. Fluxo de desenvolvimento obrigatório

Para cada bloco:

1. Ler a constitution.
2. Ler a spec da feature.
3. Ler o plan.
4. Ler tasks.
5. Confirmar escopo.
6. Escrever ou ajustar testes antes/ao lado da implementação.
7. Implementar somente o bloco.
8. Rodar validações.
9. Atualizar documentação.
10. Entregar relatório final.

Validações mínimas:

```bash
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

# integração local
docker compose config
docker compose up --build
```

## 6. Agentes internos

### Product Strategy Agent
Garante que cada funcionalidade ajude a estruturar oferta, criar ativos, executar campanha, medir gargalos ou gerar prova para o próximo ciclo.

### Backend Architecture Agent
Garante camadas limpas em Java, DTOs, services, repositories, transactions, validações e isolamento por workspace.

### Frontend Architecture Agent
Garante React limpo, componentes reutilizáveis, formulários bem validados, acessibilidade, responsividade e estado previsível.

### AI Gateway Agent
Garante prompts versionados, schema de input/output, créditos, logs, fallback, custo e guardrails.

### Security & LGPD Agent
Garante privacidade, minimização, consentimento, retenção, exclusão, segurança de arquivos e proteção contra acesso cruzado.

### QA Agent
Garante testes unitários, integração, E2E, evidências, bug reports e regressão por bloco.

### DevOps Agent
Garante Docker, envs, SSL, firewall, backup, restore, healthcheck, logs e deploy seguro em VPS.

## 7. Definição de pronto

Um bloco só está pronto quando:

- cumpre a spec;
- cumpre critérios de aceite;
- tem testes relevantes;
- build passa;
- não quebra bloco anterior;
- não viola segurança;
- não viola LGPD;
- não cria dívida invisível;
- documentação foi atualizada;
- relatório final explica o que mudou, como foi validado e quais riscos permanecem.

<!-- SPECKIT START -->
For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
<!-- SPECKIT END -->
