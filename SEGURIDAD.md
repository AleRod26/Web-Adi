# 🔒 Guía de Seguridad - PrintVerse 3D

## ⚠️ IMPORTANTE: Uso Actual

Este proyecto está configurado para **desarrollo y demostración**. Para uso en producción, se requieren mejoras significativas de seguridad.

---

## 🔐 Sistema de Autenticación Actual

### Implementación Actual

```javascript
// js/auth.js
this.whitelist = [
    'alefita9@gmail.com',
    'www.adi2010@gmail.com'
];

// Hash simple (NO usar en producción)
this.passwordHash = this.simpleHash('2naranjas');
```

### Limitaciones

❌ **Hash simple** - No es criptográficamente seguro
❌ **localStorage** - Datos visibles en el navegador
❌ **Sin expiración** - Las sesiones no caducan
❌ **Sin rate limiting** - Vulnerable a fuerza bruta
❌ **Contraseña en código** - Visible en el código fuente

---

## 🛡️ Recomendaciones para Producción

### 1. Backend con API REST

Implementar un servidor backend:

```javascript
// Ejemplo con Node.js + Express
const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Verificar email en base de datos
    const user = await db.findUserByEmail(email);
    
    // Comparar password con hash
    const valid = await bcrypt.compare(password, user.passwordHash);
    
    if (valid) {
        // Generar JWT
        const token = jwt.sign(
            { userId: user.id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        res.json({ token });
    } else {
        res.status(401).json({ error: 'Credenciales inválidas' });
    }
});
```

### 2. Hash Seguro de Contraseñas

Usar **bcrypt** o **argon2**:

```javascript
const bcrypt = require('bcrypt');

// Crear hash
const passwordHash = await bcrypt.hash('contraseña', 10);

// Verificar
const isValid = await bcrypt.compare('contraseña', passwordHash);
```

### 3. Tokens JWT

Implementar autenticación basada en tokens:

```javascript
// Generar token
const token = jwt.sign(
    { userId: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
);

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### 4. Variables de Entorno

Nunca hardcodear credenciales:

```bash
# .env
JWT_SECRET=tu_secret_super_seguro_aleatorio
DB_PASSWORD=password_base_datos
ADMIN_EMAILS=email1@ejemplo.com,email2@ejemplo.com
```

```javascript
// Cargar con dotenv
require('dotenv').config();

const jwtSecret = process.env.JWT_SECRET;
```

### 5. HTTPS Obligatorio

- Usar certificado SSL/TLS
- Redirigir HTTP → HTTPS
- HSTS headers

```javascript
// Express
app.use((req, res, next) => {
    if (req.header('x-forwarded-proto') !== 'https') {
        res.redirect(`https://${req.header('host')}${req.url}`);
    } else {
        next();
    }
});
```

### 6. Rate Limiting

Prevenir ataques de fuerza bruta:

```javascript
const rateLimit = require('express-rate-limit');

const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // 5 intentos
    message: 'Demasiados intentos, intenta en 15 minutos'
});

app.post('/api/login', loginLimiter, loginHandler);
```

### 7. Validación de Inputs

Sanitizar todos los inputs:

```javascript
const validator = require('validator');

// Validar email
if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido' });
}

// Escapar HTML
const safeName = validator.escape(name);
```

### 8. CSP Headers

Content Security Policy:

```javascript
app.use((req, res, next) => {
    res.setHeader(
        'Content-Security-Policy',
        "default-src 'self'; script-src 'self' cdn.jsdelivr.net"
    );
    next();
});
```

---

## 🔍 Vulnerabilidades Actuales

### 1. XSS (Cross-Site Scripting)

**Problema:** Los inputs no están sanitizados

```javascript
// Vulnerable
productName.innerHTML = userInput; // ❌

// Seguro
productName.textContent = userInput; // ✅
```

### 2. Inyección de Código

**Problema:** Uso de eval() o innerHTML con datos no confiables

**Solución:** Usar textContent, setAttribute, o librerías de sanitización

### 3. Exposición de Datos

**Problema:** Datos sensibles en localStorage

**Solución:** 
- Usar httpOnly cookies
- Encriptar datos sensibles
- Tokens con corta duración

### 4. Sin Protección CSRF

**Problema:** No hay tokens CSRF en formularios

**Solución:** Implementar tokens CSRF:

```javascript
const csrf = require('csurf');
const csrfProtection = csrf({ cookie: true });

