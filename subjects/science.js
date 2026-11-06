'use strict';
const ScienceSubject = (() => {
  const levels = [
    {name:'Explorer', icon:'🔎', description:'Observe, name, and read the evidence'},
    {name:'Investigator', icon:'🧪', description:'Compare patterns and plan fair tests'},
    {name:'Evidence Detective', icon:'📋', description:'Check claims and explain what data supports'},
    {name:'Science Challenger', icon:'🚀', description:'Weigh explanations and design the next test'},
  ];
  const activities = {
    forces:{title:'Forces & Motion',icon:'🛞',color:'#22774f',description:'Ramps, surfaces, pushes, and careful comparisons',source:'https://www.nextgenscience.org/pe/3-ps2-1-motion-and-stability-forces-and-interactions'},
    ecosystems:{title:'Ecosystem Evidence',icon:'🌱',color:'#9b5422',description:'Living things, resources, and habitat clues',source:'https://www.nextgenscience.org/pe/3-ls4-3-biological-evolution-unity-and-diversity'},
    weather:{title:'Weather & Water',icon:'🌦️',color:'#176fa0',description:'Rain records, changing water, and cautious predictions',source:'https://www.nextgenscience.org/pe/3-ess2-1-earths-systems'},
  };
  const scenarios = {
    forces:[
      {id:'ramp',title:'The Ramp Investigation',factor:'ramp height',measure:'distance rolled on the floor',unit:'cm',rows:[['Low ramp',30,32,31],['High ramp',60,62,61]],kind:'test',
        summary:'The same cart is released without a push from two ramp heights. Distance is measured from the end of the ramp. The floor surface and release method stay the same.',
        fixed:'Use the same cart, floor, and release method',conclusion:'This cart rolled farther from the higher ramp in these trials',limit:'These trials do not show what every cart does on every surface',alternative:'A different release push could affect the distance',next:'Test both heights on a second surface while keeping the cart and release method alike',
        concept:['Which interaction helps the cart move down the ramp?','Earth pulling the cart downward','The cart deciding to move','The ruler pushing the cart'],conceptExplanation:'Gravity is an interaction between Earth and the cart. It helps the cart move down the sloping ramp.'},
      {id:'surface',title:'Two Runout Surfaces',factor:'floor surface',measure:'distance rolled after leaving the ramp',unit:'cm',rows:[['Rough mat',18,20,19],['Smooth board',46,44,45]],kind:'test',
        summary:'One cart rolls from a fixed ramp onto a rough mat or a smooth board. Ramp height, cart, and release method stay the same. Distance is measured from the ramp end.',
        fixed:'Keep ramp height, cart, and release method alike',conclusion:'The cart rolled farther on the smooth board in these trials',limit:'The results apply to these surfaces and this cart, not all materials',alternative:'A different ramp height could change the distance',next:'Repeat the surface comparison with another cart, keeping its ramp height and release method alike',
        concept:['What can friction between a cart and a surface do?','Resist the cart’s motion','Make the cart’s mass disappear','Prevent gravity from acting'],conceptExplanation:'Friction can resist relative motion. These observations compare the cart’s travel on two particular surfaces.'},
      {id:'push',title:'A Launcher’s Two Settings',factor:'launcher setting',measure:'distance traveled by the cart',unit:'cm',rows:[['Gentle setting',24,26,25],['Stronger setting',53,55,54]],kind:'test',
        summary:'A classroom launcher gives the same cart a gentle or stronger push along the same level track. The starting place, cart, and track stay the same.',
        fixed:'Use the same cart, track, and starting place',conclusion:'The stronger setting sent this cart farther in these trials',limit:'The data does not measure exact force or establish a universal distance rule',alternative:'Changing the track at the same time could affect the distance',next:'Test another cart at both settings on the same track and from the same start',
        concept:['What can a push change about an object?','Its motion','Whether it is living','The number of sides on a ruler'],conceptExplanation:'A push is a force that can change motion. Its effect depends on the object and other forces too.'},
      {id:'magnet',title:'The Magnet Gap Test',factor:'distance between a magnet and steel clips',measure:'steel clips moved',unit:'clips',rows:[['3 cm gap',1,2,1],['1 cm gap',4,3,4]],kind:'test',
        summary:'The same bar magnet is brought near the same four steel clips, with a 3 cm or 1 cm gap measured from magnet to clips. Each reading counts clips that visibly move. Magnet orientation, clip arrangement, and starting positions stay the same.',
        fixed:'Keep the magnet, its orientation, clip arrangement, and starting positions the same',conclusion:'More clips moved at the near gap in these trials',limit:'These readings apply to this magnet and these steel clips, not every material',alternative:'A changed magnet orientation or clip arrangement could affect movement',next:'Repeat at several measured gaps while keeping the magnet and clip layout alike',
        concept:['Which interaction can move a steel clip before the magnet touches it?','Magnetic force','Friction between the clip and table','Sound from the magnet'],conceptExplanation:'Magnetic forces can act without objects touching. The effect depends on the objects and their distance; not every material is magnetic.',
        sources:['https://www.nextgenscience.org/pe/3-ps2-3-motion-and-stability-forces-and-interactions']},
      {id:'helicopter',title:'Paper Helicopter Blades',factor:'paper helicopter blade length',measure:'time to reach the floor',unit:'seconds',rows:[['Short blades',1.2,1.1,1.3],['Long blades',2.4,2.2,2.5]],kind:'test',
        summary:'Paper helicopters with short or long blades are dropped from the same height without a push. The paper, body, and release method stay alike. Each value is one timed drop.',
        fixed:'Use the same paper, body design, drop height, and release method',conclusion:'The long-blade models took longer to reach the floor in these drops',limit:'Three drops of these two paper designs do not establish how every falling object moves',alternative:'A different release height or an added push could change the fall time',next:'Repeat more drops with several blade lengths while keeping the body and release height alike',
        concept:['What force from the air can resist a falling paper helicopter?','Air resistance','Magnetism','A force from the floor before it lands'],conceptExplanation:'Air resistance acts on objects moving through air. The measured times describe these paper models and do not show that air is the only force acting.',
        sources:['https://www.nextgenscience.org/pe/3-ps2-1-motion-and-stability-forces-and-interactions']},
    ],
    ecosystems:[
      {id:'seedlings',title:'Bean Plants and Light',factor:'light conditions',measure:'healthy green leaves per plant',unit:'leaves',rows:[['Little light',2,3,2],['Adequate light',7,8,7]],kind:'test',
        summary:'Matched bean plants are grown for two weeks with little or adequate light. Each value is one plant’s healthy green leaf count. Plant age, water, soil, and temperature are kept alike.',
        fixed:'Keep plant age, water, soil, and temperature alike',conclusion:'The adequately lit plants had more healthy green leaves in this trial',limit:'Leaf count alone does not measure every aspect of plant health',alternative:'Different watering could also affect plant health',next:'Repeat with more matched plants, comparing the same two light conditions',
        concept:['What do green plants use sunlight to help make?','Their own food','Their soil','Their pots'],conceptExplanation:'Green plants use light energy, water, and carbon dioxide to make sugars. Soil provides water and mineral nutrients, not ready-made plant food.'},
      {id:'shelter',title:'Woodlice Under Cover',factor:'shelter location',measure:'woodlice counted in equal-sized areas',unit:'woodlice',rows:[['Exposed area',2,4,3],['Under cover',11,13,12]],kind:'observation',
        summary:'Observers count woodlice in equal-sized exposed and covered areas on three mornings. They do not move the animals. Moisture and food may also differ between locations.',
        fixed:'Observe equal-sized areas for the same length of time',conclusion:'More woodlice were counted under cover in these observations',limit:'The observations do not isolate shelter from moisture or food',alternative:'Moisture or food could differ between locations',next:'Compare more locations while also recording moisture, food, and shelter',
        concept:['Why can a habitat be suitable for one organism but not another?','Organisms have different needs','Every organism needs exactly the same conditions','A habitat must contain only one kind of organism'],conceptExplanation:'Different organisms need different resources and conditions. Habitat suitability depends on the organism, not just the location’s name.'},
      {id:'flowers',title:'Bee Visits to Flower Patches',factor:'flower patch',measure:'bee visits in ten minutes',unit:'visits',rows:[['Patch A',3,5,4],['Patch B',10,12,11]],kind:'observation',
        summary:'Observers record visits, not individual bee identities, in two equal-sized flower patches during three ten-minute sessions. Plant type and flower number may differ.',
        fixed:'Use equal areas and equal observation times',conclusion:'Patch B received more bee visits during these sessions',limit:'Visits are not a count of all bees or proof that one plant feature caused the difference',alternative:'Flower number, flower type, or nearby shelter could affect visits',next:'Record flower types and numbers across more patches and observation sessions',
        concept:['Which flower resource do many bees collect for food?','Nectar or pollen','Plastic labels','Stones'],conceptExplanation:'Many bees collect nectar and pollen. Different bee species and flowering plants can interact in different ways.'},
      {id:'watering',title:'Water for Bean Seedlings',factor:'water supplied per day',measure:'new leaves per plant after two weeks',unit:'leaves',rows:[['20 mL/day',2,3,2],['40 mL/day',6,7,6]],kind:'test',
        summary:'Same-age bean seedlings receive 20 mL or 40 mL of water each day for two weeks. Light, soil, containers, and temperature stay alike. Each value is one plant.',
        fixed:'Keep seedling age, light, soil, container, and temperature alike',conclusion:'The seedlings given 40 mL/day had more new leaves than those given 20 mL/day in this trial',limit:'Leaf count alone does not measure every aspect of plant health or show that more water is always better',alternative:'Differences among individual seedlings could affect leaf counts',next:'Repeat with more seedlings and measured water amounts while keeping the other conditions alike',
        concept:['Which resource is supplied when a plant is watered and is needed for growth?','Water','Sunlight entering through the leaves','Soil itself'],conceptExplanation:'Plants use water in growth and acquire much of their growth material from air and water. A leaf count is only one measure of plant growth.',
        sources:['https://www.nextgenscience.org/pe/5-ls1-1-molecules-organisms-structures-and-processes']},
      {id:'ants',title:'Ant Visits to Food Stations',factor:'food at the station',measure:'ant visits in ten minutes',unit:'visits',rows:[['Plain water',2,3,2],['Sugar water',9,11,10]],kind:'test',
        summary:'A camera records ant visits to identical shallow stations containing plain water or the same pre-mixed sugar-water solution. Observation times and volumes are alike, and the station positions are swapped between trials. No ants are handled.',
        fixed:'Use identical stations, equal liquid volumes, equal observation times, and swap positions between trials',conclusion:'More ant visits were recorded at the sugar-water station in these trials',limit:'These short observations do not show the diet of every ant or the whole colony',alternative:'Nearby trails or food sources could affect which ants visit',next:'Repeat in another location with the same station setup and position swaps',
        concept:['Why might ants visit a food station?','To collect food','To measure the table','To change the weather'],conceptExplanation:'Ants forage for food, but visit counts alone do not tell us what every ant or the whole colony needs.',
        sources:['https://www.nextgenscience.org/pe/3-ls4-3-biological-evolution-unity-and-diversity']},
    ],
    weather:[
      {id:'rain',title:'Two Weeks of Rain Records',factor:'week observed',measure:'rainfall on three sampled days',unit:'mm',rows:[['Week A',2,4,3],['Week B',8,10,9]],kind:'observation',
        summary:'One rain gauge records rainfall on three sampled days in each of two weeks. Each column represents one sampled day, not the whole week. The gauge and its location stay the same.',
        fixed:'Use the same gauge, location, and measurement interval',conclusion:'The sampled days in Week B were wetter than those in Week A',limit:'Six sampled days cannot establish long-term climate or guarantee tomorrow’s rain',alternative:'Unrecorded days could change the comparison of whole-week totals',next:'Record every day over a longer period before comparing full weeks',
        concept:['Which instrument measures rainfall?','A rain gauge','A thermometer','A compass'],conceptExplanation:'A rain gauge collects precipitation to measure its depth, often in millimeters. A thermometer measures temperature.'},
      {id:'evaporation',title:'Water in Covered and Open Cups',factor:'whether a cup is covered',measure:'decrease in liquid water volume',unit:'mL',rows:[['Covered cups',1,2,1],['Open cups',7,9,8]],kind:'test',
        summary:'Six identical cups start with the same water volume and stay in the same room for one day. Three are covered and three are open. Nothing is poured or spilled. Each column is one cup.',
        fixed:'Keep cup size, starting volume, room conditions, and time alike',conclusion:'The open cups lost more liquid water than the covered cups in this trial',limit:'A volume decrease alone does not tell us the exact amount of vapor in the whole room',alternative:'A spill or unequal starting volumes could affect the readings',next:'Repeat with matched cups and record both starting and ending volumes',
        concept:['What is evaporation?','Liquid water changing into water vapor','Water vapor changing into liquid droplets','Water turning into soil'],conceptExplanation:'Evaporation changes liquid water into water vapor, a gas. Water vapor is not the visible tiny liquid droplets in a cloud.'},
      {id:'droplets',title:'Droplets Outside a Cup',factor:'outside surface temperature',measure:'droplets counted after five minutes',unit:'droplets',rows:[['Room-temperature cup',0,1,0],['Cold cup',9,11,10]],kind:'test',
        summary:'Dry, sealed cups of the same material sit in the same room. Three have a cold outer surface and three have a room-temperature surface. No water leaks through the cups. Each column is one cup.',
        fixed:'Use the same cup material, room air, and waiting time',conclusion:'More outside droplets formed on the cold cups in this trial',limit:'The droplets do not show that water leaked through the sealed cup',alternative:'Different room humidity could affect droplet formation',next:'Repeat the temperature comparison while recording room humidity',
        concept:['What process forms these droplets from water vapor in the air?','Condensation','Evaporation','Melting rock'],conceptExplanation:'Condensation changes water vapor into liquid water. In this setup, water comes from the surrounding air, not through the sealed cup.'},
      {id:'runoff',title:'Rain on Covered and Bare Soil',factor:'ground cover',measure:'water runoff after simulated rain',unit:'mL',rows:[['Grass-covered soil',36,34,38],['Bare soil',82,85,80]],kind:'test',
        summary:'Equal soil trays with the same slope and starting moisture receive 1 L of water poured evenly over five minutes. One tray has grass cover and one has bare soil. Runoff is collected for the same length of time.',
        fixed:'Keep soil amount, slope, starting moisture, rainfall, and collection time alike',conclusion:'The bare-soil tray produced more runoff in these trials',limit:'Small trays do not show what happens on every slope or during every storm',alternative:'Differences in how tightly the soil was packed could affect runoff',next:'Repeat with several matched trays and measure both runoff and carried sediment',
        concept:['What is runoff?','Water that flows over land','Water vapor changing into liquid','Rain stored inside a thermometer'],conceptExplanation:'Runoff is water that flows over the land surface. Moving water can carry soil and sediment; these tray results are a small model, not a universal landscape rule.',
        sources:['https://www.nextgenscience.org/pe/4-ess2-1-earths-systems']},
      {id:'wind',title:'Wind Near and Far from a Wall',factor:'location relative to a wall',measure:'wind speed',unit:'km/h',rows:[['Sheltered spot',4,5,4],['Open spot',11,10,12]],kind:'observation',
        summary:'A handheld anemometer records wind at a sheltered schoolyard spot and an open spot during three nearby time periods. The same instrument is held at the same height and direction.',
        fixed:'Use the same instrument, height, direction, and nearby observation times',conclusion:'Wind readings were higher at the open spot during these observations',limit:'One schoolyard and three time periods cannot describe typical wind everywhere or predict future weather',alternative:'The wall direction and small changes in wind over time could affect readings',next:'Repeat paired readings at both spots across more days while keeping instrument placement alike',
        concept:['Which tool measures wind speed?','Anemometer','Rain gauge','Thermometer'],conceptExplanation:'An anemometer measures wind speed. Repeated weather records can reveal local patterns, but short observations are not a reliable forecast by themselves.',
        sources:['https://www.nextgenscience.org/pe/3-ess2-1-earths-systems']},
    ],
  };
  const sources = {
    forces:[activities.forces.source],
    ecosystems:[activities.ecosystems.source,'https://www.nextgenscience.org/pe/5-ls1-1-molecules-organisms-structures-and-processes'],
    weather:[activities.weather.source,'https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle','https://www.usgs.gov/water-science-school/science/condensation-and-water-cycle'],
  };
  const bank = [];
  for (const [family, contexts] of Object.entries(scenarios)) {
    for (const context of contexts) {
      const low = context.rows[0], high = context.rows[1];
      const experimental = context.kind === 'test';
      const sets = [
        [
          [context.concept[0],context.concept.slice(1),context.conceptExplanation,['Look at the process or resource named in the notes.',context.conceptExplanation]],
          [`Which group has the larger readings in all three columns?`,[high[0],low[0],'Both groups have identical readings'],`${high[0]} has readings ${high.slice(1).join(', ')} ${context.unit}; each exceeds the corresponding reading for ${low[0]}.`,['Compare the two rows one column at a time.',`Compare ${high[1]} with ${low[1]} first.`]],
          [`What is being measured in this table?`,[context.measure,context.factor,'The investigator’s favorite result'],`The outcome recorded is ${context.measure}, in ${context.unit}.`,['Check the table caption and its units.',`The unit is ${context.unit}.`]],
          [`What is the first reading for ${low[0]}?`,[`${low[1]} ${context.unit}`,`${high[1]} ${context.unit}`,`${low[2] + high[2]} ${context.unit}`],`The first numeric column in the ${low[0]} row is ${low[1]} ${context.unit}.`,['Find the named row, then the first numeric column.',`Do not use the other group’s first reading (${high[1]}).`]],
        ],
        [
          [`Which question can these records help answer?`,[`How does ${context.measure} compare between ${low[0]} and ${high[0]}?`,'What happens to every organism and object in the world?','What did the investigator want the answer to be?'],`The records compare ${context.measure} in these two groups. They do not answer unlimited questions.`,['Name the groups and the measurement actually shown.', 'A question needs observations that could help answer it.']],
          [`Which measurement practice makes the comparison more useful?`,[context.fixed,'Change every condition and the measuring method at once','Record only the largest value and hide the rest'],context.fixed + '. Comparable methods make the readings more useful.', ['Different measuring methods can make a comparison unfair.', 'Choose the practice that keeps measurement conditions comparable.']],
          [`Why keep three readings for each group?`,['To see whether a pattern is consistent or variable','To guarantee every future reading will be identical','To remove the need for units'],`Several readings reveal variation. In ${context.title}, the pattern appears across all three recorded columns.`,['Look at small differences within each row.', 'Repeated or matched observations can show whether a single value is unusual.']],
          [`Which statement accurately summarizes the table?`,[context.conclusion,'Every reading in both groups is equal','The table gives no measurement information'],context.conclusion + '. This summary stays close to the observed pattern.', ['Use all of the readings, not an unsupported guess.', 'The second row has consistently larger readings.']],
        ],
        [
          [`Which evidence most directly supports the comparison?`,[`${high[0]}: ${high.slice(1).join(', ')}; ${low[0]}: ${low.slice(1).join(', ')} ${context.unit}`,'The title sounds interesting','The investigator likes the second group'],`Actual readings support a claim about measurements; a preference or title does not.`,['Evidence should connect directly to what the claim says.', 'Look for the complete set of measured values.']],
          [`Which limit should accompany the conclusion?`,[context.limit,'These readings prove the same result in every possible setting','A larger reading means no more questions are needed'],context.limit + '.', ['Ask what was not measured or tested.', 'A small, specific record cannot support an unlimited claim.']],
          [`Can these records alone establish a universal cause-and-effect rule?`,[experimental ? 'No; this controlled setup supports a bounded conclusion, not a universal rule' : 'No; the observations do not isolate all other differences','Yes; three readings rule out every other explanation','No; numerical data can never help investigate causes'],experimental ? 'Keeping relevant conditions alike strengthens a test, but its results still have a limited scope.' : 'An observed association may have more than one explanation. Other differences need investigation.', ['Check whether conditions were controlled and how widely the result applies.', 'Neither a small test nor an observational comparison proves every possible case.']],
          [`What is the difference between the second readings of the two groups?`,[`${high[2] - low[2]} ${context.unit}`,`${high[2] + low[2]} ${context.unit}`,`${high[2]} ${context.unit}`],`${high[2]} − ${low[2]} = ${high[2] - low[2]} ${context.unit}. A difference compares values; it does not by itself explain their cause.`,['Use the second numeric column in each row.', 'Subtract the smaller reading from the larger reading.']],
        ],
        [
          [`Which follow-up would most usefully strengthen the evidence?`,[context.next,'Repeat only the larger-reading group and assume the comparison stays the same','Compare a new group while also switching measuring methods'],context.next + '. New, relevant observations can test the scope of the pattern.', ['Choose a follow-up that collects relevant new information.', 'A useful comparison needs evidence about both conditions and consistent methods.']],
          [`Which alternative explanation or missing detail deserves checking?`,[context.alternative,'The groups must have different units, even though the table uses one unit','Having three readings per group makes the groups impossible to compare'],context.alternative + '. Check relevant conditions before deciding how strong a causal explanation is.', ['Look for something that could affect the measured outcome.', 'Repeated readings in a common unit help comparison; they are not competing causes.']],
          [`How should a scientist handle a new reading that does not fit the pattern?`,['Keep it, check the method, and collect more evidence','Automatically exclude it because it is far from the other readings','Replace it with the average of the earlier readings before recording it'],`An unexpected reading can reveal variation, a measurement error, or an incomplete explanation. Check, document, and investigate it.`,['Evidence is useful even when it challenges an idea.', 'An unusual reading needs investigation, not automatic exclusion or replacement.']],
          [`Which conclusion would still be responsible if a later trial differed?`,['Describe the original pattern and explain the new uncertainty','Declare the original pattern false everywhere because one later reading differed','Treat the original pattern as certain because it had repeated readings'],`Conclusions can be revised as evidence grows. Keep the original result, acknowledge new information, and investigate differences.`,['Scientific explanations can change with new evidence.', 'One difference does not settle every case, and repeated readings do not remove all uncertainty.']],
        ],
      ];
      sets.forEach((items, level) => items.forEach(([prompt,options,explanation,hints], item) => {
        bank.push({id:`${family}-${context.id}-L${level + 1}-Q${item + 1}`,family,level:level + 1,type:'choice',prompt,options,answer:0,explanation,hints,context,
          rationales:options.map((text,index) => index === 0 ? explanation : `“${text}” does not answer this question using the stated evidence. ${hints[0]}`),
          objective:levels[level].description,sources:context.sources || sources[family],dataProvenance:'Original illustrative classroom data, not real measurements or a live simulation.',version:2,reviewStatus:'Authored; independent educator review pending'});
      }));
    }
  }
  function chooseRound(family, level, recent = [], random = Math.random) {
    const eligible = bank.filter(task => task.family === family && task.level === level);
    let pool = eligible.filter(task => !recent.includes(task.id));
    if (pool.length < 6) pool = eligible;
    function shuffled(items) {
      const copy = [...items];
      for (let index = copy.length - 1; index > 0; index--) {
        const other = Math.floor(random() * (index + 1));
        [copy[index],copy[other]] = [copy[other],copy[index]];
      }
      return copy;
    }
    return shuffled(pool).slice(0,6).map(task => {
      const choices = shuffled(task.options.map((text,index) => ({text,rationale:task.rationales[index],correct:index === task.answer})));
      return {...task,options:choices.map(choice => choice.text),rationales:choices.map(choice => choice.rationale),answer:choices.findIndex(choice => choice.correct)};
    });
  }
  function createPreview(family, level, recent = [], random = Math.random) {
    return {family,level,tasks:chooseRound(family,level,recent,random)};
  }
  function tasksForRound(family, level, recent = [], preview = null, random = Math.random) {
    if (preview?.family === family && preview.level === level) return preview.tasks;
    return chooseRound(family,level,recent,random);
  }
  const storageKey = 'learningPlayground.science.v1';
  const badgeDefinitions = [
    {id:'first',icon:'🔬',name:'First Investigation',description:'Complete a Science round'},
    {id:'explorer',icon:'🌍',name:'Science Explorer',description:'Complete a round in all three activities'},
    {id:'persistent',icon:'🛠️',name:'Persistent Investigator',description:'Revise an incorrect answer successfully'},
    {id:'challenger',icon:'🚀',name:'Challenger',description:'Complete a level-4 round'},
  ];
  let api = null, state = null, round = null, preview = null, launchPreview = null;
  function initialState() {
    return {version:1,level:1,stars:0,badges:{},done:{},results:{},best:{},recent:{},timers:{},latest:{},legacy:null,legacyImported:true};
  }
  const validLevel = value => Number.isInteger(value) && value >= 1 && value <= 4;
  const validMode = value => ['off','stopwatch','countdown'].includes(value);
  function validResult(result) {
    return result && Object.hasOwn(activities,result.family) && validLevel(result.level) && validMode(result.mode) &&
      Number.isFinite(result.date) && Number.isFinite(result.seconds) && result.seconds >= 0 && result.total === 6 &&
      Number.isInteger(result.independent) && Number.isInteger(result.supported) && result.independent >= 0 && result.supported >= 0 && result.independent + result.supported === 6 &&
      Array.isArray(result.taskIds) && result.taskIds.length === 6 && new Set(result.taskIds).size === 6 && result.taskIds.every(id => bank.some(task => task.id === id && task.family === result.family && task.level === result.level));
  }
  function loadState() {
    const fresh = initialState();
    try {
      const text = localStorage.getItem(storageKey);
      const saved = text && text.length <= 200000 ? JSON.parse(text) : null;
      if (saved?.version === 1) {
        if (validLevel(saved.level)) fresh.level = saved.level;
        if (Number.isSafeInteger(saved.stars) && saved.stars >= 0) fresh.stars = saved.stars;
        for (const badge of badgeDefinitions) if (Number.isFinite(saved.badges?.[badge.id])) fresh.badges[badge.id] = saved.badges[badge.id];
        for (const family of Object.keys(activities)) {
          if (validMode(saved.timers?.[family])) fresh.timers[family] = saved.timers[family];
          for (let level = 1; level <= 4; level++) {
            const key = `${family}-${level}`;
            if (Number.isSafeInteger(saved.done?.[key]) && saved.done[key] >= 0) fresh.done[key] = saved.done[key];
            const result = saved.results?.[key];
            if (validResult(result) && result.family === family && result.level === level) fresh.results[key] = result;
            const eligibleIds = new Set(bank.filter(task => task.family === family && task.level === level).map(task => task.id));
            if (Array.isArray(saved.recent?.[key])) fresh.recent[key] = [...new Set(saved.recent[key].filter(id => eligibleIds.has(id)))].slice(-6);
            for (const mode of ['stopwatch','countdown']) {
              const bestKey = `${key}-${mode}`;
              if (Number.isFinite(saved.best?.[bestKey]) && saved.best[bestKey] > 0) fresh.best[bestKey] = saved.best[bestKey];
            }
          }
          const latest = saved.latest?.[family];
          if (typeof latest === 'string' && fresh.results[latest]?.family === family) fresh.latest[family] = latest;
        }
        if (saved.legacy && ['support','core','stretch'].includes(saved.legacy.mode) && Number.isInteger(saved.legacy.total) && saved.legacy.total > 0 && saved.legacy.total <= 8 && Number.isFinite(saved.legacy.date)) fresh.legacy = saved.legacy;
      } else {
        const legacy = api.legacy();
        if (legacy.result) fresh.legacy = {...legacy.result};
        fresh.level = {support:1,core:2,stretch:3}[legacy.mode] || 1;
      }
    } catch { api.storageFailure(); }
    return fresh;
  }
  function saveState() {
    try { localStorage.setItem(storageKey,JSON.stringify(state)); }
    catch { api.storageFailure(); }
  }
  function init(helpers) {
    api = helpers; state = loadState(); saveState();
  }
  function stop() { round = null; preview = null; launchPreview = null; }
  function startRound(family, preparedPreview = null) {
    const level = state.level, key = `${family}-${level}`;
    const tasks = tasksForRound(family,level,state.recent[key] || [],preparedPreview);
    preview = null;
    state.recent[key] = tasks.map(task => task.id); saveState();
    round = {family,level,tasks,index:0,records:[],attempts:0,hints:level === 1 ? 1 : 0,solved:false,complete:false,finalized:false,mode:'off'};
    renderRound(); api.show('mission'); api.focusHeading();
  }
  function landingReferences() {
    const {el} = api;
    return el('section', {id:'scienceLandingReferences'},el('h3', {}, 'Science topic references'),...Object.keys(activities).map(family => {
      const labels = family === 'weather' ? ['NGSS weather data','USGS evaporation','USGS condensation'] : family === 'ecosystems' ? ['NGSS habitat evidence','NGSS plant growth'] : ['NGSS forces and investigations'];
      return el('div', {class:'science-references'},el('span', {}, `${activities[family].title}: `),...sources[family].map((href,index) => el('a', {href},labels[index])));
    }));
  }
  function chart(context, preview = false) {
    const {el} = api;
    const canvas = el('canvas', {class:'science-chart',width:'680',height:'300','aria-hidden':'true'});
    const ctx = canvas.getContext('2d');
    if (!ctx) return canvas;
    ctx.scale(2,2); ctx.fillStyle = '#e5f3ed'; ctx.fillRect(0,0,340,150);
    const maximum = Math.max(...context.rows.flatMap(row => row.slice(1)),1);
    ctx.fillStyle = '#37474f'; ctx.font = 'bold 12px Trebuchet MS'; ctx.fillText(preview ? context.title : `Recorded values (${context.unit})`,14,20);
    context.rows.forEach((row,group) => row.slice(1).forEach((value,index) => {
      const horizontal = 30 + (group * 3 + index) * 48;
      const height = value / maximum * 78;
      ctx.fillStyle = group ? '#d47836' : '#007b83'; ctx.fillRect(horizontal,114-height,28,height);
      ctx.fillStyle = '#37474f'; ctx.fillText(String(value),horizontal + 6,Math.max(33,107-height));
    }));
    ctx.font = '11px Trebuchet MS'; ctx.fillText(context.rows[0][0],20,135); ctx.fillText(context.rows[1][0],178,135);
    return canvas;
  }
  function levelSelector(onSelect) {
    const {el} = api;
    return el('div', {class:'levels science-levels'}, ...levels.map((level,index) => el('button', {class:'card level' + (state.level === index + 1 ? ' sel' : ''),'aria-pressed':String(state.level === index + 1),onclick:() => {
      state.level = index + 1; saveState(); onSelect();
      document.querySelector('.screen.active .level.sel')?.focus({preventScroll:true});
    }}, el('span', {class:'big'}, level.icon),el('b', {}, `Level ${index + 1}: ${level.name}`),el('small', {}, level.description))));
  }
  function questionPreview(tasks) {
    const {el} = api;
    return el('section', {class:'science-question-preview','aria-labelledby':'sciencePreviewHeading'},
      el('h2', {id:'sciencePreviewHeading'}, 'Upcoming questions'),
      el('p', {class:'quiet',role:'status'}, `Preview for Level ${state.level}. Starting the round uses these six questions.`),
      el('ol', {}, ...tasks.map(task => el('li', {},el('p', {},task.prompt)))));
  }
  function hub() {
    const {el,$} = api, root = $('#subject');
    root.replaceChildren(api.subjectBackBar('🔬 Science'),
      el('div', {class:'science-welcome'}, el('div', {class:'mascot','aria-hidden':'true'}, '🔬'),el('div', {},el('h2', {}, `What will you discover, ${api.name()}?`),el('p', {}, 'Look closely. Follow the evidence. Try another explanation.'))),
      el('h2', {}, 'Pick an investigation'));
    const tiles = el('div', {class:'subject-grid science-activities'});
    Object.entries(activities).forEach(([family,activity]) => {
      const result = state.results[state.latest[family]];
      tiles.append(el('button', {class:'subject-tile',style:`--accent:${activity.color}`,onclick:() => api.navigate(`science/${family}`)},chart(scenarios[family][0],true),
        el('span', {class:'subject-copy'},el('b', {}, `${activity.icon} ${activity.title}`),el('small', {}, activity.description),
          result ? el('small', {class:'quiet'}, `Last round: Level ${result.level} · ${result.independent}/6 independent`) : null,
          el('small', {class:'tile-action'}, result ? 'Play again →' : 'Investigate →'))));
    });
    root.append(tiles,el('div', {class:'science-summary'},el('strong', {}, `⭐ ${state.stars} Science stars`),el('span', {}, `${Object.values(state.done).reduce((sum,value) => sum + value,0)} rounds completed`),
      el('button', {class:'btn small',style:'background:#98631a',onclick:() => api.navigate('science/trophies')}, '🏆 Science trophies')),
      el('p', {class:'quiet'}, 'Choose a challenge level for each investigation. Stars celebrate completed questions; independent answers are recorded separately. Original illustrative data; independent educator review is pending.'));
    api.show('subject'); api.focusHeading();
  }
  function preparation(family) {
    const {el,$} = api, activity = activities[family];
    launchPreview = null;
    const key = `${family}-${state.level}`;
    preview = createPreview(family,state.level,state.recent[key] || []);
    const root = $('#subject');
    root.replaceChildren(el('div', {class:'bar'},el('button', {class:'btn small',onclick:() => api.navigate('science')}, '← Science'),el('h1', {}, `${activity.icon} ${activity.title}`)),
      el('p', {}, activity.description),el('h2', {}, 'Challenge level'),levelSelector(() => preparation(family)),questionPreview(preview.tasks));
    root.append(el('div', {class:'row',style:'justify-content:flex-start'},el('button', {class:'btn',style:`background:${activity.color}`,onclick:() => {
      launchPreview = preview;
      api.navigate(`science/${family}/play`);
    }}, 'Start round →')),
      el('p', {class:'quiet'}, 'Six questions per round. The questions shown above are used when you start. Unfinished answers are not restored after leaving or reloading.'));
    if (state.latest[family]) root.append(el('a', {href:`#science/${family}/results`}, 'View last results'));
    api.show('subject'); api.focusHeading();
  }
  function evidence(task) {
    const {el} = api, context = task.context;
    return el('aside', {class:'evidence',style:`--accent:${activities[task.family].color}`,'aria-label':'Investigation evidence'},el('h2', {}, context.title),
      el('p', {}, context.summary),chart(context),
      el('table', {class:'data-table'},el('caption', {}, `${context.measure} (${context.unit}); readings 1–3`),el('thead', {},el('tr', {},...['Group','1','2','3'].map((text,index) => el('th', {scope:'col','aria-label':index ? `Reading ${index}` : 'Group'},text)))),
        el('tbody', {},...context.rows.map(row => el('tr', {},el('th', {scope:'row'},row[0]),...row.slice(1).map(value => el('td', {},value)))))),
      el('p', {class:'quiet'}, task.dataProvenance),el('details', {},el('summary', {}, 'Scientific background'),el('p', {}, context.conceptExplanation)));
  }
  function renderRound() {
    if (!round) return;
    const {el,$} = api, current = round, currentIndex = current.index, task = current.tasks[current.index], activity = activities[current.family], root = $('#mission');
    root.replaceChildren(el('div', {class:'bar'},el('button', {class:'btn small',onclick:() => {
      if (confirm('Leave this round? Earned stars stay saved, but unfinished answers will not be restored.')) api.navigate('science');
    }}, '← Science'),el('h1', {}, activity.title)),
      el('div', {class:'mission-status'},el('span', {}, `Question ${current.index + 1} of 6 · Level ${current.level}`),el('span', {id:'scienceRoundStars'}, `⭐ ${state.stars} Science stars`),
        el('progress', {id:'scienceProgress',max:'6',value:String(current.records.length),'aria-label':'Science questions completed'})));
    const bench = el('section', {class:'workbench','aria-label':'Science question'},el('h2', {id:'sciencePrompt'},task.prompt));
    if (current.level === 1) bench.append(el('p', {class:'quiet'}, 'Example: to compare measurements, name the groups, read the same column, and keep the units.'));
    const choices = el('div', {class:'choices',role:'group','aria-labelledby':'sciencePrompt'});
    task.options.forEach((text,index) => {
      const button = el('button', {class:'choice' + (current.solved && index === task.answer ? ' correct' : ''),onclick:() => {
        if (round !== current || current.index !== currentIndex || current.solved || current.finalized) return;
        if (index !== task.answer) {
          current.attempts++; api.SND.bad();
          choices.querySelectorAll('button').forEach(choice => choice.classList.remove('selected'));
          button.classList.add('selected'); $('#scienceFeedback').textContent = 'Not yet. ' + task.rationales[index] + ' Try again.'; return;
        }
        current.solved = true;
        current.records.push({id:task.id,independent:current.hints === 0 && current.attempts === 0,supported:current.hints > 0 || current.attempts > 0});
        state.stars++;
        $('#scienceRoundStars').textContent = `⭐ ${state.stars} Science stars`;
        $('#scienceProgress').value = current.records.length;
        if (current.attempts > 0) unlock('persistent');
        saveState(); api.updateHeader(); api.SND.ok();
        choices.querySelectorAll('button').forEach(choice => choice.disabled = true); button.classList.add('correct');
        $('#scienceHint').disabled = true; $('#scienceFeedback').textContent = 'That works! ' + task.explanation;
        $('#scienceNext').hidden = false; $('#scienceNext').focus({preventScroll:true});
      }},text);
      button.disabled = current.solved; choices.append(button);
    });
    const hint = el('button', {class:'btn small',id:'scienceHint',onclick:() => {
      if (round !== current || current.index !== currentIndex || current.solved) return;
      current.hints = Math.min(2,current.hints + 1); $('#scienceFeedback').textContent = `Hint ${current.hints}: ${task.hints[current.hints - 1]}`;
      hint.disabled = current.hints === 2;
    }}, '💡 Hint');
    hint.disabled = current.solved || current.hints >= 2;
    const next = el('button', {class:'btn',id:'scienceNext',style:`background:${activity.color}`,onclick:() => {if (current.index === currentIndex) advance(current);}},current.index === 5 ? 'See results →' : 'Next question →');
    next.hidden = !current.solved;
    bench.append(choices,el('div', {id:'scienceFeedback',class:'feedback',role:'status','aria-live':'polite','aria-atomic':'true'},current.solved ? 'That works! ' + task.explanation : current.level === 1 ? 'Hint 1: ' + task.hints[0] : ''),
      el('div', {class:'row',style:'justify-content:flex-start'},hint,next));
    root.append(el('div', {class:'mission-layout'},evidence(task),bench));
  }
  function unlock(id) {
    if (state.badges[id]) return;
    state.badges[id] = Date.now();
    const badge = badgeDefinitions.find(item => item.id === id);
    api.toast(`Science badge: ${badge.icon} ${badge.name}`);
  }
  function advance(current) {
    if (round !== current || !current.solved || current.finalized) return;
    if (current.index < 5) {
      current.index++; current.solved = false; current.attempts = 0; current.hints = current.level === 1 ? 1 : 0;
      renderRound(); const heading = api.$('#sciencePrompt'); heading.tabIndex = -1; heading.focus({preventScroll:true}); return;
    }
    current.finalized = true; current.complete = true;
    const key = `${current.family}-${current.level}`;
    const result = {family:current.family,level:current.level,total:6,independent:current.records.filter(record => record.independent).length,supported:current.records.filter(record => record.supported).length,mode:'off',seconds:0,date:Date.now(),taskIds:current.tasks.map(task => task.id)};
    state.done[key] = (state.done[key] || 0) + 1; state.results[key] = result; state.latest[current.family] = key;
    if (current.mode !== 'off' && result.seconds > 0) {
      const bestKey = `${key}-${current.mode}`;
      if (!state.best[bestKey] || result.seconds < state.best[bestKey]) state.best[bestKey] = result.seconds;
    }
    unlock('first');
    if (Object.keys(activities).every(family => [1,2,3,4].some(level => state.done[`${family}-${level}`]))) unlock('explorer');
    if (current.level === 4) unlock('challenger');
    saveState(); api.SND.win(); api.confetti(); api.navigate(`science/${current.family}/results`);
  }
  function results(family) {
    const {el,$} = api, result = state.results[state.latest[family]], root = $('#mission');
    root.replaceChildren(api.subjectBackBar(`${activities[family].icon} Investigation results`));
    if (!result) {
      root.append(el('p', {}, 'No completed round for this activity yet.'),el('button', {class:'btn',onclick:() => api.navigate(`science/${family}`)}, 'Start an investigation →'));
    } else {
      root.append(el('h2', {}, 'Investigation complete!'),el('p', {}, `${activities[family].title} · Level ${result.level}: ${levels[result.level - 1].name}`),
        el('div', {class:'result-metrics'},...[[6,'Questions completed'],[result.independent,'Independent answers'],[result.supported,'With hints / retries']].map(([value,label]) => el('div', {},el('strong', {},value),el('span', {},label)))),
        el('p', {}, `⭐ Six participation stars earned · ${result.mode === 'off' ? 'Untimed' : (result.mode === 'stopwatch' ? 'Stopwatch: ' : 'Finished in: ') + api.fmt(result.seconds)}`),
        el('p', {class:'quiet'}, 'Stars celebrate correct completion, including revisions. This is not a mastery score. A new round uses different questions when the bank allows; deliberate replays can earn participation stars again.'),
        el('div', {class:'row',style:'justify-content:flex-start'},el('button', {class:'btn',style:`background:${activities[family].color}`,onclick:() => {state.level = result.level;saveState();api.navigate(`science/${family}/play`);}}, 'New round →'),
          el('button', {class:'btn',onclick:() => api.navigate('science')}, 'Choose an investigation →')),
        el('details', {class:'science-review'},el('summary', {}, 'Review the latest round'),...reviewRows(result)));
    }
    api.show('mission'); api.focusHeading();
  }
  function reviewRows(result) {
    const {el} = api;
    const tasks = Array.isArray(result.taskIds) ? result.taskIds : [];
    return tasks.map(id => bank.find(task => task.id === id)).filter(Boolean).map(task => el('div', {},el('h3', {}, task.prompt),el('p', {},task.options[task.answer]),el('p', {class:'quiet'},task.explanation)));
  }
  function trophies() {
    const {el,$} = api, root = $('#subject');
    root.replaceChildren(api.subjectBackBar('🏆 Science trophies'),el('h2', {}, `⭐ ${state.stars} Science stars`),
      el('p', {}, 'Science rewards are separate from Math rewards.'),el('div', {class:'badges'},...badgeDefinitions.map(badge => el('article', {class:'card badge science-badge'},
        el('span', {class:'big','aria-hidden':'true'},badge.icon),el('b', {},badge.name),el('p', {},state.badges[badge.id] ? '✓ Earned' : 'Not earned yet'),el('small', {},badge.description)))));
    const table = el('table', {class:'data-table'},el('caption', {}, 'Science round records'),el('thead', {},el('tr', {},...['Activity / level','Rounds','Best stopwatch','Best countdown finish'].map(text => el('th', {scope:'col'},text)))));
    const body = el('tbody');
    for (const [family,activity] of Object.entries(activities)) for (let level = 1; level <= 4; level++) {
      const key = `${family}-${level}`;
      body.append(el('tr', {},el('th', {scope:'row'},`${activity.title} · ${level}`),el('td', {},state.done[key] || 0),el('td', {},state.best[key + '-stopwatch'] ? api.fmt(state.best[key + '-stopwatch']) : '—'),el('td', {},state.best[key + '-countdown'] ? api.fmt(state.best[key + '-countdown']) : '—')));
    }
    table.append(body);root.append(el('div', {class:'science-records'},table));
    if (state.legacy) root.append(el('details', {},el('summary', {}, 'Your previous Ramp Investigation'),el('p', {},`${state.legacy.total} steps completed in the original ${state.legacy.mode} mission on ${new Date(state.legacy.date).toLocaleDateString()}. Preserved as a legacy record; no retrospective stars or badges added.`)));
    root.append(el('div', {class:'row',style:'justify-content:flex-start'},el('button', {class:'btn small',onclick:() => {
      if (!confirm('Reset Science stars, badges, and records on this browser? Math and future-subject progress will stay.')) return;
      state = initialState();saveState();api.updateHeader();trophies();
    }}, 'Reset Science progress')));api.show('subject');api.focusHeading();
  }
  function handleRoute(path) {
    if (!api || !state) return false;
    if (path === 'science') {launchPreview = null;hub();return true;}
    if (path === 'science/trophies') {launchPreview = null;trophies();return true;}
    if (path === 'science/mission') {startRound('forces');return true;}
    if (path === 'science/results') {
      if (!state.latest.forces && state.legacy) {
        const {el,$} = api;
        $('#mission').replaceChildren(api.subjectBackBar('Previous Ramp Investigation'),el('p', {},`${state.legacy.total} steps completed in the original ${state.legacy.mode} mission. This saved record has not been converted into Science stars.`),el('button', {class:'btn',onclick:() => api.navigate('science')}, 'Explore Science →'));
        api.show('mission');api.focusHeading();
      } else results('forces');
      return true;
    }
    const parts = path.split('/');
    if (parts[0] !== 'science' || !Object.hasOwn(activities,parts[1])) return false;
    if (parts.length === 2) {preparation(parts[1]);return true;}
    if (parts.length === 3 && parts[2] === 'play') {
      const preparedPreview = launchPreview;
      launchPreview = null;
      startRound(parts[1],preparedPreview);
      return true;
    }
    if (parts.length === 3 && parts[2] === 'results') {results(parts[1]);return true;}
    return false;
  }
  return {levels,activities,bank,chooseRound,createPreview,tasksForRound,init,stop,handleRoute,landingReferences,get state(){return state;},get round(){return round;}};
})();