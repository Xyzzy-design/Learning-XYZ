'use strict';
function appendMathEvidence(root, task) {
  root.append(el('h2', {}, 'Equal parts, equal wholes'),subjectArt('math'),el('p', {}, 'A fraction names equal parts of a whole. The denominator counts the equal parts in one whole; the numerator counts how many of those parts we have.'));
  if (task.visual === 'fraction') root.append(el('p', {},task.context),el('div', {style:'display:grid;grid-template-columns:repeat(4,1fr);gap:3px;height:60px',role:'img','aria-label':'One bar in four equal parts; two parts are shaded.'},...[0,1,2,3].map(part => el('span', {style:`background:${part < 2 ? '#236e59' : '#fff'};border:2px solid #236e59`}))));
}
const KEY = 'mathPlayground.v1';
const LEVELS = [
  {name:'Rookie',icon:'🐣',rules:{
    add:{operandMin:0,operandMax:10,resultMax:20,regroupingMin:0,regroupingMax:1},
    sub:{operandMin:0,operandMax:20,differenceMin:0,regroupingMin:0,regroupingMax:1},
    mul:{factorMin:1,factorMax:5,multiplierMin:0,multiplierMax:10,missingChance:0},
    div:{factorMin:1,factorMax:5,multiplierMin:1,multiplierMax:10,missingChance:0},
    frac:{types:['visual'],denominators:[2,3,4,5,6,8]},
  },seconds:{add:10,sub:10,mul:10,div:10,frac:20}},
  {name:'Explorer',icon:'🧭',rules:{
    add:{operandMin:10,operandMax:99,resultMax:100,regroupingMin:0,regroupingMax:2},
    sub:{operandMin:5,operandMax:100,differenceMin:0,regroupingMin:0,regroupingMax:2},
    mul:{factorMin:2,factorMax:10,multiplierMin:0,multiplierMax:10,missingChance:0},
    div:{factorMin:2,factorMax:10,multiplierMin:1,multiplierMax:10,missingChance:0},
    frac:{types:['equivalent','add'],denominators:[2,3,4,5,6,8,10],factors:[2,3,4],relation:'same'},
  },seconds:{add:12,sub:12,mul:10,div:12,frac:25}},
  {name:'Champion',icon:'🏅',rules:{
    add:{operandMin:100,operandMax:899,resultMax:999,regroupingMin:0,regroupingMax:0},
    sub:{operandMin:100,operandMax:999,differenceMin:0,regroupingMin:0,regroupingMax:0},
    mul:{factorMin:2,factorMax:12,multiplierMin:2,multiplierMax:12,missingChance:0.4},
    div:{factorMin:2,factorMax:12,multiplierMin:2,multiplierMax:12,missingChance:0.4},
    frac:{types:['add','sub'],denominators:[2,3,4,5,6],factors:[2,3],relation:'related',minNumerator:0},
  },seconds:{add:20,sub:20,mul:15,div:20,frac:40}},
  {name:'Math Wizard',icon:'🧙',rules:{
    add:{operandMin:1000,operandMax:8999,resultMax:9999,regroupingMin:2,regroupingMax:3},
    sub:{operandMin:1000,operandMax:9999,differenceMin:100,regroupingMin:2,regroupingMax:3},
    mul:{factorMin:12,factorMax:25,multiplierMin:12,multiplierMax:25,missingChance:0.5,excludeTens:true},
    div:{factorMin:12,factorMax:25,multiplierMin:12,multiplierMax:40,missingChance:0.5,excludeTens:true},
    frac:{types:['add','sub'],denominators:[6,7,8,9,10,12,15,16],relation:'unrelated',minDenominator:24,minNumerator:1,reducedOperands:true},
  },seconds:{add:40,sub:40,mul:30,div:40,frac:60}},
].map(level => ({...level,get desc(){return describeMathLevel(this);}}));
function mathLevel(level) {
  if (!Number.isInteger(level) || !LEVELS[level - 1]) throw new RangeError('Choose a configured Math level.');
  return LEVELS[level - 1];
}
function describeMathLevel(level) {
  const {add,sub,mul,div,frac} = level.rules;
  const regroup = add.regroupingMin ? ` · ${add.regroupingMin}+ carries / ${sub.regroupingMin}+ borrows` : add.regroupingMax === 0 && sub.regroupingMax === 0 ? ' · no regrouping' : '';
  const fraction = frac.types.includes('visual') ? `fraction pictures (${Math.min(...frac.denominators)}–${Math.max(...frac.denominators)} parts)` : frac.relation === 'unrelated' ? `unrelated fractions (LCM ≥ ${frac.minDenominator})` : frac.types.includes('equivalent') ? 'equivalent fractions' : 'fraction sums & differences';
  return `+ ≤ ${add.resultMax}; − ≤ ${sub.operandMax}${regroup} · × ${mul.factorMin}–${mul.factorMax} by ${mul.multiplierMin}–${mul.multiplierMax} · ÷ by ${div.factorMin}–${div.factorMax} · ${fraction}`;
}
function describeMathRule(operation, level) {
  const rule = mathLevel(level).rules[operation];
  if (operation === 'add') return `Addends ${rule.operandMin}–${rule.operandMax}; total ≤ ${rule.resultMax}; ${rule.regroupingMin}–${rule.regroupingMax} carries.`;
  if (operation === 'sub') return `Numbers ${rule.operandMin}–${rule.operandMax}; difference ≥ ${rule.differenceMin}; ${rule.regroupingMin}–${rule.regroupingMax} borrows.`;
  if (operation === 'mul') return `Factors ${rule.factorMin}–${rule.factorMax} and ${rule.multiplierMin}–${rule.multiplierMax}; missing factors ${Math.round(rule.missingChance * 100)}%.${rule.excludeTens ? ' Multiples of 10 excluded.' : ''}`;
  if (operation === 'div') return `Divisors ${rule.factorMin}–${rule.factorMax}; quotients ${rule.multiplierMin}–${rule.multiplierMax}; missing divisors ${Math.round(rule.missingChance * 100)}%.${rule.excludeTens ? ' Multiples of 10 excluded.' : ''}`;
  const types = rule.types.map(type => ({visual:'shaded parts',equivalent:'equivalent fractions',add:'addition',sub:'subtraction'}[type])).join(', ');
  return `Fractions: ${types}; starting denominators ${rule.denominators.join(', ')}.${rule.relation ? ` ${rule.relation} denominators.` : ''}${rule.minDenominator ? ` Common denominator ≥ ${rule.minDenominator}.` : ''}${rule.reducedOperands ? ' Operands start in simplest form.' : ''}`;
}
function mathRoundSeconds(problems, level) {
  const seconds = mathLevel(level).seconds;
  return problems.reduce((total,problem) => {
    if (!Number.isFinite(seconds[problem.op]) || seconds[problem.op] <= 0) throw new RangeError('Each game needs a positive seconds-per-question budget.');
    return total + seconds[problem.op];
  },0);
}
function mathRecordKey(game, level) {
  const profile = mathLevel(level);
  const operations = game === 'mix' ? ['add','sub','mul','div'] : [game];
  const signature = JSON.stringify({format:2,count:GAMES[game].n,rules:operations.map(operation => profile.rules[operation])});
  let hash = 0;
  for (const character of signature) hash = (Math.imul(hash,31) + character.charCodeAt(0)) >>> 0;
  return `${game}-${level}-r${hash.toString(36)}`;
}
const GAMES = {
  add: {title: 'Addition Adventure', icon: '➕', color: 'var(--add)', n: 10, sub: 'Put numbers together'},
  sub: {title: 'Subtraction Safari', icon: '➖', color: 'var(--sub)', n: 10, sub: 'Take numbers away'},
  mul: {title: 'Multiplication Mission', icon: '✖️', color: 'var(--mul)', n: 10, sub: 'Groups of numbers'},
  div: {title: 'Division Detective', icon: '➗', color: 'var(--div)', n: 10, sub: 'Share equally'},
  frac: {title: 'Fraction Fiesta', icon: '🥧', color: '#00796b', n: 10, sub: 'Find the missing fraction numbers'},
  mix: {title: 'Mixed Challenge', icon: '🎯', color: 'var(--mix)', n: 20, sub: 'All four + a mystery picture!'},
};
const BADGES = [
  {id: 'first', icon: '🌟', name: 'First Star', desc: 'Earn your first star', stars: 1},
  {id: 'bronze', icon: '🥉', name: 'Bronze', desc: 'Collect 25 stars', stars: 25},
  {id: 'silver', icon: '🥈', name: 'Silver', desc: 'Collect 100 stars', stars: 100},
  {id: 'gold', icon: '🥇', name: 'Gold', desc: 'Collect 250 stars', stars: 250},
  {id: 'legend', icon: '🏆', name: 'Math Legend', desc: 'Collect 500 stars', stars: 500},
  {id: 'streak', icon: '🔥', name: 'Hot Streak', desc: '10 right in a row on the first try'},
  {id: 'perfect', icon: '💯', name: 'Perfect Round', desc: 'Finish a round with no mistakes'},
  {id: 'explorer', icon: '🧭', name: 'All-Rounder', desc: 'Finish a round of +, −, × and ÷'},
  {id: 'picture', icon: '🖼️', name: 'Picture Revealer', desc: 'Reveal a mystery picture'},
  {id: 'speedy', icon: '⚡', name: 'Speedy', desc: 'Stopwatch round under 1 min (Mixed: 2 min)'},
  {id: 'clock', icon: '⏳', name: 'Clock Beater', desc: 'Finish a Beat the Clock round in time'},
  {id: 'level4', icon: '🧙', name: 'Wizard Round', desc: 'Finish a round at Level 4'},
];
// 10x10 pixel art; digits index into PALETTE
const PICS = [
  {name: 'a smiley face 😊', rows: ['1112222111','1224444221','2444444442','2442442442','2444444442','2844444482','2424444242','2442222442','1224444221','1112222111']},
  {name: 'a rocket 🚀', rows: ['1111331111','1113333111','1116666111','1116226111','1116226111','1116666111','1136666311','1336666331','1114554111','1111451111']},
  {name: 'a cat 🐱', rows: ['5111111115','5511111155','5555555555','5525555255','5555555555','5555885555','2555225552','5555555555','1555555551','1155555511']},
  {name: 'a heart ❤️', rows: ['1111111111','1331111331','3333113333','3633333333','3333333333','1333333331','1133333311','1113333111','1111331111','1111111111']},
];
const PALETTE = ['#b0bec5','#bbdefb','#333333','#e53935','#ffd54f','#fb8c00','#ffffff','#43a047','#f48fb1'];
const YAY = ['Great job!', 'You got it!', 'Super!', 'Awesome!', 'Math magic! ✨', 'Nailed it!', 'Brilliant!', 'Way to go!'];
const OOPS = ['Almost! Try again 💪', 'Oops, check it one more time!', 'So close! You can do it!', 'Hmm, not quite. Try again!'];
const JOKES = [
  'Why was 6 afraid of 7? Because 7 8 9! 😱',
  'Why did the math book look sad? It had too many problems! 📘',
  'What did the 0 say to the 8? Nice belt! 👖',
  "What's a math teacher's favorite dessert? Pi! 🥧",
  'Why do plants hate math? It gives them square roots! 🌱',
  'What do you call friends who love math? Algebros! 🤝',
  'Why is 10 scared of 11? Because 11 is bigger and always in the teens! 😄',
  'Why did the student do multiplication on the floor? The teacher told them not to use tables! 🪑',
  'What is a math teacher’s favorite sum-mer activity? Counting waves! 🌊',
  'Why was the equal sign so humble? It knew it was not less than or greater than anyone else! ⚖️',
  'What kind of tree fits in your hand? A palm tree! 🌴',
  'Why did the number 4 skip lunch? It already had 8! 🍽️',
  'What did one triangle say to the other? You are looking sharp! 🔺',
  'Why did the circle go to school? It wanted to become well-rounded! ⭕',
  'What do you call a number that cannot sit still? A roamin’ numeral! 🏃',
  'Why did the fraction feel nervous? It was going through a rough patch! 😅',
  'What did the calculator say to the student? You can count on me! 🧮',
  'Why did the picture go to math class? It wanted to learn how to draw conclusions! 🖼️',
  'What is a snake’s favorite subject? Hiss-tory, but it likes adders too! 🐍',
  'Why did the student bring a ladder to math class? To reach the higher numbers! 🪜',
  'What do you call a number that likes to help? A kind-digit! 😊',
  'Why was the math worksheet so calm? It knew how to stay in its proper place! 📄',
  'What did the big flower say to the little flower? Hi, bud! 🌼',
  'Why did the two fours skip dinner? They already ate! 🍽️',
  'What is a math book’s favorite animal? A porcupine, because it has lots of points! 🦔',
  'Why did the student write with a broken pencil? It was pointless! ✏️',
  'What is a pirate’s favorite number? The one that says “arrr!” 🏴‍☠️',
  'Why did the clock get good at math? It spent a lot of time practicing! 🕒',
  'What do you call a number that tells jokes? A funny figure! 😄',
  'Why did the math teacher wear sunglasses? The students were so bright! 😎',
];
const TIPS = [
  '💡 Swap the numbers, same answer: 3 × 7 = 7 × 3',
  '💡 For 9 × 1 through 9 × 10, the digits of the answer add up to 9.',
  '💡 For a whole number × 10, append a 0: 24 × 10 = 240.',
  '💡 Division is multiplication backwards: 6 × 4 = 24, so 24 ÷ 4 = 6',
  '💡 The 5s always end in 0 or 5.',
];

