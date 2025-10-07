# Microservices Project - Guia de Execução

Sistema de microserviços com arquitetura de microfrontends utilizando Module Federation.

## 🏗️ Arquitetura

O projeto é composto por:

### Backend

- **top-users**: Microserviço de gerenciamento de usuários (NestJS + PostgreSQL)
- **top-finance**: Microserviço de gerenciamento de finanças (NestJS + PostgreSQL)
- **top-api-gateway**: Gateway que centraliza as requisições HTTP para os microserviços

### Frontend

- **top-frontend-shell**: Aplicação shell principal com autenticação e roteamento
- **top-frontend-users**: Microfrontend de gerenciamento de usuários (React + Material-UI)
- **top-frontend-finance**: Microfrontend de gerenciamento de finanças (React + Ant Design)

### Infraestrutura

- **top-infrastructure**: Scripts e configurações Docker Compose para PostgreSQL

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- npm ou yarn
- Docker e Docker Compose

## 🚀 Como Rodar o Projeto

### 1. Configurar Bancos de Dados

```bash
cd top-infrastructure
docker-compose up -d
```

Isso iniciará dois bancos PostgreSQL:

- `top_users_db` na porta **5432**
- `top_finance_db` na porta **5433**

### 2. Instalar Dependências

Na raiz do projeto, execute para cada serviço:

```bash
# Backend
cd top-users && npm install && cd ..
cd top-finance && npm install && cd ..
cd top-api-gateway && npm install && cd ..

# Frontend
cd top-frontend-shell && npm install && cd ..
cd top-frontend-users && npm install && cd ..
cd top-frontend-finance && npm install && cd ..
```

### 3. Configurar Variáveis de Ambiente

Cada projeto já possui um arquivo `.env.example`. Copie-o para `.env` se necessário:

```bash
# Backend
cp top-users/.env.example top-users/.env
cp top-finance/.env.example top-finance/.env
cp top-api-gateway/.env.example top-api-gateway/.env

# Frontend
cp top-frontend-shell/.env.example top-frontend-shell/.env
cp top-frontend-users/.env.example top-frontend-users/.env
cp top-frontend-finance/.env.example top-frontend-finance/.env
```

### 4. Executar Migrações e Seeds

```bash
# Microserviço de Usuários (porta 5432)
cd top-users
npm run migration:run
npm run seed:run
cd ..

# Microserviço de Finanças (porta 5433)
cd top-finance
DB_PORT=5433 npm run migration:run
DB_PORT=5433 npm run seed:run
cd ..
```

### 5. Iniciar os Microserviços Backend

Abra **3 terminais diferentes**:

**Terminal 1 - Users Service:**

```bash
cd top-users
npm run start:dev
```

✅ Rodará na porta **4001** (TCP)

**Terminal 2 - Finance Service:**

```bash
cd top-finance
npm run start:dev
```

✅ Rodará na porta **4002** (TCP)

**Terminal 3 - API Gateway:**

```bash
cd top-api-gateway
npm run start:dev
```

✅ Rodará na porta **4000** (HTTP)

### 6. Build e Iniciar os Microfrontends

Os microfrontends precisam ser buildados antes de serem servidos:

**Terminal 4 - Users Microfrontend:**

```bash
cd top-frontend-users
npm run build
npm run preview
```

✅ Rodará na porta **3001**

**Terminal 5 - Finance Microfrontend:**

```bash
cd top-frontend-finance
npm run build
npm run preview
```

✅ Rodará na porta **3002**

### 7. Iniciar o Shell Application

**Terminal 6 - Shell Application:**

```bash
cd top-frontend-shell
npm run dev
```

✅ Rodará na porta **3000**

## 🌐 Acessar a Aplicação

Abra o navegador em: **<http://localhost:3000>**

### 👤 Credenciais de Login

**Opção 1:**

- **Username**: `admin`
- **Password**: `admin123`

**Opção 2:**

- **Username**: `user`
- **Password**: `user123`

## 📍 Portas Utilizadas

| Serviço | Porta | Protocolo |
|---------|-------|-----------|
| PostgreSQL Users | 5432 | TCP |
| PostgreSQL Finance | 5433 | TCP |
| Top Users Service | 4001 | TCP (Microservice) |
| Top Finance Service | 4002 | TCP (Microservice) |
| API Gateway | 4000 | HTTP/REST |
| Shell Application | 3000 | HTTP |
| Users Microfrontend | 3001 | HTTP |
| Finance Microfrontend | 3002 | HTTP |

## 🛠️ Tecnologias Utilizadas

### Backend

