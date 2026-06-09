# Tasks: Database & Flyway

**Bloco**: 003
**Branch**: `003-database-flyway`
**Input**: `specs/003-database-flyway/plan.md`, `specs/003-database-flyway/spec.md`
**Data**: 2026-05-29
**Status**: IMPLEMENTADO — pronto para QA/revisão humana

---

## Pré-requisitos obrigatórios de leitura

Antes de executar qualquer task, ler e tratar como fonte de verdade:

- `AGENTS.md`
- `.specify/memory/constitution.md`
- `README.md`
- `docs/architecture.md`
- `docs/domain-model.md`
- `docs/security-lgpd.md`
- `docs/qa-strategy.md`
- `docs/clean-code-standards.md`
- `docs/roadmap-operacional.md`
- `specs/001-platform-foundation/spec.md`
- `specs/001-platform-foundation/plan.md`
- `specs/001-platform-foundation/tasks.md`
- `specs/002-design-system-app-shell/spec.md`
- `specs/002-design-system-app-shell/plan.md`
- `specs/002-design-system-app-shell/tasks.md`
- `specs/002-design-system-app-shell/implement-report.md`
- `specs/003-database-flyway/spec.md`
- `specs/003-database-flyway/plan.md`
- `specs/003-database-flyway/analyze-run-report.md`

---

## Formato

- **[P]**: Paralelizável — toca arquivos independentes e não depende de task incompleta
- Cada task informa caminhos exatos dos arquivos criados ou alterados
- Tarefas ordenadas por dependência: as fases posteriores dependem das anteriores
- Marcar `[x]` ao concluir cada task antes de avançar

---

## FORA DO ESCOPO ABSOLUTO

Não criar, alterar ou preparar em nenhuma task:

- Migration V2 ou qualquer nova migration SQL
- Tabelas de domínio (`users`, `workspaces`, `workspace_members`, `products`, `avatars`, `offers`, etc.)
- Entities concretas (`@Entity`)
- Repositories
- Services de domínio
- Controllers de domínio
- DTOs de domínio
- Endpoints de negócio
- Seeds executáveis (`data.sql`, `import.sql`, `dev-seed.sql` com dados)
- Auth, JWT, login, cadastro, logout
- Workspace, RBAC, roles, membership
- IA, créditos, billing, upload, integrações
- Qualquer arquivo do frontend (`lancarme-web/`)
- Commit ou push

---

## Fase 0 — Gate de Baseline Git (Bloqueante absoluto)

**Propósito**: Confirmar que o Bloco 2 foi integralmente commitado e que não há código de bloco anterior
misturado ao Bloco 3 antes de qualquer modificação.

**Crítico**: Esta fase é pré-condição para toda a implementação. Se qualquer critério falhar, parar e reportar o bloqueio.

---

- [x] **T000** Verificar baseline Git antes de qualquer alteração

  Executar na raiz do monorepo:
  ```bash
  git log --oneline -5
  git status --short --untracked-files=all
  ```

  Critérios obrigatórios:
  - O Bloco 2 — Design System & App Shell deve constar nos commits recentes como implementação concluída
  - `git status` não deve exibir nenhum arquivo modificado ou não rastreado de implementação do Bloco 2
    (código frontend, backend ou documentação do Bloco 2 pendente de commit)
  - Os únicos pendentes permitidos são os artefatos documentais já criados do Bloco 3:
    `AGENTS.md`, `specs/003-database-flyway/` (spec, plan, tasks, analyze-run-report)
  - Se houver código frontend, backend ou documentação do Bloco 2 ainda não commitados: **parar a implementação e reportar o bloqueio**

  Registrar o output completo de ambos os comandos.

  _Nenhum arquivo alterado._

---

**Checkpoint Fase 0**: Baseline Git confirmada. Bloco 2 commitado. Nenhum código de bloco anterior pendente.

---

## Fase 1 — Auditoria e Proteção de Escopo (Bloqueante)

**Propósito**: Confirmar o estado real do repositório antes de qualquer modificação.
Registrar a baseline de arquivos. Nenhum arquivo é criado ou alterado nesta fase.

**Crítico**: Completar esta fase integralmente antes de qualquer implementação.

---

