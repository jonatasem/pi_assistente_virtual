const express = require('express');
const { createTodo, getTodos } = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

// Middleware para autenticação
router.use(authMiddleware); // O middleware é aplicado a todas as rotas abaixo

// Rotas para gerenciamento de tarefas
router.post('/', createTodo);
router.get('/', getTodos);

module.exports = router;