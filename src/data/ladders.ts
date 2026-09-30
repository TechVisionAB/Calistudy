// Skill ladders — Section 5 of docs/guide.md.
// Exercise names and criteria are kept in the guide's original English wording.

export type Level = { code: string; name: string; advance: string };

export type LadderGroup = 'Push' | 'Pull' | 'Skills' | 'Core' | 'Legs';

export type Ladder = {
  id: string;
  name: string;
  group: LadderGroup;
  /** 'dynamic' ladders are rep based, 'static' ladders are hold based. */
  kind: 'dynamic' | 'static';
  levels: Level[];
  notes: { label: string; text: string }[];
};

export const LADDERS: Ladder[] = [
  {
    id: 'HP',
    name: 'Horizontal push',
    group: 'Push',
    kind: 'dynamic',
    levels: [
      { code: 'HP1', name: 'Incline push-up (hands on bench/box)', advance: '3×12 @ RIR 2' },
      { code: 'HP2', name: 'Push-up (full ROM, chest to fist height)', advance: '3×12 @ RIR 2' },
      { code: 'HP3', name: 'Diamond/close push-up or deficit push-up (parallettes)', advance: '3×10' },
      { code: 'HP4', name: 'Ring push-up (rings 5–10 cm off floor), RTO at top', advance: '3×10' },
      { code: 'HP5', name: 'Archer push-up (per side)', advance: '3×8/side' },
      { code: 'HP6', name: 'Pseudo-planche push-up (hands at lower ribs, shoulders ahead of hands)', advance: '3×8' },
      { code: 'HP7', name: 'Weighted push-up / weighted ring push-up (vest +10→+20% BW)', advance: '3×8 at +20% BW' },
      { code: 'HP8', name: 'Incline one-arm push-up (hand on bench), lowering box height over time', advance: '3×5/side at knee height' },
      { code: 'HP9', name: 'One-arm push-up (feet ≤ shoulder width)', advance: 'Mastery: 3×5/side' },
    ],
    notes: [
      { label: 'Prerequisites', text: 'A 60 s plank without sag.' },
      { label: 'Muscles', text: 'Pecs, anterior delts, triceps, serratus.' },
      { label: 'Common mistakes', text: 'Elbows flared >60°, sagging hips, a half-ROM bottom, no protraction at the top.' },
      { label: 'Injury risk', text: 'Wrist extension pain (use parallettes or fists); anterior shoulder pain in deep deficits (reduce depth).' },
      { label: 'Assistance', text: 'Dips, weighted push-ups, overhead triceps extension.' },
      { label: "Don't train hard", text: 'Within 48 h of a hard planche session if you have distal-biceps or wrist symptoms.' },
    ],
  },
  {
    id: 'VP',
    name: 'Vertical push',
    group: 'Push',
    kind: 'dynamic',
    levels: [
      { code: 'VP1', name: 'Pike push-up, feet on floor, head travels ahead of the hands (tripod)', advance: '3×10' },
      { code: 'VP2', name: 'Elevated pike push-up (feet on box, hips at ~90°)', advance: '3×8' },
      { code: 'VP3', name: 'Wall HSPU to a 10–15 cm pad (partial ROM)', advance: '3×6' },
      { code: 'VP4', name: 'Wall HSPU, full (head to floor)', advance: '3×6' },
      { code: 'VP5', name: 'Deficit wall HSPU on parallettes', advance: '3×5' },
      { code: 'VP6', name: 'Freestanding HSPU (needs freestanding HS ≥30 s)', advance: '3×3' },
      { code: 'VP7', name: 'Deep freestanding HSPU (parallettes)', advance: '3×3' },
      { code: 'VP8', name: '90° push-up (planche-to-HS transition; elite)', advance: 'Long-term' },
    ],
    notes: [
      { label: 'Mobility', text: '~180° shoulder flexion with ribs down (wall test, Test C).' },
      { label: 'Common mistakes', text: 'Elbows flaring wide, head landing between the hands instead of forming a tripod ahead of them, banana back.' },
      { label: 'Injury risk', text: 'Neck (never crash-load the head); rotator cuff irritation from excessive volume.' },
      { label: 'Assistance', text: 'DB overhead press, lateral raises, triceps extensions.' },
    ],
  },
  {
    id: 'DP',
    name: 'Dips',
    group: 'Push',
    kind: 'dynamic',
    levels: [
      { code: 'DP1', name: 'Parallel-bar support hold, depressed shoulders', advance: '60 s' },
      { code: 'DP2', name: 'Negative dips (5 s)', advance: '3×5' },
      { code: 'DP3', name: 'Parallel-bar dips (shoulder just below elbow)', advance: '3×10' },
      { code: 'DP4', name: 'Ring support hold, turned out (RTO)', advance: '30 s' },
      { code: 'DP5', name: 'Ring dips', advance: '3×8' },
      { code: 'DP6', name: 'Weighted bar dips, +10% → +25% → +40% BW', advance: '3×6 at +40% BW' },
      { code: 'DP7', name: 'RTO ring dips / weighted ring dips / Korean dips', advance: 'Long-term' },
    ],
    notes: [
      { label: 'Mobility', text: 'Shoulder extension ~45–60° pain-free (German-hang tolerance helps).' },
      { label: 'Common mistakes', text: 'Shoulder rolling forward, shrugging, excessive depth before you are ready.' },
      { label: 'Injury risk', text: 'Anterior shoulder and sternoclavicular pain. Reduce depth before reducing volume.' },
      { label: "Don't train", text: 'When anterior shoulder pain is ≥3/10.' },
    ],
  },
  {
    id: 'HS',
    name: 'Handstand',
    group: 'Skills',
    kind: 'static',
    levels: [
      { code: 'HS1', name: 'Wall plank / pike hold on box, shoulders open', advance: '3×30 s' },
      { code: 'HS2', name: 'Chest-to-wall (CTW) handstand, hands 10–20 cm from wall', advance: '2×60 s' },
      { code: 'HS3', name: 'CTW shoulder taps + weight shifts', advance: '2×10 taps/side' },
      { code: 'HS4', name: 'Back-to-wall kick-up + toe pulls; controlled bail (cartwheel out)', advance: '10 toe-pulls ≥3 s' },
      { code: 'HS5', name: 'Freestanding kick-up, holds 5–10 s', advance: '≥7/10 attempts ≥10 s' },
      { code: 'HS6', name: 'Freestanding 30 s', advance: '≥7/10 attempts ≥30 s' },
      { code: 'HS7', name: '60 s + walking + tuck/straddle shape changes', advance: '60 s ×3' },
      { code: 'HS8', name: 'Press handstand (straddle → pike), from elevated start first', advance: '3×3' },
      { code: 'HS9', name: 'One-arm handstand pathway', advance: 'Multi-year' },
    ],
    notes: [
      { label: 'Mobility', text: 'Full shoulder flexion; wrist extension ~90°+.' },
      { label: 'Common mistakes', text: 'Banana back, bent elbows, looking far forward, kicking too hard.' },
      { label: 'Train', text: 'Daily micro-practice (distributed practice).' },
      { label: 'Not when', text: 'Wrist pain ≥3/10 or neck symptoms.' },
    ],
  },
  {
    id: 'PL',
    name: 'Planche',
    group: 'Skills',
    kind: 'static',
    levels: [
      { code: 'PL0a', name: 'Planche lean: shoulders 5–15 cm ahead of hands, protracted, straight elbows', advance: '3×20 s at 15 cm' },
      { code: 'PL0b', name: 'Frog stand / crow (balance)', advance: '30 s' },
      { code: 'PL1', name: 'Tuck planche (hips at shoulder height)', advance: '5×10 s, best hold ≥15 s' },
      { code: 'PL2', name: 'Advanced tuck (flat back)', advance: '5×10 s' },
      { code: 'PL3', name: 'Half-lay / one-leg / straddle', advance: '5×8 s' },
      { code: 'PL4', name: 'Full planche', advance: '5×5 s' },
      { code: 'PL5', name: 'Planche push-ups, maltese pathway', advance: 'Elite' },
    ],
    notes: [
      { label: 'Prerequisites', text: 'DP3 (10 dips), 60 s support hold, pain-free 90° loaded wrist extension, HP4 or better.' },
      { label: 'Muscles', text: 'Anterior deltoid, serratus anterior, pecs, biceps (elbow stabiliser), wrist flexors, core, glutes and lower traps. Not "just shoulders".' },
      { label: 'Common mistakes', text: 'Bent elbows, retracted scapulae, piked hips, insufficient lean.' },
      { label: 'Injury risk', text: 'Distal biceps, medial elbow, wrist extension; lumbar strain if you arch.' },
      { label: 'Assistance', text: 'Pseudo-planche push-ups, planche leans, band-assisted holds, weighted dips.' },
      { label: 'Not when', text: 'Elbow-crease pain, or within 48 h of the last hard planche session.' },
    ],
  },
  {
    id: 'VPu',
    name: 'Vertical pull',
    group: 'Pull',
    kind: 'dynamic',
    levels: [
      { code: 'VPu1', name: 'Active hang + scapular pull-ups', advance: '3×10 scap pulls, 30 s active hang' },
      { code: 'VPu2', name: 'Negative pull-ups (5 s)', advance: '3×5' },
      { code: 'VPu3', name: 'Band-assisted pull-up', advance: '3×8 with light band' },
      { code: 'VPu4', name: 'Pull-up (dead hang, chin over bar)', advance: '3×10' },
      { code: 'VPu5', name: 'Chest-to-bar pull-up', advance: '3×6' },
      { code: 'VPu6', name: 'Weighted pull-up, +10% → +25% → +40% BW', advance: '3×5 at +25% BW unlocks VPu7; +40% is "strong"' },
      { code: 'VPu7', name: 'Archer / typewriter pull-ups', advance: '3×5/side' },
      { code: 'VPu8', name: 'Assisted one-arm chin (towel/finger assist, band)', advance: '3×3/side with minimal assist' },
      { code: 'VPu9', name: 'One-arm chin / one-arm pull-up', advance: 'Elite' },
    ],
    notes: [
      { label: 'Explosive branch', text: 'High pull-ups to lower-sternum → chest-to-bar with hands release → muscle-up.' },
      { label: 'Common mistakes', text: 'Kipping, partial ROM, elbows leading before the scapulae move, craned neck.' },
      { label: 'Injury risk', text: "Medial elbow (golfer's elbow) with high volume in a pronated grip; lateral elbow from gripping. Rotate grips." },
    ],
  },
  {
    id: 'HPu',
    name: 'Horizontal pull',
    group: 'Pull',
    kind: 'dynamic',
    levels: [
      { code: 'HPu1', name: 'Incline ring row (body ~45°)', advance: '3×12' },
      { code: 'HPu2', name: 'Horizontal ring/bar row, feet on floor', advance: '3×12' },
      { code: 'HPu3', name: 'Feet-elevated row', advance: '3×10' },
      { code: 'HPu4', name: 'Archer ring row / weighted-vest row', advance: '3×8/side or +15% BW' },
      { code: 'HPu5', name: 'Tuck front-lever row → adv tuck FL row', advance: '3×6' },
    ],
    notes: [],
  },
  {
    id: 'MU',
    name: 'Muscle-up',
    group: 'Skills',
    kind: 'dynamic',
    levels: [
      { code: 'MU0', name: 'Prerequisites', advance: '10 strict pull-ups, 5 chest-to-bar, 10 straight-bar dips, false-grip hang 30 s (ring MU only)' },
      { code: 'MU1', name: 'Explosive pull-ups to lower-sternum', advance: '5×3 at sternum height' },
      { code: 'MU2', name: 'Transition drills (low bar/rings, feet on floor, knee-assisted)', advance: '3×5 smooth' },
      { code: 'MU3', name: 'Band-assisted / jumping MU with slow negatives', advance: '3×3' },
      { code: 'MU4', name: 'Strict bar MU', advance: '3×3' },
      { code: 'MU5', name: 'Strict ring MU (false grip)', advance: '3×3' },
      { code: 'MU6', name: 'Weighted / slow MU, then advanced variants', advance: 'Long-term' },
    ],
    notes: [
      { label: 'Common mistakes', text: 'Chicken-winging (one arm over first), insufficient pull height, pulling vertically instead of around the bar.' },
      { label: 'Injury risk', text: 'Elbow and wrist during the transition. Limit to 2×/wk and ≤20 total reps per session.' },
    ],
  },
  {
    id: 'FL',
    name: 'Front lever',
    group: 'Skills',
    kind: 'static',
    levels: [
      { code: 'FL0', name: 'Prerequisites (3×8 scap pulls + 3×20 s hollow)', advance: 'VPu4 3×8, hollow body 45 s, scap pulls with depression' },
      { code: 'FL1', name: 'Tuck FL', advance: '5×10 s' },
      { code: 'FL2', name: 'Advanced tuck (flat back)', advance: '5×10 s' },
      { code: 'FL3', name: 'One-leg / half-lay', advance: '5×8 s' },
      { code: 'FL4', name: 'Straddle', advance: '5×8 s' },
      { code: 'FL5', name: 'Full FL', advance: '5×5 s' },
      { code: 'FL6', name: 'FL pulls/rows/raises, then one-arm pathway', advance: 'Elite' },
    ],
    notes: [
      { label: 'Muscles', text: 'Lats, teres major, posterior delts, lower traps, rectus abdominis, glutes. Not "just lats".' },
      { label: 'Common mistakes', text: 'Bent arms, hips sagging, scapulae elevated.' },
      { label: 'Assistance', text: 'FL raises, tuck FL rows, straight-arm band pulldowns, weighted pull-ups.' },
    ],
  },
  {
    id: 'BL',
    name: 'Back lever',
    group: 'Skills',
    kind: 'static',
    levels: [
      { code: 'BL0', name: 'German hang (feet on floor → free), pain-free', advance: '30 s relaxed' },
      { code: 'BL0b', name: 'Skin-the-cat, slow both directions', advance: '5 reps' },
      { code: 'BL1', name: 'Tuck BL', advance: '5×10 s' },
      { code: 'BL2', name: 'Adv tuck → straddle → full BL', advance: '5×8 s per level' },
    ],
    notes: [
      { label: 'Injury risk', text: 'Distal biceps and anterior shoulder. Start only when German hang is pain-free. Progress one level per ≥4 weeks minimum, even if the hold criteria are met sooner.' },
    ],
  },
  {
    id: 'HF',
    name: 'Human flag',
    group: 'Skills',
    kind: 'static',
    levels: [
      { code: 'HF1', name: 'Vertical flag (support flag)', advance: '5×8 s' },
      { code: 'HF2', name: 'Tuck flag', advance: '5×8 s' },
      { code: 'HF3', name: 'One-leg / straddle flag', advance: '5×8 s' },
      { code: 'HF4', name: 'Full flag', advance: '5×8 s' },
    ],
    notes: [
      { label: 'Prerequisites', text: 'Side plank 60 s, VPu4 3×8, DP3, HS2.' },
      { label: 'Equipment', text: "Stall bars or a vertical pole; you can't do it on a doorway pull-up bar." },
      { label: 'When', text: 'Delay to Phase 3.' },
    ],
  },
  {
    id: 'CC',
    name: 'Core & compression',
    group: 'Core',
    kind: 'dynamic',
    levels: [
      { code: 'CC1', name: 'Hollow body (tuck → full)', advance: '3×45 s full' },
      { code: 'CC2', name: 'Hanging knee raise', advance: '3×12' },
      { code: 'CC3', name: 'Hanging leg raise (straight legs to 90°)', advance: '3×10' },
      { code: 'CC4', name: 'Toes-to-bar (strict, no swing)', advance: '3×8' },
      { code: 'CC5', name: 'Tuck L-sit → one-leg → full L-sit', advance: '30 s full' },
      { code: 'CC6', name: 'Compression drills: seated pike / pancake leg lifts', advance: '3×10 lifts, 2 s holds' },
      { code: 'CC7', name: 'V-sit (45° → 90° hips)', advance: '15 s' },
      { code: 'CC8', name: 'Manna pathway', advance: 'Multi-year' },
    ],
    notes: [
      { label: 'Anti-rotation', text: 'Pallof press, suitcase carry.' },
      { label: 'Anti-extension', text: 'Hollow, ab wheel.' },
    ],
  },
  {
    id: 'SL',
    name: 'Single-leg squat',
    group: 'Legs',
    kind: 'dynamic',
    levels: [
      { code: 'SL1', name: 'Assisted squat (hold door frame/rings), full depth', advance: '3×15' },
      { code: 'SL2', name: 'Split squat (rear knee to pad)', advance: '3×12/leg' },
      { code: 'SL3', name: 'Bulgarian split squat, bodyweight', advance: '3×12/leg' },
      { code: 'SL4', name: 'Box pistol from ≈45 cm, lower box by 10–15 cm steps', advance: '3×6/leg at each height' },
      { code: 'SL5', name: 'Counterbalanced pistol (2.5–5 kg in front) or heel-elevated pistol', advance: '3×6/leg' },
      { code: 'SL6', name: 'Pistol squat (heel down, controlled)', advance: '3×8/leg' },
      { code: 'SL7', name: 'Weighted pistol (+10% → +25% BW) / dragon pistol', advance: 'Long-term' },
    ],
    notes: [
      { label: 'Shrimp branch', text: 'Beginner shrimp (hands forward, knee to pad) → intermediate (knee touches floor) → advanced (hold rear foot) → weighted. 3 sets of 4–8; progress at 3×8.' },
    ],
  },
  {
    id: 'H',
    name: 'Hinge',
    group: 'Legs',
    kind: 'dynamic',
    levels: [
      { code: 'H1', name: 'Glute bridge', advance: '3×12 at RIR 2' },
      { code: 'H2', name: 'Single-leg glute bridge', advance: '3×12 at RIR 2' },
      { code: 'H3', name: 'Single-leg RDL (BW)', advance: '3×12 at RIR 2' },
      { code: 'H4', name: 'SL-RDL with DB', advance: '3×12 at RIR 2' },
      { code: 'H5', name: 'Loaded hip thrust / 45° back extension', advance: '3×12 at RIR 2' },
    ],
    notes: [],
  },
  {
    id: 'KF',
    name: 'Knee flexion',
    group: 'Legs',
    kind: 'dynamic',
    levels: [
      { code: 'KF1', name: 'Bridge walkouts', advance: '3×10' },
      { code: 'KF2', name: 'Bilateral sliding leg curl', advance: '3×10' },
      { code: 'KF3', name: 'Single-leg sliding curl', advance: '3×10' },
      { code: 'KF4', name: 'Band-assisted Nordic eccentric', advance: '3×5' },
      { code: 'KF5', name: 'Full Nordic eccentric (≥5 s descent)', advance: '3×5' },
      { code: 'KF6', name: 'Full Nordic with concentric', advance: '3×5' },
    ],
    notes: [
      { label: 'Evidence', text: 'Programmes that include the Nordic hamstring exercise reduce hamstring injuries by up to 51% (van Dyk et al. 2019, team-sport populations).' },
    ],
  },
];

export const LADDER_BY_ID: Record<string, Ladder> = Object.fromEntries(LADDERS.map((l) => [l.id, l]));

export const OTHER_LOWER_LADDERS = [
  { pattern: 'Calves', ladder: 'Bilateral → single-leg straight-knee (gastrocnemius) → loaded; bent-knee (soleus)', advance: '3×15/leg with 2 s stretch pause, then add DB' },
  { pattern: 'Adductors', ladder: 'Copenhagen short-lever (knee) → long-lever (foot) → with leg raises; Cossack squat', advance: '3×30 s long lever' },
  { pattern: 'Abductors', ladder: 'Side-lying hip abduction → banded lateral walk → side plank with top-leg raise', advance: '3×15' },
  { pattern: 'Explosive', ladder: 'Pogo hops → countermovement jump/box jump → broad jump → single-leg bounds → depth jumps (later)', advance: 'Stop sets at any drop in height' },
];
