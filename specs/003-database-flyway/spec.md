# Feature Specification: Database & Flyway

**Bloco**: 003  
**Nome**: Database & Flyway  
**Branch**: `003-database-flyway`  
**Criada em**: 2026-05-29  
**Status**: Pronta para planejamento

---

## 1. Resumo do Bloco

O Bloco 3 estabelece a fundação profissional de banco de dados e migrations do Lançar.me. Ele audita o que já existe (PostgreSQL via Docker Compose, Flyway configurado, migration V1 aplicada, datasource por variáveis de ambiente) e evolui a fundação de persistência com convenções formais, a classe base auditável `BaseEntity`, configuração de JPA Auditing e testes de integração com Testcontainers que validam Flyway e o schema em banco PostgreSQL real.

**Não haverá migration V2 neste bloco.** Não existem tabelas de domínio, nem extensões de banco necessárias, nem schema novo a criar — portanto, não há mudança real que justifique uma migration. A próxima migration será criada somente no primeiro bloco que introduzir uma necessidade real de schema de domínio, atualmente previsto no roadmap a partir do Bloco 4 — Auth Foundation.

**Não haverá seed executável neste bloco.** Seed de dados pressupõe tabelas de domínio. A política de seed é documentada para uso nos blocos seguintes.

A principal entrega executável do bloco é o primeiro teste de integração com PostgreSQL real via Testcontainers, validando que Flyway executa, que `flyway_schema_history` existe e que o contexto Spring inicializa com banco ativo. Tudo isso sem criar nenhuma funcionalidade de negócio.

---

## 2. Estado Atual Auditado

### 2.1 Migrations Existentes

| Arquivo | Conteúdo | Status |
|---------|----------|--------|
| `db/migration/V1__platform_foundation.sql` | Apenas comentário; zero DDL | Aplicada — imutável |

A migration V1 foi aplicada. O registro existe em `flyway_schema_history`. Não pode ser editada de nenhuma forma.

### 2.2 Configuração Flyway

- Habilitado globalmente em `application.yml` com `locations: classpath:db/migration`.
- Profile `local` repete `flyway.enabled: true` sem customizações.
- `out-of-order` não configurado (default `false`) — correto.
- Nenhum `baseline-on-migrate`, nenhum `repair`.

### 2.3 Configuração Datasource por Ambiente

| Chave | Fonte | Valor padrão (não-produção) |
|-------|-------|------------------------------|
| `spring.datasource.url` | `${DATABASE_URL}` | `jdbc:postgresql://localhost:5432/lancarme` |
| `spring.datasource.username` | `${DATABASE_USERNAME}` | `lancarme_local` |
| `spring.datasource.password` | `${DATABASE_PASSWORD}` | `changeme_local_only` |
| `spring.jpa.hibernate.ddl-auto` | `application.yml` | `validate` |
| `spring.jpa.open-in-view` | `application.yml` | `false` |

Não existe configuração de datasource para profile `test`. Testcontainers supre isso nos testes de integração via `@DynamicPropertySource`.

### 2.4 Dependências JPA / PostgreSQL / Testcontainers

Todas presentes no `pom.xml` sem necessidade de adição:

| Dependência | Escopo | Observação |
|-------------|--------|------------|
| `spring-boot-starter-data-jpa` | compile | JPA + Hibernate |
| `spring-boot-starter-validation` | compile | Bean Validation |
| `flyway-core` | compile | Gerenciado pelo BOM |
| `flyway-database-postgresql` | compile | Suporte PostgreSQL |
| `postgresql` (driver) | runtime | Gerenciado pelo BOM |
| `testcontainers` BOM | import | Versão 1.20.6 |
| `testcontainers:junit-jupiter` | test | Presente |
| `testcontainers:postgresql` | test | Presente |

**Nenhuma dependência nova é necessária neste bloco.**

### 2.5 Entities e Repositories Existentes

Nenhum. O backend contém apenas:

- `HealthController` — sem entidade
- `HealthResponse` — DTO do healthcheck
- `SecurityConfig` — configuração de segurança
- `CorsConfig` — configuração de CORS
- `LancarmeApplication` — bootstrap

### 2.6 Testes Backend Existentes

| Classe | Tipo | Testes | Status |
|--------|------|--------|--------|
| `HealthControllerTest` | `@WebMvcTest` | 4 | Passando — sem banco real |
| `LancarmeApplicationTest` | `@SpringBootTest` (sem DB/Flyway) | 1 | Passando — exclui DataSource, JPA e Flyway |

