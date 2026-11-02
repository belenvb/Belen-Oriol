# Nuestra historia — versión editorial

Se ha rediseñado únicamente la sección Nuestra historia con fondo crema, fotografía original en formato polaroid, papeles superpuestos y un recorrido esquemático por los lugares del relato. El texto español e inglés permanece íntegro; solo se divide en párrafos. El subtítulo es «De España a Boston» / «From Spain to Boston». El recorrido corregido es España (Salamanca y Barcelona) → Boston → Lancaster (Pennsylvania) → Boston (2024). Se reutiliza la ilustración original story-landmarks.png para mostrar los monumentos de ambas ciudades españolas.

Archivos modificados: src/components/StorySection.tsx, src/components/StoryJourney.tsx.
Estilos nuevos y limitados a esta sección: src/components/StoryEditorial.css.

## Uso

Con Node.js instalado, ejecutar `npm ci` y después `npm run dev` desde esta carpeta. Para generar la versión de producción: `npm run build`. La carpeta dist incluida contiene la web compilada para alojamiento estático; no se debe abrir index.html directamente con file://.

Se conservan las imágenes y el resto de los archivos originales. No se incluyen node_modules ni metadatos de macOS: npm ci reinstala las dependencias.

## Verificación

Compilación de producción y comprobación TypeScript correctas. Revisados español, inglés, enlace al programa y vista móvil de 390 px, sin desbordamiento horizontal ni errores JavaScript. Comparado el relato con el ZIP original en ambos idiomas y comprobado que los demás archivos originales no cambian.

La compilación avisa de una referencia preexistente a /trencadis-glass-dark.svg, que no se encuentra en el ZIP original; pertenece al diseño fuera de esta sección.
