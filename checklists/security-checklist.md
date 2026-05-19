# Security Checklist

## Per feature

- [ ] Endpoint privado exige autenticação.
- [ ] Backend valida workspace.
- [ ] Backend valida role/permissão.
- [ ] Inputs têm validação server-side.
- [ ] Erros não expõem stack trace em produção.
- [ ] Logs não expõem secrets.
- [ ] Queries multi-tenant filtram workspace.
- [ ] Arquivos privados usam URL assinada.
- [ ] Webhooks validam assinatura.
- [ ] Operação crítica gera audit log.

## Before beta

- [ ] HTTPS.
- [ ] Firewall.
- [ ] Backup diário.
- [ ] Restore testado.
- [ ] Rate limit em auth e IA.
- [ ] Política de privacidade.
- [ ] Termos de uso.
- [ ] Secrets fora do Git.
- [ ] Sentry/PostHog ou equivalente.
- [ ] Teste de isolamento por workspace.
