const express = require('express');
const router = express.Router();
const cartController = require('../controllers/CartController');
const { initializeCart} = require('../middlewares/cartMiddleware');

// Apply cart middleware to all routes
router.use(initializeCart);
//router.use(mergeOnLogin);

router.get('/', cartController.getCart);


router.post('/add', cartController.addToCart);
router.post('/remove/:itemId', cartController.removeItem);
router.post('/removeAll', cartController.emptyCart);
router.get('/count', cartController.getCount);
router.get('/subtotal', cartController.getCartSubtotal);
router.post('/update/:id', cartController.updateCartItemQuantity);
router.get('/checkout', cartController.renderCheckout);
//router.get('/usercart', cartController.getUserCart);



module.exports = router;