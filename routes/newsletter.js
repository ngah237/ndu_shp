const express = require('express');
const router = express.Router();

let subscribers = [];

router.post('/subscribe', (req, res) => {
    const { email } = req.body;
    
    if (!email || !email.includes('@')) {
        return res.status(400).json({ message: 'Email invalide' });
    }
    
    if (subscribers.includes(email)) {
        return res.status(400).json({ message: 'Cet email est déjà abonné' });
    }
    
    subscribers.push(email);
    res.json({ message: 'Abonnement réussi !' });
});

router.get('/subscribers', (req, res) => {
    res.json({ subscribers });
});

module.exports = router;
