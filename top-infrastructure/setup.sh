#!/bin/bash

# Script de setup para o projeto Top Challenge
# Este script clona todos os repositórios necessários e configura o ambiente

set -e

echo "🚀 Iniciando setup do Top Challenge..."

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Diretório base
BASE_DIR=$(pwd)

# Função para clonar repositório
clone_repo() {
    local repo_name=$1
    local repo_url=$2

    if [ -d "../$repo_name" ]; then
        echo -e "${YELLOW}⚠️  Repositório $repo_name já existe, pulando...${NC}"
    else
        echo -e "${BLUE}📥 Clonando $repo_name...${NC}"
        cd ..
        git clone "$repo_url" "$repo_name"
        cd "$BASE_DIR"
        echo -e "${GREEN}✅ $repo_name clonado com sucesso${NC}"
    fi
}

# Função para instalar dependências
install_deps() {
    local service_name=$1

    echo -e "${BLUE}📦 Instalando dependências do $service_name...${NC}"
    cd "../$service_name"
    npm install
    cd "$BASE_DIR"
    echo -e "${GREEN}✅ Dependências do $service_name instaladas${NC}"
}

echo ""
echo "================================================"
echo "  CLONANDO REPOSITÓRIOS"
echo "================================================"
echo ""

# IMPORTANTE: Substitua as URLs abaixo pelos seus repositórios reais
# Exemplo: clone_repo "top-users" "https://github.com/seu-usuario/top-users.git"

# Backend
# clone_repo "top-users" "URL_DO_REPO_TOP_USERS"
# clone_repo "top-finance" "URL_DO_REPO_TOP_FINANCE"
# clone_repo "top-api-gateway" "URL_DO_REPO_TOP_API_GATEWAY"

# Frontend
# clone_repo "top-frontend-shell" "URL_DO_REPO_TOP_FRONTEND_SHELL"
# clone_repo "top-frontend-users" "URL_DO_REPO_TOP_FRONTEND_USERS"
# clone_repo "top-frontend-finance" "URL_DO_REPO_TOP_FRONTEND_FINANCE"

echo ""
echo "================================================"
echo "  INSTALANDO DEPENDÊNCIAS"
echo "================================================"
echo ""

# Descomente as linhas abaixo para instalar dependências
# install_deps "top-users"
# install_deps "top-finance"
# install_deps "top-api-gateway"
# install_deps "top-frontend-shell"
# install_deps "top-frontend-users"
# install_deps "top-frontend-finance"

echo ""
echo "================================================"
echo "  CONFIGURANDO AMBIENTE"
echo "================================================"
echo ""

# Copiar .env.example para .env em cada projeto
for service in top-users top-finance top-api-gateway top-frontend-shell top-frontend-users top-frontend-finance; do
    if [ -d "../$service" ]; then
        if [ ! -f "../$service/.env" ]; then
            echo -e "${BLUE}📝 Criando .env para $service...${NC}"
            cp "../$service/.env.example" "../$service/.env" 2>/dev/null || echo -e "${YELLOW}⚠️  .env.example não encontrado para $service${NC}"
        fi
    fi
done

echo ""
echo -e "${GREEN}✅ Setup concluído com sucesso!${NC}"
echo ""
echo "================================================"
echo "  PRÓXIMOS PASSOS"
echo "================================================"
echo ""
echo "1. Configure os arquivos .env de cada serviço"
echo "2. Execute 'docker-compose up --build' neste diretório"
echo "3. Acesse:"
echo "   - Frontend Shell: http://localhost:3000"
echo "   - Frontend Users: http://localhost:3001"
echo "   - Frontend Finance: http://localhost:3002"
echo "   - API Gateway: http://localhost:4000"
echo ""
echo -e "${GREEN}🎉 Bom trabalho!${NC}"
