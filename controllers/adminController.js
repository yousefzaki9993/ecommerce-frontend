const Product = require('../models/Product'); 



exports.renderInventory = async (req, res, next) => {
    try {
        const inventory = await Product.getAllProducts(); 
        res.render('admin/inventory');  
    } catch (error) {
        next(error);
    }
};


exports.renderOrders = async (req, res, next) => {
    try {
        const orders = await Product.getOrders();  
        res.render('admin/orders', { orders: orders });
    } catch (error) {
        next(error);
    }
};


exports.renderProducts = async (req, res, next) => {
    try {
        const products = await Product.getAllProducts(); 
        res.render('admin/products', { products: products });
    } catch (error) {
        next(error);
    }
};
