const mongoose = require('mongoose');

// Schema da tarefa
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
  date: {
    type: Date,
    required: true,
  },
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
});

module.exports = mongoose.model('Todo', TodoSchema);