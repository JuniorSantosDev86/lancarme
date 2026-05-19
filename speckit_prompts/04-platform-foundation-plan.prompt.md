# Prompt para `/speckit.plan` — Bloco 1 Platform Foundation

```txt
Planeje tecnicamente o Bloco 1 — Platform Foundation do Lançar.me.

Use obrigatoriamente:
- monorepo;
- lancarme-web com React + TypeScript + Vite;
- Tailwind preparado;
- lancarme-api com Java 21 + Spring Boot 3 + Maven;
- PostgreSQL via Docker Compose;
- Flyway configurado, mesmo sem migrations complexas;
- /api/v1/health no backend;
- frontend consumindo o healthcheck;
- .env.example para cada aplicação;
- testes mínimos: JUnit para healthcheck e Vitest/RTL para tela inicial;
- documentação no README.

A implementação deve seguir a constitution: segurança, LGPD, arquitetura limpa, testes, sem secrets, sem escopo extra.

O plano deve listar decisões técnicas, estrutura de pastas, contratos, riscos, comandos de validação e critérios de aceite.
```
