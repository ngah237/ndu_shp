const express = require('express');
const router = express.Router();
const PromoCode = require('../models/PromoCode');

router.post('/validate', async (req, res) => {
    try {
        const { code, amount } = req.body;
        const promo = await PromoCode.findOne({ code: code.toUpperCase(), isActive: true });
        
        if (!promo) return res.status(404).json({ valid: false, message: 'Code invalide' });
        if (promo.endDate < new Date()) return res.status(400).json({ valid: false, message: 'Code expiré' });
        if (promo.usageLimit && promo.usedCount >= promo.usageLimit) {
            return res.status(400).json({ valid: false, message: 'Code déjà utilisé' });
        }
        if (amount < promo.minOrderAmount) {
            return res.status(400).json({ valid: false, message: `Minimum d'achat: ${promo.minOrderAmount} FCFA` });
        }
        
        let discount = promo.discountType === 'percent' ? (amount * promo.discountValue / 100) : promo.discountValue;
        if (promo.maxDiscount && discount > promo.maxDiscount) discount = promo.maxDiscount;
        
        res.json({ valid: true, discount, promoCode: promo.code });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;