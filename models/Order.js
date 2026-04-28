const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        name: String,
        price: Number,
        quantity: Number,
        size: String,
        color: String,
        image: String
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['orange', 'mtn', 'carte'], required: true },
    phone: { type: String, required: true },
    deliveryAddress: { type: String, required: true },
    status: { type: String, enum: ['pending', 'paid', 'shipped', 'delivered', 'cancelled'], default: 'pending' },
    orderNumber: { type: String, unique: true },
    createdAt: { type: Date, default: Date.now }
});

orderSchema.pre('save', async function(next) {
    if (!this.orderNumber) {
        this.orderNumber = 'CMD-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);