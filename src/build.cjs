const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const expandedQuestions = require('./expand-bank.cjs');
const assignReviewFamilies = require('./review-variants.cjs');
const images = require('./sign-art.cjs');
const root = __dirname;
const load = name => fs.readFileSync(path.join(root, name), 'utf8');

const page = load('page.html');
const app = load('app.js');
const additional = expandedQuestions();
const { BANK: originalQuestions, SOURCES: sources } = vm.runInNewContext(load('bank.js') + '; ({BANK, SOURCES})');
const questions = [...originalQuestions, ...additional.map((question, index) => ({id:originalQuestions.length + index + 1, ...question}))];
assignReviewFamilies(questions);
const keys = new Set();
for (const question of questions) {
  const key = `${question.q}|${question.sign || ''}`.toLowerCase();
  if (keys.has(key) && question.id > 134) throw new Error(`Repeated question: ${question.q}`);
  keys.add(key);
  if (!question.why || question.options.length !== 3 || new Set(question.options).size !== 3 || !question.options.includes(question.correct)) {
    throw new Error(`Invalid answers for question ${question.id}: ${question.q}`);
  }
  if (question.sign?.startsWith('img:') && !images[question.sign.slice(4)]) throw new Error(`Missing image for ${question.q}`);
}
const bank = `const SOURCES = ${JSON.stringify(sources)};\nconst BANK = ${JSON.stringify(questions)};\nconst IMAGES = ${JSON.stringify(images)};`;
new vm.Script(bank + '\n' + app);
const html = page.replace('/*BANK*/', () => bank).replace('/*APP*/', () => app);
fs.writeFileSync(path.join(root, '..', 'index.html'), html);
console.log(JSON.stringify({active:questions.filter(q=>!q.retired).length, archived:questions.filter(q=>q.retired).length, visual:questions.filter(q=>q.sign).length, bytes:Buffer.byteLength(html)}));
