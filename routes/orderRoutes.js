const express = require('express');
const orderRoutes = express.Router();

const AdminController = require('../controllers/adminController');


orderRoutes.get('/', (req, res) => {
    res.render('products');
});

orderRoutes.get('/api/all', AdminController.getAllOrders);
orderRoutes.get('/api/:id', AdminController.getOrderDetails);
orderRoutes.put('/api/:id/status', AdminController.updateOrderStatus);



module.exports = orderRoutes;