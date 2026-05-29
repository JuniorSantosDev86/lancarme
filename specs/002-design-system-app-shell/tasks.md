# Tasks: Design System & App Shell

**Input**: Design documents from `specs/002-design-system-app-shell/`

**Prerequisites**: `plan.md`, `spec.md`, `.specify/memory/constitution.md`, `AGENTS.md`,
`docs/architecture.md`, `docs/product-vision.md`, `docs/qa-strategy.md`,
`docs/security-lgpd.md`, `docs/clean-code-standards.md`, `docs/roadmap-operacional.md`,
`specs/001-platform-foundation/tasks.md`, `docs/design-references/bloco-02-command-center-approved.png`

**Referência visual obrigatória**: `docs/design-references/bloco-02-command-center-approved.png`

**Tests**: Exigidos pela spec (CA-13), constitution (VIII) e AGENTS.md (§12).
Testes devem ser escritos antes ou junto da implementação do comportamento correspondente.

**Backend**: Nenhuma alteração funcional. O `lancarme-api` deve permanecer intocado neste bloco.
Qualquer toque acidental em arquivo backend exige justificativa e revisão antes de aprovação.

**Fora do escopo absoluto**:
- `react-router-dom` — não instalar, não configurar, não referenciar
- Rotas para módulos futuros
- Páginas placeholder de módulos inexistentes
- Auth, sessão, RBAC, workspace real
- IA real, créditos reais, métricas reais, billing
- Chamadas de API de domínio (além do healthcheck existente, que é preservado sem alteração)
- Upload, integrações externas, gráficos com dados reais
- Persistência de qualquer dado demonstrativo

---

## Formato

- **[P]**: Paralelizável — toca arquivos independentes e não depende de task incompleta
- **[US]**: User Story de referência da spec
- Cada task informa os caminhos dos arquivos criados ou alterados
- Tasks de teste aparecem antes ou junto das tasks de implementação correspondentes

---

## Fase 1 — Preparação e Auditoria da Fundação (Bloqueante)

**Propósito**: Verificar o estado real do Bloco 1, confirmar que nada será quebrado e registrar
o que será preservado, adaptado ou substituído antes de qualquer novo arquivo ser criado.

**Crítico**: Completar esta fase antes de qualquer implementação.

- [x] T001 Ler `lancarme-web/src/app/App.tsx`, `lancarme-web/src/app/main.tsx` e
  `lancarme-web/src/app/index.css` e registrar o que cada arquivo faz atualmente,
  quais tokens visuais estão presentes (classes Tailwind, variáveis CSS) e quais
  desses arquivos serão reescritos, adaptados ou preservados no Bloco 2  
  _Arquivos lidos_: `lancarme-web/src/app/App.tsx`, `lancarme-web/src/app/main.tsx`,
  `lancarme-web/src/app/index.css`

- [x] T002 [P] Ler `lancarme-web/src/tests/App.test.tsx` e
  `lancarme-web/src/tests/healthService.test.ts` e registrar todos os cenários de
  teste existentes, quais assertions fazem referência ao `App.tsx` atual e quais
  precisarão ser adaptados quando o `App.tsx` for reescrito para a nova shell  
  _Arquivos lidos_: `lancarme-web/src/tests/App.test.tsx`,
  `lancarme-web/src/tests/healthService.test.ts`

- [x] T003 [P] Ler `lancarme-web/src/hooks/useHealthStatus.ts`,
  `lancarme-web/src/services/healthService.ts`, `lancarme-web/src/services/apiClient.ts`
  e `lancarme-web/src/types/health.ts` e confirmar que nenhum desses arquivos precisa
  de alteração funcional no Bloco 2; registrar se algum uso de tipo ou import pode
  conflitar com a nova estrutura  
  _Arquivos lidos_: `lancarme-web/src/hooks/useHealthStatus.ts`,
  `lancarme-web/src/services/healthService.ts`, `lancarme-web/src/services/apiClient.ts`,
  `lancarme-web/src/types/health.ts`

- [x] T004 [P] Ler `lancarme-web/package.json`, `lancarme-web/tailwind.config.ts` e
  `lancarme-web/tsconfig.json` e confirmar:
  - ausência de `react-router-dom` (e que não deve ser adicionado);
  - ausência de `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
    e pacotes Radix UI (que serão instalados neste bloco);
  - compatibilidade de versão entre Tailwind CSS 3, Vite 6 e React 19 para shadcn/ui  
  _Arquivos lidos_: `lancarme-web/package.json`, `lancarme-web/tailwind.config.ts`,
  `lancarme-web/tsconfig.json`

- [x] T005 Ler `lancarme-web/src/tests/setup.ts` e `lancarme-web/vitest.config.ts`
  e confirmar que o ambiente de testes está configurado com `jsdom`, que
  `@testing-library/jest-dom` está disponível e que não há conflito com os novos
  testes a criar  
  _Arquivos lidos_: `lancarme-web/src/tests/setup.ts`, `lancarme-web/vitest.config.ts`

- [x] T006 Registrar explicitamente a decisão: `react-router-dom` **não será instalado**
  neste bloco. O `App.tsx` renderizará diretamente `<AppShell>` com `<CommandCenterPage>`
  como conteúdo fixo, sem roteador, sem `Outlet`, sem `createBrowserRouter`.
  Essa decisão será referenciada no relatório final e na documentação.  
  _Sem arquivos alterados nesta task; decisão registrada como pré-condição documentada_

**Checkpoint**: Estado do Bloco 1 mapeado, dependências auditadas, decisão sobre ausência de
roteador confirmada. Nenhum arquivo de aplicação foi alterado ainda.

---

## Fase 2 — Dependências e Configuração Base (Bloqueante)

**Propósito**: Instalar as novas dependências necessárias, reescrever os tokens visuais do
Tailwind e configurar o `index.css` com as variáveis CSS da identidade azul do Lançar.me.

**Crítico**: Completar esta fase antes de criar qualquer componente.

- [x] T007 Instalar as novas dependências do Bloco 2 no `lancarme-web/`:
  ```
  npm install lucide-react clsx tailwind-merge class-variance-authority
  ```
  Confirmar que `react-router-dom` **não foi instalado**. Confirmar versões no
  `package.json` após a instalação.  
  _Arquivo alterado_: `lancarme-web/package.json`, `lancarme-web/package-lock.json`

- [x] T008 Inicializar o shadcn/ui via CLI no `lancarme-web/`:
  ```
  npx shadcn@latest init
  ```
  Configurar com: estilo `default`, cor base `slate`, CSS variables ativadas,
  alias de imports `@/components`, `@/lib` e `@/hooks`. Confirmar que o CLI gera
  `lancarme-web/components.json` e `lancarme-web/src/lib/utils.ts` (com a função `cn`).
  Confirmar que nenhum `react-router-dom` foi adicionado como dependência transitiva.  
  _Arquivos criados_: `lancarme-web/components.json`, `lancarme-web/src/lib/utils.ts`  
  _Arquivos atualizados_: `lancarme-web/package.json`, `lancarme-web/tailwind.config.ts`

- [x] T008-A Configurar explicitamente o alias `@/` no Vite e no TypeScript após a
  inicialização do shadcn/ui. O CLI do shadcn pode ou não ter configurado o alias
  corretamente — esta task garante que ele esteja presente e funcional:

  Em `lancarme-web/vite.config.ts`, adicionar (ou confirmar presença de):
  ```ts
  import path from 'path'
  // ...
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  }
  ```

  Em `lancarme-web/tsconfig.json`, adicionar (ou confirmar presença de):
  ```json
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
  ```

  Confirmar que `npm run typecheck` e `npm run build` resolvem `@/` sem erro.
  Se o projeto utilizar `tsconfig.node.json`, verificar se este arquivo também
  precisa de ajuste (normalmente não — apenas o `tsconfig.json` principal).  
  _Arquivos potencialmente atualizados_: `lancarme-web/vite.config.ts`,
  `lancarme-web/tsconfig.json`

- [x] T009 Instalar os componentes shadcn/ui necessários para este bloco:
  ```
  npx shadcn@latest add button card badge avatar separator sheet
  ```
  Componentes incluídos e justificativa de uso:
  - `button` — ações rápidas (disabled), fechar drawer, hambúrguer
  - `card` — MetricCard e painéis do Command Center
  - `badge` — identificação demonstrativa, status de itens, badge de créditos na topbar
  - `avatar` — avatar do usuário na topbar e na sidebar
  - `separator` — divisor entre grupos de navegação na sidebar
  - `sheet` — drawer mobile

  Componentes **não instalados** e motivo:
  - `skeleton` — não há estados de loading planejados neste bloco (healthcheck usa
    lógica própria sem Skeleton shadcn; se necessário no `ApiStatusIndicator`, avaliar
    na task T017-A antes de adicionar)
  - `tooltip` — não há elemento interativo real que requeira tooltip explicativo;
    ícones decorativos inativos não devem usar tooltip para mascarar sua inatividade

  Confirmar que os 6 componentes foram gerados em `lancarme-web/src/components/ui/`.
  Confirmar que nenhum componente de formulário, input, dialog, table, tabs ou tooltip
  foi adicionado.  
  _Arquivos criados_: `lancarme-web/src/components/ui/button.tsx`,
  `lancarme-web/src/components/ui/card.tsx`, `lancarme-web/src/components/ui/badge.tsx`,
  `lancarme-web/src/components/ui/avatar.tsx`, `lancarme-web/src/components/ui/separator.tsx`,
  `lancarme-web/src/components/ui/sheet.tsx`

- [x] T010 Reescrever `lancarme-web/tailwind.config.ts` para definir os tokens semânticos
  da identidade azul do Lançar.me:

  | Token | Valor hex | Uso |
  |---|---|---|
  | `brand` | `#1e40af` | Cor primária |
  | `brand-light` | `#3b82f6` | Hover, destaque |
  | `brand-dark` | `#1e3a8a` | Sidebar fundo |
  | `brand-surface` | `#eff6ff` | Fundo de card de destaque leve |
  | `sidebar-bg` | `#1e3a8a` | Fundo da sidebar |
  | `sidebar-text` | `#e0eaff` | Texto da sidebar |
  | `sidebar-active` | `#2563eb` | Fundo do item ativo |
  | `sidebar-hover` | `#1d4ed8` | Hover dos itens |
  | `surface` | `#f8fafc` | Fundo da área principal |
  | `surface-card` | `#ffffff` | Fundo dos cards |
  | `border` | `#e2e8f0` | Borda padrão dos cards |
  | `ink` | `#0f172a` | Texto principal |
  | `ink-muted` | `#64748b` | Texto secundário |
  | `success` | `#16a34a` | Positivo |
  | `warning` | `#d97706` | Atenção |
  | `danger` | `#dc2626` | Erro |

  Incluir configuração de font-family com `Inter` como primeira opção (stack
  sans-serif do sistema como fallback). Incluir `content` apontando para
  `./src/**/*.{ts,tsx}`.  
  _Arquivo reescrito_: `lancarme-web/tailwind.config.ts`