// ---------- problem generators ----------
const parts = n => [Math.floor(n / 100) * 100, Math.floor(n % 100 / 10) * 10, n % 10].filter(Boolean);
function regroupingCount(first, second, operation) {
  let count = 0, carried = 0;
  while (first || second) {
    const needs = operation === 'add' ? first % 10 + second % 10 + carried >= 10 : first % 10 - carried < second % 10;
    carried = Number(needs);count += carried;
    first = Math.floor(first / 10);second = Math.floor(second / 10);
  }
  return count;
}
function arithmeticOperands(operation, level) {
  const rules = mathLevel(level).rules[operation];
  if (!Number.isInteger(rules.operandMin) || !Number.isInteger(rules.operandMax) || rules.operandMin < 0 || rules.operandMax < rules.operandMin || rules.operandMax > 99999) throw new RangeError('Math operand bounds must be whole numbers from 0 to 99999.');
  if (!Number.isInteger(rules.regroupingMin) || !Number.isInteger(rules.regroupingMax) || rules.regroupingMin < 0 || rules.regroupingMax < rules.regroupingMin || rules.regroupingMax > 5) throw new RangeError('Regrouping bounds must be ordered whole numbers from 0 to 5.');
  if (operation === 'add' && (!Number.isInteger(rules.resultMax) || rules.resultMax < 0 || rules.resultMax > 199998)) throw new RangeError('The addition result limit must be a whole number from 0 to 199998.');
  if (operation === 'sub' && (!Number.isInteger(rules.differenceMin) || rules.differenceMin < 0 || rules.differenceMin > rules.operandMax - rules.operandMin)) throw new RangeError('The subtraction difference limit must fit the configured operand range.');
  const firstMax = operation === 'add' ? Math.min(rules.operandMax,rules.resultMax - rules.operandMin) : rules.operandMax;
  if (firstMax < rules.operandMin) throw new RangeError('The addition result limit cannot contain both operands.');
  for (let attempt = 0; attempt < 1000; attempt++) {
    let first = ri(rules.operandMin,firstMax);
    const secondMax = operation === 'add' ? Math.min(rules.operandMax,rules.resultMax - first) : rules.operandMax;
    let second = ri(rules.operandMin,secondMax);
    if (operation === 'sub' && first < second) [first,second] = [second,first];
    const count = regroupingCount(first,second,operation);
    if (count < rules.regroupingMin || count > rules.regroupingMax) continue;
    if (operation === 'sub' && first - second < rules.differenceMin) continue;
    return {first,second,regroupings:count};
  }
  throw new RangeError(`No ${operation} question satisfies the configured range and regrouping rules.`);
}
function genAdd(level) {
  const {first,second,regroupings} = arithmeticOperands('add',level);
  return {text:`${first} + ${second} =`,ans:first + second,operands:[first,second],regroupings,
    hint:second < 10 ? `Start at ${first} and count up ${second}.` : `Break it up: ${first} + ${parts(second).join(' + ')}`};
}
function genSub(level) {
  const {first,second,regroupings} = arithmeticOperands('sub',level);
  return {text:`${first} − ${second} =`,ans:first - second,operands:[first,second],regroupings,
    hint:second < 10 ? `Start at ${first} and count back ${second}.` : `Break it up: ${first} − ${parts(second).join(' − ')}`};
}
function wholeNumberPool(minimum, maximum, excludeTens = false) {
  if (!Number.isInteger(minimum) || !Number.isInteger(maximum) || minimum < 0 || maximum < minimum || maximum > 999) throw new RangeError('Factor and multiplier limits must be whole numbers from 0 to 999.');
  const pool = Array.from({length:maximum - minimum + 1},(_, index) => minimum + index).filter(value => !excludeTens || value % 10 !== 0);
  if (!pool.length) throw new RangeError('The configured exclusions leave no eligible numbers.');
  return pool;
}
function productOperands(operation, level) {
  const rules = mathLevel(level).rules[operation];
  if (!Number.isFinite(rules.missingChance) || rules.missingChance < 0 || rules.missingChance > 1) throw new RangeError('Missing-number probability must be between 0 and 1.');
  if (operation === 'div' && rules.factorMin < 1) throw new RangeError('Divisors must be positive.');
  const missing = Math.random() < rules.missingChance;
  const multipliers = wholeNumberPool(rules.multiplierMin,rules.multiplierMax,rules.excludeTens).filter(value => !missing || value !== 0);
  if (!multipliers.length) throw new RangeError('A missing-factor or missing-divisor question needs a nonzero multiplier or quotient.');
  return {first:pick(wholeNumberPool(rules.factorMin,rules.factorMax,rules.excludeTens)),second:pick(multipliers),missing};
}
function genMul(level) {
  const {first,second,missing} = productOperands('mul',level);
  const hint = missing && second !== 0 ? `Find the factor: ${first * second} ÷ ${second}.` : first === 0 || second === 0 ? 'Anything × 0 is 0!' : first >= 10 ? `Break ${first} into ${parts(first).join(' + ')}. Multiply each part by ${second}, then add.` : `Use equal groups: ${first} groups of ${second}.`;
  if (missing && second !== 0) return {text:`? × ${second} = ${first * second}`,ans:first,hint,operands:[first,second],missing:true};
  return {text:`${first} × ${second} =`,ans:first * second,hint,operands:[first,second],missing:false};
}
function genDiv(level) {
  const {first:divisor,second:quotient,missing} = productOperands('div',level);
  if (missing && quotient !== 0) return {text:`${divisor * quotient} ÷ ? = ${quotient}`,ans:divisor,hint:`Find the divisor: ${divisor * quotient} ÷ ${quotient}.`,operands:[divisor,quotient],missing:true};
  return {text:`${divisor * quotient} ÷ ${divisor} =`,ans:quotient,hint:`Think: ${divisor} × ? = ${divisor * quotient}`,operands:[divisor,quotient],missing:false};
}
function fractionProblem(left, operator, right, denominator, answer, hint, visual = null) {
  const tokens = [left];
  if (operator) tokens.push(operator,right);
  tokens.push('=',{numerator:'?',denominator});
  const text = tokens.map(token => typeof token === 'string' ? token : `${token.numerator}/${token.denominator}`).join(' ');
  return {text,ans:answer,hint,fractionTokens:tokens,visual};
}
function genFraction(level) {
  const rules = mathLevel(level).rules.frac;
  if (!Array.isArray(rules.types) || !rules.types.length || rules.types.some(type => !['visual','equivalent','add','sub'].includes(type))) throw new RangeError('Choose supported fraction types: visual, equivalent, add, sub.');
  for (const bound of ['minDenominator','minNumerator']) if (rules[bound] !== undefined && (!Number.isInteger(rules[bound]) || rules[bound] < 0)) throw new RangeError('Fraction minimums must be nonnegative whole numbers.');
  const denominators = fractionChoices(rules.denominators,2,24,'denominators');
  const type = pick(rules.types);
  if (type === 'visual') {
    const denominator = pick(denominators), shaded = ri(1,denominator - 1);
    return {text:`Shaded part = ?/${denominator}`,ans:shaded,hint:`Count the shaded parts. The whole has ${denominator} equal parts.`,
      fractionTokens:['Shaded part','=',{numerator:'?',denominator}],visual:{shaded,denominator}};
  }
  if (type === 'equivalent') {
    const denominator = pick(denominators), numerator = ri(1,denominator - 1), factor = pick(fractionChoices(rules.factors,2,12,'equivalence factors'));
    return fractionProblem({numerator,denominator},null,null,denominator * factor,numerator * factor,
      `The denominator is multiplied by ${factor}. Multiply the numerator by ${factor} too: ${numerator} × ${factor}.`);
  }
  const pairs = [];
  for (const first of denominators) {
    const seconds = rules.relation === 'same' ? [first] : rules.relation === 'related' ? fractionChoices(rules.factors,2,12,'denominator factors').map(factor => first * factor) : rules.relation === 'unrelated' ? denominators.filter(second => first % second !== 0 && second % first !== 0) : [];
    for (const second of seconds) {
      const common = first / fractionGcd(first,second) * second;
      if (common >= (rules.minDenominator || 0)) pairs.push([first,second,common]);
    }
  }
  if (!pairs.length) throw new RangeError('No fraction pair satisfies the configured denominator rules.');
  for (let attempt = 0; attempt < 1000; attempt++) {
    let [firstDenominator,secondDenominator,denominator] = pick(pairs);
    const numerator = divisor => pick(wholeNumberPool(1,divisor - 1).filter(value => !rules.reducedOperands || fractionGcd(value,divisor) === 1));
    let first = numerator(firstDenominator), second = numerator(secondDenominator);
    if (type === 'sub' && first * secondDenominator < second * firstDenominator) {
      [first,second] = [second,first];[firstDenominator,secondDenominator] = [secondDenominator,firstDenominator];
    }
    const firstScaled = first * (denominator / firstDenominator), secondScaled = second * (denominator / secondDenominator);
    const answer = type === 'sub' ? firstScaled - secondScaled : firstScaled + secondScaled;
    if (answer < (rules.minNumerator || 0)) continue;
    if (rules.relation === 'same' && type === 'add' && answer > denominator) continue;
    const operator = type === 'sub' ? '−' : '+';
    return fractionProblem({numerator:first,denominator:firstDenominator},operator,{numerator:second,denominator:secondDenominator},denominator,answer,
      `Use ${denominator}ths: ${first}/${firstDenominator} = ${firstScaled}/${denominator} and ${second}/${secondDenominator} = ${secondScaled}/${denominator}. Then ${firstScaled} ${operator} ${secondScaled} = ?.`);
  }
  throw new RangeError('No fraction question satisfies the configured numerator rules.');
}
function fractionChoices(values, minimum, maximum, label) {
  if (!Array.isArray(values) || !values.length || values.some(value => !Number.isInteger(value) || value < minimum || value > maximum)) throw new RangeError(`Fraction ${label} must contain whole numbers from ${minimum} to ${maximum}.`);
  return [...new Set(values)];
}
function fractionGcd(first, second) {
  while (second) {const remainder = first % second;first = second;second = remainder;}
  return first;
}
const GEN = {add: genAdd, sub: genSub, mul: genMul, div: genDiv, frac: genFraction};

