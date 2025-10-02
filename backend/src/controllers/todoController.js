const Todo = require('../models/Todo');
const { 
    scheduleWhatsAppNotification, 
    cancelWhatsAppNotification 
} = require('../scheduler/whatsappNotification'); // 💡 Importação da função de cancelamento

// Criar nova tarefa
const createTodo = async (req, res) => {
  const { text, date, time, location, importance } = req.body;
  const userId = req.user.id; 
  
  try {
    // 💡 Validação básica para garantir dados cruciais
    if (!text || !date || !time) {
        return res.status(400).json({ msg: 'Faltam campos obrigatórios (text, date, time).' });
    }

    const todo = new Todo({ userId, text, date, time, location, importance });
    await todo.save();

    // Chama a função para agendar a notificação
    scheduleWhatsAppNotification(todo, userId); 

    res.status(201).json(todo);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao criar a tarefa.');
  }
};

// Obter tarefas do usuário
const getTodos = async (req, res) => {
  const userId = req.user.id; 
  try {
    const todos = await Todo.find({ userId }).sort({ date: 1, time: 1 }); 
    res.json(todos);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor ao buscar tarefas.');
  }
};

// 💡 NOVO: Atualizar tarefa
const updateTodo = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const userId = req.user.id; 

    try {
        const todo = await Todo.findOne({ _id: id, userId });
        
        if (!todo) {
            return res.status(404).json({ msg: 'Tarefa não encontrada ou acesso negado.' });
        }
        
        // Aplica as atualizações e salva
        Object.assign(todo, updates);
        await todo.save();

        // Lógica de Notificação:
        // 1. Se o status for 'concluído', CANCELA o lembrete.
        if (updates.status === 'concluído') {
            cancelWhatsAppNotification(id);
        // 2. Se a data/hora mudar, ou o status voltar a ser 'pendente', reagenda.
        } else if (updates.date || updates.time || updates.status === 'pendente') {
            scheduleWhatsAppNotification(todo, userId); 
        }

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao atualizar a tarefa.');
    }
};

// 💡 NOVO: Deletar tarefa
const deleteTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        const result = await Todo.deleteOne({ _id: id, userId });
        
        if (result.deletedCount === 0) {
            return res.status(404).json({ msg: 'Tarefa não encontrada ou acesso negado.' });
        }
        
        // Cancela a notificação pendente
        cancelWhatsAppNotification(id);

        res.json({ msg: 'Tarefa removida com sucesso.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao deletar a tarefa.');
    }
};

module.exports = { createTodo, getTodos, updateTodo, deleteTodo };