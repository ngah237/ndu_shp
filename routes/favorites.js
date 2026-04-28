const express = require('express');
const router = express.Router();
const favoriteController = require('../controllers/favoriteController');
const { protect } = require('../middleware/auth');

router.use(protect);
router.get('/', favoriteController.getFavorites);
router.post('/toggle', favoriteController.toggleFavorite);
router.get('/check/:productId', favoriteController.checkFavorite);

module.exports = router;