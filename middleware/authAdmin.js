const User = require('../models/User');

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findById(req.user._id);
        if (user.role !== 'admin') {
            return res.status(403).json({ message: 'Accès réservé aux administrateurs' });
        }
        next();
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { isAdmin };