/**
 * Configuración SMTP para envío de correos
 * Guardar credenciales en variables de entorno en producción
 */

const smtpConfig = {
  // Gmail SMTP
  gmail: {
    host: 'smtp.gmail.com',
    port: 587, // o 465 para SSL
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.GMAIL_USER || 'tu-email@gmail.com',
      pass: process.env.GMAIL_APP_PASSWORD || 'tu-contraseña-de-aplicacion'
    }
  },

  // Outlook/Hotmail SMTP
  outlook: {
    host: 'smtp-mail.outlook.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.OUTLOOK_USER || 'tu-email@outlook.com',
      pass: process.env.OUTLOOK_PASSWORD || 'tu-contraseña'
    }
  },

  // SMTP personalizado
  custom: {
    host: process.env.SMTP_HOST || 'smtp.tudominio.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true' || false,
    auth: {
      user: process.env.SMTP_USER || 'correo@tudominio.com',
      pass: process.env.SMTP_PASSWORD || 'tu-contraseña'
    }
  },

  // SendGrid SMTP
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    secure: false,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY || 'tu-api-key'
    }
  },

  // Configuración de remitente
  from: {
    name: 'Inventarios APP',
    email: process.env.EMAIL_FROM || 'noreply@inventariosapp.com'
  }
};

// Para Node.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = smtpConfig;
}

// Para navegador (sólo configuración pública)
if (typeof window !== 'undefined') {
  window.smtpConfig = {
    from: smtpConfig.from
  };
}
