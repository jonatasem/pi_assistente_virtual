const express = require('express');
const { createTodo, getTodos, updateTodo, deleteTodo } = require('../controllers/todoController'); // 💡 Métodos adicionados
const authMiddleware = require('../middleware/authMiddleware'); 
const router = express.Router();

// Aplica o middleware de autenticação a TODAS as rotas neste arquivo
router.use(authMiddleware); 

// Rotas para gerenciamento de tarefas
router.post('/', createTodo);           // Cria uma nova tarefa
router.get('/', getTodos);              // Obtém todas as tarefas do usuário autenticado
router.patch('/:id', updateTodo);       // 💡 NOVO: Atualiza status ou campos de uma tarefa
router.delete('/:id', deleteTodo);      // 💡 NOVO: Exclui uma tarefa

module.exports = router;