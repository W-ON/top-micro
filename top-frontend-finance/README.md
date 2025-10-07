# Top Frontend Finance

Microfrontend React para gerenciamento de finanças pessoais com suporte a Module Federation.

## Descrição

Este é um microfrontend desenvolvido em React 18 que oferece funcionalidades completas de CRUD (Create, Read, Update, Delete) para gerenciamento de finanças. O projeto foi construído utilizando Vite 5 e Module Federation, permitindo sua integração com outros microfrontends em uma arquitetura distribuída.

## Tecnologias

- **React 18** - Biblioteca UI
- **TypeScript** - Tipagem estática
- **Vite 5** - Build tool e dev server
- **@originjs/vite-plugin-federation** - Module Federation
- **TanStack Query (React Query)** - Gerenciamento de estado servidor
- **React Hook Form** - Gerenciamento de formulários
- **Yup** - Validação de schemas
- **Ant Design** - Biblioteca de componentes UI
- **Axios** - Cliente HTTP
- **Vitest** - Framework de testes
- **Testing Library** - Testes de componentes React

## Funcionalidades

### CRUD de Finanças
- Listagem de finanças com tabela paginada
- Criação de novas finanças
- Edição de finanças existentes
- Exclusão de finanças com modal de confirmação

### Filtros e Análises
- Filtro por usuário (user_id)
- Dashboard com totalizadores:
  - Saldo Total (receitas - despesas)
  - Total de Receitas
  - Total de Despesas

### Formatação
- Valores monetários formatados em Real (BRL)
- Datas formatadas em pt-BR
- Tags coloridas para tipos (receita/despesa)
- Indicadores visuais (cores) para receitas e despesas

### Validações
- user_id obrigatório e positivo
- Descrição obrigatória (3-255 caracteres)
- Valor obrigatório e maior que zero
- Tipo obrigatório (receita ou despesa)
- Data obrigatória no formato YYYY-MM-DD

## Module Federation

Este microfrontend expõe o seguinte módulo via Module Federation:

```javascript
{
  name: "finance",
  filename: "remoteEntry.js",
  exposes: {
    "./FinanceApp": "./src/App.tsx"
  }
}
```

### Como consumir em outro microfrontend

```javascript
// vite.config.ts do host
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'host',
      remotes: {
        finance: 'http://localhost:3002/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom'],
    }),
  ],
});
```

```typescript
// Uso no componente
import { lazy } from 'react';

const FinanceApp = lazy(() => import('finance/FinanceApp'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FinanceApp />
    </Suspense>
  );
}
```

## Instalação

```bash
# Instalar dependências
npm install

# Copiar arquivo de ambiente
cp .env.example .env
```

## Configuração

Edite o arquivo `.env` com as configurações necessárias:

```env
VITE_API_URL=http://localhost:4000
PORT=3002
```

## Executar

### Modo Desenvolvimento

```bash
npm run dev
```

O aplicativo estará disponível em `http://localhost:3002`

### Build para Produção

```bash
npm run build
```

### Preview da Build

```bash
npm run preview
```

## Testes

### Executar todos os testes

```bash
npm test
```

### Executar testes com UI

```bash
npm run test:ui
```

### Executar testes com cobertura

```bash
npm run test:coverage
```

### Cobertura de Testes

O projeto mantém uma cobertura de testes superior a 80% em:
- Linhas de código
- Funções
- Branches
- Statements

Os principais componentes testados incluem:
- `FinanceTable` - Renderização, formatação e interações
- `FinanceSummary` - Cálculos de totalizadores
- `FinanceForm` - Validações de formulário

## Docker

### Build da imagem

```bash
docker build -t top-frontend-finance .
```

### Executar container

```bash
docker run -p 3002:3002 top-frontend-finance
```

## Estrutura do Projeto

```
top-frontend-finance/
├── src/
│   ├── components/          # Componentes reutilizáveis
│   │   ├── FinanceTable.tsx
│   │   ├── FinanceSummary.tsx
│   │   └── DeleteFinanceModal.tsx
│   ├── pages/              # Páginas da aplicação
│   │   ├── FinanceList.tsx
│   │   └── FinanceForm.tsx
│   ├── services/           # Serviços de API
│   │   └── financeApi.ts
│   ├── hooks/              # Custom hooks
│   │   └── useFinances.ts
│   ├── types/              # Definições TypeScript
│   │   └── finance.ts
│   ├── schemas/            # Schemas de validação
│   │   └── financeSchema.ts
│   ├── utils/              # Funções utilitárias
│   │   └── formatCurrency.ts
│   ├── test/               # Setup de testes
│   │   └── setup.ts
│   ├── App.tsx             # Componente principal
│   ├── main.tsx            # Entry point
│   └── index.css           # Estilos globais
├── Dockerfile
├── vite.config.ts
├── vitest.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## API Backend

O microfrontend espera que a API backend forneça os seguintes endpoints:

- `GET /finance` - Listar todas as finanças
- `GET /finance/:id` - Buscar finança por ID
- `GET /finance/user/:userId` - Buscar finanças por usuário
- `POST /finance` - Criar nova finança
- `PUT /finance/:id` - Atualizar finança
- `DELETE /finance/:id` - Excluir finança

### Modelo de Dados

```typescript
interface Finance {
  id?: number;
  user_id: number;
  descricao: string;
  valor: number;
  tipo: 'receita' | 'despesa';
  data: string;
  created_at?: string;
  updated_at?: string;
}
```

## Licença

MIT
