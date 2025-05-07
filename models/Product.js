const pool = require('../config/db');

class Product {

    static async getAllProducts() {
        const [products] = await pool.query('SELECT * FROM products');
        return products;
    }

    static async getRelatedProducts(id) {
        const [category] = await pool.query('SELECT category FROM products where product_id=?', id);
        const [products] = await pool.query('SELECT * FROM products where category=? and product_id!=?', [category[0].category, id]);
        return products;
    }

    static async getRelatedReviews(id) {
        const [reviews] = await pool.query('SELECT * FROM reviews where product_id=?', id);
        return reviews;
    }

    static async getProductDetails(id) {
        const [product] = await pool.query('SELECT * FROM products where product_id=?', id);
        return product[0];
    }

    static async addReview({ productId, userId, rating, title, review }) {
        const connection = await pool.getConnection();
        await connection.beginTransaction();
        await connection.execute(
            `INSERT INTO reviews (product_id, user_id, rating, title, comment) 
             VALUES (?, ?, ?, ?, ?)`,
            [productId, userId, rating, title, review]
        );

        await connection.execute(
            `UPDATE products 
             SET 
               rating = (SELECT AVG(rating) FROM reviews WHERE product_id = ?),
               reviews = reviews + 1
             WHERE product_id = ?`,
            [productId, productId]
        );

        await connection.commit();
        connection.release();

    }
}

module.exports = Product;