- [x] T011 Atualizar `lancarme-web/src/app/index.css` para:
  - Remover variáveis CSS do Bloco 1 que conflitem com a identidade azul
    (ex.: `accent` verde, `warning` laranja antigo);
  - Adicionar variáveis CSS para os tokens semânticos (como `--color-brand`,
    `--color-sidebar-bg`, etc.), se o shadcn init não tiver gerado;
  - Garantir que o `@tailwind base`, `@tailwind components` e `@tailwind utilities`
    estejam presentes e na ordem correta;
  - Adicionar `focus-visible:ring` global para foco visível consistente
    (`ring-2 ring-blue-500 ring-offset-2`).  
  _Arquivo atualizado_: `lancarme-web/src/app/index.css`

**Checkpoint**: Todas as dependências instaladas, shadcn/ui configurado, tokens Tailwind azuis
em vigor. Nenhum componente de aplicação criado ainda.

---

## Fase 3 — Tipos e Dados de Navegação (Bloqueante)

**Propósito**: Definir o tipo `NavItem` e os dados mock do Command Center antes de criar
os componentes que os consomem.

- [x] T012 Criar `lancarme-web/src/types/navigation.ts` com o tipo `NavItem`:
  ```ts
  interface NavItem {
    id: string;
    label: string;        // PT-BR
    icon: LucideIcon;
    active?: boolean;     // true somente para Command Center neste bloco
    comingSoon?: boolean; // true para todos os módulos futuros
    group: string;        // agrupamento visual na sidebar
  }
  ```
  Esse tipo **não inclui `href`, `to`, `path` ou qualquer referência de rota**,
  porque não há roteamento neste bloco.  
  _Arquivo criado_: `lancarme-web/src/types/navigation.ts`

- [x] T013 Criar `lancarme-web/src/modules/command-center/data/mockData.ts` com todos os
  dados estáticos do Command Center:
  - Saudação: `{ name: 'Gabriel', date: '28 de mai. de 2026' }`
  - Cards de visão geral: Receita `R$ 127.450,00` (+12%), Leads `2.842` (+8%),
    Vendas `148` (+5%), ROAS `3,21` (+0,4)
  - Próximas ações: lista de 4 itens com `id`, `title`, `status`
    (`'pendente' | 'em_andamento' | 'concluido'`), `dueDate`
  - Atividade recente: lista de 5 eventos com `id`, `description`, `timestamp`
    relativo estático, `icon`
  - Créditos de IA: `{ available: 432, total: 1000 }` (demonstrativo)
  - Ações rápidas: lista de 4 itens com `id`, `label`, `icon`
  - Progresso do lançamento: `{ name: 'Lançamento Maio 2026', percent: 68 }`
  - Identificação: `demoLabel: 'Dados demonstrativos'` (rótulo global da página)

  Todos os valores são `const` hardcoded. Nenhuma lógica de domínio.
  Sem export default — usar named exports.  
  _Arquivo criado_: `lancarme-web/src/modules/command-center/data/mockData.ts`

**Checkpoint**: Tipos e dados mock definidos. Componentes podem importá-los sem circular dependency.

---

## Fase 4 — Hook `useSidebar` (Bloqueante)

**Propósito**: Criar o hook de estado do drawer mobile antes dos componentes de layout que
o consomem.

- [x] T014 Criar teste para `useSidebar` em `lancarme-web/src/tests/useSidebar.test.ts`
  cobrindo:
  - estado inicial: `isOpen === false`
  - `open()` altera `isOpen` para `true`
  - `close()` altera `isOpen` para `false`
  - `toggle()` alterna entre `true` e `false`  
  _Arquivo criado_: `lancarme-web/src/tests/useSidebar.test.ts`

- [x] T015 Criar `lancarme-web/src/hooks/useSidebar.ts` com o hook `useSidebar`
  que retorna `{ isOpen, open, close, toggle }`. Nenhuma lógica de rota ou navegação.
  Apenas estado booleano com `useState`.  
  _Arquivo criado_: `lancarme-web/src/hooks/useSidebar.ts`

**Checkpoint**: Hook testado e disponível para os componentes de layout.

