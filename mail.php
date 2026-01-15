<?php

class ContactForm {
    private $recipient;
    private $fromName;
    private $fromEmail;

    public function __construct($recipient, $fromName, $fromEmail) {
        $this->recipient = $recipient;
        $this->fromName = $fromName;
        $this->fromEmail = $fromEmail;
    }

    public function sendEmail($name, $email, $phone, $subject, $message) {
        $email_content = $this->buildEmailContent($name, $email, $phone, $subject, $message);
        $email_headers = $this->buildEmailHeaders();

        if (mail($this->recipient, $subject, $email_content, $email_headers)) {
            // Enviar correo de confirmación al usuario
            $this->sendConfirmationEmail($name, $email);
            
            http_response_code(200);
            echo "Gracias!! Tu mensaje ha sido enviado con exito.";
        } else {
            http_response_code(500);
            echo "Lo sentimos! No podemos enviar tu mensaje en estos momentos";
        }
    }

    /**
     * Enviar correo de confirmación al usuario con plantilla confirm.html
     */
    public function sendConfirmationEmail($userName, $userEmail) {
        $confirmContent = $this->buildConfirmationTemplate($userName);
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$this->fromName} <{$this->fromEmail}>\r\n";
        $headers .= "Reply-To: {$this->fromEmail}\r\n";
        
