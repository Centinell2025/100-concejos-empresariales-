(()=>{
const rows=`
reports|Informes|Reports|Report
reportsIntro|Revisa el mes y exporta los movimientos a CSV.|Review the month and export transactions to CSV.|Rivedi il mese ed esporta i movimenti in CSV.
exportCsv|Exportar CSV|Export CSV|Esporta CSV
restore|Restaurar copia|Restore backup|Ripristina copia
backupInvalid|La copia no es válida o contiene datos fuera de los límites admitidos. No se ha cambiado ningún dato.|This backup is invalid or contains unsupported data. No records were changed.|La copia non è valida o contiene dati non supportati. Nessun dato è stato modificato.
restorePreview|Revisar restauración|Review restoration|Verifica ripristino
restoreExplain|La copia reemplazará tus registros, metas mensuales, favoritos, consejos completados y notas. Revisa los totales antes de continuar.|This backup will replace your records, monthly targets, favorites, completed tips and notes. Review the totals before continuing.|La copia sostituirà i dati, gli obiettivi mensili, i preferiti, i consigli completati e le note. Controlla i totali prima di continuare.
restoreDataType|Datos|Data|Dati
restoreGoalMonths|Meses con metas|Months with targets|Mesi con obiettivi
restoreCompleted|Consejos completados|Completed tips|Consigli completati
restoreEarlier|Antes de restaurar|Before restoration|Prima del ripristino
undoReviewExplain|Deshacer reemplazará todo el espacio actual por el estado anterior. Puedes perder ediciones, metas o movimientos añadidos después de restaurar, aunque las cantidades coincidan. Para conservarlos, exporta primero una copia actual. Después podrás volver a decidir.|Undo will replace the entire current workspace with its previous state. Edits, targets or transactions added since restoration may be lost, even if the counts match. To keep them, export a current backup first. You can then decide again.|Annullando, l’intero spazio attuale verrà sostituito dallo stato precedente. Potresti perdere modifiche, obiettivi o movimenti aggiunti dopo il ripristino, anche se i conteggi coincidono. Per conservarli, esporta prima una copia attuale. Poi potrai decidere di nuovo.
undoExport|Exportar copia actual|Export current backup|Esporta copia attuale
undoConfirm|Reemplazar por el estado anterior|Replace with previous state|Sostituisci con lo stato precedente
restoreReviewAgain|El espacio cambió. Revisa los datos actuales antes de volver a confirmar.|The workspace changed. Review the current data before confirming again.|Lo spazio è cambiato. Controlla i dati attuali prima di confermare di nuovo.
restoreRecoveryTitle|Recuperar la restauración interrumpida|Recover interrupted restore|Recupera il ripristino interrotto
restoreRecoveryBody|La restauración quedó incompleta. La aplicación tiene una copia del estado previo. Habilita el almacenamiento de la aplicación o libera espacio y reintenta la recuperación.|The restore was interrupted. The app has a copy of the previous state. Enable app storage or free up space and retry recovery.|Il ripristino è rimasto incompleto. L’app ha una copia dello stato precedente. Abilita l’archiviazione o libera spazio e riprova il recupero.
restoreRetry|Reintentar recuperación|Retry recovery|Riprova il recupero
restoreRecovered|Se recuperó el estado anterior a la operación interrumpida.|The state from before the interrupted operation was recovered.|È stato recuperato lo stato precedente all’operazione interrotta.
current|Actuales|Current|Attuali
incoming|En la copia|In backup|Nella copia
confirmRestore|Restaurar estos datos|Restore these records|Ripristina questi dati
undoRestore|Deshacer última restauración|Undo last restoration|Annulla ultimo ripristino
restoreSuccess|Copia restaurada correctamente.|Backup restored successfully.|Copia ripristinata correttamente.
restoreUndoSuccess|Se recuperaron los datos anteriores.|Previous records restored.|Dati precedenti recuperati.
monthlyGoals|Metas del mes|Monthly targets|Obiettivi mensili
editGoals|Editar metas|Edit targets|Modifica obiettivi
incomeGoal|Meta de ingresos (USD)|Income target (USD)|Obiettivo entrate (USD)
expenseBudget|Límite de gastos (USD)|Expense budget (USD)|Budget spese (USD)
noTarget|Sin meta definida|No target set|Nessun obiettivo
incomeProgress|Avance de ingresos|Income target progress|Avanzamento entrate
expenseProgress|Presupuesto utilizado|Expense budget used|Budget utilizzato
budgetRemaining|Presupuesto restante|Budget remaining|Budget rimanente
budgetExceeded|Presupuesto excedido|Budget exceeded|Budget superato
zeroDisables|Un valor de cero deja esa meta sin configurar. Los objetivos no se cuentan como movimientos.|Zero leaves a target unset. Targets are not counted as transactions.|Zero lascia l’obiettivo non impostato. Gli obiettivi non sono movimenti.
categorySummary|Resumen por categoría|Category summary|Riepilogo per categoria
count|Cantidad|Count|Numero
exportEmpty|No hay movimientos en el período seleccionado para exportar.|There are no transactions in the selected period to export.|Nessun movimento da esportare nel periodo selezionato.
exportSuccess|Exportación completada.|Export completed.|Esportazione completata.
chooseBackup|Elegir una copia JSON|Choose a JSON backup|Scegli una copia JSON
restoreFailed|No se pudo restaurar la copia. Se mantuvieron los registros anteriores.|The backup could not be restored. Previous records were preserved.|Impossibile ripristinare la copia. I dati precedenti sono stati conservati.
`;
for(const row of rows.trim().split('\n')){const[k,es,en,it]=row.split('|');messages[k]={es,en,it}}
const api=window.BeaconBusiness;if(!api)return;
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=n=>new Intl.NumberFormat(locale(),{style:'currency',currency:'USD'}).format(n/100);
const calc=(db,month)=>{const entries=db.transactions.filter(x=>x.date.startsWith(month));const income=entries.filter(x=>x.type==='entryIncome').reduce((s,x)=>s+x.amount,0);const expenses=entries.filter(x=>x.type==='entryExpense').reduce((s,x)=>s+x.amount,0);return {entries,income,expenses,net:income-expenses}};
const reports=document.createElement('button');reports.className='nav';reports.dataset.businessPage='reports';reports.innerHTML='<span>▥</span><span class="nav-text" data-i18n="reports"></span>';reports.onclick=()=>api.go('reports');$('.business-nav').append(reports);
const restore=document.createElement('button');restore.className='text-button';restore.dataset.i18n='restore';restore.id='restore-backup';restore.onclick=chooseBackup;$('.top-actions').append(restore);
const undo=document.createElement('button');undo.className='text-button';undo.dataset.i18n='undoRestore';undo.id='undo-restore';undo.hidden=!hasPrevious();undo.onclick=undoRestore;$('.top-actions').append(undo);
const input=document.createElement('input');input.type='file';input.accept='.json,application/json';input.hidden=true;input.id='backup-file';document.body.append(input);input.onchange=async()=>{const f=input.files[0];if(!f)return;try{if(f.size>10000000)throw Error('size');preview(await f.text())}catch{toast(tr('backupInvalid'))}input.value=''};
const dialog=document.createElement('dialog');dialog.id='enhancement-dialog';document.body.append(dialog);dialog.addEventListener('close',()=>document.body.style.overflow='');
function openDialog(html){dialog.innerHTML=html;dialog.showModal();document.body.style.overflow='hidden';dialog.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>dialog.close())}
const businessKey='beacon-management-v1', learningKey='beacon-business-v1';
const previousKey='beacon-before-restore', journalKey='beacon-restore-journal-v1';
const storedKeys=[businessKey,learningKey,previousKey];

function hasPrevious(){try{return !!localStorage.getItem('beacon-before-restore')}catch{return false}}
function chooseBackup(){if(window.BeaconAndroid?.importBackup)window.BeaconAndroid.importBackup();else input.click()}

function liveWorkspace(){
  return {business:api.refreshFromStorage(),learning:readLearning()};
}
function updateWorkspace(workspace){
  state=workspace.learning;
  api.replaceData(workspace.business);
  updateStats();render();
  undo.hidden=!hasPrevious();
  document.dispatchEvent(new Event('beacon-workspace-replaced'));
}
async function signature(serialized){
  if(!globalThis.crypto?.subtle)return null;
  try{
    const bytes=await crypto.subtle.digest('SHA-256',new TextEncoder().encode(serialized));
    return Array.from(new Uint8Array(bytes),n=>n.toString(16).padStart(2,'0')).join('');
  }catch{return null}
}

function counts(workspace){
  const {business,learning}=workspace;
  return [
    ['transactions',business.transactions.length],['clients',business.clients.length],
    ['projects',business.projects.length],['tasks',business.tasks.length],
    ['restoreGoalMonths',Object.values(business.goals||{}).filter(g=>g.income||g.expenses).length],
    ['favorites',learning.favorites.length],['restoreCompleted',learning.done.length],
    ['myNotes',Object.keys(learning.notes).length]
  ];
}
function reviewTable(now,other,column){
  const otherCounts=new Map(counts(other));
  const items=counts(now).map(([key,n])=>
    `<tr><th scope="row">${tr(key)}</th><td>${n}</td><td>${otherCounts.get(key)}</td></tr>`).join('');
  return `<table><thead><tr><th scope="col">${tr('restoreDataType')}</th><th scope="col">${tr('current')}</th><th scope="col">${tr(column)}</th></tr></thead><tbody>${items}</tbody></table>`;
}
function restoreDialog(title,explanation,table,actions){
  openDialog(`<div class="dialog-top"><span class="eyebrow">BEACON BUSINESS</span><button class="icon-button" data-close aria-label="${tr('close')}">×</button></div><h2>${tr(title)}</h2><p class="detail-body">${tr(explanation)}</p>${table}<p class="form-error" id="restore-message" role="alert" hidden></p><div class="dialog-actions">${actions}</div>`);
  dialog.querySelector('.dialog-actions [data-close]')?.focus();
}
function preview(text){
  let incoming;
  try{incoming=validateBeaconBackup(text)}catch{toast(tr('backupInvalid'));return}
  reviewImport(incoming);
}
function reviewImport(incoming,changed=false){
  try{
    const current=liveWorkspace(), expected=JSON.stringify(current);
    const explanation=changed?'restoreReviewAgain':'restoreExplain';
    restoreDialog('restorePreview',explanation,reviewTable(current,incoming,'incoming'),`
      <button class="secondary" data-close>${tr('cancel')}</button>
      <button class="primary" id="confirm-restore">${tr('confirmRestore')}</button>`);
    $('#confirm-restore').onclick=async event=>{
      const button=event.currentTarget;button.disabled=true;
      try{
        const restoredHash=await signature(JSON.stringify(incoming));
        await api.withWorkspaceLock(()=>{
          if(!dialog.open||!button.isConnected)return;
          const current=liveWorkspace();
          if(JSON.stringify(current)!==expected)return reviewImport(incoming,true);
          commitRestore(incoming,JSON.stringify({...current,restoredHash}));
          dialog.close();toast(tr('restoreSuccess'));
        });
      }catch{showRestoreError()}
      finally{button.disabled=false}
    };
  }catch{showRestoreError()}
}

// A journal contains the exact previous bytes, including the previous Undo target.
// Its removal is the commit point. An interruption before then rolls back on startup.
function recoverJournal(){
  const raw=localStorage.getItem(journalKey);
  if(raw===null)return;
  const before=JSON.parse(raw);
  if(!Array.isArray(before)||before.length!==storedKeys.length||
      before.some(value=>value!==null&&typeof value!=='string'))throw Error('journal');
  // Free any partially written replacements before reinstating the original values.
  storedKeys.forEach((key,i)=>{
    if(localStorage.getItem(key)!==before[i])localStorage.removeItem(key);
  });
  storedKeys.forEach((key,i)=>{
    if(before[i]!==null&&localStorage.getItem(key)!==before[i])localStorage.setItem(key,before[i]);
  });
  localStorage.removeItem(journalKey);
}
function showRestoreError(){
  let pending=false;
  try{pending=localStorage.getItem(journalKey)!==null}catch{}
  if(pending){showRecovery();return}
  const status=dialog.querySelector('#restore-message');
  if(status){status.textContent=tr('restoreFailed');status.hidden=false}
  toast(tr('restoreFailed'));
}
function showRecovery(){
  openDialog(`<h2>${tr('restoreRecoveryTitle')}</h2><p>${tr('restoreRecoveryBody')}</p>
    <button class="primary" id="retry-recovery">${tr('restoreRetry')}</button>`);
  dialog.oncancel=event=>event.preventDefault();
  $('#retry-recovery').onclick=recoverOnOpen;
}
async function recoverOnOpen(){
  try{
    await api.withWorkspaceLock(()=>{recoverJournal();updateWorkspace(liveWorkspace())});
    dialog.oncancel=null;
    if(dialog.open)dialog.close();
    toast(tr('restoreRecovered'));
  }catch{showRecovery()}
}
function commitRestore(incoming,nextPrevious){
  if(localStorage.getItem(journalKey)!==null)throw Error('pending recovery');
  const before=storedKeys.map(key=>localStorage.getItem(key));
  localStorage.setItem(journalKey,JSON.stringify(before));
  try{
    localStorage.setItem(businessKey,JSON.stringify(incoming.business));
    localStorage.setItem(learningKey,JSON.stringify(incoming.learning));
    if(nextPrevious===null)localStorage.removeItem(previousKey);
    else localStorage.setItem(previousKey,nextPrevious);
    localStorage.removeItem(journalKey);
  }catch(error){recoverJournal();throw error}
  updateWorkspace(incoming);
}
function validatedPrevious(raw){
  const previous=JSON.parse(raw);
  const wrapped={app:'Beacon Business',version:2,business:previous.business,learning:{
    favorites:previous.learning.favorites,completed:previous.learning.done,notes:previous.learning.notes
  }};
  return {workspace:validateBeaconBackup(JSON.stringify(wrapped),{localUndo:true}),restoredHash:previous.restoredHash};
}
async function undoRestore(){
  if(undo.disabled)return;
  undo.disabled=true;
  try{
    const raw=localStorage.getItem(previousKey);
    if(!raw){undo.hidden=true;return}
    const previous=validatedPrevious(raw);
    const expected=JSON.stringify(liveWorkspace());
    const hash=await signature(expected);
    await api.withWorkspaceLock(()=>{
      if(localStorage.getItem(previousKey)!==raw){toast(tr('restoreReviewAgain'));return}
      const current=liveWorkspace();
      if(hash&&hash===previous.restoredHash&&JSON.stringify(current)===expected){
        commitRestore(previous.workspace,null);toast(tr('restoreUndoSuccess'));return;
      }
      reviewUndo(previous.workspace,raw,current);
    });
  }catch{showRestoreError()}
  finally{undo.disabled=false}
}
function reviewUndo(previous,raw,current){
  const expected=JSON.stringify(current);
  restoreDialog('undoRestore','undoReviewExplain',reviewTable(current,previous,'restoreEarlier'),`
    <button class="secondary" data-close>${tr('cancel')}</button>
    <button class="secondary" id="export-before-undo">${tr('undoExport')}</button>
    <button class="primary" id="confirm-undo-restore">${tr('undoConfirm')}</button>`);
  $('#export-before-undo').onclick=async()=>{
    try{
      dialog.close();
      await exportWorkspace();
    }catch{toast(tr('saveError'))}
  };
  $('#confirm-undo-restore').onclick=async event=>{
    const button=event.currentTarget;button.disabled=true;
    try{
      await api.withWorkspaceLock(()=>{
        if(!dialog.open||!button.isConnected)return;
        if(localStorage.getItem(previousKey)!==raw){dialog.close();toast(tr('restoreReviewAgain'));return}
        const current=liveWorkspace();
        if(JSON.stringify(current)!==expected){reviewUndo(previous,raw,current);return}
        commitRestore(previous,null);dialog.close();toast(tr('restoreUndoSuccess'));
      });
    }catch{showRestoreError()}
    finally{button.disabled=false}
  };
}
window.addEventListener('storage',event=>{
  if(event.key===previousKey||event.key===null)undo.hidden=!hasPrevious();
});
try{if(localStorage.getItem(journalKey)!==null){showRecovery();recoverOnOpen()}}catch{}
function goals(){
  const month = api.getMonth();
  const goal = api.getSnapshot().goals?.[month] || {income:0, expenses:0};
  openDialog(`<div class="dialog-top"><span class="eyebrow">${tr('monthlyGoals')} · ${month}</span><button class="icon-button" data-close aria-label="${tr('close')}">×</button></div>
    <h2>${tr('editGoals')}</h2>
    <form id="goals-form">
      <div class="form-grid">
        ${BeaconMoneyInput.field('income','incomeGoal',goal.income,{required:true})}
        ${BeaconMoneyInput.field('expenses','expenseBudget',goal.expenses,{required:true})}
      </div>
      <p class="kpi-footnote">${tr('zeroDisables')}</p>
      <div class="dialog-actions"><button class="secondary" type="button" data-close>${tr('cancel')}</button>
        <button class="primary" type="submit">${tr('save')}</button></div>
    </form>`);
  const form = $('#goals-form');
  BeaconMoneyInput.bind(form);
  form.onsubmit = async e => {
    e.preventDefault();
    const values = BeaconMoneyInput.read(form);
    if (!values || !(await api.setGoals(month,values,goal))) return;
    dialog.close();
    toast(tr('saved'));
  };
}
function goalPanel(db,month){const g=db.goals?.[month]||{income:0,expenses:0},v=calc(db,month);return `<section class="goal-panel"><div class="panel-heading"><div><h2>${tr('monthlyGoals')}</h2><p>${month}</p></div><button class="text-button" id="edit-goals">${tr('editGoals')}</button></div><div class="goal-columns">${[['income',v.income,'incomeProgress'],['expenses',v.expenses,'expenseProgress']].map(([k,actual,label])=>{const target=g[k],pct=target?actual/target*100:0;return `<div class="goal-item"><div><span>${tr(label)}</span><b>${target?new Intl.NumberFormat(locale(),{maximumFractionDigits:1}).format(pct)+'%':tr('noTarget')}</b></div><div class="completion-track ${k==='expenses'&&actual>target&&target?'over-budget':''}"><span style="width:${Math.min(pct,100)}%"></span></div><p>${money(actual)} / ${target?money(target):'—'}${k==='expenses'&&target?' · '+tr(actual>target?'budgetExceeded':'budgetRemaining')+': '+money(Math.abs(target-actual)):''}</p></div>`}).join('')}</div></section>`}
window.BeaconReports={render(db,month){const v=calc(db,month),categories=['sales','services','software','marketing','operationsCategory','other'];return `<div class="biz-heading"><div><div class="eyebrow">BEACON BUSINESS</div><h1>${tr('reports')}</h1><p>${tr('reportsIntro')}</p></div><div class="biz-heading-actions"><label class="period-control"><span>${tr('period')}</span><input type="month" id="biz-month" aria-label="${tr('period')}" value="${month}"></label><button class="primary" id="export-report">${tr('exportCsv')}</button></div></div><section class="report-totals">${[['income',v.income],['expenses',v.expenses],['net',v.net]].map(([k,n])=>`<article class="kpi-card"><div class="kpi-label">${tr(k)}</div><strong>${money(n)}</strong></article>`).join('')}</section>${goalPanel(db,month)}<article class="biz-panel"><div class="panel-heading"><h2>${tr('categorySummary')}</h2></div><div class="table-scroll"><table><thead><tr><th>${tr('category')}</th><th>${tr('count')}</th><th>${tr('incomeShort')}</th><th>${tr('expenseShort')}</th><th>${tr('net')}</th></tr></thead><tbody>${categories.map(c=>{const a=v.entries.filter(x=>x.category===c),income=a.filter(x=>x.type==='entryIncome').reduce((s,x)=>s+x.amount,0),expenses=a.filter(x=>x.type==='entryExpense').reduce((s,x)=>s+x.amount,0);return `<tr><td>${tr(c)}</td><td>${a.length}</td><td>${money(income)}</td><td>${money(expenses)}</td><td>${money(income-expenses)}</td></tr>`}).join('')}</tbody></table></div></article><p class="kpi-footnote">${tr('cashBasis')}</p>`}};
function exportReport(){const {entries}=calc(api.getSnapshot(),api.getMonth());if(!entries.length){toast(tr('exportEmpty'));return}const csv='\ufeff'+[[tr('date'),tr('type'),tr('category'),tr('description'),tr('amount'),tr('notes')],...entries.map(x=>[x.date,tr(x.type),tr(x.category),x.description,(x.amount/100).toFixed(2),x.notes])].map(row=>row.map(beaconCsvCell).join(',')).join('\r\n');if(window.BeaconAndroid?.exportReport){window.BeaconAndroid.exportReport(csv);return}const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='beacon-business-'+api.getMonth()+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast(tr('exportSuccess'))}
function afterDraw(e){const page=e.detail.page;if(page==='dashboard'){const wrapper=document.createElement('div');wrapper.innerHTML=goalPanel(api.getSnapshot(),api.getMonth());$('.kpi-footnote').after(wrapper.firstElementChild)}if($('#edit-goals'))$('#edit-goals').onclick=goals;if($('#export-report'))$('#export-report').onclick=exportReport}
document.addEventListener('beacon-business-render',afterDraw);document.addEventListener('beacon-import-file',e=>preview(e.detail));document.addEventListener('beacon-import-error',()=>toast(tr('backupInvalid')));document.addEventListener('beacon-language',()=>{if(dialog.open)dialog.close();applyLocale();api.refresh()});
applyLocale();api.refresh();
})();
