# Relatório de Implementação — Bloco 2: Design System & App Shell

**Data de implementação**: 2026-05-28
**Data de aprovação do QA visual**: 2026-05-28
**Status**: ✅ IMPLEMENTADO, VALIDADO E APROVADO
**Executor**: Claude Code (claude-sonnet-4-6)
**Referência visual aprovada**: `docs/design-references/bloco-02-command-center-approved.png`
**Spec**: `specs/002-design-system-app-shell/spec.md`
**Plan**: `specs/002-design-system-app-shell/plan.md`
**Tasks**: `specs/002-design-system-app-shell/tasks.md`

**Próximo bloco**: Bloco 3 — Database & Flyway

---

## 1. Resumo Executivo

O Bloco 2 foi implementado na íntegra, entregando a primeira shell visual profissional do Lançar.me com identidade predominantemente azul, App Shell responsiva (sidebar desktop + drawer mobile + topbar), e o Command Center placeholder com dados 100% estáticos. O `ApiStatusIndicator` integrado discretamente na topbar preserva a funcionalidade visual do healthcheck entregue no Bloco 1. Todas as validações automatizadas passaram sem erros. O QA visual foi aprovado após ajuste de polimento de paleta que eliminou matiz roxa/violeta residual.

---

## 2. Arquivos Criados

### Configuração

| Arquivo | Descrição |
|---------|-----------|
| `vite.config.ts` | Alias `@/` adicionado via `path.resolve` |
| `vitest.config.ts` | Alias `@/` adicionado (sem isso os testes falhavam) |
| `tsconfig.json` | `baseUrl` e `paths["@/*"]` adicionados |
| `tailwind.config.ts` | Reescrito com tokens semânticos azuis do design system |
| `src/app/index.css` | Reescrito com CSS variables do shadcn/ui mapeadas para identidade azul |
| `components.json` | Gerado pelo CLI do shadcn/ui |

### Lib e Tipos

| Arquivo | Descrição |
|---------|-----------|
| `src/lib/utils.ts` | Função `cn()` gerada pelo shadcn/ui CLI |
| `src/lib/navigation.ts` | Lista estática de 15 `NavItem` com grupos |
| `src/types/navigation.ts` | Interface `NavItem` sem href/rota |

### Hooks

| Arquivo | Descrição |
|---------|-----------|
| `src/hooks/useSidebar.ts` | Estado booleano `isOpen` com `open`, `close`, `toggle` |

### Componentes shadcn/ui (gerados via CLI)

| Arquivo | Justificativa de uso |
|---------|---------------------|
| `src/components/ui/button.tsx` | Controles funcionais e estados `disabled` |
| `src/components/ui/card.tsx` | MetricCard e painéis do Command Center |
| `src/components/ui/badge.tsx` | Identificação demonstrativa e status |
| `src/components/ui/avatar.tsx` | Avatar do usuário na topbar e sidebar |
| `src/components/ui/separator.tsx` | Divisores entre grupos de navegação |
| `src/components/ui/sheet.tsx` | Drawer mobile (Base UI Dialog) |

### Componentes de Layout

| Arquivo | Descrição |
|---------|-----------|
| `src/components/layout/SidebarNavItem.tsx` | Item individual de navegação (ativo ou inativo) |
| `src/components/layout/SidebarNav.tsx` | Navegação agrupada com 7 categorias |
| `src/components/layout/Sidebar.tsx` | Sidebar desktop azul com logo, nav e rodapé |
| `src/components/layout/Topbar.tsx` | Topbar clara com hamburger, ApiStatusIndicator e avatar |
| `src/components/layout/MobileDrawer.tsx` | Drawer mobile usando `Sheet` do shadcn/ui |
| `src/components/layout/AppShell.tsx` | Container estrutural raiz da aplicação |

### Componentes Compartilhados

| Arquivo | Descrição |
|---------|-----------|
| `src/components/shared/SectionHeader.tsx` | Cabeçalho de seção reutilizável com `h2` |
| `src/components/shared/MetricCard.tsx` | Card de métrica com valor, label e variação colorida |
| `src/components/shared/ApiStatusIndicator.tsx` | Badge discreto com 3 estados de healthcheck |

### Módulo Command Center

