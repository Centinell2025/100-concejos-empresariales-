const messages = {};
const messageRows = `
appPublisher|Beacon Business es una aplicación de Beacon of the Eagle LLC.|Beacon Business is an app by Beacon of the Eagle LLC.|Beacon Business è un’app di Beacon of the Eagle LLC.
appCopyright|© 2026 Beacon of the Eagle LLC. Todos los derechos reservados.|© 2026 Beacon of the Eagle LLC. All rights reserved.|© 2026 Beacon of the Eagle LLC. Tutti i diritti riservati.
tipsCopyright|Selección y textos originales de «100 consejos empresariales» © 2026 Beacon of the Eagle LLC.|Selection and original text of “100 Business Tips” © 2026 Beacon of the Eagle LLC.|Selezione e testi originali di «100 consigli aziendali» © 2026 Beacon of the Eagle LLC.
removeClientLinks|Si eliminas este cliente, sus proyectos quedarán sin cliente asignado. Proyectos afectados: {count}.|Deleting this client will leave its projects without an assigned client. Affected projects: {count}.|Eliminando questo cliente, i suoi progetti resteranno senza un cliente assegnato. Progetti interessati: {count}.
removeProjectLinks|Si eliminas este proyecto, sus tareas quedarán sin proyecto asignado. Tareas afectadas: {count}.|Deleting this project will leave its tasks without an assigned project. Affected tasks: {count}.|Eliminando questo progetto, le sue attività resteranno senza un progetto assegnato. Attività interessate: {count}.
savedPeriod|Guardado en {period}.|Saved in {period}.|Salvato nel periodo {period}.
viewSavedMonth|Ver ese mes|View that month|Vedi quel mese
privacy|Política de privacidad|Privacy policy|Informativa sulla privacy
appTitle|Beacon · Gestión empresarial|Beacon · Business management|Beacon · Gestione aziendale
learn|APRENDE · APLICA · CRECE|LEARN · APPLY · GROW|IMPARA · APPLICA · CRESCI
tipsHeading|100 consejos. Nuevas posibilidades.|100 tips. New possibilities.|100 consigli. Nuove possibilità.
tipsIntro|Pequeñas ideas para tomar mejores decisiones en tu negocio.|Small ideas for better business decisions.|Piccole idee per decisioni aziendali migliori.
collection|COLECCIÓN EMPRESARIAL|BUSINESS COLLECTION|COLLEZIONE AZIENDALE
workspace|TU ESPACIO EMPRESARIAL|YOUR BUSINESS WORKSPACE|IL TUO SPAZIO AZIENDALE
explore|Explorar consejos|Explore tips|Esplora i consigli
favorites|Mis favoritos|My favorites|I miei preferiti
progress|Mi progreso|My progress|I miei progressi
topics|TEMAS PARA CRECER|TOPICS FOR GROWTH|TEMI PER CRESCERE
tagline|Ideas claras. Pasos concretos.|Clear ideas. Concrete steps.|Idee chiare. Passi concreti.
breadcrumb|Tu empresa, con una visión más clara.|A clearer view of your business.|Una visione più chiara della tua impresa.
export|Exportar mi espacio|Export my workspace|Esporta il mio spazio
exportHelp|Descargar datos, favoritos, notas y progreso|Download records, favorites, notes and progress|Scarica dati, preferiti, note e progressi
personalSpace|Espacio personal|Personal workspace|Spazio personale
language|Idioma|Language|Lingua
daily|TU DOSIS DIARIA DE CLARIDAD|YOUR DAILY DOSE OF CLARITY|LA TUA DOSE QUOTIDIANA DI CHIAREZZA
practice|Ponerlo en práctica|Put it into practice|Mettilo in pratica
artCaption|EL SIGUIENTE NIVEL EMPIEZA CON UNA IDEA|THE NEXT LEVEL STARTS WITH AN IDEA|IL PROSSIMO LIVELLO INIZIA CON UN’IDEA
practicalTips|consejos prácticos|practical tips|consigli pratici
essentialTopics|temas esenciales|essential topics|temi essenziali
completedActions|acciones completadas|completed actions|azioni completate
library|Tu biblioteca de ideas|Your idea library|La tua raccolta di idee
libraryIntro|Encuentra el consejo que necesitas para tu próximo paso.|Find the tip you need for your next step.|Trova il consiglio per il tuo prossimo passo.
favoriteHeading|Tus ideas favoritas|Your favorite ideas|Le tue idee preferite
favoriteIntro|Guarda los consejos que quieres tener siempre a mano.|Keep useful tips close at hand.|Tieni a portata di mano i consigli utili.
progressIntro|Revisa tus notas y las acciones que ya has completado.|Review your notes and completed actions.|Rivedi le note e le azioni completate.
searchTips|Buscar consejos|Search tips|Cerca consigli
searchPlaceholder|Buscar un tema, una idea, una oportunidad…|Search a topic, an idea, an opportunity…|Cerca un tema, un’idea, un’opportunità…
sortTips|Ordenar consejos|Sort tips|Ordina i consigli
collectionOrder|Orden de colección|Collection order|Ordine della raccolta
titleOrder|Título: A–Z|Title: A–Z|Titolo: A–Z
pendingFirst|Pendientes primero|Pending first|Prima da completare
allTopics|Todos los temas|All topics|Tutti i temi
noTips|No encontramos consejos aquí|No tips found here|Nessun consiglio trovato
trySearch|Prueba con otra palabra o cambia el tema.|Try another word or change the topic.|Prova un’altra parola o cambia tema.
emptyFavorites|Pulsa el corazón de un consejo para guardarlo aquí.|Select a tip’s heart to save it here.|Seleziona il cuore di un consiglio per salvarlo qui.
emptyProgress|Abre un consejo y añade una nota o completa su acción.|Open a tip and add a note or complete its action.|Apri un consiglio e aggiungi una nota o completa l’azione.
exploreAll|Explorar todos los consejos|Explore all tips|Esplora tutti i consigli
closingTitle|Una idea se vuelve valiosa cuando la aplicas.|An idea becomes valuable when you apply it.|Un’idea acquista valore quando la metti in pratica.
closingIntro|Abre un consejo, escribe tu próximo paso y empieza con algo pequeño.|Open a tip, write your next step and start small.|Apri un consiglio, scrivi il prossimo passo e inizia in piccolo.
surprise|Sorpréndeme con una idea|Surprise me with an idea|Sorprendimi con un’idea
localNotice|Datos guardados localmente. Exporta una copia para conservarlos.|Data is saved locally. Export a backup to keep it.|Dati salvati localmente. Esporta una copia per conservarli.
educational|Contenido educativo|Educational content|Contenuto educativo
closeTip|Cerrar consejo|Close tip|Chiudi consiglio
nextStep|TU SIGUIENTE PASO|YOUR NEXT STEP|IL TUO PROSSIMO PASSO
myNotes|Mis notas|My notes|Le mie note
autoSave|Se guardan automáticamente en este navegador|Automatically saved in this browser|Salvate automaticamente in questo browser
notePlaceholder|¿Cómo vas a aplicar esta idea a tu negocio?|How will you apply this idea to your business?|Come applicherai questa idea alla tua impresa?
saveFavorite|Guardar favorito|Save favorite|Salva nei preferiti
savedFavorite|Guardado en favoritos|Saved to favorites|Salvato nei preferiti
removeFavorite|Quitar de favoritos|Remove from favorites|Rimuovi dai preferiti
markDone|Marcar como completado|Mark as completed|Segna come completato
unmarkDone|Completado · Desmarcar|Completed · Undo|Completato · Annulla
previousTip|Consejo anterior|Previous tip|Consiglio precedente
nextTip|Siguiente consejo|Next tip|Consiglio successivo
tip|CONSEJO|TIP|CONSIGLIO
tipSingular|consejo|tip|consiglio
tipPlural|consejos|tips|consigli
readTip|Leer consejo|Read tip|Leggi consiglio
exploreTip|Explorar consejo|Explore tip|Esplora consiglio
completed|Completado|Completed|Completato
withNotes|Con notas|With notes|Con note
readTime|2 min de claridad|2 min of clarity|2 minuti di chiarezza
saveError|No se pueden guardar los cambios. Exporta tu espacio para conservarlo.|Changes cannot be saved. Export your workspace to keep them.|Impossibile salvare le modifiche. Esporta lo spazio per conservarle.
exported|Tu espacio se ha exportado.|Your workspace has been exported.|Il tuo spazio è stato esportato.
backupTooLarge|La copia supera el límite de 10 MB por archivo.|The backup exceeds the 10 MB file limit.|La copia supera il limite di 10 MB per file.
backupExportFailed|No se pudo crear una copia compatible con la restauración.|A restorable backup could not be created.|Impossibile creare una copia ripristinabile.
cat0|Estrategia|Strategy|Strategia
cat1|Clientes|Customers|Clienti
cat2|Ventas|Sales|Vendite
cat3|Finanzas|Finance|Finanza
cat4|Marketing|Marketing|Marketing
cat5|Operaciones|Operations|Operazioni
cat6|Liderazgo|Leadership|Leadership
cat7|Innovación|Innovation|Innovazione
cat8|Tecnología|Technology|Tecnologia
cat9|Crecimiento|Growth|Crescita
management|GESTIÓN EMPRESARIAL|BUSINESS MANAGEMENT|GESTIONE AZIENDALE
learning|APRENDIZAJE|LEARNING|FORMAZIONE
dashboard|Panel general|Overview|Panoramica
transactions|Ingresos y gastos|Income & expenses|Entrate e spese
clients|Clientes|Clients|Clienti
projects|Proyectos|Projects|Progetti
tasks|Tareas|Tasks|Attività
overviewTitle|Tu negocio, en perspectiva.|Your business, in perspective.|La tua impresa, in prospettiva.
overviewIntro|Convierte tus datos en decisiones. Empieza por registrar tu actividad.|Turn your records into decisions. Start by adding your activity.|Trasforma i dati in decisioni. Inizia registrando la tua attività.
period|Período|Period|Periodo
addEntry|Registrar movimiento|Add transaction|Registra movimento
addClient|Añadir cliente|Add client|Aggiungi cliente
addProject|Crear proyecto|Create project|Crea progetto
addTask|Crear tarea|Create task|Crea attività
income|Ingresos cobrados|Income received|Entrate incassate
expenses|Gastos pagados|Expenses paid|Spese pagate
net|Resultado neto de caja|Net cash result|Risultato netto di cassa
margin|Margen de caja|Cash margin|Margine di cassa
periodEntries|Movimientos del período|Transactions in the period|Movimenti del periodo
netFormula|Ingresos cobrados menos gastos pagados|Income received minus expenses paid|Entrate incassate meno spese pagate
marginFormula|Resultado de caja / ingresos × 100|Cash result / income × 100|Risultato di cassa / entrate × 100
notApplicable|Sin ingresos|No income yet|Nessuna entrata
trend|Evolución de caja|Cash movement trend|Andamento dei flussi di cassa
sixMonths|Seis meses hasta el período seleccionado · USD|Six months through the selected period · USD|Sei mesi fino al periodo selezionato · USD
incomeShort|Ingresos|Income|Entrate
expenseShort|Gastos|Expenses|Spese
noChart|Registra tu primer movimiento para ver la evolución.|Add your first transaction to see the trend.|Registra il primo movimento per vedere l’andamento.
operations|Tu operación, hoy|Your operations today|La tua attività oggi
allRecords|Todos los registros|All records|Tutti i dati
activeClients|Clientes activos|Active clients|Clienti attivi
activeProjects|Proyectos activos|Active projects|Progetti attivi
taskCompletion|Tareas completadas|Tasks completed|Attività completate
overdueTasks|Tareas vencidas|Overdue tasks|Attività scadute
upcomingTasks|Próximas tareas|Upcoming tasks|Prossime attività
viewAll|Ver todas|View all|Vedi tutte
noTasks|Aún no tienes tareas pendientes.|You have no pending tasks yet.|Non ci sono ancora attività in sospeso.
recentEntries|Movimientos recientes|Recent transactions|Movimenti recenti
noEntries|Aún no hay movimientos en este período.|No transactions in this period yet.|Nessun movimento in questo periodo.
gettingStarted|Tu espacio está listo para empezar|Your workspace is ready|Il tuo spazio è pronto
gettingStartedBody|Registra ingresos y gastos, organiza clientes y proyectos y controla tus tareas desde un solo lugar.|Record income and expenses, organize clients and projects, and track tasks in one place.|Registra entrate e spese, organizza clienti e progetti e segui le attività in un unico spazio.
cashBasis|KPI calculados sobre cobros y pagos registrados; no representan contabilidad por devengo. Importes en USD.|KPIs use recorded cash receipts and payments; they are not accrual accounting. Amounts in USD.|I KPI usano incassi e pagamenti registrati; non rappresentano contabilità per competenza. Importi in USD.
transactionsIntro|Controla los cobros y pagos registrados en el período seleccionado.|Track recorded receipts and payments in the selected period.|Controlla incassi e pagamenti registrati nel periodo selezionato.
clientsIntro|Organiza contactos, su estado y tus oportunidades comerciales.|Organize contacts, their status and sales opportunities.|Organizza contatti, stato e opportunità commerciali.
projectsIntro|Sigue el estado, presupuesto previsto y fecha de cada proyecto.|Track each project’s status, planned budget and deadline.|Segui stato, budget previsto e scadenza di ogni progetto.
tasksIntro|Define prioridades, fechas y el próximo paso de tu equipo.|Set priorities, dates and the next step for your team.|Definisci priorità, date e prossimo passo del gruppo.
searchRecords|Buscar registros|Search records|Cerca dati
all|Todos|All|Tutti
date|Fecha|Date|Data
description|Descripción|Description|Descrizione
type|Tipo|Type|Tipo
amount|Importe (USD)|Amount (USD)|Importo (USD)
category|Categoría|Category|Categoria
actions|Acciones|Actions|Azioni
name|Nombre|Name|Nome
company|Empresa|Company|Azienda
email|Correo electrónico|Email|Email
phone|Teléfono|Phone|Telefono
status|Estado|Status|Stato
opportunity|Oportunidad (USD)|Opportunity (USD)|Opportunità (USD)
budget|Presupuesto previsto (USD)|Planned budget (USD)|Budget previsto (USD)
dueDate|Fecha límite|Due date|Scadenza
priority|Prioridad|Priority|Priorità
project|Proyecto|Project|Progetto
client|Cliente|Client|Cliente
notes|Notas|Notes|Note
edit|Editar|Edit|Modifica
delete|Eliminar|Delete|Elimina
save|Guardar|Save|Salva
cancel|Cancelar|Cancel|Annulla
close|Cerrar|Close|Chiudi
newRecord|Nuevo registro|New record|Nuovo dato
editRecord|Editar registro|Edit record|Modifica dato
entryIncome|Ingreso|Income|Entrata
entryExpense|Gasto|Expense|Spesa
sales|Ventas|Sales|Vendite
services|Servicios|Services|Servizi
software|Software|Software|Software
marketing|Marketing|Marketing|Marketing
operationsCategory|Operaciones|Operations|Operazioni
other|Otro|Other|Altro
lead|Potencial|Lead|Potenziale
active|Activo|Active|Attivo
inactive|Inactivo|Inactive|Inattivo
planned|Planificado|Planned|Pianificato
inProgress|En curso|In progress|In corso
onHold|En pausa|On hold|In pausa
done|Completado|Completed|Completato
pending|Pendiente|Pending|Da completare
high|Alta|High|Alta
medium|Media|Medium|Media
low|Baja|Low|Bassa
unassigned|Sin asignar|Unassigned|Non assegnato
none|Ninguno|None|Nessuno
noRecords|Todavía no hay registros aquí.|No records here yet.|Non ci sono ancora dati.
noResults|No hay registros que coincidan.|No matching records.|Nessun dato corrispondente.
saved|Registro guardado.|Record saved.|Dato salvato.
deleted|Registro eliminado.|Record deleted.|Dato eliminato.
undo|Deshacer|Undo|Annulla
restored|Registro restaurado.|Record restored.|Dato ripristinato.
taskDone|Completar tarea|Complete task|Completa attività
taskReopen|Reabrir tarea|Reopen task|Riapri attività
pipeline|Oportunidades potenciales|Lead opportunities|Opportunità potenziali
pipelineNote|Suma estimada de clientes potenciales; no es ingreso cobrado.|Estimated lead amounts; not collected income.|Importi stimati dei potenziali clienti; non sono entrate incassate.
open|Abrir|Open|Apri
localOnly|Tus registros se guardan en este navegador.|Your records are stored in this browser.|I tuoi dati sono salvati in questo browser.
periodRequired|Selecciona un período válido.|Select a valid period.|Seleziona un periodo valido.
amountInvalid|Introduce un importe válido con un máximo de dos decimales.|Enter a valid amount with at most two decimal places.|Inserisci un importo valido con al massimo due decimali.
recordsCount|registros|records|dati
quickActions|Accesos rápidos|Quick actions|Azioni rapide
learningTitle|Una mejor decisión, cada día.|A better decision, every day.|Una decisione migliore, ogni giorno.
learningBody|Explora 100 consejos en estrategia, finanzas, clientes y más.|Explore 100 tips on strategy, finance, customers and more.|Esplora 100 consigli su strategia, finanza, clienti e altro.
openTips|Explorar los 100 consejos|Explore all 100 tips|Esplora i 100 consigli
referenceOnly|Referencia de planificación; no se suma a los gastos.|Planning reference; not added to expenses.|Riferimento di pianificazione; non aggiunto alle spese.
dueToday|Hoy|Today|Oggi
overdue|Vencida|Overdue|Scaduta
monthlySummary|Resumen mensual|Monthly summary|Riepilogo mensile
workspaceRecover|Hay una restauración pendiente. Vuelve a abrir la aplicación para recuperarla antes de guardar.|A restore is pending. Reopen the app to recover it before saving.|Un ripristino è in sospeso. Riapri l'app per completarlo prima di salvare.
savingNote|Guardando…|Saving…|Salvataggio…
noteConflict|La nota cambió en otra ventana. Copia tu borrador y vuelve a abrir la nota para revisar la versión guardada.|This note changed in another window. Copy your draft and reopen the note to review the saved version.|La nota è cambiata in un’altra finestra. Copia la bozza e riapri la nota per verificare la versione salvata.
noteWriteFailed|No se guardó el cambio. Copia el texto pendiente y vuelve a intentarlo.|The change was not saved. Copy any unsaved text and try again.|Il cambiamento non è stato salvato. Copia il testo in sospeso e riprova.
recordChanged|El registro cambió en otra ventana. Vuelve a abrirlo para revisar los datos actuales antes de guardar.|This record changed in another window. Reopen it to review the latest data before saving.|Il record è cambiato in un’altra finestra. Riaprilo e controlla i dati aggiornati prima di salvare.
relationChanged|El cliente o proyecto elegido ya no existe. Vuelve a elegir una relación disponible.|The selected client or project is no longer available. Choose an existing one.|Il cliente o il progetto selezionato non è più disponibile. Scegline uno esistente.
collectionFull|Este apartado admite 10.000 registros. Has alcanzado el límite.|This section holds up to 10,000 records. You have reached the limit.|Questa sezione può contenere fino a 10.000 record. Hai raggiunto il limite.
goalsFull|Se alcanzó el límite de 1.200 meses con metas.|The limit of 1,200 months with goals has been reached.|È stato raggiunto il limite di 1.200 mesi con obiettivi.
requiredName|Escribe un nombre o una descripción que contenga texto.|Enter a name or description containing text.|Inserisci un nome o una descrizione che contenga testo.
dateOutsideRange|Usa una fecha válida entre 1900 y 9999.|Enter a valid date between 1900 and 9999.|Inserisci una data valida tra il 1900 e il 9999.
noDueDate|Sin fecha límite|No due date|Senza scadenza
`;
for(const row of messageRows.trim().split('\n')){const [key,es,en,it]=row.split('|');messages[key]={es,en,it};}
const spanishTips=tips.map(x=>({...x}));
const spanishCategories=categories.map(x=>[...x]);
let language='en';
try{const stored=localStorage.getItem('beacon-business-language');if(['es','en','it'].includes(stored))language=stored;}catch{}
function tr(key){return messages[key]?.[language]||messages[key]?.es||key;}
function locale(){return {es:'es-ES',en:'en-US',it:'it-IT'}[language];}
function applyLocale(){
 const translated=language==='en'?tipsEN:language==='it'?tipsIT:null;
 tips=spanishTips.map((tip,i)=>translated?{...tip,title:translated[i][0],body:translated[i][1],action:translated[i][2]}:{...tip});
 categories=spanishCategories.map((cat,i)=>[tr('cat'+i),cat[1],cat[2]]);
 document.documentElement.lang=language;document.title=tr('appTitle');
 document.querySelectorAll('[data-i18n]').forEach(el=>el.textContent=tr(el.dataset.i18n));
 document.querySelectorAll('[data-i18n-placeholder]').forEach(el=>el.placeholder=tr(el.dataset.i18nPlaceholder));
 document.querySelectorAll('[data-i18n-label]').forEach(el=>el.setAttribute('aria-label',tr(el.dataset.i18nLabel)));
}
