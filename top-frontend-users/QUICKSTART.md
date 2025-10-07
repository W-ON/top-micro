# Quick Start Guide - Top Frontend Users

## 🚀 Início Rápido (5 minutos)

### 1️⃣ Instalação

```bash
# Navegue até o diretório
cd top-frontend-users

# Instale as dependências
npm install
```

### 2️⃣ Configuração

```bash
# O arquivo .env já está criado com:
VITE_API_URL=http://localhost:4000
PORT=3001
```

### 3️⃣ Executar

```bash
# Modo desenvolvimento
npm run dev

# Acesse: http://localhost:3001
```

### 4️⃣ Testar

```bash
# Rodar testes
npm test

# Com cobertura
npm run test:coverage

# Interface visual
npm run test:ui
```

## 📦 Build e Deploy

### Build Local

```bash
# Criar build de produção
npm run build

# Visualizar build
npm run preview
```

### Docker

```bash
# Build da imagem
docker build -t top-frontend-users .

# Executar container
docker run -p 3001:3001 top-frontend-users
```

## 🔌 Integração

### Com API Gateway

Certifique-se que o API Gateway está rodando em:
```
http://localhost:4000
```

Endpoints esperados:
- GET /users
- POST /users
- PUT /users/:id
- DELETE /users/:id

### Com Shell Host

No projeto shell, adicione:

```typescript
// vite.config.ts
import federation from '@originjs/vite-plugin-federation';

export default defineConfig({
  plugins: [
    federation({
      name: 'shell',
      remotes: {
        users: 'http://localhost:3001/assets/remoteEntry.js'
      },
      shared: {
        react: { singleton: true },
        'react-dom': { singleton: true }
      }
    })
  ]
});
```

```typescript
// No componente
import { lazy, Suspense } from 'react';

const UsersApp = lazy(() => import('users/UsersApp'));

function App() {
  return (
    <Suspense fallback={<div>Carregando...</div>}>
      <UsersApp />
    </Suspense>
  );
}
```

## 🎯 Principais Funcionalidades

### Listar Usuários
- Acesse `/` para ver a lista
- Use a busca para filtrar
- Altere itens por página
- Navegue entre páginas

### Criar Usuário
- Clique em "Novo Usuário"
- Preencha o formulário
- Validação automática
- CPF e telefone são formatados automaticamente

### Editar Usuário
- Clique no ícone de edição na tabela
- Modifique os dados
- Clique em "Atualizar"

### Excluir Usuário
- Clique no ícone de exclusão
- Confirme no modal
- Usuário será removido

## 📝 Scripts Disponíveis

| Comando | Descrição |
|---------|-----------|
| `npm run dev` | Servidor de desenvolvimento (port 3001) |
| `npm run build` | Build de produção |
| `npm run preview` | Preview da build |
| `npm test` | Executar testes |
| `npm run test:ui` | Interface de testes |
| `npm run test:coverage` | Relatório de cobertura |

## 🐛 Troubleshooting

### Porta 3001 em uso
```bash
# Altere no .env
PORT=3002
```

### Erro de conexão com API
Verifique se:
1. API Gateway está rodando
2. `VITE_API_URL` está correto
3. CORS está habilitado

### Testes falhando
```bash
# Limpe o cache
rm -rf node_modules
npm install
npm test
```

### Module Federation não funciona
1. Verifique se a build foi feita
2. Confirme que `remoteEntry.js` existe em `dist/assets/`
3. Verifique as versões do React (devem ser iguais)

## 📚 Arquivos Importantes

- `src/App.tsx` - Componente principal (exposto pelo Module Federation)
- `src/pages/UsersList.tsx` - Listagem de usuários
- `src/pages/UserForm.tsx` - Formulário criar/editar
- `src/hooks/useUsers.ts` - React Query hooks
- `src/schemas/userSchema.ts` - Validações Yup
- `vite.config.ts` - Module Federation config

## 🔍 Estrutura de Rotas

| Rota | Componente | Descrição |
|------|-----------|-----------|
| `/` | UsersList | Lista todos os usuários |
| `/new` | UserForm | Criar novo usuário |
| `/edit/:id` | UserForm | Editar usuário existente |

## ✅ Checklist Pré-Deploy

- [ ] Variáveis de ambiente configuradas
- [ ] Testes passando (`npm test`)
- [ ] Build sem erros (`npm run build`)
- [ ] API Gateway acessível
- [ ] CORS configurado
- [ ] Module Federation testado

## 🎨 Personalização

### Alterar Tema

Edite `src/App.tsx`:

```typescript
const theme = createTheme({
  palette: {
    primary: {
      main: '#SUA_COR', // Mude aqui
    },
  },
});
```

### Alterar Porta

Edite `.env`:

```env
PORT=SUA_PORTA
```

### Alterar API URL

Edite `.env`:

```env
VITE_API_URL=http://sua-api-url
```

## 📖 Documentação Completa

Para mais detalhes, consulte:
- `README.md` - Documentação completa
- `STRUCTURE.md` - Estrutura do projeto
- `PROJECT_SUMMARY.md` - Resumo do projeto

## 🆘 Suporte

Se encontrar problemas:
1. Verifique a documentação
2. Revise os logs de erro
3. Consulte os testes para exemplos de uso
4. Abra uma issue no repositório

---
