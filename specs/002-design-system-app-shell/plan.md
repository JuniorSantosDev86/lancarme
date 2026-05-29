# Implementation Plan: Design System & App Shell

**Branch**: `002-design-system-app-shell` | **Date**: 2026-05-28 | **Spec**: `specs/002-design-system-app-shell/spec.md`

---

## Summary

Construir a primeira shell visual profissional do Lançar.me, estabelecendo o
design system inicial e a estrutura principal da interface. O bloco entrega
sidebar, topbar, layout responsivo e o Command Center placeholder com dados
100% estáticos, sem autenticação real, workspace, banco de domínio, IA, billing
ou integrações externas.

A implementação parte do frontend existente do Bloco 1 — `lancarme-web` com
React 19, TypeScript, Vite 6, Tailwind CSS 3, TanStack Query, Vitest e React
Testing Library — e adiciona shadcn/ui (via CLI), Radix UI (instalado pelo
shadcn) e lucide-react. React Router DOM **não é instalado neste bloco**: não
há rotas de módulos futuros. Nenhuma alteração no backend.

A referência visual obrigatória é
`docs/design-references/bloco-02-command-center-approved.png`.

---

## Constitution Check

| Princípio | Status | Resposta do plano |
|-----------|--------|-------------------|
| Produto orientado a lançamentos | PASS | A shell cria a estrutura visual para os módulos de lançamento futuros; nenhum módulo de produto é antecipado. |
| Stack oficial e arquitetura modular | PASS | React + TypeScript + Vite + Tailwind + shadcn/ui + Radix UI, conforme AGENTS.md e constitution. |
| Segurança, LGPD e multi-tenancy | PASS | Nenhum dado real, autenticação, workspace ou dado sensível. Shell é puramente visual. |
| Backend como fonte de autoridade | PASS | O frontend neste bloco não toma decisões de negócio; healthcheck existente é preservado. |
| IA governada por gateway e créditos | PASS | Indicador de créditos de IA é estático/decorativo; nenhuma chamada real a IA. |
| Billing, webhooks e auditoria | PASS | Billing e webhooks ficam fora do escopo. |
| Arquivos privados e dados protegidos | PASS | Upload e storage ficam fora do escopo. |
| Qualidade, testes e clean code | PASS | Plano exige testes de componente com Vitest + RTL, lint, typecheck e build. |
| UI em PT-BR e experiência profissional | PASS | Todo texto da shell em PT-BR; percepção de SaaS premium orientada ao mockup aprovado. |
| Documentação viva e execução em blocos | PASS | Plano registra decisões técnicas, estrutura, testes, riscos e validações. |

Não há violações constitucionais. Nenhuma clarificação adicional pendente.

---

## Technical Context

**Language/Version**: TypeScript 5.8 / React 19 / Vite 6 (existentes no Bloco 1).

**Primary Dependencies (existentes)**:
Vite, React, TypeScript, Tailwind CSS 3, TanStack Query 5, Vitest 3,
React Testing Library 16, jsdom, ESLint.

**New Dependencies (a instalar neste bloco)**:

| Pacote | Versão recomendada | Motivo |
|--------|--------------------|--------|
| `lucide-react` | ^0.x latest | Ícones consistentes |
| `class-variance-authority` | ^0.7.x | Variantes de componentes (CVA) |
| `clsx` | ^2.x | Merge condicional de classes |
| `tailwind-merge` | ^2.x | Merge seguro de classes Tailwind |
| `@radix-ui/react-*` | latest (via shadcn) | Primitivas acessíveis |
| shadcn/ui CLI | latest | Geração dos componentes base em `components/ui/` |

**`react-router-dom` não é instalado neste bloco.** O Command Center é
renderizado diretamente pelo `App.tsx` sem roteador. Roteamento real será
introduzido quando o primeiro módulo de negócio for implementado (Bloco 4+),
junto com as rotas que de fato existirão. Instalar um roteador agora apenas
para criar rotas fictícias para módulos inexistentes anteciparia escopo sem
benefício funcional.