function makeRound(key, L) {
  const ops = key === 'mix'
    ? shuffle(['add', 'sub', 'mul', 'div'].flatMap(o => Array(5).fill(o)))
    : Array(GAMES[key].n).fill(key);
  const seen = new Set();
  return ops.map(o => {
    let p, signature;
    for (let i = 0; i < 50; i++) {
      p = GEN[o](L); signature = p.visual ? `${p.text}|${p.visual.shaded}` : p.text;
      if (!seen.has(signature)) break;
    }
    seen.add(signature);
    return Object.assign(p, {op: o, solved: false, tries: 0, last: ''});
  });
}

// ---------- home ----------
function renderHome() {
  const root = $('#home');
  root.replaceChildren();
  root.append(subjectBackBar('🧮 Math'));

  root.append(el('h2', {}, '1️⃣ Pick your level'), el('div', {class: 'levels'}, ...LEVELS.map((l, i) =>
    el('button', {class: 'card level' + (S.level === i + 1 ? ' sel' : ''), 'aria-pressed':String(S.level === i + 1),
      onclick: () => { S.level = i + 1; save(); renderHome(); $('#home .level.sel').focus(); }},
      el('div', {class: 'big'}, l.icon), el('b', {}, `Level ${i + 1}: ${l.name}`), el('small', {}, l.desc)))));

  const card = (icon, title, sub, color, fn) => el('button', {class: 'game', style: `background:${color};color:#fff`,
    onclick: fn}, el('span', {class: 'big'}, icon), el('b', {}, title), el('small', {}, sub));
  root.append(el('h2', {id:'mathGamesTitle'}, '2️⃣ Pick a game'), el('div', {class: 'games',id:'mathGames','aria-labelledby':'mathGamesTitle'},
    ...Object.entries(GAMES).map(([k, g]) => card(g.icon, g.title, g.sub, g.color, () => startGame(k)))),
    el('section', {'aria-labelledby':'mathFunFactsTitle'},el('h2', {id:'mathFunFactsTitle'}, 'Fun facts'),
      el('div', {class:'games',style:'grid-template-columns:repeat(auto-fill,minmax(210px,1fr))'},
        card('🔢', 'Times Table Explorer', 'Discover patterns', 'var(--tab)', openTables))));
}

