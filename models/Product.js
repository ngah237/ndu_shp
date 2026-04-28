const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    oldPrice: { type: Number, default: null },
    description: { type: String, required: true },
    category: { type: String, enum: ['homme', 'femme', 'enfant', 'accessoires', 'chaussures', 'lingerie'], required: true },
    subcategory: { type: String, default: '' },
    gender: { type: String, enum: ['homme', 'femme', 'mixte', 'enfant'], default: 'mixte' },
    sizes: [{ type: String }],
    colors: [{ type: String }],
    image: { type: String, required: true },
    images: [{ type: String }],
    stock: { type: Number, default: 0 },
    isNew: { type: Boolean, default: false },
    isPromo: { type: Boolean, default: false },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Product', productSchema);