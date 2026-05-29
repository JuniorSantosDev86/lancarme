# Lançar.me

**Sala de guerra com IA para lançamentos digitais.**

O **Lançar.me** é uma plataforma SaaS para infoprodutores, mentores, experts, coprodutores, agências e gestores de tráfego planejarem, produzirem, executarem e analisarem lançamentos digitais em um único ambiente.

A proposta do produto é transformar uma operação normalmente espalhada entre planilhas, documentos, ferramentas de IA, gerenciadores de anúncios, calendários e pastas de criativos em um fluxo organizado, rastreável e orientado por dados.

> Transformar conhecimento em conteúdo, conteúdo em campanha, campanha em venda, venda em entrega e entrega em prova para o próximo lançamento.

---

## Sobre o produto

O Lançar.me combina estratégia, produção de ativos, execução operacional, acompanhamento de métricas e apoio de IA em uma plataforma modular.

A plataforma é organizada em três grandes frentes:

* **ConteúdoMatriz** — criação, reaproveitamento e organização de conteúdos para diferentes formatos e etapas do funil.
* **LaunchRoom** — estratégia de lançamento, oferta, copy, criativos, tráfego, calendário e acompanhamento de execução.
* **MentorFlow** — acompanhamento de clientes ou alunos, progresso, provas sociais e reaproveitamento de resultados em novos ativos de campanha.

O objetivo não é substituir checkout, plataforma de cursos, gerenciador de anúncios ou estratégia humana. O Lançar.me atua como a camada operacional que conecta planejamento, criação, execução, análise e aprendizado acumulado entre lançamentos.

---

## Funcionalidades do produto

A plataforma é projetada para suportar:

* estruturação de produtos digitais, avatars e ofertas;
* planejamento de lançamentos e campanhas;
* geração assistida de posts, carrosséis, roteiros, e-mails, copies e briefings criativos;
* organização de calendário editorial e tarefas de execução;
* planejamento de mídia, públicos, UTMs e acompanhamento de métricas;
* visualização do funil e identificação de gargalos;
* gestão de provas sociais autorizadas;
* acompanhamento de alunos ou clientes;
* relatórios pós-lançamento;
* ações de IA controladas por créditos;
* workspaces, permissões e rastreabilidade de ações críticas.

---

## Módulos

| Módulo                       | Finalidade                                                       |
| ---------------------------- | ---------------------------------------------------------------- |
| **Command Center**           | Visão central da operação, indicadores, próximas ações e alertas |
| **Strategy Core**            | Produto, avatar, oferta, promessa e posicionamento               |
| **Launch Strategy Room**     | Planejamento de lançamento, fases, datas, canais e orçamento     |
| **ConteúdoMatriz**           | Produção e reaproveitamento de conteúdo                          |
| **Copy Room**                | Copies para páginas, anúncios, e-mails, WhatsApp e scripts       |
| **Creative Room**            | Briefings, ângulos, hooks e variações criativas                  |
| **Traffic Room**             | Planejamento de mídia, públicos, orçamento e diagnóstico         |
| **Funnel Map**               | Organização visual do funil e suas dependências                  |
| **Calendar & Execution**     | Tarefas, prazos e acompanhamento operacional                     |
| **MentorFlow**               | Acompanhamento de clientes ou alunos                             |
| **Proof Vault**              | Provas sociais, autorizações e ativos reutilizáveis              |
| **Analytics & AI Diagnosis** | Métricas, tendências e diagnósticos assistidos                   |
| **Billing & Credits**        | Planos, limites e consumo de IA                                  |
| **Settings & Integrations**  | Configurações e integrações externas                             |
| **Audit & Security**         | Auditoria, segurança, privacidade e governança                   |

---

## Princípios do produto

O desenvolvimento do Lançar.me segue alguns princípios fundamentais:

* **Segurança e LGPD desde a fundação.**
* **Multi-tenancy por workspace**, com isolamento de dados entre organizações.
* **Validação crítica sempre no backend.**
* **IA governada por créditos**, sem consumo ilimitado ou custo invisível.
* **Prompts versionados e ações de IA rastreáveis.**
* **Arquivos privados por padrão.**
* **Webhooks idempotentes e auditáveis.**
* **Testes automatizados e documentação viva.**
* **Nenhuma promessa de faturamento ou ROAS garantido.**
* **IA como apoio operacional, não substituição da estratégia humana.**

---

## Arquitetura

O projeto utiliza uma arquitetura monorepo com frontend e backend separados:

```txt
lancarme/
├── lancarme-web/        # Frontend React + TypeScript + Vite
├── lancarme-api/        # Backend Java + Spring Boot
├── docs/                # Documentação técnica e de produto
├── specs/               # Especificações funcionais e técnicas
└── docker-compose.yml   # Serviços locais de infraestrutura
```

### Frontend

Responsável pela experiência do usuário, navegação, formulários, dashboards, estados visuais e consumo da API.

Tecnologias principais:

* React;
* TypeScript;
* Vite;
* Tailwind CSS;
* shadcn/ui;
* TanStack Query;
* Vitest;
* React Testing Library.

### Backend

Responsável por autenticação, autorização, regras de negócio, persistência, multi-tenancy, IA, créditos, billing, arquivos, auditoria e integrações.

Tecnologias principais:

* Java 21;
* Spring Boot 3;
* Spring Web;
* Spring Security;
* Spring Data JPA;
* Hibernate;
* Flyway;
* PostgreSQL;
* JUnit 5;
* Mockito;
* Testcontainers.

### Infraestrutura

* Docker Compose para ambiente local;
* PostgreSQL como banco principal;
* API REST versionada em `/api/v1`;
* deploy planejado em VPS com Docker, proxy reverso, SSL, backup e observabilidade.