| Arquivo | Descrição |
|---------|-----------|
| `src/modules/command-center/data/mockData.ts` | Dados estáticos hardcoded (greeting, cards, ações, atividade, créditos, progresso) |
| `src/modules/command-center/CommandCenterPage.tsx` | Composição de todos os subcomponentes com identificação global |
| `src/modules/command-center/components/WelcomeHeader.tsx` | Saudação estática com nome e data |
| `src/modules/command-center/components/OverviewCards.tsx` | Grid de 4 MetricCards (Receita, Leads, Vendas, ROAS) |
| `src/modules/command-center/components/NextActionsPanel.tsx` | Lista de próximas ações com status colorido |
| `src/modules/command-center/components/RecentActivity.tsx` | Lista de 5 eventos recentes com ícones |
| `src/modules/command-center/components/AiCreditsCard.tsx` | Créditos de IA com barra de progresso estática |
| `src/modules/command-center/components/QuickActions.tsx` | 4 cards visuais não interativos com "Em breve" |
| `src/modules/command-center/components/PerformanceChart.tsx` | Gráfico SVG estático com área e linha de tendência |
| `src/modules/command-center/components/LaunchProgress.tsx` | Barra de progresso linear com fases do lançamento |

### Testes (novos)

| Arquivo | Cenários cobertos |
|---------|-------------------|
| `src/tests/useSidebar.test.ts` | Estado inicial, `open()`, `close()`, `toggle()` |
| `src/tests/ApiStatusIndicator.test.tsx` | Loading, operacional, indisponível |
| `src/tests/AppShell.test.tsx` | Landmarks semânticos, identidade, children |
| `src/tests/Sidebar.test.tsx` | SidebarNavItem ativo/inativo, SidebarNav grupos, Sidebar completa |
| `src/tests/Topbar.test.tsx` | Hamburger aria-label, callback, usuário, ApiStatusIndicator |
| `src/tests/MobileDrawer.test.tsx` | Fechado/aberto, botão fechar, itens de navegação |
| `src/tests/CommandCenterPage.test.tsx` | Todos os painéis, cards PT-BR, badge demonstrativo |

---

## 3. Arquivos Alterados

| Arquivo | O que mudou |
|---------|-------------|
| `src/app/App.tsx` | Reescrito: agora renderiza `<AppShell><CommandCenterPage /></AppShell>` sem roteador |
| `src/tests/App.test.tsx` | Adaptado para a nova shell; mock de `useHealthStatus` a nível de módulo com `vi.mock` |
| `README.md` | Atualizado para Bloco 2: shell visual, identidade azul, dados estáticos, stack novo |

### Arquivos do Bloco 1 preservados sem alteração

- `src/hooks/useHealthStatus.ts`
- `src/services/healthService.ts`
- `src/services/apiClient.ts`
- `src/types/health.ts`
- `src/tests/healthService.test.ts`
- `src/tests/setup.ts`
- `src/app/main.tsx`

---

## 4. Dependências Adicionadas

| Pacote | Tipo | Versão | Justificativa |
|--------|------|---------|---------------|
| `lucide-react` | production | ^0.x | Ícones consistentes em toda a shell |
| `clsx` | production | ^2.x | Merge condicional de classes Tailwind |
| `tailwind-merge` | production | ^2.x | Merge seguro de classes sem conflito |
| `class-variance-authority` | production | ^0.7.x | Variantes CVA — exigido pelos componentes shadcn |
| `@base-ui/react` | production | ^1.5.0 | Primitivas acessíveis (instalado pelo shadcn CLI) |
| `shadcn` | devDependency | ^4.8.2 | CLI de geração de componentes |
| `tw-animate-css` | production | ^1.4.0 | Animações CSS leves (instalado pelo shadcn CLI) |
| `@fontsource-variable/geist` | production | ^5.2.9 | Instalado pelo shadcn CLI como side-effect; não utilizado na UI |

**`react-router-dom` não instalado** — confirmado via `package.json`.

> **Nota**: O shadcn/ui CLI versão 4.8 usa o estilo `base-nova` que depende de `@base-ui/react` em vez de `@radix-ui/react-*`. Os componentes gerados são funcionalmente equivalentes. A API de uso (Sheet, Avatar, Button, etc.) é compatível com o planejado nas tasks.

---

## 5. Tokens do Design System

