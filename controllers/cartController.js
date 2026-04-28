const Cart = require('../models/Cart');

exports.getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.addToCart = async (req, res) => {
    try {
        const { productId, name, price, quantity, size, color, image } = req.body;
        
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = await Cart.create({ userId: req.user._id, items: [] });
        }
        
        const existingItem = cart.items.find(item => 
            item.productId.toString() === productId && item.size === size && item.color === color
        );
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ productId, name, price, quantity, size, color, image });
        }
        
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.updateCartItem = async (req, res) => {
    try {
        const { itemId } = req.params;
        const { quantity } = req.body;
        
        const cart = await Cart.findOne({ userId: req.user._id });
        const item = cart.items.id(itemId);
        if (item) {
            item.quantity = quantity;
            await cart.save();
        }
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.removeFromCart = async (req, res) => {
    try {
        const { itemId } = req.params;
        const cart = await Cart.findOne({ userId: req.user._id });
        cart.items.pull({ _id: itemId });
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user._id });
        cart.items = [];
        await cart.save();
        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};