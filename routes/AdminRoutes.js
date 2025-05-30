const express = require('express');
const router = express.Router();
const db = require('../config/db'); 
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const verifyAdmin = require('../middlewares/auth').verifyAdmin;

const AdminController = require('../controllers/adminController');

router.get('/inventory', verifyAdmin ,AdminController.renderInventory);
router.get('/orders', verifyAdmin, AdminController.renderOrders);
router.get('/products', verifyAdmin , AdminController.renderProducts);
router.get('/logout', AdminController.handleLogout);

router.get('/login', (req, res) => {
    res.render('admin/login', { error: null, success: null });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const [admin] = await db.query('SELECT * FROM admins WHERE email = ?', [email]);

        if (!admin.length) {
            return res.render('admin/login', { error: 'Invalid credentials.', success: null });
        }

        const isMatch = await bcrypt.compare(password, admin[0].password);
        if (!isMatch) {
            return res.render('admin/login', { error: 'Invalid credentials.', success: null });
        }

        // If login is successful
        const token = jwt.sign({ admin_id: admin[0].admin_id ,role: 'admin'}, '2y7aga', {
            expiresIn: '1h'
        });

        res.cookie('admin_token', token, { httpOnly: true });
        res.redirect('/admin/products');

    } catch (err) {
        console.error(err);
        res.render('admin/login', { error: 'Server error. Try again later.', success: null });
    }
});





module.exports = router;