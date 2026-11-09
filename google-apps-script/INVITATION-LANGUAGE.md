# Idioma de los enlaces de invitación

Los enlaces enviados por email, WhatsApp y SMS incorporan ahora `?lang=en` o `?lang=es` antes de `#invitacion=...`. El código personal permanece en el fragmento, fuera de los parámetros de consulta. El idioma se toma del campo Idioma de la invitación (en/es), ignorando espacios y mayúsculas.

Para activar: revisar el PR, actualizar `InvitationSending.gs` en el proyecto Apps Script vinculado a Invitaciones, guardar y volver a preparar los enlaces desde el panel o el menú de invitaciones. Verificar una invitación de prueba de cada idioma. No es necesario reenviar invitaciones automáticamente; esta propuesta no envía mensajes ni altera registros de envío. Si el panel se sirve como aplicación web versionada, actualizar también su despliegue existente.

Los mensajes ya enviados conservan su URL original. El frontend actual usa `lang` al abrir la página y, al validar una invitación, consulta también el idioma almacenado. Sin `lang`, el sobre puede verse inicialmente en español hasta completar esa consulta. Esto exige que producción esté actualizada y que el endpoint responda correctamente. Comprueba que las pruebas y los enlaces enviados usan el mismo dominio de producción, no una URL de vista previa.

Comprobación realizada: el dominio principal https://belen-oriol-psi.vercel.app/ servía `index-B-byROmn.js`, sin las fotos nuevas ni el RSVP de portada, mientras `main` ya contenía esos cambios. La URL personalizada no fija una versión del código: revisar el despliegue de producción en Vercel. No se ha modificado el alojamiento ni se ha publicado automáticamente.

Pruebas: `node --test tests/invitation-language.test.cjs`. Usan solo nombres y códigos ficticios.
