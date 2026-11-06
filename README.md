# Learning Playground

Open `index.html` in a browser. No installation, build, account, API key, or development server is required. Publish the entire folder to GitHub Pages, retaining the relative paths and filename capitalization.

## Maintenance

- `index.html`: shared page structure, references, and ordered classic-script links.
- `styles.css`: shared visual styling and responsive layouts.
- `app.js`: subject availability, routing, shared controls, accessibility helpers, and the preserved future-subject experiences.
- `subjects/math.js`: Math levels, generators, games, tables, trophies, and fraction tasks.
- `subjects/english.js`: English levels, original content, untimed rounds, progress, and trophies. It receives shared helpers through `EnglishSubject.init()`.
- `subjects/science.js`: Science content, levels, rounds, progress, and trophies. It receives shared helpers through `ScienceSubject.init()` after the app has initialized.

Math, English, and Science are available in that order. Social Studies and Computer Science are retained behind the `AVAILABLE_SUBJECTS` setting in `app.js`; their landing-page previews and direct routes are not interactive until enabled.

Keep Math, English, Science, and then the shared app in the existing script order. Classic scripts deliberately support opening the local HTML file without module or JSON-fetch restrictions. Use relative asset paths, not paths starting with `/`, for GitHub project sites.

## Math Difficulty Settings

Edit the `LEVELS` array near the top of `subjects/math.js`. It is the single source for the four Math profiles. Each profile has `rules.add`, `rules.sub`, `rules.mul`, `rules.div`, `rules.frac`, and a `seconds` budget per operation. The level descriptions and each game's rule summary are derived from those values, not maintained separately.

| Level | Addition / Subtraction | Multiplication / Division | Fractions |
| --- | --- | --- | --- |
| 1: Rookie | Totals / starting numbers within 20 | Tables 1–5, using configured multipliers through 10 | Count shaded parts |
| 2: Explorer | Totals / starting numbers within 100 | Tables 2–10, using configured multipliers through 10 | Equivalent fractions and same-denominator addition |
| 3: Champion | Three-digit operands, no carrying or borrowing | Factors through 12; 40% missing-factor/divisor questions | Related-denominator addition and subtraction |
| 4: Math Wizard | Four-digit operands, 2–3 carries/borrows; subtraction difference at least 100 | Multiplication factors 12–25; divisors 12–25 and quotients 12–40; 50% missing-factor/divisor questions; multiples of 10 excluded | Reduced operands with unrelated denominators and a common denominator of at least 24 |

For example, to make level-4 multiplication harder later, edit `factorMax` and `multiplierMax` in the fourth profile's `rules.mul`. To change regrouping, edit `regroupingMin` and `regroupingMax`. To change fraction content, edit `types`, `denominators`, `relation`, and the minimum/common-denominator constraints. Changing a timer budget only requires editing that profile's `seconds` entry. Reload the page or start a new round to apply the updated rules.

Mixed Challenge calls the same configured addition, subtraction, multiplication, and division generators at the selected level. Its countdown budget sums the budgets for those actual questions. It does not have a second set of difficulty limits. Times Table Explorer remains a fixed reference tool under Fun facts, not a leveled game. Science retains its separate subject profiles.

Supported settings change the existing generators automatically. Entirely new mechanics, such as signed-number answers, remainder entry, or fraction multiplication, require code as well as a profile change. Invalid or impossible ranges fail with an explicit error rather than looping forever. Run the tests after every difficulty edit and check the layout if numbers become wider. Current guardrails allow arithmetic operands through 99999, factors through 999, base fraction denominators 2–24, and denominator scaling factors 2–12.

Best stopwatch times are keyed by the relevant question-rule configuration. Older best times remain in the Previous best times section of Math trophies, so a harder profile is not compared against an earlier easy record. Stars, completed-round counts, names, and earned badges are preserved.

## Fraction Fiesta

Fraction Fiesta at `#math/frac` shares the arithmetic game layout and round engine: ten question cards, the selected Math level, optional timers, hints after retries, stars, completion results, and trophy records. Level 1 uses shaded fraction bars; level 2 introduces equivalent fractions and same-denominator addition; levels 3 and 4 use addition and subtraction with common denominators. Learners enter the missing numerator as a whole number using the displayed denominator, so equivalent unreduced fractions remain intentional.

The Math menu places Fraction Fiesta before Mixed Challenge. Times Table Explorer is in the separate Fun facts section; trophies remain accessible from the top banner.

The older `#math/mission` link opens the redesigned fraction game. Previous starter-mission records are retained; new fraction rounds use Math progress under the `frac` game key. Mixed Challenge continues to contain only addition, subtraction, multiplication, and division.