O `LancarmeApplicationTest` nunca testou banco real. Essa lacuna será preenchida neste bloco com `DatabaseFlywayIT`.

---

## 3. Objetivo Técnico

1. Formalizar a convenção de migrations para todos os blocos futuros.
2. Criar a classe base auditável `BaseEntity` (`@MappedSuperclass`) com `id`, `createdAt` e `updatedAt`.
3. Habilitar JPA Auditing via `@EnableJpaAuditing`.
4. Criar `DatabaseFlywayIT` — teste de integração com Testcontainers que valide migrations, `flyway_schema_history`, ausência de tabelas funcionais indevidas e contexto JPA com banco real.
5. Documentar a política de seed para uso nos blocos seguintes.
6. Garantir que healthcheck, testes existentes e App Shell do Bloco 2 não sofram regressão.

---

## 4. User Stories Técnicas

### TS-001 — Convenção de migrations documentada e aplicável (P1)

Como desenvolvedor implementando um módulo futuro, quero uma convenção clara de nomenclatura e regras de migrations para que eu saiba exatamente como criar, nomear e organizar novas migrations sem risco de conflito, corrupção de checksum ou perda de rastreabilidade.

**Critérios de aceite:**
- Convenção de nome documentada nesta spec e no plan.
- Regra de imutabilidade de migration aplicada explicitamente.
- Confirmação explícita de que nenhuma V2 será criada neste bloco.
- Política de seed documentada para uso futuro.

---

### TS-002 — Classe base auditável `BaseEntity` (P2)

Como desenvolvedor implementando entidades nos blocos seguintes, quero uma classe base abstrata com os campos auditáveis comuns (`id`, `createdAt`, `updatedAt`) para não repetir essa estrutura em cada entidade futura.

**Critérios de aceite:**
- `BaseEntity` existe em `br.com.lancarme.shared.entity`.
- Anotada com `@MappedSuperclass` e `@EntityListeners(AuditingEntityListener.class)`.
- Campos: `id` UUID (gerado em Java), `createdAt` Instant, `updatedAt` Instant.
- Não cria tabela, não tem repository, não tem endpoint.
- `@EnableJpaAuditing` habilitado em configuração em `shared/config/`.
- Compilação limpa sem warnings.

---

### TS-003 — Testcontainers: primeiro teste de integração com banco real (P1)

Como desenvolvedor, quero que o pipeline de testes backend execute pelo menos um teste de integração com PostgreSQL real em container para validar que as migrations executam, que o schema é compatível com o JPA configurado e que o contexto Spring inicializa corretamente com banco.

**Critérios de aceite:**
- Classe `DatabaseFlywayIT` existe em `lancarme-api/src/test/java/br/com/lancarme/` com `@SpringBootTest` + `@Testcontainers`.
- Usa `PostgreSQLContainer<>("postgres:16-alpine")`.
- Flyway executa as migrations no container sem erro.
- `flyway_schema_history` existe no schema e contém o registro da V1 com status `SUCCESS`.
- Nenhuma tabela funcional de domínio foi criada — verificado via `information_schema.tables`.
- Contexto Spring inicializa sem erros com banco real.
- `./mvnw test` NÃO executa `DatabaseFlywayIT` (Testcontainers não iniciado).
- `./mvnw verify` executa `DatabaseFlywayIT` com Testcontainers.

---

### TS-004 — Testes anteriores continuam passando (P1)

Como desenvolvedor, quero garantir que os 5 testes existentes do Bloco 1 continuem passando integralmente após as mudanças do Bloco 3.

**Critérios de aceite:**
- `HealthControllerTest` — 4/4 passando.
- `LancarmeApplicationTest` — 1/1 passando.
- 59 testes do frontend do Bloco 2 passando.
- Nenhuma regressão introduzida.

---

### TS-005 — Política de seed documentada (P3)

Como desenvolvedor, quero que a política de seed de desenvolvimento esteja formalmente documentada para que os blocos seguintes criem seeds de forma consistente, segura e sem risco de execução em produção.

**Critérios de aceite:**
- Política documentada nesta spec.
- Nenhum arquivo SQL de seed com dados reais criado neste bloco.
- Nenhum dado funcional de domínio antecipado.

---

## 5. Critérios de Aceite Gerais