---

## Fase 5 — Componentes Compartilhados (Paralelizável após Fase 2)

**Propósito**: Criar os componentes base reutilizáveis que serão usados tanto no
Command Center quanto na shell.

- [x] T016 [P] Criar `lancarme-web/src/components/shared/SectionHeader.tsx`:
  - Props: `title: string`, `subtitle?: string`, `action?: React.ReactNode`
  - Renderiza `<h2>` com classe `text-xl font-semibold text-ink`
  - Renderiza subtítulo opcional em `text-sm text-ink-muted`
  - Renderiza action opcional à direita
  - Sem lógica de negócio  
  _Arquivo criado_: `lancarme-web/src/components/shared/SectionHeader.tsx`

- [x] T017 [P] Criar `lancarme-web/src/components/shared/MetricCard.tsx`:
  - Props: `label: string`, `value: string`, `change?: string`,
    `changeType?: 'positive' | 'negative' | 'neutral'`, `icon?: LucideIcon`
  - Renderiza usando o componente `Card` do shadcn/ui
  - Aplica cor verde para `positive`, vermelho para `negative`, cinza para `neutral`
  - Sem lógica de cálculo — apenas apresentação
  - Usar `text-success`, `text-danger`, `text-ink-muted` conforme tokens definidos  
  _Arquivo criado_: `lancarme-web/src/components/shared/MetricCard.tsx`

- [x] T017-A [P] Criar `lancarme-web/src/components/shared/ApiStatusIndicator.tsx`:
  - Consome `useHealthStatus` de `lancarme-web/src/hooks/useHealthStatus.ts`
    **sem alteração no hook, serviço, cliente ou tipos existentes**
  - Renderiza um badge discreto com três estados visuais:
    - Loading / consultando: ícone animado ou texto "Consultando API"
      com cor neutra (`text-ink-muted`)
    - Operacional: ponto verde + texto "API operacional"
      com cor `text-success`
    - Indisponível: ponto vermelho + texto "API indisponível"
      com cor `text-danger`
  - Visual: badge pequeno e discreto, adequado para posicionamento na topbar
  - Sem props de configuração — lê o estado diretamente do hook
  - Não usar `Skeleton` do shadcn/ui; usar classes Tailwind para estado de loading
  - Não criar endpoint novo; não alterar contrato backend  
  _Arquivo criado_: `lancarme-web/src/components/shared/ApiStatusIndicator.tsx`

- [x] T017-B [P] Criar testes para `ApiStatusIndicator` em
  `lancarme-web/src/tests/ApiStatusIndicator.test.tsx`:
  - Mock de `useHealthStatus` retornando estado de loading:
    renderiza indicador de "consultando"
  - Mock de `useHealthStatus` retornando status operacional:
    renderiza "API operacional"
  - Mock de `useHealthStatus` retornando status de erro:
    renderiza "API indisponível"
  - O componente não dispara chamada de API própria; a chamada é do hook (já testado)  
  _Arquivo criado_: `lancarme-web/src/tests/ApiStatusIndicator.test.tsx`

**Checkpoint**: Componentes compartilhados disponíveis para uso no Command Center e na shell,
incluindo o indicador de status da API que preserva a funcionalidade visual do Bloco 1.

---

## Fase 6 — Componentes de Layout da App Shell (Bloqueante, após Fases 2–4)

**Propósito**: Construir os componentes estruturais da shell — `SidebarNavItem`, `SidebarNav`,
`Sidebar`, `Topbar`, `MobileDrawer` e `AppShell` — na ordem correta de dependência.

### 6.1 — SidebarNavItem

- [x] T018 Criar teste para `SidebarNavItem` em `lancarme-web/src/tests/Sidebar.test.tsx`
  (arquivo que será expandido nas tasks seguintes). Cenários desta task:
  - item ativo renderiza com `aria-current="page"`
  - item ativo **não** possui `tabIndex` (não é interativo neste bloco)
  - item com `comingSoon: true` renderiza com `aria-disabled="true"` e
    **não** como `<a>` ou `<button>`
  - item com `comingSoon: true` não possui `tabIndex`
  - label é visível no DOM  
  _Arquivo criado_: `lancarme-web/src/tests/Sidebar.test.tsx`

- [x] T019 Criar `lancarme-web/src/components/layout/SidebarNavItem.tsx`:
  - Props: recebe `NavItem` do `lancarme-web/src/types/navigation.ts`
  - Item ativo (`active: true`): renderizado como `<div>` **sem** `tabIndex`
    (não há navegação funcional neste bloco; o item ativo é apenas indicador visual),
    `aria-current="page"`, fundo `bg-sidebar-active`, texto branco
  - Item futuro (`comingSoon: true`): renderizado como `<div>` com
    `aria-disabled="true"`, `opacity-50`, `cursor-default`, sem handler
    de clique, sem `tabIndex`
  - Ícone Lucide + label em PT-BR
  - Badge visual "Em breve" pequeno e discreto para itens `comingSoon`
  - **Nenhum elemento da sidebar recebe `tabIndex` neste bloco** — foco visível
    é reservado exclusivamente para controles funcionais reais (botão hambúrguer,
    botão fechar drawer)
  - Transição de hover: `transition-colors duration-150` (efeito visual sutil no item ativo)
  - **Não usar `<a>`, `<Link>`, `href` ou qualquer referência de rota**  
  _Arquivo criado_: `lancarme-web/src/components/layout/SidebarNavItem.tsx`

### 6.2 — SidebarNav

- [x] T020 Expandir `lancarme-web/src/tests/Sidebar.test.tsx` com cenários para `SidebarNav`:
  - renderiza todos os grupos de navegação com seus rótulos em PT-BR
  - renderiza todos os 14 itens esperados (Command Center + 13 módulos futuros)
  - somente o item Command Center tem `aria-current="page"`
  - todos os demais itens têm `aria-disabled="true"`
  - nenhum item futuro possui atributo `href`  
  _Arquivo atualizado_: `lancarme-web/src/tests/Sidebar.test.tsx`

- [x] T021 Criar `lancarme-web/src/components/layout/SidebarNav.tsx`:
  - Importa a lista de itens de navegação de `lancarme-web/src/lib/navigation.ts`
    (a criar na próxima task)
  - Renderiza grupos com `<Separator>` do shadcn/ui entre eles
  - Grupo "Visão geral": Command Center
  - Grupo "Estratégia e Lançamento": Strategy Core, Launch Strategy Room
  - Grupo "Conteúdo": ConteúdoMatriz, Copy Room, Creative Room
  - Grupo "Tráfego e Funil": Traffic Room, Funnel Map
  - Grupo "Execução": Calendar & Execution, MentorFlow
  - Grupo "Ativos": Proof Vault, Analytics & AI Diagnosis
  - Grupo "Sistema": AI Agents, Billing & Créditos, Configurações e Integrações
  - Renderiza `<SidebarNavItem>` para cada item  
  _Arquivo criado_: `lancarme-web/src/components/layout/SidebarNav.tsx`

- [x] T022 Criar `lancarme-web/src/lib/navigation.ts` com a lista estática de `NavItem[]`:
  - Todos os itens de todos os grupos (conforme RF-002 da spec)
  - Command Center: `active: true`, `comingSoon: false`
  - Todos os demais: `active: false`, `comingSoon: true`
  - Ícones Lucide para cada item (ex.: `LayoutDashboard` para Command Center,
    `Lightbulb` para Strategy Core, etc.)
  - Labels em PT-BR  
  _Arquivo criado_: `lancarme-web/src/lib/navigation.ts`

### 6.3 — Sidebar Desktop

