const Product = require('../models/Product');
const Order = require('../models/Order');
const User = require('../models/User');
const PromoCode = require('../models/PromoCode');

// Dashboard stats
async function getStats(req, res) {
    try {
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalUsers = await User.countDocuments();
        const totalRevenue = await Order.aggregate([
            { $match: { status: 'paid' } },
            { $group: { _id: null, total: { $sum: '$totalAmount' } } }
        ]);
        
        const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(10);
        
        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            totalRevenue: totalRevenue[0]?.total || 0,
            recentOrders
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gestion produits
async function addProduct(req, res) {
    try {
        const product = await Product.create(req.body);
        res.status(201).json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateProduct(req, res) {
    try {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deleteProduct(req, res) {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.json({ message: 'Produit supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gestion commandes
async function getAllOrders(req, res) {
    try {
        const orders = await Order.find().sort({ createdAt: -1 }).populate('userId', 'name email');
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function updateOrderStatus(req, res) {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        
        // Envoyer email de mise à jour
        const user = await User.findById(order.userId);
        await sendEmail(user.email, `Mise à jour commande ${order.orderNumber}`, `<h1>Votre commande est maintenant ${order.status}</h1>`);
        
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gestion utilisateurs
async function getAllUsers(req, res) {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// Gestion codes promo
async function addPromoCode(req, res) {
    try {
        const promo = await PromoCode.create(req.body);
        res.status(201).json(promo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getPromoCodes(req, res) {
    try {
        const promos = await PromoCode.find();
        res.json(promos);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function deletePromoCode(req, res) {
    try {
        await PromoCode.findByIdAndDelete(req.params.id);
        res.json({ message: 'Code promo supprimé' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = {
    getStats,
    addProduct,
    updateProduct,
    deleteProduct,
    getAllOrders,
    updateOrderStatus,
    getAllUsers,
    addPromoCode,
    getPromoCodes,
    deletePromoCode
};