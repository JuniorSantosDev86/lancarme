# Lançar.me — API Guidelines

## 1. Padrão de rotas

Todas as rotas públicas/privadas da API devem ser versionadas:

```txt
/api/v1/<resource>
```

## 2. Convenções

- Usar JSON.
- Usar DTOs públicos.
- Não retornar entidades JPA diretamente.
- Erros devem seguir formato padrão.
- Paginação obrigatória em listas grandes.
- Filtros devem ser explícitos.
- Datas em ISO-8601.
- Valores monetários preferencialmente em centavos ou BigDecimal com moeda clara.

## 3. Erro padrão

```json
{
  "timestamp": "2026-05-19T00:00:00Z",
  "status": 400,
  "error": "VALIDATION_ERROR",
  "message": "Campos inválidos.",
  "path": "/api/v1/products",
  "details": [
    { "field": "name", "message": "Nome é obrigatório." }
  ]
}
```

## 4. Resposta paginada

```json
{
  "items": [],
  "page": 0,
  "size": 20,
  "totalItems": 0,
  "totalPages": 0
}
```

## 5. Endpoints iniciais

### Health

- GET `/api/v1/health`

### Auth

- POST `/api/v1/auth/register`
- POST `/api/v1/auth/login`
- POST `/api/v1/auth/refresh`
- POST `/api/v1/auth/logout`
- GET `/api/v1/auth/me`

### Workspace

- GET `/api/v1/workspaces/current`
- PATCH `/api/v1/workspaces/current`
- GET `/api/v1/workspaces/current/members`

### Strategy

- GET `/api/v1/products`
- POST `/api/v1/products`
- GET `/api/v1/products/{id}`
- PATCH `/api/v1/products/{id}`
- DELETE `/api/v1/products/{id}`

- POST `/api/v1/products/{productId}/avatars`
- PATCH `/api/v1/avatars/{id}`

- POST `/api/v1/products/{productId}/offers`
- PATCH `/api/v1/offers/{id}`

### AI

- GET `/api/v1/ai/credits/balance`
- GET `/api/v1/ai/actions`
- POST `/api/v1/ai/actions/generate-launch-plan`
- POST `/api/v1/ai/actions/generate-content-matrix`
- POST `/api/v1/ai/actions/generate-copy`
- POST `/api/v1/ai/actions/generate-creative-angles`
- POST `/api/v1/ai/actions/diagnose-traffic`

### Billing

- GET `/api/v1/billing/plan`
- POST `/api/v1/billing/checkout`
- POST `/api/v1/billing/webhooks/{provider}`

## 6. Segurança

- Toda rota privada exige token válido.
- Toda rota multi-tenant valida workspace no backend.
- IDs públicos devem ser UUID.
- Soft delete quando exclusão puder afetar histórico.
- Webhook usa rota dedicada e valida assinatura.
