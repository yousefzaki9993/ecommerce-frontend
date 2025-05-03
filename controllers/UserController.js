const User = require('../models/User');
require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

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
            return res.render('profile', {data: data} );
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
        let message;

        if (!user) {
            message = {
                success: false,
                message: 'Invalid email'
            }
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            message = {
                success: false,
                message: 'Invalid Password'
            };
        }

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE || '1h' }
        );

        const userResponse = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
        };

        message = {
            success: true,
            message: 'Login successful'
        };

        let userData = {
            token,
            user: userResponse
        };
        req.session.userData = userData;
        req.session.message = message;

        res.render('dashboard', { message: req.session.message, userData: req.session.userData.user });

    } catch (err) {
        console.error(err);
        message = {
            success: false,
            message: 'Server error during authentication'
        };
    }
};

exports.handleLogout = async (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).render('error', { message: 'Logout failed' });
        }

        res.render('login');
    });
};