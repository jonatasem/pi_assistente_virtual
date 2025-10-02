const express = require('express');
const { getUserDetails } = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware'); 

const router = express.Router();

// Rota correta: GET /api/user. O ID é pego do token pelo authMiddleware.
router.get('/', authMiddleware, getUserDetails);

module.exports = router;
