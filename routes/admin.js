const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect } = require('../middleware/auth');
const { isAdmin } = require('../middleware/authAdmin');

router.use(protect);
router.use(isAdmin);

router.get('/stats', adminController.getStats);
router.get('/orders', adminController.getAllOrders);
router.put('/orders/:id', adminController.updateOrderStatus);
router.get('/users', adminController.getAllUsers);
router.post('/products', adminController.addProduct);
router.put('/products/:id', adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);
router.get('/promocodes', adminController.getPromoCodes);
router.post('/promocodes', adminController.addPromoCode);
router.delete('/promocodes/:id', adminController.deletePromoCode);

module.exports = router;