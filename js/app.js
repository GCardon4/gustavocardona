// ===================================
// CONFIGURACIÓN INICIAL
// ===================================

// Inicializar la aplicación cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', inicializarApp);

function inicializarApp() {
    configurarNavegacion();
    configurarScrollSuave();
    configurarFormularioContacto();
    configurarAnimacionesScroll();
    configurarNavbarScroll();
}

// ===================================
// NAVEGACIÓN MÓVIL
// ===================================

function configurarNavegacion() {
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');

    if (navToggle) {
        navToggle.addEventListener('click', toggleMenuMovil);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', cerrarMenuMovil);
    });
}

function toggleMenuMovil() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

function cerrarMenuMovil() {
    const navMenu = document.getElementById('navMenu');
    const navToggle = document.getElementById('navToggle');
    
    navMenu.classList.remove('active');
    navToggle.classList.remove('active');
}

// ===================================
// SCROLL SUAVE
// ===================================

function configurarScrollSuave() {
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', (e) => {
            const href = enlace.getAttribute('href');
            
            if (href === '#' || href === '') return;
            
            e.preventDefault();
            
            const seccionDestino = document.querySelector(href);
            
            if (seccionDestino) {
                const offsetTop = seccionDestino.offsetTop - 80;
                
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
                
                actualizarEnlaceActivo(enlace);
            }
        });
    });
}

function actualizarEnlaceActivo(enlaceActivo) {
    const enlaces = document.querySelectorAll('.nav-link');
    enlaces.forEach(link => link.classList.remove('active'));
    enlaceActivo.classList.add('active');
}

// ===================================
// NAVBAR AL HACER SCROLL
// ===================================

function configurarNavbarScroll() {
    const navbar = document.getElementById('navbar');
    let ultimoScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollActual = window.pageYOffset;
        
        if (scrollActual > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        ultimoScroll = scrollActual;
    });
}

// ===================================
// ANIMACIONES AL HACER SCROLL
// ===================================

function configurarAnimacionesScroll() {
    const elementosObservables = document.querySelectorAll(
        '.feature-card, .tech-category, .project-card, .stat-item'
    );

    const opcionesObservador = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.style.opacity = '0';
                entrada.target.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    entrada.target.style.transition = 'all 0.6s ease-out';
                    entrada.target.style.opacity = '1';
                    entrada.target.style.transform = 'translateY(0)';
                }, 100);
                
                observador.unobserve(entrada.target);
            }
        });
    }, opcionesObservador);

    elementosObservables.forEach(elemento => {
        observador.observe(elemento);
    });
}

// ===================================
// FORMULARIO DE CONTACTO
// ===================================

function configurarFormularioContacto() {
    const formulario = document.getElementById('contactForm');
    
    if (formulario) {
        formulario.addEventListener('submit', manejarEnvioFormulario);
    }
}

function manejarEnvioFormulario(e) {
    e.preventDefault();
    
    const formData = {
        nombre: document.getElementById('nombre').value,
        email: document.getElementById('email').value,
        asunto: document.getElementById('asunto').value,
        mensaje: document.getElementById('mensaje').value
    };
    
    // Validar campos
    if (!validarFormulario(formData)) {
        mostrarNotificacion('Por favor, completa todos los campos correctamente', 'error');
        return;
    }
    
    // Simular envío (aquí integrarías con tu backend)
    enviarFormulario(formData);
}

function validarFormulario(datos) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!datos.nombre.trim() || datos.nombre.length < 2) {
        return false;
    }
    
    if (!emailRegex.test(datos.email)) {
        return false;
    }
    
    if (!datos.asunto.trim() || datos.asunto.length < 3) {
        return false;
    }
    
    if (!datos.mensaje.trim() || datos.mensaje.length < 10) {
        return false;
    }
    
    return true;
}

function enviarFormulario(datos) {
    // Mostrar estado de carga
    const botonEnviar = document.querySelector('.contact-form button[type="submit"]');
    const textoOriginal = botonEnviar.textContent;
    botonEnviar.textContent = 'Enviando...';
    botonEnviar.disabled = true;
    
    // Simular envío asíncrono
    setTimeout(() => {
        console.log('Datos del formulario:', datos);
        
        // Construir enlace mailto como alternativa
        const mailtoLink = `mailto:admin@gustavocardona.com?subject=${encodeURIComponent(datos.asunto)}&body=${encodeURIComponent(`Nombre: ${datos.nombre}\nEmail: ${datos.email}\n\nMensaje:\n${datos.mensaje}`)}`;
        
        window.location.href = mailtoLink;
        
        // Mostrar mensaje de éxito
        mostrarNotificacion('¡Mensaje enviado con éxito! Te contactaré pronto.', 'success');
        
        // Limpiar formulario
        document.getElementById('contactForm').reset();
        
        // Restaurar botón
        botonEnviar.textContent = textoOriginal;
        botonEnviar.disabled = false;
    }, 1000);
}

// ===================================
// SISTEMA DE NOTIFICACIONES
// ===================================

function mostrarNotificacion(mensaje, tipo = 'info') {
    // Remover notificación previa si existe
    const notificacionPrevia = document.querySelector('.notificacion');
    if (notificacionPrevia) {
        notificacionPrevia.remove();
    }
    
    // Crear notificación
    const notificacion = document.createElement('div');
    notificacion.className = `notificacion notificacion-${tipo}`;
    notificacion.textContent = mensaje;
    
    // Estilos inline para la notificación
    Object.assign(notificacion.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        backgroundColor: tipo === 'success' ? '#10b981' : '#ef4444',
        color: 'white',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '9999',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '400px'
    });
    
    document.body.appendChild(notificacion);
    
    // Remover después de 4 segundos
    setTimeout(() => {
        notificacion.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notificacion.remove(), 300);
    }, 4000);
}

// ===================================
// DETECCIÓN DE SECCIÓN ACTIVA
// ===================================

function detectarSeccionActiva() {
    const secciones = document.querySelectorAll('section[id]');
    const enlaces = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        const scrollActual = window.pageYOffset;
        
        secciones.forEach(seccion => {
            const offsetSeccion = seccion.offsetTop - 100;
            const alturaSeccion = seccion.offsetHeight;
            const idSeccion = seccion.getAttribute('id');
            
            if (scrollActual >= offsetSeccion && scrollActual < offsetSeccion + alturaSeccion) {
                enlaces.forEach(enlace => {
                    enlace.classList.remove('active');
                    if (enlace.getAttribute('href') === `#${idSeccion}`) {
                        enlace.classList.add('active');
                    }
                });
            }
        });
    });
}

// Activar detección de sección activa
detectarSeccionActiva();

// ===================================
// ANIMACIONES CSS ADICIONALES
// ===================================

// Agregar estilos de animación dinámicamente
const estiloAnimaciones = document.createElement('style');
estiloAnimaciones.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(estiloAnimaciones);

// ===================================
// UTILIDADES
// ===================================

// Función auxiliar para throttle (limitar ejecución)
function throttle(func, delay) {
    let ultimaEjecucion = 0;
    return function(...args) {
        const ahora = Date.now();
        if (ahora - ultimaEjecucion >= delay) {
            func.apply(this, args);
            ultimaEjecucion = ahora;
        }
    };
}

// Función auxiliar para debounce (retrasar ejecución)
function debounce(func, delay) {
    let timeoutId;
    return function(...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
}

console.log('🚀 Portfolio de Gustavo Cardona cargado correctamente');
