// Reference content — Sections 1, 8, 9, 10.1, 11–17, 19 and myth check of docs/guide.md.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'table'; head: string[]; rows: string[][] }
  | { type: 'links'; items: { title: string; url: string; source: string; cue: string }[] };

export type GuideSection = { id: string; title: string; summary: string; blocks: Block[] };

export const MICRO_PRACTICE = {
  rules: [
    'RPE ≤5–6. No set to failure.',
    'Stop if quality degrades on 2 consecutive efforts.',
    'Never after a hard session of the same tissues if a joint is ≥2/10 painful.',
    'On Upper A/B days the handstand block inside the session replaces micro-practice.',
  ],
  blocks: [
    { id: 'wrist', demo: 'wrist' as string | undefined, title: 'Wrists', duration: '2–3 min', content: 'Palm pulses ×10, back-of-hand wrist push-ups ×10 (from knees), finger-forward/sideways/backward rocks ×10 each, fist push-up hold 15 s', progression: 'Move from knees → plank position as tolerance improves' },
    { id: 'scap', demo: 'scap' as string | undefined, title: 'Scapular control', duration: '2 min', content: 'Scap push-ups ×10, scap pull-ups or band scap depressions ×8, wall slides ×8', progression: 'Add pauses (2 s)' },
    { id: 'hs', demo: undefined as string | undefined, title: 'Handstand', duration: '5–8 min', content: 'At your HS level: 3–5 × 20–45 s CTW, or 5–8 freestanding attempts', progression: 'Challenge point: 60–80% success rate' },
    { id: 'compression', demo: 'CC6' as string | undefined, title: 'Compression', duration: '2 min', content: 'Seated pike leg lifts 2 × 8 (2 s holds), tuck L-sit on floor 2 × 10 s', progression: 'Add pancake lifts; increase hold to 3 s' },
    { id: 'mobility', demo: 'BL0' as string | undefined, title: 'Targeted mobility (failed tests only)', duration: '3–5 min', content: 'Overhead: thoracic extension + shoulder flexion stretch 2 × 30 s. Ankle: knee-to-wall rocks 2 × 10. Pike: pike folds with active compression 2 × 30 s. Shoulder extension: assisted German hang 2 × 15 s (only if pain-free in Week 0)', progression: 'Stop dedicated work once the test standard is met; then maintain 1×/week' },
  ],
  layout: 'Tue, Wed, Fri, Sat: full 10–15 min. Sun: optional 5 min (wrist + scap). Mon/Thu: included in the workout.',
};

export const READINESS = {
  questions: [
    { id: 'sleep', text: 'Slept under 6 h last night' },
    { id: 'soreness', text: 'Soreness ≥5/10 in the muscles to be trained' },
    { id: 'pain', text: 'Joint/tendon pain ≥3/10 at rest or during warm-up' },
    { id: 'drop', text: 'First working set ≥10% worse than last workout, or RPE ≥2 higher for the same work' },
  ],
  actions: [
    'Train as written.',
    'Train as written; skip any RIR-0 sets.',
    '−1 set per exercise; RIR +1; keep skill work at 70%.',
    'Micro-practice + Zone 2 only; reschedule the hard session 24 h later.',
  ],
};

