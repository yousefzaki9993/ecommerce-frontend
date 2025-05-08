const express = require('express');
const orderRoutes = express.Router();

orderRoutes.get('/', (req, res) => {
    res.render('products');
});

router.get('/orders/api/all', orderController.getAllOrders);

router.get('/orders/api/:orderId', orderController.getOrderById);

router.put('/orders/api/update/:orderId', orderController.updateOrderStatus);

router.post('/orders/api/refund/:orderId', orderController.issueRefund);



module.exports = orderRoutes;