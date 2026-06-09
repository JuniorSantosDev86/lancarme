# Implementation Plan: Database & Flyway

**Bloco**: 003
**Branch**: `003-database-flyway`
**Data**: 2026-05-29
**Spec**: `specs/003-database-flyway/spec.md`
**Status**: Pronto para implementação

---

## 1. Resumo Técnico

O Bloco 3 consolida a fundação profissional de persistência do Lançar.me sem criar nenhuma funcionalidade de domínio. A principal entrega executável é `DatabaseFlywayIT` — o primeiro teste de integração com PostgreSQL real via Testcontainers — que valida que Flyway executa a migration V1 em banco efêmero limpo, que `flyway_schema_history` existe e contém o registro da V1 com status `SUCCESS`, e que nenhuma tabela funcional de domínio foi criada indevidamente.

Além disso, o bloco implementa `BaseEntity` (`@MappedSuperclass`) como infraestrutura JPA reutilizável, habilita `@EnableJpaAuditing` via classe de configuração em `shared/config/`, e configura o `maven-failsafe-plugin` para separar testes rápidos (`./mvnw test`) de testes com banco real (`./mvnw verify`).

Nenhuma migration V2, nenhuma tabela de domínio, nenhum seed executável, nenhuma feature funcional.

---

## 2. Auditoria do Estado Atual

### 2.1 Dependências no `pom.xml`

**Presentes — nenhuma adição necessária:**

| Dependência | Escopo | Observação |
|-------------|--------|------------|
| `spring-boot-starter-data-jpa` | compile | JPA + Hibernate — presente |
| `spring-boot-starter-validation` | compile | Bean Validation — presente |
| `flyway-core` | compile | Gerenciado pelo BOM do Spring Boot 3.4.5 — presente |
| `flyway-database-postgresql` | compile | Suporte PostgreSQL específico — presente |
| `postgresql` (driver) | runtime | Gerenciado pelo BOM — presente |
| `testcontainers` BOM | import | Versão 1.20.6 declarada em `dependencyManagement` — presente |
| `testcontainers:junit-jupiter` | test | Presente |
| `testcontainers:postgresql` | test | Presente |
| `spring-boot-starter-test` | test | AssertJ incluído — presente |
| `mockito-junit-jupiter` | test | Presente |
| `spring-security-test` | test | Presente |

**Ausente — adição necessária:**

| Dependência | Escopo | Justificativa |
|-------------|--------|---------------|
| — | — | Nenhuma dependência nova é necessária neste bloco |

**Ausente — adição necessária (plugin):**

| Plugin | Justificativa |
|--------|---------------|
| `maven-failsafe-plugin` | **Ausente** do `pom.xml`. Deve ser adicionado para executar `DatabaseFlywayIT` exclusivamente em `./mvnw verify`. Sem ele, o Failsafe não executa e `DatabaseFlywayIT` nunca roda, ou pior, pode ser capturado pelo Surefire se o nome não for suficiente. |

### 2.2 Profiles de configuração existentes

| Arquivo | Existe? | Conteúdo relevante |
|---------|---------|-------------------|
| `application.yml` | Sim | Datasource por env vars, `ddl-auto: validate`, `open-in-view: false`, Flyway habilitado em `classpath:db/migration` |
| `application-local.yml` | Sim | Repete datasource (redundante mas inofensivo), Flyway habilitado, CORS para `http://localhost:5173` |
| `application-test.yml` | **Não existe** | Não necessário: `@DynamicPropertySource` no `DatabaseFlywayIT` sobrescreve o datasource sem precisar de profile |

**Conclusão**: não é necessário criar `application-test.yml`. O `@DynamicPropertySource` resolve de forma limpa.

### 2.3 Datasource local

| Chave | Fonte | Valor default |
|-------|-------|---------------|
| `spring.datasource.url` | `${DATABASE_URL}` | `jdbc:postgresql://localhost:5432/lancarme` |
| `spring.datasource.username` | `${DATABASE_USERNAME}` | `lancarme_local` |
| `spring.datasource.password` | `${DATABASE_PASSWORD}` | `changeme_local_only` |
| `spring.jpa.hibernate.ddl-auto` | `application.yml` | `validate` |
| `spring.jpa.open-in-view` | `application.yml` | `false` |

