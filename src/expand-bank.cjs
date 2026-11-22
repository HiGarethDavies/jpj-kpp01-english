const fs = require('node:fs');
const path = require('node:path');

function readGroups(name) {
  const groups = [];
  for (const line of fs.readFileSync(path.join(__dirname, name), 'utf8').split(/\r?\n/)) {
    const row = line.trim();
    if (!row || row.startsWith('#')) continue;
    if (row.startsWith('@')) {
      const [topic, source, label] = row.slice(1).split('|');
      groups.push({topic, source, label, rows:[]});
    } else {
      groups.at(-1).rows.push(row.split('|'));
    }
  }
  return groups;
}

function contrastQuestions({topic, source, label, rows}, groupNumber) {
  if (rows.length !== 3 || rows.some(row => row.length < 3 || row.length > 4)) {
    throw new Error(`Expected three comparisons in ${label}`);
  }
  return rows.flatMap(([situation, answer, reason, sign], index) => {
    const [secondSituation, secondAnswer, secondReason] = rows[(index + 1) % 3];
    const [thirdSituation, thirdAnswer] = rows[(index + 2) % 3];
    const family = `contrast-${groupNumber}-${index}`;
    const pair = (first, second) => `1. ${first} / 2. ${second}`;
    const directPrompt = sign ? `Which option matches the sign shown? (${label})` : `Choose the correct match. ${situation}.`;
    return [
      {q:directPrompt, options:[answer, secondAnswer, thirdAnswer], why:reason, sign},
      {q:`${label}. Which case is the best match for “${answer}”?`, options:[situation, secondSituation, thirdSituation], why:reason},
      {q:`Match both cases to the correct answers. 1. ${situation}. 2. ${secondSituation}.`,
        options:[pair(answer, secondAnswer), pair(secondAnswer, answer), pair(answer, thirdAnswer)], why:`${reason} ${secondReason}`, retired:true},
    ].map(question => ({...question, topic, source, family, correct:question.options[0]}));
  });
}

module.exports = function expandedQuestions() {
  const scenarios = readGroups('scenario-bank.txt').flatMap(({topic, source, rows}) => rows.map(row => {
    if (row.length !== 5 && row.length !== 6) throw new Error(`Missing answers or explanation: ${row[0]}`);
    const [q, correct, distractor1, distractor2, why, sign] = row;
    return {q, topic, source, correct, options:[correct, distractor1, distractor2], why, sign};
  }));
  const followups = readGroups('followup-bank.txt').flatMap(({topic, source, rows}) => rows.map(row => {
    if (row.length !== 6) throw new Error(`Invalid follow-up: ${row[0]}`);
    const [reviewFamily, q, correct, distractor1, distractor2, why] = row;
    return {reviewFamily, q, topic, source, correct, options:[correct, distractor1, distractor2], why};
  }));
  return [...scenarios, ...readGroups('contrast-bank.txt').flatMap(contrastQuestions), ...followups];
};
