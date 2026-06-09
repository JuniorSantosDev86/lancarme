# Implement Report — Bloco 3: Database & Flyway

**Bloco**: 003  
**Data de execução**: 2026-05-29  
**Executor**: Claude Code (claude-sonnet-4-6)  
**Status**: CONCLUÍDO — pronto para QA/revisão humana (pós-correção)

---

## 1. Resultado do Gate Git Inicial

```
git log --oneline -5
417b027 readme
71c7d65 feat(ui): implement design system and app shell
24ea7b3 merge: complete platform foundation
2494321 feat: implement platform foundation
df4368c docs: refine platform foundation specification

git status --short --untracked-files=all
 M AGENTS.md
?? specs/003-database-flyway/analyze-run-report.md
?? specs/003-database-flyway/plan.md
?? specs/003-database-flyway/spec.md
?? specs/003-database-flyway/tasks.md
```

**Gate aprovado.** Bloco 2 (`71c7d65 feat(ui): implement design system and app shell`) presente.

**Correção de auditoria:** O relatório original afirmou que "únicos arquivos pendentes eram artefatos documentais do Bloco 3". Isso estava incorreto. O `git status` mostrava `M AGENTS.md` como modificação pré-existente. O diff completo dessa modificação:

```diff
-`specs/002-design-system-app-shell/plan.md`
+`specs/003-database-flyway/plan.md`
```

Trata-se de atualização do ponteiro de contexto ativo no bloco SPECKIT no final do `AGENTS.md`, alterando a referência do plano do Bloco 2 para o Bloco 3. É alteração de contexto documental, parte do fluxo de inicialização do Bloco 3, não código de implementação pendente. Não foi alterado nesta correção, conforme instrução.

---

## 2. Arquivos Criados e Alterados

| Arquivo | Tipo | Descrição |
|---------|------|-----------|
| `lancarme-api/pom.xml` | Alterado | Adicionado `maven-failsafe-plugin`; Testcontainers atualizado para 1.21.4 |
| `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java` | Criado | Classe base abstrata `@MappedSuperclass` com callbacks JPA `@PrePersist`/`@PreUpdate` |
| `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java` | Criado | Teste de integração com Testcontainers — 4 métodos |
| `specs/003-database-flyway/implement-report.md` | Criado | Este arquivo |

**Arquivos removidos nesta correção:**
- `lancarme-api/src/main/java/br/com/lancarme/shared/config/JpaConfig.java` — eliminado; substituído por callbacks JPA
- `~/.testcontainers.properties` — eliminado; era workaround de ambiente, não deve ser versionado
- `/tmp/docker_proxy.py` e `/tmp/docker-proxy.sock` — eliminados; proxy temporário encerrado

---

## 3. Dependências/Plugins Modificados e Justificativa

### Plugin adicionado: `maven-failsafe-plugin`

Configuração mínima adicionada ao `<build><plugins>`:

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

Sem `<version>` explícita — gerenciado pelo `spring-boot-starter-parent` 3.4.5 (resolvido como `3.5.3`). Sem `<includes>` customizados — o padrão `**/*IT.java` do Failsafe reconhece `DatabaseFlywayIT` automaticamente.

### Versão atualizada: Testcontainers `1.21.3` → `1.21.4`

O release `1.21.4` corrige a compatibilidade com Docker Engine 29.x sem exigir workaround de proxy ou configuração global. Confirmado: `./mvnw verify` executa com Docker Engine 29.4.1 (API 1.54) sem `DOCKER_HOST` override, sem proxy Unix socket e sem `~/.testcontainers.properties`.

---

## 4. Implementação de `BaseEntity`

**Localização:** `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java`

```java
@MappedSuperclass
public abstract class BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    protected void onCreate() {
        Instant now = Instant.now();
        if (createdAt == null) {
            createdAt = now;
        }
        updatedAt = now;
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = Instant.now();
    }

    public UUID getId() { return id; }
    public Instant getCreatedAt() { return createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
}
```

**Mudança em relação à implementação original:** A versão anterior usava `@CreatedDate`, `@LastModifiedDate` e `@EntityListeners(AuditingEntityListener.class)` do Spring Data, o que exigia `@EnableJpaAuditing` habilitado. Essa estratégia foi substituída por callbacks JPA padrão (`@PrePersist`/`@PreUpdate`) porque:

- Neste bloco ainda não existe entidade concreta persistida que permita validar o funcionamento real da auditoria Spring Data
- Condicionar `@EnableJpaAuditing` à existência de `entityManagerFactory` via `@ConditionalOnBean` introduz risco de a configuração não ser ativada no momento correto
- Callbacks JPA são determinísticos, sem dependência de infraestrutura Spring Data extra, e produzem comportamento idêntico para timestamps