O `docker-compose.yml` usa `postgres:16-alpine` com `POSTGRES_USER=lancarme_local` e `POSTGRES_PASSWORD=changeme_local_only` — alinhado com os defaults do `application.yml`.

### 2.4 Migrations existentes

| Arquivo | Localização | Conteúdo real | Status |
|---------|-------------|----------------|--------|
| `V1__platform_foundation.sql` | `src/main/resources/db/migration/` | Apenas dois comentários SQL — zero DDL, zero tabelas | Aplicada — **imutável para sempre** |

**Conteúdo exato da V1** (lido diretamente do arquivo):
```sql
-- Platform foundation migration.
-- Business domain tables are intentionally out of scope for Bloco 1.
```

**Implicação direta para os testes**: após Flyway executar em banco limpo, o schema público conterá **apenas** `flyway_schema_history`. Nenhuma outra tabela. O teste `noFunctionalDomainTablesExist` deve refletir exatamente esse estado: `information_schema.tables WHERE table_schema = 'public' AND table_name != 'flyway_schema_history'` retorna zero linhas.

**Allowlist de objetos legítimos após V1 em banco limpo:**

| Objeto | Tipo | Origem |
|--------|------|--------|
| `flyway_schema_history` | TABLE | Criada pelo próprio Flyway automaticamente |

Nenhum outro objeto existe. Qualquer tabela além de `flyway_schema_history` indica erro.

### 2.5 Entities e repositories existentes

Nenhum. O backend contém apenas:

- `LancarmeApplication` — bootstrap
- `HealthController` — sem entidade, retorna DTO estático
- `HealthResponse` — DTO do healthcheck (record)
- `SecurityConfig` — configuração de Spring Security
- `CorsConfig` — configuração de CORS

### 2.6 Testes backend existentes

| Classe | Tipo | Banco real? | Runner esperado | Testes | Status atual |
|--------|------|-------------|-----------------|--------|--------------|
| `LancarmeApplicationTest` | `@SpringBootTest` com exclusão de DataSource/JPA/Flyway | Não | Surefire (`./mvnw test`) | 1 | Passando |
| `HealthControllerTest` | `@WebMvcTest` sem banco | Não | Surefire (`./mvnw test`) | 4 | Passando |

**O `LancarmeApplicationTest` exclui explicitamente** `DataSourceAutoConfiguration`, `HibernateJpaAutoConfiguration` e `FlywayAutoConfiguration`. Ele **não é afetado** pelo `@EnableJpaAuditing` a ser adicionado, pois JPA está excluído.

**O `HealthControllerTest` exclui** `DataSourceAutoConfiguration` e `HibernateJpaAutoConfiguration`. Igualmente não afetado.

### 2.7 `maven-failsafe-plugin`

**Ausente** do `pom.xml`. O bloco de `<build>` atual contém apenas `spring-boot-maven-plugin`. O `maven-failsafe-plugin` **deve ser adicionado** com configuração mínima para executar classes `*IT` nas fases `integration-test` e `verify`.

### 2.8 O que deve ser preservado sem alteração

| Artefato | Ação |
|----------|------|
| `V1__platform_foundation.sql` | **Nunca editar** — imutável |
| `LancarmeApplicationTest.java` | Preservar intacto |
| `HealthControllerTest.java` | Preservar intacto |
| `application.yml` | Preservar — nenhuma mudança necessária |
| `application-local.yml` | Preservar — nenhuma mudança necessária |
| `docker-compose.yml` | Preservar — nenhuma mudança necessária |
| `lancarme-web/**` | Preservar — sem alterações frontend neste bloco |

---

## 3. Decisões Técnicas Justificadas

### 3.1 `maven-failsafe-plugin`: adicionar com configuração mínima

**Decisão**: adicionar `maven-failsafe-plugin` ao `<build>` do `pom.xml`.

**Justificativa**: o plugin é **obrigatório** para garantir que `DatabaseFlywayIT` (sufixo `IT`) rode exclusivamente em `./mvnw verify` e nunca em `./mvnw test`. Sem ele, o Maven Surefire pode capturar a classe ou, mais provavelmente, a classe nunca é executada. A configuração mínima bind as fases `integration-test` e `verify` e reconhece o padrão `**/*IT.java`.

