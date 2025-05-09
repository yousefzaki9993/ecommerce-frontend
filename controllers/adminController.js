const Order = require('../models/Order');
const Product = require('../models/Product'); 



exports.renderInventory = async (req, res, next) => {
    try {
        const inventory = await Product.getAllProducts(); 
        res.render('admin/inventory');  
    } catch (error) {
        next(error);
    }
};


exports.getAllOrders = async (req, res) => {
    try {
      const filters = {
        status: req.query.status || '',
        from: req.query.from || '',
        to: req.query.to || ''
      };
      
      const orders = await Order.getAll(filters);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  


exports.renderOrders = async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        from: req.query.from,
        to: req.query.to
      };
  
      const orders = await Order.getAll(filters);
      res.render('admin/orders', { orders: orders });
    } catch (error) {
      console.error('Error in getAllOrders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.getOrderDetails = async (req, res) => {
    try {
      const order = await Order.getById(req.params.id);
      
      if (!order) {
        return res.status(404).json({ error: 'Order not found' });
      }
  
      res.json(order);
    } catch (error) {
      console.error('Error in getOrderDetails:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  
  exports.updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const { id } = req.params;

        // Validate input
        if (!status || !id) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        const result = await Order.updateStatus(id, status);

        if (!result.updated) {
            return res.status(200).json({ 
                success: true,
                message: result.message || 'Order status updated successfully',
                statusChanged: false
            });
        }

        res.json({ 
            success: true,
            message: 'Order status updated successfully',
            statusChanged: true,
            oldStatus: result.oldStatus,
            newStatus: result.newStatus
        });
    } catch (error) {
        console.error('Error in updateOrderStatus:', error);
        
        const statusCode = error.message.includes('not found') ? 404 : 
                          error.message.includes('Invalid') ? 400 : 500;
        
        res.status(statusCode).json({ 
            error: error.message,
            success: false
        });
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
