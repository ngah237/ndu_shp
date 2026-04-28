const fs = require('fs');
const path = require('path');

function generateInvoiceHTML(order, user) {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Facture ${order.orderNumber}</title>
            <style>
                body { font-family: Arial, sans-serif; padding: 20px; }
                .header { text-align: center; border-bottom: 2px solid #4CAF50; padding-bottom: 20px; }
                .invoice-title { font-size: 24px; color: #4CAF50; }
                .info { margin: 20px 0; }
                table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                th, td { border: 1px solid #ddd; padding: 10px; text-align: left; }
                th { background: #4CAF50; color: white; }
                .total { font-size: 18px; font-weight: bold; text-align: right; margin-top: 20px; }
                .footer { text-align: center; margin-top: 40px; font-size: 12px; color: gray; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1 class="invoice-title">ModeStyle</h1>
                <p>Ngaoundéré, Cameroun | Tel: +237 6 95 76 79 26</p>
            </div>
            <div class="info">
                <p><strong>Facture N°:</strong> ${order.orderNumber}</p>
                <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString()}</p>
                <p><strong>Client:</strong> ${user.name}</p>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Téléphone:</strong> ${order.phone}</p>
                <p><strong>Adresse livraison:</strong> ${order.deliveryAddress}</p>
            </div>
            <table>
                <thead>
                    <tr><th>Produit</th><th>Prix unitaire</th><th>Quantité</th><th>Total</th></tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr><td>${item.name}</td><td>${item.price.toLocaleString()} FCFA</td><td>${item.quantity}</td><td>${(item.price * item.quantity).toLocaleString()} FCFA</td></tr>
                    `).join('')}
                </tbody>
            </table>
            <div class="total">
                <p>Total TTC: ${order.totalAmount.toLocaleString()} FCFA</p>
            </div>
            <div class="footer">
                <p>Merci de votre confiance ! Livraison sous 3-5 jours ouvrés.</p>
            </div>
        </body>
        </html>
    `;
}

module.exports = { generateInvoiceHTML };