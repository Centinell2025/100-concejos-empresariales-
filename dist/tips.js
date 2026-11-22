const categories = [
['Estrategia','◎','Define tu dirección'],['Clientes','♧','Escucha antes de crear'],['Ventas','↗','Convierte valor en acuerdos'],['Finanzas','▥','Conoce tus números'],['Marketing','◈','Haz visible tu propuesta'],['Operaciones','⚙','Trabaja con orden'],['Liderazgo','◇','Construye un buen equipo'],['Innovación','✧','Prueba, aprende y mejora'],['Tecnología','⌘','Protege y simplifica'],['Crecimiento','▰','Avanza con intención']
];
const raw = [
[
['Empieza por un problema real','Una empresa tiene sentido cuando resuelve una necesidad concreta. Evita desarrollar una solución antes de entender a quién ayuda.','Escribe el problema que resuelves en una sola frase.'],
['Elige a quién quieres servir','Intentar llegar a todo el mundo diluye tu mensaje. Un segmento definido facilita diseñar una oferta relevante.','Describe a tu cliente ideal, su necesidad y su contexto.'],
['Explica tu propuesta de valor','Tu propuesta debe conectar una necesidad con un resultado comprensible. Usa palabras que tu cliente emplearía.','Completa: Ayudamos a ___ a conseguir ___ mediante ___.'],
['Define una prioridad para el trimestre','Demasiados objetivos compiten por el mismo tiempo. Una prioridad clara ayuda a decidir qué puede esperar.','Elige un resultado medible para los próximos 90 días.'],
['Conoce tus alternativas','Tu competencia incluye otras empresas, soluciones caseras y la decisión de no hacer nada. Comprenderlas aclara tu diferenciación.','Compara tu oferta con tres alternativas que usa tu cliente.'],
['Separa supuestos de hechos','Una opinión repetida no se convierte en evidencia. Anota qué sabes y qué necesitas comprobar antes de invertir.','Identifica el supuesto más arriesgado de tu idea.'],
['Convierte la visión en pasos','Una visión inspira; un plan permite actuar. Divide el objetivo en tareas pequeñas con responsables y fechas.','Define las tres próximas acciones de tu proyecto.'],
['Decide también qué no harás','Cada iniciativa consume atención. Poner límites evita aceptar trabajos que te alejan de tu propósito.','Escribe tres tipos de proyectos que no aceptarás este mes.'],
['Revisa tu estrategia con evidencia','Las necesidades cambian. Una revisión regular ayuda a ajustar decisiones sin abandonar la dirección por cada dificultad.','Agenda una revisión mensual de resultados y aprendizajes.'],
['Mide resultados, no solo actividad','Muchas reuniones o publicaciones no garantizan avances. Relaciona el esfuerzo con un resultado que tenga valor.','Elige una métrica de resultado y una de actividad.']
],[
['Escucha antes de presentar','Una conversación útil empieza por comprender. Haz preguntas abiertas y deja espacio para que el cliente explique su situación.','Pregunta qué parte de su trabajo le cuesta más resolver.'],
['Busca ejemplos concretos','Las experiencias recientes revelan más que las respuestas hipotéticas. Pide detalles sobre un problema que ya ocurrió.','Pregunta cuándo apareció por última vez la necesidad.'],
['Valida la disposición a comprar','El entusiasmo por una idea no equivale a una compra. Explora presupuesto, prioridad y proceso de decisión con respeto.','Pregunta cómo evalúan y compran soluciones similares.'],
['Registra las preguntas frecuentes','Las dudas repetidas indican dónde tu mensaje o producto necesita claridad. Responderlas reduce fricción.','Reúne las cinco preguntas que más recibes.'],
['Cumple lo que prometes','La confianza crece cuando la experiencia coincide con la promesa. Comunica límites, plazos y alcance antes del acuerdo.','Revisa una promesa comercial y confirma que puedes cumplirla.'],
['Diseña una buena bienvenida','El primer uso debe ayudar al cliente a conseguir un pequeño resultado. Evita explicarlo todo de una vez.','Escribe una guía inicial de tres pasos.'],
['Facilita pedir ayuda','Un cliente necesita saber dónde acudir cuando algo falla. Un canal claro y una respuesta comprensible mejoran la experiencia.','Haz visible tu canal de soporte y su horario real.'],
['Trata las quejas como información','Una queja revela una expectativa incumplida. Escucha, confirma el problema y acuerda un siguiente paso.','Documenta una queja y una mejora que evite repetirla.'],
['Pide opiniones sin dirigirlas','La retroalimentación sirve cuando la persona puede discrepar. Evita preguntas que sugieren la respuesta deseada.','Pregunta qué cambiaría el cliente de su experiencia.'],
['Cuida la relación después de vender','Una venta abre una relación. Comprueba si el cliente logró el resultado esperado y qué obstáculos encontró.','Programa un seguimiento útil después de la entrega.']
],[
['Vende un resultado comprensible','Las características importan cuando explican un beneficio. Conecta cada función con el trabajo que ayuda a realizar.','Traduce tres características de tu oferta en beneficios.'],
['Prepara una conversación de descubrimiento','Antes de cotizar, entiende necesidad, alcance, plazos y participantes. Así puedes valorar si existe un buen encaje.','Prepara cinco preguntas para tu próxima reunión comercial.'],
['Define el alcance por escrito','Un acuerdo ambiguo puede crear expectativas incompatibles. Describe entregables, exclusiones y criterios de aceptación.','Añade una lista de entregables a tu próxima propuesta.'],
['Haz propuestas fáciles de leer','Una propuesta debe ayudar a decidir. Resume problema, solución, inversión, plazo y siguiente paso con claridad.','Revisa si tu propuesta responde esas cinco preguntas.'],
['Escucha la objeción completa','Una objeción puede expresar una duda sobre valor, riesgo o prioridad. Comprenderla evita responder al problema equivocado.','Pregunta qué necesitaría aclarar el cliente para decidir.'],
['Da seguimiento con propósito','El seguimiento aporta valor cuando resuelve una duda o facilita una decisión. Respeta los tiempos y preferencias del cliente.','Envía una respuesta concreta a una pregunta pendiente.'],
['Mantén un registro de oportunidades','Un registro sencillo evita olvidar conversaciones. Anota etapa, próximo paso y fecha, sin recopilar datos innecesarios.','Actualiza tus oportunidades activas con su próxima acción.'],
['Aprende de las ventas perdidas','Una oportunidad que no avanza puede enseñar sobre precio, encaje o proceso. Busca patrones sin culpar al cliente.','Registra el motivo conocido de tres oportunidades perdidas.'],
['Evita descuentos improvisados','Un descuento afecta tu margen y tus expectativas futuras. Antes de ofrecerlo, revisa qué alcance o condición lo justifica.','Define cuándo puedes ajustar precio y bajo qué condiciones.'],
['Cierra con un siguiente paso claro','Una buena conversación termina con claridad compartida. Confirma quién hará qué y en qué momento.','Envía un resumen breve con el próximo paso acordado.']
],[
['Distingue ventas de dinero disponible','Una factura emitida y un cobro recibido ocurren en momentos distintos. Tu operación necesita conocer ambos.','Anota por separado lo facturado y lo cobrado este mes.'],
['Conoce el costo de entregar','El precio debe considerar materiales, herramientas, tiempo y otros costos asociados. Estimar solo lo visible puede ocultar pérdidas.','Calcula el costo completo de una entrega reciente.'],
['Revisa tu flujo de caja','El calendario de cobros y pagos permite anticipar faltantes. Usa supuestos explícitos y actualiza la previsión con datos reales.','Prepara una previsión de entradas y salidas de cuatro semanas.'],
['Separa los registros personales y del negocio','La separación facilita entender el desempeño empresarial. Usa registros claros y concilia los movimientos regularmente.','Clasifica los movimientos del negocio de la última semana.'],
['Presupuesta antes de comprometer gastos','Un presupuesto conecta recursos con prioridades. Revisa el efecto de un gasto recurrente durante varios meses.','Revisa el costo anual de tus suscripciones activas.'],
['Documenta las condiciones de cobro','El cliente debe conocer importes, fechas y condiciones antes de aceptar. Las condiciones claras facilitan el seguimiento.','Verifica que tu propuesta y factura indiquen el vencimiento.'],
['Evalúa el margen por oferta','Dos productos con ventas similares pueden consumir recursos muy distintos. Comparar márgenes ayuda a entender qué sostiene la operación.','Compara ingresos y costos de tus dos ofertas principales.'],
['Planifica los gastos irregulares','Renovaciones, mantenimiento y compras ocasionales pueden sorprender si no se registran. Inclúyelos en el calendario del negocio.','Anota los gastos conocidos de los próximos tres meses.'],
['Conserva comprobantes ordenados','Los documentos respaldan tus registros y facilitan revisiones. Mantén un criterio consistente de nombres y carpetas.','Organiza los comprobantes del mes por fecha y proveedor.'],
['Prueba escenarios antes de crecer','Un plan puede verse distinto si bajan las ventas o se retrasan los cobros. Explorar escenarios revela decisiones sensibles.','Calcula cómo cambiaría tu caja con un mes de cobros tardíos.']
],[
['Construye un mensaje reconocible','La claridad y la consistencia ayudan a recordar tu negocio. Explica qué haces, para quién y por qué resulta útil.','Escribe una presentación de tu empresa en dos frases.'],
['Elige canales que puedas mantener','Estar en todos los canales exige recursos. Empieza donde tu audiencia busca información y donde puedas participar con constancia.','Selecciona un canal principal y define su propósito.'],
['Publica contenido que resuelva dudas','El contenido útil responde preguntas reales. Un ejemplo claro puede aportar más que una publicación genérica.','Convierte una pregunta frecuente en una publicación.'],
['Muestra evidencia auténtica','Las demostraciones y ejemplos ayudan a evaluar tu oferta. Diferencia resultados reales de prototipos y ejemplos ilustrativos.','Prepara una demostración breve y etiqueta su estado.'],
['Pide permiso para usar testimonios','La confianza requiere respetar la información del cliente. Confirma autorización y reproduce su experiencia con fidelidad.','Revisa el permiso de un testimonio antes de publicarlo.'],
['Da a cada página un propósito','Una página resulta más útil cuando facilita una tarea. Define la acción principal y evita opciones que distraigan.','Elige la acción principal de tu página de inicio.'],
['Cuida la identidad visual','Colores, tipografía y tono consistentes hacen más reconocible tu presencia. Documenta lo esencial para repetirlo bien.','Reúne tus colores, logo y estilo de escritura en una guía.'],
['Evalúa la calidad de las consultas','Las visitas y reacciones son señales parciales. Comprueba si el contenido atrae conversaciones relacionadas con tu oferta.','Relaciona una publicación con las consultas que generó.'],
['Reutiliza una buena explicación','Una idea útil puede adaptarse a distintos formatos. Ajusta la profundidad y el lenguaje al contexto de cada canal.','Convierte una guía en una publicación breve y una pregunta frecuente.'],
['Mantén la información actualizada','Enlaces rotos, ofertas antiguas y datos de contacto incorrectos crean fricción. Revisa tus puntos de entrada con regularidad.','Comprueba tus enlaces y datos de contacto públicos.']
],[
['Documenta las tareas repetidas','Una lista breve reduce omisiones y facilita delegar. Empieza por los pasos que más afectan la calidad.','Escribe el procedimiento de una tarea semanal.'],
['Define qué significa terminado','Sin un criterio común, una entrega puede quedarse abierta. Establece resultados observables y revisables.','Añade criterios de finalización a una tarea pendiente.'],
['Limita el trabajo en curso','Abrir muchas tareas puede retrasar todas. Termina una parte útil antes de comenzar otra iniciativa.','Elige qué tarea terminarás antes de abrir una nueva.'],
['Protege tiempo de concentración','Las interrupciones fragmentan el trabajo exigente. Reserva bloques realistas y comunica cuándo estarás disponible.','Reserva un bloque sin reuniones para tu tarea principal.'],
['Haz visibles las dependencias','Una tarea puede depender de información, personas o aprobaciones. Identificarlas temprano reduce esperas evitables.','Anota qué necesita tu próxima entrega para avanzar.'],
['Revisa antes de entregar','Una comprobación breve detecta errores que dañan la experiencia. Diseña la revisión alrededor del uso real.','Crea una lista de control para tu próxima entrega.'],
['Mantén una fuente de información clara','Las versiones duplicadas generan confusión. Define dónde está el documento vigente y quién lo mantiene.','Elige la ubicación oficial del plan de tu proyecto.'],
['Evalúa a tus proveedores','El precio es una parte de la decisión. Considera calidad, respuesta, continuidad y facilidad de sustitución.','Compara un proveedor clave con una alternativa.'],
['Prepara alternativas para interrupciones','Un plan sencillo ayuda cuando falla una herramienta o una persona no está disponible. Prioriza lo esencial.','Escribe cómo continuarías tu servicio durante una interrupción.'],
['Mejora un proceso cada semana','Los cambios pequeños y observables pueden reducir fricción. Mide si la mejora funciona antes de ampliarla.','Elige una demora frecuente y prueba una solución pequeña.']
],[
['Aclara responsabilidades','Las personas trabajan mejor cuando conocen su resultado esperado y su margen de decisión. Evita responsabilidades implícitas.','Confirma quién responde por cada entrega del equipo.'],
['Delega con contexto','Asignar una tarea exige explicar propósito, resultado y restricciones. El contexto permite resolver imprevistos con criterio.','Delega una tarea indicando resultado, plazo y apoyo disponible.'],
['Acuerda cómo comunicarse','La comunicación mejora con expectativas claras. Define qué canal usar para cada tipo de asunto y cómo señalar urgencias.','Acuerda un canal para decisiones y otro para consultas rutinarias.'],
['Da retroalimentación específica','Los ejemplos concretos ayudan a mejorar. Describe la conducta observada, su impacto y el cambio esperado.','Prepara una observación con un ejemplo verificable.'],
['Reconoce el trabajo bien hecho','El reconocimiento útil explica qué contribución tuvo valor. Hazlo oportuno y ajustado a las preferencias de la persona.','Reconoce una contribución concreta de alguien del equipo.'],
['Diseña reuniones con un resultado','Una reunión necesita un propósito que justifique el tiempo. Comparte contexto y termina con decisiones o acciones.','Añade un objetivo y una duración a tu próxima reunión.'],
['Facilita plantear problemas temprano','Los obstáculos ocultos se vuelven más difíciles de resolver. Escucha los avisos y ayuda a buscar soluciones.','Pregunta al equipo qué riesgo necesita atención esta semana.'],
['Gestiona la capacidad real','Un plan debe considerar tiempo disponible, tareas y descansos. La sobrecarga sostenida compromete calidad y continuidad.','Compara los compromisos de la semana con la capacidad disponible.'],
['Desarrolla habilidades con práctica','La formación resulta más útil cuando se aplica a una tarea concreta. Combina aprendizaje, práctica y revisión.','Elige una habilidad y una tarea donde practicarla.'],
['Modela los acuerdos que pides','La conducta de quien lidera marca expectativas. Cumple compromisos y reconoce con claridad cuando debes corregir.','Revisa un compromiso propio y comunica su estado.']
],[
['Prueba primero lo más incierto','Una prueba pequeña puede evitar una inversión innecesaria. Define qué necesitas aprender antes de construir.','Diseña una prueba para tu supuesto más importante.'],
['Construye una versión mínima útil','Una primera versión debe resolver una tarea completa y concreta. Reduce alcance manteniendo una experiencia comprensible.','Define la única tarea que tu primera versión resolverá bien.'],
['Escribe qué demostraría la prueba','Sin un criterio previo es fácil interpretar cualquier resultado como éxito. Aclara la señal que te haría continuar o ajustar.','Anota el criterio de éxito antes de iniciar un experimento.'],
['Observa cómo usan tu producto','El uso real revela confusiones que una opinión general puede ocultar. Observa con permiso y evita guiar cada paso.','Pide a una persona que complete una tarea y observa las dificultades.'],
['Registra los aprendizajes','Los resultados valen más cuando se pueden revisar. Guarda hipótesis, método, observación y decisión en el mismo lugar.','Documenta el aprendizaje de tu última prueba.'],
['Cambia una variable importante por vez','Si modificas todo al mismo tiempo, cuesta saber qué influyó. Mantén una comparación razonable entre pruebas.','Elige un solo cambio para tu próximo experimento.'],
['Reserva espacio para explorar','La operación diaria puede absorber toda la atención. Un espacio acotado permite probar sin desatender compromisos.','Reserva un bloque semanal para una mejora experimental.'],
['Invita perspectivas diferentes','Personas con experiencias distintas pueden detectar supuestos invisibles para el equipo. Explica el problema y escucha sus preguntas.','Pide una revisión a alguien ajeno al proyecto.'],
['Retira funciones que no ayudan','Más funciones también significan más mantenimiento y complejidad. Evalúa su uso y utilidad antes de conservarlas por costumbre.','Revisa una función poco usada y decide qué aprender sobre ella.'],
['Convierte errores en ajustes','Un error necesita una respuesta que reduzca la posibilidad de repetirlo. Busca causas del proceso y acciones concretas.','Documenta un error reciente y un cambio preventivo.']
],[
['Protege las cuentas importantes','Las cuentas empresariales dan acceso a información y operaciones. Usa contraseñas únicas y autenticación multifactor cuando esté disponible.','Activa MFA en una cuenta empresarial que aún no lo tenga.'],
['Asigna solo el acceso necesario','Cada persona necesita permisos acordes con su función. Revisa accesos al cambiar responsabilidades o finalizar una colaboración.','Revisa quién puede acceder a una herramienta crítica.'],
['Comprueba tus copias de seguridad','Una copia solo resulta útil si puedes recuperar lo necesario. Mantén copias separadas y verifica la restauración de forma controlada.','Restaura un archivo de prueba desde tu respaldo.'],
['Actualiza herramientas con criterio','Las actualizaciones corrigen fallos y pueden cambiar funciones. Planifica las de sistemas importantes y verifica su funcionamiento.','Revisa actualizaciones pendientes de una herramienta esencial.'],
['Recoge solo los datos necesarios','Cada dato guardado necesita un propósito y cuidados. Limita la recopilación y define quién accede y cuándo se elimina.','Revisa si un formulario pide datos que no necesitas.'],
['Automatiza una tarea estable','Automatizar un proceso confuso puede multiplicar errores. Primero aclara sus pasos y excepciones, después prueba la automatización.','Elige una tarea repetida y documenta sus reglas.'],
['Revisa los resultados de la IA','La IA puede producir errores o contenido sin fundamento. Una revisión humana debe comprobar datos, contexto y adecuación antes de usarlo.','Verifica una salida de IA contra la información original.'],
['Cuida lo que compartes con herramientas','Antes de subir información del negocio o de clientes, revisa permisos y condiciones. Utiliza ejemplos anonimizados cuando sea posible.','Elimina datos sensibles de un ejemplo que vayas a compartir.'],
['Mantén un inventario tecnológico','Conocer tus sistemas, responsables y renovaciones facilita mantenimiento y continuidad. Un registro sencillo basta para comenzar.','Lista tus herramientas esenciales y quién las administra.'],
['Prepara una respuesta a incidentes','Ante una interrupción o acceso sospechoso, una guía clara ayuda a actuar con orden. Define contactos, pasos iniciales y registro de hechos.','Escribe a quién contactarías si pierdes acceso a una cuenta crítica.']
],[
['Crece sobre una experiencia que funciona','Aumentar la demanda también amplifica problemas de entrega. Comprueba capacidad y calidad antes de expandir el alcance.','Identifica el límite actual de tu capacidad de entrega.'],
['Cuida a los clientes actuales','Entender por qué continúan o se van ayuda a mejorar la oferta. El seguimiento debe aportar utilidad y respetar su tiempo.','Pregunta a un cliente qué le aporta más valor de tu servicio.'],
['Evalúa alianzas con un objetivo','Una colaboración funciona mejor cuando ambas partes conocen su contribución y beneficio. Define alcance y responsabilidades.','Escribe qué aportarías y qué esperarías de una alianza.'],
['Reduce dependencias críticas','Depender de una sola cuenta, canal o persona crea vulnerabilidad. Identifica alternativas de forma gradual y realista.','Anota tu mayor dependencia y una alternativa posible.'],
['Expande con una prueba acotada','Un nuevo mercado puede tener necesidades distintas. Comprueba el encaje con un alcance limitado antes de comprometer más recursos.','Define una prueba pequeña para un nuevo segmento.'],
['Mide si el crecimiento es sostenible','Más ventas pueden exigir más tiempo y gastos. Observa también calidad, capacidad y caja al evaluar el avance.','Revisa ventas, entregas y recursos consumidos en el mismo período.'],
['Prioriza con criterios claros','Las oportunidades compiten por recursos. Compara impacto esperado, esfuerzo, incertidumbre y relación con tu objetivo.','Evalúa tres iniciativas usando los mismos criterios.'],
['Conserva lo aprendido al ampliar el equipo','El conocimiento que solo vive en una persona es difícil de transferir. Documenta decisiones y prácticas útiles conforme avanzas.','Registra una decisión clave y la razón que la sustenta.'],
['Deja espacio para recuperarte','La continuidad también depende de tu capacidad de sostener el trabajo. Planifica descansos y evita promesas que requieren sobrecarga permanente.','Reserva tiempo de descanso en tu planificación semanal.'],
['Revisa el camino y el siguiente paso','Un negocio se construye con decisiones revisadas, no con un plan inmutable. Reconoce avances y elige una acción que puedas completar.','Escribe un aprendizaje del mes y tu próximo paso concreto.']
]
];
const tips=raw.flatMap((items,c)=>items.map(([title,body,action],i)=>({id:c*10+i+1,category:c,title,body,action})));