- [x] **T001** Registrar baseline de arquivos modificados antes da implementação

  Executar na raiz do monorepo:
  ```bash
  git status --short
  git diff --name-only
  ```
  Registrar o output. Confirmar que a branch `003-database-flyway` está limpa antes da implementação.
  Nenhum arquivo deve aparecer como modificado (exceto artefatos já produzidos pelo speckit: `AGENTS.md`, `specs/003-database-flyway/`).

  _Nenhum arquivo alterado._

---

- [x] **T002** Confirmar que `V1__platform_foundation.sql` é no-op e não possui DDL

  Ler o conteúdo completo de:
  - `lancarme-api/src/main/resources/db/migration/V1__platform_foundation.sql`

  Verificar que:
  - O arquivo contém apenas comentários SQL (`--`)
  - Zero instruções DDL (`CREATE`, `ALTER`, `DROP`, `INDEX`)
  - Zero instruções DML (`INSERT`, `UPDATE`, `DELETE`)
  - Zero instruções de extensão (`CREATE EXTENSION`)

  Registrar o conteúdo exato encontrado.

  Critério: arquivo contém exatamente dois comentários SQL e nenhuma instrução executável.

  _Nenhum arquivo alterado._

---

- [x] **T003** Confirmar que não existe migration V2

  Executar:
  ```bash
  ls lancarme-api/src/main/resources/db/migration/
  ```

  Critério: somente `V1__platform_foundation.sql` listado.
  Qualquer arquivo adicional é bloqueante — investigar antes de prosseguir.

  _Nenhum arquivo alterado._

---

- [x] **T004** Confirmar ausência de entities e repositories existentes

  Executar:
  ```bash
  find lancarme-api/src/main/java/br/com/lancarme -name "*.java" | sort
  ```

  Confirmar que os únicos arquivos `.java` são:
  - `LancarmeApplication.java`
  - `health/controller/HealthController.java` (ou equivalente)
  - `health/dto/HealthResponse.java` (ou equivalente)
  - `shared/security/SecurityConfig.java`
  - `shared/config/CorsConfig.java`

  Critério: nenhum arquivo com sufixo `Entity.java`, `Repository.java`, `Service.java` (de domínio), `Controller.java` (de domínio) deve existir.

  _Nenhum arquivo alterado._

---

- [x] **T005** Confirmar dependências de JPA, Flyway, PostgreSQL e Testcontainers no `pom.xml`

  Ler `lancarme-api/pom.xml` e confirmar presença de:
  - `spring-boot-starter-data-jpa` (compile)
  - `flyway-core` (compile)
  - `flyway-database-postgresql` (compile)
  - `postgresql` driver (runtime)
  - `testcontainers-bom` em `<dependencyManagement>` versão `1.20.6`
  - `testcontainers:junit-jupiter` (test)
  - `testcontainers:postgresql` (test)
  - `spring-boot-starter-test` (test)

  Confirmar que **`maven-failsafe-plugin` está AUSENTE** em `<build><plugins>`.

  Critério: todas as dependências listadas presentes; Failsafe ausente (será adicionado na Fase 2).

  _Nenhum arquivo alterado._

---

- [x] **T006** [P] Confirmar que nenhum arquivo frontend será alterado

  Registrar explicitamente: nenhum arquivo sob `lancarme-web/` será criado, modificado ou deletado neste bloco.

  Registrar explicitamente: nenhum arquivo backend de domínio futuro (`auth/`, `workspace/`, `strategy/`, etc.) será criado com conteúdo funcional neste bloco.

  _Nenhum arquivo alterado._

---

**Checkpoint Fase 1**: Baseline registrada. Estado auditado e documentado.
`V1` confirmada como no-op. Nenhuma V2. Zero entities/repositories. Dependências confirmadas. Failsafe ausente confirmado.

---

## Fase 2 — Maven Failsafe Plugin (Bloqueante para Fase 5)

**Propósito**: Adicionar `maven-failsafe-plugin` ao `pom.xml` com configuração mínima para separar
`./mvnw test` (Surefire, testes rápidos) de `./mvnw verify` (Failsafe, testes de integração `*IT`).

**Crítico**: Esta fase deve ser concluída antes da criação de `DatabaseFlywayIT` (Fase 5),
pois sem o plugin o teste de integração nunca executa em `verify`.

---

