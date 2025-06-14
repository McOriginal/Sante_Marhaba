const express = require('express');
const router = express.Router();
const userController = require('../controller/UserController');

// Enregistrer un nouvel utilisateur
router.post('/register', userController.register);

// Login User
router.post('/login', userController.login);

module.exports = router;