        @mail($userEmail, "Gracias por contactarnos - Inventarios APP", $confirmContent, $headers);
    }

    /**
     * Plantilla de confirmación basada en confirm.html
     */
    private function buildConfirmationTemplate($userName) {
        return "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                .header { background-color: #1e3a8a; color: #ffffff; padding: 30px; text-align: center; }
                .content { padding: 30px; background-color: #ffffff; }
                .credenziali { background-color: #f8fafc; border: 1px dashed #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .button { display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 style='margin:0; font-size: 24px;'>Inventarios APP</h1>
                    <p style='margin:5px 0 0; opacity: 0.8;'>Gestión inteligente de activos</p>
                </div>

                <div class='content'>
                    <p>Hola <strong>{$userName}</strong>,</p>
                    <p>Gracias por contactarnos. Hemos recibido tu mensaje correctamente y nos pondremos en contacto contigo muy pronto.</p>
                    
                    <p>Mientras tanto, te invitamos a explorar nuestra solución de <strong>Gestión de Inventarios (PWA)</strong>.</p>

                    <div class='credenziali'>
                        <h3 style='margin-top:0; color: #1e3a8a;'>🎯 Acceso a la Demo:</h3>
                        <p style='margin: 5px 0;'><strong>Enlace:</strong> <a href='https://inventarios-app.netlify.app/#/'>https://inventarios-app.netlify.app/</a></p>
                        <p style='margin: 5px 0;'><strong>Usuario:</strong> gerentecaramanta@gmail.com</p>
                        <p style='margin: 5px 0;'><strong>Contraseña:</strong> demo2026*</p>
                    </div>

                    <div style='text-align: center;'>
                        <a href='https://inventarios-app.netlify.app/#/' class='button'>INGRESAR A LA APP</a>
                    </div>

                    <h4 style='border-bottom: 2px solid #3b82f6; display: inline-block; margin-top: 30px;'>Lo que puedes probar:</h4>
                    <ul style='padding-left: 20px;'>
                        <li><strong>Módulo Bodega:</strong> Prueba el ingreso de productos usando solo tu voz.</li>
                        <li><strong>Módulo Manager:</strong> Visualiza el stock total y exporta reportes a Excel.</li>
                        <li><strong>Modo PWA:</strong> Ábrelo en tu móvil e \"instálalo\" como una App nativa.</li>
                    </ul>

                    <p style='font-size: 14px; color: #64748b; font-style: italic;'>Nota: Esta cuenta demo permite la visualización completa de funciones, pero los datos se resetean periódicamente.</p>
                </div>

                <div class='footer'>
                    <p>Si tienes dudas sobre la implementación, responde a este correo.</p>
                    <p><strong>Inventarios APP</strong> | Eficiencia en cada movimiento.</p>
                </div>
            </div>
        </body>
        </html>
        ";
    }

    private function buildEmailContent($name, $email, $phone, $subject, $message) {
        // Usar la plantilla HTML de confirm.html
        $htmlContent = "
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset='UTF-8'>
            <style>
                body { font-family: 'Segoe UI', Arial, sans-serif; line-height: 1.6; color: #333333; margin: 0; padding: 0; }
                .container { max-width: 600px; margin: 20px auto; border: 1px solid #e0e0e0; border-radius: 8px; overflow: hidden; }
                .header { background-color: #1e3a8a; color: #ffffff; padding: 30px; text-align: center; }
                .content { padding: 30px; background-color: #ffffff; }
                .data-box { background-color: #f8fafc; border: 1px dashed #3b82f6; padding: 20px; border-radius: 8px; margin: 20px 0; }
                .data-row { margin: 10px 0; padding: 8px 0; border-bottom: 1px solid #e2e8f0; }
                .data-label { font-weight: bold; color: #1e3a8a; display: inline-block; min-width: 100px; }
                .button { display: inline-block; padding: 15px 30px; background-color: #3b82f6; color: #ffffff; text-decoration: none; border-radius: 5px; font-weight: bold; margin-top: 10px; }
                .footer { background-color: #f1f5f9; padding: 20px; text-align: center; font-size: 12px; color: #64748b; }
                .message-box { background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 5px; }
            </style>
        </head>
        <body>
            <div class='container'>
                <div class='header'>
                    <h1 style='margin:0; font-size: 24px;'>📩 Nuevo Mensaje de Contacto</h1>
                    <p style='margin:5px 0 0; opacity: 0.8;'>{$this->fromName}</p>
                </div>

                <div class='content'>
                    <p>Has recibido un nuevo mensaje desde el formulario de contacto:</p>
                    
                    <div class='data-box'>
                        <h3 style='margin-top:0; color: #1e3a8a;'>📋 Datos del Contacto:</h3>
                        <div class='data-row'>
                            <span class='data-label'>👤 Nombre:</span>
                            <span>{$name}</span>
                        </div>
                        <div class='data-row'>
                            <span class='data-label'>📧 Email:</span>
                            <span><a href='mailto:{$email}'>{$email}</a></span>
                        </div>";
        
        if (!empty($phone)) {
            $htmlContent .= "
                        <div class='data-row'>
                            <span class='data-label'>📱 Teléfono:</span>
                            <span>{$phone}</span>
                        </div>";
        }
        
        $htmlContent .= "
                        <div class='data-row' style='border-bottom: none;'>
                            <span class='data-label'>📌 Asunto:</span>
                            <span>{$subject}</span>
                        </div>
                    </div>";
        
        if (!empty($message)) {
            $htmlContent .= "
                    <div class='message-box'>
                        <h4 style='margin-top:0; color: #92400e;'>💬 Mensaje:</h4>
                        <p style='white-space: pre-wrap; margin: 0;'>{$message}</p>
                    </div>";
        }
        
        $htmlContent .= "
                    <div style='text-align: center; margin-top: 30px;'>
                        <a href='mailto:{$email}' class='button'>Responder por Email</a>
                    </div>

                    <p style='font-size: 14px; color: #64748b; font-style: italic; margin-top: 30px;'>
                        📅 Fecha: " . date('d/m/Y H:i:s') . "<br>
                        🌐 IP: " . ($_SERVER['REMOTE_ADDR'] ?? 'Desconocida') . "
                    </p>
                </div>

                <div class='footer'>
                    <p>Este es un correo automático generado desde el formulario de contacto.</p>
                    <p><strong>{$this->fromName}</strong> | Gestión de Contactos</p>
                </div>
            </div>
        </body>
        </html>
        ";
        
        return $htmlContent;
    }

    private function buildEmailHeaders() {
        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "Content-type: text/html; charset=UTF-8\r\n";
        $headers .= "From: {$this->fromName} <{$this->fromEmail}>\r\n";
        $headers .= "Reply-To: {$this->fromEmail}\r\n";
        $headers .= "X-Mailer: PHP/" . phpversion();
        return $headers;
    }
}


$recipient = "gustavocardonam@gmail.com";
$fromName = "Servicios Urbanos";
$fromEmail = "admin@gustavocardona.com";

$contactForm = new ContactForm($recipient, $fromName, $fromEmail);

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $name = strip_tags(trim($_POST["name"]));
    $name = str_replace(array("\r","\n"),array(" "," "),$name);
    $email = filter_var(trim($_POST["email"]), FILTER_SANITIZE_EMAIL);
    $phone = trim($_POST["phone"]);
    $subject = trim($_POST["subject"]);
    $message = trim($_POST["textarea"]);

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        http_response_code(400);
        echo "Por favor completa el formulario e intenta de nuevo.";
        exit;
    }

    $contactForm->sendEmail($name, $email, $phone, $subject, $message);
} else {
    http_response_code(403);
    echo "Hay un problema con el envío, por favor intenta de nuevo.";
}