const Newsletter = require('../models/Newsletter');

exports.subscribe = async (req, res) => {
    try {
        const { email } = req.body;
        
        const exists = await Newsletter.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Cet email est déjà abonné' });
        }
        
        await Newsletter.create({ email });
        res.json({ message: 'Abonnement réussi !' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};