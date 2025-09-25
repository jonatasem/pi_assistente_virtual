const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authMiddleware = (req, res, next) => {
  const token = req.header('Authorization'); // O token deve ser enviado aqui
  if (!token) {
    return res.status(401).json({ msg: 'Acesso negado' });
  }
  try {
    const decoded = jwt.verify(token.replace('Bearer ', ''), process.env.JWT_SECRET); // Removendo 'Bearer ' do token
    req.user = decoded.user; // Adiciona informações do usuário à requisição
    next();
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido' });
  }
};

module.exports = authMiddleware;
