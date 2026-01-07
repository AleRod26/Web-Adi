// Sistema de Favoritos
class FavoritesManager {
    constructor() {
        this.favorites = this.loadFavorites();
        this.init();
    }
    
    init() {
        // Event listeners
        document.getElementById('favoritesBtn')?.addEventListener('click', () => this.showFavorites());
        document.getElementById('favoritesClose')?.addEventListener('click', () => this.hideFavorites());
        
        // Cerrar modal al hacer click fuera
        document.getElementById('favoritesModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'favoritesModal') this.hideFavorites();
        });
        
        this.updateBadge();
    }
    
    loadFavorites() {
        const saved = localStorage.getItem('favorites');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveFavorites() {
        localStorage.setItem('favorites', JSON.stringify(this.favorites));
        this.updateBadge();
    }
    
    toggleFavorite(productId) {
        const index = this.favorites.indexOf(productId);
        
        if (index > -1) {
            this.favorites.splice(index, 1);
            window.authSystem.showNotification('Eliminado de favoritos', 'info');
        } else {
            this.favorites.push(productId);
            const product = window.productsManager.products.find(p => p.id === productId);
            window.authSystem.showNotification(`❤️ ${product?.name || 'Producto'} agregado a favoritos`, 'success');
        }
        
        this.saveFavorites();
        this.updateFavoriteIcons();
        
        // Si el modal de favoritos está abierto, actualizar
        if (document.getElementById('favoritesModal').classList.contains('active')) {
            this.renderFavorites();
        }
    }
    
    isFavorite(productId) {
        return this.favorites.includes(productId);
    }
    
    updateBadge() {
        const badge = document.getElementById('favBadge');
        badge.textContent = this.favorites.length;
        badge.style.display = this.favorites.length > 0 ? 'flex' : 'none';
    }
    
    updateFavoriteIcons() {
        // Actualizar iconos en tarjetas de productos
        document.querySelectorAll('.product-card').forEach(card => {
            const productId = card.dataset.id;
            const icon = card.querySelector('.product-overlay .btn-icon:nth-child(2) i');
            if (icon) {
                if (this.isFavorite(productId)) {
                    icon.className = 'fas fa-heart';
                    icon.style.color = '#ef4444';
                } else {
                    icon.className = 'far fa-heart';
                    icon.style.color = '';
                }
            }
        });
        
        // Actualizar icono en modal de detalle
        const detailFavBtn = document.getElementById('addToFavBtn');
        if (detailFavBtn) {
            const productId = detailFavBtn.onclick?.toString().match(/'([^']+)'/)?.[1];
            if (productId && this.isFavorite(productId)) {
                detailFavBtn.querySelector('i').className = 'fas fa-heart';
                detailFavBtn.style.color = '#ef4444';
            }
        }
    }
    
    showFavorites() {
        this.renderFavorites();
        document.getElementById('favoritesModal').classList.add('active');
    }
    
    hideFavorites() {
        document.getElementById('favoritesModal').classList.remove('active');
    }
    
    renderFavorites() {
        const container = document.getElementById('favoritesGrid');
        const emptyDiv = document.getElementById('favoritesEmpty');
        
        if (this.favorites.length === 0) {
            container.innerHTML = '';
            emptyDiv.style.display = 'flex';
            return;
        }
        
        emptyDiv.style.display = 'none';
        
        const favoriteProducts = this.favorites
            .map(id => window.productsManager.products.find(p => p.id === id))
            .filter(p => p !== undefined);
        
        container.innerHTML = favoriteProducts.map(product => `
            <div class="favorite-card">
                <div class="favorite-image">
                    <img src="${product.image}" alt="${product.name}">
                    <button class="btn-remove-fav" onclick="window.favoritesManager.toggleFavorite('${product.id}')">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                <div class="favorite-info">
                    <h4>${product.name}</h4>
                    <p class="favorite-category">${window.productsManager.getCategoryName(product.category)}</p>
                    <div class="favorite-footer">
                        <span class="favorite-price">€${product.price.toFixed(2)}</span>
                        <button class="btn-small" onclick="window.productsManager.viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i> Ver
                        </button>
                        <button class="btn-small btn-primary" onclick="window.cartManager.addToCart('${product.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Inicializar
const favoritesManager = new FavoritesManager();
window.favoritesManager = favoritesManager;

// Actualizar iconos cuando se cargan los productos
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (window.favoritesManager) {
            window.favoritesManager.updateFavoriteIcons();
        }
    }, 500);
});
