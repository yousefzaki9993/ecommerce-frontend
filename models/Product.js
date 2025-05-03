const pool = require('../config/db');

class Product {

    static async getAllProducts() {
        const [products] = await pool.query('SELECT * FROM products');
        return products;
    }
}

module.exports = Product;