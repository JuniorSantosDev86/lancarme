# Lançar.me — Spec Kit Documentation Pack

Este pacote contém a documentação-base para iniciar o **Lançar.me** usando **GitHub Spec Kit**, **Codex** e **Claude Code**, com arquitetura profissional orientada a carreira: **frontend React/TypeScript** separado e **backend Java/Spring Boot**.

O objetivo é evitar um projeto improvisado. O Lançar.me deve nascer como um SaaS grande, modular, seguro, testável, documentado e preparado para produção, mesmo sendo executado por um único humano com apoio de agentes de IA.

## Decisão técnica atual

- **Frontend:** React + TypeScript + Vite.
- **UI:** Tailwind CSS + shadcn/ui/Radix UI.
- **Backend principal:** Java 21 + Spring Boot 3.
- **API:** REST versionada inicialmente.
- **Banco:** PostgreSQL.
- **Migrations:** Flyway.
- **ORM:** Spring Data JPA/Hibernate.
- **Auth:** Spring Security + JWT/Refresh Token, com possibilidade futura de provider externo.
- **Cache/fila inicial:** Redis quando necessário.
- **IA:** AI Gateway no backend Java, com provedores plugáveis.
- **Python:** não é backend principal; pode entrar futuramente como worker especializado para IA, embeddings, processamento pesado ou análise de documentos.
- **Infra:** VPS Hostinger KVM 2/KVM 4, Docker Compose, Cloudflare, Caddy/Nginx, R2, Resend, PostgreSQL, Redis.
- **Testes:** JUnit 5, Mockito, Testcontainers, Vitest, React Testing Library, Cypress/Playwright.

## Como usar este pacote com Spec Kit

1. Crie o repositório local:

```bash
mkdir lancarme
cd lancarme
git init
```

2. Inicialize o Spec Kit com integração do agente que você vai usar:

```bash
uvx --from git+https://github.com/github/spec-kit.git specify init . --integration codex --integration-options="--skills"
```

3. Copie o arquivo `.specify/memory/constitution.md` deste pacote para o mesmo caminho no seu projeto.

4. Copie `AGENTS.md` para a raiz do repositório.

5. Copie a pasta `docs/` para a raiz do repositório.

6. Use os prompts da pasta `speckit_prompts/` dentro do Codex ou Claude Code.

7. Comece pelo fluxo:

```txt
/speckit.constitution
/speckit.specify
/speckit.clarify
/speckit.checklist
/speckit.plan
/speckit.tasks
/speckit.analyze
/speckit.implement
```

## Ordem recomendada

1. Leia `docs/product-vision.md`.
2. Leia `docs/architecture.md`.
3. Leia `docs/security-lgpd.md`.
4. Leia `docs/ai-credit-model.md`.
5. Leia `docs/qa-strategy.md`.
6. Use `speckit_prompts/01-constitution.prompt.md`.
7. Use `speckit_prompts/02-master-specify.prompt.md` como visão macro.
8. Use `specs/001-platform-foundation/` para começar o primeiro bloco real.

## Regra principal

O produto pode ser grande. O bloco não.

Cada etapa deve entregar uma fatia testável, segura e documentada, sem quebrar a arquitetura e sem abrir mão de segurança, LGPD, testes e qualidade profissional.
