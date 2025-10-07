# top-finance

Microserviço de finanças desenvolvido com NestJS, TCP, Knex.js e arquitetura DDD.

## 📋 Descrição

Microserviço responsável pelo gerenciamento de finanças (CRUD completo) utilizando comunicação TCP.

### Arquitetura

O projeto segue os princípios de **Domain-Driven Design (DDD)** e **SOLID**:

```
src/
├── domain/                    # Camada de domínio
│   ├── entities/             # Entidades de negócio
│   └── repositories/         # Interfaces de repositórios
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
PORT=4002

# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=top_finance_db

# Microservice
TCP_HOST=0.0.0.0
TCP_PORT=4002
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
docker build -t top-finance .
docker run -p 4002:4002 --env-file .env top-finance
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
- ✅ Criação de finanças
- ✅ Listagem de finanças
- ✅ Listagem por usuário
- ✅ Busca por ID
- ✅ Atualização de finanças
- ✅ Deleção (soft delete)
- ✅ Validações e erros
- ✅ Valores positivos e negativos

**Cobertura**: >80%

## 📡 Comunicação TCP

### Comandos disponíveis

#### Criar finança

```typescript
{ cmd: 'create_finance' }

Payload:
{
  user_id: number     // ID do usuário (obrigatório, > 0)
  valor: number       // Valor da finança (pode ser negativo para despesas)
  descricao: string   // Descrição (máximo 500 caracteres)
}
```

#### Buscar finança

```typescript
{ cmd: 'get_finance' }

Payload:
{
  id: number
}
```

#### Listar todas as finanças

```typescript
{ cmd: 'list_finances' }

Payload:
{
  includeDeleted?: boolean
}
```

#### Listar finanças por usuário

```typescript
{ cmd: 'list_finances_by_user' }

Payload:
{
  userId: number
  includeDeleted?: boolean
}
```

#### Atualizar finança

```typescript
{ cmd: 'update_finance' }

Payload:
{
  id: number
  dto: {
    valor?: number
    descricao?: string
  }
}
```

#### Deletar finança (soft delete)

```typescript
{ cmd: 'delete_finance' }

Payload:
{
  id: number
}
```

## 📊 Entidade Finance

```typescript
{
  id: number
  user_id: number         // ID do usuário (foreign key)
  valor: decimal(15,2)    // Valor (positivo ou negativo)
  descricao: string       // Descrição (máx 500 chars)
  is_deleted: boolean
  created: timestamp
  updated: timestamp
  deleted: timestamp | null
}
```

### Regras de Negócio

- `user_id` deve ser maior que 0
- `valor` pode ser positivo (receita) ou negativo (despesa)
- `descricao` é obrigatória e tem máximo de 500 caracteres
- Soft delete: registros deletados permanecem no banco com flag `is_deleted = true`

## 🔍 Princípios Aplicados

### SOLID

- **S**ingle Responsibility: Cada classe tem uma única responsabilidade
- **O**pen/Closed: Aberto para extensão, fechado para modificação
- **L**iskov Substitution: Interfaces bem definidas
- **I**nterface Segregation: Interfaces específicas
- **D**ependency Inversion: Dependências por interfaces

### DDD

- **Entities**: Objetos com identidade única (Finance)
- **Repositories**: Abstração de persistência
- **Use Cases**: Lógica de aplicação isolada
- **DTOs**: Transferência de dados entre camadas

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

## 🔗 Integração com top-users

Este microserviço foi projetado para trabalhar em conjunto com o microserviço **top-users**:

- A tabela `finances` possui o campo `user_id` que referencia usuários do microserviço top-users
- Use o comando `list_finances_by_user` para buscar todas as finanças de um usuário específico
- A validação do `user_id` garante que apenas IDs válidos (> 0) sejam aceitos

## 📄 Licença

ISC