// ---------- game ----------
function startGame(key) { navigate('math/' + key); }

function newRound() {
  stopTimer();
  const key = G.key, problems = makeRound(key,S.level);
  G = {key, L: S.level, mode: S.timer[key] || 'off', problems,recordKey:mathRecordKey(key,S.level),
    started: false, over: false, streak: 0, start: 0, tid: null, lastSec: null, limit:mathRoundSeconds(problems,S.level)};
  if (key === 'mix') {
    G.pic = ri(0, PICS.length - 1);
    G.owner = [];
    shuffle([...Array(100).keys()]).forEach((cell, pos) => { G.owner[cell] = Math.floor(pos / 5); });
  }
  renderGame();
}

function renderGame() {
  const g = GAMES[G.key], root = $('#game');
  root.replaceChildren();
  const lvl = el('select', {'aria-label': 'Level', onchange: e => { S.level = +e.target.value; save(); newRound(); }},
    ...LEVELS.map((l, i) => { const o = el('option', {value: i + 1}, `${l.icon} Level ${i + 1} · ${l.name}`); o.selected = i + 1 === G.L; return o; }));
  const seg = el('div', {class: 'seg', role: 'group', 'aria-label': 'Timer'},
    ...[['off', '🚫 No timer'], ['stopwatch', '⏱️ Stopwatch'], ['countdown', '⏳ Beat the Clock']].map(([m, t]) =>
      el('button', {class: m === G.mode ? 'on' : '', onclick: () => { S.timer[G.key] = m; save(); newRound(); }}, t)));
  const timer = el('div', {id: 'timer', class: 'timer'}, G.mode === 'stopwatch' ? '⏱️ 0:00' : '⏳ ' + fmt(G.limit));
  if (G.mode === 'off') timer.style.display = 'none';
  root.append(backBar(`${g.icon} ${g.title}`, g.color),
    el('div', {class: 'bar'}, lvl, seg, timer, el('div', {class: 'spacer'}),
      el('button', {class: 'btn', style: `background:${g.color}`, onclick: newRound}, '🔄 New Round')));
  root.append(el('p', {class:'quiet',id:'mathLevelRules'},G.key === 'mix' ? ['add','sub','mul','div'].map(operation => describeMathRule(operation,G.L)).join(' ') : describeMathRule(G.key,G.L)));

  const probs = el('div', {class: 'probs'});
  G.problems.forEach((p, i) => {
    const inp = el('input', {type: 'text', inputmode: 'numeric', autocomplete: 'off', maxlength: '6', 'aria-label': `Question ${i + 1}: ${p.text.replace('=', '')}. ${p.fractionTokens ? 'Missing number' : 'Answer'}`});
    inp.addEventListener('input', () => { inp.value = inp.value.replace(/\D/g, '').slice(0, 6); if (inp.value) startTimer(); });
    inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); check(i); } });
    inp.addEventListener('change', () => check(i));
    const hint = el('div', {class: 'hint'}, '💡 ' + p.hint);
    hint.hidden = true;
    p.inp = inp; p.hintEl = hint; p.mark = el('span', {class: 'mark'});
    const prompt = p.fractionTokens ? el('span', {class:'q fraction-q','aria-hidden':'true'},...p.fractionTokens.map(token => typeof token === 'string' ? el('span', {},token) :
      el('span', {class:'fraction-number'},el('span', {},token.numerator),el('span', {},token.denominator)))) : el('span', {class:'q'},p.text);
    p.card = el('div', {class: 'prob' + (p.fractionTokens ? ' fraction-prob' : '')},prompt,inp,p.mark,hint);
    if (p.visual) p.card.prepend(el('div', {class:'fraction-strip',style:`grid-template-columns:repeat(${p.visual.denominator},1fr)`,role:'img',
      'aria-label':`One whole divided into ${p.visual.denominator} equal parts; ${p.visual.shaded} are shaded.`},
      ...Array.from({length:p.visual.denominator},(_, part) => el('span', {class:part < p.visual.shaded ? 'shaded' : ''}))));
    probs.append(p.card);
  });

  const side = el('div', {class: 'side'},
    el('div', {class: 'card'}, el('div', {id: 'starsTxt', class: 'stars'}), el('div', {class: 'progress'}, el('div', {id: 'prog'})), el('div', {id: 'streak', class: 'streak'})),
    el('div', {class: 'card hello'}, el('div', {class: 'mascot', style: 'font-size:46px'}, '🦉'), el('div', {id: 'say', class: 'bubble', role: 'status'})),
    G.key === 'mix' ? el('div', {class: 'card'}, el('b', {id: 'picCap'}, '🖼️ Mystery picture! Every ⭐ reveals a piece.'),
      el('div', {class: 'pic', id: 'pic'}, ...Array.from({length: 100}, () => el('div')))) : null);
  root.append(el('div', {class: 'layout'}, probs, side));

  const tip = G.mode === 'countdown' ? `You have ${fmt(G.limit)}. The clock starts when you type! ⏳`
    : G.mode === 'stopwatch' ? 'The stopwatch starts when you type! ⏱️' : "Let's go! 🚀";
  say(`Hi ${nm()}! ${G.key === 'frac' ? 'Find the missing number for each ?. Enter the numerator using the denominator shown.' : 'Type each answer and press Enter.'} ${tip}`);
  updateScore();
  G.problems[0].inp.focus();
}