- [x] T023 Expandir `lancarme-web/src/tests/Sidebar.test.tsx` com cenários para `Sidebar`:
  - renderiza o logo/nome "Lançar.me"
  - renderiza o avatar e nome estático do usuário no rodapé
  - renderiza o `SidebarNav` com todos os grupos  
  _Arquivo atualizado_: `lancarme-web/src/tests/Sidebar.test.tsx`

- [x] T024 Criar `lancarme-web/src/components/layout/Sidebar.tsx`:
  - Fundo `bg-sidebar-bg` (`#1e3a8a`)
  - Largura fixa (ex.: `w-64`), altura total (`h-full`), visível apenas em `lg:`
  - Topo: logotipo/ícone + nome "Lançar.me" em texto branco semibold
  - Meio (scrollável): `<SidebarNav>`
  - Rodapé: avatar estático + nome de usuário "Gabriel Silva" em texto claro
  - Semântica: elemento `<nav>` com `aria-label="Navegação principal"`  
  _Arquivo criado_: `lancarme-web/src/components/layout/Sidebar.tsx`

### 6.4 — Topbar

- [x] T025 Criar `lancarme-web/src/tests/Topbar.test.tsx` com cenários:
  - renderiza o botão hambúrguer com `aria-label="Abrir menu de navegação"`
  - botão hambúrguer invoca callback ao ser clicado
  - renderiza nome de usuário estático "Gabriel Silva"
  - renderiza o `ApiStatusIndicator` (status da API visível na topbar)
  - ícones decorativos (busca, notificações) **não** são `<button>` nem recebem
    handler — renderizados como elementos não interativos com `aria-hidden="true"`  
  _Arquivo criado_: `lancarme-web/src/tests/Topbar.test.tsx`

- [x] T026 Criar `lancarme-web/src/components/layout/Topbar.tsx`:
  - Props: `onMenuOpen: () => void`
  - Fundo branco, `border-b border-border`, `h-16`, `px-4`
  - Esquerda: botão hambúrguer visível somente em `< lg`
    (`lg:hidden`), `aria-label="Abrir menu de navegação"`, usando ícone `Menu`
    do Lucide, chama `onMenuOpen`; este é o único controle funcional da topbar
  - Direita:
    - `<ApiStatusIndicator />` integrado de forma discreta (badge de status da API)
    - `<Avatar>` com iniciais estáticas "GS" e nome "Gabriel Silva" (elemento visual)
    - Ícones de busca (`Search`) e notificações (`Bell`) renderizados como `<span>`
      ou `<div>` decorativos com `aria-hidden="true"`, **sem `onClick`, sem `tabIndex`,
      sem `<button>`** — busca e notificações não são funcionalidades deste bloco
  - Semântica: elemento `<header>` com `role="banner"`
  - Nenhum ícone decorativo deve sugerir interatividade ou fluxo funcional  
  _Arquivo criado_: `lancarme-web/src/components/layout/Topbar.tsx`

### 6.5 — MobileDrawer

- [x] T027 Criar `lancarme-web/src/tests/MobileDrawer.test.tsx` com cenários:
  - drawer está fechado por padrão quando `isOpen={false}`
  - drawer abre quando `isOpen={true}`
  - botão fechar no drawer chama `onClose`
  - drawer contém `SidebarNav` com todos os itens de navegação
  - drawer tem `aria-label` adequado  
  _Arquivo criado_: `lancarme-web/src/tests/MobileDrawer.test.tsx`

- [x] T028 Criar `lancarme-web/src/components/layout/MobileDrawer.tsx`:
  - Props: `isOpen: boolean`, `onClose: () => void`
  - Usa `Sheet` do shadcn/ui com `side="left"`
  - Conteúdo idêntico ao `<Sidebar>` (mesmo logo, mesmo `<SidebarNav>`,
    mesmo rodapé de usuário)
  - Botão de fechar dentro do drawer com `aria-label="Fechar menu de navegação"`
  - Fecha ao clicar no overlay ou pressionar Escape (comportamento nativo do Radix Sheet)
  - Transição suave: `duration-200`  
  _Arquivo criado_: `lancarme-web/src/components/layout/MobileDrawer.tsx`

### 6.6 — AppShell

- [x] T029 Criar `lancarme-web/src/tests/AppShell.test.tsx` com cenários:
  - renderiza elemento `<nav>` (sidebar)
  - renderiza elemento `<header>` (topbar)
  - renderiza elemento `<main>` (área de conteúdo)
  - renderiza o texto "Lançar.me" (identidade da marca)
  - renderiza o conteúdo passado via `children`
  - em viewport mobile (mock de `window.innerWidth < 1024`): sidebar desktop
    está oculta  
  _Arquivo criado_: `lancarme-web/src/tests/AppShell.test.tsx`

- [x] T030 Criar `lancarme-web/src/components/layout/AppShell.tsx`:
  - Props: `children: React.ReactNode`
  - Usa `useSidebar` para controlar o drawer mobile
  - Container raiz: `<div className="flex h-screen overflow-hidden bg-surface">`
  - `<Sidebar>` com `className="hidden lg:flex"` (visível somente em desktop)
  - `<MobileDrawer isOpen={isOpen} onClose={close} />` (sempre montado, controlado pelo hook)
  - `<div className="flex flex-col flex-1 overflow-hidden">`:
    - `<Topbar onMenuOpen={open} />`
    - `<main className="flex-1 overflow-y-auto p-4 lg:p-6">{ children }</main>`
  - Landmarks: `<nav>` dentro de Sidebar/MobileDrawer, `<header>` no Topbar, `<main>`
    para conteúdo  
  _Arquivo criado_: `lancarme-web/src/components/layout/AppShell.tsx`

**Checkpoint**: App Shell completa com sidebar, topbar, drawer mobile e área de conteúdo.
Todos os testes desta fase devem passar.

---

## Fase 7 — Command Center: Componentes Internos (Paralelizável após Fase 3)

**Propósito**: Criar os componentes individuais do Command Center, cada um consumindo dados
de `mockData.ts`. Podem ser criados em paralelo entre si.

- [x] T031 [P] Criar `lancarme-web/src/modules/command-center/components/WelcomeHeader.tsx`:
  - Importa `{ greeting, date }` do `mockData.ts`
  - Renderiza `<h1>` com saudação "Olá, Gabriel! 👋" em `text-2xl font-bold text-ink`
  - Renderiza subtítulo "Aqui está o resumo do seu lançamento." em `text-sm text-ink-muted`
  - Renderiza data estática em `text-xs text-ink-muted`
  - Sem lógica de domínio  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/WelcomeHeader.tsx`

- [x] T032 [P] Criar `lancarme-web/src/modules/command-center/components/OverviewCards.tsx`:
  - Importa dados de overview do `mockData.ts`
  - Grid responsivo: 1 coluna no mobile, 2 colunas em `sm:`, 4 colunas em `lg:`
  - Renderiza 4 `<MetricCard>` para Receita, Leads, Vendas, ROAS
  - Inclui rótulo "Dados demonstrativos" como `<Badge>` discreto acima do grid
    ou como legenda abaixo, em `text-xs text-ink-muted`  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/OverviewCards.tsx`

