# top-infrastructure

Infraestrutura completa para o projeto Top Challenge - Sistema de microserviços e microfrontends.

## 📋 Visão Geral

Este repositório contém a infraestrutura necessária para executar todo o ecossistema da aplicação:

- **3 Microserviços Backend** (NestJS + TCP + Knex.js)
- **1 API Gateway** (NestJS HTTP → TCP)
- **3 Aplicações Frontend** (React + Vite + Module Federation)
- **2 Bancos de Dados** (PostgreSQL)

## 🏗️ Arquitetura

```
┌─────────────────────────────────────────────────────────────┐
│                        FRONTEND LAYER                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐      │
│  │   Shell      │  │    Users     │  │   Finance    │      │
│  │   :3000      │  │    :3001     │  │    :3002     │      │
│  │ (Module Fed) │  │ (Module Fed) │  │ (Module Fed) │      │
│  └──────────────┘  └──────────────┘  └──────────────┘      │
│         │                  │                  │              │
│         └──────────────────┼──────────────────┘              │
│                            │                                 │
└────────────────────────────┼─────────────────────────────────┘
                             │
┌────────────────────────────▼─────────────────────────────────┐
│                       API GATEWAY :4000                       │
│                         (HTTP → TCP)                          │
└────────────────────────────┬─────────────────────────────────┘
                             │
            ┌────────────────┼────────────────┐
            │                │                │
┌───────────▼────────┐  ┌───▼────────┐  ┌───▼────────┐
│   top-users        │  │ top-finance │  │            │
│   TCP :4001        │  │ TCP :4002   │  │   Future   │
│   ┌──────────┐     │  │ ┌──────────┐│  │  Services  │
│   │ DB Users │     │  │ │ DB Finance││  │            │
│   │  :5432   │     │  │ │  :5433   ││  │            │
│   └──────────┘     │  │ └──────────┘│  │            │
└────────────────────┘  └─────────────┘  └────────────┘
```

## 📦 Serviços

### Backend

| Serviço | Tecnologia | Porta | Banco | Descrição |
|---------|-----------|-------|-------|-----------|
| **top-users** | NestJS TCP | 4001 | PostgreSQL :5432 | Microserviço de usuários |
| **top-finance** | NestJS TCP | 4002 | PostgreSQL :5433 | Microserviço de finanças |
| **top-api-gateway** | NestJS HTTP | 4000 | - | API Gateway HTTP → TCP |

### Frontend

| Aplicação | Tecnologia | Porta | Descrição |
|-----------|-----------|-------|-----------|
| **top-frontend-shell** | React + Vite | 3000 | Aplicação principal (login + orquestração) |
| **top-frontend-users** | React + Vite | 3001 | Microfrontend CRUD de usuários |
| **top-frontend-finance** | React + Vite | 3002 | Microfrontend CRUD de finanças |

### Bancos de Dados

| Banco | Porta | Nome | Usuário | Senha |
|-------|-------|------|---------|-------|
| PostgreSQL (Users) | 5432 | top_users_db | postgres | postgres |
| PostgreSQL (Finance) | 5433 | top_finance_db | postgres | postgres |

## 🚀 Como Usar

### Opção 1: Usando Repositórios Locais (Desenvolvimento Local)

Se você já tem os repositórios clonados localmente:

```bash
# Estrutura esperada:
# .
# ├── top-infrastructure/        (este repositório)
# ├── top-users/
# ├── top-finance/
# ├── top-api-gateway/
# ├── top-frontend-shell/
# ├── top-frontend-users/
# └── top-frontend-finance/

# 1. Entre no diretório de infraestrutura
cd top-infrastructure

# 2. Suba todos os serviços
docker-compose up --build

# 3. Aguarde todos os serviços iniciarem (pode levar 2-3 minutos)

# 4. Acesse as aplicações
# Frontend Shell: http://localhost:3000
# API Gateway: http://localhost:4000
```

### Opção 2: Clonando Repositórios (Primeira vez)

```bash
# 1. Clone o repositório de infraestrutura
git clone <URL_DO_REPO_INFRASTRUCTURE> top-infrastructure
cd top-infrastructure

# 2. Execute o script de setup
./setup.sh

# 3. Suba os serviços
docker-compose up --build
```

## 📝 Script de Setup

O script `setup.sh` automatiza:

1. ✅ Clonagem de todos os repositórios
2. ✅ Instalação de dependências
3. ✅ Configuração de arquivos `.env`
4. ✅ Validação da estrutura

**Para usar:**

```bash
chmod +x setup.sh
./setup.sh
```

**Importante:** Edite o `setup.sh` e adicione as URLs reais dos repositórios Git antes de executar.

## 🔧 Comandos Docker Compose

### Iniciar todos os serviços

```bash
docker-compose up
```

### Iniciar com rebuild

```bash
docker-compose up --build
```

### Iniciar em background

```bash
docker-compose up -d
```

### Parar todos os serviços

```bash
docker-compose down
```

### Parar e remover volumes (limpa bancos de dados)

```bash
docker-compose down -v
```

### Ver logs de um serviço específico

```bash
docker-compose logs -f top-users
docker-compose logs -f top-api-gateway
docker-compose logs -f top-frontend-shell
```

### Reiniciar um serviço específico

