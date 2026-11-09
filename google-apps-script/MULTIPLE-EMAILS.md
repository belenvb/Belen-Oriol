# Varios correos para un mismo grupo

1. En el proyecto de Apps Script existente, actualiza el contenido de `InvitationSending.gs`, `SendingPanel.html` y `Code.gs` con los archivos de esta propuesta y guarda. Conserva las propiedades privadas y el resto de archivos.
2. Para que la comprobación de invitado de la web también reconozca ambos correos: Implementar → Gestionar implementaciones → editar la implementación web existente → Nueva versión → Implementar. Conserva la misma implementación y URL; no crees otra. Los cambios del menú de la hoja usan el código guardado.
3. Recarga Google Sheets y vuelve a abrir el panel de Invitaciones.
4. En la celda Email de la misma fila del grupo escribe, por ejemplo, `persona1@example.com, persona2@example.com`. También se admite punto y coma. Solo direcciones, sin nombres. No dupliques la fila ni cambies ningún código.
5. Selecciona Email y envía el grupo pendiente desde el panel habitual. Ambos reciben un mismo mensaje con el mismo enlace/código y pueden ver sus direcciones en Para. Tu BCC privado se mantiene; se omite si ya figuras en Para.

Las direcciones repetidas se eliminan sin distinguir mayúsculas. Una dirección inválida o un elemento vacío bloquea el envío completo. La cuota cuenta cada destinatario distinto y la copia oculta. Máximo 49 direcciones distintas del grupo, reservando espacio para BCC. Un solo mensaje y estado de envío por grupo. Añadir un correo a un grupo ya enviado no lo reenvía automáticamente; no borres su estado para forzar un envío sin revisar los destinatarios.

Prueba manual opcional: usa «Enviar prueba» con dos direcciones que controles, separadas por comas. Verifica ambos buzones y tu copia oculta; esta prueba no marca el grupo real como enviado. No se han enviado correos durante la preparación de esta propuesta.

Pruebas simuladas: `node google-apps-script/tests/multiple-emails.cjs` (validación, deduplicado, cuotas, BCC, mensaje único con el código original y comprobación de ambos invitados).

MailApp admite destinatarios separados por comas: https://developers.google.com/apps-script/reference/mail/mail-app
Cuotas: https://developers.google.com/apps-script/guides/services/quotas
