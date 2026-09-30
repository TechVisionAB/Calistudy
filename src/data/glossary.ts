// Plain-English explanations for the guide's jargon. Used by the "?" buttons.
import { LADDERS } from './ladders';
import { LADDER_SV, LEVEL_SV } from './sv';

export type Term = { term: string; match: RegExp; text: string };

export const GLOSSARY: Term[] = [
  { term: 'RIR', match: /\bRIR\b/, text: 'Reps In Reserve – how many more reps you could have done. RIR 2 = stop when you have about 2 reps left. In the app: Easy ≈ 3, Just right ≈ 2, Hard ≈ 1, Max = 0.' },
  { term: 'RPE', match: /\bRPE\b/, text: 'Rate of perceived exertion on a 1–10 scale. RPE ≤6 = should feel easy, far from max.' },
  { term: 'Hold reserve', match: /hold reserve/i, text: 'For holds: stop 2–3 seconds before your form breaks, instead of holding until you fall.' },
  { term: 'CTW', match: /\bCTW\b|chest-to-wall/i, text: 'Chest-to-wall: a handstand with your stomach/chest facing the wall (you walk your feet up the wall). Easier to hold a straight line than with your back to the wall.' },
  { term: 'Toe pulls', match: /toe[- ]pulls?/i, text: 'Handstand with your back to the wall: gently pull your toes off the wall and balance freely for as long as you can (goal ≥3 s), then back. Practices balance for a freestanding handstand.' },
  { term: 'Shoulder taps', match: /shoulder taps?/i, text: 'In a wall handstand: shift your weight to one hand and touch your shoulder with the other. Builds strength and balance.' },
  { term: 'Bail / cartwheel out', match: /\bbail\b|cartwheel/i, text: 'Safely getting out of a handstand that tips over: twist your hips and step out to the side like a cartwheel.' },
  { term: 'Tuck', match: /\btuck\b/i, text: 'Knees pulled in to the chest – the shortest and easiest version of e.g. planche and front lever.' },
  { term: 'Advanced tuck', match: /adv(anced)? tuck/i, text: 'Tuck with a flat back and the hips further out – the next step after tuck.' },
  { term: 'Straddle', match: /straddle/i, text: 'Legs straight and spread apart in a V. Harder than tuck, easier than legs together.' },
  { term: 'Half-lay / one-leg', match: /half-lay|one-leg/i, text: 'In-between step: one leg straight and one bent, or both legs half bent.' },
  { term: 'Protraction', match: /protract/i, text: 'Push the shoulder blades apart and forward (round the upper back), like pushing the floor away.' },
  { term: 'Depression', match: /depress/i, text: 'Pull the shoulders down, away from the ears.' },
  { term: 'Scap / shoulder blades', match: /\bscap(ular|s)?\b/i, text: 'The shoulder blades. Scap pull-ups/push-ups = small movements where only the shoulder blades move, arms stay straight.' },
  { term: 'Full ROM', match: /\bROM\b/, text: 'Full range of motion – all the way down and all the way up.' },
  { term: 'BW', match: /\bBW\b/, text: 'Bodyweight. "+10% BW" = extra weight equal to 10% of your bodyweight (e.g. 8 kg if you weigh 80).' },
  { term: 'Tempo', match: /tempo|\b\d-\d-[\dX]-\d\b/i, text: 'Four numbers: seconds down – pause at the bottom – up – pause at the top. X = as fast as you can. 3-1-X-0 = 3 s down, 1 s pause, explosive up.' },
  { term: 'Superset', match: /superset/i, text: 'Two exercises done in alternation: a set of one, rest, a set of the other, rest, and so on.' },
  { term: 'Deload', match: /deload/i, text: 'An easier week (weeks 6 and 12) with about half the volume, so your body has time to recover and get stronger.' },
  { term: 'Block', match: /\bblock\b/i, text: 'The program has two 5-week blocks. Block 2 (weeks 7–11) swaps some exercises for harder ones once you meet the requirements.' },
  { term: 'Zone 2', match: /zone ?2/i, text: 'Easy cardio where you can still talk in full sentences – brisk walking, cycling, light jogging.' },
  { term: 'False grip', match: /false[- ]grip/i, text: 'A ring grip where the wrist sits on top of the ring. Needed for ring muscle-ups.' },
  { term: 'RTO', match: /\bRTO\b|turned out/i, text: 'Rings Turned Out – turn the rings outward so your thumbs point out. Harder, and better for the shoulders in the long run.' },
  { term: 'German hang', match: /german hang/i, text: 'Hang from rings/bar with your arms behind your body – stretches the front of the shoulders. Progress carefully.' },
  { term: 'Skin the cat', match: /skin[- ]the[- ]cat/i, text: 'Roll backward through your arms on rings/bar into a german hang and back.' },
  { term: 'Hollow body', match: /hollow/i, text: 'Lie on your back, press your lower back into the floor and lift your shoulders and straight legs. The foundation for almost every skill.' },
  { term: 'L-sit', match: /L-sit/i, text: 'Support yourself on straight arms with straight legs out in front, hips off the ground.' },
  { term: 'Pike', match: /\bpike\b/i, text: 'Hips bent with straight legs, like an upside-down V.' },
  { term: 'Pancake', match: /pancake/i, text: 'Seated with legs apart, fold your upper body forward.' },
  { term: 'Negatives / eccentric', match: /negative|eccentric/i, text: 'Only the lowering part of the movement, done slowly (e.g. 5 s down). Great for getting strong enough for the full movement.' },
  { term: 'Box pistol', match: /box pistol/i, text: 'Pistol squat down to a box/chair and back up. Lower the box 10–15 cm once you meet the requirement.' },
  { term: 'Nordic', match: /nordic/i, text: 'Kneel with your feet anchored and slowly fall forward with straight hips. Very effective for the hamstrings.' },
  { term: 'SL-RDL', match: /SL-RDL|single-leg RDL/i, text: 'Single-leg deadlift: hinge your hips back on one leg with a flat back while the other leg goes back.' },
  { term: 'BSS', match: /\bBSS\b|bulgarian/i, text: 'Bulgarian split squat: a split squat with the back foot on a bench.' },
  { term: 'Copenhagen', match: /copenhagen/i, text: 'Side plank with the top leg on a bench – strengthens the inner thigh (adductors).' },
  { term: 'Pallof press', match: /pallof/i, text: 'Hold a band anchored to the side, press your arms out and resist being twisted.' },
  { term: 'MU', match: /\bMU\b/, text: 'Muscle-up: a pull-up that continues over the bar/rings into support on straight arms.' },
  { term: 'HSPU', match: /HSPU/i, text: 'Handstand push-up – a push-up in a handstand.' },
  { term: 'C2B', match: /C2B|chest-to-bar/i, text: 'Chest-to-bar: a pull-up where your chest reaches the bar.' },
  { term: 'OAC / OAP', match: /\bOA[CP]\b/, text: 'One-arm chin-up / one-arm pull-up.' },
  { term: 'OAHS', match: /OAHS/, text: 'One-arm handstand.' },
  { term: 'DB', match: /\bDB\b/, text: 'Dumbbell.' },
  { term: 'Plyo', match: /plyo/i, text: 'Plyometrics: jumps and bounces at maximum speed.' },
  { term: 'Gateway', match: /gateway/i, text: 'A basic ability that unlocks several advanced skills (e.g. 10 strict pull-ups → muscle-up, front lever).' },
];

