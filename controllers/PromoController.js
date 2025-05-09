const PromoCode = require('../models/PromoCode');
const Cart = require('../models/Cart');

exports.applyPromoCode = async (req, res) => {
    try {
        const { promoCode } = req.body;
        const cartId = req.session.cartId;

        if (!promoCode) {
            return res.status(400).json({ success: false, message: 'Promo code is required' });
        }

        const promo = await PromoCode.findByCode(promoCode.trim().toUpperCase());

        if (!promo) {
            return res.status(404).json({ success: false, message: 'Invalid or expired promo code' });
        }

        let cartTotal = await Cart.getTotalPrice(cartId);
        let discount = 0;

        if (promo.type === 'percent') {
            discount = (promo.value / 100) * cartTotal;
        } else if (promo.type === 'fixed') {
            discount = promo.value;
        }

        const newTotal = Math.max(cartTotal - discount, 0);

        // Store promo code session-wise (optional)
        req.session.promoCode = promo.code;
        req.session.discount = discount;

        res.json({
            success: true,
            promoCode: promo.code,
            discount: discount.toFixed(2),
            newTotal: newTotal.toFixed(2)
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};