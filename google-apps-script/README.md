# Invitaciones y RSVP

Rellenar `Invitaciones`: titular/familia, email y máximo total de personas (incluye titular, de 1 a 20). El disparador simple `onEdit` genera un código aleatorio y activa la fila al completar los campos. Compartir el código privadamente con esa familia; no se envían emails.

La web consulta el máximo al abrir la invitación y el servidor lo vuelve a validar al enviar. Cambiar `Activa` a `No` bloquea una invitación. No hace falta desplegar de nuevo para cambiar filas. No renombrar las columnas. Códigos duplicados o filas inválidas se rechazan.

El email del titular debe coincidir con la fila. El acceso usa código privado, no email solo. No se devuelven emails ni respuestas anteriores al navegador. Las alergias, email opcional y asistencia de cada persona se guardan en `Respuestas por invitado`; el resumen sigue en `Respuestas web`. Las nuevas modificaciones generan nuevos registros: usar el último envío del titular, no sumar el historial.

## Publicación

El proyecto Apps Script vinculado necesita `Code.gs` e `Invitations.gs` (también se pueden concatenar en Code.gs). Ejecutar `setupInvitations` una vez. Guardar y publicar una nueva versión desde Manage deployments, conservando la misma URL y ejecución como propietaria. El receptor admite peticiones sin inicio de sesión, pero la hoja debe ser privada para los organizadores.

`VITE_RSVP_ENDPOINT` permite sustituir la URL pública del receptor al compilar. No incluir códigos privados en variables Vite ni en el repositorio.

Pruebas: `node google-apps-script/invitations.test.cjs`, TypeScript y Vite build.