- [ ] Migration V1 preservada intacta — sem edição de nenhum tipo.
- [ ] Nenhuma migration V2 criada — não há schema novo a justificá-la.
- [ ] Nenhuma tabela de domínio criada (sem `users`, `workspaces`, `workspace_members`, `products`, etc.).
- [ ] `BaseEntity` compilada em `shared/entity/` como `@MappedSuperclass`.
- [ ] `BaseEntity` sem tabela própria, sem repository, sem endpoint.
- [ ] `@EnableJpaAuditing` habilitado em `shared/config/`.
- [ ] `DatabaseFlywayIT` existe em `lancarme-api/src/test/java/br/com/lancarme/` e passa em `./mvnw verify`.
- [ ] Flyway executa a V1 no container Testcontainers sem erro.
- [ ] `flyway_schema_history` contém o registro da versão 1 aplicada com sucesso.
- [ ] Contexto Spring inicializa com banco real sem erros.
- [ ] `HealthControllerTest` — 4/4 passando (sem alteração).
- [ ] `LancarmeApplicationTest` — 1/1 passando (sem alteração).
- [ ] `./mvnw test` aprovado — `DatabaseFlywayIT` NÃO executado, Testcontainers NÃO iniciado.
- [ ] `./mvnw verify` aprovado — `DatabaseFlywayIT` executado com Testcontainers.
- [ ] `maven-failsafe-plugin` configurado para reconhecer e executar testes `*IT` nas fases `integration-test` e `verify` (confirmar ou adicionar no plan).
- [ ] Frontend Bloco 2 — 59/59 testes passando (sem alteração).
- [ ] `docker compose config` retorna configuração válida.
- [ ] `GET /api/v1/health` continua retornando `200 OK` com payload correto.
- [ ] Nenhum secret real ou PII em nenhum arquivo do bloco.
- [ ] Datasource configurado exclusivamente por variáveis de ambiente.
- [ ] Nenhum seed executável com dados de domínio criado.

---

## 6. Requisitos Funcionais

### RF-001 — Migration V1 imutável
A migration `V1__platform_foundation.sql` MUST NOT ser editada, renomeada ou movida. Qualquer alteração quebraria o checksum registrado em `flyway_schema_history`.

### RF-002 — Nenhuma migration nova neste bloco
Nenhuma migration V2 (ou qualquer outro número) MUST ser criada neste bloco. A ausência de tabelas de domínio, extensões necessárias e mudanças de schema é a justificativa direta. A próxima migration será criada somente no primeiro bloco que introduzir uma necessidade real de schema de domínio, atualmente previsto no roadmap a partir do Bloco 4 — Auth Foundation.

### RF-003 — Padrão de nomenclatura de migrations (para blocos futuros)
Migrations futuras MUST seguir o padrão `V<n>__<descricao_snake_case>.sql`, onde `<n>` é inteiro sequencial sem zero à esquerda desnecessário (V2, V3, ... V10, V11...) e `<descricao>` descreve o propósito em snake_case. O double underscore `__` é obrigatório.

### RF-004 — Classe base auditável `BaseEntity`
MUST existir `BaseEntity` em `br.com.lancarme.shared.entity` com:
- `@MappedSuperclass`
- `@EntityListeners(AuditingEntityListener.class)`
- `id`: `UUID`, anotado `@Id`, `@GeneratedValue(strategy = GenerationType.UUID)` — gerado em Java/JPA sem dependência de extensão PostgreSQL.
- `createdAt`: `Instant`, anotado `@CreatedDate`, `@Column(nullable = false, updatable = false)`.
- `updatedAt`: `Instant`, anotado `@LastModifiedDate`, `@Column(nullable = false)`.

### RF-005 — JPA Auditing habilitado
MUST existir uma classe de configuração em `br.com.lancarme.shared.config` anotada com `@EnableJpaAuditing`. Necessário para `@CreatedDate` e `@LastModifiedDate` funcionarem.

### RF-006 — Nenhum seed executável com dados de domínio
Nenhum script SQL com dados de domínio (`INSERT INTO users...`, `INSERT INTO workspaces...`, etc.) MUST ser criado neste bloco. Não existem tabelas de domínio para receber dados.

### RF-007 — Teste de integração com Testcontainers
MUST existir `DatabaseFlywayIT` em `lancarme-api/src/test/java/br/com/lancarme/` com:
- `@SpringBootTest` sem exclusão de DataSource, JPA ou Flyway.
- `@Testcontainers` com `PostgreSQLContainer<>("postgres:16-alpine")`.
- `@DynamicPropertySource` injetando URL, username e password do container.
- Pelo menos três testes: (1) contexto carrega com banco real; (2) Flyway executou a V1 com sucesso; (3) nenhuma tabela funcional de domínio foi criada — verificado via `information_schema.tables`, permitindo apenas `flyway_schema_history` no schema público.
- MUST ser executado apenas em `./mvnw verify` (Failsafe), nunca em `./mvnw test` (Surefire).

