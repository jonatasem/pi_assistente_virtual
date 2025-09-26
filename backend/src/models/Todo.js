const mongoose = require('mongoose');

// Schema da tarefa/lembrete
const TodoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Referência ao modelo de Usuário
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  // Usaremos String para facilitar a formatação da data (ex: "2025-01-01")
  date: { 
    type: String,
    required: true,
  },
  // Usaremos String para a hora (ex: "10:30:00")
  time: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: false,
  },
  importance: {
    type: String,
    enum: ['baixa', 'media', 'alta'],
    default: 'baixa',
  },
  status: {
    type: String,
    default: 'pendente',
  },
}, { timestamps: true }); // Adiciona campos createdAt e updatedAt

module.exports = mongoose.model('Todo', TodoSchema);