function say(msg) { const b = $('#say'); if (b) b.textContent = msg; }
function updateScore() {
  const n = G.problems.length, got = G.problems.filter(p => p.solved).length;
  $('#starsTxt').textContent = `⭐ ${got} / ${n}`;
  $('#prog').style.width = (got / n * 100) + '%';
  $('#streak').textContent = G.streak >= 3 ? `🔥 ${G.streak} in a row!` : '';
}

function startTimer() {
  if (!G || G.started || G.over) return;
  G.started = true; G.start = Date.now();
  if (G.mode !== 'off') G.tid = setInterval(tick, 200);
}
function stopTimer() { if (G && G.tid) { clearInterval(G.tid); G.tid = null; } }
function tick() {
  if (!G || G.over) return;
  const t = $('#timer'), s = (Date.now() - G.start) / 1000;
  if (G.mode === 'stopwatch') { t.textContent = '⏱️ ' + fmt(s); return; }
  const left = Math.max(0, G.limit - s), sec = Math.ceil(left);
  t.textContent = '⏳ ' + fmt(sec);
  t.classList.toggle('warn', left <= 10);
  if (sec <= 5 && sec > 0 && sec !== G.lastSec) SND.tick();
  G.lastSec = sec;
  if (left <= 0) finish(false);
}

