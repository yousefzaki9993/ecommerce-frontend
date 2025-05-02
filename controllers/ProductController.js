const Product = require('../models/Product');

// For API usage (e.g., /api/products)
exports.apiGetProducts = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts();
        res.json(products);
    } catch (err) {
        console.log(err);
    }
};

// For rendering view
exports.apiGetProductsData = async () => {
    return await Product.getAllProducts();
};