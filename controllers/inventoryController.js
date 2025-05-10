const Product = require('../models/Product');


exports.getAllProductsWithStats = async (req, res) => {
    try {
        const products = await Product.getAllProducts().lean();
        
        const inventoryStats = {
            lowStock: { count: 0, items: [], threshold: 10 },
            normalStock: { count: 0, items: [], min: 10, max: 50 },
            highStock: { count: 0, items: [], threshold: 50 },
            outOfStock: { count: 0, items: [] }
        };

        products.forEach(product => {
            if (product.stock_quantity <= 0) {
                inventoryStats.outOfStock.count++;
                inventoryStats.outOfStock.items.push(product);
            } else if (product.stock_quantity < inventoryStats.lowStock.threshold) {
                inventoryStats.lowStock.count++;
                inventoryStats.lowStock.items.push(product);
            } else if (product.stock_quantity > inventoryStats.highStock.threshold) {
                inventoryStats.highStock.count++;
                inventoryStats.highStock.items.push(product);
            } else {
                inventoryStats.normalStock.count++;
                inventoryStats.normalStock.items.push(product);
            }
        });

        res.json({
            success: true,
            stats: {
                totalProducts: products.length,
                ...inventoryStats
            },
            products
        });

    } catch (error) {
        console.error('Error in getAllProductsWithStats:', error);
        res.status(500).json({ 
            success: false,
            message: 'Failed to fetch inventory data'
        });
    }
};

