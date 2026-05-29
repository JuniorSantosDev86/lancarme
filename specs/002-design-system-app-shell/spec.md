# Feature Specification: Design System & App Shell

**Feature Branch**: `002-design-system-app-shell`

**Created**: 2026-05-28

**Status**: Ready for planning

---

## 1. Resumo do Bloco

O Bloco 2 cria a primeira shell visual profissional do SaaS Lançar.me.
Seu propósito é estabelecer o design system inicial e a estrutura principal
da interface sem implementar autenticação real, regras de negócio de domínio,
persistência de dados de domínio, IA real, billing ou integrações externas.

O resultado esperado é uma aplicação frontend navegável, responsiva, em PT-BR,
com sidebar, topbar, layout base reutilizável e uma página Command Center com
conteúdo estático, seguindo fielmente a referência visual aprovada em
`docs/design-references/bloco-02-command-center-approved.png`.

**Referência visual aprovada**: `docs/design-references/bloco-02-command-center-approved.png`

**Confirmação explícita de escopo**: Este bloco não implementa nenhuma
funcionalidade real de negócio. Todo conteúdo exibido no Command Center é
estático e serve exclusivamente para validar a shell visual e o design system.
Autenticação, workspace real, RBAC, banco de dados de domínio, IA, billing,
integrações externas, roteamento para módulos futuros e páginas placeholder de
módulos ainda inexistentes estão fora do escopo deste bloco.

A sidebar exibe visualmente todos os módulos previstos no produto, porém somente
o Command Center é uma superfície ativa neste bloco. Os demais itens da sidebar
são referências visuais inativas — sem navegação real e sem páginas correspondentes.

---

## 2. Objetivo do Usuário

O desenvolvedor do Lançar.me precisa de uma shell visual profissional que:

- sirva de base reutilizável para todos os módulos do produto;
- estabeleça o design system inicial (tokens, componentes base, tipografia, cores);
- entregue navegação principal consistente (sidebar + topbar);
- demonstre o padrão visual premium esperado pelo produto;
- permita aos próximos blocos plugar módulos de negócio sem reescrever a estrutura visual.

---

## 3. User Stories

### US-01 — Visualizar a shell visual (P1)

**Como** desenvolvedor do Lançar.me,
**quero** uma aplicação web com sidebar, topbar e área de conteúdo principal,
**para** que os próximos módulos tenham uma estrutura visual consistente onde
se encaixar.

**Cenários de aceite**:

1. **Given** que a aplicação está rodando localmente, **when** o desenvolvedor
   acessa a URL raiz, **then** visualiza a shell completa com sidebar lateral,
   topbar superior e a página Command Center no centro.
2. **Given** que a sidebar está visível, **when** o desenvolvedor observa os
   itens de módulos futuros, **then** eles aparecem visivelmente inativos
   (opacidade reduzida, cursor indicando indisponibilidade) sem abrir nenhuma
   tela ou rota.
3. **Given** que o item Command Center está ativo, **when** o desenvolvedor
   inspeciona a sidebar, **then** somente o Command Center possui indicador
   de estado ativo; todos os demais itens são visuais e não navegáveis.

---

### US-02 — Visualizar o Command Center placeholder (P1)

**Como** desenvolvedor do Lançar.me,
**quero** que a rota `/` exiba o Command Center com conteúdo visual estático,
**para** validar o layout, hierarquia visual e fidelidade ao mockup aprovado.

**Cenários de aceite**:

1. **Given** que a aplicação está no Command Center, **when** a página carrega,
   **then** exibe boas-vindas, cards de visão geral, próximas ações, atividade
   recente, desempenho geral, progresso do lançamento e atalhos rápidos — todos
   com dados estáticos, em PT-BR.
2. **Given** que a página está carregada, **when** o desenvolvedor inspeciona
   visualmente, **then** o layout é fiel à referência aprovada em
   `docs/design-references/bloco-02-command-center-approved.png`.

---

