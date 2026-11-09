# Dirección postal opcional

El RSVP incluye una dirección postal opcional por invitación/familia, en español e inglés. Se puede dejar vacía, modificar o borrar. Máximo 500 caracteres, validado también en el servidor.

Se guarda en `postalAddress` dentro de la columna privada existente «Respuesta JSON» de «Respuestas web». No crea columnas ni lecturas/escrituras extra por dirección y no sobrescribe columnas personalizadas. El código de invitación válido permite recuperar la respuesta y editarla; el catálogo público de habitaciones y el acceso a regalos no incluyen direcciones postales. Los clientes y respuestas anteriores sin este campo siguen siendo compatibles.

Activación: publicar el frontend y actualizar Code.gs en Apps Script, después seleccionar una nueva versión del despliegue existente conservando /exec. No cambia InvitationSending.gs ni envía mensajes. Mantener la hoja de respuestas restringida.

Prueba en una invitación de prueba: guardar sin dirección; añadir una dirección ficticia; recargar con su código; modificarla y borrarla. Confirmar que la respuesta se conserva sin duplicados. No pegar respuestas JSON reales en GitHub.

Pruebas simuladas: `node --test tests/rsvp-postal-address.test.cjs`.
