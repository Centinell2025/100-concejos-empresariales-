# 100 Consejos Empresariales · Beacon

Aplicación web en español de Beacon of the Eagle LLC. Contiene 100 consejos originales en 10 categorías: Estrategia, Clientes, Ventas, Finanzas, Marketing, Operaciones, Liderazgo, Innovación, Tecnología y Crecimiento.

## Funciones

- Consejo diario, búsqueda sin distinción de acentos, filtro por categoría y ordenación.
- Detalle con una acción práctica por consejo.
- Favoritos, notas con guardado automático y acciones completadas.
- Exportación del espacio personal como JSON.
- Interfaz adaptable a móviles y escritorio, navegación con teclado.
- Manifest y service worker para uso sin conexión después de una primera carga completa compatible. La instalación depende del navegador.

## Ejecutar

Sirve `dist/` desde un servidor HTTP estático. No requiere dependencias ni compilación. Usa HTTPS para el service worker fuera de localhost.

Los favoritos, notas y el progreso se guardan en localStorage del navegador. No existe sincronización entre dispositivos ni cuentas. Exporta tus datos antes de borrar los datos del navegador. El JSON exportado es una copia legible; esta versión no tiene importación.

El contenido es educativo y general. No incluye asesoramiento personalizado ni garantías de resultados. No se recopilan datos mediante servicios de analítica ni se realizan solicitudes a servicios externos desde la aplicación.