### RF-008 — Healthcheck sem regressão
`GET /api/v1/health` MUST continuar retornando `{"status":"UP","service":"lancarme-api","version":"0.1.0"}` sem nenhuma alteração de contrato, comportamento ou dependência.

### RF-009 — Datasource por variáveis de ambiente
Credenciais de banco MUST ser lidas de `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` em todos os ambientes. Defaults de desenvolvimento MAY existir nos arquivos YAML, mas MUST ser valores claramente não-produção. Nenhuma credencial real versionada.

---

## 7. Requisitos Não Funcionais

### RNF-001 — Sem regressão de testes existentes
`./mvnw test` MUST passar com 100% dos testes existentes do Bloco 1 (5/5). `npm run test` no frontend MUST passar com 59/59 testes do Bloco 2.

### RNF-002 — Build limpo
`./mvnw verify` MUST compilar sem erros e passar todos os testes (unitários + integração).

### RNF-003 — Migrations imutáveis após aplicação
Nenhuma migration já aplicada MUST ser editada. Alterações ao schema MUST ser feitas exclusivamente via nova migration incremental.

### RNF-004 — Testes de integração isolados por container
Cada execução de `LancarmeIntegrationTest` MUST usar container PostgreSQL isolado gerenciado pelo Testcontainers. Sem compartilhamento de estado com banco local.

### RNF-005 — Logs sem exposição de credenciais
Nenhum log de teste, Flyway, Hibernate ou Spring MUST expor senha, URL com credenciais inline, tokens ou secrets.

### RNF-006 — `open-in-view: false` mantido
`spring.jpa.open-in-view: false` MUST permanecer na configuração.

### RNF-007 — Sem entidade JPA como DTO público
`BaseEntity` e qualquer subclasse criada neste bloco MUST NOT ser exposta como resposta pública de endpoint.

### RNF-008 — Docker Compose válido
`docker compose config` MUST retornar configuração válida. O `docker-compose.yml` não é alterado neste bloco.

### RNF-009 — Separação de testes unitários e de integração
Testes unitários e `@WebMvcTest` MUST continuar rodando rápido em `./mvnw test`. `DatabaseFlywayIT` MUST rodar exclusivamente em `./mvnw verify` via `maven-failsafe-plugin`. Testcontainers NÃO DEVE ser iniciado durante `./mvnw test`. Docker é requisito apenas para a execução em `verify`. O plan MUST confirmar ou adicionar a configuração mínima do `maven-failsafe-plugin` para executar testes `*IT` nas fases `integration-test` e `verify`, caso ainda não esteja presente no `pom.xml`.

---

## 8. Decisão sobre Models Base Mínimos

### Decisão

Este bloco **NÃO** cria nenhuma entidade de domínio funcional. As seguintes entidades estão explicitamente vetadas:

| Entidade | Bloco correto |
|----------|--------------|
| `User` | Bloco 4 |
| `Workspace` | Bloco 5 |
| `WorkspaceMember` | Bloco 5 |
| `Product` | Bloco 6 |
| `Avatar` | Bloco 7 |
| `Offer` | Bloco 8 |
| Qualquer outra entidade funcional | Bloco correspondente |

### O único model autorizado: `BaseEntity`

A classe `BaseEntity` é o único "model" deste bloco. Ela é autorizada porque:

1. É `@MappedSuperclass` — **não cria tabela no banco**.
2. Não representa nenhum domínio de negócio.
3. É infraestrutura JPA reutilizável — os campos `id`, `createdAt` e `updatedAt` estariam em toda entidade de qualquer forma.
4. Sua ausência forçaria cada bloco a definir esses campos independentemente, criando inconsistência.

### Campos da `BaseEntity`

```
BaseEntity
  @MappedSuperclass
  @EntityListeners(AuditingEntityListener.class)
  ├── id: UUID         @Id @GeneratedValue(strategy = GenerationType.UUID)
  ├── createdAt: Instant  @CreatedDate @Column(nullable=false, updatable=false)
  └── updatedAt: Instant  @LastModifiedDate @Column(nullable=false)
```

**Estratégia de UUID**: geração em memória pelo Java/JPA com `GenerationType.UUID` (suportado nativamente no Java 21 + Spring Boot 3 / Hibernate 6). Não requer extensão PostgreSQL (`uuid-ossp`, `pgcrypto`). Portanto, nenhuma migration V2 com extensão é necessária.

### Sobre `workspaceId`

