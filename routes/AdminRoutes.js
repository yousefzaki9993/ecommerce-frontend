const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/adminController');

router.get('/inventory', AdminController.renderInventory);
router.get('/orders', AdminController.renderOrders);
router.get('/products', AdminController.renderProducts);



module.exports = router;
