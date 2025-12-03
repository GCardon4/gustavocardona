// ===================================
// EJEMPLO DE INTEGRACIÓN DE REGISTRO
// Usa este código en tu página de registro
// ===================================

// Función para registrar un nuevo usuario
async function registrarUsuario(email, password, datosAdicionales = {}) {
    try {
        // Mostrar indicador de carga
        mostrarCargando(true);

        // Registrar usuario en Supabase
        const { data, error } = await window.supabase.auth.signUp({
            email: email,
            password: password,
            options: {
                data: {
                    nombre_completo: datosAdicionales.nombreCompleto || '',
                    nombre_empresa: datosAdicionales.nombreEmpresa || '',
                    telefono: datosAdicionales.telefono || ''
                },
                emailRedirectTo: `${window.location.origin}/confirm.html`
            }
        });

        if (error) {
            throw error;
        }

        // Verificar si se requiere confirmación de email
        if (data.user && !data.session) {
            // Email de confirmación enviado
            mostrarMensajeExito(
                '¡Registro exitoso!', 
                `Hemos enviado un email de confirmación a ${email}. Por favor revisa tu bandeja de entrada.`
            );
        } else if (data.session) {
            // Usuario registrado y confirmado automáticamente
            // (si tienes deshabilitada la confirmación de email)
            window.location.href = '/confirm.html';
        }

        return data;

    } catch (error) {
        console.error('Error en registro:', error);
        
        let mensajeError = 'Error al registrar usuario';
        
        // Mensajes personalizados según el error
        if (error.message.includes('already registered')) {
            mensajeError = 'Este email ya está registrado. ¿Quieres iniciar sesión?';
        } else if (error.message.includes('password')) {
            mensajeError = 'La contraseña debe tener al menos 6 caracteres';
        } else if (error.message.includes('email')) {
            mensajeError = 'Por favor ingresa un email válido';
        }
        
        mostrarMensajeError(mensajeError);
        throw error;
        
    } finally {
        mostrarCargando(false);
    }
}

// ===================================
// EJEMPLO DE FORMULARIO HTML
// ===================================

/*
<form id="formRegistro">
    <div class="form-group">
        <label for="nombreCompleto">Nombre Completo</label>
        <input type="text" id="nombreCompleto" required>
    </div>
    
    <div class="form-group">
        <label for="nombreEmpresa">Nombre de la Empresa</label>
        <input type="text" id="nombreEmpresa" required>
    </div>
    
    <div class="form-group">
        <label for="email">Email</label>
        <input type="email" id="email" required>
    </div>
    
    <div class="form-group">
        <label for="telefono">Teléfono (opcional)</label>
        <input type="tel" id="telefono">
    </div>
    
    <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" id="password" required minlength="6">
    </div>
    
    <div class="form-group">
        <label for="passwordConfirm">Confirmar Contraseña</label>
        <input type="password" id="passwordConfirm" required>
    </div>
    
    <button type="submit" class="btn btn-primary">Registrarse</button>
</form>
*/

// ===================================
// MANEJO DEL FORMULARIO
// ===================================

document.addEventListener('DOMContentLoaded', () => {
    const formRegistro = document.getElementById('formRegistro');
    
    if (formRegistro) {
        formRegistro.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Obtener valores del formulario
            const nombreCompleto = document.getElementById('nombreCompleto').value.trim();
            const nombreEmpresa = document.getElementById('nombreEmpresa').value.trim();
            const email = document.getElementById('email').value.trim();
            const telefono = document.getElementById('telefono').value.trim();
            const password = document.getElementById('password').value;
            const passwordConfirm = document.getElementById('passwordConfirm').value;
            
            // Validaciones
            if (password !== passwordConfirm) {
                mostrarMensajeError('Las contraseñas no coinciden');
                return;
            }
            
            if (password.length < 6) {
                mostrarMensajeError('La contraseña debe tener al menos 6 caracteres');
                return;
            }
            
            // Registrar usuario
            await registrarUsuario(email, password, {
                nombreCompleto,
                nombreEmpresa,
                telefono
            });
        });
    }
});

// ===================================
// FUNCIONES AUXILIARES UI
// ===================================

function mostrarCargando(visible) {
    const btnSubmit = document.querySelector('#formRegistro button[type="submit"]');
    if (btnSubmit) {
        if (visible) {
            btnSubmit.disabled = true;
            btnSubmit.innerHTML = '<span style="display: inline-block; animation: spin 1s linear infinite;">⏳</span> Registrando...';
        } else {
            btnSubmit.disabled = false;
            btnSubmit.textContent = 'Crear Cuenta';
        }
    }
}

function mostrarMensajeExito(titulo, mensaje) {
    const formRegistro = document.getElementById('formRegistro');
    const mensajeExito = document.getElementById('mensajeExito');
    const mensajeTexto = document.getElementById('mensajeExitoTexto');
    
    if (formRegistro && mensajeExito && mensajeTexto) {
        formRegistro.style.display = 'none';
        mensajeTexto.textContent = mensaje;
        mensajeExito.style.display = 'block';
        
        // Scroll al mensaje
        mensajeExito.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        // Fallback a alert
        alert(`${titulo}\n\n${mensaje}`);
    }
}

function mostrarMensajeError(mensaje) {
    // Crear notificación de error
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-error';
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span class="notificacion-icono">⚠️</span>
            <span class="notificacion-texto">${mensaje}</span>
        </div>
    `;
    
    Object.assign(notificacion.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 4000);
}

// ===================================
// VERIFICAR SESIÓN EXISTENTE
// ===================================

async function verificarSesionExistente() {
    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (session) {
        // Usuario ya tiene sesión activa, redirigir al dashboard
        window.location.href = '/app/dashboard';
    }
}

// Verificar al cargar la página
verificarSesionExistente();

// ===================================
// REENVIAR EMAIL DE CONFIRMACIÓN
// ===================================

async function reenviarEmailConfirmacion(email) {
    try {
        const { error } = await window.supabase.auth.resend({
            type: 'signup',
            email: email
        });

        if (error) {
            throw error;
        }

        mostrarMensajeExito(
            'Email reenviado',
            'Hemos enviado un nuevo email de confirmación. Por favor revisa tu bandeja de entrada.'
        );

    } catch (error) {
        console.error('Error al reenviar email:', error);
        mostrarMensajeError('No se pudo reenviar el email. Intenta de nuevo más tarde.');
    }
}

// ===================================
// EJEMPLO DE BOTÓN PARA REENVIAR EMAIL
// ===================================

/*
<button onclick="reenviarEmailConfirmacion('usuario@email.com')" class="btn btn-secondary">
    Reenviar email de confirmación
</button>
*/
