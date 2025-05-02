const express = require('express');
const productRoutes = express.Router();
const ProductController = require('../controllers/ProductController');

productRoutes.get('/', async (req, res) => {
    try {
        res.render('products');
    } catch (err) {
        console.log(error);
    }
});

productRoutes.get('/api/all', async (req, res) => {
    try {
        const products = await ProductController.apiGetProductsData();
        res.json(products);
    } catch (err) {
        console.log(err);
    }
});

module.exports = productRoutes;