### US-03 — Usar a shell em dispositivos menores (P2)

**Como** desenvolvedor do Lançar.me,
**quero** que a shell seja responsiva,
**para** garantir que a estrutura base funcione em tablet e mobile sem quebrar.

**Cenários de aceite**:

1. **Given** um viewport de tablet ou mobile, **when** a página carrega,
   **then** a sidebar está oculta e um botão de menu está visível na topbar.
2. **Given** que a sidebar está oculta em mobile, **when** o usuário aciona o
   botão de menu, **then** um drawer lateral abre com os itens de navegação.
3. **Given** que o drawer está aberto, **when** o usuário seleciona um item ou
   toca fora do drawer, **then** o drawer fecha.

---

### US-04 — Garantir acessibilidade básica (P2)

**Como** desenvolvedor do Lançar.me,
**quero** que os componentes da shell tenham acessibilidade básica,
**para** que o produto seja inclusivo desde a fundação.

**Cenários de aceite**:

1. **Given** que a sidebar está renderizada, **when** o desenvolvedor navega
   por teclado, **then** os controles interativos reais (botão hambúrguer na
   topbar, botão fechar drawer) são focáveis com `Tab` e o foco é visível.
   Os itens da sidebar não recebem foco neste bloco — não há navegação funcional
   entre módulos, portanto nenhum item de navegação é interativo.
2. **Given** um leitor de tela, **when** a topbar é lida, **then** os elementos
   interativos têm labels acessíveis adequados.
3. **Given** qualquer card ou componente visual, **when** verificado com
   ferramenta de contraste, **then** o contraste texto/fundo atende WCAG AA.

---

### US-05 — Proteger o escopo do bloco (P3)

**Como** mantenedor do produto,
**quero** que o Bloco 2 entregue apenas a shell e o design system,
**para** que nenhuma lógica real de negócio seja antecipada.

**Cenários de aceite**:

1. **Given** a conclusão do bloco, **when** o repositório é revisado,
   **then** não há autenticação real, chamada de API de domínio, workspace
   real, RBAC, billing, IA ou integração externa implementada.
2. **Given** a conclusão do bloco, **when** o build de produção é executado,
   **then** `npm run lint`, `npm run typecheck`, `npm run test` e
   `npm run build` passam sem erros.

---

## 4. Critérios de Aceite

| ID    | Critério                                                                              | Obrigatório |
|-------|---------------------------------------------------------------------------------------|-------------|
| CA-01 | Shell renderiza sidebar, topbar e área de conteúdo em desktop sem erros               | Sim         |
| CA-02 | Sidebar exibe todos os itens de navegação coerentes com a visão macro do produto       | Sim         |
| CA-03 | Itens de módulos futuros na sidebar são visuais e inativos — sem navegação ou rotas   | Sim         |
| CA-04 | Command Center exibe conteúdo demonstrativo em PT-BR fiel à referência visual aprovada, com identificação discreta de dados demonstrativos | Sim         |
| CA-05 | Em viewport mobile/tablet, sidebar se torna drawer recolhível                         | Sim         |
| CA-06 | Design system usa Tailwind CSS com tokens de cor azul como predominância              | Sim         |
| CA-07 | Componentes base (Button, Card, Badge, Avatar, etc.) estão disponíveis via shadcn/ui  | Sim         |
| CA-08 | Todos os textos da UI estão em PT-BR                                                  | Sim         |
| CA-09 | Foco visível em todos os elementos interativos navegados por teclado                  | Sim         |
| CA-10 | Contraste texto/fundo atende WCAG AA                                                  | Sim         |
| CA-11 | `npm run lint`, `npm run typecheck`, `npm run test` e `npm run build` passam          | Sim         |
| CA-12 | Nenhuma lógica de domínio, autenticação real ou chamada de API de negócio presente    | Sim         |
| CA-13 | Testes de componentes cobrem estados da shell (renderização, itens inativos, responsividade) | Sim         |
| CA-14 | Documentação impactada foi atualizada                                                 | Sim         |
| CA-15 | Módulos futuros na sidebar não têm rotas, links ou páginas — são puramente visuais e inativos | Sim         |
| CA-16 | Métricas, créditos, gráficos e progresso do Command Center têm identificação discreta de dados demonstrativos | Sim         |

