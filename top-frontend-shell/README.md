# Top Frontend Shell

Aplicação shell principal para integração de microfrontends usando Module Federation com Vite.

## Descrição

Esta é a aplicação principal (host) que integra múltiplos microfrontends utilizando Module Federation. Ela fornece:

- Sistema de autenticação centralizado
- Roteamento principal da aplicação
- Layout compartilhado (Header, Sidebar)
- Integração dinâmica com microfrontends remotos

## Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite 5** - Build tool e dev server
- **@originjs/vite-plugin-federation** - Module Federation para Vite
- **React Router v6** - Roteamento
- **TanStack Query** - Gerenciamento de estado assíncrono
- **Styled Components** - Estilização
- **Vitest** - Framework de testes
- **Axios** - Cliente HTTP

## Microfrontends Integrados

Esta aplicação consome os seguintes microfrontends remotos:

- **Users Module** (http://localhost:3001) - Gerenciamento de usuários
- **Finance Module** (http://localhost:3002) - Módulo financeiro

## Pré-requisitos

- Node.js 18+
- npm ou yarn

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## Configuração

Edite o arquivo `.env` conforme necessário:

```env
# URL da API backend
VITE_API_URL=http://localhost:4000

# Porta da aplicação
PORT=3000
```

### Configuração do Module Federation

Os microfrontends remotos são configurados em `vite.config.ts`:

```typescript
remotes: {
  users: 'http://localhost:3001/assets/remoteEntry.js',
  finance: 'http://localhost:3002/assets/remoteEntry.js',
}
```

## Execução

### Modo Desenvolvimento

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:3000`

### Build de Produção

```bash
npm run build
npm run preview
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview do build de produção
- `npm test` - Executa testes unitários
- `npm run test:ui` - Abre UI do Vitest
- `npm run test:coverage` - Gera relatório de cobertura
- `npm run lint` - Executa linter
- `npm run type-check` - Verifica tipos TypeScript

## Testes Unitários

A aplicação inclui testes para:

- **AuthContext** - Testes de autenticação e gerenciamento de estado
- **ProtectedRoute** - Testes de proteção de rotas

```bash
# Executar todos os testes
npm test

# Executar com interface UI
npm run test:ui

# Gerar relatório de cobertura
npm run test:coverage
```

## Sistema de Autenticação

A autenticação é implementada usando Context API com as seguintes credenciais de demonstração:

**Admin:**
- Username: `admin`
- Password: `admin123`

**Usuário:**
- Username: `user`
- Password: `user123`

O sistema armazena o token de autenticação no localStorage e protege rotas usando o componente `ProtectedRoute`.

## Estrutura de Rotas

```
/ → LoginPage (pública)
/dashboard → DashboardPage (protegida)
  ├── /dashboard → DashboardHome
  ├── /dashboard/users → UsersPage (microfrontend remoto)
  └── /dashboard/finance → FinancePage (microfrontend remoto)
```

## Estrutura do Projeto

```
top-frontend-shell/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── Header.tsx
│   │   ├── Sidebar.tsx
│   │   └── ProtectedRoute.tsx
│   ├── contexts/            # Contextos React
│   │   └── AuthContext.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── LoginPage.tsx
│   │   ├── DashboardPage.tsx
│   │   ├── UsersPage.tsx
│   │   └── FinancePage.tsx
│   ├── services/           # Serviços e APIs
│   │   └── api.ts
│   ├── types/              # Definições TypeScript
│   │   └── auth.ts
│   ├── App.tsx             # Componente raiz
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── public/                 # Arquivos estáticos
├── vite.config.ts          # Configuração Vite + Module Federation
├── vitest.config.ts        # Configuração de testes
├── tsconfig.json           # Configuração TypeScript
├── Dockerfile              # Build Docker
├── nginx.conf              # Configuração Nginx
└── package.json            # Dependências
```

## Module Federation - Como Funciona

### Configuração do Host (Shell)

Esta aplicação atua como o **host** que consome microfrontends remotos:

```typescript
// vite.config.ts
federation({
  name: 'shell',
  remotes: {
    users: 'http://localhost:3001/assets/remoteEntry.js',
    finance: 'http://localhost:3002/assets/remoteEntry.js',
  },
  shared: {
    react: { singleton: true },
    'react-dom': { singleton: true },
    'react-router-dom': { singleton: true },
  },
})
```

### Consumindo Microfrontends

Os microfrontends são carregados dinamicamente usando lazy loading:

```typescript
// src/pages/UsersPage.tsx
const UsersApp = lazy(() => import('users/App'));

export const UsersPage = () => (
  <Suspense fallback={<Loading />}>
    <UsersApp />
  </Suspense>
);
```

### Dependências Compartilhadas

As seguintes bibliotecas são compartilhadas entre todos os microfrontends:
- React (singleton)
- React DOM (singleton)
- React Router DOM (singleton)

Isso garante que apenas uma versão de cada biblioteca seja carregada na página.

## Integração com Microfrontends

### Requisitos para Microfrontends Remotos

Para que os microfrontends sejam carregados corretamente, eles devem:

1. Estar rodando nas portas configuradas (3001, 3002)
2. Expor seus componentes via Module Federation
3. Compartilhar as mesmas versões de React e React Router
4. Exportar um componente `App` principal

### Tratamento de Erros

Cada página de microfrontend possui:
- **ErrorBoundary** - Captura erros de carregamento
- **Suspense** - Mostra loading durante carregamento
- **Mensagens de erro** - Indica quando o remoto está indisponível

## Docker

### Build

```bash
docker build -t top-frontend-shell .
```

### Executar

```bash
docker run -p 3000:3000 top-frontend-shell
```

### Multi-stage Build

O Dockerfile usa multi-stage build:
1. **Builder stage** - Compila a aplicação
2. **Production stage** - Serve com Nginx

## Desenvolvimento Local

### Ordem de Inicialização Recomendada

1. Inicie o API Gateway (porta 4000)
2. Inicie os microfrontends remotos:
   - Users (porta 3001)
   - Finance (porta 3002)
3. Inicie o Shell (porta 3000)

### Desenvolvimento Sem Microfrontends

Se os microfrontends não estiverem disponíveis, a aplicação funcionará normalmente, mas exibirá mensagens de erro nas rotas `/dashboard/users` e `/dashboard/finance`.

## Próximos Passos

1. Configurar CI/CD para deploy automatizado
2. Adicionar mais testes (integração e E2E)
3. Implementar error tracking (Sentry)
4. Adicionar analytics
5. Configurar service worker para PWA

## Troubleshooting

### Erro: Failed to Load Users/Finance Module

**Causa:** O microfrontend remoto não está rodando ou não está acessível.

**Solução:**
- Verifique se o microfrontend está rodando na porta correta
- Verifique a configuração de remotes em `vite.config.ts`
- Verifique o console do navegador para erros CORS

### Erro: Module not found

**Causa:** Dependências não instaladas ou configuração incorreta.

**Solução:**
```bash
rm -rf node_modules package-lock.json
npm install
```

### Erro: Port 3000 already in use

**Solução:**
```bash
# Matar processo na porta 3000
lsof -ti:3000 | xargs kill -9

# Ou usar outra porta
PORT=3001 npm run dev
```

## Contribuindo

1. Crie uma branch para sua feature
2. Faça commit das mudanças
3. Execute os testes
4. Crie um Pull Request

## Licença

MIT