- [x] T033 [P] Criar `lancarme-web/src/modules/command-center/components/NextActionsPanel.tsx`:
  - Importa próximas ações do `mockData.ts`
  - Renderiza lista de 4 itens com status visual (ícone colorido), título e data fictícia
  - Status: `pendente` → amarelo, `em_andamento` → azul, `concluido` → verde
  - "Ver todas": renderizado como texto visual acompanhado de chip "Em breve",
    **ou** como `<button disabled>` com aparência inequivocamente desabilitada;
    **não usar `aria-disabled="true"` em `<button>` sem `disabled` real**,
    pois botões `aria-disabled` sem `disabled` ainda são clicáveis e enganosos
  - Legenda discreta "Dados demonstrativos" em `text-xs text-ink-muted`
  - Usa `<SectionHeader title="Próximas Ações" />`  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/NextActionsPanel.tsx`

- [x] T034 [P] Criar `lancarme-web/src/modules/command-center/components/RecentActivity.tsx`:
  - Importa atividade recente do `mockData.ts`
  - Renderiza lista de 5 eventos com ícone Lucide, descrição e timestamp relativo estático
    ("há 2 horas", "há 1 dia", etc.)
  - Usa `<SectionHeader title="Atividade Recente" />`
  - Sem dados reais, sem chamadas de API  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/RecentActivity.tsx`

- [x] T035 [P] Criar `lancarme-web/src/modules/command-center/components/AiCreditsCard.tsx`:
  - Importa créditos de IA do `mockData.ts` (`{ available: 432, total: 1000 }`)
  - Renderiza número de créditos disponíveis em destaque
  - Barra de progresso visual estática (div com `width: ${percent}%`)
  - Rótulo "Créditos de IA disponíveis (demonstrativo)"
  - "Gerenciar": renderizado como `<button disabled>` com aparência desabilitada
    e chip "Em breve", ou substituído por label visual `Em breve` sem semântica de
    botão — **não usar botão aparentemente operacional**  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/AiCreditsCard.tsx`

- [x] T036 [P] Criar `lancarme-web/src/modules/command-center/components/QuickActions.tsx`:
  - Importa ações rápidas do `mockData.ts`
  - 4 cards visuais **não interativos** para: "Criar copy com IA", "Gerar criativo",
    "Diagnóstico de tráfego", "Plano de lançamento"
  - Renderizar como `<div>` com aparência de card (borda, ícone, label) —
    **não usar `<Button>` nem `<button>` sem `disabled` real**; cards visuais sem
    semântica de botão são mais honestos do que botões aparentemente clicáveis
  - Cada card exibe chip "Em breve" de forma inequívoca
  - Cursor `cursor-default` (não `cursor-not-allowed`, que sugere que havia algo
    a fazer mas está bloqueado — aqui nunca houve ação real)
  - `aria-hidden="true"` nos ícones decorativos internos dos cards
  - Usa `<SectionHeader title="Ações Rápidas" />`  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/QuickActions.tsx`

- [x] T037 [P] Criar `lancarme-web/src/modules/command-center/components/PerformanceChart.tsx`:
  - Gráfico de linha estático implementado como SVG inline (sem lib externa)
  - Path de curva suave representando tendência de crescimento de 7 pontos fictícios
  - Indicador de período como chip visual estático **não interativo**:
    ex.: `<span>Período: 30 dias</span>` ou chip com aparência de selecionado —
    **não criar `<button>` com `activeTab`**; chips "7d / 30d / 90d" clicáveis que
    apenas mudam estilo sem alterar dados são interações falsas e não devem existir
  - `aria-hidden="true"` no `<svg>`
  - `<p className="sr-only">` com descrição textual do gráfico para acessibilidade
  - Rótulo "Desempenho Geral (demonstrativo)" visível acima do gráfico
  - Responsivo: largura 100% via `viewBox` no SVG  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/PerformanceChart.tsx`

- [x] T038 [P] Criar `lancarme-web/src/modules/command-center/components/LaunchProgress.tsx`:
  - Importa progresso do lançamento do `mockData.ts`
  - Nome do lançamento: "Lançamento Maio 2026"
  - Percentual: 68% (estático)
  - Barra de progresso linear com preenchimento animado por CSS (`transition-width`)
  - Fases: "Pré-lançamento", "Lançamento", "Pós-lançamento" como indicadores visuais estáticos
  - Rótulo "Progresso demonstrativo" em `text-xs text-ink-muted`  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/components/LaunchProgress.tsx`

**Checkpoint**: Todos os 8 componentes internos do Command Center criados, consumindo somente
dados do `mockData.ts`.

---

## Fase 8 — Command Center Page (Bloqueante, após Fase 7)

**Propósito**: Compor todos os componentes internos na página principal do Command Center,
definindo o layout de duas colunas em desktop e empilhado em mobile.

- [x] T039 Criar `lancarme-web/src/tests/CommandCenterPage.test.tsx` com cenários:
  - renderiza `WelcomeHeader` com saudação ao usuário
  - renderiza 4 cards de visão geral (`OverviewCards`) com labels em PT-BR
    (Receita, Leads, Vendas, ROAS)
  - renderiza "Próximas Ações" (`NextActionsPanel`)
  - renderiza "Atividade Recente" (`RecentActivity`)
  - renderiza "Créditos de IA" (`AiCreditsCard`)
  - renderiza "Ações Rápidas" (`QuickActions`)
  - renderiza "Desempenho Geral" (`PerformanceChart`)
  - renderiza "Progresso do Lançamento" (`LaunchProgress`)
  - renderiza a identificação "Dados demonstrativos" (presente em pelo menos um lugar)
  - nenhum dado dinâmico / nenhuma chamada de API  
  _Arquivo criado_: `lancarme-web/src/tests/CommandCenterPage.test.tsx`

- [x] T040 Criar `lancarme-web/src/modules/command-center/CommandCenterPage.tsx`:
  - Importa e compõe todos os componentes internos
  - **Identificação global obrigatória**: badge ou chip "Visualização demonstrativa"
    exibido no topo da página, junto ao `WelcomeHeader` ou imediatamente acima do
    grid de conteúdo — cobre métricas, gráfico, atividade, créditos, usuário e ações
  - Layout em `lg+`: coluna principal (~65%) + coluna lateral (~35%) com
    `grid grid-cols-1 lg:grid-cols-3 gap-6`
  - Coluna principal (2/3): `WelcomeHeader`, `OverviewCards`, `PerformanceChart`,
    `NextActionsPanel`
  - Coluna lateral (1/3): `RecentActivity`, `AiCreditsCard`, `QuickActions`,
    `LaunchProgress`
  - Em mobile: todas as seções empilhadas verticalmente (grid de 1 coluna)
  - Sem roteador, sem Outlet, sem importação de `react-router-dom`
  - Sem lógica de domínio, sem chamada de API, sem persistência  
  _Arquivo criado_:
  `lancarme-web/src/modules/command-center/CommandCenterPage.tsx`

**Checkpoint**: `CommandCenterPage` composta e testada com dados 100% estáticos,
com identificação global de ambiente demonstrativo visível no topo da página.

---

## Fase 9 — Integração: App.tsx (Bloqueante, após Fases 6 e 8)

**Propósito**: Reescrever o `App.tsx` do Bloco 1 para integrar `AppShell` e
`CommandCenterPage`. Esta é a integração final da shell.

- [x] T041 Atualizar `lancarme-web/src/tests/App.test.tsx`:
  - Adaptar os testes existentes que referenciavam a tela técnica do Bloco 1
    para a nova estrutura da shell
  - Adicionar cenários: renderiza "Lançar.me", renderiza sidebar, renderiza topbar,
    renderiza conteúdo do Command Center
  - Adicionar cenário: renderiza o `ApiStatusIndicator` na topbar
    (confirmar que o indicador de status da API está presente na UI integrada)
  - Confirmar que nenhuma importação de `react-router-dom` aparece no bundle  
  _Arquivo atualizado_: `lancarme-web/src/tests/App.test.tsx`