```bash
docker-compose restart top-users
```

### Executar comando em um container

```bash
# Executar migrations manualmente
docker-compose exec top-users npm run migration:run

# Executar seeds
docker-compose exec top-users npm run seed:run

# Acessar shell do container
docker-compose exec top-users sh
```

## 🗄️ Gerenciamento de Banco de Dados

### Conectar ao banco via psql

```bash
# Banco de users
docker-compose exec db-users psql -U postgres -d top_users_db

# Banco de finance
docker-compose exec db-finance psql -U postgres -d top_finance_db
```

### Executar migrações

```bash
# top-users
docker-compose exec top-users npm run migration:run

# top-finance
docker-compose exec top-finance npm run migration:run
```

### Reverter migrações

```bash
# top-users
docker-compose exec top-users npm run migration:rollback

# top-finance
docker-compose exec top-finance npm run migration:rollback
```

### Executar seeds

```bash
# top-users
docker-compose exec top-users npm run seed:run

# top-finance
docker-compose exec top-finance npm run seed:run
```

## 🧪 Executar Testes

### Testes E2E Backend

```bash
# top-users
docker-compose exec top-users npm run test:e2e

# top-finance
docker-compose exec top-finance npm run test:e2e

# top-api-gateway
docker-compose exec top-api-gateway npm run test:e2e
```

### Testes Unitários Frontend

```bash
# top-frontend-shell
docker-compose exec top-frontend-shell npm test

# top-frontend-users
docker-compose exec top-frontend-users npm test

# top-frontend-finance
docker-compose exec top-frontend-finance npm test
```

## 🌐 URLs de Acesso

Após subir os serviços, acesse:

### Frontend
- **Shell (Principal):** http://localhost:3000
  - Login: `admin` / `admin123` ou `user` / `user123`
- **Users (Microfrontend):** http://localhost:3001
- **Finance (Microfrontend):** http://localhost:3002

### Backend
- **API Gateway:** http://localhost:4000
  - Health: http://localhost:4000/health
  - Swagger (se configurado): http://localhost:4000/api

### Bancos de Dados
- **PostgreSQL Users:** localhost:5432
- **PostgreSQL Finance:** localhost:5433

## 🐛 Troubleshooting

### Serviço não inicia

```bash
# Ver logs detalhados
docker-compose logs -f <nome-do-servico>

# Verificar status
docker-compose ps

# Reiniciar serviço
docker-compose restart <nome-do-servico>
```

### Erro de conexão com banco de dados

```bash
# Verificar se o banco está rodando
docker-compose ps db-users db-finance

# Verificar logs do banco
docker-compose logs -f db-users

# Recriar bancos de dados
docker-compose down -v
docker-compose up -d db-users db-finance
```

### Porta já em uso

```bash
# Verificar quais processos estão usando as portas
lsof -i :3000
lsof -i :4000
lsof -i :5432

# Matar processo
kill -9 <PID>

# Ou alterar portas no docker-compose.yml
```

### Frontend não carrega microfrontends

1. Verifique se todos os frontends estão rodando:
   ```bash
   docker-compose ps top-frontend-shell top-frontend-users top-frontend-finance
   ```

2. Verifique os logs:
   ```bash
   docker-compose logs -f top-frontend-shell
   ```

3. Acesse diretamente os microfrontends para verificar se estão funcionando:
   - http://localhost:3001
   - http://localhost:3002

### Rebuild completo

Se nada funcionar, faça um rebuild completo:

```bash
# Parar tudo e limpar
docker-compose down -v
docker system prune -a

# Reconstruir e subir
docker-compose up --build
```

## 📊 Monitoramento

### Verificar saúde dos serviços

```bash
# Listar todos os containers
docker-compose ps

# Ver uso de recursos
docker stats

# Ver logs em tempo real de todos os serviços
docker-compose logs -f
```

### Verificar banco de dados

```bash
# Verificar tabelas do banco de users
docker-compose exec db-users psql -U postgres -d top_users_db -c "\dt"

# Verificar tabelas do banco de finance
docker-compose exec db-finance psql -U postgres -d top_finance_db -c "\dt"
```

## 🔒 Segurança

**⚠️ IMPORTANTE:** As senhas neste repositório são para desenvolvimento/demonstração apenas.

Para produção:
1. ✅ Altere todas as senhas nos arquivos `.env`
2. ✅ Use secrets do Docker ou variáveis de ambiente
3. ✅ Configure SSL/TLS
4. ✅ Implemente autenticação JWT real
5. ✅ Configure CORS adequadamente
6. ✅ Use variáveis de ambiente para URLs

## 📚 Documentação Adicional

Cada serviço possui seu próprio README detalhado:

- [top-users/README.md](../top-users/README.md)
- [top-finance/README.md](../top-finance/README.md)
- [top-api-gateway/README.md](../top-api-gateway/README.md)
- [top-frontend-shell/README.md](../top-frontend-shell/README.md)
- [top-frontend-users/README.md](../top-frontend-users/README.md)
- [top-frontend-finance/README.md](../top-frontend-finance/README.md)

## 🤝 Contribuindo

1. Clone o repositório
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📄 Licença

ISC

## 👥 Equipe

Desenvolvido como parte do Desafio Técnico para Desenvolvedor(a) Sênior Full Stack.

---
