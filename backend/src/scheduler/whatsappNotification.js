const twilio = require('twilio');
const User = require('../models/User'); 
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

/**
 * Agenda uma notificação por WhatsApp para a data e hora da tarefa.
 * @param {object} todo - O objeto da tarefa criado.
 * @param {string} userId - O ID do usuário.
 */
const scheduleWhatsAppNotification = async (todo, userId) => {
    try {
        const user = await User.findById(userId);
        
        if (!user || !user.phoneNumber) {
            console.error('Usuário não encontrado ou número de telefone ausente.');
            return;
        }

        const todoDateTimeString = `${todo.date}T${todo.time}`; 
        const todoDate = new Date(todoDateTimeString);
        
        const now = new Date();
        const delay = todoDate.getTime() - now.getTime(); // Tempo em milissegundos para o agendamento

        if (delay > 0) {
            setTimeout(() => {
                const messageBody = `🚨 Lembrete da sua tarefa: "${todo.text}" está agendada para agora. Local: ${todo.location || 'Não especificado'}.`;
                
                const fromNumber = `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`;
                const toNumber = `whatsapp:${user.phoneNumber}`; 

                client.messages
                    .create({
                        body: messageBody,
                        from: fromNumber,
                        to: toNumber
                    })
                    .then(message => console.log('Mensagem WhatsApp enviada com sucesso:', message.sid))
                    .catch(error => console.error('Erro ao enviar mensagem WhatsApp:', error.message));
            }, delay);
            console.log(`Notificação agendada para ${todoDate.toISOString()}. (Atraso: ${delay / 60000} minutos)`);
        } else {
            console.log(`A tarefa "${todo.text}" foi agendada para o passado e não será notificada.`);
        }
    } catch (err) {
        console.error('Erro geral ao agendar notificação WhatsApp:', err.message);
    }
};

module.exports = { scheduleWhatsAppNotification };
