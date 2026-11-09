# Copia oculta de invitaciones por email

En el proyecto Apps Script vinculado a la hoja de invitaciones:

1. Copia y guarda el `InvitationSending.gs` de esta propuesta.
2. Abre Configuración del proyecto → Propiedades de la secuencia de comandos.
3. Añade `WEDDING_INVITATION_BCC` con tu dirección de email completa. Guarda el valor solo en Apps Script; no en el repositorio, el PR ni una hoja pública.
4. Si utilizas un panel servido por un despliegue web versionado, actualiza ese despliegue a una nueva versión. El panel lateral de Sheets utiliza el código guardado.
5. Usa el envío de prueba a una dirección que controles y verifica que la copia llega al buzón configurado. Si la prueba se dirige al mismo buzón de BCC, solo se envía una vez. Las pruebas no marcan a los invitados como enviados.

Todos los envíos de invitaciones por email, tanto reales como de prueba, incluyen la copia oculta. El invitado no ve esa dirección en Para, CC ni en el cuerpo del mensaje. El remitente puede verla en su mensaje enviado.

La dirección de BCC es obligatoria antes de enviar nuevos emails. Si falta o tiene formato inválido, se detiene el envío con instrucciones para configurarla, sin incluir la dirección en el error. Solo se admite una dirección. Las invitaciones ya enviadas se siguen omitiendo y no se reenvían automáticamente.

La cuota se calcula por destinatarios: normalmente 2 por invitación (invitado + copia oculta), o 1 si el destinatario es el mismo buzón de BCC. WhatsApp y SMS permanecen sin cambios.

Pruebas: `node --test tests/invitation-bcc.test.cjs tests/invitation-language.test.cjs`. Todo se simula; no envían mensajes reales.

Documentación de Google: https://developers.google.com/apps-script/reference/mail/mail-app
