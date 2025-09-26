const jwt = require('jsonwebtoken');

// Middleware para verificar token JWT
const authMiddleware = (req, res, next) => {
  const tokenHeader = req.header('Authorization'); 
  
  if (!tokenHeader) {
    return res.status(401).json({ msg: 'Acesso negado. Token não fornecido.' });
  }

  const token = tokenHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); 
    req.user = decoded.user; 
    next(); 
  } catch (err) {
    res.status(401).json({ msg: 'Token inválido ou expirado.' });
  }
};

module.exports = authMiddleware;