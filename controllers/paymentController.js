const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { sendEmail } = require('../utils/sendEmail');
const { generateInvoiceHTML } = require('../utils/generateInvoice');
const { checkStock, updateStock } = require('./stockController');

// Simulation paiement Orange Money / MTN
async function processPayment(req, res) {
    try {
        const { orderId, paymentMethod, phone } = req.body;
        
        const order = await Order.findById(orderId);
        if (!order) return res.status(404).json({ message: 'Commande non trouvée' });
        
        // Vérification des stocks avant paiement
        for (const item of order.items) {
            const stockCheck = await checkStock(item.productId, item.quantity);
            if (!stockCheck.available) {
                return res.status(400).json({ message: stockCheck.message });
            }
        }
        
        // Simulation paiement (à remplacer par API réelle)
        const paymentSuccess = true;
        
        if (paymentSuccess) {
            // Mettre à jour les stocks
            for (const item of order.items) {
                await updateStock(item.productId, item.quantity, 'decrease');
            }
            
            order.status = 'paid';
            order.paymentMethod = paymentMethod;
            order.phone = phone;
            await order.save();
            
            // Vider le panier
            await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });
            
            // Envoyer email de confirmation
            const user = await User.findById(order.userId);
            const invoiceHTML = generateInvoiceHTML(order, user);
            await sendEmail(user.email, `Confirmation commande ${order.orderNumber}`, invoiceHTML);
            
            res.json({ success: true, order, message: 'Paiement effectué avec succès' });
        } else {
            res.status(400).json({ message: 'Échec du paiement' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { processPayment };