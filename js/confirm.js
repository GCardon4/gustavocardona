// ===================================
// PÁGINA DE CONFIRMACIÓN - APP-STOCK
// INTEGRACIÓN CON SUPABASE
// ===================================

document.addEventListener('DOMContentLoaded', inicializarPaginaConfirmacion);

async function inicializarPaginaConfirmacion() {
    mostrarPantallaLoader();
    await procesarConfirmacionSupabase();
}

// ===================================
// PROCESAMIENTO DE CONFIRMACIÓN SUPABASE
// ===================================

async function procesarConfirmacionSupabase() {
    try {
        // Obtener parámetros de la URL enviados por Supabase
        const urlParams = new URLSearchParams(window.location.search);
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        
        // Supabase puede enviar el token en diferentes formatos
        const accessToken = hashParams.get('access_token') || urlParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token') || urlParams.get('refresh_token');
        const type = hashParams.get('type') || urlParams.get('type');
        const error = hashParams.get('error') || urlParams.get('error');
        const errorDescription = hashParams.get('error_description') || urlParams.get('error_description');

        console.log('📝 Parámetros recibidos:', { type, error });

        // Verificar si hay errores en la URL
        if (error) {
            throw new Error(errorDescription || 'Error en la verificación');
        }

        // Verificar el tipo de evento
        if (type === 'signup' || type === 'email_confirmation' || type === 'recovery') {
            // Obtener el usuario actual de Supabase
            const { data: { user }, error: userError } = await window.supabase.auth.getUser(accessToken);

            if (userError) {
                throw new Error('No se pudo verificar el usuario: ' + userError.message);
            }

            if (!user) {
                throw new Error('No se encontró información del usuario');
            }

            console.log('✅ Usuario verificado:', user);

            // Guardar sesión si hay tokens
            if (accessToken && refreshToken) {
                const { error: sessionError } = await window.supabase.auth.setSession({
                    access_token: accessToken,
                    refresh_token: refreshToken
                });

                if (sessionError) {
                    console.warn('⚠️ Error al establecer la sesión:', sessionError);
                }
            }

            // Actualizar el perfil del usuario si es necesario
            await actualizarPerfilUsuario(user);

            // Mostrar pantalla de éxito
            mostrarPantallaExito(user);

        } else {
            // Si no hay tipo específico, intentar verificar la sesión actual
            const { data: { session }, error: sessionError } = await window.supabase.auth.getSession();

            if (sessionError || !session) {
                throw new Error('No se pudo confirmar la verificación. El enlace puede haber expirado.');
            }

            mostrarPantallaExito(session.user);
        }

    } catch (error) {
        console.error('❌ Error en confirmación:', error);
        mostrarPantallaError(error.message);
    }
}

// ===================================
// ACTUALIZAR PERFIL DE USUARIO
// ===================================

async function actualizarPerfilUsuario(user) {
    try {
        // Aquí puedes actualizar información adicional en tu tabla de usuarios
        const { error } = await window.supabase
            .from('usuarios') // Nombre de tu tabla
            .upsert({
                id: user.id,
                email: user.email,
                email_confirmado: true,
                fecha_confirmacion: new Date().toISOString(),
                ultimo_acceso: new Date().toISOString()
            }, {
                onConflict: 'id'
            });

        if (error && error.code !== 'PGRST116') { // Ignorar si la tabla no existe
            console.warn('⚠️ No se pudo actualizar el perfil:', error);
        } else {
            console.log('✅ Perfil actualizado correctamente');
        }

    } catch (error) {
        console.warn('⚠️ Error al actualizar perfil:', error);
    }
}

// ===================================
// PANTALLAS DE ESTADO
// ===================================

function mostrarPantallaLoader() {
    document.getElementById('loadingScreen').style.display = 'flex';
    document.getElementById('errorScreen').style.display = 'none';
    document.getElementById('successScreen').style.display = 'none';
}

function mostrarPantallaExito(user) {
    // Ocultar loader
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'none';
    document.getElementById('successScreen').style.display = 'block';

    // Mostrar email del usuario
    const emailElement = document.getElementById('userEmail');
    if (emailElement && user?.email) {
        emailElement.textContent = user.email;
    }

    // Guardar datos en localStorage
    guardarEventoConfirmacion(user);

    // Animar elementos
    setTimeout(() => {
        animarElementos();
        configurarConfetti();
    }, 100);

    // Configurar botón de acceso
    configurarBotonAcceso();
}

function mostrarPantallaError(mensajeError) {
    document.getElementById('loadingScreen').style.display = 'none';
    document.getElementById('successScreen').style.display = 'none';
    document.getElementById('errorScreen').style.display = 'block';

    // Actualizar mensaje de error
    const errorDetails = document.getElementById('errorDetails');
    if (errorDetails) {
        errorDetails.textContent = mensajeError;
    }
}

// ===================================
// ANIMACIONES DE ELEMENTOS
// ===================================

function animarElementos() {
    // Animar la entrada de la página
    const card = document.querySelector('.confirm-card');
    
    if (card) {
        // Agregar clase para animación
        setTimeout(() => {
            card.classList.add('animated');
        }, 100);
    }

    // Animar los pasos secuencialmente
    const stepItems = document.querySelectorAll('.step-item');
    stepItems.forEach((item, index) => {
        setTimeout(() => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease-out';
            
            setTimeout(() => {
                item.style.opacity = '1';
                item.style.transform = 'translateY(0)';
            }, 50);
        }, 1000 + (index * 150));
    });
}

