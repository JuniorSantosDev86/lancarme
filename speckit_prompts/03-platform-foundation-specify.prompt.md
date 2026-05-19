# Prompt para `/speckit.specify` — Bloco 1 Platform Foundation

```txt
Especifique a primeira feature/bloco do Lançar.me: Platform Foundation.

Objetivo:
Criar a fundação técnica inicial em monorepo, com frontend React/TypeScript/Vite e backend Java 21/Spring Boot 3, preparados para evolução modular, testes, documentação, Docker Compose, PostgreSQL e healthcheck.

Entregas esperadas:
- estrutura monorepo com lancarme-web e lancarme-api;
- README principal;
- AGENTS.md;
- docs base;
- docker-compose.yml com PostgreSQL;
- backend Spring Boot com /api/v1/health;
- frontend React com tela inicial em PT-BR consumindo healthcheck;
- configuração de lint/typecheck/test/build;
- estrutura modular inicial;
- .env.example para frontend e backend;
- testes mínimos de healthcheck no backend;
- teste mínimo de renderização no frontend.

Critérios de aceite:
- backend sobe localmente;
- frontend sobe localmente;
- PostgreSQL sobe via Docker Compose;
- healthcheck retorna status UP;
- frontend mostra status da API;
- nenhum secret real no Git;
- README explica como rodar;
- código respeita constitution;
- estrutura prepara módulos futuros sem implementar funcionalidades fora do bloco.

Não implementar ainda:
- auth completa;
- billing;
- IA real;
- módulos de produto;
- upload;
- pagamentos.
```
