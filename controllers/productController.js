const Product = require('../models/Product');

exports.getAllProducts = async (req, res) => {
    try {
        const { category, search, limit = 50 } = req.query;
        let query = {};
        
        if (category) query.category = category;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }
        
        const products = await Product.find(query).limit(parseInt(limit));
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: 'Produit non trouvé' });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getNewProducts = async (req, res) => {
    try {
        const products = await Product.find({ isNew: true }).limit(12);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getPromoProducts = async (req, res) => {
    try {
        const products = await Product.find({ isPromo: true }).limit(12);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getProductsByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const products = await Product.find({ category });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};