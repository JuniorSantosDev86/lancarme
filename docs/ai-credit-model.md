# Lançar.me — AI Credit Model

## 1. Decisão

A IA do Lançar.me será operacional, guiada por módulos e cobrada por créditos. O usuário verá **Créditos de IA**, não tokens.

O sistema interno calculará tokens, custo estimado, modelo usado e margem por ação.

## 2. Princípios

1. Não vender IA ilimitada.
2. Não usar modelo caro para tarefa simples.
3. Não reenviar contexto inteiro sem necessidade.
4. Não cobrar excedente automático sem autorização.
5. Não apagar materiais já gerados quando créditos acabam.
6. Não inventar métricas ou resultados.
7. Não prometer faturamento garantido.
8. Todo output deve ser editável.

## 3. Planos sugeridos

### Free

- 30 a 50 créditos/mês.
- 1 produto.
- 1 lançamento rascunho.
- Bloqueio ao acabar créditos.
- Sem excedente automático.

### Starter

- 200 a 300 créditos/mês.
- ConteúdoMatriz básico.
- Copy Room básica.
- Pacotes extras pré-pagos.

### Creator

- 800 a 1.500 créditos/mês.
- ConteúdoMatriz completo.
- Copy Room avançada.
- Creative Room.
- Calendar.
- Proof Vault básico.

### Pro

- 3.000 a 5.000 créditos/mês.
- Traffic Room.
- Analytics.
- MentorFlow.
- Diagnósticos avançados.

### Agency

- 10.000+ créditos/mês.
- Múltiplos clientes/workspaces.
- Permissões.
- Relatórios com marca.
- Excedente configurável.

## 4. Custo por ação sugerido

| Ação | Créditos |
|---|---:|
| Ideia simples de post | 1 |
| Legenda curta | 1 |
| Post completo | 2 |
| Roteiro de Reels | 3 |
| Carrossel | 5 |
| E-mail individual | 4 |
| Sequência de 5 e-mails | 15 |
| Página de captura | 12 |
| Página de vendas curta | 25 |
| Página de vendas longa | 50 |
| Plano de lançamento | 30 |
| Matriz de criativos | 25 |
| Plano de tráfego | 40 |
| Diagnóstico de métricas | 35 |
| Campanha completa | 100 a 180 |
| Relatório pós-lançamento | 80 |

## 5. Entidades

### AiActionLog

Campos:

- id;
- workspaceId;
- userId;
- module;
- action;
- provider;
- model;
- promptVersion;
- inputTokenEstimate;
- outputTokenEstimate;
- creditsCharged;
- status;
- errorCode;
- latencyMs;
- createdAt.

### AiCreditLedger

Campos:

- id;
- workspaceId;
- userId;
- type: GRANT, DEBIT, REFUND, PACKAGE_PURCHASE, ADJUSTMENT;
- amount;
- balanceAfter;
- source;
- relatedActionId;
- expiresAt;
- createdAt.

## 6. Fluxo obrigatório

1. User aciona ação.
2. Backend valida auth.
3. Backend valida workspace.
4. Backend valida plano.
5. Backend calcula crédito necessário.
6. Backend bloqueia se saldo insuficiente.
7. Backend monta contexto mínimo.
8. Backend renderiza prompt versionado.
9. AI Gateway chama provider.
10. Backend valida output.
11. Backend debita créditos.
12. Backend salva log.
13. Backend salva resultado.
14. Frontend mostra output editável.

## 7. Falhas

- Falha antes da chamada ao provider: não debitar.
- Timeout sem resposta útil: não debitar ou debitar parcialmente apenas se regra futura permitir.
- Output inválido: registrar erro e não persistir como válido.
- Falha após output válido e antes de persistência: transação deve evitar inconsistência.
- Sem saldo: bloquear antes de chamar provider.

## 8. Guardrails de marketing

A IA deve evitar:

- renda garantida;
- ROAS garantido;
- promessas médicas/financeiras sensíveis;
- manipulação abusiva;
- burlar políticas de anúncio;
- depoimentos inventados;
- métricas falsas;
- urgência enganosa.

## 9. Prompt Registry

Cada prompt deve ter:

- id;
- versão;
- módulo;
- ação;
- modelo recomendado;
- custo em créditos;
- schema de input;
- schema de output;
- guardrails;
- exemplos;
- data de criação;
- changelog.

## 10. Provedores

O backend deve usar adapters:

```txt
AiProvider
  OpenAiProvider
  AnthropicProvider
  GeminiProvider
```

A escolha de modelo deve ser configurável por ação e plano.
