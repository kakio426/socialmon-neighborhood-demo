import {lesson} from './lesson.mjs?v=20261110-dialogue';
import {initialState,transition} from './model.mjs?v=20261110-multiple-improvements';

let state=initialState();
let placeOpen=null;
let evidenceOpen=null;
const app=document.querySelector('#app');
const main=document.querySelector('#main');
const progress=document.querySelector('#progress');
const motion=document.querySelector('#motion');
const settingsDialog=document.querySelector('#settingsDialog');
const helpDialog=document.querySelector('#helpDialog');
const fullscreen=document.querySelector('#fullscreen');
const esc=value=>String(value ?? '').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const icons={library:'📚',post:'✉️',park:'🌳',resident:'👵',friend:'🧒',family:'👨‍👩‍👦',seen:'👀',heard:'💬',guide:'📖',cleanup:'🌱',ask:'🤝',ignore:'👣'};
function button(label,action,id,options={}) {
  const cls=options.className || 'primary';
  return '<button type="button" class="'+cls+'" data-action="'+esc(action)+'"'+(id?' data-id="'+esc(id)+'"':'')+(options.disabled?' disabled':'')+'>'+label+'</button>';
}
function tile(item,action,selected=false) {
  return button('<span class="tile-icon" aria-hidden="true">'+(icons[item.id] || '✦')+'</span><span><strong>'+esc(item.name || item.title)+'</strong>'+(item.label || item.role?'<small>'+esc(item.label || item.role)+'</small>':'')+'</span>',action,item.id,{className:'tile'+(selected?' selected':'')});
}
function actions(backLabel,backAction,nextLabel,nextAction,disabled=false) {
  return '<div class="actions">'+(backAction?button(esc(backLabel),backAction,null,{className:'secondary'}):'')+button(esc(nextLabel),nextAction,null,{disabled})+'</div>';
}
function floatingActions(backLabel,backAction,nextLabel='',nextAction='',disabled=false) {
  return '<nav class="floating-actions" aria-label="이야기 이동">'+(backAction?button(esc(backLabel),backAction,null,{className:'secondary'}):'')+(nextAction?button(esc(nextLabel),nextAction,null,{disabled}):'')+'</nav>';
}
function dialogue(title,text) {
  return '<section class="speech-bubble" aria-live="polite"><strong>'+esc(title)+'</strong><p>'+esc(text)+'</p></section>';
}
function sceneVisual(screen) {
  const sceneFiles={town:'01-neighborhood.png',requests:'02-helpdesk.png',research:'03-investigation.png',improve:'04-improvement.png',quiz:'05-quizshow.png',result:(state.improvements.includes('cleanup')?'08-improvement-after.png':'04-improvement.png')};
  let hot='';
  if(screen==='town') {
    const points=[['library','도서관','16%','18%'],['post','우체국','80%','19%'],['park','공원','46%','43%']];
    const placeIcons={library:'<path d="M4 5.5c3-1.3 5.5-1.1 8 1v12c-2.5-2.1-5-2.3-8-1V5.5Zm16 0c-3-1.3-5.5-1.1-8 1v12c2.5-2.1 5-2.3 8-1V5.5Z"/>',post:'<rect x="3" y="5.5" width="18" height="13" rx="2"/><path d="m4 7 8 6 8-6"/>',park:'<path d="M12 20v-7m0 2c-4.5 0-7-3-7-7 4.5 0 7 2.5 7 7Zm0-2c0-4 2.5-7 7-7 0 4-2.5 7-7 7Z"/>'};
    hot=points.map(p=>{const visited=state.visited.includes(p[0]);return '<button type="button" class="hotspot place-marker '+(state.place===p[0]?'active ':'')+(visited?'visited':'')+'" data-action="PLACE" data-id="'+p[0]+'" aria-label="'+p[1]+(visited?' 살펴봄':'')+'" aria-pressed="'+String(state.place===p[0])+'" style="left:'+p[2]+';top:'+p[3]+'"><span class="place-marker-icon" aria-hidden="true"><svg viewBox="0 0 24 24">'+placeIcons[p[0]]+'</svg></span><span class="place-marker-name">'+p[1]+'</span>'+(visited?'<span class="place-visited" aria-hidden="true">✓</span>':'')+'</button>';}).join('');
  }
  if(screen==='requests') {
    const points=[['resident','동네 어른','36%'],['friend','우체국 직원','54%'],['family','가족','80%']];
    hot=points.map(p=>'<button type="button" class="hotspot resident-marker '+(state.request===p[0]?'active ':'')+(state.heardResidents.includes(p[0])?'heard':'')+'" data-action="REQUEST" data-id="'+p[0]+'" aria-label="'+p[1]+(state.heardResidents.includes(p[0])?' 이야기 들음':'')+'" style="left:'+p[2]+';top:39%">'+p[1]+(state.heardResidents.includes(p[0])?'<span aria-hidden="true"> ✓</span>':'')+'</button>').join('');
  }
  if(screen==='research') {
    hot='<button type="button" class="hotspot" data-action="EVIDENCE" data-id="seen" style="left:75%;top:15%">직접 보기</button><button type="button" class="hotspot" data-action="EVIDENCE" data-id="heard" style="left:75%;top:65%">이야기 듣기</button>';
  }
  if(screen==='quiz') {
    const q=lesson.quiz[state.quizIndex];
    hot='<div class="quiz-screen-question"><img class="quiz-explorer" src="./assets/quiz-explorer.png" alt=""><span>'+esc(q.prompt)+'</span></div><div class="quiz-screen-answers">'+q.options.map(x=>button(esc(x.text),'ANSWER',x.id,{className:'quiz-answer',disabled:state.quizAnswered})).join('')+'</div>';
  }
  return '<div class="scene-visual scene-'+screen+'"><img class="scene-image" src="./assets/'+sceneFiles[screen]+'" alt="" aria-hidden="true">'+hot+'</div>';
}
function masc() {return '<img class="mascot" src="./assets/06-mascot.png" alt="" aria-hidden="true">';}
function wrap(content,extra='') {const scene=(lesson.screens.includes(state.screen)||state.screen==='result')?sceneVisual(state.screen):'';return scene+masc()+'<section class="card '+extra+'">'+content+'</section>';}
function cover() {
  return masc()+'<section class="cover-hero" aria-label="시작 화면"><h1 class="cover-heading"><img src="./assets/title-neighborhood.png" alt="우리 동네를 부탁해!"></h1><p class="cover-intro">소셜몬과 함께 동네를 탐사해요!</p>'+button('탐사 시작','START',null,{className:'primary cover-start'})+'</section>';
}
function town() {
  const selected=lesson.places.find(x=>x.id===state.place);
  const message=selected?esc(selected.detail):'세 장소가 우리 생활을 어떻게 돕는지 모두 알아보고 주민을 만나러 가요!';
  const guide='<section class="speech-bubble town-guide" aria-live="polite"><p>'+message+'</p>'+(selected?'<span class="town-count">살펴본 장소 '+state.visited.length+' / '+lesson.places.length+'</span>':'')+'</section>';
  const ready=lesson.places.every(place=>state.visited.includes(place.id));
  const next='<nav class="floating-actions town-actions" aria-label="이야기 이동"><button type="button" class="town-next" data-action="TOWN_NEXT"'+(ready?'':' disabled')+'>주민 만나기 <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 12h15M13 5l7 7-7 7"/></svg></button></nav>';
  return sceneVisual('town')+masc()+guide+next;
}
function requests() {
  const chosen=lesson.requests.find(x=>x.id===state.request);
  const title=chosen?chosen.name+'의 이야기':'주민의 이야기를 들어요';
  const text=chosen?'“'+chosen.text+'”':'세 주민의 이야기를 모두 들어 봐요!';
  const speaker=chosen?'<img class="resident-speaker" src="./assets/resident-'+esc(chosen.id)+'.webp" alt="'+esc(chosen.name)+'">':masc();
  const ready=lesson.requests.every(x=>state.heardResidents.includes(x.id));
  return sceneVisual('requests')+speaker+dialogue(title,text)+floatingActions('이전','BACK','자료 조사하기','REQUEST_NEXT',!ready);
}
function research() {
  const selected=lesson.evidence.find(x=>x.id===state.evidence);
  const title=selected?selected.verb:'탐사 수첩을 살펴봐요';
  const text=selected?selected.body:'그림과 조사 방법 자료를 눌러 봐요!';
  const has=state.opened.includes('seen')&&state.opened.includes('heard')&&state.opened.includes('guide');
  const guide='<div class="research-guide">'+button('조사 방법 자료 보기','EVIDENCE','guide',{className:'small-control'})+'</div>';
  return sceneVisual('research')+masc()+guide+dialogue(title,text)+floatingActions('이전','BACK','동네 바꾸기','RESEARCH_NEXT',!has);
}
function improve() {
  let prompt='',choices='',feedback='',navigation='';
  if(!state.assessment.good || !state.assessment.bad) {
    const key=state.assessment.good?'bad':'good';
    prompt=key==='good'?'공원의 좋은 점은 무엇이었나요?':'공원에서 발견한 불편한 점은 무엇이었나요?';
    choices='<div class="choice-row two">'+
      button('<span class="choice-number" aria-hidden="true">1</span><span>나무와 쉴 자리가 있어요.</span>','FIND',key,{className:'tile'}).replace('data-id="'+key+'"','data-id="'+key+'" data-choice="trees"')+
      button('<span class="choice-number" aria-hidden="true">2</span><span>길가에 쓰레기가 있어요.</span>','FIND',key,{className:'tile'}).replace('data-id="'+key+'"','data-id="'+key+'" data-choice="litter"')+
      '</div>';
    if(state.assessmentFeedback) feedback='<p class="choice-feedback retry" role="status">탐사 수첩에서 살펴본 모습을 다시 떠올려 볼까요?</p>';
    navigation=floatingActions('이전','BACK');
  } else {
    prompt='공원을 더 좋게 만드는 방법을 모두 골라요.';
    choices='<div class="choice-row">'+lesson.improvements.map((x,i)=>button('<span class="choice-number" aria-hidden="true">'+(i+1)+'</span><span><strong>'+esc(x.title)+'</strong><small>'+esc(x.text)+'</small></span>','IMPROVEMENT',x.id,{className:'tile'+(state.improvements.includes(x.id)?' selected':'')}).replace('data-action="IMPROVEMENT"','aria-pressed="'+String(state.improvements.includes(x.id))+'" data-action="IMPROVEMENT"')).join('')+'</div>';
    const chosen=lesson.improvements.find(x=>x.id===state.improvementFeedback);
    if(chosen) feedback='<p class="choice-feedback '+(chosen.valid?'':'retry')+'" role="status">'+esc(chosen.feedback)+'</p>';
    navigation=floatingActions('이전','BACK','퀴즈쇼 가기','IMPROVE_NEXT',!lesson.improvements.filter(x=>x.valid).every(x=>state.improvements.includes(x.id)));
  }
  return sceneVisual('improve')+masc()+'<section class="choice-panel"><h2>'+esc(prompt)+'</h2>'+choices+feedback+'</section>'+navigation;
}
function quiz() {
  const q=lesson.quiz[state.quizIndex];
  let feedback='';
  if(state.quizFeedback==='retry') feedback='<div class="quiz-feedback retry" role="status">조금 더 살펴볼까요? 다른 생각도 골라 볼 수 있어요.</div>';
  if(state.quizFeedback==='correct') feedback='<div class="quiz-feedback" role="status"><strong>발견했어요!</strong> '+esc(q.explanation)+'</div>';
  return sceneVisual('quiz')+masc()+feedback+floatingActions('이전','BACK',state.quizIndex===lesson.quiz.length-1?'탐사 수첩 보기':'다음 문제','QUIZ_NEXT',!state.quizAnswered);
}
function result() {
  const place=lesson.places.filter(x=>state.visited.includes(x.id)).map(x=>x.name).join(', ');
  const resident=lesson.requests.find(x=>x.id===state.request);
  const improvement=lesson.improvements.filter(x=>state.improvements.includes(x.id)).map(x=>x.title).join(', ');
  const sheet='<section class="result-sheet" aria-labelledby="result-title"><div class="result-heading"><div><h2 id="result-title">나의 탐사 수첩</h2><p>우리 동네 탐사 완료!</p></div><span class="result-stamp" aria-hidden="true">탐사 완료</span></div><dl class="result-records">'+
    '<div><dt>살펴본 장소</dt><dd>'+esc(place)+'</dd></div>'+
    '<div><dt>들은 이야기</dt><dd>'+esc(resident ? resident.name : '')+'의 공원 이야기</dd></div>'+
    '<div><dt>공원에서 본 것</dt><dd>나무와 쉴 자리, 길가의 쓰레기</dd></div>'+
    '<div><dt>내가 고른 방법</dt><dd>'+esc(improvement)+'</dd></div></dl></section>';
  return sceneVisual('result')+masc()+sheet+floatingActions('','','처음부터 다시','RESTART');
}
const renderers={cover,town,requests,research,improve,quiz,result};
function render() {
  app.dataset.screen=state.screen;
  const idx=lesson.screens.indexOf(state.screen);
  progress.innerHTML=lesson.screens.map((x,i)=>'<span class="step '+(idx===i?'on':idx>i||state.screen==='result'?'done':'')+'" aria-label="'+(i+1)+'단계">'+(i+1)+'</span>').join('');
  progress.hidden=state.screen==='cover';
  main.innerHTML=renderers[state.screen]();
  if(placeOpen && state.screen==='town') {
    const place=lesson.places.find(item=>item.id===placeOpen);
    const scenes={library:['library-explore.webp','도서관에서 책을 읽고 책꽂이에서 책을 찾는 아이들의 그림'],post:['post-explore.webp','우체국에서 편지와 소포를 보내는 사람들의 그림'],park:['park-explore.webp','공원에서 산책하고 쉬거나 놀이하는 사람들의 그림']};
    const [file,alt]=scenes[placeOpen];
    main.insertAdjacentHTML('beforeend','<dialog class="library-dialog" aria-labelledby="placeTitle"><div class="library-layout"><img src="./assets/'+file+'" alt="'+esc(alt)+'"><div class="library-copy"><h2 id="placeTitle">'+esc(place.name)+'</h2><p>'+esc(place.detail)+'</p><button type="button" class="primary library-close">동네로 돌아가기</button></div></div></dialog>');
    const modal=main.querySelector('.library-dialog');
    modal.addEventListener('close',()=>{const last=placeOpen;placeOpen=null;render();main.querySelector('[data-action="PLACE"][data-id="'+last+'"]')?.focus({preventScroll:true});});
    modal.querySelector('.library-close').addEventListener('click',()=>modal.close());
    modal.showModal();
  }
  if(evidenceOpen && state.screen==='research') {
    const item=lesson.evidence.find(x=>x.id===evidenceOpen);
    const scenes={seen:['evidence-seen.webp','공원의 나무와 벤치, 길가에 버려진 쓰레기를 살펴보는 아이의 그림'],heard:['evidence-heard.webp','공원에 관해 주민에게 묻고 이야기를 듣는 아이의 그림']};
    const [file,alt]=scenes[evidenceOpen];
    main.insertAdjacentHTML('beforeend','<dialog class="library-dialog" aria-labelledby="evidenceTitle"><div class="library-layout"><img src="./assets/'+file+'" alt="'+esc(alt)+'"><div class="library-copy"><h2 id="evidenceTitle">'+esc(item.verb)+'</h2><p>'+esc(item.body)+'</p><button type="button" class="primary evidence-close">수첩으로 돌아가기</button></div></div></dialog>');
    const modal=main.querySelector('.library-dialog');
    modal.addEventListener('close',()=>{const last=evidenceOpen;evidenceOpen=null;render();main.querySelector('[data-action="EVIDENCE"][data-id="'+last+'"]')?.focus({preventScroll:true});});
    modal.querySelector('.evidence-close').addEventListener('click',()=>modal.close());
    modal.showModal();
  }
  if(state.sourceOpen && state.screen==='research') for(const child of main.children) child.inert=true;
  if(state.sourceOpen && state.screen==='research') main.insertAdjacentHTML('beforeend','<div class="source-modal" role="dialog" aria-modal="true" aria-label="교과서 조사 방법 자료"><div class="source-frame"><div class="source-head"><div><span class="eyebrow">사회 교과서 43쪽</span><h2>장소는 어떻게 조사할까요?</h2></div>'+button('자료 닫기','SOURCE_CLOSE',null,{className:'primary'})+'</div><div class="source-content"><img src="./assets/07-research-methods.webp" alt="아이들이 보호자와 경찰서를 직접 찾아가고, 동네 어른께 여쭤보는 두 가지 조사 방법을 보여 주는 교과서 그림"><div class="source-steps"><p>직접 찾아가요.</p><p>그곳을 잘 아는 어른께 여쭤봐요.</p></div></div></div></div>');
  main.setAttribute('aria-label',state.screen==='cover'?'시작 화면':state.screen==='result'?'탐사 수첩':(idx+1)+'번째 이야기');
}
main.addEventListener('click',event=>{
  const control=event.target.closest('button[data-action]');
  if(!control || control.disabled) return;
  const action={type:control.dataset.action,id:control.dataset.id,choice:control.dataset.choice};
  const before=state.screen;
  state=transition(state,action);
  if(action.type==='PLACE') placeOpen=action.id;
  if(action.type==='EVIDENCE' && (action.id==='seen'||action.id==='heard')) evidenceOpen=action.id;
  render();
  if(action.type==='SOURCE_CLOSE') main.querySelector('[data-action="EVIDENCE"][data-id="guide"]')?.focus({preventScroll:true});
  if(state.screen!==before){main.focus({preventScroll:true});}
});
motion.addEventListener('click',()=>{
  const reduced=document.body.classList.toggle('reduce-motion');
  motion.setAttribute('aria-pressed',String(reduced));
  motion.textContent=reduced?'움직임 켜기':'움직임 줄이기';
});
document.querySelector('#settingsToggle').addEventListener('click',()=>settingsDialog.showModal());
document.querySelector('#settingsClose').addEventListener('click',()=>settingsDialog.close());
document.querySelector('#showHelp').addEventListener('click',()=>{settingsDialog.close();helpDialog.showModal();});
document.querySelector('#helpClose').addEventListener('click',()=>{helpDialog.close();settingsDialog.showModal();});
document.querySelector('#restartGame').addEventListener('click',()=>{
  if(state.screen!=='cover' && !window.confirm('처음부터 다시 시작할까요? 지금까지의 탐사 기록이 지워져요.')) return;
  state=initialState();settingsDialog.close();render();main.focus({preventScroll:true});
});
fullscreen.hidden=!document.fullscreenEnabled;
fullscreen.addEventListener('click',async()=>{
  try {if(document.fullscreenElement) await document.exitFullscreen(); else await document.documentElement.requestFullscreen();} catch { fullscreen.blur(); }
});
document.addEventListener('fullscreenchange',()=>{
  const active=Boolean(document.fullscreenElement);fullscreen.setAttribute('aria-pressed',String(active));fullscreen.setAttribute('aria-label',active?'전체 화면 종료':'전체 화면');fullscreen.title=active?'전체 화면 종료':'전체 화면';
});
function syncPreviewRatio() {
  const portrait=window.innerWidth<window.innerHeight;
  document.body.classList.toggle('preview-portrait',portrait);
  if (portrait) document.body.style.setProperty('--stage-scale',String(Math.min(window.innerWidth/1024,window.innerHeight/768)));
}
window.addEventListener('resize',syncPreviewRatio);
syncPreviewRatio();
render();