const LEVEL_RE = /\b(VPu|HPu|HP|VP|DP|HS|PL|MU|FL|BL|HF|CC|SL|KF|H)(\d+[ab]?)\b/g;

export type Found = { term: string; text: string };

/** Glossary terms and ladder level codes that appear in a piece of text. */
export function explain(text: string): Found[] {
  const out: Found[] = [];
  const seen = new Set<string>();
  for (const m of text.matchAll(LEVEL_RE)) {
    const code = m[0];
    if (seen.has(code)) continue;
    const ladder = LADDERS.find((l) => l.levels.some((x) => x.code === code));
    const lvl = ladder?.levels.find((x) => x.code === code);
    if (!ladder || !lvl) continue;
    seen.add(code);
    out.push({
      term: code,
      text: `${LADDER_SV[ladder.id] ?? ladder.name}, level ${lvl.code.replace(/^[A-Za-z]+/, '')}: ${LEVEL_SV[code] ?? lvl.name}. Move on when you can do: ${lvl.advance}.`,
    });
  }
  for (const g of GLOSSARY) {
    if (g.match.test(text) && !seen.has(g.term)) {
      seen.add(g.term);
      out.push({ term: g.term, text: g.text });
    }
  }
  if (/[<≥≤]\s?\d+|→/.test(text)) {
    out.push({ term: 'How to read "<20 s → HS1"', text: 'The result on the left gives the level on the right. "<20 s → HS1" means: if you manage less than 20 seconds, you start at level HS1. "≥60 s" means 60 seconds or more.' });
  }
  return out;
}
