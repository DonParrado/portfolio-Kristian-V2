<?php
// Verificar si la solicitud es POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Capturar los datos del formulario y limpiar entrada
    $nombre = htmlspecialchars(trim($_POST['nombre']));
    $email = htmlspecialchars(trim($_POST['email']));
    $mensaje = htmlspecialchars(trim($_POST['mensaje']));

    // Validación básica
    if (empty($nombre) || empty($email) || empty($mensaje)) {
        echo "Por favor, complete todos los campos.";
        exit;
    }

    // Opcional: Validar el formato del email
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        echo "Por favor, ingrese un correo electrónico válido.";
        exit;
    }

    // Aquí puedes procesar los datos: enviar un correo o guardarlos en un archivo de texto
    // 1. Enviar el correo a tu dirección (mimundoemocionalhoy@gmail.com)
    $to = "mimundoemocionalhoy@gmail.com"; // Dirección de correo a la que se enviará el mensaje
    $subject = "Nuevo mensaje desde el formulario de contacto";
    $message = "Has recibido un nuevo mensaje de contacto.\n\n";
    $message .= "Nombre: $nombre\n";
    $message .= "Email: $email\n";
    $message .= "Mensaje: $mensaje\n";
    $headers = "From: $email\r\n";  // El correo del remitente
    $headers .= "Reply-To: $email\r\n";  // Para que el correo de respuesta sea el del usuario

    // Enviar correo a tu dirección
    if (mail($to, $subject, $message, $headers)) {
        echo "Mensaje enviado correctamente.";
    } else {
        echo "Hubo un error al enviar el mensaje.";
    }
    $fromEmail = "mimundoemocionalhoy@gmail.com";
    // 2. Enviar un mensaje de agradecimiento al usuario
    $userSubject = "Gracias por contactarnos";
    $userMessage = "Hola $nombre,\n\n";
    $userMessage .= "Gracias por ponerte en contacto con nosotros. Hemos recibido tu mensaje y te responderemos lo antes posible a la dirección de correo: $email.\n\n";
    $userMessage .= "¡Te agradecemos tu interés y pronto nos pondremos en contacto contigo!\n\n";
    $userMessage .= "Saludos cordiales,\nEl equipo de Mimundoemocionalhoy";
    $userHeaders = "From: $fromEmail\r\n";  // El correo de respuesta

    // Enviar correo al usuario
    if (mail($email, $userSubject, $userMessage, $userHeaders)) {
        echo "Correo de agradecimiento enviado.";
    } else {
        echo "Hubo un error al enviar el correo de agradecimiento.";
    }

    // 3. Guardar los datos en un archivo de texto (opcional)
    $archivo = 'mensajes.txt'; // Archivo donde se guardarán los mensajes
    $contenido = "Nombre: $nombre\nEmail: $email\nMensaje: $mensaje\n---\n";
    file_put_contents($archivo, $contenido, FILE_APPEND);
} else {
    // Si no es POST, mostramos un mensaje de error
    echo "Método no permitido.";
}