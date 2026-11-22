# Beacon Business · Gestión empresarial

Aplicación web de Beacon of the Eagle LLC con interfaz y 100 consejos completos en español, inglés e italiano. Selector de idioma con preferencia persistente.

## Módulos

- Panel KPI por mes: ingresos cobrados, gastos pagados, resultado neto de caja y margen de caja.
- Tendencia de seis meses con tabla de importes; no se generan datos de demostración.
- Movimientos: alta, edición, eliminación con deshacer, filtro mensual, búsqueda y clasificación por tipo.
- Clientes: contactos, estado y valor estimado de oportunidades. Las oportunidades no cuentan como ingresos.
- Proyectos: estado, cliente, presupuesto previsto, fecha límite y avance de tareas vinculadas. Los presupuestos no cuentan como gastos.
- Tareas: prioridad, estado, proyecto, vencimiento y finalización.
- Biblioteca: 100 consejos por idioma, categorías, buscador, favoritos, notas y acciones completadas.
- Exportación JSON de todos los registros y del espacio de aprendizaje.

## Cálculos

Todos los importes se registran en USD y se guardan como centavos enteros. Los KPI mensuales incluyen exclusivamente movimientos con fecha en el mes seleccionado. Resultado = ingresos cobrados − gastos pagados. Margen = resultado / ingresos × 100; sin ingresos se muestra «—». Es un registro manual de caja, no contabilidad por devengo, facturación fiscal ni conciliación bancaria. Los indicadores operativos usan todos los registros.

## Datos y funcionamiento

Los registros, las notas y la preferencia de idioma se guardan en localStorage del navegador. No hay cuentas internas, sincronización entre dispositivos ni conexión bancaria. La privacidad del alojamiento se gestiona mediante ChatGPT. Exporta una copia antes de borrar datos del navegador. Esta versión exporta JSON pero no lo importa. Las notas personales no se traducen automáticamente al cambiar idioma.

Sirve `dist/` mediante HTTP; no requiere instalación de dependencias ni compilación. Usa HTTPS para el service worker fuera de localhost. El manifest y el service worker permiten uso sin conexión después de una primera carga completa compatible; la instalación depende del navegador.

## Verificación

Comprobación de sintaxis JavaScript y de 100 consejos completos por idioma. Revisión en navegador de cambio de idioma, persistencia, clientes, proyectos vinculados, tareas y cálculos con ingreso de 1.000 USD y gasto de 250 USD: resultado 750 USD y margen 75 %. Los registros de prueba se eliminan del espacio de revisión.