**Confirmações:**
- `@MappedSuperclass` — não cria tabela; Hibernate não valida schema para esta classe
- Sem `@Entity`, sem `@Table`, sem repository, sem endpoint
- `GenerationType.UUID` — geração em Java/JPA sem extensão PostgreSQL
- `Instant` — compatível com fuso horário; preferível a `LocalDateTime`
- Sem `workspaceId` — conforme decisão do plan
- Sem Lombok — não está no `pom.xml`
- Getters apenas; campos auditáveis sem setter público
- `ddl-auto: validate` não falha — Hibernate só valida entidades `@Entity` concretas

---

## 5. Remoção de `JpaConfig`

**`JpaConfig.java` foi removido.** A implementação original criava:

```java
@Configuration
@EnableJpaAuditing
@ConditionalOnBean(name = "entityManagerFactory")
public class JpaConfig {}
```

Com a adoção de callbacks JPA em `BaseEntity`, `@EnableJpaAuditing` deixou de ser necessário. A dependência condicional de bean foi eliminada junto com o arquivo.

---

## 6. Implementação de `DatabaseFlywayIT`

**Localização:** `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java`

Quatro métodos de teste:

| Método | O que valida |
|--------|-------------|
| `contextLoadsWithRealDatabase` | Contexto Spring inicia com DataSource, JPA e Flyway ativos e banco real conectado |
| `flywayAppliedFoundationMigration` | Migration V1 presente no histórico com estado `SUCCESS` — sustentável quando migrações futuras forem adicionadas |
| `flywaySchemaHistoryTableExists` | `flyway_schema_history` existe fisicamente no banco — consulta direta a `information_schema.tables` |
| `doesNotCreateDomainTablesBeforeDomainMigrationsAreIntroduced` | Zero tabelas de domínio no schema público além de `flyway_schema_history` — guardrail temporal do Bloco 3 |

**Mudanças em relação à implementação original:**

1. `flywayAppliedFoundationMigration` deixou de usar `assertThat(applied).hasSize(1)`. A nova validação filtra por versão "1" no array de migrações aplicadas — não quebrará quando migrations legítimas forem adicionadas no futuro.

2. Adicionado `flywaySchemaHistoryTableExists` — validação direta da existência física da tabela de controle do Flyway.

3. `noFunctionalDomainTablesExist` renomeado para `doesNotCreateDomainTablesBeforeDomainMigrationsAreIntroduced` — nome explicita o caráter temporal do guardrail.

**Nota:** O guardrail `doesNotCreateDomainTablesBeforeDomainMigrationsAreIntroduced` deve ser revisado no primeiro bloco que introduzir uma migration real de domínio.

---

## 7. Como o Maven Failsafe Separa `test` de `verify`

| Comando | Plugin | Classes executadas | Testcontainers iniciado? |
|---------|--------|--------------------|--------------------------|
| `./mvnw test` | Surefire 3.5.3 | `LancarmeApplicationTest`, `HealthControllerTest` | **Não** |
| `./mvnw verify` | Surefire + Failsafe 3.5.3 | Idem + `DatabaseFlywayIT` | **Sim** |

---

## 8. Evidência: `DatabaseFlywayIT` NÃO rodou em `./mvnw test`

