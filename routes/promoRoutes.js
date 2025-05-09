const express = require('express');
const router = express.Router();
const promoController = require('../controllers/PromoController');

router.post('/apply', promoController.applyPromoCode);

module.exports = router;