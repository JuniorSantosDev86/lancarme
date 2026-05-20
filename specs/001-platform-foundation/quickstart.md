# Quickstart: Platform Foundation

Este quickstart descreve como a futura implementacao do Bloco 1 deve ser validada. Ele nao cria frontend, backend ou scaffolding por si so.

## Prerequisites

- Java 21
- Node.js LTS
- npm
- Docker
- Docker Compose
- Git

## Environment

Backend:

```bash
cd lancarme-api
cp .env.example .env
```

Valores locais esperados:

- `SPRING_PROFILES_ACTIVE=local`
- `SERVER_PORT=8080`
- `DATABASE_URL=jdbc:postgresql://localhost:5432/lancarme`
- `DATABASE_USERNAME=lancarme_local`
- `DATABASE_PASSWORD=changeme_local_only`
- `APP_VERSION=0.1.0`

Os valores acima sao exemplos locais seguros. `DATABASE_PASSWORD` deve ser tratado como placeholder de desenvolvimento e nao representa segredo real.

Frontend:

```bash
cd lancarme-web
cp .env.example .env
```

Valor local esperado:

- `VITE_API_BASE_URL=http://localhost:8080/api/v1`

Arquivos `.env` reais nao devem ser versionados. Os `.env.example` devem conter apenas placeholders seguros.

## Local Database

```bash
docker compose up -d postgres
docker compose ps
```

Validar configuracao do Compose:

```bash
docker compose config
```

## Backend

```bash
cd lancarme-api
./mvnw spring-boot:run
```

A API local deve iniciar na porta definida por `SERVER_PORT`, usando `8080` como valor local esperado:

```txt
http://localhost:8080
```

Healthcheck esperado:

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

O healthcheck e liveness da aplicacao: ele nao consulta PostgreSQL e nao retorna estado de infraestrutura.

## Frontend

```bash
cd lancarme-web
npm install
npm run dev
```

A aplicacao web local deve iniciar em:

```txt
http://localhost:5173
```

A tela inicial deve estar em PT-BR e mostrar:

- estado de carregamento enquanto consulta a API;
- estado operacional quando `GET /api/v1/health` retorna sucesso;
- mensagem clara de indisponibilidade quando a API nao responde.

No perfil local, o backend deve permitir CORS somente para `http://localhost:5173` no consumo de `GET /api/v1/health`. Nao usar CORS wildcard.

## Tests And Build

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

Playwright fica definido como ferramenta E2E padrao futura, mas nao deve ser instalado, configurado ou executado neste bloco.

## Troubleshooting

### PostgreSQL local

Se a API falhar ao iniciar por indisponibilidade do banco:

```bash
docker compose ps
docker compose logs postgres
docker compose up -d postgres
```

Depois reinicie a API para permitir que Flyway valide/aplique as migrations locais.

### Healthcheck

Se `curl http://localhost:8080/api/v1/health` falhar, valide primeiro se a API esta rodando na porta `8080`. Esse endpoint nao testa PostgreSQL; problemas de banco devem ser investigados pelos comandos de Docker Compose e pelo startup/Flyway da API.

### Frontend e CORS

Se a tela web nao conseguir consultar a API, confirme:

- frontend em `http://localhost:5173`;
- `VITE_API_BASE_URL=http://localhost:8080/api/v1`;
- backend em `http://localhost:8080`;
- CORS local sem wildcard, permitindo somente `http://localhost:5173`.

## Scope Guard

A implementacao do Bloco 1 deve conter apenas:

- estrutura monorepo;
- frontend base;
- backend base;
- PostgreSQL local via Docker Compose;
- Flyway configurado;
- endpoint `GET /api/v1/health`;
- tela inicial consumindo healthcheck;
- `.env.example` por aplicacao;
- testes minimos;
- README com comandos reais;
- estrutura modular preparada.

Nao implementar neste bloco:

- cadastro, login, JWT, roles ou workspace real;
- billing, pagamentos ou webhooks;
- IA real, providers, prompt registry ou ledger de creditos;
- upload ou storage;
- dashboard real;
- modulos Strategy, Launch, Content Matrix, Copy Room, Creative Room, Traffic Room, Funnel Map, Calendar & Execution, MentorFlow, Proof Vault ou Analytics.
