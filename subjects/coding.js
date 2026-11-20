'use strict';
const CodingSubject = (() => {
  const levels = [
    {name:'Step Explorer',description:'Follow and put instructions in order'},
    {name:'Bug Finder',description:'Trace moves and spot a mistake'},
    {name:'Pattern Builder',description:'Use repeats and simple conditions'},
    {name:'Code Challenger',description:'Test rules and improve solutions'},
  ];
  const activities = {
    robot:{title:'Robot Routes',description:'Build, run, and repair a robot program.'},
    patterns:{title:'Pattern Lab',description:'Follow and test patterns, loops, and rules.'},
    digital:{title:'Digital Detective',description:'Make thoughtful choices with devices and online information.'},
    bits:{title:'Binary Lightboard',description:'Switch bits on and off to make numbers.'},
    sorting:{title:'Data Sorter',description:'Analyze a data table and rank the results.'},
    cipher:{title:'Secret Code Studio',description:'Make and crack playful letter-shift codes.'},
  };
  const directions = {N:[0,-1],E:[1,0],S:[0,1],W:[-1,0]};
  const boards = [
    [
      {goal:[2,3],walls:[],solution:[['E',2]],starter:[]},
      {goal:[0,1],walls:[],solution:[['N',2]],starter:[]},
      {goal:[1,2],walls:[],solution:[['E',1],['N',1]],starter:[]},
      {goal:[3,3],walls:[],solution:[['E',3]],starter:[]},
      {goal:[0,0],walls:[],solution:[['N',3]],starter:[]},
      {goal:[2,2],walls:[],solution:[['E',2],['N',1]],starter:[]},
    ],
    [
      {goal:[2,3],walls:[[1,3]],solution:[['N',1],['E',2],['S',1]],starter:[['E',2]]},
      {goal:[2,3],walls:[[0,2]],solution:[['E',1],['N',1],['E',1],['S',1]],starter:[['N',1]]},
      {goal:[0,1],walls:[[0,2]],solution:[['E',1],['N',2],['W',1]],starter:[['N',2]]},
      {goal:[2,0],walls:[[0,2],[2,1]],solution:[['E',1],['N',3],['E',1]],starter:[['E',1],['N',3]]},
      {goal:[3,2],walls:[[2,3]],solution:[['N',1],['E',3]],starter:[['N',1]]},
      {goal:[1,0],walls:[[0,2],[2,2]],solution:[['E',1],['N',3]],starter:[['E',1],['N',2]]},
    ],
    [
      {goal:[3,0],walls:[[1,3]],solution:[['N',1],['E',3],['N',2]],starter:[]},
      {goal:[3,3],walls:[[1,3]],solution:[['N',1],['E',2],['S',1],['E',1]],starter:[]},
      {goal:[0,0],walls:[[0,2]],solution:[['E',1],['N',3],['W',1]],starter:[]},
      {goal:[3,1],walls:[[2,3],[2,1]],solution:[['N',1],['E',3],['N',1]],starter:[['N',1],['E',2]]},
      {goal:[1,1],walls:[[0,2],[2,2]],solution:[['E',1],['N',2]],starter:[['E',1]]},
      {goal:[2,0],walls:[[1,3]],solution:[['N',1],['E',2],['N',2]],starter:[['N',1],['E',2]]},
    ],
    [
      {goal:[3,0],walls:[[1,3]],solution:[['N',1],['E',3],['N',2]],starter:[['E',1]]},
      {goal:[3,3],walls:[[1,3]],solution:[['N',1],['E',2],['S',1],['E',1]],starter:[['E',2]]},
      {goal:[0,0],walls:[[0,2]],solution:[['E',1],['N',3],['W',1]],starter:[['N',3]]},
      {goal:[3,0],walls:[[0,2],[2,2]],solution:[['E',1],['N',3],['E',2]],starter:[['E',1],['N',3]]},
      {goal:[3,0],walls:[[1,3],[2,2]],solution:[['N',2],['E',3],['N',1]],starter:[['N',2],['E',2]]},
      {goal:[1,0],walls:[[0,2],[2,1]],solution:[['E',1],['N',3]],starter:[['E',1],['N',2]]},
    ],
  ];
  const bank = boards.flatMap((group,levelIndex) => group.map((board,index) => {
    const level = levelIndex + 1;
    const solution = board.solution.map(([direction,count]) => `${direction} ${count}`).join(', ');
    return {id:`robot-L${level}-Q${index + 1}`,family:'robot',level,type:'robot',...board,
      prompt:board.starter.length ? 'Fix the program and deliver the robot to the star.' : 'Build a program that delivers the robot to the star.',
      hints:['Trace one move at a time and avoid blocked squares.',`One route uses: ${solution}.`],
      explanation:'The program reached the star without entering a wall or leaving the grid. Other routes may also work.'};
  }));
  const rows = {
    patterns:[
      [
        ['A robot does these steps: clap, turn, clap.','What happens second?',['Turn','Clap','Jump'],'The turn is the second instruction.'],
        ['The lights flash red, blue, red, blue.','What color comes next if the pattern continues?',['Red','Blue','Green'],'Red and blue alternate, so red comes next.'],
        ['A program says: move east, then north.','Which move happens first?',['East','North','Both at once'],'Instructions in a sequence happen in their written order.'],
        ['A loop repeats the pattern: tap, clap, tap, clap.','What is the fifth action?',['Tap','Clap','Stomp'],'The two-action pattern starts again, so action five is tap.'],
        ['A robot repeats: step forward, turn left, turn right.','What is the fourth instruction?',['Step forward','Turn left','Turn right'],'After the first three instructions, the pattern starts over with step forward.'],
        ['A sequence is 2, 4, 6, 8.','What number comes next?',['10','9','12'],'The sequence adds 2 each time, so 10 comes next.'],
      ],
      [
        ['A robot should move east three times. Its program says east, east, west.','Which step is wrong?',['The third step','The first step','The second step'],'The third move should be east, not west.'],
        ['A pattern is circle, square, circle, square.','Which item continues the pattern?',['Circle','Square','Triangle'],'The two shapes alternate.'],
        ['A program says repeat north 3 times.','How many north moves happen?',['3','2','4'],'The repeat count tells the robot to move north three times.'],
        ['A robot repeats: east, east, north. It has moved east, east, north, east.','What move comes next?',['East','North','South'],'The three-step pattern starts over after north, so east is next.'],
        ['A program should repeat the action clap, jump, clap, jump.','Which action is sixth?',['Jump','Clap','Turn'],'The four-action sequence repeats; its second action, jump, is sixth.'],
        ['A bug changes a repeat count from 4 to 3.','What should you check first?',['Whether the program now does one fewer repeat','Whether the computer has more memory','Whether the screen is brighter'],'A smaller repeat count runs that action one fewer time.'],
      ],
      [
        ['Rule: if the tile is blue, turn right; otherwise, go straight.','What happens on a blue tile?',['Turn right','Go straight','Turn left'],'The condition is true on a blue tile, so the robot turns right.'],
        ['Rule: if the tile is blue, turn right; otherwise, go straight.','What happens on a red tile?',['Go straight','Turn right','Turn left'],'Red is not blue, so the otherwise instruction applies.'],
        ['A robot needs east, east, east, north.','Which program gives those moves?',['Repeat east 3 times, then north','East, then repeat north 3 times','Repeat east 2 times, then north'],'The loop makes three east moves before the north move.'],
        ['Rule: if the number is even, show a square; otherwise, show a circle.','What appears for 7?',['Circle','Square','Both'],'Seven is odd, so the otherwise branch shows a circle.'],
        ['A robot repeats north until it sees a wall. It sees a wall after two moves.','When should it stop?',['After two moves','After four moves','It should keep moving into the wall'],'The stop condition is met when the robot detects the wall.'],
        ['A loop adds 3 points each time and runs 4 times.','How many points are added?',['12','7','9'],'Four groups of 3 make 12 points.'],
      ],
      [
        ['Rule: if a number is greater than 5, show star; otherwise, show circle.','What does the rule show for 5?',['Circle','Star','Both shapes'],'Five is not greater than five, so the otherwise branch shows a circle.'],
        ['A program should turn on red tiles and go straight on blue tiles. It was tested only on red.','What test should come next?',['Try a blue tile','Try only another red tile','Stop testing because red worked'],'A blue tile checks the other branch of the rule.'],
        ['A robot needs to move east four times.','Which program expresses the pattern with one repeat?',['Repeat east 4 times','Repeat east 3 times','Repeat north 4 times'],'Repeating east four times matches all four required moves.'],
        ['A program says: if the counter is at least 3, stop; otherwise add 1. The counter starts at 1.','What value does it reach before stopping?',['3','2','4'],'It changes from 1 to 2, then to 3, where the stop condition is true.'],
        ['A robot should turn at every third marker. It turns at markers 3 and 6.','Which marker is next for a turn?',['9','8','10'],'Multiples of 3 are 3, 6, and 9.'],
        ['Two programs solve the same maze. One uses 8 moves and the other 6.','What is a useful next step?',['Check that the 6-move route is safe and still reaches the goal','Choose the longer route without checking','Assume fewer moves always means fewer bugs'],'Test the shorter route to confirm it is safe and correct.'],
      ],
    ],
    cipher:[
      [
        ['Code rule: move each letter one step forward in the alphabet. A becomes B.','What does B become?',['C','A','D'],'One step after B is C.'],
        ['Code rule: move each letter one step forward in the alphabet.','What does A become?',['B','Z','C'],'One step after A is B.'],
        ['To undo the code, move one step backward. B becomes A.','What does D decode to?',['C','E','B'],'One step before D is C.'],
        ['Move each letter one step forward, wrapping after Z.','What does X become?',['Y','Z','W'],'One step after X is Y.'],
        ['Move each letter one step backward, wrapping before A.','What does A become?',['Z','B','Y'],'Wrapping one step backward from A gives Z.'],
        ['A code shifts every letter forward by one.','What does the letter M become?',['N','L','O'],'One step forward from M is N.'],
      ],
      [
        ['Code rule: move every letter one step forward.','How is CAT encoded?',['DBU','BZS','CBT'],'C becomes D, A becomes B, and T becomes U.'],
        ['Code rule: move every letter one step forward.','How is DOG encoded?',['EPH','CNF','EOG'],'D becomes E, O becomes P, and G becomes H.'],
        ['A word was encoded by moving every letter one step forward.','Decode IFMMP.',['HELLO','JGNNP','HFLLO'],'Move each letter one step backward to get HELLO.'],
        ['Move each letter two steps forward.','How is SUN encoded?',['UWP','TVO','VXO'],'S becomes U, U becomes W, and N becomes P.'],
        ['A code shifts letters one step backward, wrapping before A.','How is BAD encoded?',['AZC','CBE','AZY'],'B becomes A, A wraps to Z, and D becomes C.'],
        ['A message is encoded by shifting every letter forward once.','What was the original word for UIF?',['THE','TIG','VJG'],'Move each letter backward once: U to T, I to H, and F to E.'],
      ],
      [
        ['Code rule: move every letter two steps forward.','How is BAG encoded?',['DCI','CBH','ZYF'],'B becomes D, A becomes C, and G becomes I.'],
        ['Code rule: move every letter two steps forward, wrapping after Z.','What does Y become?',['A','Z','B'],'After Y come Z and then A.'],
        ['A word was encoded by moving every letter two steps forward.','Decode ECV.',['CAT','DBU','GEV'],'Move each letter two steps backward: E to C, C to A, and V to T.'],
        ['Move every letter three steps forward.','How is MAP encoded?',['PDS','NZO','QET'],'M becomes P, A becomes D, and P becomes S.'],
        ['A code moves letters two steps backward.','How is FOX encoded?',['DMV','HQZ','ENW'],'F becomes D, O becomes M, and X becomes V.'],
        ['A word was shifted two steps forward and became JGNNQ.','What was the original word?',['HELLO','IFMMP','FCKJM'],'Move each letter back two places to recover HELLO.'],
      ],
      [
        ['A code moves letters one step forward, wrapping after Z.','How is ZOO encoded?',['APP','ZPP','YNN'],'Z wraps to A; each O moves to P.'],
        ['An encoded word is DBU. Someone guesses the original was CAT.','How can they test the guess?',['Encode CAT using the rule and compare it with DBU','Count the letters only','Assume all three-letter words have the same code'],'Applying the rule to CAT gives DBU, which matches the encoded word.'],
        ['A friend says a simple alphabet shift keeps a password safe.','What is the best response?',['It is a puzzle code, not strong password protection','A one-step shift cannot be reversed','Sharing coded passwords publicly is always safe'],'A simple shift is easy to reverse. Keep passwords private and ask a trusted adult for help.'],
        ['A shift code moves letters forward one place and wraps after Z.','What does Y become?',['Z','A','X'],'The next letter after Y is Z; wrapping happens after Z.'],
        ['A shift code moves every letter forward two places.','How is CAT encoded?',['ECV','DBU','AZR'],'C becomes E, A becomes C, and T becomes V.'],
        ['A classmate shares a coded message and asks you to decode it.','What is a good first step?',['Ask which shift rule was used','Guess the message is a password','Assume all codes shift one place'],'You need the code rule to decode the message reliably.'],
      ],
    ],
    digital:[
      [
        ['A keyboard sends letters to a computer.','Is the keyboard an input or output device?',['Input','Output','Neither'],'A keyboard sends input to the computer.'],
        ['A screen shows a picture from a computer.','What does the screen provide?',['Output','Input typed by a user','A password'],'A screen displays output from the computer.'],
        ['An online game asks for your home address in a public chat.','What is a safer choice?',['Do not share it; ask a trusted adult','Post it so everyone can see','Ask a stranger to post it'],'A home address is personal information. A trusted adult can help you decide what to share.'],
        ['A tablet plays a song through its speakers.','Are the speakers input or output?',['Output','Input','Storage'],'Speakers send sound from the tablet to you, so they provide output.'],
        ['A game asks to use the camera, but the activity does not need pictures.','What is a careful choice?',['Do not allow access and ask a trusted adult if unsure','Allow every request automatically','Share the camera with strangers'],'Only allow device access that makes sense for the activity, and ask an adult if unsure.'],
        ['A pop-up says you won a prize but asks you to type your name and address.','What should you do?',['Close it and tell a trusted adult','Enter the details quickly','Forward it to friends'],'Unexpected prize messages can be misleading and should not be given personal details.'],
      ],
      [
        ['A message from someone you do not know asks you to click a prize link.','What should you do?',['Do not click; tell a trusted adult','Click quickly before the prize disappears','Send your password to claim it'],'Unexpected prize links can be unsafe. Ask a trusted adult for help.'],
        ['You want to use someone else’s drawing in a class project.','What is a respectful first step?',['Ask permission or use a drawing you are allowed to use','Pretend you drew it','Remove the creator’s name'],'Respect the creator’s work and follow the permission or license.'],
        ['A microphone records your voice for an app.','What is the microphone doing?',['Providing input','Displaying output','Printing a page'],'The microphone sends sound input to the device.'],
        ['A game asks to install an extra program from an unfamiliar site.','What should you do?',['Pause and ask a trusted adult before installing','Install it because the game asks','Share your account password first'],'An unfamiliar download can be unsafe; check with a trusted adult.'],
        ['An app wants to use your location to show a drawing activity.','What is a good next step?',['Ask a trusted adult whether location access is needed','Turn on every permission','Post your location in a chat'],'Location is personal information and may not be needed for drawing.'],
        ['A classmate sends you a photo of another student and asks you to repost it.','What is the respectful response?',['Do not repost without permission','Share it with everyone','Remove the student’s name and repost'],'Ask permission before sharing someone else’s photo; removing a name may not protect privacy.'],
      ],
      [
        ['A class website asks you to create an account.','Which password practice is safer?',['Use a long, unique password and keep it private','Use your name as the password everywhere','Share your password in a group chat'],'Long, unique passwords are harder to guess. Ask a trusted adult for help managing them.'],
        ['A search result has a surprising claim but names no source.','What is a good next step?',['Check reliable sources and ask who made the claim','Assume the first result is always correct','Share it immediately as proven'],'Comparing trustworthy sources helps check a claim. Search order alone does not prove accuracy.'],
        ['A program sorts pictures using labels people gave it. Some labels are wrong.','What might happen?',['Some pictures may be sorted incorrectly','The program will always correct every label','The labels cannot affect the result'],'Incorrect input labels can lead to incorrect results.'],
        ['A photo app groups pictures using examples it was shown. Its examples leave out many kinds of people.','What could be a problem?',['It may work less accurately for people missing from the examples','It must be fair because it is a computer','It will always know when an example is missing'],'Incomplete examples can cause a program to work poorly for cases it did not learn from.'],
        ['A website uses an article that names an author and links to research.','How can you check the claim?',['Read the linked research and compare other reliable sources','Assume every linked claim is true','Trust it only because it is popular'],'Following the evidence and comparing sources helps evaluate a claim.'],
        ['A friend posts a password hint that includes their pet’s name.','What is a helpful suggestion?',['Choose a hint that does not reveal an easy guess and keep it private','Post the whole password too','Use the same hint for every account'],'Public details can make a password easier to guess; keep account information private.'],
      ],
      [
        ['A friend receives a hurtful message in a game.','What is a helpful response?',['Do not reply with insults; save evidence and tell a trusted adult','Send a hurtful message back','Share the message publicly to embarrass someone'],'Support your friend, avoid escalating, and involve a trusted adult. Use reporting tools when appropriate.'],
        ['A website asks for your birth date, school, and location to play a simple game.','What should you do before sharing?',['Ask a trusted adult whether the information is needed','Post all the information in chat first','Assume every site needs those details'],'Personal information can reveal who or where you are. A trusted adult can help assess the request.'],
        ['Two sites disagree about a science claim. One names its sources and the other does not.','What is the best next step?',['Check the named sources and compare other reliable evidence','Believe whichever page has brighter colors','Assume every named source must be correct'],'Named sources can be checked, but their existence alone does not guarantee a claim is true.'],
        ['A class project uses an online image with a license that requires credit.','What should you do?',['Follow the license and credit the creator as requested','Remove the creator’s name','Assume class use means no rules apply'],'A license explains how work can be used; follow its conditions and give required credit.'],
        ['A stranger online asks to move a game chat to a private messaging app.','What is the safer response?',['Do not move to private chat; tell a trusted adult','Share your phone number','Agree to keep it secret'],'A request for secret private contact is a warning sign; involve a trusted adult.'],
        ['A video makes a dramatic claim but shows no evidence.','How should you respond before sharing it?',['Look for reliable evidence and other sources first','Share it quickly so others can decide','Assume a dramatic video is accurate'],'Checking evidence and other sources can help prevent spreading a false claim.'],
      ],
    ],
  };
  for (const [family,groups] of Object.entries(rows)) groups.forEach((items,level) => items.forEach(([context,prompt,options,explanation],index) => bank.push({
    id:`${family}-L${level + 1}-Q${index + 1}`,family,level:level + 1,type:'choice',context,prompt,options,answer:0,explanation,
    hints:['Read the rule or situation carefully.','Compare each option with the information given.'],
  })));
  const bitTargets = [[1,2,3,7,8,9],[4,5,6,7,8,9],[9,10,12,8,11,13],[11,13,15,10,12,14]];
  bitTargets.forEach((targets,level) => targets.forEach((target,index) => {
    const active = [8,4,2,1].filter(value => (target & value) !== 0);
    bank.push({id:`bits-L${level + 1}-Q${index + 1}`,family:'bits',level:level + 1,type:'bits',target,
      context:'Each switch is a bit: 1 means on and 0 means off. Add the values of the switches that are on.',
      prompt:`Turn on the bits that make ${target}.`,hints:['The switches are worth 8, 4, 2, and 1 from left to right.',`Try the switches worth ${active.join(' and ')}.`],
      explanation:`${active.join(' + ')} = ${target}. Each switch is either on (1) or off (0).`});
  }));
  const sortSets = [
    [{items:[3,1,2],descending:false},{items:[5,2,4],descending:false},{items:[7,9,6],descending:false}],
    [{items:[8,3,6,1],descending:false},{items:[12,5,9,2],descending:false},{items:[10,4,7,3],descending:false}],
    [{items:[3,8,1,6],descending:true},{items:[11,4,9,2],descending:true},{items:[5,12,7,10],descending:true}],
    [{items:[14,3,11,7,1],descending:false},{items:[6,15,2,13,8],descending:true},{items:[20,9,17,5,12],descending:false}],
  ];
  const legacySortingTasks = [];
  sortSets.forEach((sets,level) => sets.forEach((task,index) => {
    const order = [...task.items].sort((first,second) => task.descending ? second - first : first - second);
    legacySortingTasks.push({id:`sorting-L${level + 1}-Q${index + 1}`,family:'sorting',level:level + 1,type:'sorting',...task,order,
      context:`These are points collected by players. Sort them from ${task.descending ? 'largest to smallest' : 'smallest to largest'}.`,
      prompt:'Tap the numbers in the requested order.',hints:[`Start with the ${task.descending ? 'largest' : 'smallest'} remaining number.`,`The first number is ${order[0]}.`],
      explanation:`The ${task.descending ? 'largest-to-smallest' : 'smallest-to-largest'} order is ${order.join(', ')}.`});
  }));
  const sortData = [
    [
      [[12,8],[9,14],[16,5],[7,10]],
      [[18,6],[11,8],[13,15],[9,12]],
      [[15,12],[20,4],[8,11],[14,8]],
      [[10,7],[8,12],[13,5],[9,10]],
      [[6,15],[12,6],[11,9],[5,12]],
      [[19,3],[8,13],[12,6],[5,11]],
    ],
    [
      [[12,19],[15,26],[8,13],[20,29]],
      [[30,35],[14,26],[21,29],[17,20]],
      [[16,23],[25,36],[11,15],[18,27]],
      [[9,18],[13,21],[16,27],[20,32]],
      [[24,32],[12,22],[17,29],[8,15]],
      [[11,19],[15,24],[19,31],[21,28]],
    ],
    [
      [[8,12,9],[15,7,10],[11,13,12],[6,9,10],[14,8,9]],
      [[12,10,7],[9,14,12],[16,8,10],[7,11,9],[13,12,13]],
      [[10,15,8],[12,9,7],[14,11,12],[8,10,11],[16,9,9]],
      [[7,12,8],[13,9,11],[10,14,13],[6,11,12],[15,8,12]],
      [[9,13,7],[12,16,8],[8,10,15],[14,9,12],[11,12,9]],
      [[16,7,9],[10,12,14],[13,11,9],[7,13,10],[12,9,13]],
    ],
    [
      [[20,32],[15,23],[18,30],[25,30],[12,20]],
      [[16,23],[30,42],[22,31],[14,26],[19,28]],
      [[28,37],[17,31],[21,27],[24,33],[12,26]],
      [[13,25],[18,30],[22,31],[11,22],[16,29]],
      [[24,36],[12,27],[19,30],[15,26],[21,33]],
      [[10,24],[17,29],[23,35],[14,25],[20,32]],
    ],
  ];
  sortData.forEach((sets,levelIndex) => sets.forEach((values,index) => {
    const level = levelIndex + 1, total = level === 1 || level === 3;
    const items = values.map((measurements,i) => ({
      name:['Ava','Ben','Cleo','Diego','Eli'][i],measurements,
      score:total ? measurements.reduce((sum,value) => sum + value,0) : measurements[1] - measurements[0],
    }));
    const descending = level !== 2;
    const sorted = [...items].sort((a,b) => (descending ? b.score - a.score : a.score - b.score) || a.name.localeCompare(b.name));
    const metric = total ? 'total' : 'increase';
    const direction = descending ? 'largest to smallest' : 'smallest to largest';
    bank.push({id:`sorting-v2-L${level}-Q${index + 1}`,family:'sorting',level,type:'sorting',items,order:sorted.map(item => item.name),
      columns:total ? values[0].map((_,i) => `Day ${i + 1}`) : ['Start','Finish'],
      context:`These are points recorded by players. Calculate each player's ${metric}, then rank from ${direction}.${level === 4 ? ' If players tie, put their names in alphabetical order.' : ''}`,
      prompt:`Rank the players by ${metric}.`,
      hints:[total ? 'Add each player’s points across the days before comparing.' : 'Subtract the start from the finish for each player.',
        `The first player is ${sorted[0].name}; their ${metric} is ${sorted[0].score}.`],
      explanation:`The ${metric}s in order are ${sorted.map(item => `${item.name}: ${item.score}`).join(', ')}.${level === 4 ? ' Ties are ordered alphabetically.' : ''}`});
  }));
  const allTasks = [...bank,...legacySortingTasks];
  function shiftText(text, shift) {
    return text.toUpperCase().replace(/[A-Z]/g,letter => String.fromCharCode(65 + (letter.charCodeAt(0) - 65 + shift + 26) % 26));
  }
  function trace(board, program, limit = Infinity) {
    let column = 0, row = 3, steps = 0;
    for (const [direction,count] of program) {
      if (!Object.hasOwn(directions,direction) || !Number.isInteger(count) || count < 1 || count > 4) return {column,row,steps,error:'Invalid command.'};
      for (let move = 0; move < count; move++) {
        if (steps >= limit) return {column,row,steps,goal:column === board.goal[0] && row === board.goal[1]};
        const [dx,dy] = directions[direction], nextColumn = column + dx, nextRow = row + dy;
        steps++;
        if (nextColumn < 0 || nextColumn > 3 || nextRow < 0 || nextRow > 3) return {column,row,steps,error:`Move ${steps} leaves the grid.`};
        if (board.walls.some(([x,y]) => x === nextColumn && y === nextRow)) return {column,row,steps,error:`Move ${steps} enters a blocked square.`};
        column = nextColumn;row = nextRow;
      }
    }
    return {column,row,steps,goal:column === board.goal[0] && row === board.goal[1]};
  }
  const storageKey = 'learningPlayground.coding.v1';
  let api, state, round = null, invalidPetEarned = false;
  function initialState() { return {version:1,level:1,stars:0,petEarned:0,done:{},results:{},latest:{}}; }
  function restore(saved) {
    const fresh = initialState();
    if (saved?.version !== 1) return fresh;
    if (Number.isInteger(saved.level) && saved.level >= 1 && saved.level <= 4) fresh.level = saved.level;
    if (Number.isSafeInteger(saved.stars) && saved.stars >= 0) fresh.stars = saved.stars;
    if (!Object.hasOwn(saved,'petEarned')) fresh.petEarned = fresh.stars;
    else if (Number.isSafeInteger(saved.petEarned) && saved.petEarned >= 0) fresh.petEarned = saved.petEarned;
    for (const family of Object.keys(activities)) {
      for (let level = 1; level <= 4; level++) {
        const key = `${family}-${level}`, result = saved.results?.[key];
        if (Number.isSafeInteger(saved.done?.[key]) && saved.done[key] >= 0) fresh.done[key] = saved.done[key];
        if (result?.family === family && result.level === level && [3,6].includes(result.total) && Number.isFinite(result.date) &&
            Number.isInteger(result.independent) && result.independent >= 0 && result.independent <= result.total &&
            result.supported === result.total - result.independent &&
            Array.isArray(result.taskIds) && result.taskIds.length === result.total && new Set(result.taskIds).size === result.total &&
            result.taskIds.every(id => allTasks.some(task => task.id === id && task.family === family && task.level === level))) fresh.results[key] = result;
      }
      if (fresh.results[saved.latest?.[family]]?.family === family) fresh.latest[family] = saved.latest[family];
    }
    return fresh;
  }
  function save() {
    if (invalidPetEarned) return;
    try { localStorage.setItem(storageKey,JSON.stringify(state)); }
    catch { api.storageFailure(); }
  }
  function init(helpers) {
    api = helpers;
    invalidPetEarned = false;
    try {
      const text = localStorage.getItem(storageKey);
      const saved = text && text.length <= 100000 ? JSON.parse(text) : null;
      invalidPetEarned = saved?.version === 1 && Object.hasOwn(saved,'petEarned') && (!Number.isSafeInteger(saved.petEarned) || saved.petEarned < 0);
      state = restore(saved);
      if (invalidPetEarned) api.storageFailure();
    } catch { state = initialState();api.storageFailure(); }
    save();
  }
  function stop() { round = null; }
  function shuffle(items) {
    const result = [...items];
    for (let index = result.length - 1; index > 0; index--) {
      const other = Math.floor(Math.random() * (index + 1));
      [result[index],result[other]] = [result[other],result[index]];
    }
    return result;
  }
  function heading(title, path = 'coding', label = 'Computer Science') {
    return api.el('div', {class:'bar'},api.el('button', {class:'btn small',onclick:() => api.navigate(path)},`← ${label}`),api.el('h1', {},title));
  }
  function hub() {
    const {el,$,navigate} = api;
    $('#subject').replaceChildren(api.subjectBackBar('🤖 Computer Science'),api.art('coding'),
      el('h2', {},'1. Pick your level'),el('div', {class:'levels science-levels'},...levels.map((level,index) => el('button', {
        class:'card level' + (state.level === index + 1 ? ' sel' : ''),'aria-pressed':String(state.level === index + 1),onclick:() => {
          state.level = index + 1;save();hub();$('#subject .level.sel').focus();
        }},el('b', {},`Level ${index + 1}: ${level.name}`),el('small', {},level.description)))),
      el('h2', {},'2. Pick an activity'),el('div', {class:'subject-grid'},...Object.entries(activities).map(([family,activity]) => el('button', {
        class:'subject-tile',style:'--accent:#4e609e',onclick:() => navigate(`coding/${family}/play`)},
        el('span', {class:'subject-copy'},el('b', {},activity.title),el('small', {},activity.description))))),
      el('div', {class:'science-summary'},el('strong', {},`${state.stars} Computer Science stars earned`),
        el('span', {},`${Object.values(state.done).reduce((sum,value) => sum + value,0)} rounds completed`),
        el('button', {class:'btn small',onclick:() => navigate('coding/trophies')},'Computer Science records')),
      el('p', {class:'quiet'},'Original grades 3–5 enrichment; independent educator review is pending. Levels are challenges, not grade placements.'));
    api.show('subject');api.focusHeading();
  }
  function patternLab() {
    const {el} = api;
    const color = el('select', {'aria-label':'Test tile color'},el('option', {value:'blue'},'Blue'),el('option', {value:'red'},'Red'));
    const action = el('select', {'aria-label':'Action on blue'},el('option', {value:'turn right'},'Turn right'),el('option', {value:'go straight'},'Go straight'));
    const otherwise = el('select', {'aria-label':'Action on other colors'},el('option', {value:'go straight'},'Go straight'),el('option', {value:'turn right'},'Turn right'));
    const result = el('p', {role:'status'});
    return el('section', {class:'coding-lab'},el('h2', {},'Try a rule'),
      el('div', {class:'coding-rule'},el('label', {},'If the tile is blue: ',action),el('label', {},'Otherwise: ',otherwise),el('label', {},'Test tile: ',color)),
      el('button', {class:'btn small',onclick:() => {result.textContent = `On ${color.value}, the robot will ${color.value === 'blue' ? action.value : otherwise.value}.`;}},'Test rule'),result);
  }
  function cipherLab() {
    const {el} = api;
    const input = el('input', {type:'text',maxlength:'120','aria-label':'Message to code',placeholder:'Type a word or message'});
    const shift = el('select', {'aria-label':'Alphabet shift'},el('option', {value:'1'},'Forward 1'),el('option', {value:'2'},'Forward 2'),el('option', {value:'-1'},'Backward 1'),el('option', {value:'-2'},'Backward 2'));
    const output = el('p', {role:'status'});
    return el('section', {class:'coding-lab'},el('h2', {},'Code machine'),
      el('div', {class:'coding-rule'},el('label', {},'Message: ',input),el('label', {},'Shift: ',shift)),
      el('button', {class:'btn small',onclick:() => {output.textContent = input.value ? shiftText(input.value,Number(shift.value)) : 'Type a message first.';}},'Make code'),output,
      el('p', {class:'quiet'},'This is a puzzle code, not a way to protect passwords or private information.'));
  }
  function start(family) {
    const tasks = shuffle(bank.filter(task => task.family === family && task.level === state.level)).map(task => {
      if (task.type !== 'choice') return task;
      const choices = shuffle(task.options.map((text,index) => ({text,correct:index === task.answer})));
      return {...task,options:choices.map(choice => choice.text),answer:choices.findIndex(choice => choice.correct)};
    });
    round = {family,level:state.level,tasks,index:0,records:[],attempts:0,hints:0,solved:false,finalized:false,program:[],step:0};
    loadTask();api.show('mission');api.focusHeading();
  }
  function loadTask() {
    const task = round.tasks[round.index];
    round.program = task.type === 'robot' ? task.starter.map(command => [...command]) : [];
    round.step = 0;round.attempts = 0;round.hints = 0;round.solved = false;
    renderRound();
  }
  function solve(current) {
    if (round !== current || current.solved) return;
    current.solved = true;
    current.records.push({id:current.tasks[current.index].id,independent:current.attempts === 0 && current.hints === 0});
    const halfway = current.tasks.length === 6 && current.records.length === 3
      ? 'Halfway there—three of six challenges complete! '
      : '';
    api.$('#codingFeedback').textContent = 'That works! ' + halfway + current.tasks[current.index].explanation;
    api.$('#codingHint').disabled = true;
    const next = api.$('#codingNext');next.hidden = false;next.focus({preventScroll:true});
    api.$('#codingProgress').value = current.records.length;api.SND.ok();
  }
  function advance(current) {
    if (round !== current || !current.solved || current.finalized) return;
    if (current.index < current.tasks.length - 1) {current.index++;loadTask();const prompt = api.$('#codingPrompt');prompt.tabIndex = -1;prompt.focus();return;}
    current.finalized = true;
    const independent = current.records.filter(record => record.independent).length, key = `${current.family}-${current.level}`;
    const total = current.tasks.length;
    const result = {family:current.family,level:current.level,total,independent,supported:total - independent,date:Date.now(),taskIds:current.tasks.map(task => task.id)};
    state.stars += total;state.petEarned = Math.min(Number.MAX_SAFE_INTEGER,state.petEarned + total);state.done[key] = (state.done[key] || 0) + 1;state.results[key] = result;state.latest[current.family] = key;
    save();api.updateHeader();api.SND.win();api.confetti();api.navigate(`coding/${current.family}/results`);
  }
  function renderRound() {
    const {el,$} = api, current = round, task = current.tasks[current.index], root = $('#mission');
    root.replaceChildren(heading(activities[current.family].title),el('div', {class:'mission-status'},
      el('span', {},`Challenge ${current.index + 1} of ${current.tasks.length} · Level ${current.level} · Untimed`),
      el('progress', {id:'codingProgress',max:String(current.tasks.length),value:String(current.records.length),'aria-label':'Challenges completed'})));
    if (state.latest[current.family]) root.append(el('a', {href:`#coding/${current.family}/results`},'View last results (leaves this round)'));
    const feedback = el('div', {class:'feedback',id:'codingFeedback',role:'status','aria-live':'polite','aria-atomic':'true'});
    const hint = el('button', {class:'btn small',id:'codingHint',onclick:() => {
      if (round !== current || current.solved) return;
      current.hints = Math.min(2,current.hints + 1);feedback.textContent = `Hint ${current.hints}: ${task.hints[current.hints - 1]}`;
      hint.disabled = current.hints === 2;
    }},'💡 Hint');
    const next = el('button', {class:'btn',id:'codingNext',style:'background:#4e609e',onclick:() => advance(current)},current.index === current.tasks.length - 1 ? 'See results' : 'Next challenge');
    next.hidden = true;
    const bench = el('section', {class:'workbench'},el('h2', {id:'codingPrompt'},task.prompt));
    if (task.type === 'choice') {
      const choices = el('div', {class:'choices',role:'group','aria-labelledby':'codingPrompt'});
      task.options.forEach((text,index) => {
        const button = el('button', {class:'choice',onclick:() => {
          if (round !== current || current.solved) return;
          if (index !== task.answer) {current.attempts++;button.classList.add('selected');feedback.textContent = 'Not yet. ' + task.hints[0] + ' Try again.';api.SND.bad();return;}
          choices.querySelectorAll('button').forEach(choice => choice.disabled = true);button.classList.add('correct');solve(current);
        }},text);
        choices.append(button);
      });
      bench.append(choices);
    } else if (task.type === 'robot') renderRobot(bench,current,task,feedback);
    else if (task.type === 'bits') renderBits(bench,current,task,feedback);
    else if (task.type === 'sorting') renderSorting(bench,current,task,feedback);
    bench.append(feedback,el('div', {class:'row',style:'justify-content:flex-start'},hint,next));
    root.append(el('div', {class:`mission-layout${task.type === 'robot' ? ' coding-robot' : ''}`},el('aside', {class:'evidence',style:'--accent:#4e609e'},
      el('h2', {},task.type === 'robot' ? 'Robot field guide' : 'Look closely'),
      el('p', {},task.type === 'robot' ? 'The robot starts in the bottom-left square. North is up and east is right. Avoid the blocked squares and reach the star.' : task.context),
      task.type === 'robot' ? el('p', {},'One block can repeat a move. Step runs one move at a time; edit the program and test again when needed.') : null),bench));
    if (current.family === 'patterns' || current.family === 'cipher') root.append(el('details', {},el('summary', {},'Open the practice lab'),
      current.family === 'patterns' ? patternLab() : cipherLab()));
  }
  function renderBits(bench,current,task,feedback) {
    const {el} = api, values = [8,4,2,1], active = [false,false,false,false];
    const switches = el('div', {class:'coding-bits',role:'group','aria-label':'Binary switches'});
    values.forEach((value,index) => {
      const button = el('button', {class:'coding-bit','aria-pressed':'false',onclick:() => {
        if (round !== current || current.solved) return;
        active[index] = !active[index];button.setAttribute('aria-pressed',String(active[index]));
        button.textContent = `${value}: ${active[index] ? '1 on' : '0 off'}`;
      }},`${value}: 0 off`);
      switches.append(button);
    });
    bench.append(switches,el('button', {class:'btn small',onclick:() => {
      if (round !== current || current.solved) return;
      const total = values.reduce((sum,value,index) => sum + (active[index] ? value : 0),0);
      if (total !== task.target) {current.attempts++;feedback.textContent = `The lit switches add to ${total}. Try making ${task.target}.`;api.SND.bad();return;}
      switches.querySelectorAll('button').forEach(button => button.disabled = true);solve(current);
    }},'Check bits'));
  }
  function renderSorting(bench,current,task,feedback) {
    const {el} = api, selected = [], list = el('p', {class:'coding-sort-order','aria-live':'polite'});
    const table = el('table', {class:'data-table'},el('caption', {},'Player points'),
      el('thead', {},el('tr', {},...['Player',...task.columns].map(text => el('th', {scope:'col'},text)))),
      el('tbody', {},...task.items.map(item => el('tr', {},el('th', {scope:'row'},item.name),
        ...item.measurements.map(value => el('td', {},value))))));
    const buttons = el('div', {class:'coding-sort-buttons',role:'group','aria-label':'Players to rank'});
    function update() {
      list.textContent = selected.length ? `Your order: ${selected.join(', ')}` : 'Your order: empty';
      [...buttons.children].forEach((button,index) => {
        button.disabled = current.solved;button.setAttribute('aria-pressed',String(selected.includes(task.items[index].name)));
      });
    }
    task.items.forEach(item => buttons.append(el('button', {class:'btn small',onclick:() => {
      if (round !== current || current.solved || selected.includes(item.name)) return;
      selected.push(item.name);update();
    }},item.name)));
    bench.append(table,buttons,list,el('div', {class:'command-row'},el('button', {class:'btn small',onclick:() => {
      if (round !== current || current.solved) return;selected.pop();update();
    }},'↶ Undo'),el('button', {class:'btn small',onclick:() => {
      if (round !== current || current.solved) return;
      if (selected.length !== task.items.length) {feedback.textContent = 'Choose every player first.';return;}
      if (!selected.every((value,index) => value === task.order[index])) {current.attempts++;feedback.textContent = 'Not quite. Undo a player and check your calculations and the requested order.';api.SND.bad();return;}
      solve(current);update();
    }},'Check order')));
    update();
  }
  function renderRobot(bench,current,task,feedback) {
    const {el} = api, grid = el('div', {class:'robot-grid',role:'img'}), program = el('ol', {class:'coding-program','aria-label':'Program blocks'});
    const count = el('select', {'aria-label':'Repeat count'},...Array.from({length:4},(_,index) => el('option', {value:String(index + 1)},index === 0 ? 'Once' : `${index + 1} times`)));
    const names = {N:'North',E:'East',S:'South',W:'West'};
    function draw() {
      const position = trace(task,current.program,current.step);
      const walls = task.walls.map(([column,row]) => `row ${row + 1} column ${column + 1}`).join(', ') || 'none';
      grid.setAttribute('aria-label',`Four by four grid. Robot at row ${position.row + 1} column ${position.column + 1}. Goal row ${task.goal[1] + 1} column ${task.goal[0] + 1}. Blocked squares: ${walls}.`);
      grid.replaceChildren(...Array.from({length:16},(_,index) => {
        const row = Math.floor(index / 4), column = index % 4, robot = row === position.row && column === position.column;
        const wall = task.walls.some(([x,y]) => x === column && y === row), goal = task.goal[0] === column && task.goal[1] === row;
        return el('span', {class:robot ? 'robot' : wall ? 'wall' : goal ? 'goal' : ''},robot ? '🤖' : wall ? '×' : goal ? '★' : '·');
      }));
      program.replaceChildren(...current.program.map(([direction,repeats],index) => el('li', {},
        el('span', {},`${names[direction]}${repeats > 1 ? ` × ${repeats}` : ''}`),
        el('button', {class:'coding-remove',title:`Remove block ${index + 1}`,'aria-label':`Remove block ${index + 1}: ${names[direction]} ${repeats} times`,onclick:() => {
          if (current.solved) return;current.program.splice(index,1);current.step = 0;draw();feedback.textContent = 'Block removed.';
        }},'×'))));
    }
    const controls = el('div', {class:'command-row',role:'group','aria-label':'Add movement block'});
    [['N','↑ North'],['E','→ East'],['S','↓ South'],['W','← West']].forEach(([direction,label]) => controls.append(el('button', {class:'btn small',onclick:() => {
      if (current.solved) return;
      if (current.program.length >= 24) {feedback.textContent = 'Remove a block before adding another.';return;}
      current.program.push([direction,Number(count.value)]);current.step = 0;draw();feedback.textContent = `${names[direction]} block added.`;
    }},label)));
    function execute(single) {
      if (round !== current || current.solved) return;
      if (!current.program.length) {feedback.textContent = 'Add a movement block first.';return;}
      const total = current.program.reduce((sum,command) => sum + command[1],0);
      current.step = single ? Math.min(current.step + 1,total) : total;
      const position = trace(task,current.program,current.step);draw();
      if (position.error) {current.attempts++;feedback.textContent = position.error + ' Change a block and try again.';api.SND.bad();return;}
      if (current.step === total && position.goal) {solve(current);return;}
      if (current.step === total) current.attempts++;
      feedback.textContent = `After ${position.steps} moves: row ${position.row + 1}, column ${position.column + 1}.` + (current.step === total ? ' Not at the star yet.' : '');
    }
    bench.append(grid,el('h3', {},'Program'),program,el('label', {class:'coding-repeat'},'Repeat each new block: ',count),controls,
      el('div', {class:'command-row'},el('button', {class:'btn small',onclick:() => execute(true)},'▷ Step'),
        el('button', {class:'btn small',onclick:() => execute(false)},'▶ Run'),
        el('button', {class:'btn small',onclick:() => {if (!current.solved) {current.program = [];current.step = 0;draw();feedback.textContent = 'Program cleared.';}}},'↺ Clear')));
    draw();
  }
  function results(family) {
    const {el,$,navigate} = api, root = $('#mission'), result = state.results[state.latest[family]];
    root.replaceChildren(heading('Computer Science results'));
    if (!result) root.append(el('p', {},'No completed round for this activity yet.'),el('a', {href:`#coding/${family}`},'Choose a round'));
    else {
      root.append(el('h2', {},'Round complete!'),el('p', {},`${activities[family].title} · Level ${result.level}`),
        el('div', {class:'result-metrics'},...[[result.total,'Challenges completed'],[result.independent,'Independent'],[result.supported,'With hints / retries']].map(([value,label]) => el('div', {},el('strong', {},value),el('span', {},label)))),
        el('p', {},`${result.total} participation stars earned. Supported answers count toward completion; this is not a mastery score.`),
        el('details', {class:'science-review'},el('summary', {},'Review this round'),...result.taskIds.map(id => {
          const task = allTasks.find(item => item.id === id);
          return el('div', {},el('h3', {},task.prompt),task.context ? el('p', {},task.context) : null,
            el('b', {},task.type === 'choice' ? task.options[task.answer] : task.type === 'robot' ? task.hints[1] : task.type === 'sorting' ? task.order.join(', ') : `Target: ${task.target}`),el('p', {},task.explanation));
        })),el('button', {class:'btn',onclick:() => {state.level = result.level;save();navigate(`coding/${family}/play`);}},'Play again'));
    }
    api.show('mission');api.focusHeading();
  }
  function trophies() {
    const {el,$} = api, root = $('#subject');
    const table = el('table', {class:'data-table'},el('caption', {},'Computer Science rounds'),
      el('thead', {},el('tr', {},...['Activity / level','Rounds','Last independent'].map(text => el('th', {scope:'col'},text)))),
      el('tbody', {},...Object.entries(activities).flatMap(([family,activity]) => levels.map((level,index) => {
        const key = `${family}-${index + 1}`, result = state.results[key];
        return el('tr', {},el('th', {scope:'row'},`${activity.title} / ${index + 1}`),el('td', {},state.done[key] || 0),el('td', {},result ? `${result.independent}/${result.total}` : 'Not played'));
      }))));
    root.replaceChildren(heading('Computer Science records'),el('h2', {},`${state.stars} Computer Science stars earned`),
      el('p', {},'Stars are for completed rounds, including supported answers.'),el('div', {class:'english-records',tabindex:'0',role:'region','aria-label':'Computer Science records; scroll to see all columns'},table));
    api.show('subject');api.focusHeading();
  }
  function handleRoute(path) {
    if (!state) return false;
    if (path === 'coding') {hub();return true;}
    if (path === 'coding/trophies') {trophies();return true;}
    if (path === 'coding/mission') {start('robot');return true;}
    if (path === 'coding/results') {api.legacyResults();api.show('mission');api.focusHeading();return true;}
    const parts = path.split('/');
    if (parts[0] !== 'coding' || !Object.hasOwn(activities,parts[1])) return false;
    if (parts.length === 2) {start(parts[1]);return true;}
    if (parts.length === 3 && parts[2] === 'play') {start(parts[1]);return true;}
    if (parts.length === 3 && parts[2] === 'results') {results(parts[1]);return true;}
    return false;
  }
  return {levels,activities,bank,trace,shiftText,storageKey,restore,init,stop,handleRoute,get state(){return state;},get round(){return round;}};
})();