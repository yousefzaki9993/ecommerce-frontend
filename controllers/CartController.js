const pool = require('../config/db');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const { subscribe } = require('../routes/productRoutes');

exports.getCart = async (req, res) => {
    try {
        
        const items = await CartItem.getByCartId(req.session.cartId);
        const cartTotal = await Cart.getTotalPrice(req.session.cartId);
        res.render('cart', {
            items,
            cartTotal
        });
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.addToCart = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        console.log(req.body.productId);
        await CartItem.addItem(cartId, req.body.productId, 1);
        
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.removeItem = async (req, res) => {
    try {
        const itemId = req.params.itemId;
        await CartItem.removeItem(itemId);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.emptyCart = async (req, res) => {
    try {
        await CartItem.removeAll(req.session.cartId);
        res.json({ success: true });
    } catch (error) {
        console.error(error);
        res.status(400).json({ success: false, error: error.message });
    }
};

exports.getCount = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        const count = await CartItem.getCount(cartId);
        res.json({ count });
    } catch (error) {
        console.error(error);
        res.status(500).json({ count: 0, error: error.message });
    }
};

exports.getCartSubtotal = async (req, res) => {
    try{
        const subtotal = await Cart.getTotalPrice(req.session.cartId); 
        res.json({ subtotal: subtotal });
    }catch(error){
        console.error(error);
        res.status(500).json({ subtotal: 0, error: error.message });
    }
};

exports.updateCartItemQuantity = (req, res) => {
    const itemId = req.params.id;
    const newQty = req.body.quantity;

    const updated = Cart.updateItemQuantity(itemId, newQty); 
    if (updated) {
        res.json({ success: true });
    } else {
        res.json({ success: false });
    }
};

exports.renderCheckout = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        let items = await CartItem.getByCartId(cartId);
        
        // Convert all prices to numbers
        items = items.map(item => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));

        const subtotal = await Cart.getTotalPrice(cartId);
        const taxRate = 0.08;
        const tax = Number(subtotal) * taxRate;
        const total = Number(subtotal) + tax;

        res.render('checkout', {
            items,
            subtotal: Number(subtotal),
            tax: Number(tax),
            total: Number(total),
            shipping: 0.00
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.placeOrder = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        // Get data from session instead of body
        const cartId = req.session.cartId;
        const userId = req.session.userId || req.session.userData?.user?.user_id;

        if (!cartId || !userId) {
            throw new Error("Missing cart or user session");
        }

        await conn.beginTransaction();

        // 1. Calculate total
        const [[{total}]] = await conn.query(`
            SELECT SUM(p.price * ci.quantity) AS total
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cartId]);

        // 2. Create order
        const [order] = await conn.query(`
            INSERT INTO orders 
            (user_id, total_amount, status, shipping_address, payment_method) 
            VALUES (?, ?, 'pending', 'Default Address', 'Cash on Delivery')
        `, [userId, total]);

        // 3. Move items to order_items
        await conn.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price)
            SELECT ?, ci.product_id, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [order.insertId, cartId]);

        // 4. Clear cart
        await conn.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
        
        await conn.commit();

        res.json({ 
            success: true,
            orderId: order.insertId
        });

    } catch (error) {
        await conn.rollback();
        console.error('Order Error:', error);
        res.status(500).json({ 
            success: false,
            error: error.message 
        });
    } finally {
        conn.release();
    }
};

/*exports.getUserCart= async (req, res) => {
    try{
        const cartId = await Cart.getUserCart(req.session.userData.user.user_id); 
        res.json({ cartId: cartId });
    }catch(error){
        console.error(error);
        res.status(500).json({ subtotal: 0, error: error.message });
    }
};*/




