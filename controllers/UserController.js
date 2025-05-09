const User = require('../models/User');
require('express-session');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Order = require('../models/Order');

// APIs
exports.apiGetUsers = async (req, res) => {
    const users = await User.getAllUsers();
    res.json(users);
};

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

        const token = User.generateToken(user.user_id);
        
        const userResponse = {
            user_id: user.user_id,
            first_name: user.first_name,
            last_name: user.last_name,
            email: user.email,
            phone: user.phone,
        };

        req.session.userData = {
            token,
            user: userResponse
        };
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
            return;
        }

        const id = await User.createNewUser({ email, password, first_name, last_name });
        const token = User.generateToken(id);

        const userResponse = {
            user_id: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
        };

        req.session.userData = {
            token,
            user: userResponse
        };
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


exports.getDashboardPage = async (req, res) => {
    try {
        if (!req.session.userData) {
            return res.redirect('/user/login');
        }

        const userId = req.session.userData.user.user_id;

        const orders = await Order.getUserOrders(userId, {});

        const totalOrders = orders.length;
        const completedOrders = orders.filter(order => order.status === 'delivered').length;
        const pendingOrders = orders.filter(order => order.status === 'pending').length;

        res.render('dashboard', {
            title: 'Dashboard',
            userData: req.session.userData.user,
            orders: orders,
            totalOrders: totalOrders,
            completedOrders: completedOrders,
            pendingOrders: pendingOrders,
            getStatusClass: function(status) {
                const statusClasses = {
                    'pending': 'warning',
                    'processing': 'info',
                    'shipped': 'primary',
                    'delivered': 'success',
                    'cancelled': 'danger'
                };
                return statusClasses[status.toLowerCase()] || 'secondary';
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
};



exports.getMyOrdersPage = async (req, res) => {
    try {
        if (!req.session.userData) {
            return res.redirect('/user/login');
        }

        const filters = {
            status: req.query.status || '',
            from: req.query.from || '',
            to: req.query.to || ''
        };

        const orders = await Order.getUserOrders(req.session.userData.user.user_id, filters);

        orders.forEach(order => {
            order.total_amount = parseFloat(order.total_amount);
        });

        res.render('orders', {
            title: 'My Orders',
            user: req.session.userData.user,
            orders: orders,
            filters: filters,
            helpers: {
                formatDate: function(date) {
                    return new Date(date).toLocaleDateString();
                },
                getStatusClass: function(status) {
                    const statusClasses = {
                        'pending': 'warning',
                        'processing': 'info',
                        'shipped': 'primary',
                        'delivered': 'success',
                        'cancelled': 'danger'
                    };
                    return statusClasses[status.toLowerCase()] || 'secondary';
                }
            }
        });
    } catch (error) {
        console.error('Error in getMyOrdersPage:', error);
        res.status(500).render('error', {
            message: 'Failed to load your orders',
            error: error
        });
    }
};


exports.handleUpdateProfile = async (req, res, next) => {
    try {
        const { email, first_name, last_name, phone, bio, profileImage } = req.body;
        const user = await User.findByEmail(email);

        if (email != req.session.userData.user.email && user) {
            req.flash('error_msg', 'Email exists');
            res.redirect('/user/profile');
            return;
        }
        if (first_name == '' || last_name == '') {
            req.flash('error_msg', 'Name cannot be empty!');
            res.redirect('/user/profile');
            return;
        }

        const id = req.session.userData.user.user_id;
        await User.updateUser({ email, first_name, last_name, phone: phone || null, bio: bio || null, profileImage }, id);

        const userResponse = {
            user_id: id,
            first_name: first_name,
            last_name: last_name,
            email: email,
            phone: phone,
        };

        req.session.userData.user = userResponse;

        req.flash('success_msg', 'Update successful');
        res.redirect('/user/profile');

    } catch (err) {
        next(err);
    }
};