function check(i) {
  if (!G || G.over) return;
  const p = G.problems[i], v = p.inp.value;
  if (p.solved || v === '' || v === p.last) return;
  p.last = v;
  startTimer();
  if (Number(v) === p.ans) {
    p.solved = true;
    p.card.classList.remove('bad'); p.card.classList.add('ok');
    p.mark.textContent = '⭐'; p.inp.readOnly = true;
    S.stars++;
    if (p.tries === 0) {
      G.streak++;
      S.bestStreak = Math.max(S.bestStreak || 0, G.streak);
      if (G.streak >= 10) award('streak');
    }
    SND.ok();
    BADGES.filter(b => b.stars && S.stars >= b.stars).forEach(b => award(b.id));
    if (G.key === 'mix') reveal(i);
    save(); updateHeader(); updateScore();
    if (G.problems.every(q => q.solved)) { finish(true); return; }
    const yay = pick(YAY);
    say(G.streak >= 3 ? `${yay} ${G.streak} in a row, ${nm()}! 🔥` : yay);
    focusNext(i);
  } else {
    p.tries++; G.streak = 0;
    p.card.classList.remove('bad'); void p.card.offsetWidth; p.card.classList.add('bad');
    p.mark.textContent = '🔁';
    SND.bad();
    if (p.tries >= 2) { p.hintEl.hidden = false; say(`Here's a hint, ${nm()}! Look under the problem 💡`); }
    else say(pick(OOPS));
    updateScore();
    p.inp.select();
  }
}
function focusNext(i) {
  const n = G.problems.length;
  for (let k = 1; k <= n; k++) {
    const q = G.problems[(i + k) % n];
    if (!q.solved) { q.inp.focus(); return; }
  }
}
function reveal(i) {
  const cells = $('#pic').children, rows = PICS[G.pic].rows;
  G.owner.forEach((o, c) => {
    if (o !== i) return;
    cells[c].style.background = PALETTE[+rows[Math.floor(c / 10)][c % 10]];
    cells[c].classList.add('on');
  });
  if (G.problems.every(q => q.solved)) $('#picCap').textContent = `🎉 It's ${PICS[G.pic].name}!`;
}

