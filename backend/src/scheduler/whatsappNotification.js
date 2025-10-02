const twilio = require('twilio');
const User = require('../models/User'); 
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// 💡 NOVO: Mapa global para rastrear os setTimeout agendados (Chave: ID da Tarefa, Valor: ID do Timeout)
const scheduledNotifications = new Map();

/**
 * Cancela uma notificação agendada.
 * @param {string} todoId - O ID da tarefa.
 */
const cancelWhatsAppNotification = (todoId) => {
    const timeoutId = scheduledNotifications.get(todoId);
    if (timeoutId) {
        clearTimeout(timeoutId);
        scheduledNotifications.delete(todoId);
        console.log(`Notificação CANCELADA para a tarefa ID: ${todoId}`);
        return true;
    }
    return false;
};

/**
 * Agenda uma notificação por WhatsApp para a data e hora da tarefa.
 * @param {object} todo - O objeto da tarefa criado.
 * @param {string} userId - O ID do usuário.
 */
const scheduleWhatsAppNotification = async (todo, userId) => {
    try {
        // Se já houver um agendamento, cancele-o para reagendar.
        cancelWhatsAppNotification(todo._id.toString()); 

        const user = await User.findById(userId);
        
        if (!user || !user.phoneNumber) {
            console.error('Usuário não encontrado ou número de telefone ausente.');
            return;
        }

        const todoDateTimeString = `${todo.date}T${todo.time}`; 
        const todoDate = new Date(todoDateTimeString);
        
        const now = new Date();
        const delay = todoDate.getTime() - now.getTime(); // Tempo em milissegundos

        if (delay > 60000) { // Agenda apenas se for mais de 1 minuto no futuro
            const timeoutId = setTimeout(() => {
                const messageBody = `🚨 Lembrete da sua tarefa: "${todo.text}" está agendada para agora (${todo.time}). Local: ${todo.location || 'Não especificado'}.`;
                
                const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
                const toNumber = `whatsapp:${user.phoneNumber}`; 

                client.messages
                    .create({
                        body: messageBody,
                        from: fromNumber,
                        to: toNumber
                    })
                    .then(message => {
                        console.log('Mensagem WhatsApp enviada com sucesso:', message.sid);
                        scheduledNotifications.delete(todo._id.toString()); // Remove do mapa após o envio
                    })
                    .catch(error => console.error('Erro ao enviar mensagem WhatsApp:', error.message));
            }, delay);
            
            // 💡 ARMAZENA o ID do Timeout
            scheduledNotifications.set(todo._id.toString(), timeoutId);
            console.log(`Notificação agendada para ${todoDate.toISOString()}. (Atraso: ${delay / 60000} minutos)`);

        } else if (delay > 0) {
             console.log(`A tarefa "${todo.text}" é muito iminente (menos de 1 minuto) e não será agendada.`);
        } else {
            console.log(`A tarefa "${todo.text}" foi agendada para o passado e não será notificada.`);
        }

    } catch (err) {
        console.error('Erro geral ao agendar notificação WhatsApp:', err.message);
    }
};

module.exports = { scheduleWhatsAppNotification, cancelWhatsAppNotification };