- **Framework**: NestJS
- **Linguagem**: TypeScript
- **ORM/Query Builder**: Knex.js
- **Banco de Dados**: PostgreSQL
- **Comunicação**: TCP Transport (@nestjs/microservices)
- **Arquitetura**: DDD (Domain-Driven Design)

### Frontend

- **Framework**: React 18
- **Linguagem**: TypeScript
- **Build Tool**: Vite
- **Module Federation**: @originjs/vite-plugin-federation
- **UI Libraries**:
  - Material-UI (top-frontend-users)
  - Ant Design (top-frontend-finance)
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router DOM v6
- **HTTP Client**: Axios

## 📝 Estrutura de Pastas

```
micro/
├── top-infrastructure/          # Docker Compose para bancos de dados
│   ├── docker-compose.yml
│   └── README.md
│
├── top-users/                   # Microserviço de usuários
│   ├── src/
│   │   ├── domain/             # Entidades e value objects
│   │   ├── application/        # Use cases e DTOs
│   │   └── infrastructure/     # Repositórios e TCP
│   ├── migrations/
│   └── seeds/
│
├── top-finance/                 # Microserviço de finanças
│   ├── src/
│   │   ├── domain/
│   │   ├── application/
│   │   └── infrastructure/
│   ├── migrations/
│   └── seeds/
│
├── top-api-gateway/             # Gateway HTTP
│   └── src/
│       ├── users/
│       └── finance/
│
├── top-frontend-shell/          # Shell application (host)
│   └── src/
│       ├── components/
│       ├── contexts/
│       └── pages/
│
├── top-frontend-users/          # Microfrontend de usuários
│   └── src/
│       ├── components/
│       ├── pages/
│       └── services/
│
└── top-frontend-finance/        # Microfrontend de finanças
    └── src/
        ├── components/
        ├── pages/
        └── services/
```

## 🔧 Comandos Úteis

### Reiniciar Banco de Dados

```bash
cd top-infrastructure
docker-compose down
docker-compose up -d
```

### Ver Logs do Banco

```bash
cd top-infrastructure
docker-compose logs -f
```

### Rebuild dos Microfrontends

```bash
# Users
cd top-frontend-users
npm run build

# Finance
cd top-frontend-finance
npm run build
```

### Rodar Testes

```bash
# Testes E2E no backend
cd top-users
npm run test:e2e

cd top-finance
npm run test:e2e

# Testes unitários no frontend
cd top-frontend-users
npm run test

cd top-frontend-finance
npm run test
```

## 🐛 Troubleshooting

### Erro de porta já em uso

Verifique quais processos estão usando as portas:

```bash
lsof -i :3000
lsof -i :3001
lsof -i :3002
lsof -i :4000
lsof -i :4001
lsof -i :4002
```

Matar processo específico:

```bash
kill -9 <PID>
```

### Erro de conexão com banco de dados

1. Verifique se os containers estão rodando:

```bash
cd top-infrastructure
docker-compose ps
```

2. Verifique as variáveis de ambiente nos arquivos `.env`

3. Certifique-se que as portas 5432 e 5433 não estão em uso por outro PostgreSQL

### Microfrontend não carrega

1. Certifique-se que os builds foram gerados: `npm run build`
2. Verifique se os preview servers estão rodando nas portas 3001 e 3002
3. Limpe o cache do navegador (Ctrl+Shift+Delete)
4. Verifique o console do navegador para erros de CORS

### Autenticação não persiste após refresh

1. Verifique se o localStorage está habilitado no navegador
2. Certifique-se que o shell application está rodando corretamente
3. Abra o DevTools → Application → Local Storage e verifique se há uma chave `user`

### API Gateway retorna erro 500

1. Verifique se os microserviços (top-users e top-finance) estão rodando
2. Verifique os logs dos microserviços nos terminais
3. Confirme que as portas TCP 4001 e 4002 estão acessíveis

## 📚 Funcionalidades

### Módulo de Usuários

- ✅ Listagem com paginação
- ✅ Busca por nome, email ou cidade
- ✅ Visualização de detalhes
- ✅ Edição de usuários
- ✅ Exclusão de usuários
- ✅ Filtros por status

### Módulo de Finanças

- ✅ Listagem de registros financeiros
- ✅ Filtro por usuário
- ✅ Visualização de resumo (receitas/despesas)
- ✅ Criação de registros
- ✅ Edição de registros
- ✅ Exclusão de registros

### Autenticação

- ✅ Login com credenciais
- ✅ Persistência de sessão
- ✅ Logout
- ✅ Proteção de rotas

## 📄 Licença

Este projeto é privado e foi desenvolvido como parte de um desafio técnico.
