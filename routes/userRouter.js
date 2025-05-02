const express = require('express');
const userRoutes = express.Router();
const UserController = require('../controllers/UserController');

userRoutes.get('/login', async (req, res) => {
    try {
        res.render('login');
    } catch (err) {
        console.log(err);
    }
});

userRoutes.get('/register', async (req, res) => {
    try {
        res.render('register');
    } catch (err) {
        console.log(err);
    }
});

module.exports = userRoutes;