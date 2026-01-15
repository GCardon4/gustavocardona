/**
 * Script para envío de correos con Node.js y Nodemailer
 * 
 * Instalación:
 * npm install nodemailer
 * 
 * Uso:
 * node js/send-email.js
 */

const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const smtpConfig = require('./smtp-config');

class EmailService {
  constructor(provider = 'gmail') {
    this.config = smtpConfig[provider];
    this.transporter = nodemailer.createTransport(this.config);
  }

  /**
   * Cargar plantilla HTML y reemplazar variables
   */
  loadTemplate(templateName, variables = {}) {
    const templatePath = path.join(__dirname, '..', 'email-templates', `${templateName}.html`);
    let template = fs.readFileSync(templatePath, 'utf8');
    
    // Reemplazar variables {{VAR_NAME}} con valores
    Object.keys(variables).forEach(key => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, variables[key]);
    });
    
    return template;
  }

  /**
   * Enviar correo
   */
  async enviarCorreo(destinatario, asunto, templateName, variables = {}) {
    try {
      // Cargar plantilla con variables
      const htmlContent = this.loadTemplate(templateName, variables);
      
      const mailOptions = {
        from: `${smtpConfig.from.name} <${smtpConfig.from.email}>`,
        to: destinatario,
        subject: asunto,
        html: htmlContent
      };
      
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Correo enviado exitosamente');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId
      };
      
    } catch (error) {
      console.error('❌ Error al enviar correo:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Verificar configuración SMTP
   */
  async verificarConexion() {
    try {
      await this.transporter.verify();
      console.log('✅ Servidor SMTP listo para enviar correos');
      return true;
    } catch (error) {
      console.error('❌ Error en configuración SMTP:', error);
      return false;
    }
  }
}

// ============== EJEMPLOS DE USO ==============

async function ejemploEnvioCorreoBienvenida() {
  const emailService = new EmailService('gmail');
  
  // Verificar conexión primero
  const isReady = await emailService.verificarConexion();
  if (!isReady) return;
  
  // Datos para la plantilla
  const variables = {
    USER_NAME: 'Juan Pérez',
    USER_EMAIL: 'juan@example.com',
    COMPANY_NAME: 'Mi Empresa SAS',
    APP_URL: 'https://inventariosapp.com/login'
  };
  
  await emailService.enviarCorreo(
    'destinatario@example.com',
    '¡Bienvenido a Inventarios APP!',
    'welcome-email',
    variables
  );
}

async function ejemploEnvioReporteInventario() {
  const emailService = new EmailService('gmail');
  
  // Generar filas de productos
  const productosHtml = `
    <tr>
      <td>Producto A</td>
      <td style="color: #dc3545; font-weight: bold;">3</td>
      <td>$15.000</td>
    </tr>
    <tr>
      <td>Producto B</td>
      <td style="color: #dc3545; font-weight: bold;">1</td>
      <td>$25.000</td>
    </tr>
  `;
  
  const variables = {
    USER_NAME: 'María González',
    COMPANY_NAME: 'Distribuidora XYZ',
    REPORT_DATE: new Date().toLocaleDateString('es-ES'),
    TOTAL_PRODUCTS: '125',
    TOTAL_STOCK: '1,450',
    TOTAL_VALUE: '$12.500.000',
    PRODUCTS_LIST: productosHtml,
    APP_URL: 'https://inventariosapp.com/dashboard',
    SETTINGS_URL: 'https://inventariosapp.com/settings'
  };
  
  await emailService.enviarCorreo(
    'manager@example.com',
    '📊 Reporte Mensual de Inventario',
    'product-report',
    variables
  );
}

async function ejemploCorreoPersonalizado() {
  const emailService = new EmailService('custom');
  
  const variables = {
    COMPANY_NAME: 'Tu Empresa',
    EMAIL_TITLE: 'Actualización Importante',
    USER_NAME: 'Usuario',
    EMAIL_MESSAGE: 'Hemos actualizado nuestra plataforma con nuevas funcionalidades que te ayudarán a gestionar mejor tu inventario.',
    ACTION_TEXT: 'Ver Novedades',
    ACTION_URL: 'https://inventariosapp.com/novedades',
    UNSUBSCRIBE_URL: 'https://inventariosapp.com/unsubscribe'
  };
  
  await emailService.enviarCorreo(
    'cliente@example.com',
    'Novedades en Inventarios APP',
    'base-template',
    variables
  );
}

// Ejecutar ejemplo (descomentar el que necesites)
if (require.main === module) {
  // ejemploEnvioCorreoBienvenida();
  // ejemploEnvioReporteInventario();
  // ejemploCorreoPersonalizado();
  
  console.log('📧 Script de envío de correos cargado');
  console.log('Descomenta un ejemplo en el código para probar');
}

module.exports = EmailService;
