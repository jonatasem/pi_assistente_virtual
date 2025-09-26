const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Registro de usuário
const register = async (req, res) => {
  const { name, email, password, phoneNumber } = req.body; 
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Usuário já existe' });
    }
    
    // Cria um novo usuário com todos os dados
    user = new User({ name, email, password, phoneNumber }); 
    await user.save();
    
    // Cria e assina o token JWT
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, userId: user.id, msg: 'Registro bem-sucedido' });
  } catch (err) {
    console.error(err.message);
    if (err.code === 11000) {
        return res.status(400).json({ msg: 'Email ou Telefone já cadastrado.' });
    }
    res.status(500).send('Erro no servidor durante o registro.');
  }
};

// Login de usuário
const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    
    // Compara a senha com a senha hash
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Credenciais inválidas' });
    }
    
    // Cria e retorna o token
    const payload = { user: { id: user.id } };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.json({ token, userId: user.id });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Erro no servidor durante o login.');
  }
};

module.exports = { register, login };