'use strict';
// ---------- storage (this device only) ----------
function defaults() {
  return {name: '', level: 1, sound: true, timer: {}, stars: 0, petEarned: 0, best: {}, badges: {}, done: {}, bestStreak: 0, recentJokes: []};
}
let mathStorageAvailable = true;
function load() {
  const s = defaults();
  let saved;
  try {
    saved = JSON.parse(localStorage.getItem(KEY));
    if (saved && typeof saved === 'object') Object.assign(s, saved);
  } catch (e) { mathStorageAvailable = false; }
  for (const k of ['timer', 'best', 'badges', 'done']) if (!s[k] || typeof s[k] !== 'object') s[k] = {};
  s.recentJokes = Array.isArray(s.recentJokes) ? s.recentJokes.filter(joke => typeof joke === 'string').slice(-20) : [];
  s.level = Math.min(4, Math.max(1, parseInt(s.level, 10) || 1));
  s.name = String(s.name || '').slice(0, 20);
  s.stars = Number(s.stars) || 0;
  if (!saved || !Object.hasOwn(saved,'petEarned')) s.petEarned = Number.isSafeInteger(s.stars) && s.stars >= 0 ? s.stars : 0;
  else if (!Number.isSafeInteger(s.petEarned) || s.petEarned < 0) {s.petEarned = 0; mathStorageAvailable = false;}
  return s;
}
let S = load();
function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { mathStorageAvailable = false; reportStorageFailure(); } }
const nm = () => S.name || 'Math Star';

// ---------- helpers ----------
const $ = s => document.querySelector(s);
const ri = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
const pick = a => a[Math.floor(Math.random() * a.length)];
const shuffle = a => { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
function pickJoke() {
  const recent = new Set(S.recentJokes);
  const available = JOKES.filter(joke => !recent.has(joke));
  const joke = pick(available.length ? available : JOKES);
  S.recentJokes = [...S.recentJokes, joke].slice(-20);
  save();
  return joke;
}
const fmt = s => { s = Math.max(0, Math.floor(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };
function el(tag, props = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(props)) {
    if (k === 'class') e.className = v;
    else if (k === 'style') e.style.cssText = v;
    else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v);
  }
  for (const c of kids.flat()) if (c != null && c !== false) e.append(c.nodeType ? c : String(c));
  return e;
}
function toast(msg) { const t = el('div', {class: 'toast', role: 'status'}, msg); document.body.append(t); setTimeout(() => t.remove(), 3000); }
function modal(children) {
  const previous = document.activeElement;
  const dialog = el('div', {class: 'modal card', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Round results', tabindex: '-1'}, ...children);
  const ov = el('div', {class: 'overlay'}, dialog);
  ov.addEventListener('keydown', event => {
    if (event.key === 'Escape') { ov.remove(); if (previous?.isConnected) previous.focus(); }
    if (event.key !== 'Tab') return;
    const buttons = [...dialog.querySelectorAll('button:not(:disabled)')];
    const first = buttons[0], last = buttons[buttons.length - 1];
    if (!first) { event.preventDefault(); return; }
    if (event.shiftKey && (document.activeElement === first || document.activeElement === dialog)) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialog)) { event.preventDefault(); first.focus(); }
  });
  document.body.append(ov); dialog.focus(); return ov;
}

// ---------- sound (generated, no files) ----------
let actx = null;
function tone(freqs, dur = 0.12, type = 'sine', gap = 0.1) {
  if (!S.sound) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    freqs.forEach((f, i) => {
      const o = actx.createOscillator(), g = actx.createGain(), t = actx.currentTime + i * gap;
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.2, t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur + 0.02);
    });
  } catch (e) { /* audio not supported */ }
}
const SND = {
  ok: () => tone([660, 880]),
  bad: () => tone([220, 180], 0.15, 'triangle'),
  win: () => tone([523, 659, 784, 1047], 0.2, 'sine', 0.12),
  tick: () => tone([1000], 0.05, 'square'),
  badge: () => tone([784, 988, 1175], 0.15),
};

// ---------- confetti ----------
function confetti() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const c = $('#confetti'), x = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const cols = ['#e53935','#fb8c00','#fdd835','#43a047','#1e88e5','#8e24aa','#ec407a'];
  const ps = Array.from({length: 160}, () => ({x: Math.random() * c.width, y: -20 - Math.random() * c.height * 0.5,
    vx: (Math.random() - 0.5) * 4, vy: 2 + Math.random() * 4, s: 6 + Math.random() * 6, r: Math.random() * 6, vr: (Math.random() - 0.5) * 0.3, c: pick(cols)}));
  const end = Date.now() + 3500;
  (function frame() {
    x.clearRect(0, 0, c.width, c.height);
    for (const p of ps) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.05; p.r += p.vr;
      x.save(); x.translate(p.x, p.y); x.rotate(p.r); x.fillStyle = p.c; x.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); x.restore();
    }
    if (Date.now() < end) requestAnimationFrame(frame); else x.clearRect(0, 0, c.width, c.height);
  })();
}

