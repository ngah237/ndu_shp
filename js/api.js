// Configuration API
const API_URL = 'http://localhost:5000/api';

// Récupérer le token du localStorage
function getToken() {
    const user = JSON.parse(localStorage.getItem('user'));
    return user ? user.token : null;
}

// Headers pour les requêtes authentifiées
function getHeaders() {
    const headers = {
        'Content-Type': 'application/json'
    };
    const token = getToken();
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    return headers;
}

// Requête API générique
async function apiRequest(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: getHeaders()
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message || 'Une erreur est survenue');
        }
        
        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Produits
async function getProducts(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = `/products${queryString ? '?' + queryString : ''}`;
    return await apiRequest(endpoint);
}

async function getProductById(id) {
    return await apiRequest(`/products/${id}`);
}

async function getProductsByCategory(category) {
    return await apiRequest(`/products/category/${category}`);
}

async function getNewProducts() {
    return await apiRequest('/products/new');
}

async function getPromoProducts() {
    return await apiRequest('/products/promo');
}

// Panier
async function getCart() {
    return await apiRequest('/cart');
}

async function addToCart(productId, name, price, quantity, size, color, image) {
    return await apiRequest('/cart/add', 'POST', { productId, name, price, quantity, size, color, image });
}

async function updateCartItem(itemId, quantity) {
    return await apiRequest(`/cart/item/${itemId}`, 'PUT', { quantity });
}

async function removeFromCart(itemId) {
    return await apiRequest(`/cart/item/${itemId}`, 'DELETE');
}

async function clearCart() {
    return await apiRequest('/cart/clear', 'DELETE');
}

// Favoris
async function getFavorites() {
    return await apiRequest('/favorites');
}

async function toggleFavorite(productId) {
    return await apiRequest('/favorites/toggle', 'POST', { productId });
}

async function checkFavorite(productId) {
    return await apiRequest(`/favorites/check/${productId}`);
}

// Commandes
async function createOrder(orderData) {
    return await apiRequest('/orders', 'POST', orderData);
}

async function getUserOrders() {
    return await apiRequest('/orders');
}

async function getOrderById(orderId) {
    return await apiRequest(`/orders/${orderId}`);
}

// Newsletter
async function subscribeNewsletter(email) {
    return await apiRequest('/newsletter/subscribe', 'POST', { email });
}

// Auth
async function register(userData) {
    return await apiRequest('/auth/register', 'POST', userData);
}

async function login(credentials) {
    return await apiRequest('/auth/login', 'POST', credentials);
}

async function getCurrentUser() {
    return await apiRequest('/auth/me');
}

async function updateProfile(profileData) {
    return await apiRequest('/auth/profile', 'PUT', profileData);
}