// ===================================
// EFECTO CONFETTI (OPCIONAL)
// ===================================

function configurarConfetti() {
    // Crear partículas de celebración
    const container = document.querySelector('.confirm-container');
    
    if (!container) return;

    // Lanzar confetti después de la animación del checkmark
    setTimeout(() => {
        crearConfetti(container);
    }, 1000);
}

function crearConfetti(container) {
    const colores = ['#6366f1', '#0ea5e9', '#10b981', '#f59e0b'];
    const cantidadParticulas = 30;

    for (let i = 0; i < cantidadParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'confetti-particle';
        
        const color = colores[Math.floor(Math.random() * colores.length)];
        const tamano = Math.random() * 10 + 5;
        const posicionX = Math.random() * 100;
        const duracion = Math.random() * 3 + 2;
        const retraso = Math.random() * 0.5;
        
        Object.assign(particula.style, {
            position: 'absolute',
            width: `${tamano}px`,
            height: `${tamano}px`,
            backgroundColor: color,
            borderRadius: '50%',
            top: '20%',
            left: `${posicionX}%`,
            animation: `confettiFall ${duracion}s ease-out ${retraso}s forwards`,
            opacity: '0',
            zIndex: '5',
            pointerEvents: 'none'
        });
        
        container.appendChild(particula);
        
        // Remover partícula después de la animación
        setTimeout(() => {
            particula.remove();
        }, (duracion + retraso) * 1000);
    }
}

// Agregar estilos de animación para confetti
const estiloConfetti = document.createElement('style');
estiloConfetti.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(600px) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(estiloConfetti);

// ===================================
// GUARDAR EVENTO DE CONFIRMACIÓN
// ===================================

function guardarEventoConfirmacion(user) {
    // Guardar en localStorage para referencia
    const datosConfirmacion = {
        fecha: new Date().toISOString(),
        email: user?.email || 'no especificado',
        userId: user?.id || null,
        confirmado: true
    };
    
    localStorage.setItem('appStockConfirmacion', JSON.stringify(datosConfirmacion));
    
    console.log('✅ Confirmación de registro exitosa:', datosConfirmacion);
    
    // Registrar evento en analytics
    registrarEventoAnalytics(datosConfirmacion);
}

// ===================================
// CONFIGURAR BOTÓN DE ACCESO
// ===================================

function configurarBotonAcceso() {
    const botonAcceso = document.getElementById('btnAccederApp');
    
    if (botonAcceso) {
        botonAcceso.addEventListener('click', async (e) => {
            e.preventDefault();
            
            try {
                // Verificar que hay una sesión activa
                const { data: { session } } = await window.supabase.auth.getSession();
                
                if (session) {
                    mostrarNotificacionAcceso();
                    
                    // Redirigir a tu aplicación
                    setTimeout(() => {
                        // Reemplaza con la URL de tu aplicación
                        window.location.href = '/app/dashboard'; // o 'https://app.app-stock.com/dashboard'
                    }, 1500);
                } else {
                    // Si no hay sesión, redirigir al login
                    window.location.href = '/login'; // o 'https://app.app-stock.com/login'
                }
            } catch (error) {
                console.error('Error al acceder:', error);
                window.location.href = '/login';
            }
        });
    }
}

function mostrarNotificacionAcceso() {
    const notificacion = document.createElement('div');
    notificacion.className = 'notificacion-acceso';
    notificacion.innerHTML = `
        <div class="notificacion-contenido">
            <span class="notificacion-icono">🚀</span>
            <span class="notificacion-texto">Redirigiendo a App-Stock...</span>
        </div>
    `;
    
    Object.assign(notificacion.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'linear-gradient(135deg, #6366f1 0%, #0ea5e9 100%)',
        color: 'white',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)',
        zIndex: '10000',
        animation: 'slideInRight 0.3s ease-out'
    });
    
    document.body.appendChild(notificacion);
    
    setTimeout(() => {
        notificacion.style.animation = 'slideOutRight 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 2000);
}

// Agregar estilos de animación para notificaciones
const estiloNotificacion = document.createElement('style');
estiloNotificacion.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .notificacion-contenido {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notificacion-icono {
        font-size: 1.5rem;
    }
    
    .notificacion-texto {
        font-weight: 600;
    }
`;
document.head.appendChild(estiloNotificacion);

// ===================================
// TRACKING Y ANALYTICS
// ===================================

function registrarEventoAnalytics(datos) {
    // Google Analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'registro_confirmado', {
            'event_category': 'Usuario',
            'event_label': 'Confirmación Email App-Stock',
            'user_id': datos.userId
        });
    }
    
    // Facebook Pixel
    if (typeof fbq !== 'undefined') {
        fbq('track', 'CompleteRegistration');
    }
    
    console.log('📊 Evento de confirmación registrado');
}

// ===================================
// UTILIDADES
// ===================================

// Función para obtener información del usuario actual
async function obtenerUsuarioActual() {
    try {
        const { data: { user }, error } = await window.supabase.auth.getUser();
        
        if (error) {
            throw error;
        }
        
        return user;
    } catch (error) {
        console.error('Error al obtener usuario:', error);
        return null;
    }
}

console.log('✅ Página de confirmación de App-Stock cargada correctamente');
