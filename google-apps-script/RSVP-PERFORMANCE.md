# Tiempo de confirmación del RSVP

Esta propuesta reduce el trabajo con Google Sheets al enviar la asistencia. No sustituye la comprobación de identidad, no confirma antes de guardar y no elimina el bloqueo de reservas.

- Habitaciones: una lectura de valores por petición, en lugar de tres, para totales, precios y límite manual. La instantánea se descarta al comenzar cada doPost. En el envío final se obtiene después de adquirir el bloqueo, nunca desde una caché compartida entre invitados.
- Respuesta anterior: al guardar solo se lee el ID del envío anterior desde la instantánea ya existente; no se reconstruyen sus nombres, menús o alergias.
- Detalle por invitado: para localizar las filas se lee una columna (código), en lugar de las trece columnas. Las actualizaciones se mantienen agrupadas y conservan las filas de otras familias.
- Se conserva flush antes de devolver éxito y el reintento con el mismo ID puede reparar una escritura parcial sin crear otra respuesta.

El registro de ejecución añade `RSVP timing breakdown` con milisegundos de validación, espera del bloqueo, preparación, guardado y flush. No contiene nombres, emails, códigos ni respuestas. `processingMs` sigue indicando el tiempo total dentro del backend. El arranque y transporte de Apps Script pueden añadir tiempo fuera de esa medición.

## Activación y prueba

1. Guarda una copia del Code.gs activo y revisa el PR.
2. Actualiza solo Code.gs en el proyecto Apps Script correcto.
3. Edita el despliegue web existente para que use una nueva versión y conserva su URL /exec.
4. En una hoja/proyecto de prueba, confirma una invitación, modifica su asistencia y reintenta un envío con el mismo ID. Comprueba que hay una sola respuesta por familia, que se conservan los datos por invitado y que las habitaciones no superan la disponibilidad.
5. Compara el tiempo del envío final y el registro de fases. No compartas capturas de respuestas de red con datos privados.

Validación local: `node --test tests/rsvp-performance.test.cjs tests/gifts.test.cjs`. Cinco pruebas nuevas verifican bloqueo, guardado/flush, reintentos, fallo parcial, disponibilidad fresca por petición, familias ajenas y precios/límites. Una comparación con el código anterior produjo la misma disponibilidad con 3 lecturas de valores de Habitaciones antes y 1 después. Esto mide llamadas simuladas, no segundos reales ni el proyecto activo.

Sin cambios de frontend necesarios. Esta mejora es independiente del desbloqueo urgente del sobre. No se han enviado confirmaciones reales ni actualizado el despliegue.

Referencia: https://developers.google.com/apps-script/guides/support/best-practices
