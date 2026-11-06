'use strict';
const EnglishSubject = (() => {
  const storageKey = 'learningPlayground.english.v1';
  const levels = [
    {name:'Word Explorer',description:'Everyday meanings, complete sentences, and stated details'},
    {name:'Clue Finder',description:'Word parts, agreement, and cause and effect'},
    {name:'Meaning Detective',description:'Precise language, sentence links, and supported inferences'},
    {name:'Thoughtful Reader',description:'Figurative language, editing, and weighing evidence'},
  ];
  const activities = {
    vocabulary:{title:'Word Detective',description:'Use context and word parts to uncover meaning.'},
    grammar:{title:'Sentence Studio',description:'Choose clear sentences and explain how they work.'},
    reading:{title:'Reading Clues',description:'Read an original short story and follow its evidence.'},
  };
  const passages = [
    {title:'The Red Ribbon',text:'Nia tied a red ribbon to her lunch bag. At the park, three lunch bags sat on a bench. Nia spotted the ribbon and picked up her bag. She shared her apple slices with her friend Jo.'},
    {title:'Room for Seeds',text:'Leo wanted to plant beans, but his windowsill was crowded with empty jars. He moved the jars to a shelf and put a tray on the sill. He planted beans in small pots on the tray. Each morning he checked the soil before deciding whether to water it.'},
    {title:'The Quiet Rehearsal',text:'During rehearsal, Amira could not hear Ben from the back row. Ben wanted to shout, but Amira suggested facing the audience instead of the curtain. Ben turned and read the same lines again. This time Amira heard every word. They marked a small arrow on the floor before the next rehearsal.'},
    {title:'A Place to Read',text:'The library club tested two places for an outdoor reading hour. On Monday, six volunteers read beside the fountain; four said the splashing made it hard to concentrate. On Tuesday, the same six read under the elm; five preferred its quiet shade. Priya recommended the elm for the next meeting. She also asked to try both places with more readers on another week. "We have a useful start, not everyone\'s answer," she wrote.'},
  ];
  const bank = [];
  function add(family, level, rows) {
    rows.forEach(([context,prompt,options,explanation,hints],index) => bank.push({
      id:`english-${family}-L${level}-Q${index + 1}`,version:1,family,level,context,prompt,options,answer:0,explanation,hints,
      reviewStatus:'Original illustrative enrichment; independent educator review pending.',
    }));
  }
  add('vocabulary',1,[
    ['The kitten was tiny enough to sit in one hand.','What does "tiny" mean here?',['Very small','Very noisy','Very sleepy'],'Fitting in one hand is a clue that the kitten is very small.',['Picture the kitten beside a hand.','Think about its size, not its sound or sleep.']],
    ['We shut the gate so the puppy would stay in the yard.','Which word means the same as "shut" here?',['Closed','Painted','Lifted'],'Closing the gate keeps the puppy inside the yard.',['What would stop the puppy walking through?','An open gate is the opposite of a shut gate.']],
    ['The towel was damp after I dried my hands.','What does "damp" mean?',['Slightly wet','Completely dry','Very heavy'],'Water from the hands leaves the towel slightly wet, or damp.',['Think about what moves from wet hands to a towel.','Damp describes a little moisture.']],
  ]);
  add('vocabulary',2,[
    ['I reread the note because I missed a detail.','What does the prefix "re-" tell you?',['Read it again','Read it aloud','Read it quickly'],'In reread, re- means again. The reader reads the note another time.',['Compare read with reread.','Missing a detail can make you return to a note.']],
    ['The empty bottle is reusable; we can fill it tomorrow.','What does "reusable" mean?',['Able to be used again','Unable to hold water','Used only once'],'Re- means again and -able means able to be. A reusable bottle can be used again.',['Separate re-use-able into parts.','The sentence says the bottle can be filled tomorrow.']],
    ['The path was uneven, with bumps and dips.','What does "uneven" mean?',['Not level or smooth','Perfectly flat','Very short'],'Un- means not here. Bumps and dips show that the path is not even.',['Notice the beginning un-.','Use the bumps and dips as clues.']],
  ]);
  add('vocabulary',3,[
    ['Sana examined the leaf with a lens, checking every edge.','Which phrase best replaces "examined"?',['Looked at closely','Walked past quickly','Put away carefully'],'The lens and checking every edge show close, careful looking.',['Use the actions after the comma.','A lens helps someone see small details.']],
    ['The bridge was sturdy; it did not wobble under the loaded cart.','What does "sturdy" suggest?',['Strong and steady','Thin and shaky','Brightly painted'],'Not wobbling under a load is evidence of strength and steadiness.',['Look at how the bridge behaves.','The cart is loaded, yet the bridge stays steady.']],
    ['After several failed tries, I persisted until the knot came loose.','What does "persisted" mean?',['Kept trying','Gave up','Forgot the task'],'The speaker continues after failures until the knot comes loose.',['Notice the contrast between failed tries and the final result.','The speaker does not stop at the first failure.']],
  ]);
  add('vocabulary',4,[
    ['When the surprise guest arrived, the room buzzed with excitement.','What does "buzzed" mean in this sentence?',['Was full of lively talk','Was full of insects','Became completely silent'],'Buzzed is figurative here: it compares lively excited talk to a buzzing sound.',['Think about the people reacting to the guest.','A word can describe a similar sound without naming real insects.']],
    ['Kai was reluctant to step onto the stage, pausing twice before moving.','Which word best replaces "reluctant"?',['Hesitant','Eager','Careless'],'Pausing before moving supports hesitant, not eager or careless.',['Use the pauses as evidence of how Kai feels.','Kai delays rather than rushing forward.']],
    ['The designer called the first model a stepping stone toward a better one.','What is a "stepping stone" here?',['A useful stage on the way to a goal','A final perfect model','A rock inside the model'],'The first model helps the designer move toward a better model; it is not the final goal.',['Read toward a better one carefully.','Think about making progress in stages.']],
  ]);
  add('grammar',1,[
    ['A sentence begins with a capital letter and ends with punctuation.','Which sentence is correctly written?',['The kite is red.','the kite is red.','The kite is red'],'The capital T begins the sentence and the period ends this statement.',['Check both the beginning and the end.','A statement needs an end mark as well as a capital.']],
    ['A complete sentence tells who or what and what happens.','Which is a complete sentence?',['The robin sings.','Under the tree.','The little robin.'],'The robin names who, and sings tells what it does. The other choices do not tell what happens.',['Find a subject and an action.','Ask what the robin does.']],
    ['A question asks for information.','Which end mark fits: "Where is my hat"?',['?','.','!'],'Where is my hat asks a question, so it ends with a question mark.',['Is the speaker asking or telling?','Where often begins a question.']],
  ]);
  add('grammar',2,[
    ['Use a verb that agrees with its subject.','Which sentence uses the correct verb?',['The dogs run home.','The dogs runs home.','The dogs running home.'],'The plural subject dogs takes run. Running alone does not make a complete verb here.',['Notice that dogs means more than one.','Compare one dog runs with two dogs run.']],
    ['Yesterday tells us this action happened in the past.','Which word completes: "Yesterday, I ___ a bird"?',['saw','see','seeing'],'Saw is the past tense of see, matching yesterday.',['Look for a past-tense verb.','See has the irregular past form saw.']],
    ['A possessive noun can show who owns something.','One girl owns a hat. Which phrase shows this?',["the girl's hat","the girls' hat","the girls hat"],'For one girl, add apostrophe-s: girl\'s hat. Girls\' would indicate more than one girl.',['The owner is one girl, not several.','Add the ownership ending to the singular word girl.']],
  ]);
  add('grammar',3,[
    ['Join these ideas: "We went inside. Rain began to fall."','Which sentence clearly shows the cause?',['We went inside because rain began to fall.','We went inside although rain began to fall.','We went inside before rain began to fall.'],'Because explicitly identifies the rain as the reason for going inside. Although contrasts; before gives time order.',['Find the linking word that means for the reason that.','Time order alone does not explain why.']],
    ['Mina thanked Rosa after Rosa repaired the wheel.','Which version makes the helper clear?',['Mina thanked Rosa because Rosa repaired the wheel.','Mina thanked Rosa because she repaired the wheel.','She thanked her because she repaired the wheel.'],'Repeating Rosa removes uncertainty about who repaired the wheel. She could refer to Mina or Rosa.',['Check who each pronoun could name.','A name can prevent two possible meanings.']],
    ['Two related statements can be joined without running them together.','Which sentence is punctuated correctly?',['The wind rose, and we folded the sail.','The wind rose we folded the sail.','The wind rose, we folded the sail.'],'A comma followed by and joins these two complete clauses. A comma alone does not join them correctly here.',['Each part could stand alone as a sentence.','Look for a joining word as well as punctuation.']],
  ]);
  add('grammar',4,[
    ['The intended meaning is that I used binoculars to watch a heron.','Which sentence states that meaning most clearly?',['Using binoculars, I watched a heron.','I watched a heron using binoculars.','I watched a heron that used binoculars.'],'The opening phrase attaches using binoculars to I. The other versions can give the binoculars to the heron.',['Who should be using the binoculars?','Place the describing phrase beside the intended person.']],
    ['Keep the list in a consistent grammatical pattern.','Which sentence has a parallel list?',['We enjoy hiking, swimming, and cycling.','We enjoy hiking, swimming, and to cycle.','We enjoy to hike, swimming, and cycling.'],'Hiking, swimming, and cycling all use the same -ing pattern.',['Compare the form of all three activities.','Look for three matching verb forms.']],
    ['Two players share one coach.','Which sentence shows that relationship?',["The two players' coach arrived.","The two player's coach arrived.","The two players coach arrived."],'Players is plural. Adding an apostrophe after its s makes players\' possessive.',['Start with the plural word players.','A regular plural ending in s takes an apostrophe after the s for possession.']],
  ]);
  add('reading',1,[
    [passages[0].text,'What did Nia tie to her bag?',['A red ribbon','A blue bell','A green leaf'],'The first sentence says Nia tied a red ribbon to her lunch bag.',['Reread the opening sentence.','Look for the object attached to the bag.']],
    [passages[0].text,'Where were the lunch bags?',['On a bench','Under a tree','Inside a bus'],'The passage states that three lunch bags sat on a bench at the park.',['Find the sentence about three bags.','Look for the words telling where they sat.']],
    [passages[0].text,'What happened after Nia picked up her bag?',['She shared apple slices.','She tied the ribbon.','She left home.'],'Sharing the apple slices is the next event stated after she picks up the bag.',['Read the last two sentences in order.','The last sentence tells what she shared.']],
  ]);
  add('reading',2,[
    [passages[1].text,'Why did Leo move the jars?',['To make room for the bean pots','To catch rain in them','To give the jars to a friend'],'The crowded sill had no room for planting; moving jars made space for the tray and pots.',['Connect the problem at the start with his next action.','The jars were empty but taking up space.']],
    [passages[1].text,'What did Leo do before deciding to water?',['He checked the soil.','He measured the shelf.','He counted the jars.'],'The final sentence says he checked the soil before deciding whether to water.',['Look for before in the final sentence.','His decision concerns the plants, not the shelf.']],
    [passages[1].text,'Which summary includes the main events without adding facts?',['Leo made space on a windowsill, planted beans, and checked their soil.','Leo broke jars and grew the tallest beans in town.','Leo planted beans outside and watered them every hour.'],'Only the first summary follows the stated preparation, planting, and care without inventing results.',['Check every part against the passage.','The passage does not say how tall the beans grew.']],
  ]);
  add('reading',3,[
    [passages[2].text,'Why did they probably mark an arrow on the floor?',['To remind Ben which way to face','To measure the size of the room','To tell the audience to leave'],'Turning toward the audience helped Ben be heard; an arrow could remind him of that direction. This is a supported inference, not an explicitly stated reason.',['Connect the arrow to the change that helped.','They want to remember which direction worked.']],
    [passages[2].text,'Which detail best supports Amira\'s suggestion?',['She heard every word after Ben turned.','Ben wanted to shout.','There was a back row.'],'Hearing every word after the change is the direct result supporting the suggestion.',['Find the outcome after Ben changes direction.','A result is stronger evidence here than a plan.']],
    [passages[2].text,'Which statement goes beyond what the passage tells us?',['Ben will always be heard in every theater.','Amira listened from the back row.','Ben read the same lines again.'],'One successful rehearsal does not show what will happen in every theater. The other statements are given details.',['Look for a claim that reaches beyond this rehearsal.','Words like always and every need much broader evidence.']],
  ]);
  add('reading',4,[
    [passages[3].text,'Which evidence most directly supports choosing the elm next?',['Five of the six volunteers preferred its quiet shade.','The club met on Monday and Tuesday.','Priya wrote a recommendation.'],'The volunteers\' reported preference gives direct support for the elm. Dates and the existence of a recommendation do not explain why it is preferable.',['Find the readers\' response to the elm.','Look for evidence about the reading experience, not just the schedule.']],
    [passages[3].text,'Why does Priya ask to test both places again?',['Six volunteers on two days may not represent all readers or conditions.','The first test proved that nobody likes fountains.','More tests guarantee everyone will agree.'],'More readers and another week can broaden limited evidence. Neither universal dislike nor guaranteed agreement follows.',['Consider who took part and when.','The same small group read at each place on different days.']],
    [passages[3].text,'What does "a useful start, not everyone\'s answer" show about Priya?',['She values the evidence while recognizing its limits.','She thinks observations are worthless.','She claims the elm is best for every reader.'],'Priya uses the first results to recommend a next meeting but asks for more evidence rather than claiming a universal answer.',['Compare her recommendation with her request for another test.','Both using evidence and questioning its reach can happen together.']],
  ]);
  function shuffled(items, random) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(random() * (index + 1));
      [result[index],result[other]] = [result[other],result[index]];
    }
    return result;
  }
  function chooseRound(family, level, random = Math.random) {
    return shuffled(bank.filter(task => task.family === family && task.level === level),random).map(task => {
      const choices = shuffled(task.options.map((text,index) => ({text,correct:index === task.answer})),random);
      return {...task,options:choices.map(choice => choice.text),answer:choices.findIndex(choice => choice.correct)};
    });
  }
  const badges = [
    {id:'first',name:'First Chapter',description:'Complete an English round.'},
    {id:'explorer',name:'Language Explorer',description:'Complete all three English activities at any level.'},
    {id:'challenger',name:'Thoughtful Reader',description:'Complete a level-4 round.'},
  ];
  function initialState() { return {version:1,level:1,stars:0,done:{},results:{},best:{},badges:{},latest:{}}; }
  const validLevel = value => Number.isInteger(value) && value >= 1 && value <= 4;
  function validResult(result, family, level) {
    return result && result.family === family && result.level === level && result.total === 3 &&
      Number.isFinite(result.date) && Number.isInteger(result.independent) && result.independent >= 0 && result.independent <= 3 &&
      result.supported === 3 - result.independent && Array.isArray(result.taskIds) && result.taskIds.length === 3 &&
      new Set(result.taskIds).size === 3 && result.taskIds.every(id => bank.some(task => task.id === id && task.family === family && task.level === level));
  }
  function restore(saved) {
    const fresh = initialState();
    if (saved?.version !== 1) return fresh;
    if (validLevel(saved.level)) fresh.level = saved.level;
    if (Number.isSafeInteger(saved.stars) && saved.stars >= 0) fresh.stars = saved.stars;
    for (const badge of badges) if (Number.isFinite(saved.badges?.[badge.id])) fresh.badges[badge.id] = saved.badges[badge.id];
    for (const family of Object.keys(activities)) {
      for (let level = 1; level <= 4; level++) {
        const key = `${family}-${level}`;
        if (Number.isSafeInteger(saved.done?.[key]) && saved.done[key] >= 0) fresh.done[key] = saved.done[key];
        if (validResult(saved.results?.[key],family,level)) fresh.results[key] = saved.results[key];
        if (Number.isInteger(saved.best?.[key]) && saved.best[key] >= 0 && saved.best[key] <= 3) fresh.best[key] = saved.best[key];
      }
      if (fresh.results[saved.latest?.[family]]?.family === family) fresh.latest[family] = saved.latest[family];
    }
    return fresh;
  }
  let api, state, round = null;
  function save() {
    try { localStorage.setItem(storageKey,JSON.stringify(state)); }
    catch { api.storageFailure(); }
  }
  function init(helpers) {
    api = helpers;
    try {
      const text = localStorage.getItem(storageKey);
      state = restore(text && text.length <= 100000 ? JSON.parse(text) : null);
    } catch { state = initialState(); api.storageFailure(); }
    save();
  }
  function stop() { round = null; }
  function heading(title, path = 'english', label = 'English') {
    const {el,navigate} = api;
    return el('div', {class:'bar'},el('button', {class:'btn small',onclick:() => navigate(path)},`← ${label}`),el('h1', {},title));
  }
  function hub() {
    const {el,$,navigate} = api;
    const root = $('#subject');
    root.replaceChildren(api.subjectBackBar('English'),api.art('english'),el('h2', {},'1. Pick your level'),
      el('div', {class:'levels english-levels'},...levels.map((level,index) => el('button', {
        class:'card level' + (state.level === index + 1 ? ' sel' : ''),'aria-pressed':String(state.level === index + 1),onclick:() => {
          state.level = index + 1;save();hub();$('#subject .level.sel').focus();
        }},el('b', {},`Level ${index + 1}: ${level.name}`),el('small', {},level.description)))),el('h2', {},'2. Pick an activity'),
      el('div', {class:'subject-grid'},...Object.entries(activities).map(([family,activity]) => el('button', {
        class:'subject-tile',style:'--accent:#ae3e63',onclick:() => navigate(`english/${family}`)},
        el('span', {class:'subject-copy'},el('b', {},activity.title),el('small', {},activity.description))))),
      el('div', {class:'science-summary'},el('strong', {},`${state.stars} English stars`),el('span', {},`${Object.values(state.done).reduce((sum,value) => sum + value,0)} rounds completed`),
        el('button', {class:'btn small',onclick:() => navigate('english/trophies')},'English trophies')),
      el('p', {class:'quiet'},'Original illustrative grades 3–5 enrichment. Independent educator review is pending; this is not a complete curriculum or validated assessment.'));
    api.show('subject');api.focusHeading();
  }
  function preparation(family) {
    const {el,$,navigate} = api, activity = activities[family];
    const tasks = bank.filter(task => task.family === family && task.level === state.level);
    $('#subject').replaceChildren(heading(activity.title),el('p', {},activity.description),
      el('h2', {},`Level ${state.level}: ${levels[state.level - 1].name}`),el('p', {},levels[state.level - 1].description),
      el('ol', {class:'english-preview'},...tasks.map(task => el('li', {},task.prompt))),
      el('button', {class:'btn',onclick:() => navigate(`english/${family}/play`)},'Start round'),
      el('p', {class:'quiet'},'Three questions, untimed. Replays use the same small bank with shuffled questions and choices. Completed rounds are saved; unfinished answers are not restored after leaving or reloading.'));
    if (state.latest[family]) $('#subject').append(el('a', {href:`#english/${family}/results`},'View last results'));
    api.show('subject');api.focusHeading();
  }
  function start(family) {
    round = {family,level:state.level,tasks:chooseRound(family,state.level),index:0,records:[],attempts:0,hints:0,solved:false,finalized:false};
    renderRound();api.show('mission');api.focusHeading();
  }
  function answer(current, index) {
    if (round !== current || current.solved || current.finalized) return false;
    const task = current.tasks[current.index];
    if (!Number.isInteger(index) || index < 0 || index >= task.options.length) return false;
    if (index !== task.answer) {current.attempts++;return false;}
    current.solved = true;
    current.records.push({id:task.id,independent:current.attempts === 0 && current.hints === 0});
    return true;
  }
  function renderRound() {
    const {el,$} = api, current = round, task = current.tasks[current.index];
    const root = $('#mission');
    root.replaceChildren(heading(activities[current.family].title),
      el('div', {class:'mission-status'},el('span', {},`Question ${current.index + 1} of 3 · Level ${current.level}`),
        el('progress', {id:'englishProgress',max:'3',value:String(current.records.length),'aria-label':'English questions completed'})));
    const feedback = el('div', {class:'feedback',id:'englishFeedback',role:'status','aria-live':'polite','aria-atomic':'true'});
    const next = el('button', {class:'btn',id:'englishNext',onclick:() => advance(current)},current.index === 2 ? 'See results' : 'Next question');
    next.hidden = true;
    const hint = el('button', {class:'btn small',id:'englishHint',onclick:() => {
      if (round !== current || current.solved) return;
      current.hints = Math.min(2,current.hints + 1);feedback.textContent = `Hint ${current.hints}: ${task.hints[current.hints - 1]}`;
      hint.disabled = current.hints === 2;
    }},'Hint');
    const choices = el('div', {class:'choices',role:'group','aria-labelledby':'englishPrompt'});
    task.options.forEach((text,index) => {
      const button = el('button', {class:'choice',onclick:() => {
        if (round !== current || current.solved) return;
        if (!answer(current,index)) {
          button.classList.add('selected');feedback.textContent = `Not yet. ${task.hints[0]} Try another answer.`;api.SND.bad();return;
        }
        choices.querySelectorAll('button').forEach(choice => choice.disabled = true);
        button.classList.add('correct');hint.disabled = true;next.hidden = false;
        $('#englishProgress').value = current.records.length;
        feedback.textContent = 'That works! ' + task.explanation;api.SND.ok();next.focus({preventScroll:true});
      }},text);
      choices.append(button);
    });
    root.append(el('div', {class:'mission-layout english-round'},
      el('aside', {class:'evidence',style:'--accent:#ae3e63','aria-label':current.family === 'reading' ? 'Reading passage' : 'Language context'},
        el('h2', {},current.family === 'reading' ? passages[current.level - 1].title : 'Look closely'),el('p', {},task.context),
        el('small', {class:'quiet'},'Original learning content; educator review pending.')),
      el('section', {class:'workbench','aria-label':'English question'},el('h2', {id:'englishPrompt'},task.prompt),choices,feedback,
        el('div', {class:'row',style:'justify-content:flex-start'},hint,next))));
  }
  function finalize(current) {
    if (round !== current || current.finalized || current.records.length !== 3 || !current.solved || current.index !== 2) return null;
    current.finalized = true;
    const independent = current.records.filter(record => record.independent).length, key = `${current.family}-${current.level}`;
    const result = {family:current.family,level:current.level,total:3,independent,supported:3 - independent,date:Date.now(),taskIds:current.tasks.map(task => task.id)};
    state.stars += 3;state.done[key] = (state.done[key] || 0) + 1;
    state.results[key] = result;state.latest[current.family] = key;
    state.best[key] = Math.max(state.best[key] || 0,independent);
    state.badges.first ||= result.date;
    if (Object.keys(activities).every(family => [1,2,3,4].some(level => state.done[`${family}-${level}`]))) state.badges.explorer ||= result.date;
    if (current.level === 4) state.badges.challenger ||= result.date;
    save();api.updateHeader();return result;
  }
  function advance(current) {
    if (round !== current || !current.solved || current.finalized) return;
    if (current.index < 2) {
      current.index++;current.solved = false;current.attempts = 0;current.hints = 0;renderRound();
      const prompt = api.$('#englishPrompt');prompt.tabIndex = -1;prompt.focus();return;
    }
    if (finalize(current)) {api.SND.win();api.confetti();api.navigate(`english/${current.family}/results`);}
  }
  function results(family) {
    const {el,$,navigate} = api, result = state.results[state.latest[family]], root = $('#mission');
    root.replaceChildren(heading('English round results'));
    if (!result) root.append(el('p', {},'No completed round for this activity yet.'),el('a', {href:`#english/${family}`},'Choose a round'));
    else {
      root.append(el('h2', {},'Round complete!'),el('p', {},`${activities[family].title} · Level ${result.level}`),
        el('div', {class:'result-metrics'},...[[3,'Questions completed'],[result.independent,'Independent answers'],[result.supported,'With hints / retries']].map(([value,label]) => el('div', {},el('strong', {},value),el('span', {},label)))),
        el('p', {},'Three English participation stars earned. Supported answers count toward completion; these records are not a mastery score.'),
        el('details', {class:'science-review'},el('summary', {},'Review this round'),...result.taskIds.map(id => {
          const task = bank.find(item => item.id === id);
          return el('div', {},el('h3', {},task.prompt),el('p', {},task.context),el('b', {},task.options[task.answer]),el('p', {},task.explanation));
        })),el('button', {class:'btn',onclick:() => {state.level = result.level;save();navigate(`english/${family}/play`);}},'New round'));
    }
    api.show('mission');api.focusHeading();
  }
  function trophies() {
    const {el,$} = api, root = $('#subject');
    root.replaceChildren(heading('English trophies'),el('h2', {},`${state.stars} English stars`),
      el('p', {},'English rewards and records are separate from Math, Science, and starter missions.'),
      el('div', {class:'badges'},...badges.map(badge => el('article', {class:'card badge english-badge'},el('b', {},badge.name),
        el('p', {},state.badges[badge.id] ? 'Earned' : 'Not earned yet'),el('small', {},badge.description)))));
    const table = el('table', {class:'data-table'},el('caption', {},'English round records'),
      el('thead', {},el('tr', {},...['Activity / level','Rounds','Best independent answers'].map(text => el('th', {scope:'col'},text)))));
    table.append(el('tbody', {},...Object.entries(activities).flatMap(([family,activity]) => levels.map((level,index) => {
      const key = `${family}-${index + 1}`;
      return el('tr', {},el('th', {scope:'row'},`${activity.title} / ${index + 1}`),el('td', {},state.done[key] || 0),el('td', {},Object.hasOwn(state.best,key) ? `${state.best[key]}/3` : 'Not played'));
    }))));
    root.append(el('div', {class:'english-records',tabindex:'0',role:'region','aria-label':'English round records; scroll to see all columns'},table));api.show('subject');api.focusHeading();
  }
  function handleRoute(path) {
    if (!state) return false;
    if (path === 'english') {hub();return true;}
    if (path === 'english/trophies') {trophies();return true;}
    if (path === 'english/mission') {start('reading');return true;}
    if (path === 'english/results') {api.legacyResults();api.show('mission');api.focusHeading();return true;}
    const parts = path.split('/');
    if (parts[0] !== 'english' || !Object.hasOwn(activities,parts[1])) return false;
    if (parts.length === 2) {preparation(parts[1]);return true;}
    if (parts.length === 3 && parts[2] === 'play') {start(parts[1]);return true;}
    if (parts.length === 3 && parts[2] === 'results') {results(parts[1]);return true;}
    return false;
  }
  return {storageKey,levels,activities,bank,chooseRound,restore,init,stop,handleRoute,answer,finalize,get state(){return state;},get round(){return round;}};
})();