**Decisão shadcn/ui vs Radix UI puro**: shadcn/ui é a escolha correta para
React + Vite porque gera os componentes diretamente no repositório (sem lock de
biblioteca), usa Radix UI como primitiva de acessibilidade, integra nativamente
com Tailwind CSS e permite customização total. Os componentes ficam em
`components/ui/` e evoluem com o design system do produto.

**Não instalar**: Playwright (futuro), nenhuma biblioteca de gráficos real
(gráfico de desempenho será SVG/CSS estático ou skeleton visual), nenhuma lib
de animação pesada.

**Storage**: Sem alterações. PostgreSQL permanece via Docker Compose do Bloco 1.

**Backend**: Zero alterações funcionais. O endpoint `GET /api/v1/health`
existente é preservado. Nenhuma migration, nenhum controller, nenhum DTO novo.

**Testing**: Vitest + React Testing Library para testes de componente e layout.
Sem E2E neste bloco.

**Target Platform**: Desenvolvimento local em Linux, `http://localhost:5173`.

---

## Design System Decision

### Paleta de cores (tokens Tailwind a definir em `tailwind.config.ts`)

A paleta do Bloco 1 usava verde (`accent: #176b4d`) e fundo off-white esverdeado.
O Bloco 2 substitui os tokens visuais do produto por identidade azul premium.

| Token semântico | Valor hex | Uso |
|-----------------|-----------|-----|
| `brand` | `#1e40af` (blue-800) | Cor primária da marca |
| `brand-light` | `#3b82f6` (blue-500) | Hover, destaque, links |
| `brand-dark` | `#1e3a8a` (blue-900) | Sidebar fundo, itens pesados |
| `brand-surface` | `#eff6ff` (blue-50) | Fundo de card de destaque leve |
| `sidebar-bg` | `#1e3a8a` | Fundo da sidebar |
| `sidebar-text` | `#e0eaff` | Texto dos itens da sidebar |
| `sidebar-active` | `#2563eb` (blue-600) | Fundo do item ativo |
| `sidebar-hover` | `#1d4ed8` (blue-700) | Hover dos itens da sidebar |
| `surface` | `#f8fafc` (slate-50) | Fundo da área principal |
| `surface-card` | `#ffffff` | Fundo dos cards |
| `border` | `#e2e8f0` (slate-200) | Borda padrão dos cards |
| `ink` | `#0f172a` (slate-900) | Texto principal |
| `ink-muted` | `#64748b` (slate-500) | Texto secundário e labels |
| `success` | `#16a34a` (green-600) | Positivo, crescimento |
| `warning` | `#d97706` (amber-600) | Atenção |
| `danger` | `#dc2626` (red-600) | Erro, negativo |

> Os tokens do Bloco 1 (`field`, `accent verde`, `warning laranja`, `danger`) 
> serão substituídos pelos tokens azuis acima. O `App.tsx` do Bloco 1 que usa
> esses tokens antigos será reescrito como parte desta implementação.

### Tipografia

Fonte: **Inter** (já presente no `index.css` do Bloco 1, via stack de sistema).
Escala Tailwind padrão com hierarquia explícita:

| Nível | Classe Tailwind | Uso |
|-------|----------------|-----|
| Display | `text-2xl font-bold` | Título principal do Command Center |
| Heading | `text-xl font-semibold` | Título de seção |
| Subheading | `text-base font-semibold` | Título de card |
| Body | `text-sm` | Conteúdo geral |
| Caption | `text-xs text-ink-muted` | Labels, legendas, metadados |

### Componentes base shadcn/ui a instalar

Instalar apenas os necessários para este bloco:

- `button` — ações rápidas, botões de topbar
- `card` (Card, CardHeader, CardContent, CardFooter) — cards de métrica e painéis
- `badge` — status, tags
- `avatar` — avatar do usuário na topbar
- `separator` — divisores na sidebar
- `skeleton` — estado de loading de cards
- `tooltip` — labels nos ícones da topbar
- `sheet` — drawer mobile (Radix Dialog adaptado como sidebar drawer)

