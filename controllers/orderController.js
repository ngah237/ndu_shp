const Order = require('../models/Order');
const Cart = require('../models/Cart');

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, paymentMethod, phone, deliveryAddress } = req.body;
        
        const order = await Order.create({
            userId: req.user._id,
            items,
            totalAmount,
            paymentMethod,
            phone,
            deliveryAddress,
            status: 'pending'
        });
        
        // Vider le panier après commande
        await Cart.findOneAndUpdate({ userId: req.user._id }, { items: [] });
        
        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findOne({ _id: req.params.id, userId: req.user._id });
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};