function award(id) {
  if (S.badges[id]) return;
  S.badges[id] = Date.now();
  const b = BADGES.find(x => x.id === id);
  toast(`🎖️ New badge: ${b.icon} ${b.name}!`);
  setTimeout(SND.badge, 350);
}

function finish(allDone) {
  if (!G || G.over) return;
  G.over = true; stopTimer();
  const secs = G.started ? (Date.now() - G.start) / 1000 : 0;
  const n = G.problems.length, got = G.problems.filter(p => p.solved).length;
  const perfect = allDone && G.problems.every(p => p.tries === 0);
  G.problems.forEach(p => {
    p.inp.readOnly = true;
    if (!p.solved) { p.card.classList.remove('bad'); p.card.classList.add('missed'); p.inp.value = p.ans; p.mark.textContent = '👀'; }
  });
  let bestLine = null;
  if (allDone) {
    S.done[G.key] = (S.done[G.key] || 0) + 1;
    if (perfect) award('perfect');
    if (G.key === 'mix') award('picture');
    if (G.L === 4) award('level4');
    if (['add', 'sub', 'mul', 'div'].every(k => S.done[k])) award('explorer');
    if (G.mode === 'countdown') award('clock');
    if (G.mode === 'stopwatch') {
      if (secs < (n > 10 ? 120 : 60)) award('speedy');
      const k = G.recordKey, prev = S.best[k];
      if (!prev || secs < prev) {
        S.best[k] = Math.round(secs * 10) / 10;
        bestLine = prev ? `🥇 New best time! (old best ${fmt(prev)})` : '🥇 Your first best time is saved!';
      } else bestLine = `Best time: ${fmt(prev)}`;
    }
    confetti(); SND.win();
  } else SND.bad();
  save();

  const title = perfect ? 'PERFECT! 🏆' : allDone ? 'You did it! 🎉' : "Time's up! ⏰";
  const msg = perfect ? `Wow, ${nm()}! No mistakes at all!`
    : allDone ? `Great job, ${nm()}! Every answer is correct.`
    : `Nice try, ${nm()}! The answers you missed are shown in gray.`;
  const kids = [el('h2', {}, title), el('div', {class: 'stars'}, `⭐ ${got} / ${n}`), el('p', {}, msg)];
  if (allDone && G.mode === 'stopwatch') kids.push(el('p', {}, `⏱️ Your time: ${fmt(secs)}`), el('p', {}, bestLine));
  if (allDone && G.mode === 'countdown') kids.push(el('p', {}, `⏳ Time left: ${fmt(G.limit - secs)}`));
  const btns = el('div', {class: 'row'});
  const ov = modal([...kids, btns]);
  const close = fn => () => { ov.remove(); fn(); };
  btns.append(el('button', {class: 'btn', style: 'background:#43a047', onclick: close(newRound)}, '🔄 Play again'));
  if (perfect && G.L < 4) btns.append(el('button', {class: 'btn', style: 'background:#fb8c00', onclick: close(() => { S.level = G.L + 1; save(); newRound(); })}, '⬆️ Level up!'));
  btns.append(el('button', {class: 'btn', onclick: close(goHome)}, '🏠 Home'));
  btns.append(el('button', {class: 'btn small', style: 'background:#90a4ae', onclick: () => ov.remove()}, '👀 Look at my answers'));
}

// ---------- times tables ----------
let TT = 7;
function renderTables() {
  const root = $('#tables');
  root.replaceChildren();
  root.append(backBar('🔢 Times Table Explorer', 'var(--tab)'),
    el('p', {style: 'font-size:18px;margin:0 0 10px'}, 'Pick a number to light up its times table. Tap any square to see the fact!'),
    el('div', {class: 'nums'}, ...Array.from({length: 12}, (_, i) =>
      el('button', {class: 'num' + (i + 1 === TT ? ' on' : ''), onclick: () => { TT = i + 1; renderTables(); }}, i + 1))));
  const fact = el('div', {class: 'fact'}, 'Tap a square!');
  const tbl = el('table', {class: 'tt'}, el('tr', {}, el('th', {}, '×'), ...Array.from({length: 12}, (_, c) => el('th', {}, c + 1))));
  for (let r = 1; r <= 12; r++) {
    const tr = el('tr', {}, el('th', {}, r));
    for (let c = 1; c <= 12; c++) {
      const cls = r === TT && c === TT ? 'x' : (r === TT || c === TT) ? 'hl' : '';
      tr.append(el('td', {class: cls}, el('button', {'aria-label':`${r} times ${c}`,onclick: () => { fact.textContent = `${r} × ${c} = ${r * c}`; SND.ok(); }}, r * c)));
    }
    tbl.append(tr);
  }
  root.append(el('div', {class: 'layout'},
    el('div', {class: 'card', style: 'overflow-x:auto'}, tbl),
    el('div', {class: 'card', style: 'text-align:center'}, fact, el('h3', {}, `The ${TT} times table`),
      ...Array.from({length: 12}, (_, i) => el('div', {class: 'ttrow'}, `${TT} × ${i + 1} = ${TT * (i + 1)}`)))),
    el('div', {class: 'card tips'}, ...TIPS.map(t => el('p', {}, t))));
}

