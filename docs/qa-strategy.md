# Lançar.me — QA Strategy

## 1. Filosofia

O Lançar.me deve ser construído como software profissional, com testes desde a fundação. Como o projeto será implementado com apoio de IA, QA precisa ser mais rígido que o normal.

Riscos críticos:

- vazamento entre workspaces;
- cobrança ou crédito incorreto;
- perda de dados;
- IA gerando output perigoso;
- upload inseguro;
- webhook duplicado;
- autorização fraca;
- regressão silenciosa.

## 2. Camadas de teste

### Backend unitário

Ferramentas:

- JUnit 5;
- Mockito;
- AssertJ.

Cobrir:

- services;
- regras de plano;
- cálculo de créditos;
- validações;
- policies;
- mappers;
- helpers.

### Backend integração

Ferramentas:

- Spring Boot Test;
- Testcontainers;
- PostgreSQL container;
- MockWebServer/WireMock para integrações externas.

Cobrir:

- repositories;
- controllers;
- auth;
- workspace isolation;
- webhooks;
- AI Gateway mock;
- file storage mock.

### Frontend unit/component

Ferramentas:

- Vitest;
- React Testing Library.

Cobrir:

- formulários;
- validação;
- empty state;
- loading;
- error state;
- componentes críticos;
- hooks.

### E2E

Ferramentas:

- Cypress ou Playwright.

Fluxos mínimos:

- registro/login/logout;
- criar produto;
- criar avatar;
- criar oferta;
- criar lançamento;
- gerar plano com IA mock;
- consumir créditos;
- bloquear sem créditos;
- criar copy;
- criar criativo;
- criar plano de tráfego;
- upload de prova;
- billing mock;
- workspace isolation.

## 3. QA manual

Validar:

- responsividade;
- linguagem PT-BR;
- clareza de erro;
- estados vazios;
- percepção premium;
- fluxos longos;
- acessibilidade básica;
- UX de créditos;
- UX de bloqueio por plano.

## 4. Critérios globais por bloco

- [ ] Escopo respeitado.
- [ ] UI em PT-BR.
- [ ] Regras críticas no backend.
- [ ] Dados filtrados por workspace.
- [ ] Testes adicionados/ajustados.
- [ ] Build passa.
- [ ] Logs sem secrets.
- [ ] Documentação atualizada.
- [ ] Riscos registrados.

## 5. Testes obrigatórios por módulo

### Auth

- cadastro;
- login;
- logout;
- refresh token;
- rota privada;
- senha inválida;
- rate limit futuro.

### Workspace

- criar workspace padrão;
- membership;
- roles;
- acesso cruzado negado.

### AI Credits

- saldo suficiente;
- saldo insuficiente;
- falha antes de provider;
- provider falha;
- output inválido;
- sucesso debita;
- corrida simples não gera saldo negativo.

### Billing

- plano free limita;
- upgrade libera;
- webhook idempotente;
- falha de pagamento restringe;
- histórico não vaza.

### File Upload

- tipo permitido;
- tipo bloqueado;
- tamanho máximo;
- URL privada;
- workspace errado bloqueado.

## 6. Definição de aprovação

Um bloco pode estar implementado, mas não aprovado.

Aprovação exige:

- testes rodados;
- critérios aceitos;
- nenhum bug P0/P1;
- riscos conhecidos;
- evidência mínima;
- documentação atualizada.
