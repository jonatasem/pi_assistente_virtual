const twilio = require('twilio');
const User = require('../models/User'); 
const client = new twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const scheduleWhatsAppNotification = async (todo, userId) => {
    try {
        const user = await User.findById(userId);
        if (!user || !user.phoneNumber) {
            console.error('Usuário ou número de telefone não encontrado.');
            return;
        }

        const todoDate = new Date(`${todo.date}T${todo.time}`);
        const now = new Date();
        const delay = todoDate.getTime() - now.getTime();

        if (delay > 0) {
            setTimeout(() => {
                const messageBody = `Olá! Lembrete da sua tarefa: "${todo.text}" está agendada para agora. Local: ${todo.location || 'Não especificado'}.`;

                client.messages
                    .create({
                        body: messageBody,
                        from: `whatsapp:${process.env.TWILIO_WHATSAPP_NUMBER}`,
                        to: `whatsapp:+55${user.phoneNumber}`
                    })
                    .then(message => console.log('Mensagem WhatsApp enviada:', message.sid))
                    .catch(error => console.error('Erro ao enviar mensagem WhatsApp:', error));
            }, delay);
        }
    } catch (err) {
        console.error('Erro ao agendar notificação WhatsApp:', err);
    }
};

module.exports = { scheduleWhatsAppNotification };