O campo `workspaceId` **não é incluído na `BaseEntity`**. A razão é:
- Nem toda entidade é multi-tenant (ex: `User` não tem `workspaceId` — ele *possui* workspaces via `WorkspaceMember`).
- Adicionar `workspaceId` na `BaseEntity` forçaria todo `id`/`createdAt`/`updatedAt` a carregar um campo que não pertence a todas as entidades.
- A convenção multi-tenant ficará documentada aqui para os blocos futuros: toda entidade cujos dados pertencem a um workspace específico DEVE incluir `workspaceId UUID NOT NULL` como coluna indexada, e seu repository DEVE filtrar por `workspaceId` em todas as queries.

---

## 9. Decisão sobre Seed de Desenvolvimento

### Decisão

**Nenhum seed executável será criado neste bloco.**

### Justificativa

Não existem tabelas de domínio no banco. Criar um script `dev-seed.sql` com `INSERT` statements sem tabelas de destino é sem propósito. Criar um arquivo vazio seria apenas formalismo sem valor.

### Política de seed para blocos futuros

A política abaixo é documentada aqui e aplica-se a partir do Bloco 4:

**Onde ficam os seeds**: `db/seed/dev-seed.sql` (separado de `db/migration/`).

**Como executar**: script manual via `psql` ou target Maven específico. O seed **não é executado pelo Flyway principal**. Não integrar ao `spring.flyway.locations` — o risco de execução em produção por misconfiguration é inaceitável.

**Regras absolutas e inegociáveis**:
- MUST NOT executar em produção por nenhum mecanismo automático.
- MUST NOT conter PII real, senhas reais, credenciais ou tokens.
- MUST NOT criar dados funcionais de módulos não especificados.
- MUST ser repetível: usar `ON CONFLICT DO NOTHING` ou equivalente.
- MUST usar dados claramente fictícios (ex: `dev@example.com`, `Dev User`).

**Quando criar o primeiro seed real**: no bloco em que a primeira tabela de domínio for criada e dados de desenvolvimento sejam genuinamente úteis para testes manuais locais (provavelmente Bloco 4 ou 5).

---

## 10. Estratégia de Flyway e Migrations Incrementais

### 10.1 Estado atual do Flyway

O Flyway está funcional. A migration V1 está aplicada. O `flyway_schema_history` existe. Nenhuma ação corretiva é necessária.

### 10.2 Padrão de nomes (para blocos futuros)

```
V<n>__<descricao_snake_case>.sql
```

Exemplos válidos: `V2__create_users.sql`, `V3__create_workspaces.sql`, `V10__add_workspace_slug_index.sql`

Exemplos inválidos: `V02__...` (zero desnecessário), `V2_create.sql` (falta double underscore), `v2__...` (V minúsculo)

### 10.3 Regra de imutabilidade

Migration aplicada ao banco = **intocável para sempre**. Qualquer mudança de schema DEVE ser feita via nova migration incremental. Em ambiente de desenvolvimento local, se uma migration ainda não foi aplicada e está apenas local, pode ser editada antes de qualquer `./mvnw spring-boot:run` que a aplique — mas isso é exceção rara e deve ser documentado no commit.

`flyway.out-of-order=false` (default) DEVE ser mantido.

### 10.4 Ambientes

| Ambiente | Flyway | Datasource | Seed |
|----------|--------|------------|------|
| `local` (dev) | `enabled: true` | Env vars com defaults locais | Manual, opcional |
| `test` (Testcontainers) | Executado no container | Injetado por `@DynamicPropertySource` | Nunca |
| `prod` | `enabled: true` | Env vars obrigatórias, sem defaults | Nunca |

### 10.5 Rollback

O Flyway Community não suporta rollback automático. Estratégia do projeto:

- **Rollback de migration**: criar migration reversa com próximo número sequencial.
- **Rollback de emergência em produção**: restaurar backup (Bloco 34).
- **Reset local de desenvolvimento**: `docker compose down -v && docker compose up -d postgres` recria o banco do zero e Flyway re-aplica todas as migrations.

### 10.6 Migrations destrutivas

Migrations com `DROP TABLE`, `DROP COLUMN`, `TRUNCATE` ou equivalente DEVEM ser precedidas de análise de impacto documentada e, quando necessário, de migration de backup de dados. Não há migrations destrutivas neste bloco.

### 10.7 Nenhuma migration V2 neste bloco

Não há justificativa técnica para criar V2 agora:
- `BaseEntity` é `@MappedSuperclass` — não cria tabela.
- UUID é gerado em Java — não requer extensão PostgreSQL.
- Não há tabelas de domínio.
- Não há nenhuma mudança real de schema.

