# Top Frontend Users

Microfrontend React para gerenciamento de usuários, construído com Vite e Module Federation.

## Descrição

Este é um microfrontend que fornece uma interface completa para gerenciamento de usuários (CRUD), incluindo:

- Listagem de usuários com paginação
- Busca e filtros
- Criação de novos usuários
- Edição de usuários existentes
- Exclusão de usuários com confirmação
- Validação completa de formulários

## Tecnologias Utilizadas

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite 5** - Build tool e dev server
- **Module Federation** - Arquitetura de microfrontends
- **TanStack Query** - Gerenciamento de estado do servidor
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Material-UI (MUI)** - Biblioteca de componentes
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testes
- **React Testing Library** - Testes de componentes

## Estrutura do Projeto

```
top-frontend-users/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── UserTable.tsx
│   │   ├── UserTable.test.tsx
│   │   └── DeleteUserModal.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── UsersList.tsx
│   │   ├── UserForm.tsx
│   │   └── UserForm.test.tsx
│   ├── hooks/              # Custom hooks
│   │   └── useUsers.ts
│   ├── services/           # Serviços de API
│   │   └── usersApi.ts
│   ├── types/              # Definições de tipos
│   │   └── user.ts
│   ├── schemas/            # Schemas de validação
│   │   └── userSchema.ts
│   ├── test/               # Configuração de testes
│   │   └── setup.ts
│   ├── App.tsx             # Componente principal
│   └── main.tsx            # Entry point
├── package.json
├── vite.config.ts          # Configuração do Vite + Module Federation
├── vitest.config.ts        # Configuração do Vitest
├── tsconfig.json
├── Dockerfile
└── README.md
```

## Instalação

### Pré-requisitos

- Node.js 20+
- npm ou yarn

### Passos

1. Clone o repositório:
```bash
git clone <repository-url>
cd top-frontend-users
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env
```

Edite o arquivo `.env`:
```env
VITE_API_URL=http://localhost:4000
PORT=3001
```

## Execução

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3001`

### Build de Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## Testes

### Executar Todos os Testes

```bash
npm test
```

### Executar Testes com UI

```bash
npm run test:ui
```

### Cobertura de Testes

```bash
npm run test:coverage
```

O projeto mantém cobertura de testes acima de 80% em:
- Linhas de código
- Funções
- Branches
- Statements

## Module Federation

Este microfrontend expõe o componente `UsersApp` através do Module Federation:

### Configuração de Exposição

```typescript
{
  name: 'users',
  filename: 'remoteEntry.js',
  exposes: {
    './UsersApp': './src/App.tsx'
  }
}
```

### Como Consumir

Para usar este microfrontend em uma aplicação shell:

```typescript
// vite.config.ts (no shell)
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        users: 'http://localhost:3001/assets/remoteEntry.js'
      }
    })
  ]
});
```

```typescript
// No componente shell
import { lazy } from 'react';

const UsersApp = lazy(() => import('users/UsersApp'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <UsersApp />
    </Suspense>
  );
}
```

## Integração com API Gateway

O microfrontend se conecta ao API Gateway através da variável de ambiente `VITE_API_URL`.

### Endpoints Utilizados

- `GET /users` - Lista usuários com paginação e busca
  - Query params: `page`, `limit`, `search`
- `GET /users/:id` - Busca usuário por ID
- `POST /users` - Cria novo usuário
- `PUT /users/:id` - Atualiza usuário
- `DELETE /users/:id` - Remove usuário

### Exemplo de Requisição

```typescript
// GET /users?page=1&limit=10&search=João
{
  data: User[],
  total: number,
  page: number,
  limit: number,
  totalPages: number
}
```

## Funcionalidades

### 1. Listagem de Usuários

- Tabela responsiva com todos os dados do usuário
- Paginação configurável (5, 10, 25, 50 itens por página)
- Busca em tempo real (nome, email ou CPF)
- Botões de ação (editar e excluir)
- Formatação automática de CPF e telefone

### 2. Criação de Usuário

- Formulário completo com validação
- Formatação automática de CPF e telefone
- Validações:
  - Nome: mínimo 3 caracteres
  - Email: formato válido
  - CPF: validação de dígitos verificadores
  - Telefone: formato brasileiro
  - Endereço: mínimo 5 caracteres

### 3. Edição de Usuário

- Carregamento automático dos dados do usuário
- Mesmo formulário e validações da criação
- Atualização em tempo real

### 4. Exclusão de Usuário

- Modal de confirmação com detalhes do usuário
- Prevenção de exclusão acidental
- Feedback visual de sucesso/erro

## Docker

### Build da Imagem

```bash
docker build -t top-frontend-users .
```

### Executar Container

```bash
docker run -p 3001:3001 \
  -e VITE_API_URL=http://localhost:4000 \
  top-frontend-users
```

## Validações

O projeto implementa validações robustas usando Yup:

### Validação de CPF

- Verifica formato (11 dígitos)
- Valida dígitos verificadores
- Rejeita CPFs com todos os números iguais

### Validação de Telefone

- Formato: `(XX) XXXXX-XXXX` ou `(XX) XXXX-XXXX`
- Aceita celulares e fixos

### Validação de Email

- RFC 5322 compliant
- Máximo 100 caracteres

## Componentes Principais

### UserTable

Componente de tabela com:
- Formatação de dados (CPF, telefone, data)
- Ícones para melhor UX
- Tooltip nos botões de ação
- Estado de loading
- Estado vazio

### UserForm

Formulário com:
- React Hook Form para gerenciamento
- Yup para validação
- Formatação automática durante digitação
- Feedback visual de erros
- Botão desabilitado quando form não está modificado

### DeleteUserModal

Modal de confirmação com:
- Informações do usuário a ser deletado
- Aviso de ação irreversível
- Estado de loading durante exclusão

## Cache e Performance

### TanStack Query

- Cache de 30 segundos para listagem
- Invalidação automática após mutations
- Retry limitado a 1 tentativa
- Desabilita refetch em focus por padrão

### Otimizações

- Debounce de 500ms na busca
- Lazy loading de rotas
- Code splitting automático pelo Vite
- Shared dependencies no Module Federation

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Visualiza build de produção
- `npm test` - Executa testes
- `npm run test:ui` - Interface visual de testes
- `npm run test:coverage` - Relatório de cobertura

## Boas Práticas Implementadas

1. **TypeScript Strict Mode** - Tipagem forte em todo código
2. **Testes Unitários** - Cobertura >80%
3. **Validação de Formulários** - Yup schemas reutilizáveis
4. **Gerenciamento de Estado** - TanStack Query para servidor
5. **Componentização** - Componentes reutilizáveis e testáveis
6. **Tratamento de Erros** - Feedback visual em todas operações
7. **Acessibilidade** - Labels, ARIA attributes
8. **Performance** - Debounce, cache, code splitting
9. **Clean Code** - Separação de responsabilidades

## Troubleshooting

### Erro de Conexão com API

Verifique se:
1. O API Gateway está rodando
2. A variável `VITE_API_URL` está correta
3. Não há bloqueio de CORS

### Erro de Module Federation

Verifique se:
1. A porta 3001 está disponível
2. O `remoteEntry.js` está sendo servido corretamente
3. As versões do React são compatíveis (singleton)

### Testes Falhando

Execute:
```bash
npm run test -- --reporter=verbose
```

Para mais detalhes sobre falhas.

## Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## Licença

Este projeto é parte de um desafio técnico.

## Contato

Para dúvidas ou sugestões, abra uma issue no repositório.