---

## Estrutura técnica

```txt
lancarme-web/src/
├── app/                  # Bootstrap e composição principal da aplicação
├── components/
│   ├── layout/           # Shell, sidebar, topbar e navegação responsiva
│   ├── shared/           # Componentes compartilhados
│   └── ui/               # Componentes base da interface
├── hooks/                # Hooks reutilizáveis
├── lib/                  # Utilitários e configurações locais
├── modules/              # Módulos de domínio do frontend
├── services/             # Comunicação com a API
├── tests/                # Testes frontend
└── types/                # Tipos TypeScript

lancarme-api/src/main/java/br/com/lancarme/
├── shared/               # Configuração, segurança e infraestrutura comum
├── auth/                 # Autenticação
├── workspace/            # Workspaces, membros e permissões
├── strategy/             # Produto, avatar e oferta
├── launch/               # Operação de lançamento
├── contentmatrix/        # Conteúdo
├── copyroom/             # Copy
├── creativeroom/         # Criativos
├── trafficroom/          # Tráfego
├── funnelmap/            # Funil
├── calendarexecution/    # Calendário e execução
├── mentorflow/           # Acompanhamento
├── proofvault/           # Provas sociais
├── analytics/            # Métricas e relatórios
├── ai/                   # Gateway, prompts, créditos e logs de IA
└── billing/              # Planos e pagamentos
```

---

## Requisitos locais

Para executar o projeto localmente, tenha instalado:

* Node.js 20 ou superior;
* npm;
* Java 21;
* Docker;
* Docker Compose.

---

## Executando localmente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd lancarme
```

### 2. Suba o PostgreSQL

```bash
docker compose up -d postgres
```

Verifique se o container iniciou corretamente:

```bash
docker compose ps
```

### 3. Inicie o backend

```bash
cd lancarme-api
cp .env.example .env
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

O profile `local` habilita a configuração necessária para que o frontend executado localmente possa consumir a API no navegador.

A API ficará disponível em:

```txt
http://localhost:8080
```

Healthcheck:

```bash
curl http://localhost:8080/api/v1/health
```

Resposta esperada:

```json
{
  "status": "UP",
  "service": "lancarme-api",
  "version": "0.1.0"
}
```

### 4. Inicie o frontend

Em outro terminal:

```bash
cd lancarme-web
cp .env.example .env
npm install
npm run dev -- --port 5173
```

A aplicação ficará disponível em:

```txt
http://localhost:5173
```

---

## Variáveis de ambiente

### Frontend

Arquivo: `lancarme-web/.env`

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Backend

Arquivo: `lancarme-api/.env`

```env
SPRING_PROFILES_ACTIVE=local
DATABASE_URL=jdbc:postgresql://localhost:5432/lancarme
DATABASE_USERNAME=lancarme
DATABASE_PASSWORD=lancarme
```

Não versione arquivos `.env` reais ou qualquer segredo da aplicação.

---

## Testes e qualidade

### Frontend

```bash
cd lancarme-web

npm run lint
npm run typecheck
npm run test
npm run build
```

### Backend

```bash
cd lancarme-api

./mvnw test
```

A estratégia de qualidade do projeto inclui:

* testes unitários;
* testes de componentes;
* testes de integração;
* testes E2E para fluxos críticos;
* QA manual de responsividade, acessibilidade e percepção visual;
* testes de isolamento por workspace;
* testes de créditos de IA, billing e webhooks;
* validações de segurança e privacidade.

---

## API

A API utiliza rotas REST versionadas:

```txt
/api/v1
```

Endpoint público de disponibilidade:

```http
GET /api/v1/health
```

Exemplo de resposta:

```json
{
  "status": "UP",
  "service": "lancarme-api",
  "version": "0.1.0"
}
```

Os recursos privados da plataforma são projetados para exigir autenticação, autorização e validação de acesso ao workspace no backend.

---

## Segurança e privacidade

O Lançar.me é projetado para lidar com dados de campanhas, produtos, ofertas, clientes, alunos, arquivos, métricas, billing e uso de IA. Por isso, segurança e privacidade fazem parte da arquitetura central do produto.

Diretrizes principais:

* isolamento de dados por workspace;
* autenticação e autorização server-side;
* arquivos privados e acesso controlado;
* logs sem exposição de segredos;
* consumo de IA rastreável;
* billing e webhooks auditáveis;
* tratamento responsável de provas sociais;
* minimização de dados pessoais;
* preparação para direitos do titular previstos na LGPD.

---

## IA e créditos

A IA do Lançar.me é pensada como uma camada operacional guiada por ações, e não como um chat genérico.

Exemplos de ações assistidas:

* gerar plano de lançamento;
* reaproveitar um conteúdo em diferentes formatos;
* gerar copies para páginas, e-mails e anúncios;
* propor ângulos criativos;
* diagnosticar métricas;
* transformar provas sociais autorizadas em novos ativos;
* gerar relatórios pós-lançamento.

O consumo de IA é governado por créditos. Cada ação deve possuir custo conhecido, registro de execução, versão de prompt e validações adequadas. O sistema não trabalha com IA ilimitada e não deve produzir promessas de resultado financeiro garantido.

---

## Documentação

A documentação complementar do projeto está disponível em `docs/`, incluindo:

* visão do produto;
* arquitetura;
* segurança e LGPD;
* estratégia de QA;
* modelo de créditos de IA;
* diretrizes de API;
* padrões de código;
* infraestrutura e deploy.

As especificações detalhadas de funcionalidades ficam em `specs/`.

---

## Licença

Este projeto é proprietário. Todos os direitos reservados.

© Ademir dos Santos Junior — Lançar.me