// ---------- navigation ----------
let G = null;
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.toggle('active', s.id === id));
  $('#sources').hidden = id !== 'subjectPicker';
  window.scrollTo(0, 0);
}
function leaveGame() { stopTimer(); G = null; M = null; if (typeof ScienceSubject !== 'undefined') ScienceSubject.stop(); if (typeof EnglishSubject !== 'undefined') EnglishSubject.stop(); if (typeof CodingSubject !== 'undefined') CodingSubject.stop(); }
function navigate(path) {
  if (location.hash === '#' + path) route();
  else location.hash = path;
}
function goHome() { navigate('math'); }
function openTables() { navigate('math/tables'); }
function openTrophies() { navigate('math/trophies'); }
function route() {
  leaveGame();
  document.querySelectorAll('.overlay,.toast').forEach(overlay => overlay.remove());
  let path = location.hash.slice(1) || 'subjects';
  const subjectId = path.split('/')[0];
  if (Object.hasOwn(SUBJECTS, subjectId) && !AVAILABLE_SUBJECTS.includes(subjectId)) {
    history.replaceState(null, '', '#subjects'); path = 'subjects';
  }
  if (path === 'math/mission') {history.replaceState(null, '', '#math/frac');path = 'math/frac';}
  updateHeader();
  if (path !== 'pet' && typeof Pet !== 'undefined') Pet.handleRoute(path);
  if (path === 'pet') {
    if (typeof Pet !== 'undefined') Pet.handleRoute(path);
    else { $('#pet').replaceChildren(subjectBackBar('Pet home'),el('p', {},'The pet home could not load. Reload the page to try again.'));show('pet');focusHeading(); }
    return;
  }
  if (path === 'english' || path.startsWith('english/')) {
    if (typeof EnglishSubject !== 'undefined') {
      if (!EnglishSubject.handleRoute(path)) { history.replaceState(null, '', '#english'); EnglishSubject.handleRoute('english'); }
    } else {
      $('#subject').replaceChildren(subjectBackBar('English'),el('p', {}, 'English could not load. Reload the page to try again, or choose another subject.'));
      show('subject');focusHeading();
    }
    return;
  }
  if (path === 'science' || path.startsWith('science/')) {
    if (typeof ScienceSubject !== 'undefined') {
      if (!ScienceSubject.handleRoute(path)) { history.replaceState(null, '', '#science'); ScienceSubject.handleRoute('science'); }
    } else {
      $('#subject').replaceChildren(subjectBackBar('Science'),el('p', {}, 'Science could not load. Reload the page to try again, or choose Math.'));
      show('subject');focusHeading();
    }
    return;
  }
  if (path === 'coding' || path.startsWith('coding/')) {
    if (typeof CodingSubject !== 'undefined') {
      if (!CodingSubject.handleRoute(path)) { history.replaceState(null, '', '#coding'); CodingSubject.handleRoute('coding'); }
    } else {
      $('#subject').replaceChildren(subjectBackBar('Computer Science'),el('p', {}, 'Computer Science could not load. Reload the page to try again.'));
      show('subject');focusHeading();
    }
    return;
  }
  if (path === 'math') { renderHome(); show('home'); }
  else if (path === 'math/tables') { renderTables(); show('tables'); }
  else if (path === 'math/trophies') { renderTrophies(); show('trophies'); }
  else if (path.startsWith('math/') && Object.hasOwn(GAMES, path.slice(5))) {
    G = {key: path.slice(5)}; show('game'); newRound();
  } else if (Object.hasOwn(SUBJECTS, path)) {
    renderSubject(path); show('subject'); focusHeading();
  } else if (path.endsWith('/mission') && Object.hasOwn(SUBJECTS, path.split('/')[0])) {
    beginMission(path.split('/')[0]);
  } else if (path.endsWith('/results') && Object.hasOwn(SUBJECTS, path.split('/')[0])) {
    renderMissionResults(path.split('/')[0]); show('mission'); focusHeading();
  } else {
    if (!['subjects', 'sources'].includes(path)) history.replaceState(null, '', '#subjects');
    renderSubjects(); show('subjectPicker'); focusHeading();
    if (path === 'sources') { $('#sources').scrollIntoView(); $('#sources h2').setAttribute('tabindex', '-1'); $('#sources h2').focus({preventScroll: true}); }
  }
}
function renderSubjects() {
  const root = $('#subjectPicker');
  root.replaceChildren(el('div', {class: 'subject-intro'}, el('div', {},
    el('div', {class: 'eyebrow'}, 'Grades 3–5 · Explore / Practice / Discover'),
    el('h1', {}, S.name ? `Where to next, ${S.name}?` : 'Choose your next adventure'),
    el('p', {}, 'A new question. A little persistence. A discovery that is yours.'))));
  root.append(renderGreeting());
  if (typeof ScienceSubject !== 'undefined' && !$('#scienceLandingReferences')) $('#sources').append(ScienceSubject.landingReferences());
  const grid = el('div', {class: 'subject-grid available-subjects'});
  const comingSoon = el('section', {class: 'coming-soon-section', 'aria-labelledby': 'comingSoonTitle'},
    el('h2', {id: 'comingSoonTitle'}, 'Coming Soon...'));
  const previews = el('div', {class: 'subject-grid'});
  Object.entries(SUBJECTS).forEach(([id, subject]) => {
    const latest = P.results[id];
    if (!AVAILABLE_SUBJECTS.includes(id)) {
      previews.append(el('article', {class: 'subject-tile coming-soon', style: `--accent:${subject.color}`},
        subjectArt(id), el('div', {class: 'subject-copy'}, el('h3', {}, `${subject.icon} ${subject.title}`),
          el('small', {}, subject.tagline), el('small', {class: 'quiet'}, 'Coming soon'))));
      return;
    }
    grid.append(el('button', {class: 'subject-tile', style: `--accent:${subject.color}`, onclick: () => navigate(id)},
      subjectArt(id), el('span', {class: 'subject-copy'}, el('b', {}, `${subject.icon} ${subject.title}`),
        el('small', {}, subject.tagline), el('small', {class: 'tile-action'}, latest ? 'Return to subject →' : 'Explore →'))));
  });
  comingSoon.append(previews);
  root.append(grid, comingSoon, el('div', {class: 'row', style: 'justify-content:flex-start;margin-top:24px'},
    el('a', {href: '#sources'}, 'Sources & Learning References'),
    el('span', {class: 'quiet'}, `${AVAILABLE_SUBJECTS.filter(id => P.results[id] || (id === 'math' && Object.values(S.done).some(Boolean)) || (id === 'english' && typeof EnglishSubject !== 'undefined' && Object.values(EnglishSubject.state?.done || {}).some(Boolean)) || (id === 'science' && typeof ScienceSubject !== 'undefined' && Object.values(ScienceSubject.state?.done || {}).some(Boolean)) || (id === 'coding' && typeof CodingSubject !== 'undefined' && Object.values(CodingSubject.state?.done || {}).some(Boolean))).length} of ${AVAILABLE_SUBJECTS.length} subjects explored`)));
}
function renderGreeting() {
  let bubble;
  if (!S.name) {
    const input = el('input', {class:'name',maxlength:'20',placeholder:'Your name','aria-label':'Your name'});
    const submit = () => {
      const name = input.value.trim().slice(0,20);
      if (!name) {toast('Type your name first 🙂');input.focus();return;}
      S.name = name;save();SND.ok();renderSubjects();focusHeading();
    };
    input.addEventListener('keydown', event => {if (event.key === 'Enter') {event.preventDefault();submit();}});
    bubble = el('div', {class:'bubble'}, "Hi! I'm Ollie the Owl. What's your name?",
      el('div', {class:'row'},input,el('button', {class:'btn',style:'background:#43a047',onclick:submit}, "Let's play! 🚀")));
  } else {
    const joke = el('div', {style:'margin-top:8px;font-size:17px;color:#6a1b9a',role:'status'});
    bubble = el('div', {class:'bubble'}, `Hi ${nm()}! Ready to earn some stars today? ⭐`,joke,
      el('div', {class:'row'},
        el('button', {class:'btn small',style:'background:#7e57c2',onclick:() => {joke.textContent = pickJoke();}}, '😂 Tell me a joke'),
        el('button', {class:'btn small',style:'background:#90a4ae',onclick:() => {S.name = '';save();renderSubjects();$('#subjectPicker input.name').focus();}}, '✏️ Change name')));
  }
  return el('section', {id:'learnerGreeting',class:'card hello','aria-label':'Your playground profile'},el('div', {class:'mascot','aria-hidden':'true'}, '🦉'),bubble);
}
function updateHeader() {
  const path = location.hash.slice(1);
  const science = path === 'science' || path.startsWith('science/');
  const english = path === 'english' || path.startsWith('english/');
  const coding = path === 'coding' || path.startsWith('coding/');
  const available = typeof Pet !== 'undefined' ? Pet.availableStars : null;
  $('#hdrStars').textContent = available === null ? '⭐ Stars unavailable' : `⭐ ${available} available`;
  $('#btnSound').textContent = S.sound ? '🔊' : '🔇';
  $('#btnSound').setAttribute('aria-label', S.sound ? 'Mute sound' : 'Enable sound');
  $('#btnSound').setAttribute('aria-pressed', String(S.sound));
  $('#btnTro').setAttribute('aria-label', coding ? 'Computer Science records' : english ? 'English trophies' : science ? 'Science trophies' : 'Math trophies');
}
function backBar(title, color) {
  return el('div', {class: 'bar'}, el('button', {class: 'btn small', onclick: goHome}, '🏠 Home'), el('h1', {style: `color:${color}`}, title));
}

