ACTUALIZACIÓN — 2 noviembre 2026

Se conserva SAVE THE DATE, la fotografía y la invitación con entrada mediante clic.
Portada con accesos a programa, viaje y RSVP; navegación simplificada y menú móvil.
Eliminada la sección de hoteles en Salamanca ciudad. Se conserva alojamiento en el castillo y transporte.
RSVP: etiquetas accesibles, mensajes bilingües y aclaración de que solicitar habitación no confirma la reserva.

VERIFICACIÓN
TypeScript y compilación de producción completados.
Navegador Chromium: 1440×900, 390×844, 320×568 y 844×390; ES/EN, menú y ausencia de desbordamiento horizontal.
Apertura y entrada mediante clic comprobadas en 1440 y 390 px.
RSVP con servidor simulado: código inválido, precarga, fallo de envío, conservación de datos, reintento con mismo identificador, confirmación y edición. No se enviaron respuestas reales; integración con Google no validada de extremo a extremo.
Limitaciones previas: aviso de compilación sobre /trencadis-glass-dark.svg. El test heredado google-apps-script/invitations.test.cjs falla porque carga Invitations.gs pero llama findInvitation, definido en Code.gs. Backend sin modificaciones.

INSTALACIÓN
Web completa: npm install; npm run dev. Producción: npm run build.
Solo cambios: copiar el contenido sobre la versión 2Nov2026_11.33am, conservando las rutas, y recompilar. Incluye archivos de invitación para conservar los últimos ajustes aprobados.
