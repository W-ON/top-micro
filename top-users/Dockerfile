FROM node:20-alpine

WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm install

# Copiar código
COPY . .

# Build da aplicação
RUN npm run build

# Expor porta TCP
EXPOSE 4001

# Comando para iniciar
CMD ["npm", "run", "start:prod"]