const SUBJECTS = {
  math: {title: 'Math', icon: '🧮', color: '#236e59', tagline: 'Build fractions. Find patterns. Make it add up.', mission: GAMES.frac.title, objective: 'Use equal parts to compare and combine fractions.', reference: 1},
  english: {title: 'English', icon: '📖', color: '#ae3e63', tagline: 'Read between the lines. Give your words purpose.', mission: 'The Garden Mystery', objective: 'Use details as evidence, infer meaning, and organize an explanation.', reference: 2},
  science: {title: 'Science', icon: '🔬', color: '#007b83', tagline: 'Make a prediction. Follow the evidence.', mission: 'The Ramp Investigation', objective: 'Use a fair test and repeated observations to support a conclusion.', reference: 0},
  social: {title: 'Social Studies', icon: '🗺️', color: '#98631a', tagline: 'Explore a place. Compare voices. Make a case.', mission: 'A Town for Everyone', objective: 'Read a map and compare sources before making a community recommendation.', reference: 3},
  coding: {title: 'Computer Science', icon: '🤖', color: '#4e609e', tagline: 'Think in steps. Test an idea. Fix the bug.', mission: 'Robot Delivery', objective: 'Trace, debug, and test a sequence of instructions.', reference: 4},
};
const AVAILABLE_SUBJECTS = ['math', 'english', 'science', 'coding'];
const PROGRESS_KEY = 'learningPlayground.missions.v1';
let storageAvailable = mathStorageAvailable;
function readProgress() {
  const progress = {version: 1, modes: {}, results: {}};
  try {
    const saved = JSON.parse(localStorage.getItem(PROGRESS_KEY));
    if (saved?.version === 1) {
      for (const id of Object.keys(SUBJECTS)) {
        if (['support', 'core', 'stretch'].includes(saved.modes?.[id])) progress.modes[id] = saved.modes[id];
        const result = saved.results?.[id];
        if (result && Number.isInteger(result.total) && result.total > 0 && result.total <= 12 &&
            ['independent', 'supported', 'reflections'].every(key => Number.isInteger(result[key]) && result[key] >= 0) &&
            result.independent + result.supported + result.reflections === result.total &&
            ['support', 'core', 'stretch'].includes(result.mode) && Number.isFinite(result.date)) progress.results[id] = result;
      }
    }
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
  } catch { storageAvailable = false; }
  return progress;
}
const P = readProgress();
let M = null;
function saveProgress() {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(P)); }
  catch { storageAvailable = false; }
  $('#storageNote').textContent = storageAvailable ? '' : 'Saving is unavailable. You can still play; progress may disappear when you leave.';
}
function reportStorageFailure() { storageAvailable = false; saveProgress(); }
function petEarnings() {
  if (!storageAvailable || !mathStorageAvailable || typeof EnglishSubject === 'undefined' || typeof ScienceSubject === 'undefined' || typeof CodingSubject === 'undefined') return null;
  const amounts = [S.petEarned,EnglishSubject.state?.petEarned,ScienceSubject.state?.petEarned,CodingSubject.state?.petEarned];
  if (amounts.some(value => !Number.isSafeInteger(value) || value < 0)) return null;
  const total = amounts.reduce((sum,value) => sum + value,0);
  return Number.isSafeInteger(total) ? total : null;
}
function focusHeading() {
  const heading = document.querySelector('.screen.active h1');
  if (heading) { heading.tabIndex = -1; heading.focus({preventScroll: true}); }
}
function subjectBackBar(title) {
  return el('div', {class: 'bar'}, el('button', {class: 'btn small', onclick: () => navigate('subjects')}, '← Subjects'), el('h1', {}, title));
}
function activityArt() {
  return el('img', {class:'activity-art',src:'activity-adventure.svg',alt:'',width:'720',height:'200'});
}
function subjectArt(id) {
  const canvas = el('canvas', {class: 'subject-art', width: '720', height: '300', 'aria-hidden': 'true'});
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;
  ctx.scale(2, 2);
  ctx.fillStyle = {math:'#e4f2dc',science:'#daf1f0',english:'#fbe6e9',social:'#fff0cc',coding:'#e7ebfa'}[id];
  ctx.fillRect(0, 0, 360, 150);
  ctx.strokeStyle = '#ffffff88'; ctx.lineWidth = 1;
  for (let column = 0; column < 360; column += 24) { ctx.beginPath(); ctx.moveTo(column, 0); ctx.lineTo(column, 150); ctx.stroke(); }
  ctx.fillStyle = SUBJECTS[id].color; ctx.font = 'bold 18px Trebuchet MS';
  if (id === 'math') {
    [2, 4, 8].forEach((denominator, row) => {
      for (let part = 0; part < denominator; part++) {
        ctx.fillStyle = part < denominator / 2 ? '#236e59' : '#fff';
        ctx.fillRect(35 + part * 240 / denominator, 22 + row * 38, 240 / denominator - 3, 26);
      }
    });
    ctx.fillStyle = '#236e59'; ctx.fillText('=', 295, 77);
  } else if (id === 'science') {
    ctx.fillText('Three trials. One question.', 30, 30);
    [31, 32, 30, 60, 62, 61].forEach((value, index) => {
      ctx.fillStyle = index < 3 ? '#007b83' : '#d47836';
      ctx.fillRect(38 + index * 46, 130 - value, 28, value);
    });
    ctx.strokeStyle = '#37474f'; ctx.beginPath(); ctx.moveTo(28, 132); ctx.lineTo(326, 132); ctx.stroke();
  } else if (id === 'english') {
    ctx.fillStyle = '#fff'; ctx.fillRect(37, 20, 138, 112); ctx.fillRect(179, 20, 138, 112);
    ctx.fillStyle = '#ae3e63'; ctx.fillRect(56, 45, 93, 10); ctx.fillStyle = '#efc664'; ctx.fillRect(196, 74, 99, 14);
    ctx.fillStyle = '#89968c';
    for (let line = 0; line < 5; line++) { ctx.fillRect(56, 65 + line * 10, 95 - line * 5, 3); ctx.fillRect(196, 42 + line * 12, 98, 3); }
  } else if (id === 'social') {
    ctx.fillStyle = '#c4dfbc'; ctx.fillRect(37, 20, 270, 110);
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 10;
    [80, 145, 210, 275].forEach(column => { ctx.beginPath(); ctx.moveTo(column, 20); ctx.lineTo(column, 130); ctx.stroke(); });
    ctx.beginPath(); ctx.moveTo(37, 74); ctx.lineTo(307, 74); ctx.stroke();
    ctx.fillStyle = '#98631a'; ctx.fillRect(105, 37, 22, 22); ctx.fillStyle = '#ae3e63'; ctx.fillRect(235, 90, 22, 22);
    ctx.fillStyle = '#37474f'; ctx.fillText('N ↑', 313, 29);
  } else {
    for (let row = 0; row < 3; row++) for (let column = 0; column < 5; column++) { ctx.fillStyle = '#fff'; ctx.fillRect(70 + column * 44, 13 + row * 42, 38, 36); }
    ctx.fillStyle = '#4e609e'; ctx.fillRect(78, 105, 22, 18); ctx.fillStyle = '#fff'; ctx.fillRect(82, 109, 4, 4); ctx.fillRect(92, 109, 4, 4);
    ctx.strokeStyle = '#d47836'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(90, 95); ctx.lineTo(90, 30); ctx.lineTo(260, 30); ctx.stroke();
    ctx.fillStyle = '#d47836'; ctx.fillText('★', 251, 37);
  }
  return canvas;
}
function missionLauncher(id) {
  const subject = SUBJECTS[id], mode = P.modes[id] || 'core';
  const root = el('div', {class: 'mission-launch'}, el('div', {class: 'eyebrow'}, 'Starter mission · Grades 3–5 · Untimed'),
    el('h2', {}, subject.mission), el('p', {}, subject.objective));
  const segments = el('div', {class: 'seg', role: 'group', 'aria-label': 'Challenge mode'});
  [['support','Support'],['core','Core'],['stretch','Stretch']].forEach(([value, label]) => {
    segments.append(el('button', {class: mode === value ? 'on' : '', 'aria-pressed': String(mode === value), onclick: event => {
      P.modes[id] = value; saveProgress();
      [...segments.children].forEach(button => { const selected = button === event.currentTarget; button.classList.toggle('on', selected); button.setAttribute('aria-pressed', String(selected)); });
      note.textContent = modeDescription(value);
    }}, label));
  });
  const note = el('p', {class: 'quiet', role: 'status'}, modeDescription(mode));
  root.append(el('div', {class: 'row'}, segments,
    el('button', {class: 'btn', style: `background:${subject.color}`, onclick: () => navigate(id + '/mission')}, 'Start mission →')), note);
  const previous = P.results[id];
  if (previous) root.append(el('a', {href: '#' + id + '/results'}, 'View last mission results'));
  return root;
}
function modeDescription(mode) {
  return {support:'A worked example and a hint at each step.', core:'Six steps, with hints whenever you need them.', stretch:'Six core steps plus two deeper challenges.'}[mode];
}
function renderSubject(id) {
  const subject = SUBJECTS[id];
  $('#subject').replaceChildren(subjectBackBar(`${subject.icon} ${subject.title}`),
    el('div', {class: 'subject-intro'}, el('div', {}, el('h2', {}, subject.tagline), el('p', {}, subject.objective)), subjectArt(id)),
    missionLauncher(id));
}
function question(prompt, options, answer, explanation, hints, extra = {}) {
  return {type: 'choice', prompt, options, answer, explanation, hints, ...extra};
}
function missionTasks(id) {
  if (id === 'math') return mathMissionTasks();
  if (id === 'english') return [
    question('Which statement best captures the main idea?', ['Maya investigates why one garden bed is dry and fixes the water supply','Maya decides that every plant needs shade','A class measures the tallest sunflower'], 0, 'The problem, investigation, repair, and result all concern water reaching the dry bed.', ['Look for an idea that connects the beginning, middle, and end.', 'The central problem is the dry garden bed.']),
    question('Why does Maya suspect the hose rather than too much sunlight?', ['Both beds get the same sunlight, but one hose has a bend','The sunny bed has no plants','The passage says sunlight never matters'], 0, 'Equal sunlight makes it a less useful explanation for the difference; the bent hose is a specific clue.', ['Compare what is the same and what is different between the beds.', 'Both beds receive six hours of sun. Only one hose is bent.']),
    question('Which detail best supports the conclusion that the bend limited water flow?', ['After Maya straightens the hose, water reaches the dry soil','Maya carries a notebook','Both beds contain bean plants'], 0, 'The change in water flow after the repair directly connects the bend to the water problem.', ['Find the detail linking an action to an observed result.', 'What happens immediately after the hose is straightened?']),
    question('What does “restore” mean in the last paragraph?', ['Bring back','Write down','Hide away'], 0, 'The soil was damp before the problem. Restore means bring that earlier condition back.', ['Use the before-and-after events as context.', 'Water returns to the bed after the repair.']),
    {type:'order',prompt:'Put the explanation in a logical order.',sentences:['She straightened the bent hose.','The soil in one bed was dry.','Water reached the bed again.'],order:[1,0,2],explanation:'First state the problem, then the action, then the result.',hints:['Start with the problem.', 'Dry soil comes before the repair; returning water comes after.']},
    {type:'reflection',prompt:'Explain why Maya checks the beds again the next day.',rubric:['I state an inference about why she checks again.','I connect my inference to a detail in the passage.'],example:'Maya wants to see whether the repair keeps working. The next day, the soil is still damp, which supports that the water supply has been restored.',explanation:'A supported inference combines your reasoning with a relevant detail. Different wording can make the same strong connection.',hints:['Think about the difference between a quick fix and a lasting fix.', 'Use the next-day damp soil as evidence.']},
    question('Stretch: Which sentence would weaken the hose explanation most?', ['Water flowed equally well through the bent hose before the repair','Maya wrote the date in her notebook','Both beds had the same number of plants'], 0, 'If flow was already equal before repair, the bend would be a weaker explanation for the difference.', ['Ask which new fact challenges the proposed cause.', 'The explanation depends on the bend reducing flow.']),
    {type:'reflection',prompt:'Write a two-sentence summary without adding facts.',rubric:['I name the garden problem and Maya’s investigation.','I include the repair and outcome, without inventing events.'],example:'Maya compared two garden beds and found a bent hose leading to the dry bed. After she straightened it, water reached the soil and the bed stayed damp the next day.',explanation:'A summary keeps the central events and omits minor details. Many summaries can be accurate.',hints:['Keep only the problem, investigation, action, and outcome.', 'Do not add weather, other characters, or events that are not in the passage.']},
  ];
  if (id === 'social') return [
    question('Which direction is the school from the library?', ['East','West','South'], 0, 'North is up on this map. The school is to the right of the library, so it is east.', ['Use the north arrow to orient the map.', 'On this map, right is east.'], {visual:'map'}),
    question('Which direction is the park from the school?', ['Southwest','Northeast','Due east'], 0, 'The park is below and left of the school: south and west.', ['Find the school first, then compare the park’s position.', 'Below is south; left is west.'], {visual:'map'}),
    question('What can the survey of 20 park visitors tell us directly?', ['What those 20 visitors said they preferred','What every resident wants','What the town must legally build'], 0, 'A survey describes its respondents. Twenty park visitors do not automatically represent all residents.', ['Who was actually asked?', 'The survey did not include everyone in town.'], {visual:'sources'}),
    question('Which is a fact reported in the source notes rather than a preference?', ['The survey included 20 park visitors','A garden is the best possible choice','Basketball is more enjoyable than gardening'], 0, 'The number of respondents is a reported, checkable detail. “Best” and “more enjoyable” express judgments.', ['Separate statements we can check from opinions.', 'Look for the count recorded in the survey notes.'], {visual:'sources'}),
    question('What would best broaden the town’s evidence?', ['Ask residents who do not currently visit the park','Ask the same person twenty more times','Ignore all opinions that disagree'], 0, 'People who do not visit the park may have needs the current visitor survey missed.', ['Consider whose perspective is absent.', 'Current park visitors are not the only people who live in town.'], {visual:'sources'}),
    {type:'reflection',visual:'sources',prompt:'Recommend either a garden or a basketball court. Support your recommendation and name a limitation of the evidence.',rubric:['I make a clear recommendation.','I use a specific source detail.','I name a missing perspective or uncertainty.'],example:'I recommend a garden because 12 of the 20 visitors preferred it. But the survey only asked current park visitors; the town should also ask non-visitors before deciding. A court recommendation can also be supported using the student letter and an honest discussion of its limits.',explanation:'There is no single required choice. Reasoning, evidence, and acknowledging limits matter more than picking the most popular answer.',hints:['Either choice can be defended. Name which source supports yours.', 'Explain why one survey or one letter is not the whole community.']},
    question('Stretch: Why might the student letter and visitor survey favor different choices?', ['They include different people and purposes','One must be a lie because they disagree','A letter is always more accurate than a survey'], 0, 'Different groups can have different needs. Compare who contributed and why instead of dismissing disagreement.', ['Check who contributed to each source.', 'A student’s request and a visitor poll need not reflect identical groups.'], {visual:'sources'}),
    {type:'reflection',visual:'sources',prompt:'Suggest a next step that fairly considers both proposals.',rubric:['I include a way to hear from more residents.','I identify information needed before spending money.'],example:'Hold an accessible meeting and offer a survey for visitors and non-visitors. Compare costs, space, and accessibility for both proposals before deciding.',explanation:'A fair process can gather broader views and investigate practical constraints without assuming one group speaks for everyone.',hints:['Think about both participation and practical information.', 'Costs and space are not provided in the current sources.']},
  ];
  return [
    question('A robot follows North, East, East. What order does it use?', ['The order the commands are written','Whichever move is shortest','All moves at once'], 0, 'A sequence runs one instruction after another in the specified order.', ['An algorithm gives ordered steps.', 'The first written command happens first.']),
    question('A robot must move three squares north. Which loop matches that?', ['Repeat North 3 times','North, then repeat East 3 times','Repeat North 2 times'], 0, 'Repeating the North instruction three times gives three northward moves.', ['Count the intended moves, not the number of words.', 'North + North + North is three repetitions.']),
    question('A robot goes East instead of North on its second move. What should you inspect first?', ['The second command','Only the last command','The color of the goal'], 0, 'Trace the program and inspect the first point where the behavior differs from the intended steps.', ['Find where expected and actual behavior first differ.', 'The first unexpected move is move two.']),
    question('Which instruction is most precise for this grid robot?', ['Move one square east','Go somewhere nice','Move a little'], 0, 'A grid instruction needs a specific direction and distance, so its effect is unambiguous.', ['Would different readers interpret the instruction the same way?', 'Name a direction and a number of squares.']),
    {type:'robot',prompt:'Deliver the robot to the star without entering a blocked square.',explanation:'Your program reached the goal without crossing a wall or leaving the grid. More than one route can work.',hints:['One safe route follows the left edge north, then the top edge east.', 'Try North, North, North, East, East, East.']},
    question('Why test a program after changing a command?', ['To check that the change solves the problem without causing another','A changed program is always correct','Testing removes the need to think'], 0, 'A fix may solve one problem but introduce another. Running or tracing the program checks its behavior.', ['Changing code is not proof that it behaves as intended.', 'Compare the actual outcome with the goal.']),
    question('Stretch: Two different programs reach the star safely. Which statement is true?', ['Both can be correct even if one uses more moves','Only the first program can be correct','The longer program must contain an error'], 0, 'Correctness means meeting the goal and constraints. Efficiency is a separate property.', ['Separate a valid solution from an efficient solution.', 'If both meet all required conditions, both are valid.']),
    question('Stretch: Why can “repeat North 3 times” be easier to maintain than three separate North commands?', ['One repeat count controls the repeated movement','It lets the robot ignore walls','Loops can never contain mistakes'], 0, 'A loop expresses a repeated pattern in one place. It still needs correct bounds and testing.', ['Think about changing the intended distance from three to four.', 'Changing one count can replace editing several repeated commands.']),
  ];
}
function beginMission(id) {
  const mode = P.modes[id] || 'core';
  const tasks = missionTasks(id).slice(0, mode === 'stretch' ? 8 : 6).map((task, index) => {
    const item = {...task, id: `${id}-${index + 1}`};
    if (item.type === 'choice') {
      const options = shuffle(item.options.map((text, original) => ({text, original})));
      item.options = options.map(option => option.text);
      item.answer = options.findIndex(option => option.original === task.answer);
    }
    return item;
  });
  M = {subject:id,mode,tasks,index:0,records:[],hints:mode === 'support' ? 1 : 0,attempts:0,solved:false,order:null,program:[],robotStep:0};
  renderMission(); show('mission'); focusHeading();
}
function missionContext(id, task) {
  const root = el('aside', {class: 'evidence', style: `--accent:${SUBJECTS[id].color}`, 'aria-label': 'Mission evidence'});
  if (id === 'math') {
    appendMathEvidence(root,task);
  } else if (id === 'english') {
    root.append(el('h2', {}, 'The Garden Mystery'), el('p', {}, 'Maya noticed that the bean plants in one school garden bed were drooping. The soil felt dry. In the next bed, the plants stood upright and the soil was damp. Both beds received six hours of sunlight each day.'),
      el('p', {}, 'Maya followed the watering hose to the dry bed. It was sharply bent beneath a bucket. She moved the bucket and straightened the hose. Water began to reach the dry soil.'),
      el('p', {}, 'The next morning, Maya checked again. The soil was still damp and the leaves stood upright. She wrote in her notebook: “Straightening the hose helped restore the water supply.”'), el('small', {class:'quiet'}, 'Original fictional passage for this activity.'));
  } else if (id === 'social' && task.visual === 'map') {
    const labels = {0:'Library',3:'School',9:'Park',15:'Town hall'};
    root.append(el('h2', {}, 'Map of Willow Town'), el('p', {}, 'North ↑ · East →'),
      el('div', {class:'map-grid',role:'img','aria-label':'Four-by-four map. North is up. Library: row 1 column 1. School: row 1 column 4. Park: row 3 column 2. Town hall: row 4 column 4.'},
        ...Array.from({length:16}, (_, index) => el('span', {class:labels[index] ? 'landmark' : ''}, labels[index] || '·'))),
      el('p', {}, 'Each square represents one town block. The map shows locations, not building sizes.'));
  } else if (id === 'social') {
    root.append(el('h2', {}, 'Willow Town: two proposals'), el('p', {}, 'Fictional town, original source notes. The town has space for either a community garden or a basketball court. Costs and accessibility studies are not yet available.'),
      el('h3', {}, 'Source A · Park visitor survey'), el('p', {}, 'October 3: Twenty current park visitors were asked which proposal they preferred. Twelve chose a garden; eight chose a court.'),
      el('h3', {}, 'Source B · Student letter'), el('p', {}, 'October 5: “Our school basketball club has no nearby outdoor court. A court could give us a place to practice after school.” The letter represents the club’s request, not a survey of all students.'));
  } else {
    root.append(el('h2', {}, 'Robot field guide'), subjectArt(id), el('p', {}, 'Each command moves one square. North is up, east is right, south is down, and west is left. A move into a blocked square or beyond the grid fails. The robot starts at the bottom-left; the goal is the top-right star.'),
      el('p', {}, 'Sequence → predict → run → inspect → revise. A working route does not have to be the shortest route.'));
  }
  if (M.mode === 'support') root.append(el('h3', {}, 'Worked example'), el('p', {}, {
    math:'If 1 of 3 equal pieces is shaded, that is 1/3. Split each piece in half: 2 of 6 are shaded, so 1/3 = 2/6.',
    english:'“Lena opened her umbrella as drops hit the path.” You can infer it is raining; the drops and umbrella are supporting details.',
    social:'If a survey asks 10 bus riders, it records those riders’ views. People who walk or drive may have different needs.',
    coding:'To move two squares east and one north, use East → East → North. Trace each move before running.',
  }[id]));
  return root;
}
function renderMission() {
  const task = M.tasks[M.index], subject = SUBJECTS[M.subject], root = $('#mission');
  root.replaceChildren(el('div', {class:'bar'}, el('button', {class:'btn small',onclick:() => {
    if (confirm('Leave this mission? Your completed mission results will stay, but this unfinished attempt will not be saved.')) navigate(M.subject);
  }}, '← Subject'), el('h1', {}, subject.mission)),
    el('div', {class:'mission-status'}, el('span', {}, `Step ${M.index + 1} of ${M.tasks.length}`), el('span', {}, `${M.mode[0].toUpperCase() + M.mode.slice(1)} · Untimed`),
      el('progress', {max:String(M.tasks.length),value:String(M.index),'aria-label':'Mission steps completed'})));
  const bench = el('section', {class:'workbench','aria-label':'Your challenge'}, el('h2', {id:'taskPrompt'}, task.prompt));
  if (task.type === 'choice') {
    const choices = el('div', {class:'choices',role:'group','aria-labelledby':'taskPrompt'});
    task.options.forEach((text, index) => choices.append(el('button', {class:'choice',onclick:() => {
      if (M.solved) return;
      const correct = index === task.answer;
      if (!correct) M.attempts++;
      choices.querySelectorAll('button').forEach(button => button.classList.remove('selected'));
      choices.children[index].classList.add('selected');
      if (correct) { choices.children[index].classList.add('correct'); choices.querySelectorAll('button').forEach(button => button.disabled = true); solveMissionTask(false); }
      else { SND.bad(); announceMission('Not yet. ' + task.explanation + '\nUse the evidence and try again.'); }
    }}, text)));
    bench.append(choices);
  } else if (task.type === 'order') renderSentenceTask(bench, task);
  else if (task.type === 'robot') renderRobotTask(bench);
  else renderReflectionTask(bench, task);
  const hint = el('button', {class:'btn small',id:'missionHint',onclick:() => {
    if (M.solved) return;
    M.hints = Math.min(2, M.hints + 1);
    announceMission(`Hint ${M.hints}: ${task.hints[M.hints - 1]}`);
    hint.disabled = M.hints === 2;
  }}, '💡 Hint');
  const next = el('button', {class:'btn',id:'missionNext',style:`background:${subject.color}`,onclick:nextMissionTask}, M.index === M.tasks.length - 1 ? 'See results →' : 'Next step →');
  next.hidden = true;
  bench.append(el('div', {id:'missionFeedback',class:'feedback',role:'status','aria-live':'polite','aria-atomic':'true'}), el('div', {class:'row',style:'justify-content:flex-start'}, hint, next));
  root.append(el('div', {class:'mission-layout'}, missionContext(M.subject, task), bench));
  if (M.mode === 'support') announceMission('Hint 1: ' + task.hints[0]);
}
function announceMission(text) { $('#missionFeedback').textContent = text; }
function solveMissionTask(reflection) {
  if (!M || M.solved) return;
  M.solved = true;
  M.records.push({id:M.tasks[M.index].id,independent:!reflection && M.attempts === 0 && M.hints === 0,reflection});
  announceMission((reflection ? 'Reflection recorded. ' : 'That works! ') + M.tasks[M.index].explanation);
  $('#missionHint').disabled = true;
  $('#missionNext').hidden = false;
  SND.ok();
  $('#missionNext').focus({preventScroll:true});
}
function nextMissionTask() {
  if (!M?.solved) return;
  if (M.index === M.tasks.length - 1) {
    const id = M.subject;
    P.results[id] = {mode:M.mode,total:M.records.length,independent:M.records.filter(record => record.independent).length,
      supported:M.records.filter(record => !record.independent && !record.reflection).length,reflections:M.records.filter(record => record.reflection).length,date:Date.now()};
    saveProgress(); SND.win(); confetti(); navigate(id + '/results'); return;
  }
  M.index++; M.solved = false; M.attempts = 0; M.hints = M.mode === 'support' ? 1 : 0; M.order = null; M.program = []; M.robotStep = 0;
  renderMission(); $('#taskPrompt').tabIndex = -1; $('#taskPrompt').focus({preventScroll:true});
}
function renderSentenceTask(bench, task) {
  M.order = task.sentences.map((_, index) => index);
  const list = el('ol', {class:'sentence-list','aria-label':'Sentence order'});
  function drawOrder(focusPosition, direction) {
    list.replaceChildren(...M.order.map((sentence, position) => {
      const row = el('li', {}, el('span', {}, `${position + 1}. ${task.sentences[sentence]}`));
      [['↑',-1,'Move sentence up'],['↓',1,'Move sentence down']].forEach(([label, change, title]) => {
        const button = el('button', {title,'aria-label':`${title}: ${task.sentences[sentence]}`,onclick:() => {
          if (M.solved || position + change < 0 || position + change >= M.order.length) return;
          [M.order[position], M.order[position + change]] = [M.order[position + change], M.order[position]];
          drawOrder(position + change, change);
        }}, label);
        button.disabled = position + change < 0 || position + change >= M.order.length;
        row.append(button);
      });
      return row;
    }));
    if (focusPosition !== undefined) {
      const row = list.children[focusPosition];
      const preferred = row.querySelectorAll('button')[direction === -1 ? 0 : 1];
      (preferred.disabled ? row.querySelector('button:not(:disabled)') : preferred)?.focus();
    }
  }
  drawOrder();
  bench.append(list, el('button', {class:'btn small',onclick:() => {
    if (M.solved) return;
    if (M.order.every((value, index) => value === task.order[index])) { list.querySelectorAll('button').forEach(button => button.disabled = true); solveMissionTask(false); }
    else { M.attempts++; announceMission('Not yet. ' + task.hints[0]); }
  }}, 'Check order'));
}
function renderReflectionTask(bench, task) {
  const input = el('textarea', {'aria-label':task.prompt,maxlength:'2000',placeholder:'Your explanation…'});
  const rubric = el('div', {class:'rubric'}, el('h3', {}, 'Self-check'));
  task.rubric.forEach(text => rubric.append(el('label', {}, el('input', {type:'checkbox'}), text)));
  const model = el('details', {}, el('summary', {}, 'Compare with an example'), el('p', {}, task.example));
  bench.append(input, model, rubric, el('p', {class:'quiet'}, 'Your writing is not automatically graded or saved. The checklist records your own review.'),
    el('button', {class:'btn small',onclick:() => {
      if (M.solved) return;
      if (!input.value.trim() || [...rubric.querySelectorAll('input')].some(checkbox => !checkbox.checked)) { announceMission('Write your response, then check each statement after reviewing your work.'); return; }
      input.readOnly = true; rubric.querySelectorAll('input').forEach(checkbox => checkbox.disabled = true); solveMissionTask(true);
    }}, 'Record my reflection'));
}
function robotTrace(program, count = program.length) {
  let column = 0, row = 3;
  for (let index = 0; index < count; index++) {
    const delta = {N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]}[program[index]];
    if (!delta) return {column,row,error:'Unknown command.'};
    column += delta[0]; row += delta[1];
    if (column < 0 || column > 3 || row < 0 || row > 3) return {column,row,error:`Move ${index + 1} leaves the grid.`};
    if (row === 1 && (column === 1 || column === 2)) return {column,row,error:`Move ${index + 1} enters a blocked square.`};
  }
  return {column,row,goal:column === 3 && row === 0};
}
function renderRobotTask(bench) {
  const grid = el('div', {class:'robot-grid',role:'img'}), program = el('div', {class:'program','aria-label':'Program commands'});
  const update = () => {
    const position = robotTrace(M.program, M.robotStep);
    grid.setAttribute('aria-label', `Four-by-four grid. Robot at row ${position.row + 1}, column ${position.column + 1}. Goal row 1, column 4. Blocked: row 2 columns 2 and 3.`);
    grid.replaceChildren(...Array.from({length:16}, (_, index) => {
      const row = Math.floor(index / 4), column = index % 4, robot = row === position.row && column === position.column && !position.error;
      return el('span', {class:robot ? 'robot' : row === 1 && [1,2].includes(column) ? 'wall' : index === 3 ? 'goal' : ''}, robot ? '🤖' : index === 3 ? '★' : row === 1 && [1,2].includes(column) ? '×' : '·');
    }));
    program.replaceChildren(...M.program.map((command, index) => el('span', {}, `${index + 1}. ${command}`)));
  };
  const commands = el('div', {class:'command-row',role:'group','aria-label':'Add movement command'});
  [['N','↑ North'],['E','→ East'],['S','↓ South'],['W','← West']].forEach(([code,label]) => commands.append(el('button', {class:'btn small',onclick:() => {
    if (M.solved) return;
    if (M.program.length >= 24) { announceMission('The program can hold 24 commands. Undo a move to revise it.'); return; }
    M.program.push(code); M.robotStep = 0; update(); announceMission(`${label.slice(2)} added. ${M.program.length} commands.`);
  }}, label)));
  const execute = step => {
    if (M.solved) return;
    if (!M.program.length) { announceMission('Add at least one command first.'); return; }
    M.robotStep = step ? Math.min(M.robotStep + 1, M.program.length) : M.program.length;
    const position = robotTrace(M.program, M.robotStep); update();
    if (position.error) { M.attempts++; announceMission(position.error + ' Revise your program and test again.'); M.robotStep = 0; }
    else if (M.robotStep === M.program.length && position.goal) { bench.querySelectorAll('.command-row button').forEach(button => button.disabled = true); solveMissionTask(false); }
    else announceMission(`After ${M.robotStep} move${M.robotStep === 1 ? '' : 's'}: row ${position.row + 1}, column ${position.column + 1}.` + (M.robotStep === M.program.length ? ' Not at the goal yet.' : ''));
  };
  bench.append(grid, program, commands, el('div', {class:'command-row'},
    el('button', {class:'btn small',title:'Undo last command',onclick:() => { if (!M.solved) { M.program.pop(); M.robotStep = 0; update(); announceMission('Last command removed.'); } }}, '↶ Undo'),
    el('button', {class:'btn small',title:'Step through one command',onclick:() => execute(true)}, '▷ Step'),
    el('button', {class:'btn small',title:'Run all commands',onclick:() => execute(false)}, '▶ Run'),
    el('button', {class:'btn small',title:'Reset program',onclick:() => { if (!M.solved) { M.program = []; M.robotStep = 0; update(); announceMission('Program reset.'); } }}, '↺ Reset')));
  update();
}
function renderMissionResults(id) {
  const result = P.results[id], subject = SUBJECTS[id], root = $('#mission');
  root.replaceChildren(subjectBackBar(`${subject.icon} ${subject.mission}`));
  if (!result) { root.append(el('p', {}, 'No completed mission yet.'), el('button', {class:'btn',onclick:() => navigate(id)}, 'Explore subject →')); return; }
  const metrics = el('div', {class:'result-metrics'});
  [[result.total,'Steps completed'],[result.independent,'Independent answers'],[result.supported,'With support / retries'],[result.reflections,'Self-reviewed reflections']].forEach(([count,label]) => metrics.append(el('div', {}, el('strong', {}, count), el('span', {}, label))));
  root.append(el('h2', {}, 'You followed the challenge through.'), el('p', {}, `${result.mode[0].toUpperCase() + result.mode.slice(1)} mission · ${new Date(result.date).toLocaleDateString()}`), metrics,
    el('p', {}, subject.objective), el('p', {class:'quiet'}, 'This is a record of this attempt, not a mastery score. Replays use the same starter tasks. Reflections are self-reviewed, not automatically graded.'),
    el('div', {class:'row',style:'justify-content:flex-start'}, el('button', {class:'btn',style:`background:${subject.color}`,onclick:() => navigate(id)}, 'Back to subject →'),
      el('button', {class:'btn',onclick:() => navigate('subjects')}, 'Choose another subject →')));
}