- [x] **T007** Adicionar `maven-failsafe-plugin` em `lancarme-api/pom.xml`

  Arquivo alterado: `lancarme-api/pom.xml`

  Localizar o bloco `<build><plugins>` (atualmente contém apenas `spring-boot-maven-plugin`) e adicionar, **após** o plugin existente:

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

  Regras obrigatórias:
  - NÃO adicionar `<version>` explícita — o `spring-boot-starter-parent` 3.4.5 gerencia a versão via BOM
  - NÃO adicionar `<includes>` — o padrão padrão do Failsafe (`**/*IT.java`, `**/*ITCase.java`, `**/*IntegrationTest.java`) já cobre `DatabaseFlywayIT`
  - NÃO alterar o `spring-boot-maven-plugin` existente
  - NÃO alterar versões de dependências
  - NÃO adicionar dependências Maven além do plugin

  Critério de aceite:
  - `pom.xml` é XML válido
  - `maven-failsafe-plugin` presente em `<build><plugins>`
  - `spring-boot-maven-plugin` preservado sem alteração
  - Nenhuma outra mudança no arquivo

---

- [x] **T008** Verificar separação Surefire/Failsafe após adição do plugin

  Executar na raiz do `lancarme-api`:
  ```bash
  cd lancarme-api
  ./mvnw test
  ```

  Critérios obrigatórios:
  - Todos os testes rápidos existentes passam (`LancarmeApplicationTest`, `HealthControllerTest`)
  - `DatabaseFlywayIT` **NÃO aparece** nos resultados (a classe ainda não existe, mas confirmar que nenhum log menciona Failsafe executando testes de integração)
  - `BUILD SUCCESS`
  - Nenhuma linha de log menciona Testcontainers ou Docker

  Registrar o resultado completo do Maven.

---

**Checkpoint Fase 2**: `maven-failsafe-plugin` configurado. `./mvnw test` passa sem Testcontainers.

---

## Fase 3 — BaseEntity Abstrata (Pode executar após Fase 1)

**Propósito**: Criar a classe base abstrata `BaseEntity` como `@MappedSuperclass`
para ser herdada por todas as entidades de domínio nos blocos futuros.
Não cria tabela, não tem repository, não tem endpoint.

**Dependência**: Fase 1 concluída (estrutura de pacotes confirmada).

---

- [x] **T009** Criar diretório `shared/entity/` sob o pacote principal

  Verificar se o diretório existe:
  ```bash
  ls lancarme-api/src/main/java/br/com/lancarme/shared/
  ```

  Se não existir `entity/`, confirmar que será criado ao criar o arquivo Java.
  O diretório deve ser criado junto com o arquivo na T010.

  _Nenhum arquivo alterado (verificação apenas)._

---

- [x] **T010** Criar `BaseEntity.java`

  Arquivo criado: `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java`

  A classe deve implementar exatamente:

  ```java
  package br.com.lancarme.shared.entity;

  import jakarta.persistence.Column;
  import jakarta.persistence.GeneratedValue;
  import jakarta.persistence.GenerationType;
  import jakarta.persistence.Id;
  import jakarta.persistence.MappedSuperclass;
  import org.springframework.data.annotation.CreatedDate;
  import org.springframework.data.annotation.LastModifiedDate;
  import org.springframework.data.jpa.domain.support.AuditingEntityListener;

  import jakarta.persistence.EntityListeners;
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

      public UUID getId() {
          return id;
      }

      public Instant getCreatedAt() {
          return createdAt;
      }

      public Instant getUpdatedAt() {
          return updatedAt;
      }
  }
  ```

  Regras obrigatórias:
  - `@MappedSuperclass` — obrigatório; garante que nenhuma tabela é criada
  - `@EntityListeners(AuditingEntityListener.class)` — obrigatório para os campos auditáveis funcionarem nos blocos futuros
  - NÃO usar `@Entity` — quebraria a premissa de ausência de tabela
  - NÃO usar `@Table` — não pertinente a `@MappedSuperclass`
  - `@GeneratedValue(strategy = GenerationType.UUID)` — geração em Java/JPA, sem extensão PostgreSQL
  - Tipos temporais: `Instant` (compatível com fuso horário; preferível a `LocalDateTime`)
  - NÃO incluir campo `workspaceId` — conforme decisão do plan (nem toda entidade é multi-tenant)
  - NÃO criar repository para `BaseEntity`
  - NÃO criar endpoint para `BaseEntity`
  - NÃO usar Lombok (não está no `pom.xml` atual)
  - Getters apenas — sem setters públicos para `id`, `createdAt`, `updatedAt`
  - Compilação limpa sem warnings

  Justificativa técnica da estratégia escolhida (Java 21 + Spring Boot 3 + Hibernate 6):
  - `GenerationType.UUID` suportado nativamente pelo Hibernate 6 sem extensão PostgreSQL
  - `@CreatedDate` / `@LastModifiedDate` do Spring Data gerenciados pelo `AuditingEntityListener`
  - `@MappedSuperclass` faz o Hibernate ignorar esta classe para criação de schema — `ddl-auto: validate` não falha

