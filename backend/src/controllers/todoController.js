const Todo = require('../models/Todo');

// Criar nova tarefa
const createTodo = async (req, res) => {
  const { text, date, time, location, importance } = req.body;
  const userId = req.user.id; // Assume que o usuário está autenticado
  try {
    const todo = new Todo({ userId, text, date, time, location, importance });
    await todo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

// Obter tarefas do usuário
const getTodos = async (req, res) => {
  const userId = req.user.id; // Assume que o usuário está autenticado
  try {
    const todos = await Todo.find({ userId });
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor');
  }
};

module.exports = { createTodo, getTodos };