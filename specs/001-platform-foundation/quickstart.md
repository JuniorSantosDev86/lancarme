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

Frontend:

```bash
cd lancarme-web
cp .env.example .env
```

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

## Frontend

```bash
cd lancarme-web
npm install
npm run dev
```

A tela inicial deve estar em PT-BR e mostrar:

- estado de carregamento enquanto consulta a API;
- estado operacional quando `GET /api/v1/health` retorna sucesso;
- mensagem clara de indisponibilidade quando a API nao responde.

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