---

- [x] **T011** Verificar que `BaseEntity` compila sem erros

  Executar:
  ```bash
  cd lancarme-api
  ./mvnw compile
  ```

  Critérios:
  - `BUILD SUCCESS`
  - Zero erros de compilação
  - Zero warnings relacionados a `BaseEntity`

  Registrar o resultado.

---

**Checkpoint Fase 3**: `BaseEntity` criada, compilando sem erros, sem tabela, sem repository, sem endpoint.

---

## Fase 4 — Configuração de Auditoria JPA (Depende da Fase 3)

**Propósito**: Habilitar `@EnableJpaAuditing` via classe de configuração dedicada em `shared/config/`.
Necessário para que `@CreatedDate` e `@LastModifiedDate` da `BaseEntity` funcionem nos blocos futuros.

**Dependência**: `BaseEntity` criada (Fase 3). `shared/config/` já existe (confirmado em T004).

---

- [x] **T012** Criar `JpaConfig.java`

  Arquivo criado: `lancarme-api/src/main/java/br/com/lancarme/shared/config/JpaConfig.java`

  A classe deve implementar exatamente:

  ```java
  package br.com.lancarme.shared.config;

  import org.springframework.context.annotation.Configuration;
  import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

  @Configuration
  @EnableJpaAuditing
  public class JpaConfig {
  }
  ```

  Regras obrigatórias:
  - `@Configuration` — obrigatório para o Spring reconhecer a configuração
  - `@EnableJpaAuditing` — obrigatório para ativar o mecanismo de auditoria Spring Data JPA
  - NÃO adicionar `AuditorAware` — não há auth neste bloco; `createdBy`/`updatedBy` não fazem parte da `BaseEntity`
  - NÃO adicionar regras de usuário autenticado
  - NÃO adicionar configuração de domínio
  - NÃO colocar em `LancarmeApplication.java` (poluiria o bootstrap)
  - Classe vazia é o correto para este bloco — apenas habilita o mecanismo

  Impacto esperado nos testes existentes:
  - `LancarmeApplicationTest` exclui `HibernateJpaAutoConfiguration` — JPA não carregado — `JpaConfig` não afeta este teste
  - `HealthControllerTest` usa `@WebMvcTest` sem JPA — `JpaConfig` não afeta este teste
  - Nenhum conflito esperado

---

- [x] **T013** Verificar que `JpaConfig` compila sem erros e testes rápidos continuam passando

  Executar:
  ```bash
  cd lancarme-api
  ./mvnw test
  ```

  Critérios:
  - `BUILD SUCCESS`
  - Todos os testes rápidos existentes passam (`LancarmeApplicationTest`, `HealthControllerTest`)
  - `DatabaseFlywayIT` ainda não existe — normal
  - Nenhuma linha menciona conflito de `JpaConfig` ou `@EnableJpaAuditing`

  Registrar o resultado.

---

**Checkpoint Fase 4**: `JpaConfig` criada. Auditoria JPA habilitada. Testes rápidos continuam passando sem regressão.

---

## Fase 5 — DatabaseFlywayIT com Testcontainers (Depende das Fases 2, 3 e 4)

**Propósito**: Criar o primeiro teste de integração com PostgreSQL real via Testcontainers.
Valida que Flyway executa a V1, que `flyway_schema_history` existe com status `SUCCESS`,
e que nenhuma tabela funcional de domínio foi criada indevidamente.

