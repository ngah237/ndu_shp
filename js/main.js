// Script principal pour la page d'accueil

let allProducts = [];

// Slider
function initSlider() {
    const slides = document.querySelectorAll('.slider-img');
    if (!slides.length) return;
    
    let currentSlide = 0;
    let interval;
    
    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.style.opacity = i === index ? '1' : '0';
        });
    }
    
    function nextSlide() {
        currentSlide = (currentSlide + 1) % slides.length;
        showSlide(currentSlide);
    }
    
    function prevSlide() {
        currentSlide = (currentSlide - 1 + slides.length) % slides.length;
        showSlide(currentSlide);
    }
    
    interval = setInterval(nextSlide, 4000);
    
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            clearInterval(interval);
            prevSlide();
            interval = setInterval(nextSlide, 4000);
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            clearInterval(interval);
            nextSlide();
            interval = setInterval(nextSlide, 4000);
        });
    }
}

// Afficher les produits
function renderProducts(containerId, products, limit = 5) {
    const container = document.getElementById(containerId);
    if (!container) return;
    
    const productsToShow = products.slice(0, limit);
    
    if (productsToShow.length === 0) {
        container.innerHTML = '<p class="col-span-full text-center text-gray-500">Aucun produit disponible</p>';
        return;
    }
    
    container.innerHTML = productsToShow.map(product => `
        <div class="product-card bg-white rounded-lg shadow-md overflow-hidden group">
            <a href="pages/product-details.html?id=${product._id}">
                <img src="${product.image}" alt="${product.name}" class="w-full h-40 md:h-48 object-cover group-hover:scale-105 transition duration-300">
            </a>
            <div class="p-3">
                <h3 class="font-semibold text-gray-800 text-sm md:text-base truncate">${product.name}</h3>
                <div class="flex items-center gap-2 mt-1">
                    ${product.oldPrice ? `<span class="text-gray-400 line-through text-xs">${product.oldPrice.toLocaleString()} FCFA</span>` : ''}
                    <p class="text-green-600 font-bold text-sm md:text-base">${product.price.toLocaleString()} FCFA</p>
                </div>
                ${product.isPromo ? '<span class="inline-block bg-red-500 text-white text-xs px-2 py-0.5 rounded-full mt-1">Promo</span>' : ''}
                <div class="flex gap-2 mt-3">
                    <button onclick="addToCartUI('${product._id}', '${product.name}', ${product.price}, 1, '', '', '${product.image}')" 
                            class="flex-1 bg-green-600 text-white py-1.5 rounded-lg hover:bg-green-700 transition text-xs md:text-sm">
                        <i class="fas fa-shopping-cart"></i> Acheter
                    </button>
                    <button onclick="toggleFavoriteUI('${product._id}', this)" 
                            class="favorite-btn text-gray-400 hover:text-red-500 p-1.5 border rounded-lg">
                        <i class="far fa-heart"></i>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

// Gestion des favoris dans l'UI
async function toggleFavoriteUI(productId, btnElement) {
    if (!isLoggedIn()) {
        showToast('Veuillez vous connecter pour ajouter aux favoris', true);
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 1500);
        return;
    }
    
    try {
        const result = await toggleFavorite(productId);
        const icon = btnElement.querySelector('i');
        if (result.isFavorite) {
            icon.classList.remove('far');
            icon.classList.add('fas');
            btnElement.classList.add('text-red-500');
            showToast('Ajouté aux favoris');
        } else {
            icon.classList.remove('fas');
            icon.classList.add('far');
            btnElement.classList.remove('text-red-500');
            showToast('Retiré des favoris');
        }
        updateFavCount();
    } catch (error) {
        showToast(error.message, true);
    }
}

// Mettre à jour le compteur de favoris
async function updateFavCount() {
    if (!isLoggedIn()) {
        const favCount = document.getElementById('favCount');
        if (favCount) favCount.classList.add('hidden');
        return;
    }
    
    try {
        const favorites = await getFavorites();
        const count = favorites.length;
        const favCount = document.getElementById('favCount');
        if (favCount) {
            favCount.textContent = count;
            favCount.classList.toggle('hidden', count === 0);
        }
    } catch (error) {
        console.error('Erreur chargement favoris:', error);
    }
}

// Charger tous les produits
async function loadAllProducts() {
    try {
        const products = await getProducts();
        allProducts = products;
        
        // Filtrer par catégorie
        const hommeProducts = products.filter(p => p.category === 'homme');
        const femmeProducts = products.filter(p => p.category === 'femme');
        const promoProducts = products.filter(p => p.isPromo);
        const newProducts = products.filter(p => p.isNew);
        
        renderProducts('productsHomme', hommeProducts, 5);
        renderProducts('productsFemme', femmeProducts, 5);
        renderProducts('productsPromo', promoProducts, 5);
        renderProducts('productsNew', newProducts, 5);
        
    } catch (error) {
        console.error('Erreur chargement produits:', error);
        document.querySelectorAll('[id^="products"]').forEach(container => {
            if (container) {
                container.innerHTML = '<p class="col-span-full text-center text-red-500">Erreur de chargement des produits</p>';
            }
        });
    }
}

// Newsletter
window.subscribeNewsletter = async function() {
    const email = document.getElementById('newsletterEmail').value;
    if (!email || !email.includes('@')) {
        showToast('Veuillez entrer un email valide', true);
        return;
    }
    
    try {
        await subscribeNewsletter(email);
        showToast('✅ Merci pour votre abonnement !');
        document.getElementById('newsletterEmail').value = '';
    } catch (error) {
        showToast(error.message, true);
    }
};

// Recherche
function setupSearch() {
    const searchInput = document.getElementById('searchInput');
    const mobileSearch = document.getElementById('mobileSearch');
    
    if (!searchInput && !mobileSearch) return;
    
    const handleSearch = (value) => {
        const query = value.toLowerCase();
        const productCards = document.querySelectorAll('.product-card');
        
        productCards.forEach(card => {
            const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
            card.style.display = title.includes(query) ? 'block' : 'none';
        });
    };
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => handleSearch(e.target.value));
    }
    if (mobileSearch) {
        mobileSearch.addEventListener('input', (e) => handleSearch(e.target.value));
    }
}

// Menu mobile
function setupMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }
}

// Mettre à jour le message de bienvenue
function updateWelcomeMessage() {
    const user = getCurrentUser();
    const welcomeMsg = document.getElementById('welcomeMsg');
    if (welcomeMsg) {
        if (user) {
            welcomeMsg.innerHTML = `Bon retour, <strong>${user.name}</strong> ! <i class="fas fa-smile-wink"></i>`;
        } else {
            welcomeMsg.innerHTML = `<a href="pages/login.html" class="text-green-700 underline">Connectez-vous</a> pour profiter de vos avantages exclusifs !`;
        }
    }
}

// Initialisation
document.addEventListener('DOMContentLoaded', async () => {
    initSlider();
    setupMobileMenu();
    setupSearch();
    updateWelcomeMessage();
    updateFavCount();
    await loadAllProducts();
    
    if (isLoggedIn()) {
        await loadCart();
    }
});

// Exposer les fonctions globalement
window.addToCartUI = addToCartUI;
window.toggleFavoriteUI = toggleFavoriteUI;
window.showToast = showToast;