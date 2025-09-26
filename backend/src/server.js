require('dotenv').config(); // Carrega variáveis de ambiente do .env
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Importa arquivos de rota
const authRoutes = require('./routes/authRoutes');
const todoRoutes = require('./routes/todoRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware padrão
app.use(express.json()); // Permite que o servidor leia JSON no corpo das requisições
app.use(cors()); // Permite requisições de origens diferentes (necessário para o frontend)

// Conexão com o banco de dados MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB conectado com sucesso.'))
  .catch(err => console.error('Erro de conexão MongoDB:', err));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/todos', todoRoutes);

// Inicia o servidor
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));