Criar V2 com apenas comentário ou extensão desnecessária seria artifício sem valor e potencial fonte de problemas de checksum futuros.

---

## 11. Estratégia de Testcontainers

### 11.1 Objetivo

Validar com banco PostgreSQL real que:
1. O contexto Spring Boot inicializa com DataSource, JPA e Flyway ativos.
2. Flyway executa a migration V1 sem erro.
3. `flyway_schema_history` existe e contém o registro da V1 com status `SUCCESS`.
4. Nenhuma tabela funcional de domínio foi criada indevidamente — verificado via `information_schema.tables`, permitindo apenas `flyway_schema_history` no schema público.
5. `ddl-auto: validate` não falha (schema está vazio exceto pela tabela de controle do Flyway, sem entidade JPA mapeada — comportamento esperado e correto).

### 11.2 Classe `DatabaseFlywayIT`

Caminho: `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java`

Executada exclusivamente por `maven-failsafe-plugin` em `./mvnw verify`. O sufixo `IT` é reconhecido pelo Failsafe por convenção, garantindo que `./mvnw test` (Surefire) não a execute.

```java
@SpringBootTest
@Testcontainers
class DatabaseFlywayIT {

    @Container
    static PostgreSQLContainer<?> postgres =
        new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void configureProperties(DynamicPropertyRegistry registry) {
        registry.add("spring.datasource.url", postgres::getJdbcUrl);
        registry.add("spring.datasource.username", postgres::getUsername);
        registry.add("spring.datasource.password", postgres::getPassword);
    }

    @Test
    void contextLoadsWithRealDatabase() { }

    @Test
    void flywayAppliedFoundationMigration(@Autowired Flyway flyway) {
        MigrationInfo[] applied = flyway.info().applied();
        assertThat(applied).hasSize(1);
        assertThat(applied[0].getVersion().toString()).isEqualTo("1");
        assertThat(applied[0].getState()).isEqualTo(MigrationState.SUCCESS);
    }

    @Test
    void noFunctionalDomainTablesExist(@Autowired DataSource dataSource) throws Exception {
        try (var conn = dataSource.getConnection();
             var rs = conn.createStatement().executeQuery(
                 "SELECT table_name FROM information_schema.tables " +
                 "WHERE table_schema = 'public' AND table_name != 'flyway_schema_history'")) {
            assertThat(rs.next()).isFalse();
        }
    }
}
```

### 11.3 Por que `ddl-auto: validate` não falha sem entidades mapeadas

Com `validate`, o Hibernate verifica se as tabelas mapeadas em entidades `@Entity` existem no banco. Como este bloco tem zero entidades `@Entity` concretas (a `BaseEntity` é `@MappedSuperclass` e não é uma entidade direta), o Hibernate não tem nada para validar e não emite erro. O comportamento é correto.

### 11.4 Coexistência com testes existentes

| Classe | Tipo | Banco real? | Runner | Continua existindo? |
|--------|------|-------------|--------|---------------------|
| `LancarmeApplicationTest` | `@SpringBootTest` sem DB/JPA/Flyway | Não | Surefire (`./mvnw test`) | Sim — inalterado |
| `HealthControllerTest` | `@WebMvcTest` sem DB | Não | Surefire (`./mvnw test`) | Sim — inalterado |
| `DatabaseFlywayIT` | `@SpringBootTest` + Testcontainers | Sim | Failsafe (`./mvnw verify`) | Novo neste bloco |

O `LancarmeApplicationTest` permanece útil: testa o contexto sem banco (rápido, sem Docker). O `DatabaseFlywayIT` testa com banco real (mais lento, requer Docker) e é executado apenas em `./mvnw verify`.

### 11.5 Separação `test` / `verify`

**Decisão final**: o teste de integração será a classe `DatabaseFlywayIT` (sufixo `IT`), reconhecida pelo `maven-failsafe-plugin` por convenção padrão. Isso garante:

- `./mvnw test` (Surefire): executa apenas `HealthControllerTest` e `LancarmeApplicationTest` — sem Testcontainers, sem Docker.
- `./mvnw verify` (Failsafe): executa também `DatabaseFlywayIT` — inicia Testcontainers, requer Docker.

O plan MUST confirmar se o `maven-failsafe-plugin` já está configurado no `pom.xml` com os padrões `*IT` nas fases `integration-test` e `verify`, ou adicioná-lo com configuração mínima.

### 11.6 O que não testar neste bloco

- Auth, cadastro, login, JWT — Bloco 4.
- Workspace isolation — Bloco 5.
- CRUD de qualquer entidade funcional — Blocos 6+.
- IA, créditos, billing — Blocos 9+.

