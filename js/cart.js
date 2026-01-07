// Sistema de Carrito de Compras
class CartManager {
    constructor() {
        this.cart = this.loadCart();
        this.orders = this.loadOrders();
        this.init();
    }
    
    init() {
        // Event listeners
        document.getElementById('cartBtn')?.addEventListener('click', () => this.showCart());
        document.getElementById('cartClose')?.addEventListener('click', () => this.hideCart());
        document.getElementById('checkoutBtn')?.addEventListener('click', () => this.showCheckout());
        document.getElementById('checkoutClose')?.addEventListener('click', () => this.hideCheckout());
        document.getElementById('checkoutForm')?.addEventListener('submit', (e) => this.handleCheckout(e));
        document.getElementById('productDetailClose')?.addEventListener('click', () => {
            document.getElementById('productDetailModal').classList.remove('active');
        });
        
        // Cerrar modales al hacer click fuera
        document.getElementById('cartModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'cartModal') this.hideCart();
        });
        
        document.getElementById('checkoutModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'checkoutModal') this.hideCheckout();
        });
        
        document.getElementById('productDetailModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'productDetailModal') {
                document.getElementById('productDetailModal').classList.remove('active');
            }
        });
        
        this.updateBadge();
    }
    
    loadCart() {
        const saved = localStorage.getItem('cart');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.cart));
        this.updateBadge();
    }
    
    loadOrders() {
        const saved = localStorage.getItem('orders');
        return saved ? JSON.parse(saved) : [];
    }
    
    saveOrders() {
        localStorage.setItem('orders', JSON.stringify(this.orders));
    }
    
    addToCart(productId) {
        const product = window.productsManager.products.find(p => p.id === productId);
        if (!product) return;
        
        const existingItem = this.cart.find(item => item.productId === productId);
        
        if (existingItem) {
            existingItem.quantity++;
        } else {
            this.cart.push({
                productId: productId,
                quantity: 1,
                addedAt: Date.now()
            });
        }
        
        this.saveCart();
        this.renderCart();
        window.authSystem.showNotification(`✅ ${product.name} agregado al carrito`, 'success');
    }
    
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.productId !== productId);
        this.saveCart();
        this.renderCart();
        window.authSystem.showNotification('Producto eliminado del carrito', 'info');
    }
    
    updateQuantity(productId, change) {
        const item = this.cart.find(i => i.productId === productId);
        if (!item) return;
        
        item.quantity += change;
        
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.saveCart();
            this.renderCart();
        }
    }
    
    updateBadge() {
        const badge = document.getElementById('cartBadge');
        const total = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        badge.textContent = total;
        badge.style.display = total > 0 ? 'flex' : 'none';
    }
    
    showCart() {
        this.renderCart();
        document.getElementById('cartModal').classList.add('active');
    }
    
    hideCart() {
        document.getElementById('cartModal').classList.remove('active');
    }
    
    renderCart() {
        const container = document.getElementById('cartItems');
        const emptyDiv = document.getElementById('cartEmpty');
        const footer = document.getElementById('cartFooter');
        
        if (this.cart.length === 0) {
            container.innerHTML = '';
            emptyDiv.style.display = 'flex';
            footer.style.display = 'none';
            return;
        }
        
        emptyDiv.style.display = 'none';
        footer.style.display = 'block';
        
        let total = 0;
        
        container.innerHTML = this.cart.map(item => {
            const product = window.productsManager.products.find(p => p.id === item.productId);
            if (!product) return '';
            
            const subtotal = product.price * item.quantity;
            total += subtotal;
            
            return `
                <div class="cart-item">
                    <img src="${product.image}" alt="${product.name}" class="cart-item-image">
                    <div class="cart-item-info">
                        <h4>${product.name}</h4>
                        <p class="cart-item-category">${window.productsManager.getCategoryName(product.category)}</p>
                        <p class="cart-item-price">€${product.price.toFixed(2)}</p>
                    </div>
                    <div class="cart-item-controls">
                        <div class="quantity-controls">
                            <button class="btn-quantity" onclick="window.cartManager.updateQuantity('${item.productId}', -1)">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="btn-quantity" onclick="window.cartManager.updateQuantity('${item.productId}', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="btn-remove" onclick="window.cartManager.removeFromCart('${item.productId}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                    <div class="cart-item-subtotal">
                        €${subtotal.toFixed(2)}
                    </div>
                </div>
            `;
        }).join('');
        
        document.getElementById('cartTotal').textContent = `€${total.toFixed(2)}`;
    }
    
    showCheckout() {
        if (this.cart.length === 0) {
            window.authSystem.showNotification('Tu carrito está vacío', 'error');
            return;
        }
        
        this.renderCheckoutSummary();
        document.getElementById('checkoutModal').classList.add('active');
    }
    
    hideCheckout() {
        document.getElementById('checkoutModal').classList.remove('active');
    }
    
    renderCheckoutSummary() {
        const container = document.getElementById('checkoutItems');
        let total = 0;
        
        const html = this.cart.map(item => {
            const product = window.productsManager.products.find(p => p.id === item.productId);
            if (!product) return '';
            
            const subtotal = product.price * item.quantity;
            total += subtotal;
            
            return `
                <div class="checkout-item">
                    <span>${product.name} x${item.quantity}</span>
                    <span>€${subtotal.toFixed(2)}</span>
                </div>
            `;
        }).join('');
        
        container.innerHTML = html;
        document.getElementById('checkoutTotal').textContent = `€${total.toFixed(2)}`;
    }
    
    handleCheckout(e) {
        e.preventDefault();
        
        const orderData = {
            id: 'order_' + Date.now(),
            customer: {
                name: document.getElementById('checkoutName').value,
                email: document.getElementById('checkoutEmail').value,
                phone: document.getElementById('checkoutPhone').value,
                address: document.getElementById('checkoutAddress').value,
                city: document.getElementById('checkoutCity').value,
                postal: document.getElementById('checkoutPostal').value
            },
            items: this.cart.map(item => {
                const product = window.productsManager.products.find(p => p.id === item.productId);
                return {
                    productId: item.productId,
                    productName: product.name,
                    quantity: item.quantity,
                    price: product.price,
                    subtotal: product.price * item.quantity
                };
            }),
            total: this.cart.reduce((sum, item) => {
                const product = window.productsManager.products.find(p => p.id === item.productId);
                return sum + (product.price * item.quantity);
            }, 0),
            notes: document.getElementById('checkoutNotes').value,
            status: 'pending',
            createdAt: Date.now()
        };
        
        this.orders.push(orderData);
        this.saveOrders();
        
        // Limpiar carrito
        this.cart = [];
        this.saveCart();
        
        // Cerrar modales
        this.hideCheckout();
        this.hideCart();
        
        // Mostrar confirmación
        this.showOrderConfirmation(orderData);
        
        // Reset form
        document.getElementById('checkoutForm').reset();
    }
    
    showOrderConfirmation(order) {
        const message = `
            <div class="order-confirmation">
                <i class="fas fa-check-circle fa-3x" style="color: #10b981;"></i>
                <h3>¡Pedido Confirmado!</h3>
                <p>Número de pedido: <strong>${order.id}</strong></p>
                <p>Total: <strong>€${order.total.toFixed(2)}</strong></p>
                <p>Recibirás un email de confirmación en: <strong>${order.customer.email}</strong></p>
            </div>
        `;
        
        // Crear modal personalizado
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 500px; text-align: center;">
                ${message}
                <button class="btn-primary" onclick="this.closest('.modal').remove()" style="margin-top: 20px;">
                    <i class="fas fa-check"></i> Entendido
                </button>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        setTimeout(() => {
            modal.remove();
        }, 5000);
    }
    
    loadAdminOrders() {
        const tbody = document.getElementById('ordersTableBody');
        
        if (this.orders.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">No hay pedidos registrados</td></tr>';
            return;
        }
        
        const html = this.orders.map(order => `
            <tr>
                <td>${order.id}</td>
                <td>
                    <strong>${order.customer.name}</strong><br>
                    <small>${order.customer.email}</small>
                </td>
                <td>${order.items.length} producto(s)</td>
                <td>€${order.total.toFixed(2)}</td>
                <td>${new Date(order.createdAt).toLocaleDateString()}</td>
                <td>
                    <select class="status-select" onchange="window.cartManager.updateOrderStatus('${order.id}', this.value)">
                        <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pendiente</option>
                        <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Procesando</option>
                        <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Enviado</option>
                        <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Entregado</option>
                        <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelado</option>
                    </select>
                </td>
            </tr>
        `).join('');
        
        tbody.innerHTML = html;
    }
    
    updateOrderStatus(orderId, newStatus) {
        const order = this.orders.find(o => o.id === orderId);
        if (order) {
            order.status = newStatus;
            this.saveOrders();
            window.authSystem.showNotification('Estado actualizado', 'success');
        }
    }
}

// Inicializar
const cartManager = new CartManager();
window.cartManager = cartManager;