export const GUIDE: GuideSection[] = [
  {
    id: 'overview',
    title: 'Overview',
    summary: 'The system in brief',
    blocks: [
      { type: 'p', text: 'A hybrid system: 4 hard sessions per week (2 upper, 2 lower), spaced about 72–96 h apart for the same tissues; a daily 10–15 min low-fatigue micro-practice block for handstand, compression, scapular control and wrists; objective level placement from a baseline test; and double-progression and hold-based progression rules. External load (vest, dip belt, dumbbells) is used wherever bodyweight leverage stops being the efficient overload tool.' },
      { type: 'list', items: [
        'Train skills often and tissues hard rarely. Handstand and other low-load skills can be practised daily; high-tension statics and heavy bent-arm work get 2 hard exposures per week with ≥72 h between them.',
        'Start with Week 0 testing, then run the 12-week plan: two 5-week build blocks, deloads in Weeks 6 and 12, and automatic IF/THEN progressions.',
        'The single most important rule: progress when the criteria say so, regress when the pain rules say so, and never invent an extra hard day. The micro-practice is where the "every day" happens.',
      ] },
      { type: 'h', text: 'Session order' },
      { type: 'p', text: 'Warm-up → balance skill (handstand) → high-intensity straight-arm statics → explosive work → max-strength bent-arm → hypertrophy accessories → core/compression → targeted mobility.' },
      { type: 'h', text: 'Notation' },
      { type: 'list', items: [
        'Tempo = lowering – bottom pause – lifting – top pause, in seconds. X = move with maximal intent. Example: 3-1-X-0.',
        'RIR = reps in reserve. Hold reserve for statics = stop 2–3 s before shape failure.',
        'Supersets (A1/A2) mean alternating exercises with the stated rest between them.',
        'Weighted: when a bodyweight exercise exceeds the top of its range and the next leverage step would drop you below the bottom, add load instead: +2–2.5 kg (upper), +2.5–5 kg (legs).',
      ] },
    ],
  },
  {
    id: 'week',
    title: 'Weekly structure',
    summary: 'Why Upper/Lower 4× + daily micro-practice',
    blocks: [
      { type: 'table', head: ['Day', 'Workout', 'Purpose'], rows: [
        ['Mon', 'Upper A', 'Planche emphasis (high) + FL (moderate) + vertical push/pull + dips/rows + delts/biceps + L-sit'],
        ['Tue', 'Lower A', 'Plyo + single-leg squat ladder + SL-RDL + Nordic + calves + Copenhagen + hollow'],
        ['Wed', 'Recovery + aerobic', 'Micro-practice + Zone 2 30–40 min + targeted mobility'],
        ['Thu', 'Upper B', 'FL emphasis (high) + planche (moderate/lean) + explosive pull/MU + horizontal push/pull + chins + triceps/rear delts + HLR'],
        ['Fri', 'Lower B', 'Plyo + loaded BSS + hip thrust + sliding curl + shrimp/Cossack + soleus/tibialis + abductors + Pallof'],
        ['Sat', 'Skill + conditioning', 'Handstand 15–20 min, compression, optional MU technique; then Zone 2 or intervals; mobility'],
        ['Sun', 'Rest', 'Optional 5 min wrist + scap micro only'],
      ] },
      { type: 'p', text: 'Each upper muscle and tendon gets 2 hard exposures per week (Mon→Thu 72 h, Thu→Mon 96 h), matching frequency findings and the 36–72 h net collagen synthesis window. Conditioning sits on non-plyo days because explosive gains are most vulnerable to concurrent training.' },
    ],
  },
  {
    id: 'progression',
    title: 'Progression',
    summary: 'When to move up or down a level',
    blocks: [
      { type: 'h', text: 'Session rule (dynamic exercises)' },
      { type: 'list', items: [
        'IF all sets reach the top of the rep range at ≥ the target RIR with standard form for 2 consecutive sessions, THEN next session move up one level. If the next level would give fewer reps than the bottom of the range, add load instead.',
        'IF set 1 falls below the bottom of the range, THEN next session drop one level or add band assistance.',
        'OTHERWISE keep the level and try to add 1 rep to at least one set.',
      ] },
      { type: 'h', text: 'Static rule' },
      { type: 'list', items: [
        'IF you complete all prescribed holds at the target duration with perfect shape for 2 sessions AND your best single hold ≥15 s, THEN test the next level. If you can hold the new level ≥4 s, switch to it with holds = (max − 2 s).',
        'OTHERWISE do "mixed sets": 2 sets at the new level + remaining sets at the old level.',
      ] },
      { type: 'h', text: 'By adaptation type' },
      { type: 'table', head: ['Type', 'Rule'], rows: [
        ['Dynamic strength (4–6 / 3–5)', 'Double progression: top of range on all sets at target RIR ×2 sessions → harder leverage or +2–2.5 kg upper / +2.5–5 kg lower'],
        ['Dynamic hypertrophy (6–12, 8–15, 12–20)', 'Same, but RIR 0–2; add sets over the block (+1 set/week in Weeks 3–5, 9–11)'],
        ['Isometric skill', 'Train at 60–85% of max hold; 5 sets. Progress when prescribed holds are met ×2 sessions and best hold ≥15 s; new level must be holdable ≥4 s, else mixed sets'],
        ['Balance skills', 'Progress duration target when ≥7/10 attempts meet it (10 s → 20 s → 30 s → 60 s); regress if <5/10'],
        ['Explosive', 'Every rep maximal intent; end the set when height/speed visibly drops; progress when all reps are crisp ×2 sessions'],
        ['Mobility', 'Re-test every 6 weeks; progress drills until the standard is met, then maintain 1×/week'],
        ['Assistance reduction', 'Bands: next lighter band at top of range ×2 sessions; box pistol: lower 5–10 cm at 3 × 8'],
        ['Tempo/pauses', 'Intermediate step when a leverage jump is too large (2 s pause at the hardest point)'],
      ] },
      { type: 'h', text: 'Overload priority order' },
      { type: 'list', items: ['1. Leverage (if the next step keeps you inside the rep range)', '2. External load', '3. Reps within range', '4. Sets', '5. Tempo/pauses', '6. Unilateral transitions (archer → assisted one-arm)'] },
    ],
  },
  {
    id: 'plateau',
    title: 'Plateau',
    summary: 'No increase for 3 workouts in a row',
    blocks: [
      { type: 'p', text: 'Definition: no increase in reps, hold time or load on a given exercise for 3 consecutive exposures (~1.5 weeks at 2×/week) while sleep ≥7 h and bodyweight is stable.' },
      { type: 'list', items: [
        '1. Check fatigue first. 2+ recovery flags → run the fatigue response and re-evaluate.',
        '2. Check technique: film the set. IF form has drifted → regress one level for 2 weeks with strict form.',
        '3. Change the stimulus for 3–4 weeks (choose one): switch rep range (4–6 ↔ 8–12); add eccentrics / band-assisted next level / partial-range lever; statics → dynamic work at the same leverage.',
        '4. Volume check: IF weekly fractional sets <10 → add 2 sets/week. IF >20 → cut to 14–16.',
        '5. Weak-link diagnosis (table below).',
        '6. Still stuck after 8 weeks: maintenance dose (1×/week) and put the slot into the gateway ability it depends on for one block.',
      ] },
      { type: 'table', head: ['Skill', 'Likely weak link', 'Fix'], rows: [
        ['Planche', 'Lean/protraction, straight-arm anterior delt, wrist tolerance', '+Lean volume, pseudo-planche push-ups, weighted dips'],
        ['FL', 'Scap depression/lats, hollow', 'Weighted pull-ups, FL raises, straight-arm pulldowns, hollow holds'],
        ['Handstand', 'Line (shoulder flexion), wrist strength, fear', 'Wall line drills, fingertip pressure drills, bail practice'],
        ['Pistol', 'Ankle DF, deep-knee quad strength, balance', 'Heel-elevated pistols, loaded BSS, box negatives'],
        ['MU', 'Pull height, transition', 'Explosive pulls to sternum/waist, low-bar transitions'],
        ['OAC', 'Max pull strength', 'Weighted pull-ups to +40% BW, archer negatives'],
      ] },
    ],
  },
  {
    id: 'recovery',
    title: 'Recovery & deload',
    summary: 'Readiness, trend rules, deload',
    blocks: [
      { type: 'h', text: 'Readiness check (30 s before every hard workout)' },
      { type: 'table', head: ['Flags', 'Action'], rows: READINESS.actions.map((a, i) => [i === 3 ? '≥3' : String(i), a]) },
      { type: 'h', text: 'Trend rules' },
      { type: 'list', items: [
        'IF the same exercise drops 2 consecutive sessions → cut that session’s sets by 1/3 for one week.',
        'IF performance drops across ≥2 exercises for 2 sessions, or 3 sessions on one exercise → deload that week, then resume at the previous week’s levels.',
        'IF RPE for identical work rises ≥2 points for 2 sessions → treat it as 1 flag per session until resolved.',
        'Tendon fatigue signs (morning stiffness in elbow/wrist that eases with movement): no hard straight-arm work until the morning check is ≤1/10. Replace with bent-arm work.',
        'Scheduled deloads: Weeks 6 and 12 of each cycle.',
        'Protein ~1.6 g/kg/day; 7–9 h sleep.',
      ] },
    ],
  },
  {
    id: 'pain',
    title: 'Pain & injuries',
    summary: 'Pain rules and minimum prehab',
    blocks: [
      { type: 'table', head: ['Sensation', 'Class', 'Action'], rows: [
        ['Burning/aching in muscle belly, gone within minutes; DOMS 24–72 h', 'Muscular fatigue', 'Normal. Train unless soreness ≥5/10 in the target muscle'],
        ['Joint/tendon discomfort 0–2/10 during, gone by next morning', 'Acceptable', 'Continue; monitor'],
        ['3–5/10 during, or still present next morning, or worse than last session', 'Modify', 'Next session: −1 leverage level and −30–50% volume for that pattern; straight-arm → bent-arm if elbow/biceps; parallettes/wedges for wrist. Re-assess in 1 week'],
        ['>5/10, sharp/pinching, rising within a set, swelling, night pain, pop/sudden weakness, numbness, or no improvement after 2 weeks', 'Stop', 'Stop that pattern and see a sports physiotherapist or physician. Sudden elbow-crease pain with bruising during planche/BL/MU needs urgent assessment'],
      ] },
      { type: 'h', text: 'Minimum effective prehab' },
      { type: 'table', head: ['Region', 'Minimum dose', 'Modification'], rows: [
        ['Wrist', 'Daily 2–3 min wrist protocol; wrist curls/reverse curls 2 × 15, 2×/wk', 'Parallettes, fists, wedges'],
        ['Medial elbow', 'Wrist flexor eccentrics 2 × 15, 2×/wk; rotate grips', 'Neutral-grip rings; reduce straight-arm volume'],
        ['Lateral elbow', 'Wrist extensor work 2 × 15, 2×/wk', 'Thicker grips/rings; reduce pull volume'],
        ['Distal biceps', 'Straight-arm progressions gated by criteria; curls in the programme', 'Never jump more than one leverage level'],
        ['Shoulder / rotator cuff', 'Band ER 2 × 15, 2×/wk; face pulls/pull-aparts', 'Reduce dip depth; limit HSPU volume'],
        ['Lumbar', 'Hollow holds, back extensions, hip thrusts', 'Cue posterior pelvic tilt; regress lever length'],
      ] },
    ],
  },
  {
    id: 'micro',
    title: 'Micro-practice',
    summary: '5–15 min daily, never fatiguing',
    blocks: [
      { type: 'list', items: MICRO_PRACTICE.rules },
      { type: 'table', head: ['Block', 'Time', 'Content', 'Progression'], rows: MICRO_PRACTICE.blocks.map((b) => [b.title, b.duration, b.content, b.progression]) },
      { type: 'p', text: MICRO_PRACTICE.layout },
    ],
  },
  {
    id: 'equipment',
    title: 'Equipment',
    summary: 'What you need and what it unlocks',
    blocks: [
      { type: 'table', head: ['Category', 'Equipment', 'Unlocks'], rows: [
        ['Essential', 'Pull-up bar (wall/ceiling mount preferred)', 'All vertical pulls, FL, HLR, bar MU'],
        ['Essential', 'Gymnastic rings + straps', 'Rows, dips, ring push-ups, support, false grip, skin-the-cat, German hang, ring MU'],
        ['Essential', 'Resistance bands (light–heavy)', 'Assisted pull-ups/MU/Nordics, face pulls, dislocates, ER work'],
        ['Essential', 'Weighted vest (~20 kg) or dip belt + plates', 'Weighted pull-ups, dips, push-ups, split squats'],
        ['High value', 'Adjustable dumbbells (~25–30 kg each)', 'Loaded BSS, SL-RDL, hip thrust, lateral raises, curls, overhead extensions'],
        ['High value', 'Parallettes (low + medium)', 'L-sit, planche, deficit push-ups/HSPU, wrist-friendly grip'],
        ['High value', 'Sturdy flat bench / plyo box', 'BSS, box pistols, hip thrusts, elevated pikes, box jumps'],
        ['High value', 'Dip station (or rings)', 'Parallel dips, L-sit, support work'],
        ['High value', 'Chalk', 'Grip safety'],
        ['Later', 'Stall bars', 'Human flag, back extensions, Nordic anchor'],
        ['Later', 'Crash/landing mat', 'Freestanding HS, press, bail practice'],
        ['Later', 'Wrist blocks/wedges', 'Reduce wrist extension angle while tolerance builds'],
        ['Optional', 'Ankle weights, rubber flooring', 'Compression drills; floor protection'],
      ] },
    ],
  },
  {
    id: 'roadmap',
    title: 'Long-term plan',
    summary: 'Performance-gated phases',
    blocks: [
      { type: 'table', head: ['Phase', 'Entry', 'Focus', 'Typical'], rows: [
        ['0 Baseline', '—', 'Week 0 tests', '1 week'],
        ['1 Foundation', 'Any', 'CTW HS 60 s, 10 pull-ups, 10–15 dips, hollow 45 s, BSS loaded, box pistol, German hang tolerance, wrists pain-free', '0–3 months'],
        ['2 Strength + basic skills', 'Phase 1 standards', 'Freestanding HS 10–30 s, tuck → adv tuck FL, planche lean → tuck, bar MU, L-sit 20–30 s, pistol, Nordic eccentrics, weighted pull-up +15–25% BW', '3–9 months'],
        ['3 Intermediate', 'Pull +25% BW, dips +25% BW, adv tuck FL 8 s, tuck PL 10 s, HS 30 s', 'Straddle FL, adv tuck planche, ring MU, HSPU, tuck → straddle BL, flag start, V-sit, weighted pistols', '9–24 months'],
        ['4 Advanced strength', 'Straddle FL, adv tuck PL, HS 60 s, press from elevation', 'Full FL, straddle planche, press HS, full BL, flag, archer → assisted OAC', '18–36+ months'],
        ['5 Advanced integration', 'Most Phase 4 skills', 'Full planche, OAC/OAP, OAHS, 90° push-up, manna, combinations', 'Multi-year'],
      ] },
      { type: 'h', text: 'Checkpoints' },
      { type: 'list', items: [
        '3 months: 1 full cycle + re-test. Expected +20–50% on basic reps, freestanding kick-up attempts (if CTW was ≥60 s), lower box pistol, one level up on FL or planche.',
        '6 months: most Phase 1 standards complete; bar MU plausible.',
        '12 months: Phase 2 largely done, Phase 3 started.',
        '24+ months: Phase 3–4. Elite skills remain multi-year projects.',
      ] },
      { type: 'h', text: 'Gateway abilities' },
      { type: 'list', items: [
        'Scapular control + straight-arm strength → planche, FL, BL, press HS, flag.',
        '60 s chest-to-wall handstand + wrist tolerance → freestanding HS, HSPU, press, OAHS.',
        'Compression (L-sit 20–30 s) → press HS, V-sit, manna, better tuck shapes.',
        'Strong pull (10 strict, then +25% BW) → muscle-up, FL, OAC, flag.',
        'Strong dip (10 bar dips, then +25% BW) → muscle-up, planche, HSPU.',
        'Shoulder-extension tolerance (German hang 30 s) → back lever, skin-the-cat, ring MU, deep dips, manna.',
        'Pistol + ankle dorsiflexion → advanced single-leg work, jumping and landing.',
      ] },
    ],
  },
  {
    id: 'videos',
    title: 'Video library',
    summary: 'Verified tutorials',
    blocks: [
      { type: 'links', items: [
        { title: 'Scapular pull-up / scap mechanics', url: 'https://antranik.org/shoulder-mechanics/', source: 'Antranik', cue: 'From passive hang, pull shoulders away from ears' },
        { title: 'Pull-up', url: 'https://antranik.org/pull-ups/', source: 'Antranik', cue: 'Full elbow extension at bottom; depressed scapulae' },
        { title: 'Pike push-up', url: 'https://antranik.org/pike-pushups/', source: 'Antranik', cue: 'Vertical forearms; head travels ahead of fingers' },
        { title: 'Pseudo-planche lean', url: 'https://fitnessfaqs.com/articles/ff-video-tag/pseudo-planche-lean/', source: 'FitnessFAQs', cue: 'Shoulders forward of hands; protracted; straight elbows' },
        { title: 'Pseudo-planche push-up', url: 'https://fitnessfaqs.com/articles/ff-video-tag/pseudo-planche-push-up/', source: 'FitnessFAQs', cue: 'Band-assisted → bodyweight; maintain lean' },
        { title: 'Chest-to-wall handstand, kick-up', url: 'https://gmb.io/handstand/', source: 'GMB', cue: 'Walk up from plank; kick up gently' },
        { title: 'Freestanding handstand, bailing', url: 'https://gmb.io/freestanding-handstand/', source: 'GMB', cue: 'Practise bail/cartwheel exit; split-leg kick-up' },
        { title: 'False grip, ring support', url: 'https://gmb.io/gymnastic-rings-grips/', source: 'GMB', cue: 'Ring at mid-palm; support: straight wrists, arms at sides' },
        { title: 'Muscle-up (strict ring)', url: 'https://gmb.io/muscle-up/', source: 'GMB', cue: 'False grip; pull high, transition, press' },
        { title: 'Front lever progressions', url: 'https://fitnessfaqs.com/articles/ff-video-tag/front-lever-tutorial/', source: 'FitnessFAQs', cue: 'Tuck → adv tuck → straddle → full' },
        { title: 'L-sit', url: 'https://gmb.io/l-sit/', source: 'GMB', cue: 'Progress from tuck; compression is often the limiter' },
        { title: 'Pistol squat', url: 'https://squatuniversity.com/2016/06/24/6-steps-to-perfecting-your-pistol-squat/', source: 'Squat University', cue: 'Ankle and hip mobility; pistols to box' },
        { title: 'Pistol squat (alternative)', url: 'https://gmb.io/pistol/', source: 'GMB', cue: 'Own deep two-leg squat; roll-back drills' },
        { title: 'Shrimp / box pistol progression', url: 'http://www.startbodyweight.com/p/squat-progression.html', source: 'StartBodyweight', cue: '3 × 4–8; progress at 3 × 8' },
        { title: 'Wrist preparation', url: 'https://antranik.org/avoid-wrist-pain/', source: 'Antranik', cue: 'Warm up wrists every time' },
        { title: 'Overcoming Gravity charts', url: 'https://stevenlow.org/overcoming-gravity/', source: 'Steven Low', cue: 'Cross-reference level equivalences' },
        { title: 'FitnessFAQs channel', url: 'https://www.youtube.com/@FitnessFAQs', source: 'FitnessFAQs', cue: 'Dips, planche, rows, triceps' },
      ] },
      { type: 'h', text: 'Search for these terms' },
      { type: 'table', head: ['Exercise', 'Search'], rows: [
        ['Push-up', '"Antranik how to do pushups properly"'],
        ['Ring/inverted row', '"Antranik ring row maximization"'],
        ['Dips / ring dips', '"FitnessFAQs dips tutorial"'],
        ['Tuck planche', '"FitnessFAQs tuck planche"'],
        ['Hollow body hold', '"GMB hollow body"'],
        ['Hanging leg raise', '"FitnessFAQs hanging leg raise"'],
        ['Skin-the-cat / German hang', '"GMB skin the cat"'],
        ['Nordic curl', '"Squat University Nordic"'],
        ['Bulgarian split squat', '"Squat University Bulgarian split squat"'],
      ] },
    ],
  },
  {
    id: 'myths',
    title: 'Myths',
    summary: 'Fact-checking common claims',
    blocks: [
      { type: 'table', head: ['Claim', 'Verdict', 'Why'], rows: [
        ['High reps are needed for calisthenics gains', 'Unsupported', 'Hypertrophy occurs across broad rep ranges near failure; progress leverage or add weight rather than chasing 30+ reps'],
        ["Calisthenics can't build large muscles", 'Unsupported (caveat)', 'Push-up trials match moderate-load bench; lower body and small muscles need loads'],
        ['Never use weights', 'Unsupported', 'Weighted pulls/dips and loaded legs are most efficient once reps exceed ~12–15'],
        ['Train skills every day', 'Context dependent', 'Low-load balance skills: yes. High-tension statics: no'],
        ['You must train to failure', 'Unsupported', 'Strength doesn’t need failure; hypertrophy benefits modestly from 0–2 RIR'],
        ['Rings are automatically superior', 'Unsupported', 'Valuable, but harder to load progressively for max strength'],
        ['Bodyweight legs are enough for max leg strength', 'Unsupported', 'Maximal strength needs external load'],
        ['Planche is mainly shoulders', 'Partially', 'Serratus, pecs, biceps, wrist flexors, core and glutes all limit it'],
        ['Front lever is mainly lats', 'Partially', 'Trunk rigidity and scapular depression often limit it'],
      ] },
    ],
  },
];
