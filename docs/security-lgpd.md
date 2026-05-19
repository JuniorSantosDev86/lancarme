# Lançar.me — Security & LGPD

## 1. Princípio

Segurança e LGPD entram desde a fundação. O Lançar.me lidará com dados de campanhas, ofertas, clientes, alunos, provas sociais, métricas, arquivos, billing e uso de IA. Esses dados exigem isolamento, rastreabilidade e tratamento responsável.

## 2. Ameaças principais

- Acesso cruzado entre workspaces.
- Vazamento de arquivos privados.
- Consumo indevido de créditos de IA.
- Cobrança incorreta.
- Webhook fraudulento ou duplicado.
- Prompt injection em ações de IA.
- Exposição de dados sensíveis em logs.
- Upload malicioso.
- Falta de backup.
- Ausência de política clara sobre uso de dados na IA.

## 3. Controles obrigatórios

### 3.1 Autenticação

- Hash de senha forte se auth própria for usada.
- JWT de curta duração.
- Refresh token com rotação.
- Logout revogável.
- Rate limit em login.
- Proteção contra brute force.
- 2FA como melhoria futura.

### 3.2 Autorização

- Validar roles no backend.
- Validar membership do workspace.
- Não confiar em `workspaceId` enviado pelo frontend.
- Policies por módulo.
- Rotas administrativas protegidas.

### 3.3 Multi-tenancy

Toda entidade crítica precisa de `workspaceId`.

Obrigatório testar:

- usuário A não acessa entidade do workspace B;
- usuário sem permissão não edita recurso;
- link público só abre se token válido;
- arquivo privado não abre por URL direta.

### 3.4 Arquivos

- Upload privado por padrão.
- URLs assinadas com expiração.
- Validação de tipo e tamanho.
- Limite por plano.
- Scanner/validação futura para arquivos críticos.
- Nome físico não deve expor nome original sensível.

### 3.5 Webhooks

- Verificar assinatura do provider.
- Idempotência por eventId.
- Logs de eventos.
- Não liberar plano sem confirmação válida.
- Retentativas seguras.

### 3.6 IA

- Prompt registry versionado.
- Sanitização de entradas.
- Guardrails contra promessa abusiva.
- Logs de custo sem dados sensíveis excessivos.
- Não usar dados privados em exemplos globais.
- Política clara sobre envio de dados a provedores de IA.

## 4. LGPD

### 4.1 Bases e finalidade

Documentar finalidade para:

- cadastro;
- billing;
- suporte;
- geração de campanhas;
- armazenamento de provas;
- acompanhamento de alunos/clientes;
- analytics de produto;
- logs de segurança.

### 4.2 Minimização

Coletar apenas dados necessários.

Evitar campos sensíveis sem necessidade:

- saúde;
- religião;
- política;
- dados de menores;
- dados financeiros detalhados;
- documentos pessoais.

### 4.3 Direitos do titular

Preparar fluxo para:

- acesso;
- correção;
- exportação;
- exclusão;
- revogação de consentimento quando aplicável.

### 4.4 Provas sociais

Proof Vault precisa de status de autorização.

Campos recomendados:

- tipo de prova;
- origem;
- pessoa/cliente;
- autorização de uso;
- escopo de uso;
- data de autorização;
- arquivo;
- tags;
- observações.

Provas sem autorização não devem ser sugeridas para criativos públicos.

### 4.5 Retenção

Definir retenção para:

- logs de IA;
- audit logs;
- arquivos;
- dados de billing;
- contas canceladas;
- dados de alunos/clientes;
- backups.

## 5. Checklist antes de usuários reais

- [ ] Política de privacidade publicada.
- [ ] Termos de uso publicados.
- [ ] Consentimento sobre uso de IA explicado.
- [ ] Exclusão de conta planejada.
- [ ] Backup diário automático.
- [ ] Restore testado.
- [ ] Arquivos privados por padrão.
- [ ] Logs sem secrets.
- [ ] Rate limit em login e IA.
- [ ] Workspace isolation testado.
- [ ] Webhooks idempotentes.
- [ ] Variáveis de ambiente protegidas.
- [ ] HTTPS ativo.
- [ ] Firewall ativo.
- [ ] Runbook de incidente.

## 6. Regras para Codex/Claude

Agentes não podem:

- remover validação de workspace;
- criar endpoint sem auth quando o dado for privado;
- expor arquivo com URL pública permanente;
- logar token, senha, chave de API ou payload sensível;
- criar IA ilimitada;
- ignorar LGPD por “ser beta”.