**Dependências**:
- Fase 2: `maven-failsafe-plugin` configurado
- Fase 3: `BaseEntity` criada (para garantir que `ddl-auto: validate` se comporta como esperado)
- Fase 4: `JpaConfig` criada (auditoria JPA habilitada)

---

- [x] **T014** Criar `DatabaseFlywayIT.java`

  Arquivo criado: `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java`

  Implementar exatamente:

  ```java
  package br.com.lancarme;

  import org.flywaydb.core.Flyway;
  import org.flywaydb.core.api.MigrationState;
  import org.junit.jupiter.api.Test;
  import org.springframework.beans.factory.annotation.Autowired;
  import org.springframework.boot.test.context.SpringBootTest;
  import org.springframework.test.context.DynamicPropertyRegistry;
  import org.springframework.test.context.DynamicPropertySource;
  import org.testcontainers.containers.PostgreSQLContainer;
  import org.testcontainers.junit.jupiter.Container;
  import org.testcontainers.junit.jupiter.Testcontainers;

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
          // contexto Spring carregou com DataSource, JPA e Flyway ativos — sem erro é o critério
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
                       "WHERE table_schema = 'public' " +
                       "AND table_type = 'BASE TABLE' " +
                       "AND table_name != 'flyway_schema_history'")) {
              assertThat(rs.next()).isFalse();
          }
      }
  }
  ```

  Regras obrigatórias:
  - `@SpringBootTest` sem exclusões — DataSource, JPA e Flyway devem ser carregados
  - `@Testcontainers` — gerencia o ciclo de vida do container
  - `@Container static` — container compartilhado entre os testes da classe para performance
  - `postgres:16-alpine` — mesma imagem do `docker-compose.yml` local
  - `@DynamicPropertySource` — substitui datasource do `application.yml` pelo container efêmero
  - NÃO usar `@ServiceConnection` — `spring-boot-testcontainers` não está no `pom.xml`
  - NÃO usar banco local `localhost:5432` — `@DynamicPropertySource` garante container efêmero
  - NÃO criar `application-test.yml` — `@DynamicPropertySource` resolve de forma limpa
  - Três testes:
    1. `contextLoadsWithRealDatabase` — contexto Spring carregou sem erro
    2. `flywayAppliedFoundationMigration` — V1 aplicada, versão "1", estado `SUCCESS`
    3. `noFunctionalDomainTablesExist` — zero tabelas além de `flyway_schema_history` no schema `public`
  - Sufixo `IT` — reconhecido pelo Failsafe por convenção padrão; **NÃO executado pelo Surefire**

  Lógica do terceiro teste (`noFunctionalDomainTablesExist`):
  - Query em `information_schema.tables`
  - Filtra `table_schema = 'public'` (ignora schemas de sistema)
  - Filtra `table_type = 'BASE TABLE'` (ignora views, sequences, etc.)
  - Exclui `flyway_schema_history` (único objeto legítimo após V1 no-op)
  - `assertThat(rs.next()).isFalse()` — zero linhas = zero tabelas funcionais
  - O teste falharia se existissem tabelas como `users`, `workspaces`, etc.

---

- [x] **T015** Verificar que `DatabaseFlywayIT` compila sem erros

  Executar:
  ```bash
  cd lancarme-api
  ./mvnw test-compile
  ```

  Critérios:
  - `BUILD SUCCESS`
  - `DatabaseFlywayIT.java` compilado sem erros
  - Nenhum import não resolvido

  Registrar o resultado.

---

**Checkpoint Fase 5**: `DatabaseFlywayIT` criada e compilando. Pronta para execução no `verify`.

---

## Fase 6 — Política de Seeds e Migrations (Documental)

**Propósito**: Registrar formalmente a política de seeds e migrations para os blocos futuros.
Nenhum arquivo executável é criado nesta fase. Somente atualização documental.

**Dependência**: Nenhuma — pode executar em paralelo com as Fases 3, 4 e 5.

---

