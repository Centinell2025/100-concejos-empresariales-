const {test}=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {summarize,copy}=require('../dist/priorities.js');
const context=vm.createContext({});
vm.runInContext(fs.readFileSync(require.resolve('../dist/backup.js'),'utf8'),context);
const validate=text=>context.validateBeaconBackup(text);
const blank=()=>({app:'Beacon Business',version:2,business:{transactions:[],clients:[],projects:[],tasks:[],goals:{}},learning:{favorites:[],completed:[],notes:{}}});
test('priorities use selected-month cash, exclude budgets and distinguish empty periods',()=>{
  const db=blank().business;
  db.goals['2026-11']={income:100000,expenses:20000};
  assert.equal(summarize(db,'2026-11','2026-11-24').incomeGap,null);
  db.transactions=[{date:'2026-11-01',type:'entryIncome',amount:80000},{date:'2026-11-02',type:'entryExpense',amount:30000},{date:'2026-10-31',type:'entryIncome',amount:900000}];
  db.projects=[{status:'inProgress',budget:500000}];
  db.tasks=[{status:'pending',dueDate:'2026-11-23'},{status:'done',dueDate:'2026-11-20'},{status:'pending',dueDate:'2026-11-24'}];
  assert.deepEqual(summarize(db,'2026-11','2026-11-24'),{hasEntries:true,incomeGap:20000,expenseOver:10000,overdue:1,openProjects:1});
});
test('all priority translations are complete',()=>{
  for(const lang of ['es','it'])assert.deepEqual(Object.keys(copy[lang]).sort(),Object.keys(copy.en).sort());
});
test('restores existing backup schema and accepts UTF-8 BOM',()=>{
  const b=blank();b.business.clients=[{id:'c1',name:'Client',status:'lead'}];
  assert.equal(validate('\uFEFF'+JSON.stringify(b)).business.clients[0].opportunity,0);
  assert.equal(b.business.clients[0].opportunity,undefined);
});
test('rejects false, string and array amounts instead of silently converting them to zero',()=>{
  for(const value of [false,'',[],{},-1,1.1]) {
    const b=blank();b.business.clients=[{id:'c1',name:'Client',status:'lead',opportunity:value}];
    assert.throws(()=>validate(JSON.stringify(b)));
    b.business.clients=[];b.business.goals['2026-11']={income:value,expenses:0};
    assert.throws(()=>validate(JSON.stringify(b)));
  }
  for(const value of [[],true,'text']) {const b=blank();b.business.goals['2026-11']=value;assert.throws(()=>validate(JSON.stringify(b)));}
});
test('rejects duplicate identities and impossible dates before changing data',()=>{
  const b=blank();b.business.transactions=[{id:'a',date:'2026-02-30',type:'entryIncome',description:'Sale',amount:100,category:'sales'}];
  assert.throws(()=>validate(JSON.stringify(b)));
  b.business.transactions[0].date='2026-02-28';b.business.transactions.push({...b.business.transactions[0]});
  assert.throws(()=>validate(JSON.stringify(b)));
});
