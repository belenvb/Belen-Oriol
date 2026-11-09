# Regalos: QR privados y Venmo

## Diagnóstico y alcance

El 9 de noviembre de 2026 se revisaron `main` (base `f5707f7936b52c6b975ec3d51c518416a8cc22c3`) y el JavaScript servido por https://belen-oriol-psi.vercel.app/ (`index-BAlojFC6.js`). La web publicada incluye `zelleQrDataUrl` y `venmoQrDataUrl`, y construye el enlace antiguo `https://venmo.com/USUARIO`. Esta corrección utiliza `/u/USUARIO` y admite usuario, @usuario o URL de perfil en la propiedad privada. No inventa un destinatario, no fija importes ni inicia pagos.

El backend del repositorio devuelve una cadena vacía si el ID falta/es inválido, el archivo supera 600000 bytes, el MIME no es PNG/JPEG/WebP o Drive lanza un error. Antes esas situaciones no se distinguían. También es posible que el despliegue activo use una versión anterior de `Code.gs`, otra cuenta o un endpoint distinto. No se ha accedido al editor activo, sus propiedades, sus registros ni a los QR reales: la causa concreta requiere la comprobación privada siguiente.

## Configuración privada (organizador)

1. Guarda cada QR oficial como imagen PNG/JPEG/WebP, no PDF, HEIC ni un acceso directo. Máximo **600000 bytes por archivo**. Conserva el margen blanco y comprueba que se lee tras comprimirlo. El código valida tipo y tamaño, no interpreta el QR ni certifica su destinatario.
2. En Drive, deja **Acceso general → Restringido**. La cuenta que ejecuta el despliegue debe ser propietaria o tener permiso de lectura. No uses «Cualquiera con el enlace» ni enlaces públicos de miniatura.
3. En **Apps Script → Configuración del proyecto → Propiedades de la secuencia de comandos**, configura:

   | Propiedad | Valor privado |
   | --- | --- |
   | `WEDDING_ZELLE_QR_FILE_ID` | ID del archivo QR de Zelle |
   | `WEDDING_VENMO_QR_FILE_ID` | ID del archivo QR «Venmo me» |
   | `WEDDING_VENMO` | Usuario real de Venmo (preferible `@usuario`), o URL de su perfil |
   | `WEDDING_ZELLE` | Email o teléfono registrado, como alternativa al QR |

   En `https://drive.google.com/file/d/ID_DEL_ARCHIVO/view`, copia solo `ID_DEL_ARCHIVO`, sin `/view`, comillas, URL completa ni ID de la carpeta. No pegues estos valores en GitHub, el PR, archivos `.env` públicos ni capturas de diagnóstico.
4. Tras revisar el PR, copia el `Code.gs` propuesto al proyecto correcto y ejecuta **`checkWeddingPaymentQrConfiguration`** desde el editor con la cuenta que desplegará la aplicación. Autoriza Drive si se solicita. No sustituye los otros archivos `.gs` del proyecto. Si se gestionan scopes explícitos en `appsscript.json`, revisa que incluyan lectura de Drive (`https://www.googleapis.com/auth/drive.readonly`) además de los scopes ya necesarios; no elimines los de Sheets o envío de invitaciones.
5. El registro debe indicar `{"zelle":"ready","venmo":"ready"}`. No imprime IDs, datos bancarios ni imágenes. Esta función solo existe para el editor: no se añade ninguna ruta de diagnóstico pública.

   | Estado | Revisar |
   | --- | --- |
   | `not_configured` | Propiedad ausente o vacía en este proyecto |
   | `invalid_file_id` | Se pegó una URL completa o un ID incorrecto |
   | `too_large` | Exportar imagen de hasta 600000 bytes |
   | `unsupported_type` | Guardar como PNG, JPEG o WebP real |
   | `empty_file` | Volver a subir la imagen |
   | `unreadable_or_unauthorized` | Cuenta de ejecución, permisos, archivo borrado, autorización de Drive o restricciones de Workspace |

6. Cuando decidas activar la corrección, usa **Implementar → Gestionar implementaciones → Editar → Nueva versión** sobre el despliegue existente y configura **Ejecutar como: tú (organizador)**. El acceso al endpoint debe permitir a los invitados usar la web sin una sesión de Google; revisa las opciones permitidas por tu cuenta. Conserva la URL `/exec` existente. Guardar el código o probar `/dev` no actualiza la versión de `/exec`.
7. Comprueba que `VITE_RSVP_ENDPOINT` en el alojamiento (si existe) apunta a ese mismo `/exec`; si no existe, se utiliza el valor predeterminado de `src/utils/rsvp.ts`. No incluyas credenciales en la URL. Esta propuesta no modifica propiedades, implementaciones ni producción, y no fusiona el PR.

## Prueba manual antes de activar en producción

- Abre la vista previa en una ventana privada y en un móvil. Sin verificar invitación, no deben mostrarse identificadores ni QR; un acceso inválido no debe recibir `giftDetails`.
- Con una invitación de prueba válida, comprueba tanto el acceso directo a regalos como la carga a través de la invitación/RSVP. En la respuesta del endpoint deben aparecer `giftDetails.zelleQrDataUrl` y `giftDetails.venmoQrDataUrl` como `data:image/...;base64,...`. No compartas esa respuesta ni guardes archivos HAR: contiene datos privados.
- Comprueba que ambos QR se ven completos. Simula en un entorno de prueba propiedad ausente, ID erróneo, archivo demasiado grande o imagen que el navegador no puede decodificar: debe aparecer el aviso y mantenerse el identificador alternativo, si está configurado. Restablece los valores después.
- Escanea Zelle desde la aplicación bancaria compatible. Escanea Venmo desde otra pantalla; en el mismo teléfono guarda la imagen y selecciónala con el icono de foto del escáner de Venmo. Confirma que el nombre, foto e identificador coinciden con el destinatario esperado. **No hace falta enviar dinero para esta prueba.**
- Prueba el botón de Venmo en iOS/Safari, Android/Chrome y escritorio, con y sin sesión. Debe apuntar a `https://venmo.com/u/USUARIO_REAL`. El sistema operativo y Venmo deciden si abren la app; Venmo puede pedir iniciar sesión. Si pierde el destinatario, utiliza el QR o busca el usuario en la app. No se promete eludir el inicio de sesión.
- Prueba español e inglés, y el botón de copiar identificador. Los archivos originales de Drive deben seguir restringidos.

## Privacidad y comprobaciones automatizadas

Los datos bancarios y los IDs de Drive siguen exclusivamente en Script Properties; los QR no se añaden al repositorio. Las imágenes se transmiten al navegador tras la comprobación existente y pueden guardarse por quien las recibe. La comprobación por nombre/email es una facilidad, **no autenticación fuerte**: actualmente basta que coincida el nombre de pila de una invitación activa. Esta corrección conserva ese comportamiento.

Ejecuta `node --test tests/gifts.test.cjs`, `npm run check` y `npm run build`. Las pruebas simulan Drive y Apps Script; no demuestran la configuración del despliegue real, el contenido del QR ni el comportamiento de Venmo en un dispositivo.

Referencias oficiales:
- https://developers.google.com/apps-script/guides/web
- https://developers.google.com/apps-script/concepts/deployments
- https://developers.google.com/apps-script/guides/services/authorization
- https://help.venmo.com/cs/articles/personal-qr-codes-on-venmo-faq-vhel316
- https://help.venmo.com/cs/articles/sending-requesting-money-vhel171
