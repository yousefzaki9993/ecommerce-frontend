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

/*exports.getUserCart= async (req, res) => {
    try{
        const cartId = await Cart.getUserCart(req.session.userData.user.user_id); 
        res.json({ cartId: cartId });
    }catch(error){
        console.error(error);
        res.status(500).json({ subtotal: 0, error: error.message });
    }
};*/




