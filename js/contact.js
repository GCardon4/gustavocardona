/**
 * Script para formulario de contacto
 * Validación y envío AJAX
 */

// Función para mostrar/ocultar contraseña
function togglePassword() {
    const inputContrasena = document.getElementById('contrasena');
    const btnToggle = document.querySelector('.toggle-password');
    
    if (inputContrasena.type === 'password') {
        inputContrasena.type = 'text';
        btnToggle.textContent = '🙈';
    } else {
        inputContrasena.type = 'password';
        btnToggle.textContent = '👁️';
    }
}

// Validación en tiempo real
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('contactForm');
    const nombre = document.getElementById('nombre');
    const correo = document.getElementById('correo');
    const contrasena = document.getElementById('contrasena');
    
    // Validar nombre
    nombre.addEventListener('blur', function() {
        const errorSpan = document.getElementById('nombreError');
        if (this.value.trim().length < 3) {
            errorSpan.textContent = 'El nombre debe tener al menos 3 caracteres';
            this.style.borderColor = '#ef4444';
        } else {
            errorSpan.textContent = '';
            this.style.borderColor = '#10b981';
        }
    });
    
    // Validar correo
    correo.addEventListener('blur', function() {
        const errorSpan = document.getElementById('correoError');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (!emailRegex.test(this.value)) {
            errorSpan.textContent = 'Ingresa un correo válido';
            this.style.borderColor = '#ef4444';
        } else {
            errorSpan.textContent = '';
            this.style.borderColor = '#10b981';
        }
    });
    
    // Validar contraseña
    contrasena.addEventListener('input', function() {
        const errorSpan = document.getElementById('contrasenaError');
        const hint = this.parentElement.parentElement.querySelector('.form-hint');
        
        if (this.value.length < 8) {
            errorSpan.textContent = 'La contraseña debe tener al menos 8 caracteres';
            this.style.borderColor = '#ef4444';
            hint.style.color = '#ef4444';
        } else {
            errorSpan.textContent = '✓ Contraseña válida';
            errorSpan.style.color = '#10b981';
            this.style.borderColor = '#10b981';
            hint.style.color = '#10b981';
        }
    });
    
    // Envío del formulario con AJAX
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Validar antes de enviar
        if (!validarFormulario()) {
            return;
        }
        
        // Obtener datos del formulario
        const formData = new FormData(form);
        
        // Cambiar estado del botón
        const btnSubmit = form.querySelector('.btn-submit');
        const btnText = btnSubmit.querySelector('.btn-text');
        const btnLoader = btnSubmit.querySelector('.btn-loader');
        
        btnSubmit.disabled = true;
        btnText.style.display = 'none';
        btnLoader.style.display = 'inline';
        
        // Enviar con AJAX
        fetch('php/procesar-contacto.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            mostrarMensaje(data.success, data.message);
            
            if (data.success) {
                form.reset();
                // Limpiar estilos de validación
                nombre.style.borderColor = '';
                correo.style.borderColor = '';
                contrasena.style.borderColor = '';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje(false, 'Error al enviar el formulario. Por favor intenta de nuevo.');
        })
        .finally(() => {
            // Restaurar botón
            btnSubmit.disabled = false;
            btnText.style.display = 'inline';
            btnLoader.style.display = 'none';
        });
    });
});

// Validar formulario completo
function validarFormulario() {
    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const contrasena = document.getElementById('contrasena').value;
    
    if (nombre.length < 3) {
        alert('El nombre debe tener al menos 3 caracteres');
        return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo)) {
        alert('Ingresa un correo electrónico válido');
        return false;
    }
    
    if (contrasena.length < 8) {
        alert('La contraseña debe tener al menos 8 caracteres');
        return false;
    }
    
    return true;
}

// Mostrar mensaje de respuesta
function mostrarMensaje(success, message) {
    const mensajeDiv = document.getElementById('mensajeRespuesta');
    
    mensajeDiv.textContent = message;
    mensajeDiv.className = 'mensaje-respuesta ' + (success ? 'success' : 'error');
    mensajeDiv.style.display = 'block';
    
    // Ocultar después de 5 segundos
    setTimeout(() => {
        mensajeDiv.style.display = 'none';
    }, 5000);
    
    // Scroll al mensaje
    mensajeDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
