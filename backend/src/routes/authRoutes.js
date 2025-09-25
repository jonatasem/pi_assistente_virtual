const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();

// Rotas para registro e login de usuários
router.post('/register', register);
router.post('/login', login);

module.exports = router;
