# top-users

Microserviço de usuários desenvolvido com NestJS, TCP, Knex.js e arquitetura DDD.

## 📋 Descrição

Microserviço responsável pelo gerenciamento de usuários (CRUD completo) utilizando comunicação TCP.

### Arquitetura

O projeto segue os princípios de **Domain-Driven Design (DDD)** e **SOLID**:

```
src/
├── domain/                    # Camada de domínio
│   ├── entities/             # Entidades de negócio
│   ├── repositories/         # Interfaces de repositórios
│   └── value-objects/        # Objetos de valor
├── application/              # Camada de aplicação
│   ├── dtos/                # Data Transfer Objects
│   └── use-cases/           # Casos de uso
└── infrastructure/           # Camada de infraestrutura
    ├── database/            # Configuração Knex.js
    │   ├── migrations/      # Migrações
    │   └── seeds/          # Seeds
    ├── repositories/        # Implementação dos repositórios
    └── tcp/                # Controladores TCP
```

## 🚀 Tecnologias

- **NestJS** - Framework Node.js
- **TypeScript** - Linguagem
- **Knex.js** - Query builder
- **PostgreSQL** - Banco de dados
- **TCP** - Protocolo de comunicação
- **Jest** - Testes E2E

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env`:

```env
NODE_ENV=development
PORT=4001

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=top_users_db

# Microservice
TCP_HOST=0.0.0.0
TCP_PORT=4001
```

## 🗄️ Banco de Dados

### Executar migrações

```bash
npm run migration:run
```

### Reverter última migração

```bash
npm run migration:rollback
```

### Criar nova migração

```bash
npm run migration:make nome_da_migracao
```

### Executar seeds

```bash
npm run seed:run
```

### Criar novo seed

```bash
npm run seed:make nome_do_seed
```

## 🏃 Execução

### Desenvolvimento

```bash
npm run start:dev
```

### Produção

```bash
npm run build
npm run start:prod
```

### Docker

```bash
docker build -t top-users .
docker run -p 4001:4001 --env-file .env top-users
```

## 🧪 Testes

### Testes E2E

```bash
npm run test:e2e
```

### Testes com cobertura

```bash
npm run test:cov
```

### Estrutura de testes

Os testes E2E cobrem:
- ✅ Criação de usuários
- ✅ Listagem de usuários
- ✅ Busca por ID
- ✅ Atualização de usuários
- ✅ Deleção (soft delete)
- ✅ Validações e erros

## 📡 Comunicação TCP

### Comandos disponíveis

#### Criar usuário

```typescript
{ cmd: 'create_user' }

Payload:
{
  nome: string
  email: string
  rua: string
  numero: string
  bairro: string
  complemento: string
  cidade: string
  estado: string
  cep: string
  status: 'ativo' | 'inativo'
}
```

#### Buscar usuário

```typescript
{ cmd: 'get_user' }

Payload:
{
  id: number
}
```

#### Listar usuários

```typescript
{ cmd: 'list_users' }

Payload:
{
  includeDeleted?: boolean
}
```

#### Atualizar usuário

```typescript
{ cmd: 'update_user' }

Payload:
{
  id: number
  dto: {
    nome?: string
    email?: string
    rua?: string
    numero?: string
    bairro?: string
    complemento?: string
    cidade?: string
    estado?: string
    cep?: string
    status?: 'ativo' | 'inativo'
  }
}
```

#### Deletar usuário (soft delete)

```typescript
{ cmd: 'delete_user' }

Payload:
{
  id: number
}
```

## 📊 Entidade User

```typescript
{
  id: number
  nome: string
  email: string (unique)
  rua: string
  numero: string
  bairro: string
  complemento: string
  cidade: string
  estado: string
  cep: string
  status: 'ativo' | 'inativo'
  is_deleted: boolean
  created: timestamp
  updated: timestamp
  deleted: timestamp | null
}
```

## 🔍 Princípios Aplicados

### SOLID

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependências por interfaces

### DDD

- **Entities**: Objetos com identidade única
- **Value Objects**: Objetos imutáveis sem identidade
- **Repositories**: Abstração de persistência
- **Use Cases**: Lógica de aplicação

## 📝 Scripts Disponíveis

| Script | Descrição |
|--------|-----------|
| `npm run build` | Build da aplicação |
| `npm run start` | Inicia aplicação |
| `npm run start:dev` | Inicia em modo desenvolvimento |
| `npm run start:prod` | Inicia em modo produção |
| `npm run test` | Executa testes unitários |
| `npm run test:e2e` | Executa testes E2E |
| `npm run test:cov` | Testes com cobertura |
| `npm run migration:make` | Cria nova migração |
| `npm run migration:run` | Executa migrações |
| `npm run migration:rollback` | Reverte migração |
| `npm run seed:make` | Cria novo seed |
| `npm run seed:run` | Executa seeds |

## 📄 Licença

ISC
