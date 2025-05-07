const User = require('../models/User');
require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

//APIs
exports.apiGetUsers = async (req, res) => {
    const users = await User.getAllUsers();
    res.json(users);
}

// For rendering view
exports.renderLogin = (req, res, next) => {
    try {
        if (req.session.userData) {
            return res.render('dashboard', { userData: req.session.userData.user });
        }
        res.render('login');
    } catch (error) {
        next(error);
    }
};

exports.renderProfile = async (req, res, next) => {
    try {
        if (req.session.userData) {
            const data = await User.getUserData(req.session.userData.user.user_id);
            return res.render('profile', { data: data });
        }
        res.render('login');
    } catch (error) {
        next(error);
    }
};

exports.renderRegister = (req, res, next) => {
    try {
        res.render('register');
    } catch (error) {
        next(error);
    }
};

// For logic
exports.handleLogin = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await User.findByEmail(email);

        if (!user) {
            req.flash('error_msg', 'Invalid email');
            res.redirect('/user/login');
            return;
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            req.flash('error_msg', 'Invalid Password');
            res.redirect('/user/login');
            return;
        }

        const token = User.generateToken(user.id);

        const userResponse = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        let = userData = {
            token,
            user: userResponse
        };

        req.session.userData = userData;
        req.session.cartId = null;
        
        req.flash('success_msg', 'Login successful');
        res.redirect('/user/dashboard');

    } catch (err) {
        next(err);
    }
};

exports.handleRegister = async (req, res, next) => {
    try {
        const { email, password, first_name, last_name, confirm_password } = req.body;
        const user = await User.findByEmail(email);

        if (password != confirm_password) {
            req.flash('error_msg', 'Password does not match!');
            res.redirect('/user/register');
            return;
        }
        if (user) {
            req.flash('error_msg', 'Email exists');
            res.redirect('/user/register');
            return
        }
        const id = await User.createNewUser({ email, password, first_name, last_name });
        const token = User.generateToken(id);

        const userResponse = {
            user_id: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
        };
        
        userData = {
            token,
            user: userResponse
        };

        req.session.userData = userData;
        req.session.cartId = null;

        req.flash('success_msg', 'Registration successful');
        res.redirect('/user/dashboard');

    } catch (err) {
        next(err);
    }
};

exports.handleLogout = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        }
        res.redirect('/');
    });
};
