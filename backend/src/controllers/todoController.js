const Todo = require('../models/Todo');
const { scheduleWhatsAppNotification } = require('../scheduler/whatsappNotification'); 

// Criar nova tarefa
const createTodo = async (req, res) => {
  const { text, date, time, location, importance } = req.body;
  const userId = req.user.id; // O ID vem do middleware de autenticação (JWT)
  
  try {
    const todo = new Todo({ userId, text, date, time, location, importance });
    await todo.save();

    // Chama a função para agendar a notificação
    scheduleWhatsAppNotification(todo, userId); 

    res.status(201).json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao criar a tarefa');
  }
};

// Obter tarefas do usuário
const getTodos = async (req, res) => {
  const userId = req.user.id; 
  try {
    const todos = await Todo.find({ userId }).sort({ date: 1, time: 1 }); // Ordena por data e hora
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao buscar tarefas');
  }
};

module.exports = { createTodo, getTodos };
