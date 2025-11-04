const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// Aplica o middleware de autenticação a TODAS as rotas neste arquivo
router.use(authMiddleware); 

// Rotas para gerenciamento de tarefas
router.post('/', createTodo);           // Cria uma nova tarefa
router.get('/', getTodos);              // Obtém todas as tarefas do usuário autenticado
router.patch('/:id', updateTodo);       // Atualiza status ou campos de uma tarefa
router.delete('/:id', deleteTodo);      // Exclui uma tarefa

module.exports = router;