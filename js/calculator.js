// Calculadora de Precios
class PriceCalculator {
    constructor() {
        this.init();
    }
    
    init() {
        // Sincronizar inputs con ranges
        this.syncInput('calcSize', 'calcSizeRange');
        this.syncInput('calcInfill', 'calcInfillRange');
        
        // Event listeners
        document.getElementById('calculateBtn')?.addEventListener('click', () => this.calculate());
        document.getElementById('requestQuoteBtn')?.addEventListener('click', () => this.requestQuote());
        
        // Auto-calcular cuando cambian los valores
        ['calcSize', 'calcSizeRange', 'calcMaterial', 'calcQuality', 'calcInfill', 'calcInfillRange', 'calcSupport', 'calcColor'].forEach(id => {
            const element = document.getElementById(id);
            if (element) {
                element.addEventListener('change', () => this.calculate());
                element.addEventListener('input', () => this.calculate());
            }
        });
        
        // Calcular inicialmente
        this.calculate();
    }
    
    syncInput(inputId, rangeId) {
        const input = document.getElementById(inputId);
        const range = document.getElementById(rangeId);
        
        if (!input || !range) return;
        
        input.addEventListener('input', () => {
            range.value = input.value;
        });
        
        range.addEventListener('input', () => {
            input.value = range.value;
        });
    }
    
    calculate() {
        // Obtener valores
        const size = parseFloat(document.getElementById('calcSize')?.value || 100);
        const material = document.getElementById('calcMaterial');
        const quality = document.getElementById('calcQuality');
        const infill = parseFloat(document.getElementById('calcInfill')?.value || 20);
        const support = document.getElementById('calcSupport')?.checked || false;
        const color = document.getElementById('calcColor')?.checked || false;
        
        // Obtener precios
        const materialPrice = parseFloat(material?.options[material.selectedIndex]?.dataset.price || 0.5);
        const qualityMult = parseFloat(quality?.options[quality.selectedIndex]?.dataset.mult || 1.0);
        
        // Calcular precio base del material
        let materialCost = (size / 100) * materialPrice;
        
        // Ajustar por relleno (más relleno = más material)
        materialCost *= (1 + (infill / 100) * 0.5);
        
        // Calcular costo de calidad
        const qualityCost = materialCost * (qualityMult - 1);
        
        // Calcular extras
        let extrasCost = 0;
        if (support) {
            extrasCost += materialCost * 0.15;
        }
        if (color) {
            extrasCost += 5;
        }
        
        // Total
        const total = materialCost + qualityCost + extrasCost;
        
        // Actualizar UI
        document.getElementById('priceeMaterial').textContent = `€${materialCost.toFixed(2)}`;
        document.getElementById('priceQuality').textContent = `€${qualityCost.toFixed(2)}`;
        document.getElementById('priceExtras').textContent = `€${extrasCost.toFixed(2)}`;
        document.getElementById('priceTotal').textContent = `€${total.toFixed(2)}`;
    }
    
    requestQuote() {
        const size = document.getElementById('calcSize')?.value;
        const material = document.getElementById('calcMaterial');
        const quality = document.getElementById('calcQuality');
        const infill = document.getElementById('calcInfill')?.value;
        const support = document.getElementById('calcSupport')?.checked;
        const color = document.getElementById('calcColor')?.checked;
        const total = document.getElementById('priceTotal')?.textContent;
        
        const materialName = material?.options[material.selectedIndex]?.text;
        const qualityName = quality?.options[quality.selectedIndex]?.text;
        
        const quoteDetails = `
Solicitud de Presupuesto - PrintVerse3D

Especificaciones:
- Tamaño: ${size} cm³
- Material: ${materialName}
- Calidad: ${qualityName}
- Relleno: ${infill}%
- Soportes: ${support ? 'Sí' : 'No'}
- Color personalizado: ${color ? 'Sí' : 'No'}

Precio estimado: ${total}

Por favor, proporciona más detalles sobre tu proyecto para un presupuesto exacto.
        `.trim();
        
        // Copiar al portapapeles
        navigator.clipboard.writeText(quoteDetails).then(() => {
            window.authSystem.showNotification('✅ Detalles copiados al portapapeles', 'success');
        });
        
        // Scroll al formulario de contacto
        document.getElementById('contacto').scrollIntoView({ behavior: 'smooth' });
        
        // Pre-llenar el formulario de contacto
        setTimeout(() => {
            document.getElementById('contactSubject').value = 'Solicitud de Presupuesto';
            document.getElementById('contactMessage').value = quoteDetails;
        }, 500);
    }
}

// Inicializar
const priceCalculator = new PriceCalculator();
window.priceCalculator = priceCalculator;