- [x] T042 Reescrever `lancarme-web/src/app/App.tsx`:
  - Importar `AppShell` de `@/components/layout/AppShell`
  - Importar `CommandCenterPage` de `@/modules/command-center/CommandCenterPage`
  - Renderizar `<AppShell><CommandCenterPage /></AppShell>` como conteúdo raiz
  - **Não remover a funcionalidade visual do healthcheck**: o `ApiStatusIndicator`
    integrado na `Topbar` (T026) já exibe o status da API na shell — a tela técnica
    do Bloco 1 é substituída por esta apresentação discreta, não eliminada
  - Os arquivos `useHealthStatus.ts`, `healthService.ts`, `apiClient.ts` e `types/health.ts`
    permanecem intocados; apenas a forma de apresentação muda (painel técnico grande →
    badge discreto na topbar)
  - Sem `BrowserRouter`, sem `Routes`, sem `Route`, sem import de `react-router-dom`
  - O `QueryClientProvider` permanece em `main.tsx` — não mover para cá  
  _Arquivo reescrito_: `lancarme-web/src/app/App.tsx`

**Checkpoint**: `App.tsx` reescrito integra a shell completa com o indicador de status
da API visível na topbar. Rodar `npm run test` e confirmar que todos os testes passam
antes de avançar.

---

## Fase 10 — Responsividade e Acessibilidade (após Fase 9)

**Propósito**: Validar e corrigir responsividade e acessibilidade na shell e no
Command Center após a integração completa.

### 10.1 — Responsividade

- [x] T043 Validar layout desktop (≥ 1280px):
  - Sidebar fixa visível à esquerda
  - Grid do Command Center em 3 colunas
  - Topbar sem hambúrguer visível
  - Nenhum overflow horizontal  
  _Sem arquivos novos; ajustes de classe Tailwind nos componentes existentes se necessário_

- [x] T044 Validar layout tablet (768px–1023px):
  - Sidebar oculta (substituída por drawer)
  - Hambúrguer visível na topbar
  - Cards do Command Center em 2 colunas
  - Coluna lateral empilhada abaixo da coluna principal
  - Topbar legível e sem quebra  
  _Ajustes de classes responsivas nos componentes existentes se necessário_

- [x] T045 Validar layout mobile (< 768px):
  - Sidebar oculta
  - Hambúrguer visível
  - Todos os cards e painéis empilhados em 1 coluna
  - Nenhum elemento com overflow horizontal
  - Drawer abre e fecha corretamente (validação manual + teste automático já coberto)
  - Textos legíveis sem truncamento indesejado  
  _Ajustes de classes responsivas nos componentes existentes se necessário_

### 10.2 — Acessibilidade

- [x] T046 Verificar landmarks semânticos:
  - `<nav aria-label="Navegação principal">` presente na sidebar e no drawer
  - `<header role="banner">` presente na topbar
  - `<main>` presente na área de conteúdo
  - Sem landmarks duplicados no DOM  
  _Ajustes nos componentes de layout se necessário_

- [x] T047 Verificar hierarquia de headings:
  - Único `<h1>` por página: saudação no `WelcomeHeader`
  - `<h2>` para títulos de seções (via `SectionHeader`)
  - Nenhum `<h3>` ou nível inferior usado antes de `<h2>` no contexto  
  _Ajustes nos componentes se necessário_

- [x] T048 Verificar foco visível:
  - Controles funcionais reais (botão hambúrguer, botão fechar drawer) têm
    foco visível com `focus-visible:ring-2 focus-visible:ring-blue-500 ring-offset-2`
  - **Nenhum item da sidebar recebe foco** — nem o item ativo Command Center nem
    os itens futuros; nenhum `tabIndex` na sidebar neste bloco
  - `<button disabled>` têm `pointer-events: none` e aparência claramente distinta;
    não precisam de ring de foco pois não recebem foco nativamente
  - Elementos decorativos (ícones na topbar, SVG do gráfico) têm `aria-hidden="true"`
    e não recebem foco  
  _Ajustes nos componentes se necessário_

- [x] T049 Verificar contraste de texto:
  - Sidebar: texto `#e0eaff` sobre fundo `#1e3a8a` — verificar ratio (deve ser ≥ 4.5:1)
  - Cards: texto `#0f172a` sobre `#ffffff` — OK (≥ 16:1)
  - Texto muted `#64748b` sobre `#ffffff` — verificar ratio (deve ser ≥ 4.5:1)
  - Badges de status semântico (verde/amarelo/vermelho) com contraste adequado  
  _Ajustes de tokens ou classes de cor se necessário_

- [x] T050 Verificar itens não interativos e elementos demonstrativos:
  - Ações rápidas: cards `<div>` sem semântica de botão, com chip "Em breve" visível
    e `aria-hidden="true"` nos ícones internos
  - "Ver todas" em Próximas Ações: `<button disabled>` ou label visual com "Em breve"
    — se `<button>`, deve ter `disabled` nativo (não apenas `aria-disabled`)
  - "Gerenciar" em Créditos de IA: `<button disabled>` ou label visual com "Em breve"
    — mesma regra acima
  - Nenhum `<a href>` em nenhum elemento demonstrativo
  - SVG do gráfico: `aria-hidden="true"` e `<p className="sr-only">` de descrição
  - Indicador de período do gráfico: elemento visual estático, sem interatividade  
  _Ajustes nos componentes se necessário_

**Checkpoint**: Shell responsiva e acessível. Validar manualmente nos breakpoints
antes de avançar para a fase de testes finais.

---

## Fase 11 — Testes Finais e Preservação do Bloco 1 (após Fase 9)

**Propósito**: Confirmar que nenhum teste do Bloco 1 foi quebrado e que todos os novos
testes do Bloco 2 passam.

- [x] T051 Confirmar que `lancarme-web/src/tests/healthService.test.ts` passa sem qualquer
  alteração — o serviço, o hook e os tipos do healthcheck foram preservados intocados.
  Registrar resultado.  
  _Arquivo lido (não alterado)_: `lancarme-web/src/tests/healthService.test.ts`

- [x] T052 Executar todos os testes do frontend e confirmar que passam:
  ```bash
  cd lancarme-web && npm run test
  ```
  Arquivos de teste cobertos neste bloco:
  - `src/tests/setup.ts` (preservado)
  - `src/tests/healthService.test.ts` (preservado, sem alteração)
  - `src/tests/App.test.tsx` (adaptado)
  - `src/tests/useSidebar.test.ts` (novo)
  - `src/tests/AppShell.test.tsx` (novo)
  - `src/tests/Sidebar.test.tsx` (novo)
  - `src/tests/Topbar.test.tsx` (novo)
  - `src/tests/MobileDrawer.test.tsx` (novo)
  - `src/tests/ApiStatusIndicator.test.tsx` (novo)
  - `src/tests/CommandCenterPage.test.tsx` (novo)

  Se algum teste falhar, corrigir o componente correspondente antes de avançar.  
  _Sem novos arquivos; validação dos arquivos já criados_

**Checkpoint**: Todos os testes passam. Bloco 1 não foi quebrado.

---

## Fase 12 — Documentação (Paralelizável após Fase 9)

**Propósito**: Atualizar somente os documentos pertinentes conforme definido na spec (seção 12).

- [x] T053 [P] Atualizar `README.md` com:
  - Menção ao Bloco 2: "Shell visual inicial entregue no Bloco 2"
  - Referência à identidade azul clara aprovada
  - Nota de que o Command Center exibe dados estáticos demonstrativos
  - Confirmação de que `react-router-dom` **não está** instalado
  - Instruções para rodar o frontend com a nova shell (se houver diferença nos comandos)  
  _Arquivo atualizado_: `README.md`