- [x] **T016** [P] Verificar cumprimento da política de seeds e migrations

  Esta task é **verificadora e documental — nenhum arquivo de implementação é criado ou alterado**.

  `spec.md` e `plan.md` estão aprovados e **não devem ser alterados durante `/speckit.implement`**.

  Confirmar leitura de:
  - `specs/003-database-flyway/spec.md` — seção sobre Decisão de Seed de Desenvolvimento
  - `specs/003-database-flyway/plan.md` — seção sobre Política Futura de Seed

  Verificar que a política já registrada cobre:
  - Migrations aplicadas são imutáveis para sempre
  - Migrations novas surgem somente com necessidade real de schema de domínio
  - Seed somente será criado quando existir tabela funcional legítima
  - Seed será local/dev-only (`db/seed/dev-seed.sql`)
  - Seed não poderá ser executado automaticamente em produção por nenhum mecanismo
  - Seed jamais conterá dado pessoal real, senha, token ou secret
  - Seed deve ser repetível (`ON CONFLICT DO NOTHING` ou equivalente)
  - Migrations destrutivas futuras exigem análise de impacto documentada

  Confirmar que **não foram criados** neste bloco:
  - `data.sql`
  - `import.sql`
  - `dev-seed.sql` (nem vazio)
  - Migration de seed
  - Fixtures persistidas
  - Scripts SQL vazios
  - Nenhuma migration V2

  Registrar o cumprimento dessas decisões **somente em**:
  - `specs/003-database-flyway/implement-report.md` (seção de auditoria final de escopo — task T022)

  _Nenhum arquivo alterado._

---

**Checkpoint Fase 6**: Política de seeds e migrations verificada nos artefatos aprovados do bloco. Nenhum seed executável ou migration V2 criados. Cumprimento registrado no `implement-report.md`.

---

## Fase 7 — Testes e Validações Obrigatórias (Depende das Fases 1–5)

**Propósito**: Executar todas as validações obrigatórias e registrar os resultados.
Esta fase confirma que a implementação é correta, completa e sem regressões.

**Crítico**: Todas as tasks desta fase devem ser executadas em ordem. Falha em qualquer
critério é bloqueante — investigar e corrigir antes de avançar para a próxima task.

---

- [x] **T017** Validar configuração de infraestrutura Docker Compose

  Executar na raiz do monorepo:
  ```bash
  cd ~/Documentos/projetos/lancarme
  docker compose config
  ```

  Critérios:
  - Saída exibe configuração válida sem erros
  - Serviço `postgres` com imagem `postgres:16-alpine` presente
  - Porta `5432` mapeada em `127.0.0.1`
  - Nenhuma alteração foi feita no `docker-compose.yml`

  Registrar o resultado.

---

- [x] **T018** Executar testes rápidos backend (sem Testcontainers)

  Executar:
  ```bash
  cd lancarme-api
  ./mvnw test
  ```

  Critérios obrigatórios:
  - Todos os testes rápidos existentes executam e passam (baseline atual: `LancarmeApplicationTest`, `HealthControllerTest`)
  - `DatabaseFlywayIT` **NÃO aparece** nos resultados do Surefire
  - Nenhuma linha de log menciona Testcontainers, Docker ou container
  - `BUILD SUCCESS`

  Se `DatabaseFlywayIT` aparecer no output do `./mvnw test`, o `maven-failsafe-plugin` está mal configurado — retornar à Fase 2 e corrigir.

  Registrar o resultado completo (incluindo número de testes e fases executadas).

---

- [x] **T019** Executar testes completos com integração (com Testcontainers)

  Requisito: Docker disponível e rodando na máquina.

  Executar:
  ```bash
  cd lancarme-api
  ./mvnw verify
  ```

  Critérios obrigatórios:
  - Todos os testes rápidos existentes executam e passam via Surefire (baseline atual: `LancarmeApplicationTest`, `HealthControllerTest`)
  - `DatabaseFlywayIT` aparece explicitamente nos resultados do Failsafe com todos os métodos passando:
    - `contextLoadsWithRealDatabase` — PASSED
    - `flywayAppliedFoundationMigration` — PASSED
    - `noFunctionalDomainTablesExist` — PASSED
  - PostgreSQL Testcontainer é iniciado e encerrado durante o `verify`
  - Flyway executa a V1 no container sem erro
  - `flyway_schema_history` contém a V1 com status `SUCCESS`
  - Nenhuma tabela funcional além de `flyway_schema_history` detectada
  - `BUILD SUCCESS`

  Registrar o resultado completo (incluindo logs do Testcontainers e resultado de cada teste).

  Verificar no log que a URL do datasource usado pelo `DatabaseFlywayIT` é a do container
  (porta aleatória alta, ex: `jdbc:postgresql://localhost:XXXXX/test`), não `localhost:5432`.

