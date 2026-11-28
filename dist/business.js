(()=>{
const money=n=>new Intl.NumberFormat(locale(),{style:'currency',currency:'USD',maximumFractionDigits:2}).format(n/100);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const today=()=>{const d=new Date();return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`};
let db={transactions:[],clients:[],projects:[],tasks:[],goals:{}};try{const stored=JSON.parse(localStorage.getItem('beacon-management-v1'));for(const k of Object.keys(db))if(Array.isArray(stored?.[k]))db[k]=stored[k].filter(x=>x&&typeof x.id==='string');if(stored?.goals&&typeof stored.goals==='object'&&!Array.isArray(stored.goals))db.goals=stored.goals}catch{}
managementSnapshot=()=>structuredClone(db);
let page='dashboard',month=today().slice(0,7),search='',filter='all',editing=null;
const icons={dashboard:'▦',transactions:'▤',clients:'♧',projects:'▣',tasks:'✓'};
const main=$('main');const learning=document.createElement('div');learning.id='tips-workspace';while(main.firstChild)learning.append(main.firstChild);main.append(learning);const workspace=document.createElement('section');workspace.id='business-workspace';main.prepend(workspace);
const nav=document.createElement('nav');nav.className='business-nav';nav.setAttribute('aria-label',tr('management'));const navLabel=document.createElement('div');navLabel.className='side-label business-label';navLabel.dataset.i18n='management';navLabel.textContent=tr('management');const sidebar=$('.sidebar');sidebar.insertBefore(navLabel,sidebar.querySelector('.side-label'));sidebar.insertBefore(nav,navLabel.nextSibling);
for(const key of Object.keys(icons)){const b=document.createElement('button');b.className='nav';b.dataset.businessPage=key;b.innerHTML=`<span>${icons[key]}</span><span class="nav-text" data-i18n="${key}">${tr(key)}</span>`;b.onclick=()=>go(key);nav.append(b)}
const recordDialog=document.createElement('dialog');recordDialog.id='record-dialog';document.body.append(recordDialog);recordDialog.addEventListener('close',()=>document.body.style.overflow='');
function save(next=db){try{localStorage.setItem('beacon-management-v1',JSON.stringify(next));db=next;return true}catch{toast(tr('saveError'));return false}}
function go(next){page=next;search='';filter='all';learning.hidden=true;workspace.hidden=false;$('#side-categories').hidden=true;$('.categories-label').hidden=true;document.querySelectorAll('[data-view]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')});draw();window.scrollTo({top:0,behavior:'smooth'})}
function showLearning(){learning.hidden=false;workspace.hidden=true;page='learning';$('#side-categories').hidden=false;$('.categories-label').hidden=false;document.querySelectorAll('[data-business-page]').forEach(b=>{b.classList.remove('active');b.setAttribute('aria-pressed','false')})}
sidebar.addEventListener('click',e=>{if(e.target.closest('[data-view]'))showLearning()},true);
$('.brand').onclick=e=>{e.preventDefault();go('dashboard')};
function byId(key,id){return db[key].find(x=>x.id===id)}
function labelDate(s){return s?new Intl.DateTimeFormat(locale(),{day:'numeric',month:'short',year:'numeric'}).format(new Date(s+'T12:00:00')):'—'}
function totals(period){const rows=db.transactions.filter(x=>String(x.date).startsWith(period));const income=rows.filter(x=>x.type==='entryIncome').reduce((n,x)=>n+x.amount,0);const expenses=rows.filter(x=>x.type==='entryExpense').reduce((n,x)=>n+x.amount,0);return {income,expenses,net:income-expenses,margin:income?(income-expenses)/income*100:null,rows}}
function periodControl(){return `<label class="period-control"><span>${tr('period')}</span><input aria-label="${tr('period')}" type="month" id="biz-month" value="${month}" required></label>`}
function button(key,kind){return `<button class="primary" data-add="${kind}">＋ ${tr(key)}</button>`}
function header(title,subtitle,actions=''){return `<div class="biz-heading"><div><div class="eyebrow">BEACON BUSINESS</div><h1>${tr(title)}</h1><p>${tr(subtitle)}</p></div><div class="biz-heading-actions">${actions}</div></div>`}
const summaryCopy = {
  en: { tools: 'Tools', title: 'Monthly overview', income: 'Record income', expense: 'Record expense', basis: 'Based on money received and payments made. Amounts in USD.' },
  es: { tools: 'Herramientas', title: 'Resumen mensual', income: 'Registrar ingreso', expense: 'Registrar gasto', basis: 'Cifras en USD calculadas con los cobros y pagos registrados.' },
  it: { tools: 'Strumenti', title: 'Riepilogo mensile', income: 'Registra entrata', expense: 'Registra spesa', basis: 'Importi in USD calcolati sugli incassi e i pagamenti registrati.' }
};
function setupMobileTools() {
  const toolbar = document.querySelector('.top-actions');
  const compact = window.matchMedia('(max-width: 760px)');
  const menu = document.createElement('details');
  const label = document.createElement('summary');
  const list = document.createElement('div');
  const actions = [];
  menu.className = 'workspace-tools';
  list.className = 'workspace-tools-items';
  menu.append(label, list);
  function translateLabel() {
    label.textContent = (summaryCopy[language] || summaryCopy.en).tools;
  }
  function arrange() {
    if (compact.matches && !menu.isConnected) {
      for (const action of toolbar.querySelectorAll('button:not(#undo-restore), a')) {
        const place = document.createComment('toolbar action');
        action.before(place);
        list.append(action);
        actions.push({action, place});
      }
      toolbar.append(menu);
    } else if (!compact.matches && menu.isConnected) {
      menu.open = false;
      for (const {action, place} of actions) place.replaceWith(action);
      actions.length = 0;
      menu.remove();
    }
  }
  menu.addEventListener('keydown', event => {
    if (event.key === 'Escape' && menu.open) {
      event.preventDefault();
      menu.open = false;
      label.focus();
    }
  });
  list.addEventListener('click', () => { menu.open = false; });
  document.addEventListener('pointerdown', event => {
    if (menu.open && !menu.contains(event.target)) menu.open = false;
  });
  document.addEventListener('beacon-language', translateLabel);
  compact.addEventListener('change', arrange);
  translateLabel();
  arrange();
}
document.addEventListener('DOMContentLoaded', setupMobileTools, {once: true});

function cashSummary(data) {
  const copy = summaryCopy[language] || summaryCopy.en;
  const margin = data.margin === null ? '—' : new Intl.NumberFormat(locale(), {maximumFractionDigits: 1}).format(data.margin) + '%';
  const movements = [
    {type: 'entryIncome', label: 'income', amount: data.income, action: copy.income},
    {type: 'entryExpense', label: 'expenses', amount: data.expenses, action: copy.expense}
  ];
  return `<div class="dashboard-heading">
    <h1>${copy.title}</h1>
    ${periodControl()}
  </div>
  <section class="cash-summary" aria-labelledby="cash-result-label">
    <div class="cash-result">
      <h2 id="cash-result-label">${tr('net')}</h2>
      <strong id="cash-result-amount">${money(data.net)}</strong>
      <dl class="cash-margin"><dt>${tr('margin')}</dt>
        <dd title="${tr(data.margin === null ? 'notApplicable' : 'marginFormula')}">${margin}</dd>
      </dl>
    </div>
    <div class="cash-movements">
      ${movements.map(entry => `<div class="cash-movement">
        <div class="cash-movement-details">
          <h3><span class="cash-marker ${entry.type}" aria-hidden="true"></span>${tr(entry.label)}</h3>
          <strong data-cash-total="${entry.type}">${money(entry.amount)}</strong>
        </div>
        <button type="button" class="cash-action" data-add="transactions" data-entry-type="${entry.type}">
          <span aria-hidden="true">+</span> ${entry.action}
        </button>
      </div>`).join('')}
    </div>
  </section>
  <div class="dashboard-planning"><p class="kpi-footnote">${copy.basis}</p></div>`;
}
function chart(){const periods=[];const [y,m]=month.split('-').map(Number);for(let i=5;i>=0;i--){const d=new Date(y,m-1-i,1);const p=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;periods.push({period:p,label:new Intl.DateTimeFormat(locale(),{month:'short'}).format(d),...totals(p)})}const max=Math.max(...periods.flatMap(x=>[x.income,x.expenses]),1);const any=periods.some(x=>x.income||x.expenses);return `<article class="biz-panel chart-panel"><div class="panel-heading"><div><h2>${tr('trend')}</h2><p>${tr('sixMonths')}</p></div><div class="chart-legend"><span><i></i>${tr('incomeShort')}</span><span><i></i>${tr('expenseShort')}</span></div></div>${any?`<div class="bar-chart">${periods.map(x=>`<div class="month-group"><div class="bars"><div class="bar income-bar" style="height:${x.income/max*100}%" title="${esc(x.period+' · '+tr('incomeShort')+': '+money(x.income))}"><span>${money(x.income)}</span></div><div class="bar expense-bar" style="height:${x.expenses/max*100}%" title="${esc(x.period+' · '+tr('expenseShort')+': '+money(x.expenses))}"><span>${money(x.expenses)}</span></div></div><span class="month-label">${x.label}</span></div>`).join('')}</div>`:`<div class="chart-empty"><div class="empty-chart-art" aria-hidden="true"><i></i><i></i><i></i><i></i><i></i><i></i></div><p>${tr('noChart')}</p>${button('addEntry','transactions')}</div>`}<details class="chart-data"><summary>${tr('monthlySummary')}</summary><div class="table-scroll"><table><thead><tr><th>${tr('period')}</th><th>${tr('incomeShort')}</th><th>${tr('expenseShort')}</th><th>${tr('net')}</th></tr></thead><tbody>${periods.map(x=>`<tr><td>${x.period}</td><td>${money(x.income)}</td><td>${money(x.expenses)}</td><td>${money(x.net)}</td></tr>`).join('')}</tbody></table></div></details></article>`}
function operationCard(label,value,symbol){return `<div class="operation-stat"><span>${symbol}</span><div><strong>${value}</strong><p>${tr(label)}</p></div></div>`}
function taskRow(t){const overdue=t.dueDate&&t.dueDate<today()&&t.status!=='done';return `<div class="task-row"><button class="task-check ${t.status==='done'?'checked':''}" data-toggle-task="${esc(t.id)}" aria-label="${tr(t.status==='done'?'taskReopen':'taskDone')}: ${esc(t.name)}" aria-pressed="${t.status==='done'}">${t.status==='done'?'✓':''}</button><div><strong>${esc(t.name)}</strong><small class="${overdue?'overdue':''}">${t.dueDate?labelDate(t.dueDate):tr('noDueDate')}${overdue?' · '+tr('overdue'):''}</small></div><span class="status-pill ${esc(t.priority)}">${tr(t.priority)}</span></div>`}
function dashboard(){const data=totals(month);const done=db.tasks.filter(t=>t.status==='done').length;const pending=db.tasks.filter(t=>t.status!=='done').sort((a,b)=>(a.dueDate||'9999').localeCompare(b.dueDate||'9999'));const overdue=pending.filter(t=>t.dueDate&&t.dueDate<today()).length;return cashSummary(data)+`<div class="dashboard-middle">${chart()}<article class="biz-panel operations-panel"><div class="panel-heading"><div><h2>${tr('operations')}</h2><p>${tr('allRecords')}</p></div><span class="panel-icon">◈</span></div>${operationCard('activeClients',db.clients.filter(c=>c.status==='active').length,'♧')}${operationCard('activeProjects',db.projects.filter(p=>p.status==='inProgress').length,'▣')}${operationCard('taskCompletion',done+' / '+db.tasks.length,'✓')}${operationCard('overdueTasks',overdue,'◷')}<div class="completion-track"><span style="width:${db.tasks.length?done/db.tasks.length*100:0}%"></span></div></article></div><div class="dashboard-bottom"><article class="biz-panel"><div class="panel-heading"><h2>${tr('upcomingTasks')}</h2><button class="text-button" data-go="tasks">${tr('viewAll')}</button></div>${pending.length?pending.slice(0,4).map(taskRow).join(''):`<div class="panel-empty"><span>✓</span><p>${tr('noTasks')}</p>${button('addTask','tasks')}</div>`}</article><article class="biz-panel"><div class="panel-heading"><h2>${tr('recentEntries')}</h2><button class="text-button" data-go="transactions">${tr('viewAll')}</button></div>${data.rows.length?`<div class="recent-list">${[...data.rows].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,4).map(x=>`<div class="recent-row"><span class="transaction-icon ${x.type}">${x.type==='entryIncome'?'↗':'↘'}</span><div><strong>${esc(x.description)}</strong><small>${labelDate(x.date)} · ${tr(x.category)}</small></div><b class="${x.type}">${x.type==='entryIncome'?'+':'−'}${money(x.amount)}</b></div>`).join('')}</div>`:`<div class="panel-empty"><span>▤</span><p>${tr('noEntries')}</p>${button('addEntry','transactions')}</div>`}</article></div><section class="learning-banner"><span>✦</span><div><h3>${tr('learningTitle')}</h3><p>${tr('learningBody')}</p></div><button class="secondary" id="open-learning">${tr('openTips')}</button></section>`}
const statusOptions={clients:['lead','active','inactive'],projects:['planned','inProgress','onHold','done'],tasks:['pending','inProgress','done'],transactions:['entryIncome','entryExpense']};
function actionButtons(x){return `<div class="row-actions"><button data-edit="${esc(x.id)}" title="${tr('edit')}" aria-label="${tr('edit')}: ${esc(x.name||x.description)}">✎</button><button data-delete="${esc(x.id)}" title="${tr('delete')}" aria-label="${tr('delete')}: ${esc(x.name||x.description)}">×</button></div>`}
function records(){const isLedger=page==='transactions';let rows=db[page].filter(x=>(!isLedger||x.date?.startsWith(month))&&(filter==='all'||(isLedger?x.type:x.status)===filter)&&normalize(Object.values(x).join(' ')).includes(normalize(search)));const addKeys={transactions:'addEntry',clients:'addClient',projects:'addProject',tasks:'addTask'};let content='';if(page==='transactions'){rows.sort((a,b)=>b.date.localeCompare(a.date));content=`<table><thead><tr>${['date','description','type','category','amount','actions'].map(k=>`<th>${tr(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr><td>${labelDate(x.date)}</td><td><strong>${esc(x.description)}</strong></td><td><span class="status-pill ${x.type}">${tr(x.type)}</span></td><td>${tr(x.category)}</td><td class="money-cell">${money(x.amount)}</td><td>${actionButtons(x)}</td></tr>`).join('')}</tbody></table>`}else if(page==='clients'){content=`<table><thead><tr>${['name','company','email','status','opportunity','actions'].map(k=>`<th>${tr(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr><td><strong>${esc(x.name)}</strong>${x.phone?`<small>${esc(x.phone)}</small>`:''}</td><td>${esc(x.company)||'—'}</td><td>${esc(x.email)||'—'}</td><td><span class="status-pill ${x.status}">${tr(x.status)}</span></td><td>${money(x.opportunity||0)}</td><td>${actionButtons(x)}</td></tr>`).join('')}</tbody></table>`}else if(page==='projects'){content=`<div class="project-grid">${rows.map(x=>{const tasks=db.tasks.filter(t=>t.project===x.id),done=tasks.filter(t=>t.status==='done').length;return `<article class="project-card"><div class="project-card-top"><span class="project-icon">▣</span><span class="status-pill ${x.status}">${tr(x.status)}</span></div><h3>${esc(x.name)}</h3><p>${esc(byId('clients',x.client)?.name)||tr('unassigned')}</p><dl><div><dt>${tr('budget')}</dt><dd>${money(x.budget||0)}</dd></div><div><dt>${tr('dueDate')}</dt><dd>${x.dueDate?labelDate(x.dueDate):'—'}</dd></div></dl><div class="completion-track"><span style="width:${tasks.length?done/tasks.length*100:0}%"></span></div><div class="project-card-bottom"><small>${done} / ${tasks.length} ${tr('tasks').toLocaleLowerCase(language)}</small>${actionButtons(x)}</div></article>`}).join('')}</div>`}else{content=`<table><thead><tr>${['name','project','dueDate','priority','status','actions'].map(k=>`<th>${tr(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(x=>`<tr><td><div class="task-name"><button class="task-check ${x.status==='done'?'checked':''}" data-toggle-task="${esc(x.id)}" aria-label="${tr(x.status==='done'?'taskReopen':'taskDone')}: ${esc(x.name)}">${x.status==='done'?'✓':''}</button><strong>${esc(x.name)}</strong></div></td><td>${esc(byId('projects',x.project)?.name)||'—'}</td><td class="${x.status!=='done'&&x.dueDate&&x.dueDate<today()?'overdue':''}">${x.dueDate?labelDate(x.dueDate):'—'}</td><td><span class="status-pill ${x.priority}">${tr(x.priority)}</span></td><td><span class="status-pill ${x.status}">${tr(x.status)}</span></td><td>${actionButtons(x)}</td></tr>`).join('')}</tbody></table>`}
return header(page,page+'Intro',(isLedger?periodControl():'')+button(addKeys[page],page))+(page==='clients'?`<div class="pipeline-summary"><span>${tr('pipeline')}</span><strong>${money(db.clients.filter(c=>c.status==='lead').reduce((n,c)=>n+(c.opportunity||0),0))}</strong><small>${tr('pipelineNote')}</small></div>`:'')+`<article class="biz-panel records-panel"><div class="records-toolbar"><label class="search"><span>⌕</span><input id="record-search" type="search" aria-label="${tr('searchRecords')}" placeholder="${tr('searchRecords')}" value="${esc(search)}"></label><select id="record-filter" aria-label="${tr('status')}"><option value="all">${tr('all')}</option>${statusOptions[page].map(k=>`<option value="${k}" ${filter===k?'selected':''}>${tr(k)}</option>`).join('')}</select><span>${rows.length} ${tr('recordsCount')}</span></div>${rows.length?`<div class="table-scroll">${content}</div>`:`<div class="panel-empty large-empty"><span>${icons[page]}</span><h2>${tr(search||filter!=='all'?'noResults':isLedger?'noEntries':'noRecords')}</h2>${button(addKeys[page],page)}</div>`}</article>`+(page==='projects'?`<p class="kpi-footnote">${tr('referenceOnly')}</p>`:'')+(isLedger?`<p class="kpi-footnote">${tr('cashBasis')}</p>`:'')}
function draw(){if(page==='learning')return;workspace.innerHTML=(page==='dashboard'?dashboard():page==='reports'&&window.BeaconReports?window.BeaconReports.render(db,month):page==='introduction'&&window.BeaconIntroduction?window.BeaconIntroduction.render():records())+`<footer><span>© ${new Date().getFullYear()} Beacon of the Eagle LLC</span><span>${tr('localNotice')}</span></footer>`;document.querySelectorAll('[data-business-page]').forEach(b=>{b.classList.toggle('active',b.dataset.businessPage===page);b.setAttribute('aria-pressed',String(b.dataset.businessPage===page))});workspace.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>form(b.dataset.add,undefined,b.dataset.entryType));workspace.querySelectorAll('[data-go]').forEach(b=>b.onclick=()=>go(b.dataset.go));workspace.querySelectorAll('[data-edit]').forEach(b=>b.onclick=()=>form(page,b.dataset.edit));workspace.querySelectorAll('[data-delete]').forEach(b=>b.onclick=()=>remove(page,b.dataset.delete));workspace.querySelectorAll('[data-toggle-task]').forEach(b=>b.onclick=()=>{const next=structuredClone(db),item=next.tasks.find(x=>x.id===b.dataset.toggleTask);item.status=item.status==='done'?'pending':'done';if(save(next))draw()});if($('#biz-month'))$('#biz-month').onchange=e=>{if(/^\d{4}-(0[1-9]|1[0-2])$/.test(e.target.value)){month=e.target.value;draw()}};if($('#record-search'))$('#record-search').oninput=e=>{const caret=e.target.selectionStart;search=e.target.value;draw();$('#record-search').focus();$('#record-search').setSelectionRange(caret,caret)};if($('#record-filter'))$('#record-filter').onchange=e=>{filter=e.target.value;draw()};if($('#open-learning'))$('#open-learning').onclick=()=>{showLearning();view='all';category=-1;query='';$('#search').value='';render();window.scrollTo({top:0,behavior:'smooth'})};document.dispatchEvent(new CustomEvent('beacon-business-render',{detail:{page,month}}))}
function field(key,value='',type='text',required=false){return `<label class="form-field"><span>${tr(key)}${required?' *':''}</span><input name="${key}" type="${type}" value="${esc(value)}" ${required?'required':''} ${type==='number'?'min="0" max="9999999999.99" step="0.01"':'maxlength="300"'}></label>`}
function select(key,options,value){return `<label class="form-field"><span>${tr(key)}</span><select name="${key}">${options.map(([v,l])=>`<option value="${esc(v)}" ${value===v?'selected':''}>${esc(l)}</option>`).join('')}</select></label>`}
function form(kind,id,entryType){
  editing={kind,id,entryType};
  const item=id?byId(kind,id):{};
  const defaultType=entryType==='entryExpense'?'entryExpense':'entryIncome';
  const currentDate=today();
  const entryDate=currentDate.startsWith(month+'-')?currentDate:month+'-01';
  let fields='';if(kind==='transactions')fields=select('type',[['entryIncome',tr('entryIncome')],['entryExpense',tr('entryExpense')]],item.type||defaultType)+field('date',item.date||entryDate,'date',true)+field('description',item.description,'text',true)+field('amount',item.amount===undefined?'':(item.amount/100).toFixed(2),'number',true)+select('category',['sales','services','software','marketing','operationsCategory','other'].map(k=>[k,tr(k)]),item.category||(defaultType==='entryExpense'?'operationsCategory':'sales'));if(kind==='clients')fields=field('name',item.name,'text',true)+field('company',item.company)+field('email',item.email,'email')+field('phone',item.phone,'tel')+select('status',statusOptions.clients.map(k=>[k,tr(k)]),item.status||'lead')+field('opportunity',item.opportunity===undefined?'':(item.opportunity/100).toFixed(2),'number');if(kind==='projects')fields=field('name',item.name,'text',true)+select('status',statusOptions.projects.map(k=>[k,tr(k)]),item.status||'planned')+select('client',[['',tr('none')],...db.clients.map(c=>[c.id,c.name])],item.client||'')+field('budget',item.budget===undefined?'':(item.budget/100).toFixed(2),'number')+field('dueDate',item.dueDate,'date');if(kind==='tasks')fields=field('name',item.name,'text',true)+select('status',statusOptions.tasks.map(k=>[k,tr(k)]),item.status||'pending')+select('priority',['high','medium','low'].map(k=>[k,tr(k)]),item.priority||'medium')+select('project',[['',tr('none')],...db.projects.map(p=>[p.id,p.name])],item.project||'')+field('dueDate',item.dueDate,'date');fields+=`<label class="form-field full-width"><span>${tr('notes')}</span><textarea name="notes" rows="3" maxlength="5000">${esc(item.notes||'')}</textarea></label>`;recordDialog.innerHTML=`<div class="dialog-top"><div class="eyebrow">${tr(kind)}</div><button class="icon-button" id="record-close" aria-label="${tr('close')}">×</button></div><h2>${tr(id?'editRecord':'newRecord')}</h2><form id="record-form"><div class="form-grid">${fields}</div><p class="form-error" role="alert" hidden></p><div class="dialog-actions"><button class="secondary" type="button" id="record-cancel">${tr('cancel')}</button><button class="primary" type="submit">${tr('save')}</button></div></form>`;$('#record-close').onclick=$('#record-cancel').onclick=()=>recordDialog.close();$('#record-form').onsubmit=e=>{e.preventDefault();const data=Object.fromEntries(new FormData(e.currentTarget));for(const key of ['name','description','company','email','phone','notes'])if(data[key])data[key]=data[key].trim();if((kind==='transactions'&&!data.description)||(kind!=='transactions'&&!data.name))return;for(const key of ['amount','budget','opportunity'])if(key in data){const v=Number(data[key]||0);if(!Number.isFinite(v)||v<0||(key==='amount'&&v<=0)||Math.abs(Math.round(v*100)-v*100)>.00001){$('.form-error').textContent=tr('amountInvalid');$('.form-error').hidden=false;return}data[key]=Math.round(v*100)}const record={...data,id:id||crypto.randomUUID(),updatedAt:new Date().toISOString()};const next=structuredClone(db);if(id)next[kind]=next[kind].map(x=>x.id===id?record:x);else next[kind].push(record);if(!save(next))return;recordDialog.close();draw();toast(tr('saved'))};if(!recordDialog.open){recordDialog.showModal();document.body.style.overflow='hidden'}}
function remove(kind,id){const index=db[kind].findIndex(x=>x.id===id);if(index<0)return;const next=structuredClone(db);const [record]=next[kind].splice(index,1);if(!save(next))return;draw();toast(tr('deleted')+' ');clearTimeout(toastTimer);const undo=document.createElement('button');undo.textContent=tr('undo');undo.className='undo-button';undo.onclick=()=>{const next=structuredClone(db);next[kind].splice(Math.min(index,next[kind].length),0,record);if(!save(next))return;draw();toast(tr('restored'))};$('#toast').append(undo);toastTimer=setTimeout(()=>$('#toast').hidden=true,15000)}
document.addEventListener('beacon-language',()=>{nav.setAttribute('aria-label',tr('management'));draw();if(recordDialog.open)form(editing.kind,editing.id,editing.entryType)});
window.BeaconBusiness={getSnapshot:()=>structuredClone(db),getMonth:()=>month,go,goBack:()=>{if(page==='dashboard')return false;go('dashboard');return true},refresh:draw,setGoals:(period,values)=>{const next=structuredClone(db);next.goals[period]=values;const result=save(next);if(result)draw();return result},replaceData:value=>{db=value;draw()}};
go('dashboard');
})();
