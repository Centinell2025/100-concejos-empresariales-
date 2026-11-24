/* Local monthly review. Reads the user's local records; no network or model. */
(() => {
  'use strict';
  function summarize(db, month, today) {
    const rows = db.transactions.filter(x => x.date.startsWith(month + '-'));
    const income = rows.filter(x => x.type === 'entryIncome').reduce((n,x) => n+x.amount,0);
    const expenses = rows.filter(x => x.type === 'entryExpense').reduce((n,x) => n+x.amount,0);
    const goal = db.goals?.[month] || {};
    return {
      hasEntries: rows.length > 0,
      incomeGap: goal.income > 0 && rows.length ? Math.max(0, goal.income-income) : null,
      expenseOver: goal.expenses > 0 && rows.length ? Math.max(0, expenses-goal.expenses) : null,
      overdue: db.tasks.filter(x => x.status !== 'done' && x.dueDate && x.dueDate < today).length,
      openProjects: db.projects.filter(x => x.status === 'inProgress').length
    };
  }
  const copy = {
    en:{title:'Your next priorities',intro:'Monthly cash review and open work',empty:'Record income received and expenses paid to review this month.',goals:'Set monthly targets in Reports to compare your cash records.',gap:n=>`${n} remaining to reach the monthly income target.`,over:n=>`${n} above the monthly expense budget. Review the recorded expenses.`,within:'Recorded cash meets the income target and stays within the expense budget.',tasks:n=>`${n} overdue task(s). Review deadlines and priorities.`,projects:n=>`${n} project(s) in progress.`,note:'Based on your local records. Targets refer to the whole month; open work covers all dates.',reports:'Review reports',tasksLink:'Review tasks'},
    es:{title:'Tus próximas prioridades',intro:'Revisión mensual de caja y trabajo pendiente',empty:'Registra los ingresos cobrados y gastos pagados para revisar este mes.',goals:'Configura las metas mensuales en Informes para comparar tus registros de caja.',gap:n=>`Faltan ${n} para alcanzar la meta mensual de ingresos.`,over:n=>`${n} por encima del presupuesto mensual. Revisa los gastos registrados.`,within:'La caja registrada alcanza la meta de ingresos y se mantiene dentro del presupuesto.',tasks:n=>`${n} tarea(s) vencida(s). Revisa fechas y prioridades.`,projects:n=>`${n} proyecto(s) en curso.`,note:'Basado en tus registros locales. Las metas corresponden al mes completo; el trabajo pendiente incluye todas las fechas.',reports:'Revisar informes',tasksLink:'Revisar tareas'},
    it:{title:'Le tue prossime priorità',intro:'Riepilogo mensile di cassa e attività aperte',empty:'Registra entrate incassate e spese pagate per esaminare il mese.',goals:'Imposta gli obiettivi mensili nei Report per confrontare i movimenti di cassa.',gap:n=>`Mancano ${n} all’obiettivo mensile delle entrate.`,over:n=>`${n} oltre il budget mensile. Verifica le spese registrate.`,within:'La cassa registrata raggiunge l’obiettivo delle entrate e rispetta il budget.',tasks:n=>`${n} attività scaduta/e. Rivedi scadenze e priorità.`,projects:n=>`${n} progetto/i in corso.`,note:'Basato sui dati locali. Gli obiettivi riguardano l’intero mese; le attività aperte includono tutte le date.',reports:'Rivedi report',tasksLink:'Rivedi attività'}
  };
  if (typeof module !== 'undefined' && module.exports) { module.exports={summarize,copy}; return; }
  function mount() {
    const host=document.querySelector('#business-workspace .dashboard-middle');
    if(!host || document.getElementById('beacon-priorities'))return;
    const api=window.BeaconBusiness;
    const db=api.getSnapshot(),month=api.getMonth(),d=new Date();
    const day=`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    const data=summarize(db,month,day),lang=document.documentElement.lang.split('-')[0];
    const t=copy[lang]||copy.en;
    const money=n=>new Intl.NumberFormat({en:'en-US',es:'es-ES',it:'it-IT'}[lang]||'en-US',{style:'currency',currency:'USD'}).format(n/100);
    const el=(tag,text)=>{const e=document.createElement(tag);if(text!==undefined)e.textContent=text;return e;};
    const panel=el('section');panel.id='beacon-priorities';panel.className='biz-panel priorities-panel';
    panel.setAttribute('aria-labelledby','priorities-title');
    const heading=el('h2',t.title);heading.id='priorities-title';panel.append(heading,el('p',t.intro+' · '+month));
    const list=el('ul');
    if(!data.hasEntries)list.append(el('li',t.empty));
    else {
      if(data.incomeGap>0)list.append(el('li',t.gap(money(data.incomeGap))));
      if(data.expenseOver>0)list.append(el('li',t.over(money(data.expenseOver))));
      if(data.incomeGap===null||data.expenseOver===null)list.append(el('li',t.goals));
      if(data.incomeGap===0&&data.expenseOver===0)list.append(el('li',t.within));
    }
    if(data.overdue)list.append(el('li',t.tasks(data.overdue)));
    list.append(el('li',t.projects(data.openProjects)));panel.append(list);
    const actions=el('div');actions.className='priorities-actions';
    for(const [page,label] of [['reports',t.reports],['tasks',t.tasksLink]]) {
      const button=el('button',label);button.className='secondary';button.onclick=()=>api.go(page);actions.append(button);
    }
    const note=el('p',t.note);note.className='kpi-footnote';panel.append(actions,note);host.before(panel);
  }
  document.addEventListener('beacon-business-render',mount);
  mount();
})();
