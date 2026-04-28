// Gestion de l'authentification

function isLoggedIn() {
    const user = localStorage.getItem('userToken');
    return user ? true : false;
}

function isAdmin() {
    const adminToken = localStorage.getItem('adminToken');
    return adminToken ? true : false;
}

function getCurrentUser() {
    const user = localStorage.getItem('userInfo');
    return user ? JSON.parse(user) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('userInfo', JSON.stringify(user));
    if (user.token) {
        localStorage.setItem('userToken', user.token);
    }
}

function logout() {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    localStorage.removeItem('cart');
    window.location.href = '../index.html';
}

function updateUIForAuth() {
    const user = getCurrentUser();
    const isAdminUser = isAdmin();
    const userInfo = document.getElementById('userInfo');
    const loginLink = document.getElementById('loginLink');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (user && userInfo) {
        userInfo.innerHTML = `<i class="fas fa-user mr-1"></i> ${user.name}`;
        if (loginLink) loginLink.style.display = 'none';
        if (logoutBtn) logoutBtn.style.display = 'block';
        
        // Si admin, ajouter un lien vers l'admin panel
        if (isAdminUser && userInfo) {
            // Optionnel: ajouter un lien admin
        }
    } else if (userInfo) {
        userInfo.innerHTML = 'Invité';
        if (loginLink) loginLink.style.display = 'block';
        if (logoutBtn) logoutBtn.style.display = 'none';
    }
}

function requireAuth() {
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return false;
    }
    return true;
}

function redirectIfLoggedIn() {
    // NE PAS rediriger automatiquement depuis la page login
    // Cette fonction est appelée sur les pages register et login
    const currentPage = window.location.pathname;
    
    // Éviter la redirection si on est déjà sur login ou register
    if (currentPage.includes('login.html') || currentPage.includes('register.html')) {
        return false;
    }
    
    if (isLoggedIn()) {
        if (isAdmin()) {
            window.location.href = 'pages/admin/dashboard.html';
        } else {
            window.location.href = '../index.html';
        }
        return true;
    }
    return false;
}

document.addEventListener('DOMContentLoaded', () => {
    updateUIForAuth();
    
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    const userBtn = document.getElementById('userBtn');
    const userDropdown = document.getElementById('userDropdown');
    if (userBtn && userDropdown) {
        userBtn.addEventListener('click', () => {
            userDropdown.classList.toggle('hidden');
        });
        
        document.addEventListener('click', (e) => {
            if (!userBtn.contains(e.target) && !userDropdown.contains(e.target)) {
                userDropdown.classList.add('hidden');
            }
        });
    }
});