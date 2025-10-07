# TOP API Gateway

API Gateway HTTP que roteia requisicoes para os microservicos TCP (top-users e top-finance).

## Descricao

O TOP API Gateway atua como ponto de entrada unico para a arquitetura de microservicos, convertendo requisicoes HTTP REST em mensagens TCP que sao enviadas aos microservicos especializados. Ele fornece uma camada de abstracao entre os clientes e os servicos internos.

## Arquitetura

```
Cliente HTTP → API Gateway (HTTP:4000) → Microservicos TCP
                                        ├─ top-users (TCP:4001)
                                        └─ top-finance (TCP:4002)
```

### Fluxo de Comunicacao

1. Cliente envia requisicao HTTP REST para o API Gateway
2. API Gateway valida os dados usando ValidationPipe
3. Gateway converte a requisicao em mensagem TCP
4. Mensagem e enviada ao microservico apropriado via ClientProxy
5. Microservico processa e retorna resposta
6. Gateway converte resposta TCP de volta para HTTP
7. Resposta HTTP e enviada ao cliente

## Endpoints Disponiveis

### Users Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | /users | Cria um novo usuario |
| GET | /users | Lista todos os usuarios |
| GET | /users/:id | Busca usuario por ID |
| PUT | /users/:id | Atualiza usuario |
| DELETE | /users/:id | Remove usuario |

#### Exemplo de Requisicao - Criar Usuario

```bash
curl -X POST http://localhost:4000/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "securepass123"
  }'
```

#### Exemplo de Resposta

```json
{
  "id": "uuid-here",
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2025-10-05T10:00:00.000Z"
}
```

### Finance Endpoints

| Metodo | Endpoint | Descricao |
|--------|----------|-----------|
| POST | /finance | Cria um novo registro financeiro |
| GET | /finance | Lista todos os registros |
| GET | /finance/user/:userId | Lista registros por usuario |
| GET | /finance/:id | Busca registro por ID |
| PUT | /finance/:id | Atualiza registro |
| DELETE | /finance/:id | Remove registro |

#### Exemplo de Requisicao - Criar Registro Financeiro

```bash
curl -X POST http://localhost:4000/finance \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "user-uuid-here",
    "description": "Salary",
    "amount": 5000.00,
    "type": "income"
  }'
```

#### Exemplo de Resposta

```json
{
  "id": "uuid-here",
  "userId": "user-uuid-here",
  "description": "Salary",
  "amount": 5000.00,
  "type": "income",
  "createdAt": "2025-10-05T10:00:00.000Z"
}
```

## Instalacao e Configuracao

### Pre-requisitos

- Node.js 20 ou superior
- npm ou yarn
- Microservicos top-users e top-finance rodando

### Instalacao

1. Clone o repositorio e navegue ate o diretorio:

```bash
cd top-api-gateway
```

2. Instale as dependencias:

```bash
npm install
```

3. Configure as variaveis de ambiente:

```bash
cp .env.example .env
```

4. Edite o arquivo `.env` conforme necessario:

```env
PORT=4000

# Users Service
USERS_SERVICE_HOST=localhost
USERS_SERVICE_PORT=4001

# Finance Service
FINANCE_SERVICE_HOST=localhost
FINANCE_SERVICE_PORT=4002
```

## Execucao

### Modo Desenvolvimento

```bash
npm run start:dev
```

### Modo Producao

```bash
# Build
npm run build

# Start
npm run start:prod
```

### Usando Docker

```bash
# Build da imagem
docker build -t top-api-gateway .

# Executar container
docker run -p 4000:4000 \
  -e USERS_SERVICE_HOST=host.docker.internal \
  -e USERS_SERVICE_PORT=4001 \
  -e FINANCE_SERVICE_HOST=host.docker.internal \
  -e FINANCE_SERVICE_PORT=4002 \
  top-api-gateway
```

## Testes

### Testes Unitarios

```bash
npm run test
```

### Testes E2E

```bash
# Certifique-se de que os microservicos estao rodando
npm run test:e2e
```

### Cobertura de Testes

```bash
npm run test:cov
```

## Integracao com Microservicos

### Configuracao TCP

O API Gateway se conecta aos microservicos via TCP usando a biblioteca `@nestjs/microservices`. A configuracao e feita em cada modulo:

#### Users Module

```typescript
ClientsModule.register([
  {
    name: 'USERS_SERVICE',
    transport: Transport.TCP,
    options: {
      host: process.env.USERS_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.USERS_SERVICE_PORT) || 4001,
    },
  },
])
```

#### Finance Module

```typescript
ClientsModule.register([
  {
    name: 'FINANCE_SERVICE',
    transport: Transport.TCP,
    options: {
      host: process.env.FINANCE_SERVICE_HOST || 'localhost',
      port: parseInt(process.env.FINANCE_SERVICE_PORT) || 4002,
    },
  },
])
```

### Padroes de Mensagem

O Gateway usa o padrao de mensagem do NestJS com comandos:

#### Users Service

- `create_user` - Criar usuario
- `find_all_users` - Listar usuarios
- `find_one_user` - Buscar usuario
- `update_user` - Atualizar usuario
- `remove_user` - Remover usuario

#### Finance Service

- `create_finance` - Criar registro
- `find_all_finance` - Listar registros
- `find_by_user` - Listar por usuario
- `find_one_finance` - Buscar registro
- `update_finance` - Atualizar registro
- `remove_finance` - Remover registro

## Validacao de Dados

O API Gateway utiliza `class-validator` e `class-transformer` para validacao automatica de DTOs:

### Recursos de Validacao

- Email valido obrigatorio
- Campos obrigatorios nao podem estar vazios
- Valores numericos devem ser positivos (amount >= 0.01)
- Transformacao automatica de tipos
- Whitelist de propriedades (propriedades nao definidas sao removidas)

## Tratamento de Erros

O Gateway implementa tratamento de erros robusto:

- Erros de validacao (400 Bad Request)
- Recursos nao encontrados (404 Not Found)
- Erros de comunicacao com microservicos (500 Internal Server Error)
- Mensagens de erro descritivas

## Recursos

- CORS habilitado
- Validacao global de DTOs
- Comunicacao TCP com microservicos
- Tratamento de erros centralizado
- Testes E2E completos
- Suporte a Docker
- Configuracao via variaveis de ambiente

## Estrutura do Projeto

```
top-api-gateway/
├── src/
│   ├── users/
│   │   ├── dto/
│   │   │   ├── create-user.dto.ts
│   │   │   └── update-user.dto.ts
│   │   ├── users.controller.ts
│   │   ├── users.service.ts
│   │   └── users.module.ts
│   ├── finance/
│   │   ├── dto/
│   │   │   ├── create-finance.dto.ts
│   │   │   └── update-finance.dto.ts
│   │   ├── finance.controller.ts
│   │   ├── finance.service.ts
│   │   └── finance.module.ts
│   ├── app.module.ts
│   └── main.ts
├── test/
│   ├── jest-e2e.json
│   ├── users.e2e-spec.ts
│   └── finance.e2e-spec.ts
├── .env.example
├── .gitignore
├── Dockerfile
├── nest-cli.json
├── package.json
├── tsconfig.json
└── README.md
```

## Tecnologias

- NestJS 10
- @nestjs/microservices
- class-validator
- class-transformer
- TypeScript
- Jest (testes)
- Supertest (testes E2E)

## Licenca

MIT
