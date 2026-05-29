# Lançar.me

O **Lançar.me** é uma plataforma SaaS para ajudar infoprodutores, mentores, experts, coprodutores, agências e profissionais de marketing digital a planejarem, criarem e organizarem lançamentos digitais com apoio de inteligência artificial.

O **Bloco 2 — Design System & App Shell** está implementado, validado e aprovado. A App Shell profissional com identidade predominantemente azul, sidebar desktop, drawer mobile, topbar e Command Center placeholder com dados 100% estáticos foi entregue e aprovada em QA visual.

O próximo passo oficial é o **Bloco 3 — Database & Flyway**.

## Pré-requisitos

- Java 21
- Maven ou Maven Wrapper funcional
- Node.js LTS
- npm
- Docker
- Docker Compose
- Git

## Estrutura

```txt
lancarme/
  lancarme-web/       # Frontend React + TypeScript + Vite
  lancarme-api/       # Backend Java 21 + Spring Boot 3
  docs/               # Documentação técnica e de produto
  specs/              # Especificações Spec Kit
  docker-compose.yml  # PostgreSQL local
  AGENTS.md
  README.md
```

## Arquivos de ambiente

Copie os exemplos antes de executar cada aplicação:

```bash
cp .env.example .env

cd lancarme-api
cp .env.example .env

cd ../lancarme-web
cp .env.example .env
```

Os arquivos `.env` reais são ignorados pelo Git. Os `.env.example` usam apenas placeholders locais seguros e não devem conter secrets reais, tokens privados ou endpoints sensíveis.

Backend:

```env
SPRING_PROFILES_ACTIVE=local
SERVER_PORT=8080
DATABASE_URL=jdbc:postgresql://localhost:5432/lancarme
DATABASE_USERNAME=lancarme_local
DATABASE_PASSWORD=changeme_local_only
APP_VERSION=0.1.0
```

Frontend:

```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

Compose local:

```env
POSTGRES_HOST_PORT=5432
```

O padrão do PostgreSQL local é publicar `127.0.0.1:5432`. Se a porta `5432` já estiver ocupada, copie `.env.example` para `.env` na raiz e altere `POSTGRES_HOST_PORT` para `5433` ou `15432`.

## PostgreSQL Local

Validar o Compose:

```bash
docker compose config
```

Iniciar somente o banco local:

```bash
docker compose up -d postgres
docker compose ps
```

O serviço se chama `postgres`, usa porta interna `5432`, publica por padrão `127.0.0.1:5432`, usa volume nomeado e mantém healthcheck com `pg_isready`.

Se a porta local `5432` estiver ocupada, use uma porta alternativa:

```bash
POSTGRES_HOST_PORT=5433 docker compose up -d postgres
```

Nesse caso, o backend precisa apontar `DATABASE_URL` para a mesma porta local:

```env
DATABASE_URL=jdbc:postgresql://localhost:5433/lancarme
```

## Backend

```bash
cd lancarme-api
cp .env.example .env
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```

A API fica disponível em:

```txt
http://localhost:8080
```

> **Importante — profile `local`**: o perfil `local` ativa a configuração de CORS que permite ao frontend em `http://localhost:5173` consumir o healthcheck da API. Sem esse perfil, a API responde normalmente ao `curl` e ao terminal, mas o navegador bloqueia as requisições do frontend por violação de CORS. O arquivo `.env.example` já inclui `SPRING_PROFILES_ACTIVE=local`; se copiar `.env.example` para `.env` e executar com `./mvnw spring-boot:run`, o perfil é carregado automaticamente via variável de ambiente.

Healthcheck manual:

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

Esse endpoint é **liveness da aplicação**. Ele não consulta PostgreSQL, não retorna readiness de infraestrutura e não expõe hostname, IP, datasource, workspace, usuário, secrets ou detalhes internos.

## Frontend

```bash
cd lancarme-web
cp .env.example .env
npm install
npm run dev
```

A aplicação web fica disponível em:

```txt
http://localhost:5173
```

A aplicação web exibe a App Shell completa do Lançar.me: sidebar azul com 15 módulos de navegação (somente Command Center ativo), topbar com indicador discreto de status da API, e o Command Center placeholder com dados estáticos e identificação de "Visualização demonstrativa".

**Não há `react-router-dom` instalado neste bloco.** O Command Center é o único conteúdo ativo, renderizado diretamente sem roteador. Os módulos futuros aparecem visualmente na sidebar como itens inativos ("Em breve"), sem navegação ou páginas correspondentes.

