const pool = require('../config/db');
const Cart = require('../models/Cart');
const CartItem = require('../models/CartItem');
const { getShippingFee } = require('../utils/shipping');
const { subscribe } = require('../routes/productRoutes');
let discount = require('../models/PromoCode').discount;

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

exports.checkItem = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        const exists = await CartItem.checkItem(cartId, req.body.productId);
        
        res.json({ exists: exists });
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

exports.isEmpty = async (req, res, next) => {
    try {
        console.log('ooooooooooooo');
        const empty = await Cart.isCartEmpty(req.session.cartId);
        res.json({ isEmpty: empty });
    } catch (err) {
        next(err);
    }
};


exports.applyDiscount = async (req, res) => {
    try {
        const { promoCode } = req.body;
        const cartId = req.session.cartId;
        
        // Validate promo code and calculate discount
        const discount = await validatePromoCode(promoCode, cartId);
        
        // Store in session
        req.session.discount = discount;
        await req.session.save();
        
        res.json({ 
            success: true,
            discount: discount
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            error: error.message
        });
    }
};

exports.renderCheckout = async (req, res) => {
    try {
        const cartId = req.session.cartId;
        let items = await CartItem.getByCartId(cartId);
        
        items = items.map(item => ({
            ...item,
            price: Number(item.price),
            quantity: Number(item.quantity)
        }));

        const subtotal = await Cart.getTotalPrice(cartId);
        const taxRate = 0.14;
        const discount = req.session.discount || 0;
        const tax = (subtotal) * taxRate;
        const total = subtotal - discount + tax;
        const shippingfee = req.session.shippingFee || 0;

        res.render('checkout', {
            items,
            subtotal: Number(subtotal),
            tax: Number(tax),
            total: Number(total),
            shipping: Number(shippingfee),
            discount: Number(discount) 
        });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server Error');
    }
};

exports.placeOrder = async (req, res) => {
    const conn = await pool.getConnection();
    try {
        // Get data from session
        const cartId = req.session.cartId;
        const userId = req.session.userId || req.session.userData?.user?.user_id;
        const discount = req.session.discount || 0; // Get discount from session
        //const { country, state } = req.body;

        if (!cartId || !userId) {
            throw new Error("Missing cart or user session");
        }

        const shippingFee = getShippingFee(country, state);
        console.log('Shipping Fee:', shippingFee);

        await conn.beginTransaction();

        // Calculate amounts
        const [[{subtotal}]] = await conn.query(`
            SELECT SUM(p.price * ci.quantity) AS subtotal
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [cartId]);

        const tax = subtotal * 0.14;
        const total = subtotal - discount + tax;
        console.log(total, discount);

        const [order] = await conn.query(`
            INSERT INTO orders 
            (user_id, subtotal, discount_amount, tax_amount, total_amount, status) 
            VALUES (?, ?, ?, ?, ?, 'processing')
        `, [userId, total, discount, tax, total]);

        // Move items to order_items
        await conn.query(`
            INSERT INTO order_items (order_id, product_id, quantity, price)
            SELECT ?, ci.product_id, ci.quantity, p.price
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE ci.cart_id = ?
        `, [order.insertId, cartId]);

        await conn.query(`DELETE FROM cart_items WHERE cart_id = ?`, [cartId]);
        delete req.session.discount;
        
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


exports.storeShippingInfo = (req, res) => {
    try {
        const { country, state } = req.body;

        req.session.shippingInfo = { country, state };

        const shippingFee = getShippingFee(country, state);
        console.log('Shipping Fee:', shippingFee);

        req.session.shippingFee = shippingFee;

        res.json({
            success: true,
            fee: shippingFee,
            message: 'ok',
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({
            success: false,
            error: error.message,
        });
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




