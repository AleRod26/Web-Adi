// Sistema de Autenticación con Lista Blanca
class AuthSystem {
    constructor() {
        // Lista blanca de correos autorizados
        this.whitelist = [
            'alefita9@gmail.com',
            'www.adi2010@gmail.com'
        ];
        
        // Hash de contraseña (en producción usar bcrypt o similar)
        // Contraseña: "2naranjas"
        this.passwordHash = this.simpleHash('2naranjas');
        
        this.currentUser = null;
        this.init();
    }
    
    init() {
        // Verificar si hay sesión activa
        const savedUser = localStorage.getItem('admin_user');
        if (savedUser) {
            this.currentUser = JSON.parse(savedUser);
            this.updateUI();
        }
        
        // Event listeners
        document.getElementById('loginBtn').addEventListener('click', () => this.showLoginModal());
        document.getElementById('loginClose').addEventListener('click', () => this.hideLoginModal());
        document.getElementById('loginForm').addEventListener('submit', (e) => this.handleLogin(e));
        
        // Cerrar modal al hacer click fuera
        document.getElementById('loginModal').addEventListener('click', (e) => {
            if (e.target.id === 'loginModal') {
                this.hideLoginModal();
            }
        });
    }
    
    // Hash simple (en producción usar algo más seguro)
    simpleHash(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash.toString();
    }
    
    showLoginModal() {
        if (this.currentUser) {
            // Si ya está logueado, mostrar panel admin
            this.showAdminPanel();
        } else {
            document.getElementById('loginModal').classList.add('active');
            document.getElementById('loginEmail').focus();
        }
    }
    
    hideLoginModal() {
        document.getElementById('loginModal').classList.remove('active');
        document.getElementById('loginForm').reset();
        document.getElementById('loginError').textContent = '';
    }
    
    async handleLogin(e) {
        e.preventDefault();
        
        const email = document.getElementById('loginEmail').value.trim().toLowerCase();
        const password = document.getElementById('loginPassword').value;
        const errorDiv = document.getElementById('loginError');
        
        // Limpiar error previo
        errorDiv.textContent = '';
        
        // Validar email en lista blanca
        if (!this.whitelist.includes(email)) {
            errorDiv.textContent = '❌ Este apartado esta en progreso. Tadavia no es funcional.';
            this.showNotification('Acceso denegado', 'error');
            return;
        }
        
        // Validar contraseña
        const inputHash = this.simpleHash(password);
        if (inputHash !== this.passwordHash) {
            errorDiv.textContent = '❌ Contraseña incorrecta.';
            this.showNotification('Contraseña incorrecta', 'error');
            return;
        }
        
        // Login exitoso
        this.currentUser = {
            email: email,
            loginTime: new Date().toISOString(),
            id: this.generateUserId(email)
        };
        
        localStorage.setItem('admin_user', JSON.stringify(this.currentUser));
        
        this.showNotification('✅ Inicio de sesión exitoso', 'success');
        this.hideLoginModal();
        this.updateUI();
        
        // Mostrar panel admin
        setTimeout(() => this.showAdminPanel(), 300);
    }
    
    generateUserId(email) {
        return 'user_' + this.simpleHash(email);
    }
    
    logout() {
        this.currentUser = null;
        localStorage.removeItem('admin_user');
        this.updateUI();
        this.showNotification('Sesión cerrada', 'info');
        
        // Cerrar panel admin si está abierto
        document.getElementById('adminModal').classList.remove('active');
    }
    
    updateUI() {
        const loginBtn = document.getElementById('loginBtn');
        
        if (this.currentUser) {
            loginBtn.innerHTML = '<i class="fas fa-user-check"></i> Admin';
            loginBtn.classList.add('logged-in');
            loginBtn.title = `Sesión: ${this.currentUser.email}`;
        } else {
            loginBtn.innerHTML = '<i class="fas fa-user"></i> Admin';
            loginBtn.classList.remove('logged-in');
            loginBtn.title = 'Acceso administrativo';
        }
    }
    
    showAdminPanel() {
        if (!this.currentUser) {
            this.showLoginModal();
            return;
        }
        
        document.getElementById('adminModal').classList.add('active');
        
        // Cargar datos del panel
        if (window.productsManager) {
            window.productsManager.loadAdminProducts();
        }
    }
    
    isAuthenticated() {
        return this.currentUser !== null;
    }
    
    getCurrentUser() {
        return this.currentUser;
    }
    
    canEditProduct(product) {
        if (!this.currentUser) return false;
        
        // El usuario solo puede editar productos que él creó
        return product.creator === this.currentUser.email;
    }
    
    showNotification(message, type = 'info') {
        // Crear notificación toast
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;
        
        document.body.appendChild(toast);
        
        // Animar entrada
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remover después de 3 segundos
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Inicializar sistema de autenticación
const authSystem = new AuthSystem();

// Exponer globalmente
window.authSystem = authSystem;
