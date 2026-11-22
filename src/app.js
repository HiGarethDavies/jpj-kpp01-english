const $=id=>document.getElementById(id),KEY='jpj-kpp01-english-v1';let mem;try{mem=JSON.parse(localStorage.getItem(KEY)||'null')}catch{}mem=mem||{seen:{},sessions:[],active:null};let run=mem.active,timer;const shuffle=a=>{let b=[...a];for(let i=b.length-1;i>0;i--){let j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b},esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function save(){try{mem.active=run;localStorage.setItem(KEY,JSON.stringify(mem))}catch{$('storageWarning').classList.remove('hide')}}
function show(id){['dashboard','quiz','result'].forEach(x=>$(x).classList.toggle('hide',x!==id));window.scrollTo(0,0)}
function weak(q){let p=mem.seen[q.id];return p&&(p.streak<2||p.guessed)}
function home(){clearInterval(timer);show('dashboard');const active=activeQuestions();const touched=active.filter(q=>mem.seen[q.id]);const mastered=touched.filter(q=>mem.seen[q.id].streak>=2&&!mem.seen[q.id].guessed);const weakN=relatedVariants(recordedIssues().map(({question})=>question)).length;const last=mem.sessions.filter(s=>!s.flash).at(-1);$('dashboard').innerHTML=`<div class="dashboard-intro"><div class="dashboard-copy"><div class="eyebrow">Four study blocks</div><h2>Build a margin above the pass mark.</h2>
  <p>Aim for <b>90% on fresh mixed questions</b>. Review every wrong answer and every lucky guess. This bank has <b>${active.length} practice questions</b>, including scenario variants. The 70-question mock prioritises questions you have yet to answer.</p>
  <a class="small" href="JPJ-KPP01-Revision-Sheet.pdf" target="_blank" rel="noopener">Open the A4 revision sheet</a>
</div>
<a class="stat colour-practice" href="https://kpped.com/bw/" target="_blank" rel="noopener">
  <strong>Colour-vision practice</strong>
  <span>MyDIIMS external practice. Internet required.</span>
</a>
</div><div class="stats"><div class="stat"><strong>${touched.length}/${active.length}</strong><span>Questions seen</span></div><div class="stat"><strong>${weakN}</strong><span>Follow-up variants ready</span></div><div class="stat"><strong>${mastered.length}</strong><span>Two confident correct recalls</span></div><div class="stat"><strong>${last?Math.round(last.score/last.total*100)+'%':'—'}</strong><span>Last scored drill</span></div></div>${run?'<div class="card"><h3>Continue your unfinished session</h3><p>Your answers and timer were saved.</p><button class="primary" id="resume">Resume session</button></div>':''}<div class="notice"><b>KPP Gabungan format.</b> JPJ lists 70 theory questions, 75 minutes and 56 correct answers to pass. <a target="_blank" rel="noopener" href="https://www.jpj.gov.my/wp-content/uploads/2025/10/FAQ-KPP-GABUNGAN-NEW.pdf">Official FAQ</a>.</div><div class="grid"><article class="card block ${blockState('diagnostic')}"><div class="eyebrow">Block 1 · 30 minutes</div><h3>Find the gaps</h3><p>10 min diagnostic, 12 min corrections, 8 min signs. Choose “guessed” whenever unsure, even if you get it right.</p><button class="primary" data-start="diagnostic">${blockState('diagnostic') ? 'Retake' : 'Start'} 20-question diagnostic</button>${blockResult('diagnostic')}</article><article class="card block ${blockState('rules')}"><div class="eyebrow">Block 2 · 30 minutes</div><h3>Rules, hazards and emergency actions</h3><p>5 min delayed recall, 18 min targeted questions, 7 min mistakes. Say the rule aloud before reading the options.</p><button data-start="rules">${blockState('rules') ? 'Retake' : 'Start'} rules and hazards</button>${blockResult('rules')}</article><article class="card block ${blockState('numbers')}"><div class="eyebrow">Block 3 · 30 minutes</div><h3>Licence and number traps</h3><p>8 min flashcards, 15 min numeric and licensing drill, 7 min correcting weak answers.</p><button data-start="numbers">${blockState('numbers') ? 'Retake' : 'Start'} licences and numbers</button>${blockResult('numbers')}</article><article class="card block ${blockState('mixed30')}"><div class="eyebrow">Block 4 · 30 minutes</div><h3>Fresh mixed check</h3><p>20 min answering, then 10 min reviewing. Aim for 90% with few guesses. A full mock may take longer; use the full allowed time if needed.</p><button data-start="mixed30">${blockState('mixed30') ? 'Retake' : 'Start'} 30-question mixed check</button>${blockResult('mixed30')}</article></div><div class="card"><h3>Choose a drill</h3><div class="actions"><button data-start="weak">Practise variants of mistakes</button><button data-start="signs">Road signs</button><button data-start="flash">Recall flashcards</button><button class="primary" data-start="mock70">Start fresh 70-question mock</button><button data-start="mock50">50-question practice drill</button><button id="report">View progress report</button></div><p class="small muted">Each drill has a fixed length. Try variants of missed or flagged questions in a separate round after finishing. Two confident correct recalls mark a question as practised, not as a guarantee of retention.</p></div>${topicTable()}<div class="card"><h3>Read each question carefully</h3><p>Look for NOT or EXCEPT, the licence or vehicle type, and units or time periods. “Must stop”, “give way” and “proceed if safe” call for different actions.</p></div>${referencePanel()}`;
document.querySelectorAll('[data-start]').forEach(b=>b.onclick=()=>start(b.dataset.start));if($('resume'))$('resume').onclick=()=>{tick();show('quiz');render()};document.querySelectorAll('[data-review]').forEach(button => { button.onclick = () => reviewSession(Number(button.dataset.review)); });$('report').onclick=report;save()}
function topicTable(){return `<div class="card"><h3>Your topic evidence</h3><table><thead><tr><th>Topic</th><th>First attempts</th><th>Review queue</th></tr></thead><tbody>${[...new Set(BANK.map(q=>q.topic))].map(t=>{const a=activeQuestions().filter(q=>q.topic===t),s=a.filter(q=>mem.seen[q.id]);return `<tr><td>${t}</td><td>${s.filter(q=>mem.seen[q.id].first).length}/${s.length||0}</td><td>${a.filter(weak).length}</td></tr>`}).join('')}</tbody></table></div>`}
function referencePanel() {
  const links = Object.values(SOURCES).map(([title, url]) =>
    `<li><a target="_blank" rel="noopener" href="${url}">${title}</a></li>`
  ).join('');
  return `<details class="card">
    <summary>Sources and limits</summary>
    <p>The quiz is based on the KPP Gabungan textbook and JPJ service guidance. The older English car manual is background reading for driving principles. Refer to current JPJ guidance for licensing and KEJARA.</p>
    <p>The road sign drawings are simplified examples. Mock questions are independently written and use a practice mix of topics. For colour-vision practice, follow the optional external link above.</p>
    <ul>${links}</ul>
  </details>`;
}
const roadTopics = ['Rules and markings', 'Distance and hazards', 'Emergencies and vehicle', 'Motorcycle basics'];
const lawTopics = ['Licences', 'KEJARA', 'Numbers'];

function selectQuestions(pool, limit, combined = false) {
  const selected = [];
  const ids = new Set();
  const families = new Set();
  const unseen = shuffle(pool.filter(question => !mem.seen[question.id]));

  function take(candidates, count, allowFamilyRepeat = false) {
    for (const question of candidates) {
      if (count <= 0) break;
      if (ids.has(question.id)) continue;
      const family = question.reviewFamily || question.family;
      if (!allowFamilyRepeat && family && families.has(family)) continue;
      selected.push(question);
      ids.add(question.id);
      if (family) families.add(family);
      count--;
    }
  }

  if (combined) {
    // A practice mix based on public prep sets. JPJ confirms the paper size, not these quotas.
    take(unseen.filter(question => question.topic === 'Road signs'), 21);
    take(unseen.filter(question => question.topic === 'Motorcycle basics'), 5);
    take(unseen.filter(question => roadTopics.includes(question.topic)), 35 - selected.filter(question => roadTopics.includes(question.topic)).length);
    take(unseen.filter(question => lawTopics.includes(question.topic)), 14);
  }
  take(unseen, limit - selected.length);
  take(unseen, limit - selected.length, true);
  take(shuffle(pool), limit - selected.length);
  take(shuffle(pool), limit - selected.length, true);
  return shuffle(selected);
}

function activeQuestions() {
  return BANK.filter(question => !question.retired);
}

function relatedVariants(issues, excludedIds = []) {
  const excluded = new Set([...excludedIds, ...recordedIssues().map(({question}) => question.id)]);
  const candidates = activeQuestions().filter(question => !excluded.has(question.id));
  const variants = [];
  const handled = new Set();
  for (const original of issues) {
    const family = original.reviewFamily || original.family;
    if (!family || handled.has(family)) continue;
    const relevant = candidates.filter(question => (question.reviewFamily || question.family) === family);
    relevant.sort((left, right) => (mem.seen[left.id]?.last || 0) - (mem.seen[right.id]?.last || 0));
    if (!relevant.length) continue;
    handled.add(family);
    variants.push(relevant[0]);
  }
  return variants;
}

function questionsToReview(session) {
  return (session.review || []).filter(row => row.answer && (!row.answer.correct || row.answer.guess))
    .map(row => BANK.find(question => question.id === row.id)).filter(Boolean);
}

function variantsForSession(session) {
  return relatedVariants(questionsToReview(session), (session.review || []).map(row => row.id));
}

function start(mode, followups) {
  if (run && !confirm('Replace the unfinished session? Your completed answer history stays saved.')) return;
  const active = activeQuestions();
  let pool = active;
  let limit = 20;
  let minutes = 30;
  const flash = mode === 'flash';
  const mock = mode === 'mock70' || mode === 'mock50';
  if (mode === 'rules') { pool = active.filter(question => roadTopics.includes(question.topic)); limit = 25; }
  if (mode === 'numbers') { pool = active.filter(question => lawTopics.includes(question.topic)); limit = 30; }
  if (mode === 'signs') { pool = active.filter(question => question.topic === 'Road signs'); limit = 30; }
  if (mode === 'mixed30') limit = 30;
  if (mode === 'mock70') { limit = 70; minutes = 75; }
  if (mode === 'mock50') { limit = 50; minutes = 45; }
  if (mode === 'weak') {
    const issues = recordedIssues().map(({question}) => question);
    pool = followups || relatedVariants(issues);
    if (!pool.length) return report();
    limit = Math.min(30, pool.length);
  }
  if (flash) {
    pool = active.filter(weak);
    if (!pool.length) pool = active.filter(question => !mem.seen[question.id]);
    if (!pool.length) pool = active;
    limit = Math.min(30, pool.length);
  }

  let picked = selectQuestions(pool, limit, mode === 'mock70');
  if (mode === 'diagnostic') {
    const topics = [...new Set(active.map(question => question.topic))];
    picked = shuffle(topics.flatMap(topic => selectQuestions(active.filter(question => question.topic === topic), topic === 'Road signs' ? 4 : 3))).slice(0, 20);
  }
  run = {
    mode,
    items:picked.map(question => ({id:question.id, opts:shuffle(question.options)})),
    i:0, answers:[], end:Date.now() + minutes * 60000, flash, mock, started:Date.now(),
    newCount:picked.filter(question => !mem.seen[question.id]).length,
  };
  save();
  show('quiz');
  render();
  tick();
}

function updateSavedRun() {
  if (!run?.lastWrong) return;
  const kept = run.items.map((item, index) => ({item, answer:run.answers[index], index}))
    .filter(({item, answer}) => !item.repeat || answer);
  run.i = kept.filter(({index}) => index < run.i).length;
  run.items = kept.map(({item}) => item);
  run.answers = kept.map(({answer}) => answer || null);
  const active = activeQuestions();
  const used = new Set(run.items.map(item => item.id));
  const savedQuestions = new Map(BANK.map(question => [question.id, question]));
  for (let index = run.i; index < run.items.length; index++) {
    const original = savedQuestions.get(run.items[index].id);
    if (run.answers[index] || !original?.retired) continue;
    const replacement = selectQuestions(active.filter(question => question.topic === original.topic && !used.has(question.id)), 1)[0];
    if (!replacement) continue;
    used.add(replacement.id);
    run.items[index] = {id:replacement.id, opts:shuffle(replacement.options)};
    run.newCount += Number(!mem.seen[replacement.id]) - Number(!mem.seen[original.id]);
  }
  delete run.lastWrong;
  delete run.repeats;
}

function roadDiagram(kind) {
  const road = '<rect x="0" y="0" width="160" height="160" rx="12" fill="#344554"/>';
  const signalColors = {red:'#ff5b50', amber:'#ffbf32', green:'#52df9c'};
  let graphic;
  if (signalColors[kind]) {
    graphic = `<rect x="67" y="12" width="26" height="60" rx="6" fill="#152433" stroke="#eaf1f5"/>
      ${Object.keys(signalColors).map((color, index) => `<circle cx="80" cy="${24+18*index}" r="6" fill="${color === kind ? signalColors[color] : '#596978'}"/>`).join('')}
      <path d="M28 96H132" stroke="white" stroke-width="5"/>${[43,58,73,88,103].map(x=>`<rect x="${x}" y="82" width="8" height="6" fill="white"/>`).join('')}
      <path d="M67 122h26v20H67z" fill="#78def4"/><path d="M80 130v-20l-7 7h14z" fill="#78def4"/>`;
  } else if (kind === 'roundabout') {
    graphic = `<circle cx="98" cy="72" r="52" stroke="#dce7ed" stroke-width="2" fill="none"/><circle cx="98" cy="72" r="28" fill="#426857" stroke="#dce7ed" stroke-width="2"/>
      <path d="M12 72h44m-12-7 12 7-12 7" stroke="#78def4" stroke-width="4" fill="none"/><path d="M78 112q-20-8-24-29m-3 12 3-12 11 5" stroke="#ffb54f" stroke-width="4" fill="none"/>
      <text x="10" y="98" fill="#a5e8fa" font-size="12">You</text>`;
  } else {
    const stroke = (x, dashed) => `<path d="M${x} 5V155" stroke="white" stroke-width="3" ${dashed ? 'stroke-dasharray="13 10"' : ''}/>`;
    graphic = `${stroke(75, kind === 'broken-near')}${stroke(85, kind === 'solid-near')}<path d="M43 140v-47m-8 9 8-9 8 9" fill="none" stroke="#78def4" stroke-width="4"/><path d="M116 22v46m-8-9 8 9 8-9" fill="none" stroke="#ccd8e1" stroke-width="3"/><text x="28" y="154" fill="white" font-size="12">You</text>`;
  }
  return `<svg class="sign" role="img" aria-label="Road layout for this question" viewBox="0 0 160 160">${road}${graphic}</svg>`;
}
function sign(s){if(s.startsWith('diagram:'))return roadDiagram(s.slice(8));if(s.startsWith('img:'))return `<img class="sign" style="object-fit:contain" alt="Road sign to identify" src="${IMAGES[s.slice(4)]||''}">`;const bg='<rect width="160" height="160" rx="12" fill="#f5f7f9"/>';const shapes={stop:'<polygon points="53,10 107,10 150,53 150,107 107,150 53,150 10,107 10,53" fill="#c52729" stroke="white" stroke-width="4"/><text x="80" y="87" text-anchor="middle" fill="white" font-family="Arial" font-weight="bold" font-size="20">BERHENTI</text>',giveway:'<path d="M15 15 L145 15 L80 143 Z" fill="white" stroke="#c52729" stroke-width="13"/><text x="80" y="53" text-anchor="middle" font-size="17" font-weight="bold">BERI</text><text x="80" y="74" text-anchor="middle" font-size="17" font-weight="bold">LALUAN</text>',noentry:'<circle cx="80" cy="80" r="65" fill="#c52729"/><rect x="30" y="66" width="100" height="28" fill="white"/>',speed:'<circle cx="80" cy="80" r="64" fill="white" stroke="#c52729" stroke-width="14"/><text x="80" y="103" text-anchor="middle" font-size="66" font-weight="bold" font-family="Arial">60</text>'};return `<svg class="sign" role="img" aria-label="Road sign to identify" viewBox="0 0 160 160">${bg}${shapes[s]||''}</svg>`}
function render() {
  if (!run) return home();
  if (run.i >= run.items.length) return finish();
  const item = run.items[run.i];
  const question = BANK.find(candidate => candidate.id === item.id);
  const answered = run.answers[run.i];
  const nextLabel = run.i === run.items.length - 1 ? 'Finish and review' : 'Next question';

  $('quiz').innerHTML = `
    <div class="meta">
      <span class="pill">${run.flash ? 'Recall cards' : run.mock ? 'Timed mixed drill' : 'Learning drill'} · ${question.topic}</span>
      <span id="clock"></span>
    </div>
    <div class="bar"><div style="width:${run.i / run.items.length * 100}%"></div></div>
    <div class="card">
      <div class="small muted">Question ${run.i + 1} of ${run.items.length} · ID ${question.id}${item.repeat ? ' · delayed revisit' : ''}</div>
      ${question.sign ? sign(question.sign) : ''}
      <h2>${esc(question.q)}</h2>
      ${run.flash ? `
        <p class="muted">Say your answer before revealing it.</p>
        <button class="primary" id="reveal">Reveal answer</button>
        <div id="flashAnswer" class="hide">
          <h3>${esc(question.correct)}</h3>
          <p>${esc(question.why)}</p>
          <div class="actions"><button id="know">Recalled correctly</button><button id="again">Need another try</button></div>
        </div>` : `
        <label class="small"><input type="checkbox" id="guess" ${(answered?.guess ?? run.unsure) ? 'checked' : ''} ${answered ? 'disabled' : ''}>I am guessing or unsure</label>
        <div id="options">
          ${item.opts.map((option, index) => {
            const result = answered && !run.mock
              ? option === question.correct ? 'good' : answered.pick === option ? 'bad' : ''
              : '';
            return `<button class="option ${result}" data-opt="${index}" aria-pressed="${(answered?.pick ?? run.selected) === option}" ${answered ? 'disabled' : ''}><b>${String.fromCharCode(65 + index)}</b>${esc(option)}</button>`;
          }).join('')}
        </div>
        ${answered && !run.mock ? feedback(question, answered) : ''}
        <button class="primary" id="next" ${!answered && run.selected === undefined ? 'disabled' : ''}>${answered || run.mock ? nextLabel : 'Check answer'}</button>`}
    </div>
    <div class="actions"><button id="pause">Pause and save</button>${run.flash ? '' : '<button id="end">Finish this drill early</button>'}</div>
    <p class="small muted">${run.newCount} initially unseen questions in this session. Repeated-bank scores can overstate readiness for a fresh exam.</p>`;

  if (run.flash) {
    $('reveal').onclick = () => {
      $('reveal').classList.add('hide');
      $('flashAnswer').classList.remove('hide');
    };
    $('know').onclick = () => { recordAnswer(question.correct, false); next(); };
    $('again').onclick = () => { recordAnswer(null, true); next(); };
  } else {
    const options = document.querySelectorAll('[data-opt]');
    options.forEach(button => {
      button.onclick = () => {
        run.selected = item.opts[Number(button.dataset.opt)];
        options.forEach(option => option.setAttribute('aria-pressed', String(option === button)));
        $('next').disabled = false;
        save();
      };
    });
    $('guess').onchange = () => {
      run.unsure = $('guess').checked;
      save();
    };
    $('next').onclick = () => {
      if (answered) return next();
      if (!recordSelection()) return;
      if (run.mock) return next();
      save();
      render();
      $('next')?.focus();
    };
    $('end').onclick = finish;
  }
  $('pause').onclick = () => {
    run.remaining = Math.max(0, run.end - Date.now());
    save();
    home();
  };
  updateClock();
}
function feedback(q,a){return `<div class="feedback ${a.correct&&!a.guess?'good':'bad'}" aria-live="polite"><b>${a.correct?(a.guess?'Correct guess: review it again':'Correct'):'Needs review'}</b><p>${esc(q.why)}</p><a class="small" href="${SOURCES[q.source][1]}" target="_blank" rel="noopener">${SOURCES[q.source][0]}</a></div>`}
function recordAnswer(pick, guess) {
  if (!run || run.answers[run.i]) return;
  const item = run.items[run.i];
  const question = BANK.find(candidate => candidate.id === item.id);
  const correct = pick === question.correct;
  run.answers[run.i] = {id:question.id, pick, guess, correct, repeat:!!item.repeat};
  const progress = mem.seen[question.id] || {first:correct, attempts:0, streak:0};
  progress.everMissed = progress.everMissed || progress.first === false || !correct;
  progress.everGuessed = progress.everGuessed || progress.guessed === true || guess;
  progress.attempts++;
  progress.streak = correct && !guess ? progress.streak + 1 : 0;
  progress.guessed = guess;
  progress.last = Date.now();
  mem.seen[question.id] = progress;
}

function recordSelection() {
  if (run.selected === undefined || run.answers[run.i]) return false;
  recordAnswer(run.selected, Boolean(run.unsure));
  return true;
}

function next() {
  run.i++;
  delete run.selected;
  delete run.unsure;
  save();
  render();
}
function updateClock(){if(!$('clock')||!run)return;let ms=Math.max(0,run.end-Date.now()),sec=Math.ceil(ms/1000);$('clock').textContent=Math.floor(sec/60)+':'+String(sec%60).padStart(2,'0');if(ms<=0)finish()}
function tick(){clearInterval(timer);if(run?.remaining!==undefined){run.end=Date.now()+run.remaining;delete run.remaining;save()}updateClock();timer=setInterval(updateClock,1000)}
function finish() {
  if (!run) return;
  clearInterval(timer);
  recordSelection();
  const r = run;
  run = null;
  const a = r.answers.filter(Boolean);
  const first = a.filter(answer => !answer.repeat);
  const score = first.filter(answer => answer.correct).length;
  const total = r.mock ? r.items.length : first.length;
  const s = {mode:r.mode,score,total,answered:a.length,guesses:first.filter(x=>x.guess).length,date:new Date().toISOString(),flash:r.flash,newCount:r.newCount,
  targetCount:r.items.filter(item => !item.repeat).length,
  review:r.items.map((item, index) => ({ id:item.id, repeat:!!item.repeat, answer:r.answers[index] || null }))
};mem.sessions.push(s);save();show('result');const followups=variantsForSession(s);let pct=total?Math.round(score/total*100):0;let issues=a.filter(x=>!x.correct||x.guess);let unanswered=r.items.filter((it,i)=>!r.answers[i]);$('result').innerHTML=`<div class="card"><div class="eyebrow">${r.flash?'Recall session complete':'Drill complete'}</div><div class="resultnum">${r.flash?a.length+' cards':score+' / '+total}</div><h2>${r.flash?'Keep the difficult cards in rotation.':pct>=90?'Strong drill result. Verify on a fresh question pool.':pct>=80?'Review missed and uncertain answers.':'Focus the next block on your review queue.'}</h2><p>${r.flash?'Flashcard self-ratings are not an exam score.':`${pct}% on first presentations in this session · ${s.guesses} guesses · ${r.newCount} initially unseen. Practice variants are scored in their own round.`}</p>${unanswered.length?`<p>${unanswered.length} items unanswered${r.mock?', counted wrong in the timed score':''}.</p>`:''}<div class="actions">${variantButton(followups)}<button id="reviewFinished">Review all answers</button><button id="showReport">View progress report</button><button id="backHome">Dashboard</button></div></div><div class="card"><h3>Corrections and guesses</h3>${issues.length?issues.map(x=>{let q=BANK.find(q=>q.id===x.id);return `<details><summary>${esc(q.q)}</summary><p>Your answer: ${esc(x.pick||'Not recalled')} ${x.guess?'(unsure)':''}</p><p><b>${esc(q.correct)}</b></p><p>${esc(q.why)}</p><a href="${SOURCES[q.source][1]}" target="_blank" rel="noopener">Source</a></details>`}).join(''):'<p>No recorded mistakes or guesses. Try a different pool before judging readiness.</p>'}</div>`;if(followups.length)$('practiceVariants').onclick=()=>start('weak',followups);$('reviewFinished').onclick=()=>reviewSession(mem.sessions.length-1);$('showReport').onclick=report;$('backHome').onclick=home}
const blockNames = {
  diagnostic: 'Find the gaps',
  rules: 'Rules, hazards and emergency actions',
  numbers: 'Licence and number traps',
  mixed30: 'Fresh mixed check',
};

function latestBlockAttempt(mode) {
  return mem.sessions.findLastIndex(session => session.mode === mode && session.total > 0);
}

function blockState(mode) {
  const attempt = mem.sessions[latestBlockAttempt(mode)];
  if (!attempt) return '';
  const target = attempt.targetCount ?? { diagnostic:20, rules:25, numbers:30, mixed30:30 }[mode];
  return attempt.total >= target ? 'completed' : 'partial';
}

function blockResult(mode) {
  const index = latestBlockAttempt(mode);
  if (index < 0) return '';
  const attempt = mem.sessions[index];
  const score = Math.round(attempt.score / attempt.total * 100);
  const status = blockState(mode) === 'completed' ? 'Completed' : 'Attempt ended early';
  return `<p class="block-score">${status} · ${attempt.score}/${attempt.total} (${score}%)</p><button data-review="${index}">Review answers</button>`;
}

function recordedIssues() {
  return BANK.flatMap(question => {
    const progress = mem.seen[question.id];
    if (!progress) return [];
    const missed = progress.first === false || progress.everMissed || (progress.streak === 0 && !progress.guessed);
    const guessed = progress.guessed || progress.everGuessed;
    if (!missed && !guessed) return [];
    return [{ question, missed, guessed }];
  });
}

function recoverFreshSession(index) {
  const session = mem.sessions[index];
  if (!session.total || session.newCount !== session.total || session.flash || session.guesses !== 0) return null;
  const latest = Date.parse(session.date);
  const earliest = index ? Date.parse(mem.sessions[index - 1].date) : 0;
  if (!Number.isFinite(latest) || !Number.isFinite(earliest)) return null;
  const recovered = Object.entries(mem.seen)
    .filter(([, progress]) => progress.last > earliest && progress.last <= latest)
    .sort(([, left], [, right]) => left.last - right.last);
  if (recovered.length !== session.total || recovered.filter(([, progress]) => progress.first).length !== session.score) return null;
  return recovered.map(([id, progress]) => ({ id:Number(id), answer:{ correct:progress.first, pick:null, guess:false } }));
}

function reviewSession(index) {
  const session = mem.sessions[index];
  if (!session) return;
  clearInterval(timer);
  show('result');
  const recovered = session.review ? null : recoverFreshSession(index);
  const rows = session.review || recovered;
  const title = blockNames[session.mode] || 'Practice session';
  const missingDetails = '<p class="muted">Earlier sessions did not save your answer choices or a complete question history.</p>';
  let reviewHtml;
  if (rows) {
    const items = rows.map(row => reviewItem(row, Boolean(recovered)));
    reviewHtml = `${recovered ? missingDetails : ''}${items.join('') || '<p>No questions recorded in this attempt.</p>'}`;
  } else {
    const issues = recordedIssues().map(({question, missed, guessed}) =>
      reviewItem({id:question.id, answer:{correct:!missed, guess:guessed, pick:null}}, true));
    const seen = BANK.filter(question => mem.seen[question.id]).map(question => reviewItem({id:question.id}, true));
    reviewHtml = `${missingDetails}<h3>Misses and flagged answers across your drills</h3>${issues.join('') || '<p>No recorded misses or flagged answers.</p>'}<h3>Answer key for questions you have seen</h3>${seen.join('')}`;
  }
  const followups = variantsForSession(session);
  $('result').innerHTML = `<div class="card"><div class="eyebrow">Answer review</div><h2>${title}</h2><p><b>${session.flash ? `${session.answered} cards` : `${session.score}/${session.total}`}</b></p><div class="actions">${variantButton(followups)}<button id="reviewReport">View progress report</button><button id="reviewBack">Back to dashboard</button></div></div><div class="card answer-review">${reviewHtml}</div>`;
  if (followups.length) $('practiceVariants').onclick = () => start('weak', followups);
  $('reviewReport').onclick = () => report(index);
  $('reviewBack').onclick = home;
}

function variantButton(followups) {
  return followups.length ? `<button class="primary" id="practiceVariants">Practise ${followups.length} ${followups.length === 1 ? 'variant' : 'variants'}</button>` : '';
}

function reviewItem(row, recovered) {
  const question = BANK.find(candidate => candidate.id === row.id);
  if (!question) return '';
  const answer = row.answer;
  const status = answer ? (answer.correct ? 'Correct' : 'Missed') : (recovered ? 'Answer key' : 'Unanswered');
  const selection = answer?.pick != null ? `<p>Your answer: ${esc(answer.pick)}</p>` : '';
  return `<details${answer && (!answer.correct || answer.guess) ? ' open' : ''}><summary>${status}${answer?.guess ? ' · Unsure' : ''}${row.repeat ? ' · Revisit' : ''} · ${esc(question.q)}</summary>${question.sign ? sign(question.sign) : ''}${selection}<p><b>Correct answer:</b> ${esc(question.correct)}</p><p>${esc(question.why)}</p></details>`;
}

function report(reviewIndex) {
  clearInterval(timer);
  show('result');
  const scores = mem.sessions.slice(-6).map(session =>
    `${session.mode}: ${session.flash ? 'flashcards' : `${session.score}/${session.total}`}, guesses ${session.guesses}, initially unseen ${session.newCount}`
  ).join('\n');
  const corrections = recordedIssues().map(({question, missed, guessed}) => {
    const reason = [missed && 'missed', guessed && 'unsure'].filter(Boolean).join(', ');
    return `ID ${question.id} [${question.topic}] (${reason}) ${question.q}\nCorrect: ${question.correct}`;
  });
  const fromReview = Number.isInteger(reviewIndex);
  $('result').innerHTML = `<div class="card"><h2>Copy your progress report</h2><p>It lists your scores and the questions you missed or flagged.</p><textarea id="reportText" readonly></textarea><button id="reportBack">${fromReview ? 'Back to answer review' : 'Dashboard'}</button></div>`;
  $('reportText').value = `KPP revision report\n${scores || 'No completed sessions yet.'}\n\nMISSED OR FLAGGED QUESTIONS\n${corrections.join('\n\n') || 'No misses or flagged answers recorded.'}`;
  $('reportText').onclick = () => $('reportText').select();
  $('reportBack').onclick = fromReview ? () => reviewSession(reviewIndex) : home;
}

updateSavedRun();
$('home').onclick=home;home();