// ---------- trophies ----------
function renderTrophies() {
  const root = $('#trophies');
  root.replaceChildren();
  const next = BADGES.find(b => b.stars && S.stars < b.stars);
  const prog = el('div', {class: 'progress'}, el('div', {style: `width:${next ? S.stars / next.stars * 100 : 100}%`}));
  root.append(backBar('🏆 My Trophies', '#f57f17'),
    el('div', {class: 'card hello'}, el('div', {class: 'mascot'}, '🦉'),
      el('div', {class: 'bubble'}, `${nm()}, you have collected ⭐ ${S.stars} stars!`, el('br'),
        next ? `Only ${next.stars - S.stars} more to unlock ${next.icon} ${next.name}!` : 'You unlocked every star badge! 🤩',
        el('br'), `Best streak: 🔥 ${S.bestStreak || 0} in a row`, prog)));

  root.append(el('h2', {}, `Badges (${Object.keys(S.badges).length} / ${BADGES.length})`),
    el('div', {class: 'badges'}, ...BADGES.map(b => el('div', {class: 'card badge' + (S.badges[b.id] ? '' : ' locked')},
      el('div', {class: 'big'}, b.icon), el('b', {}, b.name), el('small', {}, S.badges[b.id] ? '✅ ' + b.desc : '🔒 ' + b.desc)))));

  const head = el('tr', {}, el('th', {}, 'Game'), el('th', {}, 'Rounds finished'), ...LEVELS.map((l, i) => el('th', {}, `⏱️ Level ${i + 1}`)));
  const rows = Object.entries(GAMES).map(([k, g]) => el('tr', {}, el('td', {}, `${g.icon} ${g.title}`), el('td', {}, S.done[k] || 0),
    ...LEVELS.map((l, i) => el('td', {}, S.best[mathRecordKey(k,i + 1)] ? fmt(S.best[mathRecordKey(k,i + 1)]) : '—'))));
  root.append(el('h2', {}, 'Best stopwatch times'), el('div', {class: 'card', style: 'overflow-x:auto'}, el('table', {class: 'bt'}, head, ...rows)));
  const currentKeys = new Set(Object.keys(GAMES).flatMap(game => LEVELS.map((_,index) => mathRecordKey(game,index + 1))));
  const previous = Object.entries(S.best).filter(([key,time]) => !currentKeys.has(key) && /^(add|sub|mul|div|frac|mix)-[1-4](?:-r[0-9a-z]+)?$/.test(key) && Number.isFinite(time) && time >= 0);
  if (previous.length) root.append(el('details', {class:'card',style:'margin-top:20px'},el('summary', {}, 'Previous best times'),
    el('p', {}, 'These records were earned under earlier difficulty settings and are kept separately from current best times.'),
    ...previous.map(([key,time]) => {const [game,level] = key.split('-');return el('p', {}, `${GAMES[game].title} · Level ${level}: ${fmt(time)}`);} )));

  root.append(el('div', {class: 'row', style: 'margin-top:24px'}, el('button', {class: 'btn small', style: 'background:#b0bec5', onclick: () => {
    if (!confirm('Erase all stars, badges and best times on this device?')) return;
    S = Object.assign(defaults(), {name: S.name, level: S.level, sound: S.sound});
    save(); updateHeader(); renderTrophies();
  }}, '🗑️ Reset my progress')));
}


function mathMissionTasks() {
  return [
    question('Which fraction names the shaded part?', ['1/4','1/2','3/4'], 1, 'Two of four equal parts are shaded: 2/4 = 1/2.', ['Count all equal parts, then the shaded parts.', 'Two shaded parts out of four means 2/4. Simplify by grouping pairs.'], {visual:'fraction',context:'The whole is one bar, divided into four equal parts.'}),
    question('Which fraction is equivalent to 1/2?', ['2/3','2/4','1/4'], 1, 'Splitting each half into two equal pieces makes four pieces; two still cover half the same whole.', ['Equivalent fractions name the same amount of the same whole.', 'Multiply both the numerator and denominator of 1/2 by 2.']),
    question('For two same-sized wholes, which is greater: 1/3 or 1/6?', ['1/3','1/6','They are equal'], 0, 'Dividing the same whole into fewer equal parts makes each part larger, so 1/3 > 1/6.', ['Imagine sharing the same bar among 3 people or 6 people.', 'Each of 3 people gets more than each of 6 people.']),
    question('You walk 1/4 mile, then another 2/4 mile. How far is that?', ['3/8 mile','3/4 mile','2/4 mile'], 1, 'One quarter plus two quarters is three quarters. The pieces stay quarter-mile pieces.', ['The size of each part does not change when you count more parts.', 'Add the numerators: 1 + 2. Keep the denominator 4.']),
    question('A whole ribbon is cut into fourths. You use 3/4. What remains?', ['1/4','1/3','3/4'], 0, 'One whole is 4/4. Taking 3/4 leaves 1/4.', ['Rename one whole using fourths.', '4/4 minus 3/4 leaves one fourth.']),
    question('Kai says 1/2 of any pizza is more food than 1/3 of any other pizza. What must we check?', ['The sizes of the whole pizzas','Only the number of slices','Nothing; Kai is always right'], 0, 'Fraction comparisons by numerator and denominator alone assume equal-sized wholes. A third of a huge pizza can exceed half of a tiny one.', ['Does a fraction tell you the physical size of the whole?', 'Compare the pizza sizes before comparing the portions.']),
    question('Stretch: What is 1/2 + 1/4?', ['2/6','3/4','2/4'], 1, 'Rename 1/2 as 2/4. Then 2/4 + 1/4 = 3/4.', ['Use equal-sized pieces before adding.', 'Half is two fourths. Add one more fourth.']),
    question('Stretch: Which fraction lies between 1/2 and 3/4?', ['1/4','5/8','7/8'], 1, 'In eighths, 1/2 = 4/8 and 3/4 = 6/8. Five eighths is between them.', ['Rename the bounds using eighths.', 'Look for a numerator between 4 and 6.']),
  ];
}
