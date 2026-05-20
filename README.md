# Lançar.me

O **Lançar.me** é uma plataforma SaaS para ajudar infoprodutores, mentores, experts, coprodutores, agências e profissionais de marketing digital a planejarem, criarem e organizarem lançamentos digitais com apoio de inteligência artificial.

A ideia do projeto é centralizar em um só lugar partes importantes de uma operação de lançamento, como estratégia, conteúdo, copy, criativos, tráfego, funil, calendário, métricas, acompanhamento pós-venda e provas sociais.

## Objetivo do projeto

O objetivo do Lançar.me é transformar uma ideia ou produto digital em uma campanha mais organizada, com processos claros e materiais bem estruturados.

A plataforma deve ajudar o usuário a:

- estruturar produto, avatar e oferta;
- planejar lançamentos digitais;
- criar conteúdos para diferentes fases do funil;
- gerar copy para páginas, anúncios, e-mails e WhatsApp;
- organizar criativos e ideias de campanha;
- planejar tráfego pago;
- acompanhar tarefas e prazos;
- registrar métricas do lançamento;
- acompanhar alunos ou clientes no pós-venda;
- armazenar provas sociais para campanhas futuras.

## Módulos previstos

O produto será dividido em módulos, entre eles:

- **Command Center:** painel principal da operação;
- **Strategy Core:** produto, avatar, promessa e oferta;
- **Launch Room:** planejamento do lançamento;
- **ConteúdoMatriz:** geração e reaproveitamento de conteúdo;
- **Copy Room:** criação de textos de venda;
- **Creative Room:** ideias, briefings e ângulos de criativos;
- **Traffic Room:** planejamento de tráfego e campanhas;
- **Funnel Map:** organização dos ativos do funil;
- **Calendar & Execution:** tarefas, prazos e execução;
- **MentorFlow:** acompanhamento pós-venda;
- **Proof Vault:** organização de depoimentos e provas sociais;
- **Analytics:** métricas, diagnósticos e relatórios.

## Stack principal

O projeto será desenvolvido com frontend e backend separados.

### Frontend

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui ou Radix UI
- TanStack Query
- React Hook Form
- Zod

### Backend

- Java 21
- Spring Boot 3
- Spring Security
- Spring Data JPA
- PostgreSQL
- Flyway
- JUnit
- Testcontainers

### Infraestrutura

- Docker
- Docker Compose
- VPS Linux
- Cloudflare
- Storage compatível com S3/R2
- CI/CD futuramente

## Arquitetura inicial

A estrutura principal esperada para a fundação técnica é:

```txt
lancarme/
  lancarme-web/   # Frontend React + TypeScript
  lancarme-api/   # Backend Java + Spring Boot
  docs/           # Documentação técnica e de produto
  specs/          # Especificações das funcionalidades
  docker-compose.yml
  AGENTS.md
  README.md
```

Checklists e contratos de API podem existir como documentação auxiliar dentro de `specs/`, mas não fazem parte da estrutura mínima principal exigida para o Bloco 1.

## Segurança e LGPD

O projeto será construído com atenção a segurança, privacidade e LGPD desde o início.

Alguns princípios importantes:

- autenticação e autorização no backend;
- isolamento de dados por workspace;
- validação server-side;
- controle de permissões;
- logs de auditoria;
- controle de créditos de IA;
- arquivos privados por padrão;
- cuidado com dados pessoais e provas sociais;
- documentação de decisões técnicas.

## Inteligência Artificial

A IA será usada como apoio para gerar e organizar materiais de lançamento, como:

- planos de campanha;
- conteúdos;
- copies;
- criativos;
- diagnósticos;
- relatórios;
- sugestões de melhoria.

O uso da IA será controlado por créditos, evitando consumo ilimitado e mantendo previsibilidade de custo.

## Status do projeto

O projeto está em fase inicial de documentação, arquitetura e fundação técnica.

A primeira etapa de implementação será a criação da base do projeto, incluindo:

- estrutura monorepo;
- frontend React;
- backend Spring Boot;
- banco PostgreSQL;
- Docker Compose;
- healthcheck da API;
- tela inicial consumindo a API;
- testes iniciais;
- documentação básica.

## Autor

Desenvolvido por **Ademir dos Santos Junior**.

Projeto criado como iniciativa de produto SaaS e também como portfólio prático de desenvolvimento full stack, backend Java, frontend React, QA, DevOps, segurança e arquitetura de software.
