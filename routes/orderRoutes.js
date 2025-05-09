const pool = require('../config/db'); 
const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const CartController = require('../controllers/CartController');

router.get('/checkout', (req, res) => {
  
    res.render('checkout', { 
        cartId: req.session.cartId,
        userId: req.session.userData?.user?.user_id 
    });
});

router.get('/api/get-session-data', (req, res) => {
    res.json({
        cartId: req.session.cartId,
        userId: req.session.userData?.user?.user_id
    });
});

router.post('/api/orders', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        
        // 1. Validate and extract data
        const { cartId, userId } = req.body;
        if (!cartId || !userId) throw new Error("Missing required fields");

        // 2. Process order
        const [order] = await conn.query(
            `INSERT INTO orders (user_id, total_amount, status)
             SELECT ?, SUM(p.price * ci.quantity), 'pending'
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [userId, cartId]
        );

        // 3. Move items to order_items
        await conn.query(
            `INSERT INTO order_items (order_id, product_id, quantity, price)
             SELECT ?, ci.product_id, ci.quantity, p.price
             FROM cart_items ci
             JOIN products p ON ci.product_id = p.product_id
             WHERE ci.cart_id = ?`,
            [order.insertId, cartId]
        );

        // 4. Clear cart
        await conn.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
        
        await conn.commit();
        
        res.json({
            success: true,
            orderId: order.insertId,
            redirect: `/orders/${order.insertId}`
        });

    } catch (error) {
        await conn.rollback();
        console.error('[ORDER API ERROR]', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    } finally {
        conn.release();
    }
});

router.get('/api/orders/:id', async (req, res) => {
    try {
        const [order] = await pool.query(
            `SELECT * FROM orders WHERE order_id = ?`, 
            [req.params.id]
        );
        res.json(order[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/orders/:id', async (req, res) => {
    try {
        const [order] = await pool.query(`
            SELECT * FROM orders WHERE order_id = ?
        `, [req.params.id]);
        
        if (!order.length) {
            return res.status(404).json({ error: 'Order not found' });
        }
        
        res.json(order[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/place-order', async (req, res) => {
    const conn = await pool.getConnection();
    try {
        // 1. Destructure and validate input
        const { 
            shippingAddress, 
            paymentMethod,
            paymentDetails = {}
        } = req.body;

        const cartId = req.session.cartId;
        const userId = req.session.userData?.user?.user_id;

        // 2. Validate required fields
        const errors = [];
        if (!cartId) errors.push("Missing cart session");
        if (!userId) errors.push("User not authenticated");
        if (!shippingAddress?.trim()) errors.push("Shipping address required");
        if (!paymentMethod) errors.push("Payment method required");

        // 3. Special validation for credit card payments
        if (paymentMethod === 'Credit/Debit Card') {
            if (!paymentDetails.cardNumber || paymentDetails.cardNumber.replace(/\s/g, '').length < 15) {
                errors.push("Valid 16-digit card number required");
            }
            if (!paymentDetails.cardName?.trim()) errors.push("Cardholder name required");
            if (!paymentDetails.cardExpiry?.match(/^\d{2}\/\d{2}$/)) {
                errors.push("Valid expiry date (MM/YY) required");
            }
            if (!paymentDetails.cardCvv?.match(/^\d{3,4}$/)) {
                errors.push("Valid 3-4 digit CVV required");
            }
        }

        if (errors.length > 0) {
            throw new Error(errors.join(", "));
        }

        await conn.beginTransaction();

        // 4. Calculate order total (using your existing table structure)
        const [[{total}]] = await conn.query(`
            SELECT SUM(p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cartId]);

        // 5. Create order record (simplified without subtotal/tax)
        const [order] = await conn.query(`
            INSERT INTO orders 
            (user_id, total_amount, status, shipping_address, payment_method) 
            VALUES (?, ?, 'processing', ?, ?)
        `, [userId, total, shippingAddress, paymentMethod]);

        // 6. Save payment details if credit card
        if (paymentMethod === 'Credit/Debit Card' && paymentDetails) {
            const [month, year] = paymentDetails.cardExpiry.split('/');
            await conn.query(`
                INSERT INTO payments 
                (order_id, card_last_four, card_type, expiry_month, expiry_year) 
                VALUES (?, ?, ?, ?, ?)
            `, [
                order.insertId,
                paymentDetails.cardNumber.replace(/\s/g, '').slice(-4),
                getCardType(paymentDetails.cardNumber), 
                month,
                year
            ]);
        }

        // 7. Transfer cart items
        await conn.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price)
            SELECT ?, ci.product_id, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [order.insertId, cartId]);

        // 8. Clear cart and commit
        await conn.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
        await conn.commit();

        res.json({ 
            success: true,
            orderId: order.insertId,
            redirect: `/user/dashboard`
        });

    } catch (error) {
        await conn.rollback();
        console.error('Order Error:', {
            error: error.message,
            session: req.session
        });
        res.status(400).json({ 
            success: false,
            error: error.message
        });
    } finally {
        conn.release();
    }
});

// Helper function to determine card type
function getCardType(cardNumber) {
    const num = cardNumber.replace(/\s/g, '');
    if (/^4/.test(num)) return 'VISA';
    if (/^5[1-5]/.test(num)) return 'Mastercard';
    if (/^3[47]/.test(num)) return 'Amex';
    return 'Other';
}

router.get('/dashboard', async (req, res) => {
    try {
        const [orders] = await pool.query(`
            SELECT 
                order_id,
                total_amount,
                status,
                shipping_address,
                DATE_FORMAT(created_at, '%b %d, %Y') AS order_date,
                (SELECT COUNT(*) FROM order_items WHERE order_id = orders.order_id) AS item_count
            FROM orders
            WHERE user_id = ?
            ORDER BY created_at DESC
            LIMIT 3
        `, [req.session.userData.user.user_id]);

        res.render('dashboard', {
            userData: req.session.userData,
            recentOrders: orders,
            success_msg: req.flash('success_msg'),
            error_msg: req.flash('error_msg')
        });
    } catch (error) {
        console.error('Dashboard Error:', error);
        res.status(500).send('Server Error');
    }
});

router.get('/orders/verify/:id', async (req, res) => {
    try {
        const [order] = await pool.query(
            'SELECT * FROM orders WHERE order_id = ?', 
            [req.params.id]
        );
        res.status(order.length ? 200 : 404).json(order[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

router.get('/order-success/:orderId', async (req, res) => {
    try {
        const [order] = await pool.query(
            `SELECT * FROM orders WHERE order_id = ?`,
            [req.params.orderId]
        );
        
        res.render('order-success', { order: order[0] });
    } catch (error) {
        res.status(500).send("Order lookup failed");
    }
});

module.exports = router;