const $=s=>document.querySelector(s);
let state={favorites:[],done:[],notes:{}};
let storageAvailable=true;
const learningKey='beacon-business-v1';
function readLearning(){
 const raw=localStorage.getItem(learningKey);
 const saved=raw===null ? {} : JSON.parse(raw);
 if(!saved || typeof saved!=='object' || Array.isArray(saved))throw Error('learning data');
 const validIds=items=>Array.isArray(items)?[...new Set(items.filter(id=>tips.some(tip=>tip.id===id)))]:[];
 return {favorites:validIds(saved.favorites),done:validIds(saved.done),
   notes:saved.notes&&typeof saved.notes==='object'&&!Array.isArray(saved.notes)?saved.notes:{}};
}
try{state=readLearning()}catch{storageAvailable=false}
let visibleTipIds=[];
let readingOrder=[];

let view='all',category=-1,selected=1,query='',sort='default';
const palette=Array.from({length:10},(_,i)=>[['#eaf1ff','#2b5fa9'],['#e8f4fc','#26698f'],['#eef0ff','#525fa8']][i%3]);
let learningWrites=Promise.resolve(true);
let pendingLearning=0;
let noteSession;
function noteStatus(message){
 const label=$('.note-label span:last-child');
 if(label)label.textContent=tr(message);
}
function writeLearning(change){
 ++pendingLearning;
 learningWrites=learningWrites.then(()=>window.BeaconBusiness.withWorkspaceLock(()=>{
   if(localStorage.getItem('beacon-restore-journal-v1')!==null)throw Error('workspaceRecover');
   const latest=readLearning();
   const afterWrite=change(latest);
   if(typeof afterWrite==='string')throw Error(afterWrite);
   localStorage.setItem(learningKey,JSON.stringify(latest));
   state=latest;
   if(typeof afterWrite==='function')afterWrite();
   updateStats();render();
   if($('#detail').open)updateDetailButtons();
   return true;
 })).catch(error=>{
   const key=['noteConflict','workspaceRecover'].includes(error.message)?error.message:'noteWriteFailed';
   if($('#detail').open)noteStatus(key);
   toast(tr(key));return false;
 }).finally(()=>{--pendingLearning});
 return learningWrites;
}
function saveNote(value){
 const session=noteSession;
 session.text=value.trim()?value:'';
 noteStatus('savingNote');
 if(session.queued)return;
 session.queued=true;
 writeLearning(latest=>{
   // Read the newest draft once the write lock is acquired. Large pastes can emit
   // many input events before the browser grants the first storage request.
   const text=session.text;
   const current=latest.notes[session.id]||'';
   if(current!==session.expected && current!==text)return 'noteConflict';
   if(text)latest.notes[session.id]=text;
   else delete latest.notes[session.id];
   return ()=>{
     session.expected=text;
     session.queued=false;
     if(session===noteSession)noteStatus('autoSave');
   };
 }).then(saved=>{if(!saved)session.queued=false});
}
window.addEventListener('beforeunload',event=>{
 if(pendingLearning){event.preventDefault();event.returnValue=''}
});
window.addEventListener('storage',event=>{
 if(event.key!==learningKey && event.key!==null)return;
 try{state=readLearning();updateStats();render();if($('#detail').open)updateDetailButtons()}catch{toast(tr('saveError'))}
});
let toastTimer;
function toast(message){$('#toast').replaceChildren(document.createTextNode(message));$('#toast').hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('#toast').hidden=true,4000)}
function updateStats(){let n=state.done.length;$('#fav-count').textContent=state.favorites.length;$('#done-count').textContent=n;$('#stat-done').innerHTML=n+' <em>/ 100</em>';$('#percent').textContent=n+'%';$('#ring').style.setProperty('--p',n)}
function toggle(type,id){
 const enable=!state[type].includes(id);
 return writeLearning(latest=>{
   latest[type]=latest[type].filter(existing=>existing!==id);
   if(enable)latest[type].push(id);
 });
}
function normalize(s){return s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase()}
function render(){
 const titles={all:['library','libraryIntro'],favorites:['favoriteHeading','favoriteIntro'],plan:['progress','progressIntro']};
 $('#section-title').textContent=tr(titles[view][0]);$('#section-subtitle').textContent=tr(titles[view][1]);
 const learningVisible=!$('#tips-workspace')?.hidden;
 document.querySelectorAll('[data-view]').forEach(button=>{
   const active=learningVisible && button.dataset.view===view && category===-1;
   button.classList.toggle('active',active);
   button.setAttribute('aria-pressed',String(active));
 });
 document.querySelectorAll('[data-cat]').forEach(b=>{b.classList.toggle('active',Number(b.dataset.cat)===category);b.setAttribute('aria-pressed',String(Number(b.dataset.cat)===category))});
 let list=tips.filter(t=>(category===-1||t.category===category)&&(view!=='favorites'||state.favorites.includes(t.id))&&(view!=='plan'||state.done.includes(t.id)||!!state.notes[t.id])&&normalize(t.title+' '+t.body+' '+t.action+' '+categories[t.category][0]+' '+(typeof state.notes[t.id]==='string'?state.notes[t.id]:'')).includes(normalize(query)));
 if(sort==='az')list.sort((a,b)=>a.title.localeCompare(b.title,language));if(sort==='pending')list.sort((a,b)=>Number(state.done.includes(a.id))-Number(state.done.includes(b.id)));
 visibleTipIds=list.map(t=>t.id);
 $('#result-count').textContent=list.length+' '+tr(list.length===1?'tipSingular':'tipPlural');$('#cards').replaceChildren();$('#empty').hidden=list.length>0;
 $('#empty-text').textContent=tr(query||category!==-1?'trySearch':view==='favorites'?'emptyFavorites':view==='plan'?'emptyProgress':'trySearch');
 for(const t of list){const done=state.done.includes(t.id),fav=state.favorites.includes(t.id);const card=document.createElement('article');card.className='card';card.dataset.tipId=t.id;card.style.setProperty('--tag-bg',palette[t.category][0]);card.style.setProperty('--tag-color',palette[t.category][1]);card.innerHTML=`<div class="card-top"><span class="tag">${categories[t.category][1]} &nbsp;${categories[t.category][0]}</span><button class="icon-button ${fav?'saved':''}" aria-label="${tr(fav?'removeFavorite':'saveFavorite')}: ${t.title}" aria-pressed="${fav}">${fav?'♥':'♡'}</button></div><div class="card-index">${tr('tip')} ${String(t.id).padStart(3,'0')}</div><h3>${t.title}</h3><p>${t.body}</p><div class="card-bottom"><button class="read-button" aria-label="${tr('readTip')}: ${t.title}">${tr('exploreTip')} ＋</button><span class="card-status ${done?'done':''}">${done?'✓ '+tr('completed'):state.notes[t.id]?'✎ '+tr('withNotes'):tr('readTime')}</span></div>`;card.querySelector('.icon-button').onclick=()=>toggle('favorites',t.id);card.querySelector('.read-button').onclick=()=>openTip(t.id,visibleTipIds);$('#cards').append(card)}
}
function updateDetailButtons(){const fav=state.favorites.includes(selected),done=state.done.includes(selected);$('#detail-fav').textContent=(fav?'♥ ':'♡ ')+tr(fav?'savedFavorite':'saveFavorite');$('#detail-fav').setAttribute('aria-pressed',String(fav));$('#detail-done').textContent=(done?'✓ ':'')+tr(done?'unmarkDone':'markDone');$('#detail-done').setAttribute('aria-pressed',String(done))}
function openTip(id, order=tips.map(t=>t.id)){
 const position=order.indexOf(id);
 if(position<0)return;
 selected=id;
 readingOrder=order;
 const t=tips[id-1];
 $('#detail-category').textContent=categories[t.category][1]+' '+categories[t.category][0];$('#detail-number').textContent=tr('tip')+' '+String(id).padStart(3,'0');$('#detail-title').textContent=t.title;$('#detail-body').textContent=t.body;$('#detail-action').textContent=t.action;noteSession={id,expected:state.notes[id]||'',queued:false};$('#note').value=noteSession.expected;noteStatus('autoSave');$('#detail-position').textContent=(position+1)+' / '+order.length;$('#prev').disabled=position===0;$('#next').disabled=position===order.length-1;updateDetailButtons();if(!$('#detail').open){$('#detail').showModal();document.body.style.overflow='hidden'}$('#detail').scrollTop=0}