Não instalar: form, input, select, dialog, table, tabs, calendar ou qualquer
componente de formulário/dados — fora do escopo deste bloco.

### Tokens visuais de componentes

- `rounded-lg` para cards e containers
- `border border-slate-200` para bordas
- `shadow-sm` para elevação discreta de cards
- `ring-2 ring-blue-500 ring-offset-2` para focus visible
- Transição padrão: `transition-colors duration-150`

---

## Project Structure

### Documentação deste bloco

```text
specs/002-design-system-app-shell/
├── plan.md          ← este arquivo
├── spec.md          ← gerado antes deste plano
└── tasks.md         ← a gerar após este plano
```

### Estrutura de código esperada após a implementação

```text
lancarme-web/
├── package.json                        ← atualizado (novas deps)
├── tailwind.config.ts                  ← reescrito (tokens azuis)
├── src/
│   ├── app/
│   │   ├── main.tsx                    ← preservado (QueryClientProvider)
│   │   ├── App.tsx                     ← reescrito: AppShell + CommandCenterPage (sem roteador)
│   │   └── index.css                   ← atualizado (tokens CSS novos)
│   │
│   ├── components/
│   │   ├── ui/                         ← componentes shadcn/ui gerados
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── tooltip.tsx
│   │   │   └── sheet.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppShell.tsx            ← NOVO: container estrutural
│   │   │   ├── Sidebar.tsx             ← NOVO: sidebar desktop
│   │   │   ├── SidebarNav.tsx          ← NOVO: itens de navegação
│   │   │   ├── SidebarNavItem.tsx      ← NOVO: item individual
│   │   │   ├── Topbar.tsx              ← NOVO: barra superior
│   │   │   └── MobileDrawer.tsx        ← NOVO: drawer mobile
│   │   │
│   │   └── shared/
│   │       ├── MetricCard.tsx          ← NOVO: card de métrica demonstrativo
│   │       └── SectionHeader.tsx       ← NOVO: cabeçalho de seção reutilizável
│   │
│   ├── modules/
│   │   ├── command-center/             ← NOVO: módulo Command Center
│   │   │   ├── CommandCenterPage.tsx   ← NOVO: página principal
│   │   │   ├── components/
│   │   │   │   ├── WelcomeHeader.tsx   ← NOVO
│   │   │   │   ├── OverviewCards.tsx   ← NOVO
│   │   │   │   ├── NextActionsPanel.tsx← NOVO
│   │   │   │   ├── RecentActivity.tsx  ← NOVO
│   │   │   │   ├── AiCreditsCard.tsx   ← NOVO
│   │   │   │   ├── QuickActions.tsx    ← NOVO
│   │   │   │   ├── PerformanceChart.tsx← NOVO (estático/SVG)
│   │   │   │   └── LaunchProgress.tsx  ← NOVO
│   │   │   └── data/
│   │   │       └── mockData.ts         ← NOVO: dados hardcoded estáticos
│   │   │
│   │   ├── strategy/         ← placeholder (Bloco 6)
│   │   ├── launch/           ← placeholder (Bloco 11)
│   │   ├── content-matrix/   ← placeholder (Bloco 14)
│   │   ├── copy-room/        ← placeholder (Bloco 16)
│   │   ├── creative-room/    ← placeholder (Bloco 18)
│   │   ├── traffic-room/     ← placeholder (Bloco 21)
│   │   ├── funnel-map/       ← placeholder (Bloco 20)
│   │   ├── calendar-execution/← placeholder (Bloco 13)
│   │   ├── mentor-flow/      ← placeholder (Bloco 26)
│   │   ├── proof-vault/      ← placeholder (Bloco 24)
│   │   ├── analytics/        ← placeholder (Bloco 23)
│   │   ├── billing/          ← placeholder (Bloco 28)
│   │   └── ai/               ← placeholder (Bloco 9)
│   │
│   ├── hooks/
│   │   ├── useHealthStatus.ts          ← preservado do Bloco 1
│   │   └── useSidebar.ts               ← NOVO: estado aberto/fechado mobile
│   │
│   ├── services/
│   │   ├── apiClient.ts                ← preservado do Bloco 1
│   │   └── healthService.ts            ← preservado do Bloco 1
│   │
│   ├── types/
│   │   ├── health.ts                   ← preservado do Bloco 1
│   │   └── navigation.ts               ← NOVO: tipo NavItem (sem href/rota)
│   │
│   ├── schemas/               ← vazio (placeholder)
│   │
│   └── tests/
│       ├── setup.ts                    ← preservado do Bloco 1
│       ├── App.test.tsx                ← atualizado para nova shell
│       ├── healthService.test.ts       ← preservado do Bloco 1
│       ├── AppShell.test.tsx           ← NOVO
│       ├── Sidebar.test.tsx            ← NOVO
│       ├── Topbar.test.tsx             ← NOVO
│       ├── MobileDrawer.test.tsx       ← NOVO
│       └── CommandCenterPage.test.tsx  ← NOVO
```

