const express = require('express');
const productRoutes = express.Router();
const ProductController = require('../controllers/ProductController');
const verifyAdmin = require('../middlewares/auth').verifyAdmin;


productRoutes.get('/', ProductController.renderProducts);
productRoutes.get('/api/all',ProductController.apiGetProducts);
productRoutes.get('/api/related/:id', ProductController.apiGetRelatedProducts);
productRoutes.get('/api/reviews/:id', ProductController.apiGetRelatedReviews);
productRoutes.get('/:id', ProductController.renderProductsDetails);
productRoutes.post('/review', ProductController.addReview);

productRoutes.post('/api/add', verifyAdmin, ProductController.addProduct);
productRoutes.post('/api/edit/:productId', verifyAdmin,ProductController.updateProduct);
productRoutes.delete('/api/delete/:productId', verifyAdmin,ProductController.deleteProduct);
productRoutes.get('/api/get/:productId', ProductController.getProductById);

productRoutes.put('/:productId/restock', verifyAdmin, ProductController.restockProduct);

module.exports = productRoutes;