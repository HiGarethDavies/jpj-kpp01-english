const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const html = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const scripts = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(match => match[1]);
assert.equal(scripts.length, 2);
assert.match(html, /Content-Security-Policy.+connect-src 'none'/);
assert.doesNotMatch(html, /<script\b[^>]+\bsrc=|<link\b[^>]+\brel=["']stylesheet|@import\b/i);

function rejectNetwork() {
  throw new Error('Offline quiz attempted a network request');
}

function openQuiz(initialState) {
  const elements = {};
  const element = id => elements[id] ||= {
    innerHTML:'', textContent:'', value:'', checked:false,
    classList:{toggle(){}, add(){}, remove(){}}, select(){}, focus(){},
  };
  const options = [0, 1, 2].map(index => ({
    dataset:{opt:String(index)}, setAttribute(name, value) { this[name] = value; },
  }));
  let saved = initialState ? JSON.stringify(initialState) : null;
  const context = vm.createContext({
    document:{getElementById:element, querySelectorAll:selector => selector === '[data-opt]' ? options : []}, window:{scrollTo(){}},
    localStorage:{getItem:() => saved, setItem:(_key, value) => { saved = value; }},
    confirm:() => true, setInterval:() => 1, clearInterval(){},
    fetch:rejectNetwork, XMLHttpRequest:rejectNetwork, WebSocket:rejectNetwork,
    EventSource:rejectNetwork, navigator:{sendBeacon:rejectNetwork},
  });
  for (const script of scripts) vm.runInContext(script, context);
  return {run:code => vm.runInContext(code, context), elements, options, getSaved:() => JSON.parse(saved)};
}

const quiz = openQuiz();
const {run, elements} = quiz;
assert(run('BANK.every(q=>new Set(q.options).size===3 && q.options.includes(q.correct) && SOURCES[q.source])'));
assert.equal(run('activeQuestions().length'), 469);
assert(run('Object.values(IMAGES).every(image => image.startsWith("data:image/svg+xml,"))'));
assert(run("activeQuestions().every(q=>!q.q.startsWith('Match both cases'))"));
run("start('rules'); recordAnswer('wrong', false); next(); recordAnswer(BANK.find(q=>q.id===run.items[1].id).correct, true)");
assert.equal(run('run.items.length'), 25);
assert.match(elements.quiz.innerHTML, /Question 2 of 25/);
assert.equal(run('run.answers[1].guess'), true);
run('for (let i=2;i<25;i++) {next(); recordAnswer(BANK.find(q=>q.id===run.items[i].id).correct, false)}; next()');
assert.equal(quiz.getSaved().sessions.at(-1).total, 25);
assert.equal(quiz.getSaved().sessions.at(-1).score, 24);
run("start('mock70')");
assert.equal(run('run.items.length'), 70);
const correctOption = run('run.items[0].opts.indexOf(BANK.find(q=>q.id===run.items[0].id).correct)');
const wrongOption = (correctOption + 1) % 3;
const mockQuestionId = run('run.items[0].id');
const priorProgress = quiz.getSaved().seen[mockQuestionId];
quiz.options[wrongOption].onclick();
assert.equal(quiz.options[wrongOption]['aria-pressed'], 'true');
elements.guess.checked = true;
elements.guess.onchange();
quiz.options[correctOption].onclick();
assert.equal(quiz.options[wrongOption]['aria-pressed'], 'false');
assert.equal(quiz.options[correctOption]['aria-pressed'], 'true');
assert.deepEqual(quiz.getSaved().seen[mockQuestionId], priorProgress);
assert.equal(quiz.getSaved().active.answers.length, 0);
const resumed = openQuiz(quiz.getSaved());
resumed.run('render()');
assert.match(resumed.elements.quiz.innerHTML, new RegExp(`data-opt="${correctOption}" aria-pressed="true"`));
assert.match(resumed.elements.quiz.innerHTML, /id="guess" checked/);
assert.doesNotMatch(resumed.elements.quiz.innerHTML, /class="feedback/);
resumed.elements.next.onclick();
assert.equal(resumed.getSaved().active.answers[0].correct, true);
assert.equal(resumed.getSaved().active.answers[0].guess, true);
assert.equal(resumed.getSaved().seen[mockQuestionId].attempts, (priorProgress?.attempts || 0) + 1);
assert.equal(resumed.getSaved().active.selected, undefined);
assert.equal(resumed.getSaved().active.unsure, undefined);
assert.match(resumed.elements.quiz.innerHTML, /Question 2 of 70/);
const nextCorrect = resumed.run('run.items[1].opts.indexOf(BANK.find(q=>q.id===run.items[1].id).correct)');
resumed.options[nextCorrect].onclick();
resumed.run('run.end=0; updateClock()');
assert.equal(resumed.getSaved().sessions.at(-1).total, 70);
assert.equal(resumed.getSaved().sessions.at(-1).score, 2);
assert.equal(resumed.getSaved().sessions.at(-1).guesses, 1);

const learning = openQuiz();
learning.run("start('rules')");
learning.options[0].onclick();
assert.match(learning.elements.quiz.innerHTML, /Check answer/);
assert.doesNotMatch(learning.elements.quiz.innerHTML, /class="feedback/);
learning.elements.next.onclick();
assert.match(learning.elements.quiz.innerHTML, /class="feedback/);
assert.match(learning.elements.quiz.innerHTML, /Question 1 of 25/);
learning.elements.next.onclick();
assert.match(learning.elements.quiz.innerHTML, /Question 2 of 25/);

const missedIds = [66,72];
const saved = {seen:Object.fromEntries(missedIds.map(id=>[id,{first:false, guessed:false, streak:0}])),sessions:[{mode:'rules',score:21,total:25}],active:null};
const historical = openQuiz(saved);
assert.match(historical.elements.dashboard.innerHTML, /Completed · 21\/25/);
historical.run("start('weak')");
const variants = historical.getSaved().active.items.map(item=>item.id);
assert.equal(variants.length, 2);
assert(variants.every(id=>!missedIds.includes(id)));
assert(historical.run('run.items.every(({id})=>!BANK[id-1].retired)'));
historical.run('run.remaining=60000;run.end=0;tick()');
assert(historical.run('run.end>Date.now()'));

const legacyRun = openQuiz({...saved, active:{mode:'rules', i:1, newCount:1, lastWrong:{66:1},
  items:[{id:66},{id:66,repeat:true},{id:315}], answers:[{id:66,correct:false}], end:Date.now()+60000}});
assert.equal(legacyRun.getSaved().active.i, 1);
assert.equal(legacyRun.getSaved().active.items.length, 2);
assert.notEqual(legacyRun.getSaved().active.items[1].id, 315);
assert.equal(legacyRun.getSaved().active.answers[0].id, 66);

assert.equal(run('BANK[116].correct'), 'Divided road ends');
assert.equal(run('BANK[116].sign'), 'img:divided-road-ends');
assert.equal(run('BANK[117].correct'), 'Divided road begins');
assert.equal(run('BANK[117].sign'), 'img:divided-road-begins');

console.log('PASS: offline runtime, embedded signs, editable mock choices, local progress, timed scoring, drills, and answer variants.');
