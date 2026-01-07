// Visualizador 3D con Three.js
class Viewer3D {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.controls = null;
        this.model = null;
        this.container = null;
        this.animationId = null;
    }
    
    init(containerId) {
        this.container = document.getElementById(containerId);
        if (!this.container) return;
        
        // Limpiar contenedor
        this.container.innerHTML = '';
        
        // Crear escena
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x1a1a2e);
        
        // Crear cámara
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 400;
        this.camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
        this.camera.position.set(0, 0, 5);
        
        // Crear renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.container.appendChild(this.renderer.domElement);
        
        // Controles
        if (typeof THREE.OrbitControls !== 'undefined') {
            this.controls = new THREE.OrbitControls(this.camera, this.renderer.domElement);
            this.controls.enableDamping = true;
            this.controls.dampingFactor = 0.05;
            this.controls.enableZoom = true;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 2;
        }
        
        // Luces
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        this.scene.add(ambientLight);
        
        const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight1.position.set(5, 5, 5);
        this.scene.add(directionalLight1);
        
        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
        directionalLight2.position.set(-5, -5, -5);
        this.scene.add(directionalLight2);
        
        // Grid helper
        const gridHelper = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
        this.scene.add(gridHelper);
        
        // Iniciar animación
        this.animate();
        
        // Responsive
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    loadModel(url) {
        if (!this.scene) {
            console.error('Visor 3D no inicializado');
            return;
        }
        
        // Remover modelo anterior
        if (this.model) {
            this.scene.remove(this.model);
            this.model = null;
        }
        
        // Determinar tipo de archivo
        const extension = url.split('.').pop().toLowerCase();
        
        if (extension === 'stl') {
            this.loadSTL(url);
        } else if (extension === 'obj') {
            this.loadOBJ(url);
        } else {
            console.error('Formato no soportado:', extension);
            this.showPlaceholder();
        }
    }
    
    loadSTL(url) {
        if (typeof THREE.STLLoader === 'undefined') {
            console.error('STLLoader no disponible');
            this.showPlaceholder();
            return;
        }
        
        const loader = new THREE.STLLoader();
        
        loader.load(
            url,
            (geometry) => {
                const material = new THREE.MeshPhongMaterial({
                    color: 0x00d9ff,
                    specular: 0x111111,
                    shininess: 200,
                    flatShading: false
                });
                
                this.model = new THREE.Mesh(geometry, material);
                
                // Centrar y escalar modelo
                this.centerAndScaleModel();
                
                this.scene.add(this.model);
            },
            (xhr) => {
                console.log((xhr.loaded / xhr.total * 100) + '% cargado');
            },
            (error) => {
                console.error('Error cargando STL:', error);
                this.showPlaceholder();
            }
        );
    }
    
    loadOBJ(url) {
        // Similar a STL pero con OBJLoader
        console.log('Cargando OBJ:', url);
        this.showPlaceholder();
    }
    
    centerAndScaleModel() {
        if (!this.model) return;
        
        // Calcular bounding box
        const box = new THREE.Box3().setFromObject(this.model);
        const center = box.getCenter(new THREE.Vector3());
        const size = box.getSize(new THREE.Vector3());
        
        // Centrar
        this.model.position.sub(center);
        
        // Escalar para que quepa en la vista
        const maxDim = Math.max(size.x, size.y, size.z);
        const scale = 3 / maxDim;
        this.model.scale.setScalar(scale);
    }
    
    showPlaceholder() {
        // Mostrar cubo de placeholder
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshPhongMaterial({ 
            color: 0x00d9ff,
            wireframe: false 
        });
        
        this.model = new THREE.Mesh(geometry, material);
        this.scene.add(this.model);
    }
    
    animate() {
        this.animationId = requestAnimationFrame(() => this.animate());
        
        if (this.controls) {
            this.controls.update();
        }
        
        if (this.renderer && this.scene && this.camera) {
            this.renderer.render(this.scene, this.camera);
        }
    }
    
    onWindowResize() {
        if (!this.container || !this.camera || !this.renderer) return;
        
        const width = this.container.clientWidth;
        const height = this.container.clientHeight || 400;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }
    
    dispose() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
        
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        if (this.controls) {
            this.controls.dispose();
        }
    }
}

// Exponer globalmente
window.Viewer3D = Viewer3D;
window.viewer3D = null;

// Inicializar cuando se abre el modal de detalle
document.addEventListener('DOMContentLoaded', () => {
    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.attributeName === 'class') {
                const modal = document.getElementById('productDetailModal');
                if (modal && modal.classList.contains('active')) {
                    // Modal abierto, inicializar visor
                    setTimeout(() => {
                        if (!window.viewer3D) {
                            window.viewer3D = new Viewer3D();
                        }
                        window.viewer3D.init('detail3DViewer');
                    }, 100);
                }
            }
        });
    });
    
    const modal = document.getElementById('productDetailModal');
    if (modal) {
        observer.observe(modal, { attributes: true });
    }
});