---

## 12. Segurança, LGPD e Preparação para Multi-Tenancy

### 12.1 Nenhuma informação sensível em migrations ou seed

- Migrations MUST NOT conter senhas, hashes, tokens, chaves ou dados pessoais.
- Nenhum seed com dados reais é criado neste bloco.

### 12.2 Datasource por variáveis de ambiente

`DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD` lidos de variáveis de ambiente. Defaults no YAML são claramente não-produção. Nenhuma credencial real versionada.

### 12.3 Logs sem exposição de credenciais

- `spring.jpa.show-sql` deve ser avaliado no plan — `false` em produção, opcional em `local`.
- Logs do Flyway não expõem URL com credenciais inline.
- Testcontainers gera credenciais aleatórias por execução — sem risco de vazamento.

### 12.4 Convenção multi-tenancy (para blocos futuros)

A `BaseEntity` não inclui `workspaceId` (ver seção 8). A convenção para entidades multi-tenant é registrada aqui:

> Toda entidade cujos dados pertencem a um workspace específico DEVE incluir `workspaceId UUID NOT NULL` como coluna, com índice. O repository DEVE filtrar por `workspaceId` em todas as queries. Nenhuma query de dado privado deve retornar dados de múltiplos workspaces. Esta regra entra em vigor a partir do Bloco 5.

### 12.5 Healthcheck sem regressão

`GET /api/v1/health` permanece público, não consulta banco e não retorna informação sensível. Nenhuma mudança neste endpoint.

---

## 13. Riscos e Mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| R-01 | Migration V1 com checksum alterado por edição acidental | Baixa | Alto | Nunca editar V1; verificar `./mvnw flyway:info` em caso de dúvida |
| R-02 | Testcontainers não disponível em CI sem Docker | Média | Médio | Documentar requisito de Docker; separar via Failsafe para não bloquear `./mvnw test` |
| R-03 | `@EnableJpaAuditing` causar conflito no `LancarmeApplicationTest` | Baixa | Baixo | O `LancarmeApplicationTest` exclui JPA — não é afetado; `LancarmeIntegrationTest` usa contexto completo |
| R-04 | `ddl-auto: validate` falhar com `BaseEntity` mapeada incorretamente | Baixa | Médio | `BaseEntity` é `@MappedSuperclass`, não `@Entity` — Hibernate não valida tabela para ela; testar com Testcontainers antes de PR |
| R-05 | Versão do container PostgreSQL diferente do banco local/produção futuro | Baixa | Baixo | Usar `postgres:16-alpine` — mesma imagem do `docker-compose.yml` |
| R-06 | `maven-failsafe-plugin` ausente ou mal configurado no `pom.xml`, fazendo `DatabaseFlywayIT` não executar em `verify` | Baixa | Médio | Plan MUST verificar e configurar `maven-failsafe-plugin` com padrão `*IT` nas fases `integration-test` e `verify` |

---

## 14. Estratégia de Testes

### 14.1 Testes que DEVEM continuar passando sem alteração

| Suite | Comando | Meta |
|-------|---------|------|
| Backend unitário + WebMvc | `./mvnw test` | 5/5 |
| Frontend | `npm run test` | 59/59 |

### 14.2 Novos testes obrigatórios

| Classe | Tipo | Valida |
|--------|------|--------|
| `DatabaseFlywayIT` | `@SpringBootTest` + Testcontainers (Failsafe, `./mvnw verify`) | Contexto com banco real; Flyway V1 aplicada; `flyway_schema_history` com status SUCCESS; ausência de tabelas funcionais via `information_schema.tables` |

### 14.3 Comandos de validação obrigatórios

```bash
# Infraestrutura local
docker compose config
docker compose up -d postgres

# Backend
cd lancarme-api
./mvnw test          # unitários e WebMvc — rápido; DatabaseFlywayIT NÃO executado
./mvnw verify        # inclui DatabaseFlywayIT com Testcontainers (requer Docker)

# Frontend (sem alterações previstas — validação de regressão)
cd lancarme-web
npm run lint
npm run typecheck
npm run test
npm run build
```

### 14.4 O que NÃO testar neste bloco

- Auth: Bloco 4
- Workspace isolation: Bloco 5
- CRUD de domínio: Blocos 6+
- IA, créditos, billing: Blocos 9+

---

## 15. Limites Explícitos de Escopo

### Fora do escopo absoluto

