# Preparar columnas y enlaces

Esta opción crea o actualiza el enlace privado de cada invitación y los accesos de WhatsApp. No envía emails, WhatsApp ni SMS, y no marca invitaciones como enviadas. Conserva los códigos originales.

La captura de error «Exception: Illegal argument» no aporta una línea que permita confirmar la causa exacta. Se han corregido dos riesgos del código: insertar sms: como enlace enriquecido de Sheets y aplicar formato a 999 filas cuando la hoja puede tener menos filas.

- La hoja usa solo enlaces HTTPS para invitación y WhatsApp. En la columna Abrir SMS indica «SMS: abrir desde el panel de envíos»; la acción SMS del panel sigue disponible.
- Se valida WEDDING_SITE_URL antes de preparar las columnas. Debe ser solo la URL HTTPS pública, sin parámetros, código privado ni formato Markdown.
- Los rangos de formato se limitan al número real de filas.
- Si una celda falla, el error identifica la fila y el campo, sin mostrar la URL, código, nombre o teléfono. Algunas filas anteriores pueden haberse preparado; es seguro volver a ejecutar la preparación.

Para aplicar: actualiza y guarda InvitationSending.gs en el proyecto Apps Script vinculado a la hoja. Ejecuta otra vez «Preparar columnas y enlaces». Revisa «Enlace privado» y «Abrir WhatsApp» de una invitación de prueba. Si aparece un error con fila/campo, revisa protección de esa celda y la URL configurada. No hace falta reenviar invitaciones.

Pruebas: `node --test tests/invitation-links.test.cjs`. Servicios de Sheets y envío simulados; no se ha modificado la hoja activa ni enviado mensajes.

Google documenta restricciones de protocolos de enlaces de Sheets: https://support.google.com/docs/answer/3093313
