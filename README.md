# Assistente Virtual - Gerenciador de Tarefas

Uma aplicação completa de assistente virtual para gerenciar tarefas (To-Do List), com um diferencial: o envio de notificações via WhatsApp. Desenvolvido com uma arquitetura MERN Stack (MongoDB, Express, React, Node.js), este projeto demonstra a integração entre frontend, backend e serviços de terceiros.

## Tecnologias

- **Backend**: Node.js, Express, MongoDB, Mongoose, Bcrypt, JWT, Twilio
- **Frontend**: React
- **Banco de Dados**: MongoDB
- **Notificações**: Twilio WhatsApp API

## Funcionalidades

- **Autenticação de Usuário**: Registro e login seguros com validação de credenciais.
- **Gerenciamento de Tarefas**: Crie, edite, remova e marque tarefas como concluídas.
- **Notificações Automatizadas**: Receba lembretes de tarefas diretamente no seu WhatsApp através da API da Twilio.

## Como Rodar o Projeto

### Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente local:

- Node.js (versão 14 ou superior)
- MongoDB (local ou em nuvem via MongoDB Atlas)
- Uma conta Twilio com a API do WhatsApp configurada.

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
   TWILIO_ACCOUNT_SID=sua_sid_da_conta_twilio
   TWILIO_AUTH_TOKEN=seu_token_de_autenticacao_twilio
   TWILIO_WHATSAPP_NUMBER=seu_numero_twilio_whatsapp

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
