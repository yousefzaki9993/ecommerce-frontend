const pool = require('../config/db');

class CartItem {
    static async getByCartId(cartId) {
        const [items] = await pool.query(
            `SELECT ci.*, p.name, p.price, p.image 
            FROM cart_items ci
            JOIN products p ON ci.product_id = p.product_id
            WHERE cart_id = ?`,
            [cartId]
        );
        return items;
    }

    static async addItem(cartId, productId, quantity) {
        await pool.query(
            `INSERT INTO cart_items (cart_id, product_id, quantity)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE quantity = quantity + VALUES(quantity)`,
            [cartId, productId, quantity]
        );
    }

    static async checkItem(cartId, productId) {
        const [rows] = await pool.query(
            `SELECT 1 FROM cart_items WHERE cart_id = ? AND product_id = ? LIMIT 1`,
            [cartId, productId]
        );
        return rows.length > 0;
    }
    

    static async removeItem(cartItemId) {
        await pool.query(
            'DELETE FROM cart_items WHERE cart_item_id = ?',
            [cartItemId]
        );
    }

    static async removeAll(cartId) {
        await pool.query(
            'DELETE FROM cart_items WHERE cart_id = ?',
            [cartId]
        );
    }

    static async getCount(cartId) {
        const [rows] = await pool.query(
            `SELECT COUNT(*) AS total FROM cart_items WHERE cart_id = ?`,
            [cartId]
        );
        
        return rows[0].total || 0;
    }
    
    
    
}

module.exports = CartItem;