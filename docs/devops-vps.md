# Lançar.me — DevOps VPS Guide

## 1. Objetivo

Publicar o Lançar.me em VPS de baixo custo com padrão profissional: Docker Compose, SSL, logs, backup, restore, firewall, healthcheck e rollback.

## 2. Ambiente inicial sugerido

- Hostinger VPS KVM 2 para início econômico.
- Hostinger VPS KVM 4 para beta mais confortável.
- Ubuntu LTS.
- Docker.
- Docker Compose.
- Caddy ou Nginx.
- Cloudflare DNS.
- PostgreSQL container ou banco gerenciado.
- Redis container quando necessário.

## 3. Containers esperados

```txt
lancarme-web
lancarme-api
postgres
redis
caddy
```

## 4. Variáveis de ambiente

Frontend:

```env
VITE_API_BASE_URL=https://api.lancar.me/api/v1
```

Backend:

```env
SPRING_PROFILES_ACTIVE=prod
DATABASE_URL=jdbc:postgresql://postgres:5432/lancarme
DATABASE_USERNAME=lancarme
DATABASE_PASSWORD=change-me
JWT_SECRET=change-me
OPENAI_API_KEY=
ANTHROPIC_API_KEY=
RESEND_API_KEY=
R2_ACCESS_KEY_ID=
R2_SECRET_ACCESS_KEY=
R2_BUCKET=
```

## 5. Segurança do servidor

Obrigatório:

- SSH por chave.
- Desabilitar login root por senha.
- Firewall ativo.
- Apenas portas 22, 80, 443 abertas publicamente.
- Docker sem expor Postgres publicamente.
- Backups fora da VPS.
- Atualizações de segurança.
- Logs persistentes.

## 6. Backup mínimo

- Dump diário do PostgreSQL.
- Retenção de 7 a 14 dias.
- Envio para R2 ou storage externo.
- Script de restore.
- Teste mensal de restore.

## 7. Healthchecks

Backend:

```txt
GET /api/v1/health
```

Deve retornar:

```json
{
  "status": "UP",
  "service": "lancarme-api"
}
```

## 8. Rollback

Cada deploy deve permitir voltar para imagem anterior.

Regra:

- não rodar migration destrutiva sem backup;
- migrations irreversíveis exigem revisão;
- release deve registrar tag/commit.

## 9. Produção real

Antes de usuários pagantes:

- domínio configurado;
- SSL ativo;
- backup testado;
- logs e monitoramento;
- política de privacidade;
- termos de uso;
- billing em sandbox validado;
- workspace isolation testado;
- IA com créditos funcionando;
- rate limits ativos.
