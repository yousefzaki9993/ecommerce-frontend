const express = require('express');
const orderRoutes = express.Router();

orderRoutes.get('/', (req, res) => {
    res.render('products');
});

module.exports = orderRoutes;