const db = require('../config/db');

class Order {
  // Get all orders with optional filters
  static async getAll(filters = {}) {
    try {
      let query = `
        SELECT 
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.payment_method,
          o.created_at,
          u.email
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        WHERE 1=1
      `;
      
      const params = [];
  
      if (filters.status) {
        query += ' AND o.status = ?';
        params.push(filters.status);
      }
  
      if (filters.from) {
        query += ' AND DATE(o.created_at) >= ?';
        params.push(filters.from);
      }
  
      if (filters.to) {
        query += ' AND DATE(o.created_at) <= ?';
        params.push(filters.to);
      }
  
      query += ' ORDER BY o.created_at DESC';
  
      const [orders] = await db.execute(query, params);
      return orders;
    } catch (error) {
      console.error('Error fetching orders:', error);
      throw error;
    }
  }

  
  // Get order by ID with full details
  static async getById(orderId) {
    try {
      // Get basic order info
      const [orderRows] = await db.execute(`
        SELECT 
          o.order_id,
          o.user_id,
          o.total_amount,
          o.status,
          o.shipping_address,
          o.payment_method,
          o.created_at,
          u.username,
          u.email,
          u.phone
        FROM orders o
        JOIN users u ON o.user_id = u.user_id
        WHERE o.order_id = ?
      `, [orderId]);

      if (orderRows.length === 0) return null;

      const order = orderRows[0];

      // Get order items
      const [items] = await db.execute(`
        SELECT 
          oi.order_item_id,
          oi.product_id,
          p.name AS product_name,
          oi.price,
          oi.quantity,
          p.image_url
        FROM order_items oi
        JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `, [orderId]);

      order.items = items;
      
      return order;
    } catch (error) {
      console.error('Error fetching order details:', error);
      throw error;
    }
  }

  // Update order status
  static async updateStatus(orderId, status) {
    try {
      // Validate status
      const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new Error('Invalid order status');
      }

      const [result] = await db.execute(
        'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE order_id = ?',
        [status, orderId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }
}

module.exports = Order;