Definidos em `tailwind.config.ts` com nomes semânticos. Valores finais após polimento de paleta no QA visual (2026-05-28):

| Token | Valor hex | Uso |
|-------|-----------|-----|
| `brand` | `#1a56db` | Cor primária da marca |
| `brand-light` | `#2f80ed` | Hover, destaque, links, gráfico |
| `brand-dark` | `#1341b8` | Sidebar fundo escuro |
| `brand-surface` | `#eef4ff` | Fundo de card de destaque leve |
| `sidebar-bg` | `#16347a` | Fundo da sidebar (navy profundo, sem matiz roxo) |
| `sidebar-text` | `#c8d9f5` | Texto dos itens da sidebar |
| `sidebar-active` | `#1a56db` | Fundo do item ativo |
| `sidebar-hover` | `#1e4fc2` | Hover dos itens |
| `surface` | `#f8fafc` | Fundo da área principal |
| `surface-card` | `#ffffff` | Fundo dos cards |
| `border` | `#e2e8f0` | Borda padrão dos cards |
| `ink` | `#0f172a` | Texto principal |
| `ink-muted` | `#64748b` | Texto secundário |
| `success` | `#16a34a` | Positivo, crescimento |
| `warning` | `#d97706` | Atenção |
| `danger` | `#dc2626` | Erro, negativo |

> Os tokens originais definidos no `plan.md` (`#1e3a8a`, `#2563eb`, etc.) foram calibrados
> durante o QA visual para eliminar a percepção roxa/violeta que os valores originais produziam
> em monitores típicos. Os nomes semânticos permaneceram inalterados; apenas os valores hex foram ajustados.

---

## 6. Como o Mockup Aprovado Foi Traduzido

| Elemento do mockup | Implementação |
|--------------------|---------------|
| Sidebar azul-escura com logo | `Sidebar.tsx` com `bg-sidebar-bg`, logo "Lançar.me" com ícone "L" |
| Grupos de navegação com labels PT-BR | `SidebarNav.tsx` com 7 grupos, `SidebarNavItem.tsx` para cada item |
| Command Center ativo (destacado) | `aria-current="page"`, `bg-sidebar-active`, texto branco |
| Módulos futuros inativos | `aria-disabled="true"`, `opacity-50`, chip "Em breve" |
| Topbar clara com avatar e status | `Topbar.tsx` fundo branco com `ApiStatusIndicator` e `Avatar` |
| Badge "Dados demonstrativos" | Chip âmbar global no topo do `CommandCenterPage` |
| 4 cards de overview | `OverviewCards.tsx` com `MetricCard` em grid responsivo |
| Próximas ações com status colorido | `NextActionsPanel.tsx` com cores por status |
| Atividade recente com ícones | `RecentActivity.tsx` com `iconMap` do Lucide |
| Créditos de IA com barra | `AiCreditsCard.tsx` com `progressbar` estático |
| Ações rápidas visuais | `QuickActions.tsx` como `<div>` não interativos |
| Gráfico de desempenho | `PerformanceChart.tsx` SVG inline com gradiente e linha de tendência |
| Progresso do lançamento | `LaunchProgress.tsx` com barra linear e fases |
| Layout 2 colunas (desktop) | `grid-cols-3` no `CommandCenterPage` (col-span-2 + col-span-1) |

---

## 7. Como o ApiStatusIndicator Preserva o Healthcheck do Bloco 1

O `ApiStatusIndicator` foi implementado como wrapper visual do hook existente:

```
useHealthStatus() ──► ApiStatusIndicator ──► Topbar ──► AppShell
     (inalterado)          (novo)           (novo)       (novo)
```

- `useHealthStatus.ts`, `healthService.ts`, `apiClient.ts` e `types/health.ts` **não foram tocados**
- O indicador exibe 3 estados visuais discretos:
  - **Loading** → ponto cinza animado + "Consultando API"
  - **Operacional** → ponto verde + "API operacional"
  - **Indisponível** → ponto vermelho + "API indisponível"
- A shell renderiza normalmente independentemente do resultado do healthcheck
- `healthService.test.ts` passou sem nenhuma alteração (4 testes, 4 passaram)

---

## 8. Como os Dados Demonstrativos Foram Sinalizados