function moveTip(step){
 const nextId=readingOrder[readingOrder.indexOf(selected)+step];
 if(nextId!==undefined)openTip(nextId,readingOrder);
}
function setCategory(c){category=c;render()}
function buildCategories(){
 $('#chips').replaceChildren();$('#side-categories').replaceChildren();
 const all=document.createElement('button');all.className='chip';all.dataset.cat='-1';all.textContent=tr('allTopics');all.onclick=()=>setCategory(-1);$('#chips').append(all);
 categories.forEach(([name,symbol],i)=>{let chip=document.createElement('button');chip.className='chip';chip.dataset.cat=i;chip.textContent=name;chip.onclick=()=>setCategory(i);$('#chips').append(chip);let side=document.createElement('button');side.className='nav category-nav';side.dataset.cat=i;side.innerHTML=`<span>${symbol}</span>${name}`;side.onclick=()=>{view='all';setCategory(i);$('.library').scrollIntoView({behavior:'smooth',block:'start'})};$('#side-categories').append(side)});
}
function dailyTip(){const date=new Date();const day=Math.floor((Date.UTC(date.getFullYear(),date.getMonth(),date.getDate())-Date.UTC(date.getFullYear(),0,1))/86400000);const daily=tips[day%100];$('#daily-category').textContent=categories[daily.category][0]+' · '+tr('tip')+' '+String(daily.id).padStart(3,'0');$('#daily-title').textContent=daily.title;$('#daily-body').textContent=daily.body;$('#daily-open').onclick=()=>openTip(daily.id);$('.edition b').textContent=String(daily.id).padStart(2,'0')+' / 100'}
function markStaticText(){
 const selectors={'.side-label:first-of-type':'learning','.categories-label':'topics','.breadcrumb':'breadcrumb','.heading .eyebrow':'learn','.heading h1':'tipsHeading','.heading p':'tipsIntro','.daily-label':'daily','.art-caption':'artCaption','.stats>div:nth-child(1) small':'practicalTips','.stats>div:nth-child(2) small':'essentialTopics','.stats>div:nth-child(3) small':'completedActions','#empty h3':'noTips','#reset':'exploreAll','.closing h3':'closingTitle','.closing p':'closingIntro','#random':'surprise','.action-box .eyebrow':'nextStep','#prev':'previousTip','#next':'nextTip'};
 for(const [selector,key]of Object.entries(selectors)){const el=$(selector);if(el)el.dataset.i18n=key}
 for(const [v,key]of Object.entries({all:'explore',favorites:'favorites',plan:'progress'})){const button=$(`[data-view="${v}"]`);const count=button.querySelector('b');const symbol=button.querySelector('span')?.textContent||'';button.replaceChildren();const icon=document.createElement('span');icon.textContent=symbol;button.append(icon);const label=document.createElement('span');label.className='nav-text';label.dataset.i18n=key;button.append(label);if(count)button.append(count)}
 const noteLabel=$('.note-label');noteLabel.innerHTML='<span data-i18n="myNotes" class="note-title"></span><span data-i18n="autoSave"></span>';
 $('#note').dataset.i18nPlaceholder='notePlaceholder';$('#search').dataset.i18nPlaceholder='searchPlaceholder';$('#search').dataset.i18nLabel='searchTips';$('#sort').dataset.i18nLabel='sortTips';$('.avatar').dataset.i18nLabel='personalSpace';$('#chips').dataset.i18nLabel='topics';$('#side-categories').dataset.i18nLabel='topics';$('.sidebar>nav').dataset.i18nLabel='learning';$('#close').dataset.i18nLabel='closeTip';
 const opts=['collectionOrder','titleOrder','pendingFirst'];[...$('#sort').options].forEach((el,i)=>el.dataset.i18n=opts[i]);
 $('#daily-open').innerHTML='<span data-i18n="practice"></span><span aria-hidden="true">＋</span>';
 const edition=$('.edition');edition.innerHTML='<span data-i18n="collection"></span><b></b>';
 $('.side-bottom small').dataset.i18n='tagline';
 $('#export').dataset.i18n='export';$('#export').title=tr('exportHelp');
 const label=document.createElement('label');label.className='language-label';label.innerHTML='<span class="sr-only" data-i18n="language"></span><select id="language" data-i18n-label="language"><option value="en">English</option><option value="es">Español</option><option value="it">Italiano</option></select>';$('.top-actions').prepend(label);$('#language').value=language;
 $('#language').onchange=e=>{language=e.target.value;try{localStorage.setItem('beacon-business-language',language)}catch{}applyLocale();buildCategories();dailyTip();render();$('#export').title=tr('exportHelp');if($('#detail').open)openTip(selected,readingOrder);document.dispatchEvent(new CustomEvent('beacon-language'))};
}
async function exportWorkspace(){
 await learningWrites;
 let text, file;
 try{
   text=await window.BeaconBusiness.withWorkspaceLock(()=>{
     if(localStorage.getItem('beacon-restore-journal-v1')!==null)throw Error('workspaceRecover');
     const business=window.BeaconBusiness.refreshFromStorage();
     const saved=readLearning();
     const learning={favorites:saved.favorites,completed:saved.done,notes:saved.notes};
     return JSON.stringify({app:'Beacon Business',version:2,language,exportedAt:new Date().toISOString(),business,learning});
   });
   file=new Blob([text],{type:'application/json'});
   if(file.size>BEACON_BACKUP_MAX_BYTES){toast(tr('backupTooLarge'));return}
   validateBeaconBackup(text);
 }catch(error){
   const location=error.collection ? ' · '+tr(error.collection)+' · '+error.recordLabel : '';
   toast(tr(error.message==='workspaceRecover'?'workspaceRecover':'backupExportFailed')+location);return;
 }
 if(window.BeaconAndroid){window.BeaconAndroid.exportBackup(text);return}
 const url=URL.createObjectURL(file);
 const link=document.createElement('a');
 link.href=url;
 link.download='beacon-business-backup.json';
 link.click();
 setTimeout(()=>URL.revokeObjectURL(url),1000);
 toast(tr('exported'));
}
document.addEventListener('beacon-export-result',e=>{if(e.detail==='saved')toast(tr('exportSuccess'));else if(e.detail==='error')toast(tr('saveError'))});
function init(){
 markStaticText();applyLocale();buildCategories();
 document.querySelectorAll('[data-view]').forEach(b=>b.onclick=()=>{view=b.dataset.view;category=-1;query='';$('#search').value='';render();$('.library').scrollIntoView({behavior:'smooth',block:'start'})});
 $('#search').oninput=e=>{query=e.target.value;render()};$('#sort').onchange=e=>{sort=e.target.value;render()};$('#reset').onclick=()=>{view='all';category=-1;query='';$('#search').value='';render()};
 dailyTip();$('#random').onclick=()=>openTip(Math.floor(Math.random()*100)+1);$('#detail-fav').onclick=()=>toggle('favorites',selected);$('#detail-done').onclick=()=>toggle('done',selected);$('#note').oninput=e=>saveNote(e.target.value);$('#prev').onclick=()=>moveTip(-1);$('#next').onclick=()=>moveTip(1);$('#close').onclick=()=>$('#detail').close();$('#detail').addEventListener('close',()=>{
   document.body.style.overflow='';
   if(document.activeElement===document.body){
     const target=document.querySelector('[data-tip-id="'+selected+'"] .read-button') || $('#search');
     target.focus({preventScroll:true});
   }
 });$('#detail').onclick=e=>{if(e.target===$('#detail')){const r=$('#detail').getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)$('#detail').close()}};
 $('#export').onclick=exportWorkspace;const privacyLink=document.createElement('a');privacyLink.href='privacy.html';
 const privacyUrl=privacyLink.href;
 function updatePrivacyLink(){privacyLink.href=privacyUrl+'#'+language}
 updatePrivacyLink();
 document.addEventListener('beacon-language',updatePrivacyLink);
 privacyLink.className='text-button privacy-link';privacyLink.dataset.i18n='privacy';privacyLink.textContent=tr('privacy');$('.top-actions').append(privacyLink);
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#detail').open&&!$('#tips-workspace')?.hidden){e.preventDefault();$('#search').focus()}});updateStats();render();if(!storageAvailable)toast(tr('saveError'));
 if(!window.BeaconAndroid&&'serviceWorker' in navigator)navigator.serviceWorker.register('./sw.js').catch(()=>{});
}
init();
