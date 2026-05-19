<!--
Sync Impact Report
Version change: template -> 1.0.0
Modified principles:
- Template placeholders -> I. Produto Orientado a Lancamentos
- Template placeholders -> II. Stack Oficial e Arquitetura Modular
- Template placeholders -> III. Seguranca, LGPD e Multi-Tenancy
- Template placeholders -> IV. Backend como Fonte de Autoridade
- Template placeholders -> V. IA Governada por Gateway e Creditos
- Template placeholders -> VI. Billing, Webhooks e Auditoria
- Template placeholders -> VII. Arquivos Privados e Dados Protegidos
- Template placeholders -> VIII. Qualidade, Testes e Clean Code
- Template placeholders -> IX. UI em PT-BR e Experiencia Profissional
- Template placeholders -> X. Documentacao Viva e Execucao em Blocos
Added sections:
- Stack Oficial e Restricoes Tecnicas
- Fluxo de Desenvolvimento e Quality Gates
- Regras de Produto e Marketing
- Governanca
Removed sections:
- Placeholder template sections and examples
Templates requiring updates:
- pending: .specify/templates/plan-template.md (scope limited by user to constitution only)
- pending: .specify/templates/spec-template.md (scope limited by user to constitution only)
- pending: .specify/templates/tasks-template.md (scope limited by user to constitution only)
- pending: .specify/templates/checklist-template.md (scope limited by user to constitution only)
- not present: .specify/templates/commands/*.md
Follow-up TODOs:
- None
-->

# Lancar.me Constitution

## Core Principles

### I. Produto Orientado a Lancamentos

O Lancar.me MUST ajudar infoprodutores, mentores, experts, agencias,
coprodutores, gestores de trafego e criadores a planejar, criar, executar,
acompanhar e analisar lancamentos digitais com apoio de IA. Toda feature MUST
servir a pelo menos uma funcao de produto: estruturar oferta, transformar
estrategia em ativos, organizar execucao, medir gargalos ou gerar prova para o
proximo ciclo.

O produto MUST NOT ser tratado como checkout, area de membros generica, CRM
generico, Notion com IA, agencia automatizada, ferramenta para burlar politicas
de anuncios ou promessa de resultado garantido. Essa restricao protege foco,
posicionamento e responsabilidade comercial.

### II. Stack Oficial e Arquitetura Modular

A stack oficial MUST ser frontend React, TypeScript, Vite, Tailwind CSS,
shadcn/ui ou Radix UI, TanStack Query, React Hook Form, Zod, Vitest, React
Testing Library e Cypress ou Playwright. O backend MUST ser Java 21, Spring
Boot 3, Spring Web, Spring Security, Spring Data JPA/Hibernate, PostgreSQL,
Flyway, Bean Validation, JUnit 5, Mockito e Testcontainers.

A infraestrutura inicial MUST usar Docker Compose e VPS Linux no inicio,
preferencialmente com Cloudflare, reverse proxy Caddy ou Nginx, PostgreSQL,
Cloudflare R2 para arquivos, provedor transacional de e-mail e observabilidade.
Python/FastAPI MAY existir no futuro apenas como worker auxiliar especializado;
Python/FastAPI MUST NOT substituir o backend principal Java/Spring Boot.

A arquitetura MUST permanecer modular em monorepo, com `lancarme-web/`,
`lancarme-api/`, `docs/`, `specs/` e `docker-compose.yml`. Microservicos MUST
NOT ser criados cedo sem necessidade operacional comprovada.

### III. Seguranca, LGPD e Multi-Tenancy

Seguranca MUST vir antes de velocidade. LGPD MUST ser considerada desde a
fundacao, incluindo finalidade, minimizacao, retencao, direitos do titular,
consentimento quando aplicavel e tratamento responsavel de provas sociais.

Todo dado critico MUST pertencer a um workspace. Toda entidade multi-tenant MUST
conter `workspaceId` ou vinculo equivalente verificavel. Toda consulta,
mutacao, arquivo, log, relatorio e acao de IA que envolva dados privados MUST
validar membership, permissao e isolamento por workspace no backend.

Logs MUST NOT expor secrets, tokens, senhas, chaves de API, payloads sensiveis
ou conteudo privado desnecessario. Endpoints privados MUST exigir autenticacao
e autorizacao server-side. Links publicos MUST usar tokens ou politicas
explicitas, nunca acesso acidental.

### IV. Backend como Fonte de Autoridade

O frontend MUST NOT ser fonte de autorizacao, billing, permissoes, saldo de IA,
validacao final de workspace ou regra critica de dominio. A UI MAY melhorar a
experiencia com validacoes e feedbacks, mas toda decisao sensivel MUST ser
revalidada no backend.

Controllers Spring MUST receber requests, validar DTOs, chamar services e
retornar response DTOs. Controllers MUST NOT conter regra de negocio. Services
MUST coordenar regras, transacoes, permissoes, repositories, logs de dominio e
integracoes. Repositories MUST preservar isolamento por workspace em dados
privados.

Entidades JPA MUST NOT ser expostas como DTO publico. Request DTOs e Response
DTOs MUST ser separados das entidades. Bean Validation MUST ser usado em
entradas backend, e erros MUST ser mapeados para respostas HTTP consistentes sem
stack trace em producao.

### V. IA Governada por Gateway e Creditos

Toda funcionalidade de IA MUST passar pelo AI Gateway no backend Java. A UI MUST
NOT chamar provedores de IA diretamente. Provedores como OpenAI, Claude, Gemini
ou outros MUST ser plugaveis via adapters controlados pelo backend.

Nao existe IA ilimitada. Todo consumo de IA MUST consultar plano, workspace,
permissao, saldo, custo estimado e ledger de creditos antes da chamada ao
provedor. A cobranca em creditos MUST ser registrada por workspace, usuario,
acao, modelo, custo, status e resultado operacional.

Prompts MUST ser versionados em um Prompt Registry com id, versao, modulo, acao,
modelo recomendado, custo em creditos, schema de input, schema de output,
guardrails, exemplos e changelog. Outputs de IA MUST ser validaveis,
editaveis e seguros para o contexto do produto.

### VI. Billing, Webhooks e Auditoria

Billing, creditos, assinaturas e pacotes MUST ser tratados como dados criticos
de workspace. Webhooks de pagamento MUST verificar assinatura do provedor, usar
idempotencia por `eventId`, registrar evento recebido, evitar duplicidade e
nunca liberar plano sem confirmacao valida.

Operacoes criticas MUST ser transacionais sempre que houver risco de
inconsistencia, incluindo debitar credito e salvar log de IA, atualizar plano
por webhook, registrar pagamento, associar arquivo a entidade e gerar multiplos
outputs em uma campanha.

Logs de IA, billing e auditoria MUST existir para rastreabilidade, investigacao
e suporte. Esses logs MUST equilibrar rastreabilidade com minimizacao de dados
e protecao contra vazamento de informacoes sensiveis.

### VII. Arquivos Privados e Dados Protegidos

Uploads MUST ser privados por padrao. Arquivos MUST usar controle de acesso por
workspace, validacao de tipo e tamanho, nomes fisicos que nao exponham dados
sensiveis e URLs assinadas com expiracao quando houver acesso temporario.

Provas sociais MUST registrar autorizacao de uso, origem, escopo, data e status
quando aplicavel. Provas sem autorizacao MUST NOT ser sugeridas para criativos
publicos ou campanhas externas.

Ambientes de producao MUST possuir estrategia documentada de backup e restore.
Backup sem restore testado MUST NOT ser considerado protecao suficiente.

### VIII. Qualidade, Testes e Clean Code

Todo bloco MUST ter testes automatizados relevantes ao risco. Backend SHOULD
usar JUnit 5, Mockito, AssertJ, Spring Boot Test e Testcontainers conforme a
camada. Frontend SHOULD usar Vitest, React Testing Library e Cypress ou
Playwright conforme o fluxo.

Mudancas que envolvam workspace, autorizacao, IA, billing, webhooks, arquivos,
LGPD ou dados sensiveis MUST incluir testes que cubram falha e sucesso. Testes
MUST NOT ser removidos sem substituicao ou justificativa documentada.

Codigo MUST seguir padrao profissional: componentes React pequenos, sem regra
critica de dominio; services backend coesos; repositories testaveis; exceptions
de dominio; contratos claros; ausencia de `any` no frontend sem justificativa;
e nenhum TODO sem contexto, ticket ou decisao registrada.

### IX. UI em PT-BR e Experiencia Profissional

A UI MUST ser em PT-BR por padrao. Mensagens de erro, estados vazios, labels,
validacoes e feedbacks de IA/creditos MUST ser claros, responsivos e adequados
a um SaaS profissional para operacao de lancamentos.

O frontend MUST tratar loading, error, empty, permissao negada, saldo
insuficiente e bloqueio por plano sem depender dessas telas para seguranca. A
experiencia visual MUST apoiar operacao recorrente, leitura rapida e execucao
confiavel.

### X. Documentacao Viva e Execucao em Blocos

A documentacao e fonte de verdade junto com esta constitution. Agentes e
desenvolvedores MUST NOT improvisar arquitetura, stack, seguranca, billing, IA,
LGPD ou regra de produto sem autorizacao explicita e registro documental.

O desenvolvimento MUST ocorrer em blocos pequenos, verificaveis e reversiveis.
Cada bloco MUST ler constitution, spec, plan e tasks; confirmar escopo;
implementar somente o bloco; rodar validacoes aplicaveis; atualizar
documentacao quando mudar regra de produto ou arquitetura; e entregar relatorio
final com mudancas, validacoes e riscos.

## Stack Oficial e Restricoes Tecnicas

O repositorio inicial MUST seguir a estrutura:

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

O backend SHOULD organizar dominios em pacotes como `shared`, `auth`,
`workspace`, `strategy`, `launch`, `contentmatrix`, `copyroom`, `creativeroom`,
`trafficroom`, `funnelmap`, `calendarexecution`, `mentorflow`, `proofvault`,
`analytics`, `ai` e `billing`. Cada modulo SHOULD usar controller, service,
dto, entity, repository, mapper, policy e exception quando aplicavel.

O frontend SHOULD organizar `app`, `routes`, `components`, `modules`,
`services`, `hooks`, `schemas`, `types` e `tests`. TanStack Query MUST ser
preferido para server state; React Hook Form e Zod MUST ser preferidos para
formularios.

APIs SHOULD ser REST versionadas sob `/api/v1`. PostgreSQL MUST ser o banco
principal. Flyway MUST governar migracoes. Spring Security MUST proteger rotas,
autenticacao, autorizacao e politicas server-side.

## Fluxo de Desenvolvimento e Quality Gates

Antes de implementar qualquer bloco, o agente ou desenvolvedor MUST ler:

1. `.specify/memory/constitution.md`
2. a spec da feature
3. o plan da feature
4. `tasks.md`
5. a documentacao de arquitetura, seguranca/LGPD, IA/creditos e QA quando o
   bloco tocar esses temas

As validacoes minimas por bloco MUST ser escolhidas conforme o escopo:

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

# integracao local
docker compose config
docker compose up --build
```

Um bloco somente pode ser considerado pronto quando cumpre a spec e criterios de
aceite, tem testes relevantes, nao quebra bloco anterior, nao viola seguranca ou
LGPD, nao cria divida invisivel, atualiza documentacao quando necessario e
registra riscos restantes.

## Regras de Produto e Marketing

O Lancar.me MUST NOT prometer faturamento, ROAS, lucro, aprovacao de anuncios,
resultado financeiro, depoimentos, metricas ou sucesso garantido. Textos,
prompts, templates e outputs de IA MUST evitar promessas abusivas, metricas
falsas, urgencia enganosa, manipulacao indevida e orientacoes para burlar
politicas de plataformas.

O produto MAY ajudar o usuario a estruturar campanhas melhores, organizar
ativos, analisar gargalos e gerar hipoteses. Ele MUST preservar responsabilidade
humana sobre estrategia, revisao, publicacao e decisoes comerciais.

## Governance

Esta constitution prevalece sobre preferencias locais, improvisos de agente,
atalhos de implementacao e documentacao desatualizada. Quando houver conflito,
a ordem de decisao MUST ser: constitution, AGENTS.md, docs oficiais do projeto,
spec da feature, plan, tasks e codigo existente.

Alteracoes nesta constitution MUST ser explicitas, documentadas no Sync Impact
Report, versionadas semanticamente e revisadas contra AGENTS.md, docs oficiais e
templates Spec Kit. Mudancas que removem ou redefinem principios de seguranca,
LGPD, multi-tenancy, billing, IA, stack oficial ou governanca de dados exigem
bump MAJOR. Novos principios ou secoes materiais exigem bump MINOR. Ajustes de
clareza, exemplos ou redacao exigem bump PATCH.

Todo `/speckit.specify`, `/speckit.plan`, `/speckit.tasks` e
`/speckit.implement` MUST verificar aderencia a esta constitution. Violacoes
MUST ser corrigidas ou registradas no plano com justificativa, risco, alternativa
mais simples rejeitada e aprovacao explicita do humano responsavel.

**Version**: 1.0.0 | **Ratified**: 2026-05-19 | **Last Amended**: 2026-05-19
