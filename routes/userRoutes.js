const express = require('express');
const userRoutes = express.Router();
const router = express.Router(); 
const UserController = require('../controllers/UserController');

userRoutes.get('/api/all', UserController.apiGetUsers);
userRoutes.get('/login', UserController.renderLogin);
userRoutes.get('/updatepass', UserController.renderChangePass);
userRoutes.post('/updatepass', UserController.handleChangePass);
userRoutes.post('/login', UserController.handleLogin);
userRoutes.get('/register', UserController.renderRegister);
userRoutes.post('/register', UserController.handleRegister);
userRoutes.get('/dashboard', UserController.getDashboardPage);
userRoutes.get('/logout', UserController.handleLogout);
userRoutes.get('/profile', UserController.renderProfile);
userRoutes.post('/profile', UserController.handleUpdateProfile);
userRoutes.get('/orders', UserController.getMyOrdersPage);

router.get('/dashboard', async (req, res) => {
    try {
        // 1. Verify user is logged in
        if (!req.session.userData) {
            return res.redirect('/login');
        }

        const userId = req.session.userData.user.user_id;

        // 2. Fetch all required data
        const [stats, recentOrders] = await Promise.all([
            // Get statistics
            (async () => {
                const [total] = await pool.query(
                    'SELECT COUNT(*) AS total_orders FROM orders WHERE user_id = ?', 
                    [userId]
                );
                const [completed] = await pool.query(
                    `SELECT COUNT(*) AS completed_orders 
                     FROM orders 
                     WHERE user_id = ? AND status = 'delivered'`,
                    [userId]
                );
                const [pending] = await pool.query(
                    `SELECT COUNT(*) AS pending_orders 
                     FROM orders 
                     WHERE user_id = ? AND status IN ('pending', 'processing')`,
                    [userId]
                );
                return {
                    total_orders: total[0].total_orders,
                    completed_orders: completed[0].completed_orders,
                    pending_orders: pending[0].pending_orders
                };
            })(),
            
            // Get recent orders
            pool.query(`
                SELECT 
                    order_id,
                    total_amount,
                    status,
                    DATE_FORMAT(created_at, '%b %d, %Y') AS formatted_date,
                    (SELECT COUNT(*) FROM order_items WHERE order_id = orders.order_id) AS item_count
                FROM orders
                WHERE user_id = ?
                ORDER BY created_at DESC
                LIMIT 3
            `, [userId])
        ]);

        // 3. Render the dashboard with all data
        res.render('dashboard', {
            userData: req.session.userData,
            stats: stats, 
            recentOrders: recentOrders[0],
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });

    } catch (error) {
        console.error('Dashboard Error:', error);
        req.flash('error_msg', 'Failed to load dashboard');
        res.redirect('/');
    }
});

module.exports = userRoutes;