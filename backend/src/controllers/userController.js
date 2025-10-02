const User = require('../models/User');

/**
 * Obtém os detalhes do usuário logado usando o ID do token JWT.
 */
const getUserDetails = async (req, res) => {
    try {
        // O ID do usuário (req.user.id) é injetado pelo authMiddleware.
        const userId = req.user.id; 

        // Busca o usuário pelo ID, excluindo a senha.
        const user = await User.findById(userId).select('-password'); 

        if (!user) {
            return res.status(404).json({ msg: 'Usuário não encontrado.' });
        }

        res.json(user);
    } catch (err) {
        console.error('Erro ao buscar detalhes do usuário:', err.message);
        res.status(500).send('Erro interno do servidor.');
    }
};

module.exports = { getUserDetails };