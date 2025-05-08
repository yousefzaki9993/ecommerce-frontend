const express = require('express');
const productRoutes = express.Router();
const ProductController = require('../controllers/ProductController');

productRoutes.get('/', ProductController.renderProducts);
productRoutes.get('/api/all', ProductController.apiGetProducts);
productRoutes.get('/api/related/:id', ProductController.apiGetRelatedProducts);
productRoutes.get('/api/reviews/:id', ProductController.apiGetRelatedReviews);
productRoutes.get('/:id', ProductController.renderProductsDetails);
productRoutes.post('/review', ProductController.addReview);

productRoutes.post('/api/add', ProductController.addProduct);
productRoutes.put('/api/edit/:productId', ProductController.updateProduct);
productRoutes.delete('/api/delete/:productId', ProductController.deleteProduct);

module.exports = productRoutes;