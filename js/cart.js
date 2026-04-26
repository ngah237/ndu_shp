// Gestion du panier

let currentCart = null;

async function loadCart() {
    if (!isLoggedIn()) return;
    
    try {
        const cart = await getCart();
        currentCart = cart;
        updateCartCount();
        return cart;
    } catch (error) {
        console.error('Erreur chargement panier:', error);
        return null;
    }
}

function updateCartCount() {
    const cartCountSpan = document.getElementById('cartCount');
    if (!cartCountSpan) return;
    
    if (currentCart && currentCart.items && currentCart.items.length > 0) {
        const totalItems = currentCart.items.reduce((sum, item) => sum + item.quantity, 0);
        cartCountSpan.textContent = totalItems;
        cartCountSpan.classList.remove('hidden');
    } else {
        cartCountSpan.classList.add('hidden');
    }
}

async function addToCartUI(productId, name, price, quantity = 1, size = '', color = '', image = '') {
    if (!isLoggedIn()) {
        showToast('Veuillez vous connecter d\'abord', true);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return false;
    }
    
    try {
        await addToCart(productId, name, price, quantity, size, color, image);
        await loadCart();
        showToast(`${name} ajouté au panier`);
        return true;
    } catch (error) {
        showToast(error.message, true);
        return false;
    }
}

async function updateCartItemQuantity(itemId, quantity) {
    try {
        await updateCartItem(itemId, quantity);
        await loadCart();
        return true;
    } catch (error) {
        showToast(error.message, true);
        return false;
    }
}

async function removeCartItem(itemId) {
    try {
        await removeFromCart(itemId);
        await loadCart();
        showToast('Produit retiré du panier');
        return true;
    } catch (error) {
        showToast(error.message, true);
        return false;
    }
}

// Fonction utilitaire pour afficher les notifications
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    
    toast.textContent = message;
    toast.className = `fixed bottom-4 right-4 z-50 ${isError ? 'bg-red-600' : 'bg-green-600'} text-white px-4 py-2 rounded-lg shadow-lg text-sm toast-slide`;
    toast.classList.remove('hidden');
    
    setTimeout(() => {
        toast.classList.add('hidden');
    }, 3000);
}

// Charger le panier au chargement de la page
document.addEventListener('DOMContentLoaded', () => {
    if (isLoggedIn()) {
        loadCart();
    }
});