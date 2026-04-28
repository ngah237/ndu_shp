const Favorite = require('../models/Favorite');

exports.getFavorites = async (req, res) => {
    try {
        const favorites = await Favorite.find({ userId: req.user._id }).populate('productId');
        res.json(favorites);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.toggleFavorite = async (req, res) => {
    try {
        const { productId } = req.body;
        
        const existing = await Favorite.findOne({ userId: req.user._id, productId });
        
        if (existing) {
            await Favorite.deleteOne({ _id: existing._id });
            res.json({ message: 'Retiré des favoris', isFavorite: false });
        } else {
            await Favorite.create({ userId: req.user._id, productId });
            res.json({ message: 'Ajouté aux favoris', isFavorite: true });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.checkFavorite = async (req, res) => {
    try {
        const { productId } = req.params;
        const exists = await Favorite.findOne({ userId: req.user._id, productId });
        res.json({ isFavorite: !!exists });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};