---

## Technical Decisions

| Decisão | Justificativa | Alternativa rejeitada |
|---------|--------------|----------------------|
| Sem React Router DOM neste bloco | Não há rotas reais para criar. O Command Center é o único conteúdo ativo; instalar roteador agora apenas para gerar rotas fictícias anteciparia escopo sem benefício. O roteador será adicionado quando o primeiro módulo real for implementado. | Instalar React Router v6 já neste bloco foi rejeitado: criaria 15 rotas para módulos inexistentes, transformando placeholder visual em estrutura funcional prematura. |
| shadcn/ui via CLI | Gera componentes no repositório; sem lock de lib; Radix UI como primitiva de acessibilidade; integração nativa com Tailwind. | Radix UI puro exigiria mais boilerplate de estilização; Headless UI foi rejeitado por não ser a escolha do stack oficial. |
| Tokens azuis no tailwind.config.ts | Substituir paleta verde do Bloco 1 por identidade azul conforme aprovado na spec e no mockup. | Manter os tokens do Bloco 1 foi rejeitado porque conflitam com a identidade visual definida; usar apenas classes utilitárias Tailwind sem tokens semânticos foi rejeitado por dificultar consistência futura. |
| Sheet (Radix) para drawer mobile | Já incluso no shadcn; acessível por padrão; trata foco trap, ARIA e fechamento por Escape automaticamente. | Dialog customizado foi rejeitado por mais complexidade; menu dropdown foi rejeitado por não representar navegação. |
| Dados mockados em `mockData.ts` dentro do módulo | Isola os dados demonstrativos do componente; facilita substituição futura por chamada de API real sem alterar JSX. | Inline hardcoded no JSX foi rejeitado por dificultar manutenção; arquivo global de mocks foi rejeitado por criar acoplamento. |
| Gráfico de desempenho como SVG/CSS estático | Sem dependência de biblioteca de gráficos neste bloco; evita peso desnecessário; visual fiel ao mockup. | Recharts/Victory foi rejeitado por escopo prematuro; placeholder de texto simples foi rejeitado por não seguir o mockup. |
| `useSidebar` hook para estado mobile | Mantém lógica de abrir/fechar fora dos componentes de apresentação; testável de forma isolada. | Estado local no AppShell foi rejeitado por dificultar teste e reutilização. |
| `App.tsx` reescrito (não adaptado) | O App.tsx do Bloco 1 era tela técnica de status; precisa ser completamente substituído pela App Shell com o Command Center como conteúdo fixo. Sem roteador. Os testes existentes (`App.test.tsx`) são adaptados para cobrir a nova estrutura. | Tentar adaptar o App.tsx antigo foi rejeitado por gerar componente híbrido confuso. |
| Itens futuros da sidebar como elementos visuais inativos (sem `<a>` ou `<Link>`) | Sem roteador e sem páginas correspondentes, os itens não podem ser links reais. Renderizar como `<span>` ou `<div>` com `aria-disabled` e cursor adequado é correto e honesto. | Usar `<a href="#">` ou `<button onClick={noop}>` foi rejeitado por criar interatividade enganosa; omitir os itens da sidebar foi rejeitado por perder fidelidade ao mockup. |

