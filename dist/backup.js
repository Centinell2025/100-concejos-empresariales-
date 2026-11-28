/* Strict, side-effect-free validation for user-selected backups. */
const BEACON_COLLECTION_LIMIT = 10000;
function beaconValidRecordDate(value, minimum="1900-01-01"){
 if(typeof value!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(value)||value<minimum||value>'9999-12-31')return false;
 const parsed=new Date(value+'T12:00:00Z');
 return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0,10)===value;
}
const BEACON_BACKUP_MAX_BYTES = 10_000_000;
function validateBeaconBackup(text,{localUndo=false}={}){
 if(typeof text!=='string'||text.length>BEACON_BACKUP_MAX_BYTES)throw Error('size');
 let source;try{source=JSON.parse(text.replace(/^\uFEFF/,''))}catch{throw Error('json')}
 if(!source||Array.isArray(source)||source.app!=='Beacon Business'||source.version!==2||!source.business||Array.isArray(source.business)||typeof source.business!=='object')throw Error('format');
 const str=(v,max=300)=>{if(v===undefined||v===null)return '';if(typeof v!=='string'||v.length>max)throw Error('text');return v.trim()};
 const amount=v=>{if(!Number.isSafeInteger(v)||v<0||v>999999999999)throw Error('amount');return v};
 const date=(v,required=false)=>{const s=str(v,10);if(!s&&!required)return '';if(!beaconValidRecordDate(s,'0001-01-01'))throw Error('date');return s};
 const choice=(v,items)=>{if(!items.includes(v))throw Error('choice');return v};
 const db={transactions:[],clients:[],projects:[],tasks:[],goals:{}};
 for(const key of ['transactions','clients','projects','tasks']){
  const rows=source.business[key];if(!Array.isArray(rows)||(!localUndo&&rows.length>BEACON_COLLECTION_LIMIT))throw Error('records');const ids=new Set();
  db[key]=rows.map((x,index)=>{try{if(!x||typeof x!=='object'||Array.isArray(x))throw Error('record');const id=str(x.id,100);if(!id||ids.has(id))throw Error('id');ids.add(id);let r={id,notes:str(x.notes,5000)};
   if(key==='transactions'){r={...r,date:date(x.date,true),type:choice(x.type,['entryIncome','entryExpense']),description:str(x.description),amount:amount(x.amount),category:choice(x.category,['sales','services','software','marketing','operationsCategory','other'])};if(!r.description||!r.amount)throw Error('required')}
   else{r.name=str(x.name);if(!r.name)throw Error('required');
    if(key==='clients')Object.assign(r,{company:str(x.company),email:str(x.email),phone:str(x.phone),status:choice(x.status,['lead','active','inactive']),opportunity:amount(x.opportunity??0)});
    if(key==='projects')Object.assign(r,{client:str(x.client,100),budget:amount(x.budget??0),dueDate:date(x.dueDate),status:choice(x.status,['planned','inProgress','onHold','done'])});
    if(key==='tasks')Object.assign(r,{project:str(x.project,100),dueDate:date(x.dueDate),status:choice(x.status,['pending','inProgress','done']),priority:choice(x.priority,['high','medium','low'])});
   }return r;
  }catch(error){
   error.collection=key;
   error.recordLabel=String(x?.description || x?.name || (index+1)).slice(0,120);
   throw error;
  }});
 }
 if(source.business.goals!==undefined){const goals=source.business.goals;if(!goals||Array.isArray(goals)||typeof goals!=='object'||Object.keys(goals).length>1200)throw Error('goals');for(const [key,v]of Object.entries(goals)){if(!/^\d{4}-(0[1-9]|1[0-2])$/.test(key)||!v||typeof v!=='object'||Array.isArray(v))throw Error('goals');db.goals[key]={income:amount(v.income??0),expenses:amount(v.expenses??0)}}}
 const learning=source.learning||{favorites:[],completed:[],notes:{}};const ids=a=>{if(!Array.isArray(a)||a.length>100||a.some(x=>!Number.isInteger(x)||x<1||x>100))throw Error('learning');return [...new Set(a)]};
 const notes=Object.create(null);
 if(!learning.notes||typeof learning.notes!=='object'||Array.isArray(learning.notes))throw Error('notes');
 for(const [key,value] of Object.entries(learning.notes)){
   if(!/^(?:[1-9][0-9]?|100)$/.test(key))throw Error('notes');
   if(value!==null&&typeof value!=='string')throw Error('notes');
   // The note editor accepts free-form text. The whole backup already has a size limit.
   notes[key]=value??'';
 }
 return {business:db,learning:{favorites:ids(learning.favorites),done:ids(learning.completed),notes}};
}
function beaconCsvCell(value){let s=String(value??'');if(/^(?:[\s\uFEFF]*[=+\-@]|[\t\r\n])/.test(s))s="'"+s;return '"'+s.replace(/"/g,'""')+'"'}
