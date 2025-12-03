// ===================================
// PÁGINA DE CONFIRMACIÓN - APP-STOCK
// ===================================

document.addEventListener('DOMContentLoaded', inicializarPaginaConfirmacion);

function inicializarPaginaConfirmacion() {
    animarElementos();
    configurarConfetti();
    guardarEventoConfirmacion();
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

function guardarEventoConfirmacion() {
    // Obtener parámetros de la URL si existen
    const urlParams = new URLSearchParams(window.location.search);
    const email = urlParams.get('email');
    const token = urlParams.get('token');
    
    // Guardar en localStorage para referencia
    const datosConfirmacion = {
        fecha: new Date().toISOString(),
        email: email || 'no especificado',
        confirmado: true
    };
    
    localStorage.setItem('appStockConfirmacion', JSON.stringify(datosConfirmacion));
    
    console.log('✅ Confirmación de registro exitosa:', datosConfirmacion);
}

// ===================================
// MANEJO DE BOTONES
// ===================================

// Configurar botón de acceso a la aplicación
const botonAcceso = document.querySelector('.confirm-actions .btn-primary');
if (botonAcceso) {
    botonAcceso.addEventListener('click', (e) => {
        e.preventDefault();
        
        // Aquí se redigiría a la aplicación real
        mostrarNotificacionAcceso();
        
        // Simular redirección
        setTimeout(() => {
            // window.location.href = 'https://app.app-stock.com/login';
            console.log('Redirigiendo a la aplicación...');
        }, 2000);
    });
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
// TRACKING Y ANALYTICS (OPCIONAL)
// ===================================

function registrarEventoAnalytics() {
    // Aquí se integraría con Google Analytics, Mixpanel, etc.
    if (typeof gtag !== 'undefined') {
        gtag('event', 'registro_confirmado', {
            'event_category': 'Usuario',
            'event_label': 'Confirmación Email App-Stock'
        });
    }
    
    console.log('📊 Evento de confirmación registrado');
}

// Registrar evento cuando la página carga completamente
window.addEventListener('load', registrarEventoAnalytics);

console.log('✅ Página de confirmación de App-Stock cargada correctamente');
