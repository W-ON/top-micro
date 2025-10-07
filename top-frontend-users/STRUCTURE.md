# Estrutura do Projeto Top Frontend Users

## Visão Geral

- **Total de Linhas de Código de Produção:** 1.075 linhas
- **Total de Linhas de Código de Testes:** 534 linhas
- **Ratio Teste/Produção:** ~50%
- **Arquivos TypeScript/React:** 15 arquivos

## Árvore de Diretórios

```
top-frontend-users/
│
├── Configuration Files
│   ├── package.json              # Dependências e scripts
│   ├── tsconfig.json             # Configuração TypeScript
│   ├── tsconfig.node.json        # TypeScript para arquivos de build
│   ├── vite.config.ts            # Configuração Vite + Module Federation
│   ├── vitest.config.ts          # Configuração de testes
│   ├── .env                      # Variáveis de ambiente
│   ├── .env.example              # Exemplo de variáveis
│   ├── .gitignore                # Arquivos ignorados pelo git
│   ├── Dockerfile                # Container Docker
│   ├── nginx.conf                # Configuração Nginx para produção
│   └── index.html                # HTML raiz
│
├── Documentation
│   ├── README.md                 # Documentação principal
│   └── STRUCTURE.md              # Este arquivo
│
└── src/                          # Código fonte
    │
    ├── main.tsx                  # Entry point da aplicação
    ├── App.tsx                   # Componente raiz com rotas
    ├── vite-env.d.ts             # Tipos do Vite
    │
    ├── types/                    # Definições de tipos TypeScript
    │   └── user.ts               # Interfaces User, DTOs, etc.
    │
    ├── schemas/                  # Schemas de validação
    │   └── userSchema.ts         # Schema Yup para formulário
    │
    ├── services/                 # Serviços de API
    │   └── usersApi.ts           # Cliente Axios para API
    │
    ├── hooks/                    # Custom React Hooks
    │   └── useUsers.ts           # TanStack Query hooks
    │
    ├── components/               # Componentes reutilizáveis
    │   ├── UserTable.tsx         # Tabela de usuários
    │   ├── UserTable.test.tsx    # Testes da tabela
    │   ├── DeleteUserModal.tsx   # Modal de confirmação
    │   └── DeleteUserModal.test.tsx
    │
    ├── pages/                    # Páginas da aplicação
    │   ├── UsersList.tsx         # Página de listagem
    │   ├── UserForm.tsx          # Página de formulário
    │   └── UserForm.test.tsx     # Testes do formulário
    │
    └── test/                     # Configuração de testes
        └── setup.ts              # Setup do Vitest

```

## Detalhamento dos Arquivos

### Configuração (Root Level)

#### package.json
- React 18.2.0
- Vite 5.0.7
- @originjs/vite-plugin-federation 1.3.5
- TanStack Query 5.13.4
- React Hook Form 7.48.2
- Yup 1.3.3
- Material-UI 5.14.20
- Vitest 1.0.4

#### vite.config.ts
```typescript
Module Federation Config:
- name: "users"
- exposes: { "./UsersApp": "./src/App.tsx" }
- shared: ["react", "react-dom"]
- port: 3001
```

#### vitest.config.ts
```typescript
Test Configuration:
- environment: jsdom
- coverage threshold: 80%
- reporters: text, json, html
```

### Source Code (src/)

#### Core Files

**main.tsx** (9 linhas)
- Entry point
- Renderiza `<App />` no DOM

**App.tsx** (57 linhas)
- QueryClientProvider setup
- ThemeProvider (Material-UI)
- Router com 3 rotas:
  - `/` → UsersList
  - `/new` → UserForm
  - `/edit/:id` → UserForm

#### Types (types/)

**user.ts** (42 linhas)
```typescript
- interface User
- interface CreateUserDto
- interface UpdateUserDto
- interface PaginatedResponse<T>
- interface UsersQueryParams
```

#### Schemas (schemas/)

**userSchema.ts** (70 linhas)
```typescript
Validações Yup:
- name: min 3, max 100 chars
- email: formato válido, max 100
- cpf: validação de dígitos verificadores
- phone: regex formato brasileiro
- address: min 5, max 200 chars
```

#### Services (services/)

**usersApi.ts** (57 linhas)
```typescript
Axios Client:
- baseURL: VITE_API_URL/users
- getUsers(params)
- getUserById(id)
- createUser(data)
- updateUser(id, data)
- deleteUser(id)
```

#### Hooks (hooks/)

**useUsers.ts** (71 linhas)
```typescript
TanStack Query Hooks:
- useUsers(params) - lista com paginação
- useUser(id) - busca por ID
- useCreateUser() - mutation criar
- useUpdateUser() - mutation atualizar
- useDeleteUser() - mutation deletar
```

#### Components (components/)

**UserTable.tsx** (183 linhas)
- Tabela responsiva Material-UI
- Formatação CPF, telefone, data
- Botões editar/excluir
- Estados: loading, empty
- 10 testes unitários