| Localização | Sinalização |
|-------------|-------------|
| Topo do Command Center | Badge global "Visualização demonstrativa" (chip âmbar) |
| Cards de overview | Seção com dados de `mockData.ts` |
| Próximas Ações | Legenda "Dados demonstrativos" no rodapé do painel |
| Créditos de IA | Texto "(demonstrativo)" ao lado do total |
| Gráfico de desempenho | Legenda "Desempenho geral (demonstrativo)" abaixo do SVG |
| Progresso do lançamento | "Progresso demonstrativo" no rodapé do painel |
| Sidebar — itens futuros | Chip "Em breve" em cada item inativo |

---

## 9. Como Interações Falsas Foram Evitadas

| Elemento | Abordagem |
|----------|-----------|
| Ações Rápidas | `<div>` com `aria-hidden="true"` — sem semântica de botão |
| "Ver todas" (Próximas Ações) | `<button disabled>` nativo com chip "Em breve" |
| "Gerenciar" (Créditos de IA) | `<button disabled>` nativo com chip "Em breve" |
| Abas de período do gráfico | `<span>` estático exibindo "30 dias" — sem onClick nem estado de abas |
| Ícones de busca/notificações | Omitidos — não renderizados como decoração falsa |
| Itens futuros da sidebar | `<div role="listitem" aria-disabled="true">` sem tabIndex, href ou onClick |
| Item ativo Command Center | `<div role="listitem" aria-current="page">` sem tabIndex (não há navegação) |

---

## 10. Confirmações de Escopo

| Item | Status |
|------|--------|
| `react-router-dom` ausente no `package.json` | **SIM** |
| `skeleton` e `tooltip` do shadcn/ui não instalados | **SIM** |
| Alias `@/` configurado em `vite.config.ts`, `vitest.config.ts` e `tsconfig.json` | **SIM** |
| Nenhuma rota ou tela funcional para módulos futuros | **SIM** |
| Todos os dados do Command Center são estáticos de `mockData.ts` | **SIM** |
| Nenhuma chamada de API de domínio além do healthcheck | **SIM** |
| `ApiStatusIndicator` visível na topbar | **SIM** |
| Healthcheck do Bloco 1 preservado intocado (hook, serviço, tipos, testes) | **SIM** |
| Nenhuma interação falsa (sem tabs de gráfico, sem botões `aria-disabled` enganosos) | **SIM** |
| Identificação global "Visualização demonstrativa" no Command Center | **SIM** |
| Backend não alterado | **SIM** |
| Biblioteca de gráficos ausente (SVG estático) | **SIM** |
| Nenhuma migração de banco criada | **SIM** |
| `skeleton` e `tooltip` ausentes de `src/components/ui/` | **SIM** |

---

## 11. Resultado dos Comandos de Validação

Resultados finais após polimento de paleta (estado aprovado):

```
npm run lint
  → PASS — 0 erros, 0 warnings
  → (Os 2 warnings originais dos arquivos shadcn/ui foram corrigidos
     durante o polimento de paleta; nenhum warning residual.)

npm run typecheck
  → PASS — 0 erros de tipo. Nenhum `any` não justificado.

npm run test
  → 9 test files, 59 tests, 59 passed, 0 failed
  → Breakdown:
     - healthService.test.ts      → 4 testes (preservados, sem alteração)
     - useSidebar.test.ts         → 4 testes
     - ApiStatusIndicator.test.tsx → 3 testes
     - AppShell.test.tsx          → 5 testes
     - Sidebar.test.tsx           → 14 testes
     - Topbar.test.tsx            → 5 testes
     - MobileDrawer.test.tsx      → 4 testes
     - CommandCenterPage.test.tsx → 13 testes
     - App.test.tsx               → 7 testes (adaptados)

npm run build
  → PASS — ✓ built in 2.40s
  → dist/assets/index-CsUiFXte.js   360.53 kB │ gzip: 112.42 kB
  → dist/assets/index-B7DvMCPi.css   21.78 kB │ gzip:   5.01 kB
  → 0 erros de build

./mvnw test (backend — regressão)
  → PASS — 5/5 testes passando
  → Nenhum arquivo backend foi alterado neste bloco.
```

---

## 12. Polimento de Paleta — QA Visual (2026-05-28)