## CORS Local

No perfil `local`, a API permite CORS somente para:

```txt
http://localhost:5173
```

O CORS é restrito ao `GET /api/v1/health`. Não usar wildcard `*`.

**Sem o profile `local`, o frontend exibirá "API indisponível" no `ApiStatusIndicator`** mesmo que a API esteja rodando, porque o navegador bloqueará a requisição por CORS. A forma correta de executar o backend para desenvolvimento local é sempre com `SPRING_PROFILES_ACTIVE=local`.

## Testes e Build

Backend:

```bash
cd lancarme-api
./mvnw test
./mvnw verify
```

Frontend:

```bash
cd lancarme-web
npm run lint
npm run typecheck
npm run test
npm run build
```

Integração local:

```bash
docker compose config
```

## Troubleshooting

### PostgreSQL e Flyway

Se a API falhar ao iniciar por banco indisponível:

```bash
docker compose ps
docker compose logs postgres
docker compose up -d postgres
```

Depois reinicie a API para que o Flyway valide/aplique as migrations locais.

### Healthcheck

Se `curl http://localhost:8080/api/v1/health` falhar, valide se a API está rodando na porta `8080`. O endpoint de health da API não testa PostgreSQL; problemas de banco devem ser tratados pelos comandos de Docker Compose, pelo healthcheck `pg_isready` do container e pelos logs de startup/Flyway.

### Frontend

Se a tela web não conseguir consultar a API, confirme:

- frontend em `http://localhost:5173`;
- `VITE_API_BASE_URL=http://localhost:8080/api/v1`;
- backend em `http://localhost:8080`;
- CORS local sem wildcard, permitindo somente `http://localhost:5173`.

## Escopo Entregue — Bloco 2 (implementado, validado e aprovado)

Superfície entregue pelo Bloco 2:

- App Shell responsiva: sidebar desktop azul-navy profissional (`#16347a`), drawer mobile, topbar clara.
- Design system predominantemente azul com tokens semânticos em `tailwind.config.ts` (paleta polida em QA visual para eliminar matiz roxa/violeta residual).
- Command Center placeholder com dados 100% estáticos e identificação visível de "Visualização demonstrativa".
- `ApiStatusIndicator` integrado discretamente na topbar, preservando o healthcheck do Bloco 1.
- 15 módulos de navegação visualmente presentes na sidebar — somente Command Center ativo.
- shadcn/ui instalado com 6 componentes: `button`, `card`, `badge`, `avatar`, `separator`, `sheet`.
- 59 testes frontend passando (Vitest + RTL).
- 5 testes backend passando (JUnit 5), sem alterações funcionais no backend.

**QA visual aprovado**: desktop, tablet e mobile validados. Paleta azul clara, leve e profissional, coerente com o mockup aprovado em `docs/design-references/bloco-02-command-center-approved.png`.

## Próximo Passo — Bloco 3

O próximo bloco oficial é o **Bloco 3 — Database & Flyway**:

- PostgreSQL via Docker Compose (já presente, sem Flyway ainda).
- Flyway para migrations versionadas.
- Models base de domínio.
- Seed de desenvolvimento.
- Testcontainers inicial para testes de integração com banco real.

---

Este bloco confirma que não há:

- `react-router-dom` instalado — roteamento será adicionado no bloco em que o primeiro módulo real for implementado;
- rotas ou páginas para módulos futuros;
- auth, login, JWT, RBAC ou workspace real;
- billing, pagamentos ou webhooks;
- IA real, provider, prompt registry ou ledger de créditos;
- upload, storage ou arquivos privados;
- métricas ou dados reais de campanha;
- biblioteca de gráficos (gráfico de desempenho é SVG estático);
- mudanças funcionais no backend;
- Playwright instalado, configurado ou executado.

Playwright fica registrado apenas como decisão futura para E2E quando houver fluxo real de produto.

## Stack Principal

Frontend:

- React
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- Vitest
- React Testing Library
- shadcn/ui (Base UI + Radix)
- lucide-react
- clsx + tailwind-merge
- class-variance-authority

Backend:

- Java 21
- Spring Boot 3
- Spring Web
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- Bean Validation
- JUnit 5
- Mockito
- Testcontainers

## Autor

Desenvolvido por **Ademir dos Santos Junior**.
