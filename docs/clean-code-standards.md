# Lançar.me — Clean Code Standards

## 1. Backend Java

### Controllers

Controllers devem:

- receber request;
- validar DTO;
- chamar service;
- retornar response DTO;
- não conter regra de negócio.

### Services

Services devem:

- coordenar regra de negócio;
- controlar transações;
- validar permissões;
- chamar repositories;
- emitir logs de domínio quando necessário.

### Repositories

Repositories devem:

- encapsular queries;
- sempre considerar workspace em entidades multi-tenant;
- não retornar dados de outro workspace;
- evitar queries mágicas sem teste.

### DTOs

- Request DTO separado de Response DTO.
- Entidade JPA nunca deve ser response pública.
- Validar com Bean Validation.

### Exceptions

- Usar exceções de domínio.
- Mapear para erro HTTP consistente.
- Não expor stack trace em produção.

## 2. Frontend React

### Componentes

Componentes devem:

- ser pequenos;
- ter props claras;
- não conter regra de negócio crítica;
- tratar loading/error/empty;
- ter labels acessíveis;
- usar PT-BR;
- ter data-testid nos fluxos críticos.

### Estado

- TanStack Query para dados do servidor.
- Estado local para UI simples.
- Evitar estado global sem necessidade.

### Forms

- React Hook Form.
- Zod.
- Mensagens claras.
- Validação também no backend.

## 3. Commits

Padrão:

```txt
feat(strategy): add product creation
fix(ai): prevent credit debit when provider fails
test(auth): add login integration tests
chore(docs): update LGPD checklist
```

## 4. Documentação

Toda decisão importante deve ser registrada em:

- docs/architecture.md;
- ADR futuro;
- spec da feature;
- plan/tasks quando aplicável.

## 5. Proibido

- controller gordo;
- service gigante;
- componente React com regra crítica;
- entidade como DTO;
- query sem workspace em dado privado;
- provider de IA no frontend;
- logs com secrets;
- teste removido sem substituição;
- TODO sem ticket/contexto.
