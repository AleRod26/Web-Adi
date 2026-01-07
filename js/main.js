// Script Principal - PrintVerse3D
document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

function initializeApp() {
    // Navbar scroll effect
    handleNavbarScroll();
    
    // Smooth scrolling para enlaces
    setupSmoothScroll();
    
    // Animación de contadores
    setupCounterAnimation();
    
    // Búsqueda
    setupSearch();
    
    // Formulario de contacto
    setupContactForm();
    
    // Menu mobile
    setupMobileMenu();
    
    // Close modals on escape key
    setupEscapeKey();
}

// ===== Navbar Scroll =====
function handleNavbarScroll() {
    const navbar = document.getElementById('navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== Smooth Scroll =====
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href === '#' || !href) return;
            
            e.preventDefault();
            const target = document.querySelector(href);
            
            if (target) {
                const offset = 80; // Altura del navbar
                const targetPosition = target.offsetTop - offset;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Actualizar enlaces activos
                updateActiveNavLink(href);
            }
        });
    });
}

function updateActiveNavLink(href) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === href) {
            link.classList.add('active');
        }
    });
}

// ===== Counter Animation =====
function setupCounterAnimation() {
    const counters = document.querySelectorAll('.stat-number');
    const observerOptions = {
        threshold: 0.5
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
    const target = parseInt(element.dataset.target);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const updateCounter = () => {
        current += increment;
        if (current < target) {
            element.textContent = Math.floor(current);
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };
    
    updateCounter();
}

// ===== Search =====
function setupSearch() {
    const searchBtn = document.getElementById('searchBtn');
    const searchModal = document.getElementById('searchModal');
    const searchClose = document.getElementById('searchClose');
    const searchInput = document.getElementById('searchInput');
    const searchResults = document.getElementById('searchResults');
    
    searchBtn?.addEventListener('click', () => {
        searchModal.classList.add('active');
        searchInput.focus();
    });
    
    searchClose?.addEventListener('click', () => {
        searchModal.classList.remove('active');
        searchInput.value = '';
        searchResults.innerHTML = '';
    });
    
    searchInput?.addEventListener('input', (e) => {
        const query = e.target.value;
        performSearch(query);
    });
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    if (!query || query.length < 2) {
        searchResults.innerHTML = '';
        return;
    }
    
    const results = window.productsManager.searchProducts(query);
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-result-item" style="text-align: center; color: var(--text-secondary);">
                No se encontraron resultados para "${query}"
            </div>
        `;
        return;
    }
    
    searchResults.innerHTML = results.map(product => `
        <div class="search-result-item" onclick="searchResultClick('${product.id}')">
            <div style="display: flex; align-items: center; gap: 1rem;">
                <img src="${product.image}" alt="${product.name}" 
                     style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div>
                    <h4 style="margin-bottom: 0.25rem;">${product.name}</h4>
                    <p style="color: var(--text-secondary); font-size: 0.85rem;">
                        ${window.productsManager.getCategoryName(product.category)} • €${product.price.toFixed(2)}
                    </p>
                </div>
            </div>
        </div>
    `).join('');
}

function searchResultClick(productId) {
    // Cerrar modal de búsqueda
    document.getElementById('searchModal').classList.remove('active');
    document.getElementById('searchInput').value = '';
    
    // Abrir detalle del producto
    window.productsManager.viewProduct(productId);
}

// Exponer globalmente
window.searchResultClick = searchResultClick;

// ===== Contact Form =====
function setupContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('contactName').value,
            email: document.getElementById('contactEmail').value,
            subject: document.getElementById('contactSubject').value,
            message: document.getElementById('contactMessage').value
        };
        
        // Simular envío (en producción conectar con backend)
        console.log('Formulario de contacto enviado:', formData);
        
        window.authSystem.showNotification('✅ Mensaje enviado exitosamente', 'success');
        
        // Limpiar formulario
        contactForm.reset();
    });
}

// ===== Mobile Menu =====
function setupMobileMenu() {
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');
    
    menuToggle?.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        menuToggle.classList.toggle('active');
    });
    
    // Cerrar menú al hacer click en un enlace
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            menuToggle.classList.remove('active');
        });
    });
}

// ===== Escape Key =====
function setupEscapeKey() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            // Cerrar todos los modales activos
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
        }
    });
}

// ===== Intersection Observer para animaciones =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Animar elementos al entrar en viewport
document.querySelectorAll('.product-card, .category-card, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// ===== Newsletter Form =====
document.querySelector('.newsletter-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = e.target.querySelector('input[type="email"]').value;
    
    console.log('Newsletter subscription:', email);
    window.authSystem.showNotification('✅ Suscripción exitosa', 'success');
    
    e.target.reset();
});

// ===== Actualizar iconos de favoritos periódicamente =====
setInterval(() => {
    if (window.favoritesManager) {
        window.favoritesManager.updateFavoriteIcons();
    }
}, 2000);

// ===== Detectar scroll para actualizar nav activo =====
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section[id]');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            updateActiveNavLink(`#${sectionId}`);
        }
    });
});

// ===== Log de inicialización =====
console.log(`
╔═══════════════════════════════════════╗
║      PrintVerse 3D - Inicializado    ║
║                                       ║
║  Sistema de autenticación: ✓          ║
║  Gestión de productos: ✓              ║
║  Carrito de compras: ✓                ║
║  Sistema de favoritos: ✓              ║
║  Calculadora de precios: ✓            ║
║  Visualizador 3D: ✓                   ║
║                                       ║
║  Ready to rock! 🚀                    ║
╚═══════════════════════════════════════╝
`);