// ---------- boot ----------
$('#logo').addEventListener('click', () => navigate('subjects'));
$('#btnPet').addEventListener('click', () => {
  const active = (G && !G.over) || M || (typeof EnglishSubject !== 'undefined' && EnglishSubject.round) ||
    (typeof ScienceSubject !== 'undefined' && ScienceSubject.round) || (typeof CodingSubject !== 'undefined' && CodingSubject.round);
  if (active && !confirm('Leave this activity for your pet? Unfinished answers will not be restored.')) return;
  navigate('pet');
});
$('#btnTro').addEventListener('click', () => {
  const subject = location.hash.slice(1).split('/')[0];
  if (subject === 'english' || subject === 'science' || subject === 'coding') navigate(`${subject}/trophies`);
  else openTrophies();
});
$('#btnSound').addEventListener('click', () => { S.sound = !S.sound; save(); updateHeader(); SND.ok(); });
if (typeof EnglishSubject !== 'undefined') EnglishSubject.init({el,$,navigate,show,subjectBackBar,focusHeading,SND,confetti,updateHeader,art:activityArt,
  legacyResults:() => renderMissionResults('english'),storageFailure:() => {storageAvailable = false;saveProgress();}});
if (typeof ScienceSubject !== 'undefined') ScienceSubject.init({el,$,navigate,show,subjectBackBar,focusHeading,toast,SND,confetti,fmt,updateHeader,art:activityArt,
  name:() => S.name || 'Explorer',legacy:() => ({result:P.results.science,mode:P.modes.science}),storageFailure:() => {storageAvailable = false;saveProgress();}});
if (typeof CodingSubject !== 'undefined') CodingSubject.init({el,$,navigate,show,subjectBackBar,focusHeading,SND,confetti,updateHeader,art:activityArt,
  legacyResults:() => renderMissionResults('coding'),storageFailure:() => {storageAvailable = false;saveProgress();}});
if (mathStorageAvailable) save();
if (typeof Pet !== 'undefined') Pet.init({el,$,navigate,show,focusHeading,storageFailure:reportStorageFailure,getEarnings:petEarnings,updateHeader,SND});
updateHeader();
saveProgress();
window.addEventListener('hashchange', route);
route();
if (window.isSecureContext && /^https?:$/.test(location.protocol) && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('./service-worker.js').catch(() => {});
}