**DeleteUserModal.tsx** (101 linhas)
- Modal confirmação exclusão
- Exibe dados do usuário
- Aviso de ação irreversível
- Estados: loading
- 10 testes unitários

#### Pages (pages/)

**UsersList.tsx** (226 linhas)
Features:
- Listagem paginada
- Busca com debounce (500ms)
- Filtro de itens por página
- Botão criar usuário
- Integração com UserTable
- Modal de exclusão
- Feedback visual (alerts)

**UserForm.tsx** (249 linhas)
Features:
- Formulário criar/editar
- React Hook Form + Yup
- Formatação automática (CPF, telefone)
- Validação em tempo real
- Estados: loading, dirty
- 12 testes unitários

#### Tests (test/)

**setup.ts** (4 linhas)
- Importa @testing-library/jest-dom
- Cleanup automático após testes

## Fluxo de Dados

### 1. Listagem de Usuários
```
UsersList → useUsers() → usersApi.getUsers() → API
                ↓
            UserTable → render
```

### 2. Criação de Usuário
```
UserForm → useCreateUser() → usersApi.createUser() → API
             ↓
         invalidate cache → refetch lista
```

### 3. Edição de Usuário
```
UserForm → useUser(id) → carregar dados
            ↓
         preencher form
            ↓
         useUpdateUser() → usersApi.updateUser() → API
```

### 4. Exclusão de Usuário
```
UsersList → DeleteUserModal → useDeleteUser() → API
                                    ↓
                               invalidate cache
```

## Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | UsersList | Lista usuários com paginação e busca |
| `/new` | UserForm | Formulário criar novo usuário |
| `/edit/:id` | UserForm | Formulário editar usuário |

## Testes

### Cobertura por Arquivo

| Arquivo | Testes | Linhas Testadas |
|---------|--------|-----------------|
| UserTable.tsx | 10 | ~95% |
| UserForm.tsx | 12 | ~85% |
| DeleteUserModal.tsx | 10 | ~100% |

### Cenários Testados

**UserTable:**
- Renderização de usuários
- Formatação de dados
- Callbacks de ações
- Estados loading/empty

**UserForm:**
- Renderização de campos
- Validação de formulário
- Formatação automática
- Submit e navegação

**DeleteUserModal:**
- Renderização condicional
- Exibição de dados
- Callbacks de ações
- Estados loading

## Module Federation

### Exposição

```typescript
name: 'users'
exposes: {
  './UsersApp': './src/App.tsx'
}
```

### Consumo (exemplo)

```typescript
// No shell host
const UsersApp = lazy(() => import('users/UsersApp'));

<Route path="/users/*" element={
  <Suspense fallback={<Loading />}>
    <UsersApp />
  </Suspense>
} />
```

## Performance

### Otimizações Implementadas

1. **Debounce de Busca:** 500ms
2. **Cache TanStack Query:** 30s
3. **Code Splitting:** Automático pelo Vite
4. **Shared Dependencies:** React/ReactDOM singleton
5. **Lazy Loading:** Rotas e módulos remotos

### Bundle Analysis

- Main chunk: App, Router, Theme
- Vendor chunk: React, MUI, TanStack Query
- Remote entry: ~2KB (Module Federation)

## Dependências Críticas

### Runtime
- react@18.2.0
- react-dom@18.2.0
- @tanstack/react-query@5.13.4
- react-hook-form@7.48.2
- yup@1.3.3
- @mui/material@5.14.20
- axios@1.6.2

### Build
- vite@5.0.7
- @vitejs/plugin-react@4.2.1
- @originjs/vite-plugin-federation@1.3.5
- typescript@5.3.3

### Test
- vitest@1.0.4
- @testing-library/react@14.1.2
- @testing-library/jest-dom@6.1.5
- jsdom@23.0.1

## Variáveis de Ambiente

```env
VITE_API_URL=http://localhost:4000  # URL do API Gateway
PORT=3001                            # Porta do servidor dev
```

## Docker

### Build
```bash
docker build -t top-frontend-users .
```

### Estratégia Multi-stage
1. **Builder:** Node 20 Alpine + build Vite
2. **Runtime:** Nginx Alpine + servir estáticos

### Porta Exposta
- 3001 (Nginx)

## Comandos NPM

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Dev server (port 3001) |
| `npm run build` | Build produção |
| `npm run preview` | Preview build |
| `npm test` | Rodar testes |
| `npm run test:ui` | UI de testes |
| `npm run test:coverage` | Relatório cobertura |

## Boas Práticas Aplicadas

1. ✅ TypeScript strict mode
2. ✅ Componentização adequada
3. ✅ Separação de responsabilidades
4. ✅ Custom hooks reutilizáveis
5. ✅ Validação robusta (Yup)
6. ✅ Tratamento de erros
7. ✅ Loading states
8. ✅ Testes unitários (>80%)
9. ✅ Acessibilidade (ARIA)
10. ✅ Performance (cache, debounce)
11. ✅ Clean Code
12. ✅ Documentação completa
