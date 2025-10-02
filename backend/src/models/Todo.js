const mongoose = require('mongoose');

// Schema da tarefa/lembrete
const TodoSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  date: { // Ex: "2025-01-01"
    type: String,
    required: true,
  },
  time: { // Ex: "10:30:00"
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
}, { timestamps: true }); 

module.exports = mongoose.model('Todo', TodoSchema);