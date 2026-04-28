const Product = require('../models/Product');

async function checkStock(productId, quantity) {
    const product = await Product.findById(productId);
    if (!product) return { available: false, message: 'Produit non trouvé' };
    if (product.stock < quantity) {
        return { available: false, message: `Stock insuffisant. Plus que ${product.stock} disponible(s).` };
    }
    return { available: true, product };
}

async function updateStock(productId, quantity, operation = 'decrease') {
    const product = await Product.findById(productId);
    if (operation === 'decrease') {
        product.stock -= quantity;
    } else {
        product.stock += quantity;
    }
    await product.save();
    return product;
}

module.exports = { checkStock, updateStock };