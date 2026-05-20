# Data Model: Platform Foundation

Este bloco nao cria entidades de negocio persistidas. O objetivo e definir contratos pequenos de fundacao, configuracao local e estrutura modular futura.

## Status da API

**Purpose**: Representar a disponibilidade operacional basica do backend para validacao local e para a tela inicial tecnica do frontend.

**Persistence**: Nao persistido.

**Fields**:

| Field | Type | Required | Rules |
|-------|------|----------|-------|
| `status` | string | yes | Valor esperado inicial: `UP`. Deve ser estavel para consumo da UI. |
| `service` | string | yes | Valor esperado: `lancarme-api`. |
| `version` | string | yes | Versao tecnica da aplicacao, inicialmente `0.1.0` ou valor equivalente definido no build. |

**Validation rules**:

- Nao incluir hostname, IP, usuario, workspace, datasource, credenciais, stack trace ou detalhes de ambiente.
- Nao depender de autenticacao.
- Nao depender de dados de negocio.

**State transitions**:

- `loading`: estado frontend enquanto a chamada esta em andamento.
- `available`: API respondeu `200 OK` com contrato valido.
- `unavailable`: API indisponivel, timeout, erro de rede ou resposta invalida.

## Configuracao de Ambiente Local

**Purpose**: Documentar variaveis necessarias para execucao local sem versionar secrets reais.

**Persistence**: Arquivos `.env.example` versionados; arquivos `.env` reais nao versionados.

**Backend expected variables**:

| Variable | Required | Example Value | Notes |
|----------|----------|---------------|-------|
| `SPRING_PROFILES_ACTIVE` | yes | `local` | Perfil local. |
| `SERVER_PORT` | yes | `8080` | Porta da API. |
| `DATABASE_URL` | yes | `jdbc:postgresql://localhost:5432/lancarme` | URL local. |
| `DATABASE_USERNAME` | yes | `lancarme_local` | Usuario local sem segredo real. |
| `DATABASE_PASSWORD` | yes | `changeme_local_only` | Placeholder seguro. |
| `APP_VERSION` | yes | `0.1.0` | Usado no healthcheck. |

**Frontend expected variables**:

| Variable | Required | Example Value | Notes |
|----------|----------|---------------|-------|
| `VITE_API_BASE_URL` | yes | `http://localhost:8080/api/v1` | Base URL versionada da API. |

**Validation rules**:

- `.env.example` nao pode conter chaves reais, tokens, senhas reais ou endpoints privados.
- README deve orientar copiar `.env.example` para `.env`.
- `.env` deve estar ignorado pelo Git.

## Estrutura Modular Futura

**Purpose**: Preparar o repositorio para dominios futuros sem implementar regras de negocio neste bloco.

**Persistence**: Diretorios/pacotes e documentacao; sem tabelas de dominio.

**Backend modules planned**:

- `shared`
- `health`
- `auth`
- `workspace`
- `strategy`
- `launch`
- `contentmatrix`
- `copyroom`
- `creativeroom`
- `trafficroom`
- `funnelmap`
- `calendarexecution`
- `mentorflow`
- `proofvault`
- `analytics`
- `ai`
- `billing`

**Frontend modules planned**:

- `strategy`
- `launch`
- `content-matrix`
- `copy-room`
- `creative-room`
- `traffic-room`
- `funnel-map`
- `calendar-execution`
- `mentor-flow`
- `proof-vault`
- `analytics`
- `billing`
- `ai`

**Validation rules**:

- Modulos futuros podem existir como estrutura, mas nao devem conter regra funcional neste bloco.
- Nenhum modulo futuro deve expor endpoint, tela operacional ou regra de produto sem spec propria.
- Todo dado critico futuro deve pertencer a workspace, mas este bloco nao cria workspace real.
