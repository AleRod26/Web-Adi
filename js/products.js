// Sistema de Gestión de Productos
class ProductsManager {
    constructor() {
        this.products = this.loadProducts();
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.currentView = 'grid';
        this.editingProduct = null;
        this.init();
    }
    
    init() {
        // Event listeners para admin
        document.getElementById('adminClose')?.addEventListener('click', () => this.hideAdminPanel());
        document.getElementById('addProductBtn')?.addEventListener('click', () => this.showProductForm());
        document.getElementById('productClose')?.addEventListener('click', () => this.hideProductForm());
        document.getElementById('productForm')?.addEventListener('submit', (e) => this.handleProductSubmit(e));
        
        // Admin tabs
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.closest('.tab-btn').dataset.tab));
        });
        
        // Filtros y ordenamiento
        document.getElementById('categoryFilter')?.addEventListener('change', (e) => {
            this.currentFilter = e.target.value;
            this.renderProducts();
        });
        
        document.getElementById('sortFilter')?.addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.renderProducts();
        });
        
        // Vista grid/list
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                document.getElementById('productsGrid').className = `products-${this.currentView}`;
            });
        });
        
        // Categorías
        document.querySelectorAll('.category-card').forEach(card => {
            card.addEventListener('click', (e) => {
                const category = card.dataset.category;
                document.getElementById('categoryFilter').value = category;
                this.currentFilter = category;
                this.renderProducts();
                document.getElementById('catalogo').scrollIntoView({ behavior: 'smooth' });
            });
        });
        
        // Cerrar modales al hacer click fuera
        document.getElementById('adminModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'adminModal') this.hideAdminPanel();
        });
        
        document.getElementById('productModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'productModal') this.hideProductForm();
        });
        
        // Cargar productos iniciales si no hay
        if (this.products.length === 0) {
            this.loadSampleProducts();
        }
        
        // Renderizar productos
        this.renderProducts();
        this.renderGallery();
    }
    
    loadProducts() {
        const saved = localStorage.getItem('products');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveProducts() {
        localStorage.setItem('products', JSON.stringify(this.products));
    }
    
    loadSampleProducts() {
        this.products = [
            {
                id: this.generateId(),
                name: 'Jarrón Geométrico',
                category: 'decoracion',
                price: 25.99,
                description: 'Elegante jarrón con diseño geométrico moderno, perfecto para cualquier espacio.',
                image: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?w=400',
                modelUrl: '',
                creator: 'alefita9@gmail.com',
                createdAt: Date.now(),
                popular: true
            },
            {
                id: this.generateId(),
                name: 'Figura de Dragón',
                category: 'miniaturas',
                price: 35.50,
                description: 'Miniatura detallada de dragón para coleccionistas y entusiastas del gaming.',
                image: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=400',
                modelUrl: '',
                creator: 'www.adi2010@gmail.com',
                createdAt: Date.now() - 86400000,
                popular: true
            },
            {
                id: this.generateId(),
                name: 'Organizador de Escritorio',
                category: 'herramientas',
                price: 18.99,
                description: 'Organizador modular para mantener tu espacio de trabajo ordenado.',
                image: 'https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400',
                modelUrl: '',
                creator: 'alefita9@gmail.com',
                createdAt: Date.now() - 172800000,
                popular: false
            },
            {
                id: this.generateId(),
                name: 'Maceta Decorativa',
                category: 'decoracion',
                price: 22.00,
                description: 'Maceta con diseño único para tus plantas favoritas.',
                image: 'https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=400',
                modelUrl: '',
                creator: 'www.adi2010@gmail.com',
                createdAt: Date.now() - 259200000,
                popular: true
            },
            {
                id: this.generateId(),
                name: 'Juguete Educativo',
                category: 'juguetes',
                price: 15.50,
                description: 'Rompecabezas 3D educativo para desarrollo cognitivo.',
                image: 'https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=400',
                modelUrl: '',
                creator: 'alefita9@gmail.com',
                createdAt: Date.now() - 345600000,
                popular: false
            },
            {
                id: this.generateId(),
                name: 'Soporte para Móvil',
                category: 'herramientas',
                price: 12.99,
                description: 'Soporte ajustable y ergonómico para tu smartphone.',
                image: 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400',
                modelUrl: '',
                creator: 'www.adi2010@gmail.com',
                createdAt: Date.now() - 432000000,
                popular: false
            }
        ];
        
        this.saveProducts();
    }
    
    generateId() {
        return 'prod_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
    
    filterProducts() {
        let filtered = [...this.products];
        
        // Filtrar por categoría
        if (this.currentFilter !== 'all') {
            filtered = filtered.filter(p => p.category === this.currentFilter);
        }
        
        // Ordenar
        switch (this.currentSort) {
            case 'newest':
                filtered.sort((a, b) => b.createdAt - a.createdAt);
                break;
            case 'price-low':
                filtered.sort((a, b) => a.price - b.price);
                break;
            case 'price-high':
                filtered.sort((a, b) => b.price - a.price);
                break;
            case 'popular':
                filtered.sort((a, b) => (b.popular ? 1 : 0) - (a.popular ? 1 : 0));
                break;
        }
        
        return filtered;
    }
    
    renderProducts() {
        const container = document.getElementById('productsGrid');
        const noProducts = document.getElementById('noProducts');
        const filtered = this.filterProducts();
        
        if (filtered.length === 0) {
            container.innerHTML = '';
            noProducts.style.display = 'flex';
            return;
        }
        
        noProducts.style.display = 'none';
        
        container.innerHTML = filtered.map(product => `
            <div class="product-card" data-id="${product.id}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    <div class="product-overlay">
                        <button class="btn-icon" onclick="window.productsManager.viewProduct('${product.id}')">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="window.favoritesManager.toggleFavorite('${product.id}')">
                            <i class="far fa-heart"></i>
                        </button>
                    </div>
                    ${product.popular ? '<span class="badge-popular">Popular</span>' : ''}
                </div>
                <div class="product-info">
                    <div class="product-category">${this.getCategoryName(product.category)}</div>
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-description">${product.description.substring(0, 80)}...</p>
                    <div class="product-footer">
                        <div class="product-price">€${product.price.toFixed(2)}</div>
                        <button class="btn-add-to-cart" onclick="window.cartManager.addToCart('${product.id}')">
                            <i class="fas fa-cart-plus"></i>
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    renderGallery() {
        const container = document.getElementById('galleryGrid');
        const popularProducts = this.products.filter(p => p.popular).slice(0, 6);
        
        container.innerHTML = popularProducts.map(product => `
            <div class="gallery-item" onclick="window.productsManager.viewProduct('${product.id}')">
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="gallery-overlay">
                    <h3>${product.name}</h3>
                    <p>${this.getCategoryName(product.category)}</p>
                </div>
            </div>
        `).join('');
    }
    
    getCategoryName(category) {
        const names = {
            decoracion: 'Decoración',
            juguetes: 'Juguetes',
            herramientas: 'Herramientas',
            miniaturas: 'Miniaturas',
            prototipos: 'Prototipos',
            personalizado: 'Personalizado'
        };
        return names[category] || category;
    }
    
    viewProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        document.getElementById('detailImage').src = product.image;
        document.getElementById('detailName').textContent = product.name;
        document.getElementById('detailCategory').textContent = this.getCategoryName(product.category);
        document.getElementById('detailPrice').textContent = `€${product.price.toFixed(2)}`;
        document.getElementById('detailDescription').textContent = product.description;
        
        // Guardar ID para agregar al carrito
        document.getElementById('addToCartBtn').onclick = () => {
            window.cartManager.addToCart(id);
        };
        
        document.getElementById('addToFavBtn').onclick = () => {
            window.favoritesManager.toggleFavorite(id);
        };
        
        // Mostrar viewer 3D si hay modelo
        if (product.modelUrl && window.viewer3D) {
            window.viewer3D.loadModel(product.modelUrl);
        }
        
        document.getElementById('productDetailModal').classList.add('active');
    }
    
    hideAdminPanel() {
        document.getElementById('adminModal').classList.remove('active');
    }
    
    showProductForm(product = null) {
        this.editingProduct = product;
        
        if (product) {
            document.getElementById('productModalTitle').textContent = 'Editar Producto';
            document.getElementById('productId').value = product.id;
            document.getElementById('productName').value = product.name;
            document.getElementById('productCategory').value = product.category;
            document.getElementById('productPrice').value = product.price;
            document.getElementById('productDescription').value = product.description;
            document.getElementById('productImage').value = product.image || '';
            document.getElementById('productModel').value = product.modelUrl || '';
        } else {
            document.getElementById('productModalTitle').textContent = 'Nuevo Producto';
            document.getElementById('productForm').reset();
            document.getElementById('productId').value = '';
        }
        
        document.getElementById('productModal').classList.add('active');
    }
    
    hideProductForm() {
        document.getElementById('productModal').classList.remove('active');
        document.getElementById('productForm').reset();
        this.editingProduct = null;
    }
    
    handleProductSubmit(e) {
        e.preventDefault();
        
        if (!window.authSystem.isAuthenticated()) {
            window.authSystem.showNotification('Debes iniciar sesión', 'error');
            return;
        }
        
        const id = document.getElementById('productId').value;
        const productData = {
            name: document.getElementById('productName').value,
            category: document.getElementById('productCategory').value,
            price: parseFloat(document.getElementById('productPrice').value),
            description: document.getElementById('productDescription').value,
            image: document.getElementById('productImage').value || 'https://via.placeholder.com/400x400?text=Sin+Imagen',
            modelUrl: document.getElementById('productModel').value || '',
            creator: window.authSystem.getCurrentUser().email
        };
        
        if (id) {
            // Editar producto existente
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                // Verificar permisos
                if (!window.authSystem.canEditProduct(this.products[index])) {
                    window.authSystem.showNotification('No tienes permiso para editar este producto', 'error');
                    return;
                }
                
                this.products[index] = { ...this.products[index], ...productData };
                window.authSystem.showNotification('Producto actualizado', 'success');
            }
        } else {
            // Crear nuevo producto
            const newProduct = {
                id: this.generateId(),
                ...productData,
                createdAt: Date.now(),
                popular: false
            };
            
            this.products.push(newProduct);
            window.authSystem.showNotification('Producto creado', 'success');
        }
        
        this.saveProducts();
        this.renderProducts();
        this.renderGallery();
        this.loadAdminProducts();
        this.hideProductForm();
    }
    
    deleteProduct(id) {
        const product = this.products.find(p => p.id === id);
        if (!product) return;
        
        if (!window.authSystem.canEditProduct(product)) {
            window.authSystem.showNotification('No tienes permiso para eliminar este producto', 'error');
            return;
        }
        
        if (confirm('¿Estás seguro de eliminar este producto?')) {
            this.products = this.products.filter(p => p.id !== id);
            this.saveProducts();
            this.renderProducts();
            this.loadAdminProducts();
            window.authSystem.showNotification('Producto eliminado', 'success');
        }
    }
    
    loadAdminProducts() {
        const tbody = document.getElementById('productsTableBody');
        const currentUser = window.authSystem.getCurrentUser();
        
        if (!currentUser) return;
        
        // Mostrar todos los productos, pero solo permitir editar los propios
        const html = this.products.map(product => {
            const canEdit = product.creator === currentUser.email;
            return `
                <tr>
                    <td><img src="${product.image}" alt="${product.name}" class="admin-thumb"></td>
                    <td>${product.name}</td>
                    <td>${this.getCategoryName(product.category)}</td>
                    <td>€${product.price.toFixed(2)}</td>
                    <td>${product.creator}</td>
                    <td>
                        ${canEdit ? `
                            <button class="btn-icon-small" onclick="window.productsManager.showProductForm(${JSON.stringify(product).replace(/"/g, '&quot;')})" title="Editar">
                                <i class="fas fa-edit"></i>
                            </button>
                            <button class="btn-icon-small btn-danger" onclick="window.productsManager.deleteProduct('${product.id}')" title="Eliminar">
                                <i class="fas fa-trash"></i>
                            </button>
                        ` : `
                            <span class="text-muted">Solo lectura</span>
                        `}
                    </td>
                </tr>
            `;
        }).join('');
        
        tbody.innerHTML = html || '<tr><td colspan="6" class="text-center">No hay productos</td></tr>';
        
        // Cargar diseños del usuario
        this.loadUserDesigns();
    }
    
    loadUserDesigns() {
        const container = document.getElementById('designsGrid');
        const currentUser = window.authSystem.getCurrentUser();
        
        if (!currentUser) return;
        
        const userProducts = this.products.filter(p => p.creator === currentUser.email && p.modelUrl);
        
        if (userProducts.length === 0) {
            container.innerHTML = `
                <div class="no-designs">
                    <i class="fas fa-cube fa-3x"></i>
                    <p>No has subido diseños 3D todavía</p>
                    <button class="btn-primary" onclick="window.productsManager.showProductForm()">
                        <i class="fas fa-upload"></i> Subir Diseño
                    </button>
                </div>
            `;
            return;
        }
        
        container.innerHTML = userProducts.map(product => `
            <div class="design-card">
                <div class="design-preview">
                    <img src="${product.image}" alt="${product.name}">
                    <div class="design-overlay">
                        <button class="btn-icon" onclick="window.productsManager.downloadDesign('${product.modelUrl}', '${product.name}')">
                            <i class="fas fa-download"></i>
                        </button>
                    </div>
                </div>
                <div class="design-info">
                    <h4>${product.name}</h4>
                    <p class="design-category">${this.getCategoryName(product.category)}</p>
                    <a href="${product.modelUrl}" download class="btn-download">
                        <i class="fas fa-download"></i> Descargar STL
                    </a>
                </div>
            </div>
        `).join('');
    }
    
    downloadDesign(url, name) {
        const a = document.createElement('a');
        a.href = url;
        a.download = name + '.stl';
        a.click();
        window.authSystem.showNotification('Descargando diseño...', 'info');
    }
    
    switchTab(tabName) {
        // Actualizar botones
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.tab === tabName);
        });
        
        // Actualizar contenido
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.toggle('active', content.id === `tab${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
        });
        
        // Cargar datos según la pestaña
        if (tabName === 'products') {
            this.loadAdminProducts();
        } else if (tabName === 'designs') {
            this.loadUserDesigns();
        } else if (tabName === 'orders') {
            if (window.cartManager) {
                window.cartManager.loadAdminOrders();
            }
        }
    }
    
    searchProducts(query) {
        query = query.toLowerCase().trim();
        if (!query) return [];
        
        return this.products.filter(p => 
            p.name.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            p.category.toLowerCase().includes(query)
        );
    }
}

// Inicializar
const productsManager = new ProductsManager();
window.productsManager = productsManager;
