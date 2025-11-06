# Assistente Virtual - Gerenciador de Tarefas

Uma aplicação completa de assistente virtual para gerenciar tarefas (To-Do List), com o envio de notificações. Desenvolvido com uma arquitetura MERN Stack (MongoDB, Express, React, Node.js).

## Tecnologias

- **Backend**: Node.js, Express, MongoDB, Mongoose, Bcrypt, JWT
- **Frontend**: React
- **Banco de Dados**: MongoDB

## Funcionalidades

- **Autenticação de Usuário**: Registro e login seguros com validação de credenciais.
- **Gerenciamento de Tarefas**: Crie, edite, remova e marque tarefas como concluídas.

## Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente local:

- Node.js (versão 14 ou superior)
- MongoDB (local ou em nuvem via MongoDB Atlas)

### Instalação

1. **Clone o repositório**:

   git clone https://github.com/jonatasem/pi_assistente_virtual.git
   cd pi_assistente_virtual
   
2. **Configuração do Backend**:

   Acesse a pasta do backend e crie um arquivo chamado `.env` com as seguintes variáveis:

   cd backend
   touch .env

   Preencha o arquivo com suas credenciais:

   PORT=5000
   MONGO_URI=sua_string_de_conexao_do_mongodb
   JWT_SECRET=sua_chave_secreta_para_jwt

3. **Configuração do Frontend**:

   Acesse a pasta do frontend e crie um arquivo `.env` para a URL da API:

   cd ../frontend
   touch .env

   Adicione a variável de ambiente:

   VITE_REACT_APP_API_URL=http://localhost:5000/api
   
4. **Instale as dependências**:

   Instale as dependências de ambas as partes do projeto:

   - **Backend**:

   cd backend
   npm install
   
   - **Frontend**:

   cd ../frontend
   npm install
   
### Executando

1. **Inicie o Backend**:

   Na pasta do backend, execute:

   npm start
   
   O servidor será iniciado na porta 5000.

2. **Inicie o Frontend**:

   Em um novo terminal, na pasta do frontend, execute:

   npm run dev
   
   O aplicativo estará acessível em [http://localhost:5173/](http://localhost:5173/).

## Licença

Este projeto está sob a licença [MIT License](LICENSE).