Durante o QA visual, foi identificado que os tokens originais definidos no `plan.md`
(`sidebar-bg: #1e3a8a`, `sidebar-active: #2563eb`, `brand: #1e40af`) produziam
percepção roxa/violeta em monitores típicos, contrariando a direção visual aprovada.

**Causa**: valores com canal G (green) relativamente alto em relação ao canal B (blue)
criam percepção de matiz roxo/índigo mesmo sendo tecnicamente "azul" no modelo RGB.

**Correção aplicada**: recalibração dos tokens para azuis com canal R mais baixo e
canal B dominante, eliminando a percepção violeta sem alterar a sensação de identidade
azul profissional. Detalhes dos valores ajustados na seção 5 deste relatório.

**Arquivos alterados no polimento** (somente tokens/apresentação, sem lógica):
- `lancarme-web/tailwind.config.ts` — valores dos tokens
- `lancarme-web/src/app/index.css` — CSS variables do shadcn/ui sincronizadas
- `lancarme-web/src/components/layout/Sidebar.tsx` — ícone da marca e avatar
- `lancarme-web/src/components/layout/MobileDrawer.tsx` — espelho da sidebar desktop
- `lancarme-web/src/components/layout/Topbar.tsx` — avatar da topbar

Após o polimento: `lint` 0 erros/warnings, `typecheck` limpo, `test` 59/59, `build` limpo.

---

## 13. Smoke Manual do ApiStatusIndicator

| Cenário | Execução | Resultado observado | Status |
|---------|----------|---------------------|--------|
| Backend ativo, profile `local` | `SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run` | Ponto verde + "API operacional" na topbar | ✅ VALIDADO |
| Backend indisponível | Backend não iniciado | Ponto vermelho + "API indisponível"; shell renderiza sem quebrar | ✅ VALIDADO |
| Backend ativo, sem profile `local` | `./mvnw spring-boot:run` | API responde ao `curl`; navegador bloqueado por CORS → indicador exibe "API indisponível" | ⚠️ REGISTRADO |

**Conclusão do smoke**: O `ApiStatusIndicator` funciona corretamente. O comportamento
"API indisponível" sem o profile `local` é o comportamento esperado e correto por design
de segurança — o CORS é restrito ao perfil local. **Não é um bug.**

**Documentação**: O `README.md` foi atualizado para deixar explícito que o backend deve
ser iniciado com `SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run` em desenvolvimento local.

---

## 14. Validação Visual Final — QA Aprovado

| Dimensão | Status | Observações |
|----------|--------|-------------|
| Desktop (≥1280px) | ✅ APROVADO | Sidebar fixa azul-navy, grid 3 colunas, topbar sem hamburger, sem overflow |
| Tablet (768–1023px) | ✅ APROVADO | Sidebar oculta, hamburger visível, colunas empilhadas, painéis sem corte |
| Mobile (<768px) | ✅ APROVADO | Drawer funcional, cards em 1 coluna, sem overflow horizontal, textos legíveis |
| Paleta predominantemente azul | ✅ APROVADO | Nenhum matiz roxo/violeta dominante após polimento |
| Fidelidade ao mockup aprovado | ✅ APROVADO | Identidade azul, hierarquia de cards, layout de 2 colunas, badge demonstrativo |
| UI integralmente em PT-BR | ✅ APROVADO | Todos os labels, mensagens e seções em PT-BR |
| Contraste da sidebar azul | ✅ APROVADO | `#c8d9f5` sobre `#16347a` — WCAG AA atendido |
| `ApiStatusIndicator` visível na topbar | ✅ APROVADO | Badge discreto à direita, visível em todos os breakpoints |
| Identificação "Visualização demonstrativa" | ✅ APROVADO | Badge âmbar global no topo do Command Center |
| Itens futuros sem navegação real | ✅ APROVADO | Nenhum item abre tela; nenhum `<a>` ou handler no DOM |
| Ações inexistentes sem interação falsa | ✅ APROVADO | Cards visuais, botões `disabled` nativos, sem onClick em decoração |
| `react-router-dom` ausente | ✅ APROVADO | Verificado em `package.json` e bundle |
| Biblioteca de gráficos ausente | ✅ APROVADO | SVG inline em `PerformanceChart.tsx` |
| Backend sem alterações funcionais | ✅ APROVADO | Nenhum arquivo de `lancarme-api/` modificado |

