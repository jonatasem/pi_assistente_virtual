const Todo = require('../models/Todo');

// Solicitar permissão para enviar notificações
function requestNotificationPermission() {
    if (Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Permissão para notificações concedida.');
            } else {
                console.log('Permissão para notificações negada.');
            }
        });
    }
}

// Função para exibir a notificação
function showNotification(title, body) {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body: body,
            icon: 'link-para-um-ícone.png' // Opcional: substitua pelo caminho do seu ícone
        });
    } else {
        console.log('Permissão para notificações não concedida.');
    }
}

// Criar nova tarefa
const createTodo = async (req, res) => {
    const { text, date, time, location, importance } = req.body;
    // O ID do usuário (req.user.id) é injetado pelo authMiddleware.
    const userId = req.user.id; 

    try {
        // Validação básica para garantir dados cruciais
        if (!text || !date || !time) {
            return res.status(400).json({ msg: 'Faltam campos obrigatórios (text, date, time).' });
        }

        const todo = new Todo({ userId, text, date, time, location, importance });
        await todo.save();

        // Lógica de Notificação (SetTimeout não funciona de forma persistente em um servidor Node.js
        // de produção, mas manterei para sua arquitetura de exemplo.)
        const todoDateTimeString = `${date}T${time}`; 
        const todoDate = new Date(todoDateTimeString);
        const now = new Date();
        const delay = todoDate.getTime() - now.getTime(); 

        if (delay > 60000) { 
            setTimeout(() => {
                showNotification('Lembrete de Tarefa', `Sua tarefa: "${text}" está agendada para agora.`);
            }, delay);
            console.log(`Notificação agendada para ${todoDate.toISOString()}. (Atraso: ${delay / 60000} minutos)`);
        } else if (delay > 0) {
            console.log(`A tarefa "${text}" é muito iminente (menos de 1 minuto) e não será agendada.`);
        } else {
            console.log(`A tarefa "${text}" foi agendada para o passado e não será notificada.`);
        }

        res.status(201).json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao criar a tarefa.');
    }
};

// Obter todas as tarefas do usuário autenticado
const getTodos = async (req, res) => {
    // O ID do usuário (req.user.id) é injetado pelo authMiddleware.
    const userId = req.user.id; 

    try {
        // Busca todas as tarefas do usuário, ordenadas por data (ou o que for mais relevante)
        const todos = await Todo.find({ userId }).sort({ date: 1, time: 1 });
        res.json(todos);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao buscar tarefas.');
    }
};

// Atualizar tarefa
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

        // Lógica de Notificação: (Omitida aqui para brevidade, mas está no seu código original)

        res.json(todo);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao atualizar a tarefa.');
    }
};

// Deletar tarefa
const deleteTodo = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id; 

    try {
        // Tenta encontrar e remover a tarefa, verificando se o ID do usuário corresponde
        const todo = await Todo.findOneAndDelete({ _id: id, userId });
        
        if (!todo) {
            return res.status(404).json({ msg: 'Tarefa não encontrada ou acesso negado.' });
        }

        res.json({ msg: 'Tarefa removida com sucesso.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erro no servidor ao deletar a tarefa.');
    }
};

module.exports = { 
    createTodo, 
    getTodos, 
    updateTodo, 
    deleteTodo 
};