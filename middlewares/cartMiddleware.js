const Cart = require('../models/Cart');

exports.initializeCart = async (req, res, next) => {
    try 
    {   console.log('11');
        if (!req.session.cartId) { //lesa fat7ein
            console.log('22');
            if(req.session.userData){
                console.log('33');
                const cartId = await Cart.getUserCart(req.session.userData.user.user_id);
                console.log(cartId);
                req.session.cartId = cartId;
            }else{
                console.log('44');
                const cartId = req.cookies.cartId; // Get cartId from cookie
                console.log(typeof(cartId));
                console.log(cartId);
                if (cartId) {// msh awl mara yegy
                    req.session.cartId = cartId; // Link to session
                } else {// first time, create a new record.
                    const cartid = await Cart.CreateCart();
                    console.log(cartid);
                    req.session.cartId = cartId;

                    res.cookie('cartId', cartId, { maxAge: 30 * 24 * 60 * 60 * 1000 });
                }
            }
        }//else, middleware mlosh lzma
        next();
    } catch (error) {
        next(error);
    }
};
/*
exports.mergeOnLogin = async (req, res, next) => {
    try {
        if (req.user && req.session.cartId) {
            await Cart.mergeCarts(req.session.cartId, req.user.id);
            // Get the user's main cart after merge
            const userCart = await Cart.findOrCreate(null, req.user.id);
            req.session.cartId = userCart.id;
        }
        next();
    } catch (error) {
        next(error);
    }
};*/