---

## 5. Requisitos Funcionais

- **RF-001**: A aplicação MUST renderizar uma App Shell com sidebar lateral fixa
  em desktop, topbar superior e área de conteúdo principal.

- **RF-002**: A sidebar MUST exibir o logo do produto, agrupamentos de navegação
  e os seguintes itens coerentes com a visão macro do produto:
  - Command Center
  - Strategy Core
  - Launch Strategy Room
  - ConteúdoMatriz
  - Copy Room
  - Creative Room
  - Traffic Room
  - Funnel Map
  - Calendar & Execution
  - MentorFlow
  - Proof Vault
  - Analytics & AI Diagnosis
  - Configurações e Integrações
  - Billing & Créditos

- **RF-003**: A topbar MUST exibir: campo ou ícone de busca, indicador visual
  de créditos de IA (estático), ícone de notificações e avatar com nome de
  usuário (estáticos).

- **RF-004**: A URL raiz MUST exibir a página Command Center com conteúdo
  demonstrativo estático, acompanhado de identificação discreta de que os dados
  são demonstrativos (ex.: rótulo "Dados demonstrativos" ou "Visualização de
  exemplo" visível na interface), incluindo:
  - mensagem de boas-vindas com nome de usuário estático;
  - cards de visão geral (Receita, Leads, Vendas, ROAS — valores demonstrativos);
  - bloco de próximas ações (lista demonstrativa);
  - bloco de atividade recente (lista demonstrativa);
  - bloco de créditos de IA (indicação visual demonstrativa);
  - bloco de ações rápidas (botões visuais sem ação real);
  - área de desempenho geral (gráfico SVG estático demonstrativo);
  - bloco de progresso do lançamento (percentual demonstrativo).

- **RF-005**: Os itens de módulos futuros na sidebar MUST ser renderizados como
  referências visuais inativas. MUST NOT ter rotas associadas, links funcionais
  ou páginas correspondentes neste bloco. Ao interagir, MUST NOT produzir
  navegação, erro 404 ou tela em branco — o comportamento esperado é nenhuma
  ação ou feedback visual de item indisponível.

- **RF-006**: Em viewport menor que `1024px`, a sidebar MUST ser ocultada e
  substituída por um drawer recolhível acionado por botão na topbar.

- **RF-007**: O item de navegação ativo MUST ter estilo visual distinto dos
  demais itens.

- **RF-008**: Estados de loading, error e empty MUST ser tratados nos
  componentes onde a experiência visual depender deles (ex.: placeholder de
  carregamento de card, estado vazio de lista).

---

## 6. Requisitos Não Funcionais

- **RNF-001**: A UI MUST estar integralmente em PT-BR (labels, mensagens de
  estado, placeholders, tooltips e textos de ajuda).

- **RNF-002**: O design system MUST usar Tailwind CSS como base de estilização,
  sem CSS-in-JS.

- **RNF-003**: Componentes base MUST ser providos por shadcn/ui instalado sobre
  Radix UI, compatível com React + Vite.

- **RNF-004**: A paleta de cores MUST ter azul como cor predominante, com tons
  limpos e agradáveis, evitando saturação excessiva. Roxo não é a cor primária.

- **RNF-005**: Tipografia MUST ter hierarquia visual clara (tamanhos, pesos e
  espaçamentos distintos para título, subtítulo, corpo e legenda).

- **RNF-006**: Cards MUST ter bordas suaves, sombras discretas e aparência leve.

- **RNF-007**: A shell MUST ser responsiva nos breakpoints `sm` (≥640px),
  `md` (≥768px), `lg` (≥1024px) e `xl` (≥1280px) do Tailwind.

- **RNF-008**: Todos os elementos interativos MUST ter foco visível compatível
  com navegação por teclado.

- **RNF-009**: O contraste de texto sobre fundo MUST atender o nível WCAG AA
  (mínimo 4.5:1 para texto normal, 3:1 para texto grande).

- **RNF-010**: Componentes MUST ser reutilizáveis e organizados em
  `components/ui/`, `components/layout/` e `components/shared/` conforme a
  arquitetura em `docs/architecture.md`.

- **RNF-011**: Nenhuma lógica crítica de domínio MUST existir em componente
  React. O frontend neste bloco é puramente visual.

- **RNF-012**: O código MUST ser tipado sem uso de `any` sem justificativa.

- **RNF-013**: O build de produção MUST passar em `lint`, `typecheck`, `test` e
  `build` sem erros.

- **RNF-014**: A estrutura de arquivos MUST seguir a convenção definida em
  `docs/architecture.md` (seção 5), preparada para crescimento modular.

---

## 7. Limites de Escopo

### Incluído neste bloco

- Design system inicial (tokens Tailwind, paleta, tipografia, shadcn/ui base).
- App Shell: sidebar, topbar, área de conteúdo.
- Comportamento responsivo com drawer para mobile/tablet.
- Página Command Center com conteúdo 100% demonstrativo e estático.
- Sidebar com itens visuais dos módulos futuros (inativos, sem navegação real).
- Testes de componentes para a shell e seus estados principais.
- Atualização da documentação impactada.

### Explicitamente fora deste bloco

| Item                                                        | Bloco destino                    |
|-------------------------------------------------------------|----------------------------------|
| Roteamento real entre módulos (React Router ou equivalente) | Bloco 4 ou bloco de cada módulo  |
| Rotas e páginas placeholder para módulos futuros            | Bloco de cada módulo             |
| Autenticação, login, cadastro, logout, sessão real          | Bloco 4 — Auth Foundation        |
| Rotas protegidas reais com guard de auth                    | Bloco 4 — Auth Foundation        |
| Workspace real, seleção de workspace                        | Bloco 5 — Workspace & RBAC       |
| RBAC e permissões reais                                     | Bloco 5 — Workspace & RBAC       |
| Migrações de banco, Flyway, modelos de dados                | Bloco 3 — Database & Flyway      |
| Novas APIs de negócio no backend                            | Blocos 6–40                      |
| IA real, créditos reais, consumo real                       | Blocos 9–10                      |
| Geração de conteúdo, copy, criativos ou planos              | Blocos 12, 15, 17, 19 e seguintes|
| Billing real e planos                                       | Bloco 28                         |
| Upload de arquivos                                          | Bloco 31                         |
| Integrações externas                                        | Blocos específicos                |
| Métricas reais de campanha                                  | Bloco 23                         |
| Persistência de preferências visuais                        | Bloco futuro                     |
| Gráficos interativos com dados reais                        | Bloco 23                         |
| Tema escuro                                                 | Bloco futuro (não priorizado)    |

---

## 8. Dependências e Impactos Técnicos

### Dependências de entrada

- **Bloco 1 concluído e aprovado**: o monorepo `lancarme-web` com React +
  TypeScript + Vite deve estar operacional. Este bloco assume que a estrutura
  base do frontend existe e o `npm run dev` funciona.

### Pacotes novos a instalar no `lancarme-web`

| Pacote                      | Finalidade                                    |
|-----------------------------|-----------------------------------------------|
| `shadcn/ui` (CLI)           | Componentes base via Radix UI                 |
| `@radix-ui/react-*`         | Primitivas de UI (instaladas pelo shadcn)     |
| `lucide-react`              | Ícones                                        |
| `class-variance-authority`  | Variantes de componentes (CVA)                |
| `clsx` + `tailwind-merge`   | Merge de classes Tailwind                     |

`react-router-dom` **não é instalado neste bloco**. Não há rotas para módulos
futuros. O Command Center é renderizado diretamente como conteúdo da App Shell,
sem roteador. Quando o primeiro módulo real for implementado (Bloco 3+), o
roteador será adicionado junto com as rotas reais.

> **Decisão de abordagem shadcn/ui**: shadcn/ui é a escolha recomendada para
> React + Vite porque gera os componentes diretamente no repositório (sem lock
> de biblioteca), usa Radix UI como base de acessibilidade e integra nativamente
> com Tailwind CSS. Os componentes ficam em `components/ui/` e podem ser
> modificados livremente conforme o design system evolui.

### Impactos no projeto

- `lancarme-web/src/` receberá a estrutura de pastas definitiva conforme
  `docs/architecture.md` (seção 5), consolidando o que foi parcialmente criado
  no Bloco 1.
- O `tailwind.config.*` será configurado com os tokens de cor, tipografia e
  espaçamento do design system do Lançar.me.
- O `App.tsx` será reescrito para renderizar a App Shell com o Command Center como conteúdo ativo. Sem roteador neste bloco.
- Nenhuma alteração no `lancarme-api` é necessária neste bloco.
- Nenhuma migração de banco de dados é necessária neste bloco.
- O `docker-compose.yml` não precisa de alteração neste bloco.

### Impactos em testes existentes

- Os testes do Bloco 1 (healthcheck, status API) não devem ser quebrados.
- Se o componente de status da API existente precisar ser adaptado para a nova
  shell, o teste correspondente deve ser atualizado junto.

---

## 9. Direção Visual e UX

### Referência visual

A imagem `docs/design-references/bloco-02-command-center-approved.png` é a
referência visual aprovada para este bloco. O layout, a hierarquia de cards,
os agrupamentos de navegação na sidebar e a estrutura geral da topbar devem
seguir este mockup.

### Princípios visuais obrigatórios

**Paleta de cores**:
- Cor primária: azul (ex.: `blue-600` / `blue-700` como referência Tailwind).
- Sidebar: fundo azul escuro ou azul-marinho, com itens brancos/claros.
- Topbar: fundo claro (branco ou cinza muito claro), minimalista.
- Área de conteúdo: fundo claro (off-white ou cinza 50).
- Cards: fundo branco, bordas `border-gray-100` ou `border-gray-200`, sombra
  `shadow-sm`.
- Estados ativos na sidebar: destaque em azul mais claro ou fundo de realce
  sutil sobre item ativo.
- Roxo não é cor primária deste produto.

**Tipografia**:
- Fonte sans-serif limpa (Inter ou equivalente via Google Fonts / sistema).
- Hierarquia clara: heading (`text-xl`/`text-2xl` bold), subheading
  (`text-base`/`text-lg` semibold), corpo (`text-sm`/`text-base` regular),
  legenda (`text-xs` regular muted).

**Componentes shadcn/ui instalados neste bloco**:

Os seguintes 6 componentes são os únicos instalados via CLI do shadcn/ui neste bloco:

| Componente  | Justificativa de uso                                           |
|-------------|----------------------------------------------------------------|
| `button`    | Controles funcionais (fechar drawer, hambúrguer) e estados `disabled` |
| `card`      | MetricCard e painéis do Command Center                         |
| `badge`     | Identificação demonstrativa, status de itens, badge de créditos |
| `avatar`    | Avatar do usuário na topbar e no rodapé da sidebar             |
| `separator` | Divisor entre grupos de navegação na sidebar                   |
| `sheet`     | Drawer mobile (painel deslizante lateral)                      |

> **`skeleton` não é instalado**: não há estados complexos de carregamento neste bloco
> que justifiquem o componente. O `ApiStatusIndicator` usa classes Tailwind para
> o estado de loading, sem necessidade de Skeleton shadcn.
>
> **`tooltip` não é instalado**: itens inativos ou demonstrativos devem ser
> explicitamente identificados com "Em breve", "Dados demonstrativos" ou equivalente.
> Usar tooltip para mascarar a indisponibilidade de um controle decorativo cria
> a aparência falsa de interatividade. Apenas componentes realmente utilizados
> na App Shell e no Command Center placeholder são adicionados.

**Componentes visuais**:
- Cards com `rounded-lg`, `border`, `shadow-sm`, padding interno generoso.
- Badges com cores semânticas (verde para positivo, amarelo para atenção,
  azul para informação).
- Botões com border-radius consistente e estados hover/focus nítidos.
- Ícones do Lucide React para consistência.

**Associação emocional**:
- Visual de ferramenta profissional de gestão de performance e lançamentos.
- "Sala de guerra com IA" — limpa, orientada à ação, confiável.
- Não copiar identidade visual de terceiros. Inspiração é permitida; cópia não.

### UX da shell

- A sidebar deve ter um agrupamento visual claro por área funcional
  (ex.: separar módulos de estratégia, produção de conteúdo, analytics,
  sistema/configurações).
- O item ativo deve ser imediatamente reconhecível sem ambiguidade.
- A topbar deve ser discreta e não competir com o conteúdo principal.
- Em mobile, o drawer deve ter overlay escurecido no fundo e fechamento por
  toque fora da área.
- Transições de abertura/fechamento do drawer devem ser suaves (150–200ms).
- O componente `ApiStatusIndicator` usa classes Tailwind para estado de
  loading — sem skeleton shadcn neste bloco.

---

## 10. Estratégia Mínima de Testes

### Ferramentas

- **Vitest** + **React Testing Library** para testes de componente.
- Cobertura focada na shell e nos componentes de layout mais críticos.
- E2E com Playwright não é obrigatório neste bloco, mas a estrutura de testes
  E2E deve ser mantida sem quebra.

### Testes obrigatórios neste bloco

| ID     | Descrição                                                                                           | Tipo        |
|--------|-----------------------------------------------------------------------------------------------------|-------------|
| T-01   | `AppShell` renderiza sidebar, topbar e área de conteúdo sem erro                                    | Componente  |
| T-02   | `Sidebar` exibe todos os itens de navegação esperados                                               | Componente  |
| T-03   | `Sidebar` marca somente o item Command Center como ativo; demais itens não têm estado ativo         | Componente  |
| T-04   | Em viewport mobile (mock de `window.innerWidth < 1024`), sidebar está oculta                        | Componente  |
| T-05   | Botão de menu na topbar abre o drawer em viewport mobile                                            | Componente  |
| T-06   | Fechar drawer por clique no overlay ou botão de fechar funciona                                     | Componente  |
| T-07   | `CommandCenterPage` renderiza todos os blocos demonstrativos (boas-vindas, cards, ações, etc.) com identificação de dados demonstrativos | Componente  |
| T-08   | Itens de navegação na sidebar são focáveis por teclado (acessibilidade básica)                      | Componente  |
| T-09   | Itens de módulos futuros na sidebar são visualmente inativos e não disparam navegação               | Componente  |
| T-10   | `npm run lint`, `npm run typecheck` e `npm run build` passam sem erro                               | Build/CI    |

### O que não precisa de teste neste bloco

- Lógica de negócio (não existe neste bloco).
- Integração com API (não existe neste bloco).
- Autenticação (não existe neste bloco).
- E2E de fluxo de usuário real (não existe neste bloco).

---

## 11. Riscos

| ID   | Risco                                                                               | Probabilidade | Impacto | Mitigação                                                                                                 |
|------|-------------------------------------------------------------------------------------|---------------|---------|-----------------------------------------------------------------------------------------------------------|
| R-01 | Incompatibilidade entre versão do Tailwind CSS e configuração do shadcn/ui no Vite  | Média         | Alto    | Verificar versão exata antes de instalar; preferir Tailwind v3 + shadcn estável se Tailwind v4 tiver issues com Vite |
| R-02 | Sidebar com muitos itens fica ilegível em resoluções menores de desktop              | Baixa         | Médio   | Usar agrupamentos colapsáveis ou espaçamento compacto; testar em 1024px e 1280px                         |
| R-03 | Fidelidade ao mockup subestimada; implementação diverge muito do aprovado            | Média         | Médio   | Revisar a imagem aprovada durante implementação; validar visualmente antes de fechar o bloco             |
| R-04 | Tokens de cor definidos agora podem precisar de ajuste nos blocos futuros            | Alta          | Baixo   | Documentar tokens no `tailwind.config.*` com nomes semânticos; ajustes futuros são aceitáveis           |
| R-05 | Testes de layout responsivo são difíceis com JSDOM padrão do Vitest                  | Média         | Baixo   | Usar mock de `window.matchMedia` e `window.innerWidth`; aceitar cobertura parcial para responsividade   |
| R-06 | A estrutura de pastas definida agora conflita com arquivos do Bloco 1               | Baixa         | Médio   | Revisar o que foi criado no Bloco 1 antes de reorganizar; não excluir sem verificar                      |

---

## 12. Impacto em Documentação

| Documento                  | Ação necessária                                                                                         |
|----------------------------|---------------------------------------------------------------------------------------------------------|
| `docs/architecture.md`     | Confirmar que a estrutura `lancarme-web/src/` implementada reflete a seção 5 do documento              |
| `README.md`                | Atualizar com instruções para rodar o frontend com a nova shell (se houver comandos novos)             |
| `AGENTS.md`                | Atualizar a referência ao `plan.md` ativo para apontar para `specs/002-design-system-app-shell/plan.md`|
| `specs/002-design-system-app-shell/plan.md` | Criar antes da implementação                                                          |
| `specs/002-design-system-app-shell/tasks.md`| Criar antes da implementação                                                         |

Documentos que **não precisam de alteração** neste bloco: `docs/security-lgpd.md`,
`docs/qa-strategy.md`, `docs/product-vision.md`, `docs/roadmap-operacional.md`,
`.specify/memory/constitution.md`.

---

## 13. Confirmação Explícita de Não-Funcionalidades

Este bloco **não implementa** e **não deve implementar**:

- Roteamento entre módulos (React Router DOM ou equivalente).
- Rotas para módulos futuros (Strategy Core, Launch, ConteúdoMatriz, Copy Room, etc.).
- Páginas placeholder de módulos ainda inexistentes.
- Autenticação, login, cadastro, sessão ou JWT.
- Rotas protegidas com guard real de autenticação.
- Workspace real ou seleção de workspace.
- RBAC ou verificação de permissão real.
- Chamadas à API `lancarme-api` além do healthcheck existente. O healthcheck
  **continua presente e visível** neste bloco por meio do componente
  `ApiStatusIndicator` integrado discretamente na topbar. A shell renderiza
  normalmente independentemente do estado da API — a dependência de carregamento
  é inexistente —, mas o indicador visual é **obrigatório** e exibe três estados:
  "Consultando API" (loading), "API operacional" (sucesso) e "API indisponível"
  (erro). Nenhum contrato de backend é alterado e nenhum endpoint novo é criado.
  Esta é a forma aprovada de preservar visualmente a entrega do Bloco 1.
- Banco de dados de domínio, migrações Flyway novas ou novos endpoints Spring.
- IA real, créditos reais ou consumo de créditos.
- Geração de conteúdo, copy, criativos ou planos.
- Billing real ou planos de assinatura.
- Upload de arquivos.
- Integrações externas (Meta Ads, Google Ads, Hotmart, etc.).
- Métricas reais de campanha.
- Persistência de preferências visuais (tema, idioma).
- Multitenancy real.

Todo número, métrica, nome de usuário, crédito de IA, percentual de progresso
e lista de ações exibidos no Command Center são **valores estáticos hard-coded**
neste bloco, existindo apenas para validar o design system e a shell visual.
