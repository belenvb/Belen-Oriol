# RSVP → Google Sheets

El formulario usa el receptor publicado en Google Apps Script. Se puede sustituir su URL mediante `VITE_RSVP_ENDPOINT` al compilar con Vite.

`Code.gs` contiene el receptor para la hoja RSVP. Guarda las respuestas en la pestaña `Respuestas web`, creada con el primer envío válido. La aplicación web se ejecuta como la propietaria y permite acceso a Anyone; no devuelve datos de invitados.

Los cambios en Code.gs requieren publicar una nueva versión en Apps Script (Deploy → Manage deployments → Edit → New version). Subir este archivo a GitHub no actualiza el receptor por sí solo.

El formulario solo muestra éxito tras recibir confirmación del receptor. Un reintento con el mismo ID no añade otra fila. Editar una respuesta genera un nuevo registro. Las habitaciones se guardan como solicitudes, sin gestionar inventario compartido.

Validación: TypeScript y build comprobados. Pendiente verificar un envío desde la web desplegada y su aparición en la hoja.