## English Content

English at `#english` offers four challenge levels and three activities: Word Detective (context clues and word parts), Sentence Studio (sentence formation and editing), and Reading Clues (details, summaries, inferences, and evidence). Levels progress from everyday words and stated details to precise or figurative language, editing for clarity, and recognizing limits of evidence. These are challenge choices, not grade placements or measured ability levels.

The focused first bank has 36 original questions: three per activity/level, including four original short reading passages. A round uses all three questions for its selected activity and level, with shuffled question and answer order. Deliberate replays repeat this small bank. Each question includes two optional hints and an explanation. Incorrect answers can be revised; hints or retries mark the answer as supported rather than independent. English uses a passage/context beside a single question, not Math's numeric grid, and has no timers.

Completing a round awards three English participation stars, including supported answers. Records track completed rounds, latest results, best independent-answer counts per activity/level, and three English badges. No stars are saved for partial rounds. Leaving or reloading a play route starts a fresh round at the saved English level; completed results and rewards persist. Replays can earn participation stars again. This is illustrative grades 3–5 enrichment with independent educator review pending, not complete standards coverage or a validated assessment.

Routes include `#english/vocabulary`, `#english/grammar`, `#english/reading`, their `/play` and `/results` routes, and `#english/trophies`. The older `#english/mission` link starts Reading Clues; `#english/results` still shows the original Garden Mystery starter-mission record without converting or deleting it. Invalid English subroutes return to the English hub. Add new content with stable IDs; do not silently reuse IDs for different questions. Change content versions and tests deliberately when changing the bank.

## Science Content

Three activities have four challenge levels each. The bank contains 240 contextual question instances built from 15 illustrative evidence scenarios and reusable question templates, not 240 independent experiments. Each activity/level has 20 questions across five scenarios; a round selects six and avoids the preceding six when possible. Option order is shuffled independently. Each task carries an objective, data context, explanation, two hints, feedback rationales, and relevant source references. New scenarios use stable IDs and bank version 2; their original classroom data is illustrative, not measured evidence or a live simulation.

Choose an investigation first, then select its challenge level. The preparation screen previews six question prompts for that activity and level; it does not show answer choices. Changing levels refreshes the preview, and starting the round uses those questions. Previewing does not update replay history or saved progress.
The activity preparation screen previews six randomized questions for the selected level. Changing levels or reopening preparation refreshes the preview; starting a round uses the displayed questions and then updates replay history. Previewing alone does not affect saved progress.

To extend Science, update the scenarios and level-specific question definitions in `subjects/science.js`. Give new content stable IDs. Keep data, units, accepted answers, explanations, and hints consistent. Change bank versioning and tests deliberately when adding or retiring items. Do not silently reuse an existing ID for a different scientific question.

All data is explicitly illustrative. The content is grades 3–5 enrichment, not a complete standards-aligned curriculum or validated mastery assessment. Independent educator review and learner usability testing remain outstanding. External reference links are not endorsements or permission to copy source material.

## Progress And Timers

Math retains `mathPlayground.v1`. Existing starter-mission records retain `learningPlayground.missions.v1`. English uses the new `learningPlayground.english.v1`; it does not import or alter starter-mission rewards. Science uses `learningPlayground.science.v1` and preserves an old Ramp Investigation as a legacy record without awarding retrospective stars. Each subject's progress, stars, levels, records, and badges stay separate. The picker header totals all three subjects; a subject route shows only that subject's stars and trophy destination. Stars measure participation/completion, including supported answers; independent answers are counted separately.

Progress stays in the browser and origin. It does not automatically transfer from the local file to GitHub Pages or sync between devices. Writing responses in the retained future subjects are not saved. Storage-disabled play remains available with a warning.

Science rounds are untimed. Existing saved stopwatch/countdown results and timer preferences are retained for compatibility and remain available as historical trophy records; new rounds do not create timed records. Math timers are unchanged.

## Checks

With Node.js installed, run:

```sh
node --test tests/math.test.cjs tests/science.test.cjs tests/english.test.cjs
```

This checks every Math profile's bounds and regrouping, factor/quotient ranges, fraction constraints, answer correctness, future-rule mutation, mixed-game/timer inheritance, best-time isolation, Science bank integrity, scenario data ordering, randomized answer mapping, context diversity, replay selection, and English content, answer mapping, progress validation, award boundaries, persistence, and subject ordering. Browser testing should additionally cover Math regression, Science award boundaries, English direct links and reloads, progress isolation, hints and retries, level-preview consistency, unavailable-subject routes, keyboard access, and phone/tablet/desktop layouts. Before publication, test direct hash links and reloads under a repository path such as `/playground/`, not only the site root.