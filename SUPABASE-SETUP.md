# Configuración de Confirmación de Email con Supabase

## 📋 Guía de Configuración

### 1. Configurar Credenciales de Supabase

Edita el archivo `js/supabase-config.js` y reemplaza las siguientes variables con tus credenciales:

```javascript
const SUPABASE_URL = 'https://tu-proyecto.supabase.co';
const SUPABASE_ANON_KEY = 'tu_clave_publica_anon_key';
```

**Dónde encontrar estas credenciales:**
1. Ve a tu proyecto en [Supabase Dashboard](https://app.supabase.com)
2. Navega a `Settings` > `API`
3. Copia:
   - **URL**: Project URL
   - **Anon Key**: anon/public key

---

### 2. Configurar Email Templates en Supabase

#### 2.1 Acceder a Email Templates

1. En tu proyecto de Supabase, ve a `Authentication` > `Email Templates`
2. Selecciona `Confirm signup`

#### 2.2 Personalizar el Template

Reemplaza la URL de confirmación en el template con:

```html
{{ .SiteURL }}/confirm.html#access_token={{ .Token }}&type=signup
```

O si prefieres usar parámetros de query:

```html
{{ .SiteURL }}/confirm.html?token={{ .Token }}&type=signup
```

#### 2.3 Template Completo de Ejemplo

```html
<h2>Confirma tu registro en App-Stock</h2>

<p>Hola,</p>

<p>Gracias por registrarte en <strong>App-Stock</strong>. Para completar tu registro, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente enlace:</p>

<p>
  <a href="{{ .SiteURL }}/confirm.html#access_token={{ .Token }}&type=signup">
    Confirmar Email
  </a>
</p>

<p>Si no creaste esta cuenta, puedes ignorar este correo.</p>

<p>Saludos,<br>
El equipo de App-Stock</p>
```

---

### 3. Configurar Site URL

1. En Supabase Dashboard, ve a `Authentication` > `URL Configuration`
2. Configura:
   - **Site URL**: `https://tudominio.com` o `http://localhost:3000` (desarrollo)
   - **Redirect URLs**: Añade `https://tudominio.com/confirm.html`

---

### 4. Configurar Tabla de Usuarios (Opcional)

Si quieres guardar información adicional, crea una tabla `usuarios`:

```sql
CREATE TABLE usuarios (
  id UUID REFERENCES auth.users PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  email_confirmado BOOLEAN DEFAULT FALSE,
  fecha_confirmacion TIMESTAMP WITH TIME ZONE,
  ultimo_acceso TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

-- Política para que los usuarios solo vean su propia información
CREATE POLICY "Los usuarios pueden ver su propia información"
  ON usuarios FOR SELECT
  USING (auth.uid() = id);

-- Política para que los usuarios puedan actualizar su propia información
CREATE POLICY "Los usuarios pueden actualizar su propia información"
  ON usuarios FOR UPDATE
  USING (auth.uid() = id);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON usuarios
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

---

### 5. Flujo de Confirmación

#### Paso a Paso:

1. **Usuario se registra**: Llama a `supabase.auth.signUp({ email, password })`
2. **Supabase envía email**: Con el enlace a `confirm.html` y el token
3. **Usuario hace clic**: Se abre `confirm.html` con los parámetros
4. **La página procesa**:
   - Extrae el `access_token` de la URL
   - Verifica al usuario con `supabase.auth.getUser(token)`
   - Actualiza la tabla `usuarios` (opcional)
   - Muestra pantalla de éxito
5. **Usuario accede**: Redirige a la aplicación con sesión activa

---

### 6. Personalizar Redirecciones

En `js/confirm.js`, busca la función `configurarBotonAcceso()` y modifica las URLs:

```javascript
// Producción
window.location.href = 'https://app.tudominio.com/dashboard';

// Desarrollo local
window.location.href = 'http://localhost:3000/dashboard';
```

---

### 7. Manejo de Errores

La página maneja automáticamente:

- ✅ Token expirado
- ✅ Token inválido
- ✅ Errores de red
- ✅ Usuario no encontrado

Los usuarios verán una pantalla de error amigable con opciones para:
- Volver al inicio
- Contactar soporte

---

### 8. Testing

#### En Desarrollo Local:

1. Configura el Site URL a `http://localhost:3000` en Supabase
2. Ejecuta tu servidor local
3. Prueba el registro y verifica que el email llegue con la URL correcta

#### En Producción:

1. Actualiza el Site URL a tu dominio real
2. Asegúrate de que `confirm.html` sea accesible públicamente
3. Verifica SSL/HTTPS activo

---

### 9. Variables de Entorno (Recomendado)

Para mayor seguridad, considera usar variables de entorno:

```javascript
// js/supabase-config.js
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;
```

---

### 10. Checklist de Implementación

- [ ] Credenciales de Supabase configuradas en `supabase-config.js`
- [ ] Email template actualizado en Supabase
- [ ] Site URL configurado correctamente
- [ ] Redirect URLs añadidas
- [ ] Tabla `usuarios` creada (opcional)
- [ ] URLs de redirección actualizadas en `confirm.js`
- [ ] Página probada en desarrollo
- [ ] Página probada en producción

---

## 🔧 Solución de Problemas

### El email no llega
- Verifica la configuración SMTP en Supabase
- Revisa la carpeta de spam
- Comprueba los logs en Supabase Dashboard

### Error "Token inválido"
- El token tiene una validez de 1 hora por defecto
- Solicita un nuevo email de confirmación

### Página muestra error de CORS
- Verifica que el dominio esté en Redirect URLs
- Comprueba la configuración de Site URL

---

## 📞 Soporte

Si necesitas ayuda:
- Email: admin@gustavocardona.com
- Documentación Supabase: https://supabase.com/docs/guides/auth
