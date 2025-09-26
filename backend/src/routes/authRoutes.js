const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Rotas públicas
router.post('/register', register); // Rota de cadastro
router.post('/login', login);      // Rota de login

module.exports = router;