# 🎨 PrintVerse 3D - Tienda de Impresiones 3D

Una plataforma web moderna y completa para la venta de productos de impresión 3D, con gestión administrativa restringida, visualización 3D interactiva, carrito de compras y calculadora de precios.

![PrintVerse 3D](https://img.shields.io/badge/Version-1.0.0-00d9ff?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-8338ec?style=for-the-badge)
![Status](https://img.shields.io/badge/Status-Active-10b981?style=for-the-badge)

---

## ✨ Características Principales

### 🔐 Sistema de Autenticación Seguro
- **Lista blanca de correos**: Solo 2 correos autorizados pueden acceder al panel administrativo
  - `alefita9@gmail.com`
  - `www.adi2010@gmail.com`
- **Contraseña única**: `2naranjas` (hash almacenado, no en texto plano)
- Validación de permisos por usuario
- Sesión persistente en localStorage

### 👨‍💼 Panel de Administración
Los usuarios autorizados pueden:
- ✅ **Agregar productos** con imágenes, precios, descripciones y categorías
- ✅ **Subir diseños 3D** (archivos STL/OBJ con URLs)
- ✅ **Ver y descargar** SOLO sus propios diseños 3D
- ✅ **Editar/eliminar** SOLO los productos que ellos crearon
- ✅ **Ver pedidos** de clientes con gestión de estados
- ✅ **Visualizar todos los productos** (lectura de productos de otros admins)

### 🛍️ Catálogo de Productos
- **6 Categorías**: Decoración, Juguetes, Herramientas, Miniaturas, Prototipos, Personalizado
- **Filtros avanzados**: Por categoría y ordenamiento (más recientes, precio, popularidad)
- **Vista Grid/List**: Cambia entre vista de cuadrícula y lista
- **Búsqueda en tiempo real**: Encuentra productos instantáneamente
- **Tarjetas interactivas**: Con hover effects y animaciones suaves

### 🛒 Carrito de Compras Completo
- Agregar/eliminar productos
- Control de cantidad (+/-)
- Cálculo automático de subtotales y total
- Persistencia en localStorage
- Badge con contador en el navbar
- Modal con resumen de compra

### 📦 Sistema de Pedidos
- Formulario de checkout completo
- Captura de datos del cliente:
  - Nombre completo
  - Email y teléfono
  - Dirección de envío
  - Notas adicionales
- Confirmación visual con número de pedido
- Gestión de estados en panel admin (Pendiente, Procesando, Enviado, Entregado, Cancelado)

### ❤️ Sistema de Favoritos
- Marcar productos como favoritos
- Vista de favoritos guardados
- Badge con contador
- Persistencia en localStorage
- Iconos animados

### 🧮 Calculadora de Precios Inteligente
Calcula el precio estimado según:
- **Tamaño** (cm³): Control con slider
- **Material**: PLA, ABS, PETG, TPU, Nylon, Resina (diferentes precios)
- **Calidad de impresión**: Borrador, Normal, Alta, Ultra (diferentes multiplicadores)
- **Relleno** (%): Afecta la cantidad de material
- **Extras**:
  - Soportes (+15%)
  - Color personalizado (+€5)
- **Desglose detallado**: Material, Calidad, Extras y Total
- **Botón de presupuesto**: Copia los detalles y pre-llena el formulario de contacto

### 🎮 Visualizador 3D Interactivo
- Integración con **Three.js**
- Soporte para archivos **STL** y **OBJ**
- Controles OrbitControls:
  - Rotación con mouse
  - Zoom con scroll
  - Auto-rotación activada
- Vista previa en modal de detalle de producto
- Iluminación profesional
- Grid helper para referencia

### 🖼️ Galería de Trabajos
- Muestra productos populares
- Overlay con información al hover
- Click para ver detalles del producto
- Grid responsive

### 📱 Diseño Moderno y Responsive
- **Glassmorphism effects**: Fondos con blur y transparencias
- **Gradientes vibrantes**: Primary (cyan) + Accent (purple) + Secondary (pink)
- **Animaciones suaves**: Transitions, hover effects, fade-ins
- **Formas flotantes**: Animación de fondo en hero section
- **Tipografía dual**:
  - Inter: Texto principal
  - Orbitron: Números y tech elements
- **100% Mobile-friendly**: Adaptado a todos los dispositivos
- **Dark theme**: Colores oscuros profesionales

---

## 🚀 Tecnologías Utilizadas

### Frontend
- **HTML5**: Estructura semántica y accesible
- **CSS3**: Diseño moderno con variables CSS, Grid, Flexbox
- **JavaScript ES6+**: Programación orientada a objetos, modular

### Librerías CDN
- **Three.js** (v0.160.0): Visualización 3D
- **STLLoader**: Carga de archivos STL
- **OrbitControls**: Controles de cámara 3D
- **Font Awesome** (v6.4.0): Iconos vectoriales
- **Google Fonts**: Inter + Orbitron

### Almacenamiento
- **localStorage**: Persistencia de datos (productos, carrito, favoritos, pedidos, sesión)

---

## 📁 Estructura del Proyecto

```
printverse3d/
│
├── index.html              # Página principal con todas las secciones
│
├── css/
│   └── style.css          # Estilos completos (38KB+)
│
├── js/
│   ├── auth.js            # Sistema de autenticación
│   ├── products.js        # Gestión de productos y admin
│   ├── cart.js            # Carrito de compras y pedidos
│   ├── favorites.js       # Sistema de favoritos
│   ├── calculator.js      # Calculadora de precios
│   ├── viewer3d.js        # Visualizador 3D con Three.js
│   └── main.js            # Script principal e integraciones
│
└── README.md              # Este archivo
```

---

## 🎯 Funcionalidades Implementadas

### ✅ Completadas

#### Autenticación y Seguridad
- [x] Lista blanca de correos autorizados
- [x] Hash de contraseña
- [x] Validación de permisos por usuario
- [x] Sesión persistente
- [x] Sistema de logout

#### Gestión de Productos
- [x] CRUD completo de productos
- [x] Subida de diseños 3D (URLs)
- [x] Filtrado por categoría
- [x] Ordenamiento múltiple
- [x] Búsqueda en tiempo real
- [x] Vista grid/list
- [x] Modal de detalle expandido
- [x] Control de permisos (solo editar propios)

#### E-Commerce
- [x] Carrito de compras funcional
- [x] Control de cantidades
- [x] Sistema de checkout
- [x] Captura de datos de envío
- [x] Confirmación de pedidos
- [x] Gestión de estados de pedidos

#### Características Extra
- [x] Sistema de favoritos
- [x] Calculadora de precios
- [x] Visualizador 3D con Three.js
- [x] Galería de trabajos
- [x] Formulario de contacto
- [x] Newsletter subscription
- [x] Animaciones y transiciones
- [x] Notificaciones toast
- [x] Responsive design completo

---

## 🔧 Configuración e Instalación

### Requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conexión a internet (para cargar CDN)

### Instalación Local

1. **Clonar o descargar** el proyecto

2. **Abrir `index.html`** directamente en tu navegador
   ```bash
   # En macOS
   open index.html
   
   # En Linux
   xdg-open index.html
   
   # En Windows
   start index.html
   ```

3. **O usar un servidor local** (recomendado)
   ```bash
   # Con Python 3
   python -m http.server 8000
   
   # Con Node.js (http-server)
   npx http-server
   
   # Con PHP
   php -S localhost:8000
   ```

4. **Acceder** en tu navegador:
   ```
   http://localhost:8000
   ```

---

## 👤 Acceso Administrativo

### Credenciales

**Usuarios autorizados:**
- Email 1: `alefita9@gmail.com`
- Email 2: `www.adi2010@gmail.com`
- Contraseña: `2naranjas`

### Cómo Iniciar Sesión

1. Click en el botón **"Admin"** en el navbar (superior derecha)
2. Ingresar uno de los correos autorizados
3. Ingresar la contraseña: `2naranjas`
4. Click en **"Iniciar Sesión"**

### Panel de Administración

Una vez autenticado, verás 3 pestañas:

#### 📦 Productos
- Lista de todos los productos
- Solo puedes editar/eliminar tus propios productos
- Botón "Nuevo Producto" para agregar
- Tabla con información completa

#### 🎨 Mis Diseños
- Visualiza tus diseños 3D subidos
- Descarga archivos STL/OBJ
- Solo ves los diseños que tú creaste

#### 🛍️ Pedidos
- Lista de todos los pedidos recibidos
- Gestión de estados
- Información de clientes
- Detalles de productos pedidos

---

## 💡 Uso de la Plataforma

### Para Clientes

1. **Explorar catálogo**
   - Navega por categorías
   - Usa filtros y ordenamiento
   - Busca productos específicos

2. **Ver detalles**
   - Click en cualquier producto
   - Vista 3D interactiva (si tiene modelo)
   - Especificaciones completas

3. **Agregar al carrito**
   - Click en botón de carrito
   - Ajusta cantidades
   - Revisa el total

4. **Realizar pedido**
   - Click en "Realizar Pedido"
   - Completa tus datos
   - Confirma el pedido
   - Recibe número de pedido

5. **Calcular precio personalizado**
   - Ve a sección "Calculadora"
   - Ajusta parámetros (tamaño, material, calidad)
   - Solicita presupuesto

### Para Administradores

1. **Iniciar sesión**
   - Usar credenciales autorizadas

2. **Agregar producto**
   - Panel Admin > Productos > Nuevo Producto
   - Completar formulario:
     - Nombre
     - Categoría
     - Precio (€)
     - Descripción
     - URL de imagen
     - URL de modelo 3D (opcional)
   - Guardar

3. **Editar producto**
   - Solo tus propios productos
   - Click en ícono de editar
   - Modificar campos
   - Guardar cambios

4. **Gestionar pedidos**
   - Panel Admin > Pedidos
   - Cambiar estado del pedido:
     - Pendiente
     - Procesando
     - Enviado
     - Entregado
     - Cancelado

5. **Descargar diseños**
   - Panel Admin > Mis Diseños
   - Click en botón de descarga
   - Solo tus propios diseños

---

## 🎨 Personalización

### Cambiar Colores

Edita las variables CSS en `css/style.css`:

```css
:root {
    --primary: #00d9ff;        /* Color principal (cyan) */
    --primary-dark: #00a8cc;   /* Cyan oscuro */
    --secondary: #ff006e;      /* Rosa */
    --accent: #8338ec;         /* Púrpura */
    --bg-dark: #0f0f1e;       /* Fondo oscuro */
    --bg-card: #1a1a2e;       /* Fondo tarjetas */
    /* ... más variables ... */
}
```

### Agregar Categorías

En `js/products.js`, modifica:

```javascript
// Añadir en los select del HTML
<option value="nueva-categoria">Nueva Categoría</option>

// Añadir traducción
getCategoryName(category) {
    const names = {
        // ... categorías existentes ...
        'nueva-categoria': 'Nueva Categoría'
    };
    return names[category] || category;
}
```

### Cambiar Contraseña

En `js/auth.js`, modifica:

```javascript
// Generar nuevo hash
this.passwordHash = this.simpleHash('tu_nueva_contraseña');
```

**⚠️ IMPORTANTE**: En producción, usar un sistema de hash más seguro como bcrypt.

### Modificar Correos Autorizados

En `js/auth.js`, modifica:

```javascript
this.whitelist = [
    'nuevo-email1@ejemplo.com',
    'nuevo-email2@ejemplo.com'
];
```

---

## 🔮 Características Innovadoras

### 1. **Visualización 3D en Tiempo Real**
- Primera impresión visual del producto antes de comprar
- Rotación 360° interactiva
- Zoom y panorámica

### 2. **Calculadora de Precios Dinámica**
- Cálculo en tiempo real
- Múltiples variables
- Desglose transparente de costos

### 3. **Sistema de Permisos Granular**
- Cada admin solo edita sus productos
- Visibilidad compartida del catálogo
- Privacidad en diseños 3D

### 4. **Glassmorphism Design**
- Efectos de vidrio esmerilado
- Backdrops con blur
- Transparencias elegantes

### 5. **Animaciones Fluidas**
- Transiciones suaves en todos los elementos
- Hover effects interactivos
- Scroll animations
- Loading states

### 6. **Búsqueda Inteligente**
- Búsqueda instantánea sin delay
- Búsqueda por nombre, descripción y categoría
- Resultados con preview

---

## 📊 Datos de Ejemplo

Al cargar la página por primera vez, se crean **6 productos de muestra**:

1. **Jarrón Geométrico** - Decoración - €25.99
2. **Figura de Dragón** - Miniaturas - €35.50
3. **Organizador de Escritorio** - Herramientas - €18.99
4. **Maceta Decorativa** - Decoración - €22.00
5. **Juguete Educativo** - Juguetes - €15.50
6. **Soporte para Móvil** - Herramientas - €12.99

Estos productos se distribuyen entre los 2 usuarios autorizados para demostrar el sistema de permisos.

---

## 🐛 Troubleshooting

### Problema: No se ven los productos
**Solución**: Abre la consola del navegador (F12) y verifica errores. Los productos se cargan desde localStorage.

### Problema: No puedo iniciar sesión
**Solución**: Verifica que estés usando uno de los correos autorizados exactamente como están escritos:
- `alefita9@gmail.com`
- `www.adi2010@gmail.com`

Y la contraseña: `2naranjas`

### Problema: El visor 3D no funciona
**Solución**: 
- Verifica conexión a internet (Three.js se carga por CDN)
- Asegúrate de que el producto tenga una URL válida de modelo 3D
- Revisa la consola para errores de CORS

### Problema: Los estilos no se cargan
**Solución**: Verifica que `css/style.css` esté en la ubicación correcta respecto a `index.html`

### Problema: Datos persistentes no se guardan
**Solución**: Verifica que localStorage esté habilitado en tu navegador (modo incógnito puede deshabilitarlo)

---

## 🚀 Despliegue en Producción

### Opción 1: GitHub Pages

1. Sube el proyecto a un repositorio de GitHub
2. Ve a Settings > Pages
3. Selecciona la rama main
4. ¡Listo! Tu sitio estará en `https://tu-usuario.github.io/nombre-repo`

### Opción 2: Netlify

1. Arrastra la carpeta del proyecto a [Netlify Drop](https://app.netlify.com/drop)
2. Tu sitio estará live en segundos
3. Obtendrás un dominio tipo `nombre-aleatorio.netlify.app`

### Opción 3: Vercel

```bash
# Instalar Vercel CLI
npm i -g vercel

# Desplegar
vercel
```

### Opción 4: Servidor Propio

1. Sube los archivos por FTP/SFTP
2. Asegúrate de que el servidor sirva `index.html` por defecto
3. Configura HTTPS (recomendado)

---

## 🔒 Seguridad

### Consideraciones Importantes

#### ⚠️ Para Desarrollo/Demo
El sistema actual usa:
- Hash simple de contraseña (no bcrypt)
- localStorage para sesiones (no JWT)
- Sin encriptación de datos sensibles

#### ✅ Para Producción, implementar:
1. **Backend con API REST**
   - Node.js + Express
   - Base de datos (MongoDB/PostgreSQL)
   - Sistema de autenticación con JWT
   - Bcrypt para passwords
   - Rate limiting

2. **HTTPS obligatorio**
   - Certificado SSL/TLS
   - Secure cookies

3. **Variables de entorno**
   - No hardcodear credenciales
   - Usar `.env` files

4. **Validación server-side**
   - No confiar en validación cliente
   - Sanitizar inputs

---

## 📈 Mejoras Futuras

### Próximas Características

#### Fase 2
- [ ] Integración con pasarela de pago real (Stripe/PayPal)
- [ ] Envío de emails automáticos (confirmación, seguimiento)
- [ ] Sistema de chat en vivo
- [ ] Reviews y calificaciones de productos
- [ ] Wishlist compartible por URL
- [ ] Comparador de productos

#### Fase 3
- [ ] Panel de analíticas para admins
- [ ] Sistema de cupones y descuentos
- [ ] Programa de referidos
- [ ] Blog de noticias y tutoriales
- [ ] Multiidioma (i18n)
- [ ] Dark/Light theme toggle

#### Fase 4
- [ ] Progressive Web App (PWA)
- [ ] Notificaciones push
- [ ] Modo offline
- [ ] Realidad aumentada (AR) para vista previa
- [ ] Generador de modelos 3D con IA
- [ ] Integración con impresoras 3D

---

## 🤝 Contribuciones

Este proyecto está abierto a mejoras. Si deseas contribuir:

1. Fork el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

---

## 👨‍💻 Autor

**PrintVerse 3D Team**
- Email: contacto@printverse3d.com
- Website: [printverse3d.com](#)

---

## 🙏 Agradecimientos

- **Three.js** - Librería 3D increíble
- **Font Awesome** - Iconos hermosos
- **Unsplash** - Imágenes de muestra
- **Google Fonts** - Tipografías elegantes

---

## 📞 Soporte

¿Necesitas ayuda? Contáctanos:

- 📧 Email: soporte@printverse3d.com
- 💬 Discord: [PrintVerse 3D Community](#)
- 📱 WhatsApp: +34 123 456 789

---

<div align="center">

**⭐ Si te gusta este proyecto, dale una estrella ⭐**

Hecho con ❤️ y mucho ☕ por el equipo de PrintVerse 3D

</div>