```
[INFO] Tests run: 1, Failures: 0, Errors: 0, Skipped: 0 -- in br.com.lancarme.LancarmeApplicationTest
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0 -- in br.com.lancarme.health.HealthControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

Nenhuma linha menciona `DatabaseFlywayIT`, Testcontainers ou Docker.

---

## 9. Evidência: `DatabaseFlywayIT` rodou em `./mvnw verify` (sem proxy)

```
[INFO] --- failsafe:3.5.3:integration-test (default) @ lancarme-api ---
[INFO] Running br.com.lancarme.DatabaseFlywayIT
[INFO] Testcontainers version: 1.21.4
[INFO] Found Docker environment with local Unix socket (unix:///var/run/docker.sock)
[INFO] Connected to docker:
  Server Version: 29.4.1
  API Version: 1.54
[INFO] tc.postgres:16-alpine -- Container postgres:16-alpine started in PT1.294108727S
[INFO] tc.postgres:16-alpine -- Container is started (JDBC URL: jdbc:postgresql://localhost:32771/test?loggerLevel=OFF)
[INFO] Successfully applied 1 migration to schema "public", now at version v1
[INFO] Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 5.804 s -- in br.com.lancarme.DatabaseFlywayIT
[INFO] --- failsafe:3.5.3:verify (default) @ lancarme-api ---
[INFO] BUILD SUCCESS
```

Comando executado: `env -u DOCKER_HOST -u TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE ./mvnw verify`

Testcontainers conectou diretamente ao socket `/var/run/docker.sock` sem proxy, sem override de variável de ambiente e sem `~/.testcontainers.properties`. Os 4 métodos passaram.

---

## 10. Auditoria do diff de `AGENTS.md`

```diff
-`specs/002-design-system-app-shell/plan.md`
+`specs/003-database-flyway/plan.md`
```

Classificação: alteração de ponteiro de contexto documental (bloco SPECKIT), parte do fluxo de inicialização do Bloco 3. Não é código de implementação. Não alterado nesta correção, conforme instrução.

---

## 11. Confirmação: Ausência de Migration V2

```
lancarme-api/src/main/resources/db/migration/V1__platform_foundation.sql
```

Único arquivo. Nenhuma V2 criada.

---

## 12. Confirmação: V1 Permaneceu Inalterada

```sql
-- Platform foundation migration.
-- Business domain tables are intentionally out of scope for Bloco 1.
```

Dois comentários SQL. Zero DDL. Zero DML. Imutável.

---

## 13. Confirmação: Ausência de Seed Executável

Nenhum `data.sql`, `import.sql`, `dev-seed.sql`, migration de seed ou script SQL com dados de domínio foi criado.

---

## 14. Confirmação: Ausência de Tabelas Funcionais

O teste `doesNotCreateDomainTablesBeforeDomainMigrationsAreIntroduced` validou em banco real — zero tabelas além de `flyway_schema_history`.

---

## 15. Confirmação: Ausência de Alteração Frontend

Nenhum arquivo de `lancarme-web/` alterado. Frontend 59/59 testes passando.

---

## 16. Resultado de `./mvnw test`

```
[INFO] Tests run: 1 -- in br.com.lancarme.LancarmeApplicationTest
[INFO] Tests run: 4 -- in br.com.lancarme.health.HealthControllerTest
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

---

## 17. Resultado de `./mvnw verify` (sem proxy, sem overrides)

```
Surefire: Tests run: 5, Failures: 0, Errors: 0, Skipped: 0

Failsafe: Running br.com.lancarme.DatabaseFlywayIT
  Testcontainers 1.21.4 → Docker Engine 29.4.1 (API 1.54) — conexão direta
  postgres:16-alpine started in PT1.294s — JDBC URL: jdbc:postgresql://localhost:32771/test
  Flyway applied V1 SUCCESS
  Tests run: 4, Failures: 0, Errors: 0, Skipped: 0, Time elapsed: 5.804 s

BUILD SUCCESS (total 9 testes)
```

---

## 18. Resultado da Regressão Frontend

```
npm run lint     → 0 erros
npm run typecheck → 0 erros
npm run test     → Test Files: 9 passed (9) | Tests: 59 passed (59)
npm run build    → ✓ built in 2.34s
```

---

## 19. Estado Final do Workaround (eliminado)

| Artefato | Estado |
|----------|--------|
| Processo `python3 /tmp/docker_proxy.py` | Encerrado |
| `/tmp/docker_proxy.py` | Removido |
| `/tmp/docker-proxy.sock` | Removido |
| `~/.testcontainers.properties` | Removido |
| `DOCKER_HOST` override | Não utilizado |
| `TESTCONTAINERS_DOCKER_SOCKET_OVERRIDE` override | Não utilizado |

Testcontainers 1.21.4 conecta nativamente ao Docker Engine 29.4.1 sem nenhum workaround.

---

## 20. Recomendação Final

**PRONTO PARA QA/REVISÃO HUMANA.**

Todos os critérios obrigatórios do Bloco 3 foram atendidos após correção:

| Critério | Status |
|----------|--------|
| `maven-failsafe-plugin` configurado | ✅ |
| `BaseEntity` como `@MappedSuperclass` com callbacks JPA | ✅ |
| `JpaConfig` com `@ConditionalOnBean` frágil — removido | ✅ |
| `DatabaseFlywayIT` com 4 testes sustentáveis | ✅ |
| `flywayAppliedFoundationMigration` não quebra com futuras migrations | ✅ |
| `flywaySchemaHistoryTableExists` valida tabela diretamente | ✅ |
| `./mvnw test` — sem `DatabaseFlywayIT` | ✅ |
| `./mvnw verify` sem proxy — Testcontainers 1.21.4 + Docker 29.4.1 | ✅ |
| Flyway aplicou V1 em banco efêmero | ✅ |
| `flyway_schema_history` com V1 SUCCESS | ✅ |
| Nenhuma tabela funcional de domínio | ✅ |
| V1 imutável e inalterada | ✅ |
| Nenhuma migration V2 | ✅ |
| Nenhum seed executável | ✅ |
| `HealthControllerTest` 4/4 | ✅ |
| `LancarmeApplicationTest` 1/1 | ✅ |
| Frontend 59/59 sem alteração | ✅ |
| `AGENTS.md` diff auditado — alteração documental pré-existente | ✅ |
| Nenhum secret, proxy ou PII versionado | ✅ |
| `BaseEntity` sem repository/endpoint/tabela | ✅ |