| Item | Motivo |
|------|--------|
| Migration V2 (ou qualquer nova migration) | Sem schema novo que justifique |
| Seed executável com dados de domínio | Sem tabelas de domínio |
| Tabela `users` com colunas de auth | Bloco 4 |
| Endpoints de cadastro, login, logout | Bloco 4 |
| JWT, refresh token, sessão | Bloco 4 |
| Tabela `workspaces`, `workspace_members` | Bloco 5 |
| Roles, RBAC, isolamento funcional | Bloco 5 |
| CRUD de Product, Avatar, Offer | Blocos 6, 7, 8 |
| AI Gateway, prompt registry, créditos | Bloco 9+ |
| Billing, assinaturas, webhooks | Bloco 28+ |
| Upload, storage, URLs assinadas | Bloco 31 |
| Integrações externas | Blocos futuros |
| Deploy, SSL, VPS, observabilidade | Blocos 34, 35 |
| Alterações visuais na App Shell | Fora deste bloco |
| Novos endpoints de negócio | Fora deste bloco |
| Dados reais no Command Center | Fora deste bloco |
| Commit ou push | Não feito pelo agente |

### Dentro do escopo

| Item | Justificativa |
|------|---------------|
| Convenção de migrations documentada | Infraestrutura — necessária desde agora |
| `BaseEntity` (`@MappedSuperclass`) | Infraestrutura JPA — não cria tabela |
| `@EnableJpaAuditing` em `shared/config/` | Infraestrutura Spring — habilita auditoria |
| `DatabaseFlywayIT` com Testcontainers (Failsafe) | QA obrigatório — primeiro teste com banco real |
| Política de seed documentada | Convenção — sem dados reais |
| `application-test.yml` se necessário | Configuração de isolamento de testes |
| Documentação técnica pertinente atualizada | Obrigatório por AGENTS.md |

---

## 16. Impacto Documental

### Arquivos a criar ou atualizar

| Arquivo | Ação |
|---------|------|
| `specs/003-database-flyway/spec.md` | Este arquivo |
| `specs/003-database-flyway/plan.md` | A criar no próximo passo |
| `specs/003-database-flyway/tasks.md` | A criar após o plan |
| `specs/003-database-flyway/implement-report.md` | A criar ao final da implementação |
| `AGENTS.md` (seção `<!-- SPECKIT -->`) | Atualizar referência para plan do Bloco 3 |

### Arquivos que NÃO devem ser alterados neste bloco

| Arquivo | Motivo |
|---------|--------|
| `README.md` | Sem mudança de uso local; atualizar só se houver novo comando real |
| `docs/architecture.md` | Sem mudança arquitetural |
| `docs/domain-model.md` | Sem novas entidades de domínio |
| `docs/security-lgpd.md` | Sem mudança de política |
| `lancarme-web/**` | Frontend não alterado |
| `docker-compose.yml` | Sem mudança de infraestrutura |

---

## 17. Confirmação Explícita de Não Antecipação Funcional

Este bloco não implementa e não prepara funcionalidades de domínio antes de seu bloco oficial:

| Módulo | Bloco oficial | Antecipado aqui? |
|--------|--------------|------------------|
| Auth — User, login, JWT, refresh token, logout | Bloco 4 | **NÃO** |
| Workspace, RBAC, membership, roles, isolation | Bloco 5 | **NÃO** |
| Product | Bloco 6 | **NÃO** |
| Avatar | Bloco 7 | **NÃO** |
| Offer | Bloco 8 | **NÃO** |
| AI Gateway, prompt registry | Bloco 9 | **NÃO** |
| Credit Ledger | Bloco 10 | **NÃO** |
| Billing | Bloco 28 | **NÃO** |
| File Storage | Bloco 31 | **NÃO** |

A `BaseEntity` é a única adição deste bloco, e ela é `@MappedSuperclass`: **não cria tabela**, **não representa domínio**, é puramente infraestrutura JPA reutilizável.

---

## Assumptions

- A migration V1 foi aplicada ao banco local e está registrada em `flyway_schema_history` com checksum válido.
- Docker está disponível na máquina de desenvolvimento (requisito para Testcontainers).
- Spring Boot 3.4.5 + Java 21 + Hibernate 6 suportam `GenerationType.UUID` nativo — confirmado pela stack.
- `ddl-auto: validate` com zero entidades `@Entity` mapeadas não produz erro — comportamento esperado do Hibernate.
- O plan MUST confirmar ou adicionar a configuração do `maven-failsafe-plugin` para executar testes `*IT` nas fases `integration-test` e `verify`.

## Out of Scope

Ver seção 15 — Limites Explícitos de Escopo.
