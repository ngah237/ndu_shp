const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();

app.use(cors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/favorites', require('./routes/favorites'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));
app.use('/api/newsletter', require('./routes/newsletter'));

app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'API e-commerce fonctionnelle' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
// Route racine
app.get('/', (req, res) => {
    res.json({ 
        message: 'Bienvenue sur l\'API ModeStyle',
        documentation: '/api/health',
        endpoints: {
            products: '/api/products',
            auth: '/api/auth',
            cart: '/api/cart',
            orders: '/api/orders'
        }
    });
});