**Configuração planejada:**
```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

O `spring-boot-starter-parent` (versão 3.4.5) já gerencia a versão do `maven-failsafe-plugin` via BOM — nenhuma `<version>` explícita é necessária.

### 3.2 `@DynamicPropertySource` vs `@ServiceConnection`

**Decisão**: usar `@DynamicPropertySource`.

**Justificativa**: `@ServiceConnection` é uma feature do Spring Boot Test 3.1+ que requer `spring-boot-testcontainers` como dependência adicional (artefato `spring-boot-testcontainers`). Este artefato **não está presente** no `pom.xml` atual, e adicioná-lo não agrega valor suficiente para justificar nova dependência. O `@DynamicPropertySource` com `@Container` static resolve de forma limpa, é amplamente conhecido e já está previsto na spec. Nenhuma dependência nova necessária.

### 3.3 `BaseEntity`: implementar neste bloco

**Decisão**: implementar `BaseEntity` como `@MappedSuperclass` neste bloco.

**Justificativa**:
1. `BaseEntity` é infraestrutura JPA pura — não representa domínio.
2. Implementada agora, ela garante que o Bloco 4 (primeiro bloco com entidade real `User`) já parta de uma base auditável consistente, sem precisar criar a classe sob pressão de escopo funcional.
3. Como `@MappedSuperclass`, ela **não cria tabela no banco**, não gera schema, não interfere no `ddl-auto: validate`.
4. O teste `DatabaseFlywayIT` com `ddl-auto: validate` passará corretamente: o Hibernate só valida entidades `@Entity` concretas; `@MappedSuperclass` é ignorada.
5. O `LancarmeApplicationTest` (que exclui JPA) não é afetado.

**Campos planejados:**
```java
@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;
}
```

**UUID**: gerado pela JPA/Hibernate com `GenerationType.UUID` (nativo no Hibernate 6 + Java 21). Não requer extensão PostgreSQL (`uuid-ossp`, `pgcrypto`). Não requer migration V2.

**Timestamps**: gerenciados pelo `AuditingEntityListener` via `@EnableJpaAuditing`. Sem abstração excessiva — o Spring cuida do preenchimento.

**`workspaceId` ausente da `BaseEntity`**: correto. Nem toda entidade é multi-tenant (ex: `User` não tem `workspaceId`). A convenção multi-tenant é documentada na spec e aplicada nos blocos seguintes.

### 3.4 `@EnableJpaAuditing`: classe de configuração dedicada

**Decisão**: criar `JpaConfig` em `br.com.lancarme.shared.config` anotada com `@EnableJpaAuditing`.

**Justificativa**: separar configuração em classe dedicada segue o padrão já adotado (`CorsConfig`, `SecurityConfig`). Não colocar em `LancarmeApplication` para evitar poluição do bootstrap. O listener `AuditingEntityListener` precisa desta configuração para preencher `@CreatedDate` e `@LastModifiedDate`.

**Impacto no `LancarmeApplicationTest`**: zero. O test exclui `HibernateJpaAutoConfiguration` — JPA não é carregado, a configuração JPA não é lida.

### 3.5 `application-test.yml`: não criar

**Decisão**: não criar `application-test.yml`.

**Justificativa**: o `@DynamicPropertySource` em `DatabaseFlywayIT` sobrescreve `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password` diretamente com os valores do container efêmero. Não há conflito com os defaults do `application.yml` porque o `@DynamicPropertySource` tem precedência. Criar um `application-test.yml` seria redundante e adicionaria risco de desincronização futura.

### 3.6 Nenhuma migration V2

**Decisão**: não criar V2.

**Justificativa**:
- `BaseEntity` é `@MappedSuperclass` — não cria tabela.
- UUID é gerado pelo Java/JPA — não requer extensão PostgreSQL.
- Não há tabelas de domínio.
- Não há nenhuma mudança real de schema.
- Migration vazia, de comentário ou de extensão desnecessária geraria entrada em `flyway_schema_history` sem propósito real e poderia causar problemas de checksum em cenários de reset ou CI.

### 3.7 Nenhum seed executável

**Decisão**: não criar `dev-seed.sql`, `data.sql`, `import.sql` nem migration de seed.

**Justificativa**: não existem tabelas de domínio para receber dados. A política de seed é documentada na spec para uso nos blocos seguintes.

---

## 4. Arquivos que Serão Alterados ou Criados

### Novos arquivos

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java` | Novo | `@MappedSuperclass` com `id`, `createdAt`, `updatedAt` |
| `lancarme-api/src/main/java/br/com/lancarme/shared/config/JpaConfig.java` | Novo | `@Configuration @EnableJpaAuditing` |
| `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java` | Novo | Teste de integração com Testcontainers |