---

- [x] **T020** Executar validação de regressão frontend

  Executar:
  ```bash
  cd lancarme-web
  npm run lint
  npm run typecheck
  npm run test
  npm run build
  ```

  Critérios obrigatórios:
  - `npm run lint` — zero erros
  - `npm run typecheck` — zero erros de tipagem
  - `npm run test` — todos os testes existentes passam (o Bloco 3 não altera nenhum arquivo frontend; a quantidade atual de testes passando é a baseline observada do Bloco 2, registrada como evidência no `implement-report.md`, não como exigência numérica rígida)
  - `npm run build` — build sem erros

  Confirmar que nenhum arquivo em `lancarme-web/` foi modificado neste bloco.

  Registrar o resultado de cada comando.

---

- [x] **T021** [P] Smoke test do healthcheck (opcional — executar se Docker local disponível)

  Este teste é opcional para o relatório final, mas recomendado para confirmar zero regressão.

  Em um terminal:
  ```bash
  cd lancarme-api
  SPRING_PROFILES_ACTIVE=local ./mvnw spring-boot:run
  ```

  Aguardar inicialização da API. Em outro terminal:
  ```bash
  curl -s http://localhost:8080/api/v1/health
  ```

  Resposta esperada:
  ```json
  {"status":"UP","service":"lancarme-api","version":"0.1.0"}
  ```

  Critérios:
  - HTTP 200
  - Payload exatamente como acima
  - Nenhum endpoint novo visível
  - Nenhuma alteração visual ou de contrato

  Registrar o resultado.
  Encerrar o processo da API após o teste.

---

**Checkpoint Fase 7**: Todas as validações executadas e registradas. Critérios atendidos.

---

## Fase 8 — Relatório Final do Bloco (Depende da Fase 7)

**Propósito**: Gerar o relatório de implementação do Bloco 3 como evidência final da execução.

---

- [x] **T022** Gerar `implement-report.md`

  Arquivo criado: `specs/003-database-flyway/implement-report.md`

  O relatório deve conter obrigatoriamente as seguintes seções:

  **1. Resumo executivo**
  - Status da implementação
  - Data de execução
  - Executor

  **2. Arquivos alterados ou criados**
  - Lista completa de todos os arquivos modificados ou criados neste bloco
  - Formato de tabela: `Arquivo | Tipo | Descrição`

  **3. Arquivos confirmados como inalterados**
  - `V1__platform_foundation.sql` — imutável
  - `application.yml` — sem alterações
  - `application-local.yml` — sem alterações
  - `docker-compose.yml` — sem alterações
  - `LancarmeApplicationTest.java` — preservado
  - `HealthControllerTest.java` — preservado
  - `lancarme-web/**` — nenhum arquivo frontend alterado

  **4. Auditoria final de escopo**
  - Confirmação de ausência de migration V2
  - Confirmação de ausência de seed executável
  - Confirmação de ausência de tabelas funcionais de domínio
  - Confirmação de ausência de entities concretas
  - Confirmação de ausência de repositories
  - Confirmação de ausência de alterações no frontend

  **5. Decisão implementada de `BaseEntity`**
  - Localização: `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java`
  - Anotações utilizadas e justificativa
  - Confirmação de que é `@MappedSuperclass` (não `@Entity`)
  - Confirmação de que não cria tabela

  **6. Configuração do Maven Failsafe**
  - Plugin adicionado ao `pom.xml`
  - Confirmação da separação `./mvnw test` vs `./mvnw verify`

  **7. Implementação do `DatabaseFlywayIT`**
  - Localização do arquivo
  - Descrição de cada método de teste
  - Tecnologias utilizadas
  - Confirmação de que usa PostgreSQL real via Testcontainers
  - Confirmação de que não depende de `localhost:5432`

  **8. Resultado de `docker compose config`**
  - Output completo ou resumo confirmando configuração válida

  **9. Resultado de `./mvnw test`**
  - Testes executados, testes passando
  - Confirmação de que `DatabaseFlywayIT` não aparece
  - Confirmação de que Testcontainers não foi iniciado

  **10. Resultado de `./mvnw verify`**
  - Testes executados, testes passando
  - Resultado de cada método de `DatabaseFlywayIT`
  - Confirmação de que Testcontainers foi iniciado
  - Confirmação da URL do datasource do container (não `localhost:5432`)

  **11. Resultado da regressão frontend**
  - Resultado de `npm run lint`
  - Resultado de `npm run typecheck`
  - Resultado de `npm run test`
  - Resultado de `npm run build`

  **12. Resultado do smoke test do healthcheck** (se executado)
  - Comando e resposta obtida

  **13. Riscos conhecidos**
  - Listar riscos residuais do bloco com referência ao plan (R-01 a R-08)
  - Classificar como mitigado, residual ou aceito

  **14. Recomendação**
  - Aprovado para prosseguir ao Bloco 4, ou
  - Pendências a corrigir antes da aprovação

