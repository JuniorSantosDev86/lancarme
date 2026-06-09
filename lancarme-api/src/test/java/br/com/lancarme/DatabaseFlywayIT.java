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
import java.util.Arrays;

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
    }

    @Test
    void flywayAppliedFoundationMigration(@Autowired Flyway flyway) {
        var applied = flyway.info().applied();
        var v1 = Arrays.stream(applied)
                .filter(info -> "1".equals(info.getVersion().toString()))
                .findFirst();
        assertThat(v1).as("Migration V1 must be present").isPresent();
        assertThat(v1.get().getState())
                .as("Migration V1 must have succeeded")
                .isEqualTo(MigrationState.SUCCESS);
    }

    @Test
    void flywaySchemaHistoryTableExists(@Autowired DataSource dataSource) throws Exception {
        try (var conn = dataSource.getConnection();
             var rs = conn.createStatement().executeQuery(
                     "SELECT table_name FROM information_schema.tables " +
                     "WHERE table_schema = 'public' " +
                     "AND table_name = 'flyway_schema_history'")) {
            assertThat(rs.next()).as("flyway_schema_history table must exist").isTrue();
        }
    }

    @Test
    void doesNotCreateDomainTablesBeforeDomainMigrationsAreIntroduced(@Autowired DataSource dataSource) throws Exception {
        // guardrail: bloco 3 não cria schema de domínio — revisar no primeiro bloco com migration real
        try (var conn = dataSource.getConnection();
             var rs = conn.createStatement().executeQuery(
                     "SELECT table_name FROM information_schema.tables " +
                     "WHERE table_schema = 'public' " +
                     "AND table_type = 'BASE TABLE' " +
                     "AND table_name != 'flyway_schema_history'")) {
            assertThat(rs.next())
                    .as("No domain tables should exist before domain migrations are introduced")
                    .isFalse();
        }
    }
}
