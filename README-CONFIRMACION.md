# 🚀 Sistema de Confirmación de Email con Supabase - App-Stock

## 📦 Archivos Creados/Modificados

### Páginas HTML
- ✅ `confirm.html` - Página de confirmación de email (PRINCIPAL)
- ✅ `registro-ejemplo.html` - Ejemplo de página de registro

### JavaScript
- ✅ `js/supabase-config.js` - Configuración de credenciales Supabase
- ✅ `js/confirm.js` - Lógica de confirmación (ACTUALIZADO)
- ✅ `js/registro-ejemplo.js` - Ejemplo de lógica de registro

### CSS
- ✅ `css/confirm.css` - Estilos de confirmación (ACTUALIZADO)

### Documentación
- ✅ `SUPABASE-SETUP.md` - Guía completa de configuración

---

## 🎯 Características Implementadas

### Página de Confirmación (`confirm.html`)

#### ✨ Estados de la Página

1. **Loading Screen**
   - Se muestra mientras se verifica el token
   - Spinner animado
   - Mensaje "Verificando tu cuenta..."

2. **Success Screen** (Confirmación Exitosa)
   - Animación de checkmark ✓
   - Efecto confetti celebratorio
   - Email del usuario visible
   - 4 próximos pasos claros
   - Tarjetas informativas
   - Botón de acceso a la aplicación
   - Enlaces a soporte

3. **Error Screen** (Error en Verificación)
   - Animación de error ✕
   - Mensaje descriptivo del error
   - Opciones para volver o contactar soporte

#### 🔐 Integración con Supabase

- Extrae automáticamente el `access_token` de la URL
- Verifica el usuario con `supabase.auth.getUser()`
- Establece la sesión automáticamente
- Actualiza tabla de usuarios (opcional)
- Maneja errores de token expirado/inválido

#### 📊 Tracking y Analytics

- Guarda evento en localStorage
- Preparado para Google Analytics
- Preparado para Facebook Pixel
- Registra fecha y usuario

---

## ⚙️ Configuración Rápida

### Paso 1: Credenciales de Supabase

Edita `js/supabase-config.js`:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu_anon_key_aqui';
```

### Paso 2: Email Template en Supabase

1. Ve a `Authentication` > `Email Templates` > `Confirm signup`
2. Actualiza la URL de confirmación:

```
{{ .SiteURL }}/confirm.html#access_token={{ .Token }}&type=signup
```

### Paso 3: Site URL

1. Ve a `Authentication` > `URL Configuration`
2. Configura:
   - **Site URL**: `https://gustavocardona.com`
   - **Redirect URLs**: `https://gustavocardona.com/confirm.html`

### Paso 4: Personalizar Redirección

En `js/confirm.js`, línea ~120, actualiza:

```javascript
window.location.href = '/app/dashboard'; // Tu URL de aplicación
```

---

## 🔄 Flujo Completo

```
1. Usuario visita registro-ejemplo.html
   ↓
2. Completa formulario y envía
   ↓
3. JavaScript llama a supabase.auth.signUp()
   ↓
4. Supabase envía email con enlace:
   https://tudominio.com/confirm.html#access_token=XXX&type=signup
   ↓
5. Usuario hace clic en el enlace
   ↓
6. confirm.html se carga y:
   - Muestra loading screen
   - Extrae el token de la URL
   - Verifica con supabase.auth.getUser(token)
   - Actualiza tabla usuarios (opcional)
   ↓
7. Si todo OK:
   - Muestra success screen
   - Guarda sesión
   - Usuario puede acceder a la app
   ↓
8. Si hay error:
   - Muestra error screen
   - Opciones para volver o contactar
```

---

## 📝 Tabla de Usuarios (Opcional)

Si quieres guardar info adicional, crea esta tabla en Supabase:

```sql
CREATE TABLE usuarios (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_confirmado BOOLEAN DEFAULT FALSE,
  fecha_confirmacion TIMESTAMP WITH TIME ZONE,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

El código en `confirm.js` intentará actualizar esta tabla automáticamente.

---

## 🧪 Testing

### Desarrollo Local

```bash
# 1. Configura Site URL en Supabase a:
http://localhost:3000

# 2. Inicia tu servidor local
python -m http.server 3000

# 3. Visita:
http://localhost:3000/registro-ejemplo.html

# 4. Registra un usuario de prueba
# 5. Revisa tu email
# 6. Haz clic en el enlace de confirmación
```

### Producción

```bash
# 1. Actualiza Site URL en Supabase a:
https://gustavocardona.com

# 2. Sube archivos al servidor
# 3. Prueba el flujo completo
```

---

## 🎨 Personalización

### Cambiar Colores

En `css/confirm.css`, actualiza las variables:

```css
:root {
    --color-primary: #6366f1;  /* Color principal */
    --color-success: #10b981;  /* Color éxito */
}
```

### Cambiar Textos

En `confirm.html`, edita directamente los textos en español.

### Cambiar Próximos Pasos

En `confirm.html`, sección `.steps-grid`, modifica los 4 pasos.

---

## 🔧 Solución de Problemas

### El token expira rápido
- Por defecto Supabase tokens expiran en 1 hora
- Configura en Dashboard > Settings > Auth > JWT expiry

### Email no llega
- Verifica configuración SMTP en Supabase
- Revisa spam
- Comprueba logs en Dashboard

### Error CORS
- Añade tu dominio en Redirect URLs
- Verifica Site URL correcta

### Página en blanco
- Abre consola del navegador (F12)
- Verifica que `supabase-config.js` tenga credenciales correctas
- Confirma que el script de Supabase se cargó

---

## 📞 Variables de URL Supabase

Supabase puede enviar estos parámetros:

### En el Hash (#)
```
#access_token=XXX&refresh_token=YYY&type=signup
```

### En Query String (?)
```
?token=XXX&type=signup
```

El código maneja ambos formatos automáticamente.

---

## ✅ Checklist de Implementación

- [ ] Credenciales configuradas en `supabase-config.js`
- [ ] Email template actualizado en Supabase
- [ ] Site URL configurado
- [ ] Redirect URLs añadidas
- [ ] URL de redirección actualizada en `confirm.js`
- [ ] Probado en desarrollo
- [ ] Tabla `usuarios` creada (opcional)
- [ ] Probado en producción
- [ ] Analytics configurado (opcional)

---

## 🎓 Recursos

- [Documentación Supabase Auth](https://supabase.com/docs/guides/auth)
- [Supabase Email Templates](https://supabase.com/docs/guides/auth/auth-email-templates)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)

---

## 📧 Soporte

**Desarrollador**: Gustavo Cardona  
**Email**: admin@gustavocardona.com  
**Web**: https://gustavocardona.com

---

¡Tu sistema de confirmación de email está listo para usar! 🎉
