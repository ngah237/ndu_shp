const mongoose = require('mongoose');
const Product = require('./models/Product');

const MONGODB_URI = 'mongodb://127.0.0.1:27017/ecommerce_db';

const products = [
    { name: "T-shirt homme", price: 10000, oldPrice: null, description: "T-shirt en coton 100% bio", category: "homme", gender: "homme", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400", sizes: ["S","M","L","XL"], colors: ["Blanc","Noir","Bleu"], stock: 50, isNew: true, isPromo: false },
    { name: "Robe femme élégante", price: 18000, oldPrice: 25000, description: "Robe longue en mousseline", category: "femme", gender: "femme", image: "https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400", sizes: ["XS","S","M","L"], colors: ["Rouge","Noir","Bleu"], stock: 20, isNew: true, isPromo: true },
    { name: "Basket running homme", price: 25000, oldPrice: 35000, description: "Baskets de running légères", category: "chaussures", gender: "homme", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400", sizes: ["39","40","41","42","43","44"], colors: ["Noir/Blanc","Bleu","Rouge"], stock: 30, isNew: true, isPromo: true },
    { name: "Montre connectée", price: 45000, oldPrice: 60000, description: "Montre connectée avec GPS", category: "accessoires", gender: "mixte", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400", colors: ["Noir","Argent","Or rose"], stock: 15, isNew: true, isPromo: true },
    { name: "Jean slim femme", price: 15000, oldPrice: null, description: "Jean slim stretch confortable", category: "femme", gender: "femme", image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400", sizes: ["34","36","38","40","42"], colors: ["Bleu clair","Bleu foncé","Noir"], stock: 45, isNew: false, isPromo: false }
];

async function importData() {
    try {
        console.log('🔄 Connexion à MongoDB...');
        await mongoose.connect(MONGODB_URI, {
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000
        });
        console.log('✅ Connecté à MongoDB');
        
        console.log('🗑️ Suppression des anciens produits...');
        await Product.deleteMany({});
        
        console.log('📦 Importation des nouveaux produits...');
        const result = await Product.insertMany(products);
        
        console.log(`✅ ${result.length} produits importés avec succès !`);
        console.log('📋 Liste des produits:');
        result.forEach(p => console.log(`   - ${p.name} (${p.price} FCFA)`));
        
        await mongoose.disconnect();
        console.log('🔌 Déconnecté de MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur détaillée:', error);
        process.exit(1);
    }
}

importData();