app.post('/api/product', csrfProtection, productHandler);
```

---

## 🏗️ Arquitectura de Seguridad Recomendada

```
┌─────────────┐
│   Cliente   │
│  (Browser)  │
└──────┬──────┘
       │ HTTPS
       ▼
┌─────────────┐
│   Firewall  │
│     CDN     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  API Server │ ← Rate Limiting
│  (Node.js)  │ ← JWT Validation
└──────┬──────┘ ← Input Validation
       │
       ▼
┌─────────────┐
│  Database   │ ← Encrypted
│  (MongoDB)  │ ← Access Control
└─────────────┘
```

---

## 📋 Checklist de Seguridad para Producción

### Backend
- [ ] Implementar API REST
- [ ] Usar bcrypt para passwords
- [ ] Implementar JWT
- [ ] Variables de entorno
- [ ] Rate limiting
- [ ] Validación server-side
- [ ] Logging de seguridad
- [ ] Backups automáticos

### Frontend
- [ ] Sanitizar todos los inputs
- [ ] Usar HTTPS
- [ ] Implementar CSP
- [ ] No almacenar datos sensibles
- [ ] Tokens con expiración
- [ ] Logout completo
- [ ] Session timeout

### Infraestructura
- [ ] Certificado SSL/TLS
- [ ] Firewall configurado
- [ ] DDoS protection
- [ ] Monitoring y alertas
- [ ] Updates regulares
- [ ] Penetration testing
- [ ] Disaster recovery plan

---

## 🚨 Qué NO Hacer

### ❌ Nunca:

1. **Almacenar contraseñas en texto plano**
   ```javascript
   // MAL ❌
   const password = 'mi_contraseña';
   ```

2. **Confiar en validación cliente**
   ```javascript
   // MAL ❌ - Solo validación cliente
   if (isValid(input)) submit();
   
   // BIEN ✅ - Validar en servidor también
   ```

3. **Exponer información sensible**
   ```javascript
   // MAL ❌
   console.log('User password:', password);
   ```

4. **Usar eval() con input de usuario**
   ```javascript
   // MAL ❌
   eval(userInput);
   ```

5. **Hardcodear secrets**
   ```javascript
   // MAL ❌
   const API_KEY = 'sk_live_123456789';
   ```

---

## 🔄 Migración a Producción

### Paso 1: Setup Backend

```bash
mkdir backend
cd backend
npm init -y
npm install express bcrypt jsonwebtoken dotenv
```

### Paso 2: Crear API

```javascript
// backend/server.js
const express = require('express');
const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Rutas
app.post('/api/login', loginHandler);
app.get('/api/products', getProducts);
app.post('/api/products', authMiddleware, createProduct);

app.listen(3000, () => {
    console.log('API running on port 3000');
});
```

### Paso 3: Conectar Frontend

```javascript
// Reemplazar localStorage con API calls
async function login(email, password) {
    const response = await fetch('https://api.tudominio.com/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    });
    
    const { token } = await response.json();
    localStorage.setItem('token', token);
}
```

### Paso 4: Base de Datos

```javascript
// Usar MongoDB, PostgreSQL, etc.
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' }
});

const User = mongoose.model('User', UserSchema);
```

---

## 📚 Recursos Adicionales

### Documentación
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [JWT Best Practices](https://jwt.io/introduction)

### Librerías Recomendadas
- **bcrypt** - Hash de contraseñas
- **jsonwebtoken** - JWT tokens
- **helmet** - Security headers
- **express-rate-limit** - Rate limiting
- **validator** - Input validation
- **xss-clean** - XSS protection

### Testing
- **OWASP ZAP** - Security testing
- **Burp Suite** - Penetration testing
- **npm audit** - Vulnerabilidades en dependencias

---

## 📞 Contacto de Seguridad

Si encuentras una vulnerabilidad de seguridad, por favor repórtala de forma responsable:

📧 Email: security@printverse3d.com

**No divulgues públicamente vulnerabilidades sin contactarnos primero.**

---

## ⚖️ Disclaimer Legal

El código actual es para **fines educativos y de demostración**. El desarrollador no se hace responsable del uso indebido o de brechas de seguridad en implementaciones de producción sin las medidas de seguridad adecuadas.

**Antes de desplegar en producción con datos reales:**
1. Contrata una auditoría de seguridad
2. Implementa un backend robusto
3. Sigue todas las best practices
4. Obtén un certificado SSL
5. Configura backups automáticos
6. Implementa monitoring 24/7

---

<div align="center">

**🔒 La seguridad es responsabilidad de todos 🔒**

Mantén tu aplicación y tus usuarios seguros

</div>