---

## 13. Problema Encontrado e Correção Aplicada

### Problema único: alias `@/` não resolvido no Vitest

**Sintoma**: 7 test suites falharam com `Failed to resolve import "@/..."`.

**Causa**: O `vitest.config.ts` original não incluía o campo `resolve.alias` com `@/`. O `vite.config.ts` foi atualizado corretamente na Fase 2, mas o Vitest usa sua própria configuração separada e não herda automaticamente os aliases do Vite.

**Correção**: Adicionado `resolve.alias: { '@': path.resolve(__dirname, './src') }` ao `vitest.config.ts`.

**Resultado após correção**: 59/59 testes passando.

---

## 14. WARNINGs do Analyze Report — Tratamento

O `analyze-report.md` identificou dois WARNINGs editoriais não bloqueantes. Ambos foram considerados durante a implementação:

| WARNING | Tratamento na implementação |
|---------|-----------------------------|
| WARNING-01: `skeleton` e `tooltip` listados na spec.md seção 9 | Seguiu a decisão correta do `plan.md` e `tasks.md` T009 — `skeleton` e `tooltip` **não instalados**. A divergência é editorial na spec e não impactou a implementação. |
| WARNING-02: Linguagem ambígua sobre o healthcheck na spec.md seção 13 | Seguiu o `plan.md` (Healthcheck Integration) como fonte prevalente — `ApiStatusIndicator` implementado e obrigatório na topbar. A shell renderiza normalmente se a API estiver indisponível (sem bloqueio de carregamento), mas o indicador visual está presente. |

---

## 15. Riscos Remanescentes

| ID | Risco | Severidade | Descrição |
|----|-------|------------|-----------|
| R-01 | shadcn/ui estilo `base-nova` | Baixo | CLI versão 4.8 gerou componentes com `@base-ui/react` em vez de `@radix-ui/react-*`. API de uso é compatível, mas componentes futuros adicionados via CLI seguirão o mesmo padrão. Não há impacto funcional neste bloco. |
| R-02 | `@fontsource-variable/geist` instalada sem uso | Baixo | Dependência instalada pelo shadcn CLI como side-effect. Não é usada na UI (fonte é Inter via stack de sistema). Pode ser removida manualmente se desejado. |
| R-03 | CSS variables do shadcn vs tokens Tailwind | Baixo | Alguns componentes shadcn gerados usam `bg-card`, `bg-muted`, `text-foreground` etc. que dependem de CSS variables. Essas foram mapeadas no `index.css` para a identidade azul. Se futuras versões do shadcn alterarem as variáveis, pode haver divergência. |
| R-04 | Tokens do Bloco 1 removidos | Baixo | Tokens `accent` verde, `field` e `warning` laranja foram substituídos. Se algum arquivo não mapeado os referenciava, haverá divergência visual. Todos os arquivos do Bloco 1 foram verificados e nenhum deles usa esses tokens diretamente nos componentes preservados. |
| R-05 | Testes de responsividade com jsdom | Baixo | Testes de breakpoint dependem de mock de `window.innerWidth`/`matchMedia`. A cobertura de responsividade é parcial no ambiente automatizado; validação manual é necessária (realizada em T061). |

---

## 17. Recomendação Final

**✅ APROVADO — Bloco 2 concluído.**

Todas as validações automatizadas passam sem erros. QA visual aprovado. A shell visual está
implementada conforme o mockup aprovado em `docs/design-references/bloco-02-command-center-approved.png`, com:

- identidade predominantemente azul profissional (`#16347a` sidebar, `#1a56db` ativo, fundo off-white);
- responsividade funcional nos três breakpoints (desktop, tablet, mobile);
- acessibilidade básica garantida (landmarks, aria-labels, foco em controles reais);
- dados demonstrativos sinalizados de forma discreta e global;
- healthcheck do Bloco 1 preservado via `ApiStatusIndicator` na topbar;
- smoke manual do `ApiStatusIndicator` validado (operacional com profile `local`, indisponível sem ele);
- escopo do Bloco 2 rigorosamente respeitado (sem roteador, sem rotas, sem backend novo);
- problema de profile/CORS documentado no `README.md` e nas tasks.

**Próximo passo oficial**: Bloco 3 — Database & Flyway.