---

## Routing Strategy

**Neste bloco não há roteador e não há rotas.**

O `App.tsx` renderiza diretamente a `AppShell` com `CommandCenterPage` como
conteúdo fixo. Não existe `router.tsx`, não existe `createBrowserRouter`, não
existe `Outlet`, não existe `react-router-dom`.

Os itens de módulos futuros na sidebar são elementos visuais inativos (`<span>`
ou `<div>` com `aria-disabled="true"`), sem `href`, sem `to` e sem handler de
clique real. Ao focar ou interagir com eles, nenhuma navegação ocorre.

Roteamento real será introduzido no bloco em que o primeiro módulo de negócio
for implementado, junto com as rotas que de fato existirão naquele momento.

---

## App Shell Architecture

### AppShell

Componente de layout raiz. Renderiza:
- `<Sidebar>` (desktop, `hidden lg:flex`)
- `<MobileDrawer>` (mobile, controlado por `useSidebar`)
- `<Topbar>` (sempre visível)
- `<main>` com `{children}` (prop React padrão — sem Outlet, sem roteador)

Semântica HTML:
- `<div>` container raiz com `flex h-screen overflow-hidden`
- `<nav>` para sidebar e drawer
- `<header>` para topbar
- `<main>` para área de conteúdo

### Sidebar