- [x] T054 [P] Confirmar que `docs/architecture.md` (seção 5) está consistente com a
  estrutura `lancarme-web/src/` implementada. Se houver divergência entre o documento
  e o código, **corrigir o documento** para refletir o que foi implementado.  
  _Arquivo potencialmente atualizado_: `docs/architecture.md`

**Checkpoint**: Documentação alinhada com a implementação.

---

## Fase 13 — Validações Finais (Bloqueante, após Fases 11 e 12)

**Propósito**: Executar todas as validações obrigatórias e confirmar que o bloco está
pronto para aprovação.

### 13.1 — Validações Automatizadas Frontend

- [x] T055 [P] Executar lint e registrar resultado:
  ```bash
  cd lancarme-web && npm run lint
  ```
  Resultado esperado: sem erros. Corrigir qualquer erro antes de avançar.

- [x] T056 [P] Executar typecheck e registrar resultado:
  ```bash
  cd lancarme-web && npm run typecheck
  ```
  Resultado esperado: sem erros de tipo. Nenhum `any` sem justificativa.
  Corrigir qualquer erro antes de avançar.

- [x] T057 [P] Executar testes e registrar resultado:
  ```bash
  cd lancarme-web && npm run test
  ```
  Resultado esperado: todos os testes passam.

- [x] T058 [P] Executar build de produção e registrar resultado:
  ```bash
  cd lancarme-web && npm run build
  ```
  Resultado esperado: build completo sem erros.

### 13.2 — Validação Backend (Regressão)

- [x] T059 Executar testes do backend para confirmar que nenhuma regressão acidental ocorreu:
  ```bash
  cd lancarme-api && ./mvnw test
  ```
  **Nenhum arquivo backend deve ter sido alterado neste bloco.**
  Se algum arquivo backend foi tocado, registrar justificativa e solicitar revisão
  antes de prosseguir.

### 13.3 — Revisão Visual Manual Obrigatória

- [x] T060 Abrir a aplicação localmente (`npm run dev`) e comparar visualmente com
  `docs/design-references/bloco-02-command-center-approved.png`:
  - Verificar fidelidade da sidebar (fundo azul escuro, itens, logo, agrupamentos)
  - Verificar topbar (fundo claro, hambúrguer, área direita com créditos/notificações/avatar)
  - Verificar Command Center (welcome header, 4 cards de overview, painéis laterais)
  - Verificar que a paleta é predominantemente azul, clara e profissional

- [x] T061 Validar responsividade manual nos três breakpoints principais:
  - **Desktop** (≥ 1280px): sidebar fixa, grid 3 colunas, sem hambúrguer
  - **Tablet** (768px–1023px): sidebar oculta, hambúrguer visível, cards em 2 colunas
  - **Mobile** (< 768px): drawer, cards empilhados, sem overflow horizontal

- [x] T062 Validar acessibilidade e conformidade da interface:
  - Todos os textos em PT-BR
  - Contraste visual adequado (sidebar azul, texto claro)
  - Percepção de SaaS premium e profissional
  - Identificação "Dados demonstrativos" (ou equivalente) visível no Command Center
  - Nenhum item futuro da sidebar é clicável ou abre qualquer tela

- [x] T063 Confirmar ausência de escopo extrapolado:
  - `react-router-dom` **não** está no `package.json` — verificar manualmente
  - `skeleton` e `tooltip` do shadcn/ui **não** estão instalados — verificar
    `lancarme-web/src/components/ui/` e `package.json`
  - Nenhum fluxo de auth, IA, billing, métricas reais ou workspace implementado
  - O healthcheck está visível na UI como `ApiStatusIndicator` na topbar —
    confirmar presença; **não** deve ter sido removido da interface
  - Nenhuma chamada de API de domínio além do healthcheck (que está integrado
    ao `ApiStatusIndicator` via `useHealthStatus`)
  - Nenhuma página ou rota criada para módulos futuros
  - Nenhuma migration de banco criada

---

## Fase 14 — Relatório Final

**Propósito**: Documentar o que foi implementado, as decisões tomadas e os riscos remanescentes.

