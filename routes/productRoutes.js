const express = require('express');
const productRoutes = express.Router();
const ProductController = require('../controllers/ProductController');

productRoutes.get('/', ProductController.renderProducts);
productRoutes.get('/api/all', ProductController.apiGetProducts);

module.exports = productRoutes;