### Arquivos alterados

| Arquivo | Alteração |
|---------|-----------|
| `lancarme-api/pom.xml` | Adicionar `maven-failsafe-plugin` em `<build><plugins>` |
| `specs/003-database-flyway/plan.md` | Este arquivo (criado agora) |
| `AGENTS.md` | Atualizar referência `<!-- SPECKIT -->` para apontar para este plan |

### Arquivos **não alterados**

| Arquivo | Motivo |
|---------|--------|
| `V1__platform_foundation.sql` | Imutável |
| `application.yml` | Nenhuma mudança necessária |
| `application-local.yml` | Nenhuma mudança necessária |
| `docker-compose.yml` | Nenhuma mudança necessária |
| `LancarmeApplicationTest.java` | Preservado sem alteração |
| `HealthControllerTest.java` | Preservado sem alteração |
| `lancarme-web/**` | Nenhuma alteração frontend |
| `README.md` | Sem novo comando real que justifique atualização |
| `docs/architecture.md` | Sem mudança arquitetural |
| `docs/domain-model.md` | Sem novas entidades de domínio |
| `docs/security-lgpd.md` | Sem mudança de política |

---

## 5. Decisão Final sobre `BaseEntity`

**Decisão**: implementar `BaseEntity` neste bloco.

**Localização**: `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java`

**Contrato completo:**

```java
package br.com.lancarme.shared.entity;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.Instant;
import java.util.UUID;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @CreatedDate
    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @LastModifiedDate
    @Column(nullable = false)
    private Instant updatedAt;

    // getters apenas — sem setters públicos para id/createdAt
}
```

**Garantias:**
- `@MappedSuperclass`: não cria tabela. Hibernate não valida schema para esta classe.
- Sem `@Entity`, sem `@Table`, sem `@Repository`, sem endpoint.
- `ddl-auto: validate` não falha: apenas entidades `@Entity` concretas são validadas.
- `LancarmeApplicationTest` não é afetado: JPA excluído explicitamente naquele teste.
- `DatabaseFlywayIT` confirma que nenhuma tabela de domínio foi criada.

**Por que agora e não no Bloco 4**: o Bloco 4 já terá escopo funcional (auth, `User`, JWT). Criar `BaseEntity` no Bloco 3, junto com a infraestrutura JPA, evita que o Bloco 4 precise gerir dois escopos simultaneamente. A classe não antecipa domínio; ela é infraestrutura.

---

## 6. Estratégia de Flyway

### Estado atual

- Flyway funcional, habilitado, aponta para `classpath:db/migration`.
- V1 aplicada, `flyway_schema_history` existe, checksum registrado.
- Nenhuma ação corretiva necessária.

### Preservação da V1

A migration `V1__platform_foundation.sql` não será editada, renomeada, movida ou referenciada de forma diferente. Qualquer alteração — mesmo um espaço ou quebra de linha — invalidaria o checksum registrado em `flyway_schema_history` e quebraria a inicialização do Flyway.

### Nenhuma V2 neste bloco

Confirmado. Não há justificativa técnica. Ver seção 3.6.

### Como o Testcontainers valida a V1

O `DatabaseFlywayIT` inicia um container PostgreSQL limpo (sem dados, sem schema), injeta suas credenciais via `@DynamicPropertySource`, e o Spring Boot inicializa com Flyway ativo. O Flyway executa a V1 no container — que contém apenas comentários, portanto o schema público permanece vazio exceto por `flyway_schema_history`. Os testes então validam:

1. `contextLoadsWithRealDatabase`: contexto Spring inicializou sem erro.
2. `flywayAppliedFoundationMigration`: `flyway.info().applied()` tem 1 entrada, versão "1", estado `SUCCESS`.
3. `noFunctionalDomainTablesExist`: `information_schema.tables WHERE table_schema = 'public' AND table_name != 'flyway_schema_history'` retorna zero linhas.

### Convenção futura de migrations (documentada aqui, não implementada)

**Padrão de nome**: `V<n>__<descricao_snake_case>.sql`

