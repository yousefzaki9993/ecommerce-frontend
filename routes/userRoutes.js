const express = require('express');
const userRoutes = express.Router();
const UserController = require('../controllers/UserController');

userRoutes.get('/login', UserController.renderLogin);
userRoutes.post('/login', UserController.handleLogin);
userRoutes.get('/register', UserController.renderRegister);
userRoutes.post('/register', UserController.handleRegister);
userRoutes.get('/dashboard', UserController.renderLogin);
userRoutes.get('/logout', UserController.handleLogout);
userRoutes.get('/profile', UserController.renderProfile);

module.exports = userRoutes;