Visível apenas em `lg:` (≥1024px). Fundo `sidebar-bg` (#1e3a8a).

Estrutura:
1. Logo + nome do produto (topo)
2. Itens de navegação agrupados:
   - **Visão geral**: Command Center
   - **Estratégia e Lançamento**: Strategy Core, Launch Strategy Room
   - **Conteúdo**: ConteúdoMatriz, Copy Room, Creative Room
   - **Tráfego e Funil**: Traffic Room, Funnel Map
   - **Execução**: Calendar & Execution, MentorFlow
   - **Ativos**: Proof Vault, Analytics & AI Diagnosis
   - **Sistema**: AI Agents, Billing & Credits, Configurações
3. Rodapé da sidebar: avatar + nome estático do usuário

Cada item: ícone Lucide + label em PT-BR + indicador ativo.
Item ativo: `bg-sidebar-active rounded-md`.
Hover: `bg-sidebar-hover`.

### SidebarNavItem

```tsx
interface NavItem {
  label: string;           // PT-BR
  icon: LucideIcon;
  active?: boolean;        // true apenas para Command Center neste bloco
  comingSoon?: boolean;    // true para todos os módulos futuros
}
```

Itens com `comingSoon: true` são renderizados como `<div>` ou `<span>` com
`aria-disabled="true"`, opacidade reduzida (`opacity-50`) e cursor de espera
(`cursor-not-allowed`). Não são `<a>`, não são `<button>`, não possuem handler
de clique. Não navegam para lugar nenhum.

### Topbar

Fundo branco, `border-b border-border`. Conteúdo:
- Esquerda: botão hamburguer (visível apenas em `< lg`, `aria-label="Abrir menu"`)
- Centro/direita: ícone de busca, badge de créditos de IA (estático), ícone de
  notificações, avatar + nome do usuário (estáticos)

### MobileDrawer

Usa `Sheet` do shadcn/ui (Radix Dialog). Abre pela esquerda.
Conteúdo idêntico à Sidebar.
Overlay escurecido. Fecha por: botão fechar, overlay, tecla Escape.
`aria-label` no botão de abertura e fechamento.

---

## Command Center Placeholder

### WelcomeHeader

```
Olá, Gabriel! 👋
Aqui está o resumo do seu lançamento.
28 de mai. de 2026
```

Nome, data e saudação são valores estáticos de `mockData.ts`.

### OverviewCards (grid 2×2 em mobile, 4×1 em desktop)

Dados demonstrativos do `mockData.ts`. Uma indicação discreta — por exemplo,
badge ou rótulo pequeno "Dados demonstrativos" — deve estar visível na área
dos cards ou no cabeçalho da seção, sem poluir o layout.

| Card | Valor | Variação |
|------|-------|---------|
| Receita | R$ 127.450,00 | +12% |
| Leads | 2.842 | +8% |
| Vendas | 148 | +5% |
| ROAS | 3,21 | +0,4 |

### NextActionsPanel

Lista demonstrativa de 3–5 ações com status (pendente/em andamento/concluído)
e datas fictícias. Botão "Ver todas" visualmente presente, mas `aria-disabled`
e sem ação real. Identificação discreta de conteúdo demonstrativo na seção.

### RecentActivity

Lista estática de 4–6 eventos recentes com ícone, descrição e timestamp
relativo fictício ("há 2 horas").

### AiCreditsCard

Créditos disponíveis: 432 (demonstrativo). Barra de progresso visual estática.
Botão "Gerenciar" visualmente presente, mas `aria-disabled` e sem ação real.

### QuickActions

4 botões de ação rápida visual (desabilitados ou com `aria-disabled`):
- Criar copy com IA
- Gerar criativo
- Diagnóstico de tráfego
- Plano de lançamento

### PerformanceChart

Gráfico de linha simplificado implementado como SVG estático (path de curva
representando tendência de crescimento dos últimos 7/30/90 dias). Sem lib
externa. Tabs de período (7d / 30d / 90d) são botões visuais estáticos —
podem alterar estado local para mostrar opção ativa, mas sem dados reais.

### LaunchProgress

Barra de progresso circular ou linear mostrando 68% (estático).
Nome do lançamento: "Lançamento Maio 2026" (estático).
Fases: Pré-lançamento, Lançamento, Pós-lançamento (visual estático).

---

## Healthcheck Integration

O `useHealthStatus` e os serviços do Bloco 1 são **preservados sem alteração**.

A nova shell não exibe o widget de status da API no Command Center como painel
principal. O Command Center é a visão do produto, não a tela técnica.

Decisão: o status da API permanece disponível tecnicamente (o hook existe) mas
**não é renderizado no Command Center placeholder**. A tela técnica do Bloco 1
(`App.tsx` antigo) é substituída pela shell. Os testes de `healthService.test.ts`
são preservados sem alteração. Os testes de `App.test.tsx` são atualizados para
cobrir a nova estrutura da shell.

Se em algum momento o status técnico precisar ser visível, pode ser adicionado
discretamente no rodapé da sidebar ou em uma rota `/status` — mas **não** como
parte do Command Center placeholder neste bloco.

---

## Responsiveness Plan

| Breakpoint | Sidebar | Topbar | Grid do Command Center |
|------------|---------|--------|------------------------|
| `< sm` (< 640px) | Oculta → drawer | Compacta, hamburguer visível | Cards empilhados (1 coluna) |
| `sm` (640–767px) | Oculta → drawer | Hamburguer visível | Cards 2 colunas |
| `md` (768–1023px) | Oculta → drawer | Hamburguer visível | Cards 2 colunas, painéis reorganizados |
| `lg` (1024–1279px) | Fixa, expandida | Hamburguer oculto | Cards 4 colunas, layout full |
| `xl` (≥1280px) | Fixa, expandida | Hamburguer oculto | Layout mais espaçado |

Layout do Command Center em `lg+`:
- Coluna principal (esquerda, ~65%): OverviewCards + NextActions + Performance
- Coluna lateral (direita, ~35%): RecentActivity + AiCredits + QuickActions + LaunchProgress

Em `< lg`: colunas empilhadas verticalmente.

---

## Accessibility Plan

| Requisito | Implementação |
|-----------|--------------|
| Landmarks semânticos | `<nav>`, `<header>`, `<main>`, `<aside>` (painel lateral Command Center) |
| Botão hamburguer | `aria-label="Abrir menu de navegação"` / `"Fechar menu de navegação"` |
| Drawer mobile | Sheet/Dialog com `aria-modal`, focus trap e fechar por Escape (Radix) |
| Item ativo na sidebar | `aria-current="page"` somente no item Command Center (único ativo neste bloco) |
| Cards desabilitados (ações rápidas) | `aria-disabled="true"` em vez de `disabled` em divs; cursor not-allowed |
| Foco visível | `focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2` em todos os interativos |
| Contraste | Sidebar: texto `#e0eaff` sobre fundo `#1e3a8a` (≥ 7:1 AA). Cards: `#0f172a` sobre `#ffffff` (≥ 16:1). Texto muted: `#64748b` sobre `#ffffff` (≥ 4.6:1 AA). |
| Imagens decorativas | SVG do gráfico com `aria-hidden="true"` |
| Textos de loading | Skeletons com `aria-busy="true"` no container durante loading |

---

## Testing Strategy

### Ferramentas

- **Vitest 3** + **React Testing Library 16**
- `jsdom` como ambiente de teste
- `@testing-library/user-event` para interações

### Mocks necessários

- `window.matchMedia`: necessário para testar responsividade/breakpoints
- `ResizeObserver`: pode ser necessário para Radix Sheet
- `vi.stubGlobal('fetch', ...)`: já usado nos testes do Bloco 1 — preservar

### Cobertura mínima obrigatória

| Arquivo de teste | Cenários obrigatórios |
|-----------------|----------------------|
| `AppShell.test.tsx` | Renderiza sidebar, topbar e área de conteúdo; renderiza `<nav>`, `<header>`, `<main>`; identidade "Lançar.me" presente |
| `Sidebar.test.tsx` | Renderiza todos os grupos de navegação; renderiza todos os itens com labels PT-BR; item "Command Center" com `aria-current="page"`; demais itens com `aria-disabled="true"` e sem href |
| `Topbar.test.tsx` | Renderiza botão hamburguer com `aria-label` correto; botão visível apenas em mobile (mock de breakpoint); campos de topbar estáticos presentes |
| `MobileDrawer.test.tsx` | Drawer fechado por padrão; clique no hamburguer abre drawer; clique no overlay fecha drawer; tecla Escape fecha drawer |
| `CommandCenterPage.test.tsx` | Renderiza saudação; renderiza cards OverviewCards com labels PT-BR; renderiza "Próximas ações"; renderiza "Atividade recente"; renderiza "Créditos de IA"; renderiza "Progresso do lançamento"; renderiza identificação de dados demonstrativos |
| `App.test.tsx` (atualizado) | Renderiza identidade "Lançar.me"; renderiza sidebar; renderiza topbar; renderiza Command Center; sem `react-router-dom` no bundle; não quebra testes existentes sobre o healthcheck |

### Preservação obrigatória

- `healthService.test.ts`: **sem alteração**
- `App.test.tsx`: adaptar os testes existentes à nova estrutura sem remover cobertura do healthcheck que ainda for aplicável

---

## Validation Commands

```bash
# frontend — todos obrigatórios antes de fechar o bloco
cd lancarme-web && npm run lint
cd lancarme-web && npm run typecheck
cd lancarme-web && npm run test
cd lancarme-web && npm run build

# backend — regressão apenas (sem alteração funcional)
cd lancarme-api && ./mvnw test
```

Nenhuma alteração backend. O teste `./mvnw test` é executado apenas para
confirmar que não houve regressão acidental.

---

## Acceptance Criteria (Technical)

- [ ] `npm run lint` passa sem erros
- [ ] `npm run typecheck` passa sem erros (sem `any` não justificado)
- [ ] `npm run test` — todos os testes novos e preservados passam
- [ ] `npm run build` — build de produção completo sem erros
- [ ] `./mvnw test` — todos os testes backend preservados passam
- [ ] Shell renderiza sidebar, topbar e conteúdo em desktop sem erro de console
- [ ] Sidebar em mobile/tablet está oculta; hamburguer abre drawer
- [ ] Command Center exibe todos os blocos demonstrativos do mockup em PT-BR, com identificação de dados demonstrativos
- [ ] Itens de módulos futuros na sidebar são visuais e inativos — sem rotas, sem navegação, sem páginas correspondentes
- [ ] `react-router-dom` **não está** no `package.json`
- [ ] Nenhum `console.error` de `aria-*` inválido ou prop React desconhecida
- [ ] Nenhuma chamada de API de domínio no Network tab do browser
- [ ] Healthcheck (`GET /api/v1/health`) preservado: hook existe, serviço existe, testes passam
- [ ] Nenhum dado real, autenticação ou lógica de domínio implementada

---

## Security & LGPD Impact

- Nenhum dado real de usuário. Todos os nomes, métricas e valores são estáticos.
- Nenhuma chamada de API de domínio. Sem risco de exposição de dados.
- Nenhum token, chave ou secret no frontend.
- O status do healthcheck não é exposto na UI principal (Command Center).
- Componentes desabilitados usam `aria-disabled` e não envolvem ação real.
- LGPD: não aplicável neste bloco (sem dados pessoais, sem autenticação, sem workspace).

---

## Risks

| ID | Risco | Impacto | Probabilidade | Mitigação |
|----|-------|---------|--------------|-----------|
| R-01 | Componentes monolíticos (AppShell gigante) | Alto | Média | Estrutura de arquivos explícita no plano; tasks com granularidade por componente |
| R-02 | Tokens do Bloco 1 (verde) quebram UI nova (azul) | Alto | Alta | `tailwind.config.ts` e `index.css` são reescritos na primeira fase; testes visuais manuais antes de fechar |
| R-03 | Testes de responsividade frágeis com jsdom | Médio | Alta | Usar mock de `window.matchMedia`; aceitar cobertura parcial; validar manualmente nos breakpoints |
| R-04 | shadcn CLI gera arquivos fora da estrutura esperada | Médio | Baixa | Rodar CLI apontando para `src/components/ui/`; revisar paths gerados antes de continuar |
| R-05 | App.test.tsx atualizado quebra cobertura do Bloco 1 | Médio | Média | Preservar todos os cenários de healthcheck que ainda forem aplicáveis; adaptar apenas o que mudar de estrutura |
| R-06 | Gráfico SVG estático não fiel ao mockup | Baixo | Média | Aceitar aproximação visual; o mockup é referência, não pixel-perfect |
| R-07 | Dependências desnecessárias instaladas | Médio | Baixa | Lista de pacotes explícita no plano; não instalar o que não está listado |
| R-08 | App.tsx reescrito não renderiza Command Center corretamente | Alto | Baixa | `App.test.tsx` verifica explicitamente presença da saudação e dos cards principais; sem roteador, não há ponto de falha de roteamento |
| R-09 | Contraste insuficiente na sidebar azul | Médio | Média | Validar ratio manualmente; tokens definidos acima já calculados para WCAG AA |

---

## Documentation Impact

| Documento | Ação |
|-----------|------|
| `AGENTS.md` | Já atualizado: referência ao `plan.md` do Bloco 2 entre marcadores SPECKIT |
| `README.md` | Atualizar: mencionar que o Bloco 2 entregou a shell visual; direção de identidade azul; dados do Command Center são estáticos |
| `docs/architecture.md` | Confirmar que a estrutura `lancarme-web/src/` implementada reflete a seção 5; sem alterações de conteúdo esperadas |
| `specs/002-design-system-app-shell/tasks.md` | Criar como próximo artefato |

---

## Phase 0 Output

Nenhuma pesquisa exploratória necessária. Stack e bibliotecas são definidos na
constitution e no AGENTS.md. O mockup aprovado é a referência visual.

## Phase 1 Output

- `specs/002-design-system-app-shell/plan.md` (este arquivo)

## Post-Design Constitution Check

**PASS**. O plano preserva escopo, stack oficial, PT-BR, acessibilidade básica,
testes mínimos e documentação. Nenhuma funcionalidade real de negócio,
autenticação, workspace, IA ou billing foi incluída. Os dados do Command Center
são 100% estáticos. O healthcheck do Bloco 1 é preservado. Nenhum princípio
da constitution foi violado ou comprometido.
