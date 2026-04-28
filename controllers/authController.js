const User = require('../models/User');
const Cart = require('../models/Cart');
const generateToken = require('../utils/generateToken');

exports.register = async (req, res) => {
    try {
        const { name, email, password, phone } = req.body;
        
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Cet email est déjà utilisé' });
        }
        
        const user = await User.create({ name, email, password, phone });
        
        // Créer un panier vide pour l'utilisateur
        await Cart.create({ userId: user._id, items: [] });
        
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            role: user.role || 'user',
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ message: 'Email ou mot de passe incorrect' });
        }
        
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role || 'user',  // ← AJOUT DE CETTE LIGNE
            token: generateToken(user._id)
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMe = async (req, res) => {
    res.json(req.user);
};

exports.updateProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.name = req.body.name || user.name;
        user.phone = req.body.phone || user.phone;
        if (req.body.address) user.address = req.body.address;
        if (req.body.password) user.password = req.body.password;
        
        await user.save();
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            address: user.address,
            role: user.role
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};