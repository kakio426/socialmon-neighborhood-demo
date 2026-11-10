import { lesson } from './lesson.mjs';

const copy = value => JSON.parse(JSON.stringify(value));

export function initialState() {
  return {
    screen:'cover', visited:[], place:null, request:null, heardResidents:[], opened:[], evidence:null,
    assessment:{good:false,bad:false}, assessmentFeedback:null, sourceOpen:false, improvements:[], improvementFeedback:null,
    quizIndex:0, quizAnswered:false, quizFeedback:null, attempts:0,
    entries:[], score:0
  };
}

export function transition(previous, action) {
  const s=copy(previous);
  const a=action || {};
  if (a.type==='RESTART') return initialState();
  if (a.type==='START' && s.screen==='cover') {s.screen='town';return s;}
  if (a.type==='PLACE' && s.screen==='town' && lesson.places.some(x=>x.id===a.id)) {
    if (!s.visited.includes(a.id)) s.visited.push(a.id);
    s.place=a.id;return s;
  }
  if (a.type==='TOWN_NEXT' && s.screen==='town' && lesson.places.every(place=>s.visited.includes(place.id))) {
    s.screen='requests';return s;
  }
  if (a.type==='REQUEST' && s.screen==='requests' && lesson.requests.some(x=>x.id===a.id)) {
    s.request=a.id;if(!s.heardResidents.includes(a.id)) s.heardResidents.push(a.id);return s;
  }
  if (a.type==='REQUEST_NEXT' && s.screen==='requests' && lesson.requests.every(x=>s.heardResidents.includes(x.id))) {s.screen='research';return s;}
  if (a.type==='EVIDENCE' && s.screen==='research' && lesson.evidence.some(x=>x.id===a.id)) {
    if (!s.opened.includes(a.id)) s.opened.push(a.id);
    s.evidence=a.id;s.sourceOpen=a.id==='guide';return s;
  }
  if (a.type==='SOURCE_CLOSE' && s.screen==='research') {s.sourceOpen=false;return s;}
  if (a.type==='RESEARCH_NEXT' && !s.sourceOpen && s.screen==='research' && s.opened.includes('seen') && s.opened.includes('heard') && s.opened.includes('guide')) {
    s.screen='improve';return s;
  }
  if (a.type==='FIND' && s.screen==='improve' && ['good','bad'].includes(a.id)) {
    const expected=a.id==='good'?'trees':'litter';
    if (a.choice===expected) {s.assessment[a.id]=true;s.assessmentFeedback=null;}
    else s.assessmentFeedback=a.id;
    return s;
  }
  if (a.type==='IMPROVEMENT' && s.screen==='improve' && s.assessment.good && s.assessment.bad) {
    const choice=lesson.improvements.find(x=>x.id===a.id);
    if (!choice) return s;
    s.improvementFeedback=choice.id;
    if (choice.valid) {
      s.improvements=s.improvements.includes(choice.id)?s.improvements.filter(id=>id!==choice.id):[...s.improvements,choice.id];
    }
    return s;
  }
  if (a.type==='IMPROVE_NEXT' && s.screen==='improve' && lesson.improvements.filter(x=>x.valid).every(x=>s.improvements.includes(x.id))) {s.screen='quiz';return s;}
  if (a.type==='ANSWER' && s.screen==='quiz' && !s.quizAnswered) {
    const q=lesson.quiz[s.quizIndex];
    if (!q || !q.options.some(x=>x.id===a.id)) return s;
    const correct=q.correct===a.id;
    s.attempts+=1;s.quizFeedback=correct?'correct':'retry';
    if (correct) {
      s.quizAnswered=true;
      s.entries.push({id:q.id,correctFirst:s.attempts===1});
      if (s.attempts===1) s.score+=1;
    }
    return s;
  }
  if (a.type==='QUIZ_NEXT' && s.screen==='quiz' && s.quizAnswered) {
    if (s.quizIndex===lesson.quiz.length-1) s.screen='result';
    else {s.quizIndex+=1;s.quizAnswered=false;s.quizFeedback=null;s.attempts=0;}
    return s;
  }
  if (a.type==='BACK') {
    const back={town:'cover',requests:'town',research:'requests',improve:'research',quiz:'improve'};
    if (back[s.screen]) s.screen=back[s.screen];
    return s;
  }
  return s;
}