| Válido | Inválido | Motivo da invalidade |
|--------|----------|---------------------|
| `V2__create_users.sql` | `V02__create_users.sql` | Zero à esquerda desnecessário |
| `V3__create_workspaces.sql` | `V2_create_users.sql` | Falta o double underscore `__` |
| `V10__add_workspace_slug_index.sql` | `v2__create_users.sql` | V deve ser maiúsculo |

**Imutabilidade**: migration aplicada ao banco = intocável para sempre. Alterações de schema via nova migration incremental exclusivamente.

**Out-of-order**: `flyway.out-of-order=false` (default) mantido. Migrations devem ser lineares.

**Migrations destrutivas** (`DROP TABLE`, `DROP COLUMN`, `TRUNCATE`): exigem análise de impacto documentada e, quando necessário, migration de backup de dados anterior à migration destrutiva.

**Rollback**: Flyway Community não suporta rollback automático. Estratégia: migration reversa numerada sequencialmente. Reset local: `docker compose down -v && docker compose up -d postgres`.

---

## 7. Estratégia de Testcontainers

### Classe `DatabaseFlywayIT`

**Caminho**: `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java`

**Runner**: `maven-failsafe-plugin` (Failsafe) — executado apenas em `./mvnw verify`.

**Implementação planejada:**

```java
package br.com.lancarme;

import org.flywaydb.core.Flyway;
import org.flywaydb.core.api.MigrationState;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;

import javax.sql.DataSource;

import static org.assertj.core.api.Assertions.assertThat;

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
    void contextLoadsWithRealDatabase() {
        // contexto Spring carregou com DataSource, JPA e Flyway ativos
    }

    @Test
    void flywayAppliedFoundationMigration(@Autowired Flyway flyway) {
        var applied = flyway.info().applied();
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

### Por que `@DynamicPropertySource` e não `@ServiceConnection`

`@ServiceConnection` requer o artefato `spring-boot-testcontainers` (não presente no `pom.xml`). `@DynamicPropertySource` funciona com as dependências atuais e é igualmente limpo. Nenhuma dependência nova necessária.

### Por que `postgres:16-alpine`

Mesma imagem usada no `docker-compose.yml`. Garante paridade com o banco local de desenvolvimento. Alpine reduz o tempo de download e startup do container nos testes.

### Isolamento

Cada execução usa container PostgreSQL isolado, gerenciado pelo Testcontainers. Sem compartilhamento de estado com o banco local em `localhost:5432`. O datasource local **nunca** é usado durante `./mvnw verify` com Testcontainers ativo.

### `ddl-auto: validate` com `BaseEntity` presente

O Hibernate valida apenas entidades `@Entity` concretas. `BaseEntity` é `@MappedSuperclass` — não é uma entidade direta. Com zero entidades `@Entity` no projeto, o Hibernate não tem nada para validar e não emite erro. Comportamento esperado e correto.

### Coexistência com testes existentes

| Classe | Runner | Banco real? | Continua? |
|--------|--------|-------------|-----------|
| `LancarmeApplicationTest` | Surefire (`./mvnw test`) | Não — JPA/DB/Flyway excluídos | Sim — inalterado |
| `HealthControllerTest` | Surefire (`./mvnw test`) | Não — WebMvcTest sem DB | Sim — inalterado |
| `DatabaseFlywayIT` | Failsafe (`./mvnw verify`) | Sim — Testcontainers | Novo neste bloco |

---

## 8. Estratégia de Maven Failsafe

### Situação atual

**`maven-failsafe-plugin` ausente** do `pom.xml`. Apenas `spring-boot-maven-plugin` está declarado em `<build><plugins>`.

### Configuração a adicionar no `pom.xml`

```xml
<plugin>
    <groupId>org.apache.maven.plugins</groupId>
    <artifactId>maven-failsafe-plugin</artifactId>
    <executions>
        <execution>
            <goals>
                <goal>integration-test</goal>
                <goal>verify</goal>
            </goals>
        </execution>
    </executions>
