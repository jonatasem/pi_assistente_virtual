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

// Atualizar tarefa
const updateTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id; // garante que é do usuário autenticado
  const { text, date, time, location, importance, status } = req.body;

  try {
    const todo = await Todo.findOneAndUpdate(
      { _id: id, userId }, // só atualiza se for do usuário
      { text, date, time, location, importance, status },
      { new: true } // retorna a versão atualizada
    );

    if (!todo) {
      return res.status(404).json({ msg: 'Tarefa não encontrada' });
    }

    res.json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Erro no servidor ao atualizar tarefa' });
  }
};

// Excluir tarefa
const deleteTodo = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const todo = await Todo.findOne({ _id: id, userId });
    if (!todo) return res.status(404).json({ msg: 'Tarefa não encontrada' });

    await todo.deleteOne();
    res.json({ msg: 'Tarefa deletada com sucesso', id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Erro ao deletar a tarefa' });
  }
};


module.exports = { createTodo, getTodos, deleteTodo };