- [x] T064 Produzir o relatório final de implementação do Bloco 2 como resposta de entrega,
  contendo obrigatoriamente:

  **Arquivos criados**:
  - Lista completa de arquivos novos com seus caminhos

  **Arquivos alterados**:
  - Lista de arquivos existentes modificados e o que mudou em cada um

  **Componentes implementados**:
  - Estrutura da App Shell (AppShell, Sidebar, SidebarNav, SidebarNavItem, Topbar,
    MobileDrawer)
  - Componentes compartilhados (MetricCard, SectionHeader, ApiStatusIndicator)
  - Módulo Command Center (CommandCenterPage + 8 subcomponentes + mockData)
  - Hook useSidebar
  - Lib de navegação

  **Decisões visuais adotadas**:
  - Paleta azul (#1e3a8a sidebar, #2563eb ativo, fundo off-white)
  - shadcn/ui com 6 componentes instalados (button, card, badge, avatar, separator, sheet)
  - SVG estático para gráfico de desempenho (sem lib de gráficos)
  - Indicador de período do gráfico como chip visual estático (sem tabs interativas)
  - Ações rápidas como cards `<div>` visuais (sem botões falsos)
  - Itens indisponíveis usam `<button disabled>` ou label visual (sem `aria-disabled` enganoso)
  - Tipografia Inter / stack sans-serif
  - Nenhum item da sidebar recebe foco (sem `tabIndex` na navegação neste bloco)
  - `ApiStatusIndicator` integrado à topbar como badge discreto

  **Dependências adicionadas**:
  - `lucide-react`, `clsx`, `tailwind-merge`, `class-variance-authority`
  - `@radix-ui/react-*` (via shadcn CLI)

  **Dependências explicitamente evitadas**:
  - `react-router-dom` — confirmação explícita de ausência no `package.json`
  - Nenhuma lib de gráficos (Recharts, Victory, Chart.js, etc.)
  - Nenhuma lib de animação pesada

  **Confirmações de escopo**:
  - `react-router-dom` ausente no `package.json`: SIM / NÃO
  - `skeleton` e `tooltip` do shadcn/ui ausentes (não instalados): SIM / NÃO
  - Alias `@/` configurado em `vite.config.ts` e `tsconfig.json`: SIM / NÃO
  - Nenhuma rota ou tela funcional para módulos futuros: SIM / NÃO
  - Todos os dados do Command Center são estáticos de `mockData.ts`: SIM / NÃO
  - Nenhuma chamada de API de domínio além do healthcheck: SIM / NÃO
  - Healthcheck visível na UI como `ApiStatusIndicator` na topbar: SIM / NÃO
  - Healthcheck do Bloco 1 preservado intocado (hook, serviço, tipos, testes): SIM / NÃO
  - Nenhuma interação falsa (sem tabs de gráfico, sem botões `aria-disabled` enganosos): SIM / NÃO
  - Identificação global "Visualização demonstrativa" no Command Center: SIM / NÃO
  - Backend não alterado: SIM / NÃO

  **Resultados dos comandos**:
  ```
  npm run lint    → [resultado]
  npm run typecheck → [resultado]
  npm run test    → [resultado — N testes, N passaram]
  npm run build   → [resultado]
  ./mvnw test     → [resultado — N testes, N passaram]
  ```

  **Validação visual manual**:
  - Desktop: [APROVADO / AJUSTE NECESSÁRIO]
  - Tablet: [APROVADO / AJUSTE NECESSÁRIO]
  - Mobile: [APROVADO / AJUSTE NECESSÁRIO]
  - Fidelidade ao mockup aprovado: [APROVADO / DIVERGÊNCIA REGISTRADA]

  **Riscos remanescentes**:
  - Lista de riscos identificados que permanecem após o bloco

  **Recomendação**:
  - APROVADO para encerrar o Bloco 2 / CORREÇÃO NECESSÁRIA (com detalhes)

---

## Dependências e Ordem de Execução

### Dependências entre fases

```
Fase 1 (Auditoria)
  └─ Fase 2 (Dependências e Config)
       ├─ Fase 3 (Tipos e Mocks) ──────────────────────┐
       │    └─ Fase 7 (Componentes CC) ────────────────┤
       │         └─ Fase 8 (CommandCenterPage) ────────┤
       ├─ Fase 4 (useSidebar)                          │
       │    └─ Fase 6 (Layout AppShell) ───────────────┤
       │         └─ Fase 9 (Integração App.tsx) ←──────┘
       └─ Fase 5 (Compartilhados) ──────┘
            └─ usados em Fase 6 e Fase 7

Fase 9 → Fase 10 (Responsividade + Acessibilidade)
Fase 9 → Fase 11 (Testes Finais)
Fase 9 → Fase 12 (Documentação) [paralela]
Fases 11 + 12 → Fase 13 (Validações Finais)
Fase 13 → Fase 14 (Relatório Final)
```

### Oportunidades de paralelismo

- T002, T003, T004, T005 podem rodar em paralelo após T001 (Fase 1)
- T008-A deve rodar imediatamente após T008, antes de qualquer import `@/`
- T016, T017, T017-A e T017-B (Fase 5) podem rodar em paralelo após Fase 2
- T031–T038 (Fase 7) podem todos rodar em paralelo após Fase 3
- T018–T030 (Fase 6) são sequenciais dentro da fase (dependem do anterior)
- T053 e T054 (Fase 12) podem rodar em paralelo após Fase 9
- T055, T056, T057, T058 (Fase 13.1) podem rodar em paralelo após Fase 11

---

## Critérios de Validade das Tasks

Este `tasks.md` é válido porque:

- [x] Tasks são pequenas, claras e sequenciadas
- [x] Caminhos de arquivos explícitos em cada task
- [x] Testes escritos antes ou junto da implementação correspondente
- [x] Nenhum escopo futuro antecipado (sem auth, workspace, IA real, billing, etc.)
- [x] Nenhum roteamento funcional incluído (`react-router-dom` ausente por design)
- [x] Backend não expandido (nenhuma task toca `lancarme-api/` com alteração funcional)
- [x] Design coerente com o mockup aprovado (`bloco-02-command-center-approved.png`)
- [x] Responsividade tratada em fases dedicadas (Fase 10)
- [x] Acessibilidade tratada em fases dedicadas (Fase 10)
- [x] Validações finais e relatório incluídos (Fases 13 e 14)
- [x] Healthcheck do Bloco 1 preservado visualmente como `ApiStatusIndicator` na topbar
      (T017-A, T017-B, T026, T041, T042, T051, T059)
- [x] Alias `@/` configurado explicitamente antes de qualquer componente ser criado (T008-A)
- [x] Nenhuma interação falsa: sem tabs de gráfico, sem botões `aria-disabled` enganosos,
      sem ícones decorativos com handler
- [x] Identificação global "Visualização demonstrativa" no Command Center (T040)
- [x] shadcn/ui enxuto: apenas 6 componentes instalados, sem skeleton nem tooltip
- [x] Itens futuros da sidebar sem rotas, links, páginas ou handlers reais
- [x] Nenhum elemento da sidebar recebe foco neste bloco (sem `tabIndex` em navegação)

---

## Resultado Final — Bloco 2 Aprovado

**Data de aprovação**: 2026-05-28

### Validações automatizadas executadas

| Comando | Resultado |
|---------|-----------|
| `npm run lint` | ✅ 0 erros, 0 warnings (após polimento de paleta) |
| `npm run typecheck` | ✅ 0 erros de tipo |
| `npm run test` | ✅ 59/59 testes passando (9 arquivos de teste) |
| `npm run build` | ✅ Build gerado com sucesso |
| `./mvnw test` | ✅ 5/5 testes backend passando (sem alterações funcionais) |

### QA visual aprovado

| Dimensão | Status |
|----------|--------|
| Desktop (≥ 1280px) | ✅ APROVADO |
| Tablet (768–1023px) | ✅ APROVADO |
| Mobile (< 768px) | ✅ APROVADO |
| Sidebar predominantemente azul (sem matiz roxo) | ✅ APROVADO |
| Paleta azul coerente com mockup aprovado | ✅ APROVADO |
| Badge "Visualização demonstrativa" preservado | ✅ APROVADO |
| Indicador `ApiStatusIndicator` preservado na topbar | ✅ APROVADO |
| Itens futuros continuam inativos | ✅ APROVADO |
| Ausência de `react-router-dom` | ✅ CONFIRMADO |
| Nenhuma funcionalidade real antecipada | ✅ CONFIRMADO |

### Polimento de paleta executado em QA (2026-05-28)

Durante o QA visual, foi identificado que a paleta implementada possuía matiz roxa/violeta residual,
contrariando a direção visual aprovada. O ajuste foi executado nos seguintes tokens:

| Token | Antes | Depois | Motivo |
|-------|-------|--------|--------|
| `sidebar-bg` | `#1e3a8a` | `#16347a` | Navy mais profundo sem percepção roxa |
| `sidebar-active` | `#2563eb` | `#1a56db` | Azul mais vivo e limpo |
| `brand` | `#1e40af` | `#1a56db` | Azul performance sem matiz violeta |
| `brand-light` | `#3b82f6` | `#2f80ed` | Azul limpo sem componente roxo |
| `brand-dark` | `#1e3a8a` | `#1341b8` | Escuro saturado em azul puro |
| `sidebar-text` | `#e0eaff` | `#c8d9f5` | Texto secundário menos violeta |
| `brand-surface` | `#eff6ff` | `#eef4ff` | Superfície ligeiramente mais quente |

Ícone da marca e avatares na sidebar e no drawer também foram ajustados para `bg-white/15`
e `bg-white/20` (translúcido sobre fundo azul), eliminando o uso de `bg-brand-light` sólido
que contribuía para a percepção roxa nesses elementos.

### Smoke manual do ApiStatusIndicator

**Comportamento validado**:

| Cenário | Como testar | Resultado esperado | Status |
|---------|-------------|-------------------|--------|
| Backend ativo com profile `local` | `SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run` | Exibe "API operacional" (ponto verde) | ✅ VALIDADO |
| Backend indisponível | Backend não iniciado ou parado | Exibe "API indisponível" (ponto vermelho); shell renderiza normalmente sem quebrar | ✅ VALIDADO |
| Backend sem profile `local` | `./mvnw spring-boot:run` (sem profile) | API responde ao curl, mas navegador bloqueia por CORS → indicador exibe "API indisponível" | ⚠️ REGISTRADO |

**Problema identificado — profile/CORS**:

Sem o perfil `local`, a API responde normalmente ao `curl` e ao terminal, mas o navegador
bloqueia as requisições do frontend por violação de CORS. O `ApiStatusIndicator` exibe
"API indisponível" mesmo com a API rodando. Isso **não é um bug** — é o comportamento correto:
o CORS é configurado apenas no perfil `local` por design de segurança.

**Forma correta de execução local**:
```bash
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

Documentado no `README.md` na seção **Backend** e **CORS Local**.