</plugin>
```

**Versão**: gerenciada automaticamente pelo `spring-boot-starter-parent` 3.4.5 — nenhuma `<version>` explícita necessária.

**Padrão de inclusão padrão do Failsafe**: `**/*IT.java`, `**/*ITCase.java`, `**/*IntegrationTest.java`. `DatabaseFlywayIT` é reconhecido por `**/*IT.java` sem configuração adicional de `<includes>`.

### Separação obrigatória confirmada

| Comando | Executa | Testcontainers iniciado? | Docker necessário? |
|---------|---------|--------------------------|-------------------|
| `./mvnw test` | `LancarmeApplicationTest`, `HealthControllerTest` (Surefire) | **Não** | **Não** |
| `./mvnw verify` | Todos os acima + `DatabaseFlywayIT` (Failsafe) | **Sim** | **Sim** |

**Validação da separação** (a ser verificada durante implementação): executar `./mvnw test` e confirmar que nenhuma linha de log menciona Testcontainers ou Docker. Executar `./mvnw verify` e confirmar que `DatabaseFlywayIT` executa e passa.

---

## 9. Estratégia de Teste sem Dependência do Banco Local

### Regra

`DatabaseFlywayIT` **nunca usa** `localhost:5432`. O datasource é fornecido exclusivamente pelo container efêmero criado pelo Testcontainers via `@DynamicPropertySource`.

### Como isso é garantido

1. `@DynamicPropertySource` sobrescreve `spring.datasource.url`, `spring.datasource.username` e `spring.datasource.password` com os valores do container antes que o contexto Spring carregue o datasource.
2. O container Testcontainers expõe PostgreSQL em porta aleatória mapeada no host — não conflita com `localhost:5432`.
3. Se o Docker não estiver disponível, o teste falha com erro claro (`Cannot connect to Ryuk...` ou `DockerClientException`) — não silenciosamente passa com banco local.

### Profile de configuração para integração

Não é necessário. `@DynamicPropertySource` é suficiente. Nenhum `application-test.yml` será criado.

---

## 10. Política Futura de Seed

**Documentada aqui — nenhum arquivo executável criado neste bloco.**

### Quando criar o primeiro seed real

No bloco em que a primeira tabela de domínio for criada e dados de desenvolvimento forem genuinamente úteis para testes manuais locais. Previsto a partir do Bloco 4 ou 5.

### Onde ficam os seeds

`lancarme-api/src/main/resources/db/seed/dev-seed.sql` — separado de `db/migration/`.

### Como executar

Script manual via `psql` ou target Maven específico (ex: `exec-maven-plugin` com script dedicado). **Nunca via Flyway principal** (`spring.flyway.locations`).

### Regras absolutas

| Regra | Justificativa |
|-------|---------------|
| MUST NOT executar em produção por mecanismo automático | Risco de dados inconsistentes ou sobrescrição |
| MUST NOT conter PII real, senhas, credenciais ou tokens | LGPD + segurança |
| MUST NOT criar dados de módulos não especificados | Escopo e rastreabilidade |
| MUST ser repetível | Usar `ON CONFLICT DO NOTHING` ou equivalente |
| MUST usar dados fictícios | Ex: `dev@example.com`, `Dev User` |
| MUST NOT ser executado automaticamente no startup | Nem via `data.sql`, nem via Flyway seed location |

### O que não criar neste bloco

- `data.sql`
- `import.sql`
- `dev-seed.sql` (nem vazio)
- Migration de seed
- Fixture persistente de domínio
- Script SQL vazio

---

## 11. Segurança, LGPD e Preparação para Multi-Tenancy

### Credenciais e secrets

- Nenhuma credencial real versionada.
- Datasource por variáveis de ambiente: `DATABASE_URL`, `DATABASE_USERNAME`, `DATABASE_PASSWORD`.
- Defaults no YAML são claramente não-produção (`changeme_local_only`).
- Testcontainers gera credenciais aleatórias por execução — sem risco de vazamento de secret real.

### Logs

- `spring.jpa.show-sql` não habilitado (default `false`) — correto para produção.
- Se habilitado em `local` futuramente, nunca habilitado por default em `application.yml`.
- Logs do Flyway registram execução de migrations sem expor credenciais.
- Nenhum log de Testcontainers expõe credencial real (as credenciais são sintéticas geradas em runtime).

### LGPD

- Nenhum dado pessoal em migrations, seeds, testes ou configurações.
- Nenhum dado de usuário real antecipado.
- Nenhum workspace funcional criado.

### Multi-tenancy (convenção para blocos futuros)

> Toda entidade cujos dados pertencem a um workspace específico DEVE incluir `workspaceId UUID NOT NULL` como coluna, com índice. O repository DEVE filtrar por `workspaceId` em todas as queries. Nenhuma query de dado privado deve retornar dados de múltiplos workspaces. Esta regra entra em vigor a partir do Bloco 5.

`BaseEntity` **não inclui** `workspaceId`: nem toda entidade é multi-tenant (`User` não tem `workspaceId` — ele *possui* workspaces via `WorkspaceMember`).

### Healthcheck

`GET /api/v1/health` permanece público, não consulta banco, não retorna informação sensível. Nenhuma alteração neste endpoint ou em seu contrato.

---

## 12. Validações Obrigatórias

### Infraestrutura

```bash
# Na raiz do monorepo
docker compose config
```
Resultado esperado: configuração válida sem erros.

### Backend — testes rápidos (sem Docker)

```bash
cd lancarme-api
./mvnw test
```
Resultado esperado:
- `LancarmeApplicationTest` — 1/1 passando.
- `HealthControllerTest` — 4/4 passando.
- `DatabaseFlywayIT` **não aparece** nos resultados.
- Nenhuma linha de log menciona Testcontainers ou Docker.
- Build: `BUILD SUCCESS`.

### Backend — testes com banco real (requer Docker)

```bash
cd lancarme-api
./mvnw verify
```
Resultado esperado:
- Todos os testes do `./mvnw test` passando.
- `DatabaseFlywayIT` — 3/3 passando:
  - `contextLoadsWithRealDatabase`
  - `flywayAppliedFoundationMigration`
  - `noFunctionalDomainTablesExist`
- Build: `BUILD SUCCESS`.

### Frontend — regressão

```bash
cd lancarme-web
npm run lint
npm run typecheck
npm run test
npm run build
```
Resultado esperado: 0 erros de lint, 0 erros de typecheck, 59/59 testes passando, build sem erros.

### Healthcheck manual (opcional, com banco local rodando)

```bash
cd lancarme-api
SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
```
```bash
curl http://localhost:8080/api/v1/health
```
Resultado esperado:
```json
{"status":"UP","service":"lancarme-api","version":"0.1.0"}
```

---

## 13. Riscos e Mitigações

| ID | Risco | Probabilidade | Impacto | Mitigação |
|----|-------|--------------|---------|-----------|
| R-01 | Migration V1 com checksum alterado por edição acidental | Baixa | Alto | Nunca editar V1; verificar `./mvnw flyway:info` em caso de dúvida |
| R-02 | Docker não disponível em CI/CD sem configuração específica | Média | Médio | `DatabaseFlywayIT` roda apenas em `./mvnw verify`; `./mvnw test` não requer Docker; documentar requisito de Docker para `verify` |
| R-03 | `@EnableJpaAuditing` causar conflito com `LancarmeApplicationTest` | Baixa | Baixo | `LancarmeApplicationTest` exclui `HibernateJpaAutoConfiguration` — JPA não é carregado; não há conflito |
| R-04 | `ddl-auto: validate` falhar com `BaseEntity` | Baixa | Médio | `@MappedSuperclass` não é `@Entity` — Hibernate não valida schema para ela; validado pelo `DatabaseFlywayIT` |
| R-05 | `DatabaseFlywayIT` nunca executado porque Failsafe não está configurado | **Alta** (plugin ausente) | Alto | **Mitigação principal deste bloco**: adicionar `maven-failsafe-plugin` ao `pom.xml` |
| R-06 | `DatabaseFlywayIT` usando banco local em vez do container | Baixa | Alto | `@DynamicPropertySource` sobrescreve datasource antes do contexto carregar; validar nos logs que a URL é do container (porta aleatória alta) |
| R-07 | Regressão nos 59 testes frontend | Baixa | Médio | Frontend não é alterado; executar `npm run test` como validação de regressão |
| R-08 | `BaseEntity` antecipa domínio via campos de workspace | Baixa | Alto | Campos planejados: apenas `id`, `createdAt`, `updatedAt` — sem `workspaceId`, sem campo de negócio |

---

## 14. Critérios Técnicos de Aceite

### Obrigatórios (bloco não pode ser concluído sem estes)

- [ ] `maven-failsafe-plugin` configurado em `pom.xml` para executar `*IT` nas fases `integration-test` e `verify`.
- [ ] `BaseEntity` existe em `br.com.lancarme.shared.entity.BaseEntity` como `@MappedSuperclass` com `id` (UUID), `createdAt` (Instant), `updatedAt` (Instant).
- [ ] `JpaConfig` existe em `br.com.lancarme.shared.config.JpaConfig` com `@EnableJpaAuditing`.
- [ ] `DatabaseFlywayIT` existe em `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java`.
- [ ] `./mvnw test` — 5/5 testes passando, `DatabaseFlywayIT` NÃO executado, Testcontainers NÃO iniciado.
- [ ] `./mvnw verify` — todos os testes passando, `DatabaseFlywayIT` 3/3 passando com Testcontainers.
- [ ] Flyway executa V1 no container Testcontainers sem erro.
- [ ] `flyway_schema_history` contém registro da versão 1 com estado `SUCCESS`.
- [ ] Nenhuma tabela funcional de domínio no schema público (somente `flyway_schema_history`).
- [ ] `V1__platform_foundation.sql` inalterado.
- [ ] Nenhuma migration V2 criada.
- [ ] Nenhum seed executável criado.
- [ ] `HealthControllerTest` — 4/4 passando sem alteração.
- [ ] `LancarmeApplicationTest` — 1/1 passando sem alteração.
- [ ] Frontend — 59/59 testes passando sem alteração.
- [ ] `docker compose config` retorna configuração válida.
- [ ] `GET /api/v1/health` retorna `{"status":"UP","service":"lancarme-api","version":"0.1.0"}`.
- [ ] Nenhum secret real ou PII em nenhum arquivo do bloco.
- [ ] Nenhum `workspaceId` na `BaseEntity`.
- [ ] `BaseEntity` sem repository, sem endpoint, sem tabela.

---

## 15. Confirmação Explícita: Nenhuma Feature Funcional ou Migration Nova

Este bloco **não implementa** e **não prepara** funcionalidades de domínio antes de seu bloco oficial:

| Item | Bloco correto | Implementado aqui? |
|------|--------------|-------------------|
| Migration V2 (qualquer schema novo) | Bloco 4+ | **NÃO** |
| Tabela `users` | Bloco 4 | **NÃO** |
| Auth, login, JWT, refresh token, logout | Bloco 4 | **NÃO** |
| Tabela `workspaces`, `workspace_members` | Bloco 5 | **NÃO** |
| RBAC, roles, membership, isolamento | Bloco 5 | **NÃO** |
| `Product`, `Avatar`, `Offer` | Blocos 6, 7, 8 | **NÃO** |
| AI Gateway, prompts, créditos | Bloco 9+ | **NÃO** |
| Billing, webhooks, assinaturas | Bloco 28+ | **NÃO** |
| Upload, storage, URLs assinadas | Bloco 31 | **NÃO** |
| Deploy, VPS, SSL, observabilidade | Blocos 34, 35 | **NÃO** |
| Alterações visuais frontend | Bloco correspondente | **NÃO** |
| Novos endpoints de negócio | Bloco correspondente | **NÃO** |
| Seed executável com dados de domínio | Bloco 4+ | **NÃO** |
| Commit ou push | Responsabilidade do humano | **NÃO** |

A `BaseEntity` é a única adição deste bloco. É `@MappedSuperclass`: **não cria tabela**, **não representa domínio**, é puramente infraestrutura JPA reutilizável.

---

## Apêndice: Constitution Check

| Princípio | Status | Resposta |
|-----------|--------|----------|
| Produto orientado a lançamentos | PASS | Nenhuma funcionalidade de produto implementada; fundação de persistência habilita blocos futuros |
| Stack oficial e arquitetura modular | PASS | Java 21, Spring Boot 3, Flyway, JPA, Testcontainers — stack oficial |
| Segurança, LGPD e multi-tenancy | PASS | Sem secrets reais, sem PII, sem workspace funcional; convenção multi-tenant documentada |
| Backend como fonte de autoridade | PASS | Nenhum endpoint novo; healthcheck inalterado |
| IA governada por gateway e créditos | PASS | Fora do escopo |
| Billing, webhooks e auditoria | PASS | Fora do escopo |
| Arquivos privados e dados protegidos | PASS | Fora do escopo |
| Qualidade, testes e clean code | PASS | `DatabaseFlywayIT` como entrega principal; separação Surefire/Failsafe; testes existentes preservados |
| UI em PT-BR e experiência profissional | PASS | Frontend não alterado |
| Documentação viva e execução em blocos | PASS | Este plan registra decisões, riscos, contratos, comandos e critérios de aceite |

Nenhuma violação constitucional identificada.