---

**Checkpoint Fase 8**: `implement-report.md` gerado com todas as seções obrigatórias.

---

## Resumo de Arquivos por Fase

| Fase | Arquivos Criados / Alterados |
|------|------------------------------|
| 0 — Baseline Git | Nenhum (somente leitura de estado Git) |
| 1 — Auditoria | Nenhum (somente leitura e verificação) |
| 2 — Failsafe | `lancarme-api/pom.xml` (alterado) |
| 3 — BaseEntity | `lancarme-api/src/main/java/br/com/lancarme/shared/entity/BaseEntity.java` (criado) |
| 4 — JpaConfig | `lancarme-api/src/main/java/br/com/lancarme/shared/config/JpaConfig.java` (criado) |
| 5 — DatabaseFlywayIT | `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java` (criado) |
| 6 — Política seeds | Nenhum (somente verificação — `spec.md` e `plan.md` não são alterados) |
| 7 — Validações | Nenhum (execução de comandos e registro de resultados) |
| 8 — Relatório | `specs/003-database-flyway/implement-report.md` (criado) |

---

## Critérios Globais de Aprovação do Bloco

O Bloco 3 somente poderá ser declarado concluído quando TODOS os itens abaixo forem confirmados:

- [ ] `maven-failsafe-plugin` configurado em `pom.xml` sem `<version>` explícita
- [ ] `BaseEntity` existe em `br.com.lancarme.shared.entity.BaseEntity` como `@MappedSuperclass` com `id` (UUID), `createdAt` (Instant), `updatedAt` (Instant), sem `workspaceId`, sem `@Entity`
- [ ] `JpaConfig` existe em `br.com.lancarme.shared.config.JpaConfig` com `@EnableJpaAuditing`
- [ ] `DatabaseFlywayIT` existe em `lancarme-api/src/test/java/br/com/lancarme/DatabaseFlywayIT.java` com 3 métodos de teste
- [ ] `./mvnw test` — todos os testes rápidos existentes passando; `DatabaseFlywayIT` NÃO executado; Testcontainers NÃO iniciado; `BUILD SUCCESS`
- [ ] `./mvnw verify` — todos os testes passando; `DatabaseFlywayIT` aparece explicitamente no Failsafe com todos os métodos passando; `BUILD SUCCESS`
- [ ] Flyway executa V1 no container Testcontainers sem erro
- [ ] `flyway_schema_history` contém registro da versão 1 com estado `SUCCESS`
- [ ] Nenhuma tabela funcional de domínio no schema `public` (somente `flyway_schema_history`)
- [ ] `V1__platform_foundation.sql` inalterado
- [ ] Nenhuma migration V2 criada
- [ ] Nenhum seed executável criado
- [ ] `HealthControllerTest` — todos os métodos passando sem alteração
- [ ] `LancarmeApplicationTest` — passando sem alteração
- [ ] Frontend — todos os testes existentes passando sem alteração; nenhum arquivo de `lancarme-web/` modificado
- [ ] `docker compose config` retorna configuração válida
- [ ] `GET /api/v1/health` retorna `{"status":"UP","service":"lancarme-api","version":"0.1.0"}`
- [ ] Nenhum secret real ou PII em nenhum arquivo do bloco
- [ ] `BaseEntity` sem repository, sem endpoint, sem tabela
- [ ] `implement-report.md` gerado com todas as seções obrigatórias
