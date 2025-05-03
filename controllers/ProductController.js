const Product = require('../models/Product');

// For API usage
exports.apiGetProducts = async (req, res) => {
    const products = await Product.getAllProducts();
    res.json(products);
};

// For rendering view
exports.renderProducts = (req, res, next) => {
    try {
        res.render('products');
    } catch (error) {
        next(error);
    }
};