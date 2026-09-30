import { LADDER_BY_ID } from '@/data/ladders';
import { Equip, LEVEL_NEEDS } from '@/data/sv';
import { Experience } from './store';

/**
 * Conservative starting levels per self-reported experience. The Week 0 test is still
 * the accurate way; these just let someone train today. Starting too easy is safer
 * than too hard — the progression rules move people up within two sessions.
 */
const START: Record<Experience, Record<string, string>> = {
  new: { HP: 'HP1', VP: 'VP1', DP: 'DP1', HS: 'HS1', PL: 'PL0a', VPu: 'VPu2', HPu: 'HPu1', MU: 'MU0', FL: 'FL0', BL: 'BL0', HF: 'HF1', CC: 'CC1', SL: 'SL1', H: 'H1', KF: 'KF1' },
  some: { HP: 'HP2', VP: 'VP1', DP: 'DP2', HS: 'HS1', PL: 'PL0a', VPu: 'VPu3', HPu: 'HPu2', MU: 'MU0', FL: 'FL0', BL: 'BL0', HF: 'HF1', CC: 'CC2', SL: 'SL2', H: 'H2', KF: 'KF2' },
  solid: { HP: 'HP3', VP: 'VP2', DP: 'DP3', HS: 'HS2', PL: 'PL0a', VPu: 'VPu4', HPu: 'HPu2', MU: 'MU0', FL: 'FL1', BL: 'BL0', HF: 'HF1', CC: 'CC3', SL: 'SL3', H: 'H3', KF: 'KF3' },
};

export const EXPERIENCES: { id: Experience; title: string; desc: string }[] = [
  { id: 'new', title: 'Beginner', desc: 'Rarely trains. Fewer than 10 push-ups and no pull-ups.' },
  { id: 'some', title: 'Some experience', desc: '10–20 push-ups, the odd pull-up.' },
  { id: 'solid', title: 'Experienced', desc: '20+ push-ups, 5–10 pull-ups and a few dips.' },
];

const usable = (code: string, equipment: Equip[]) => {
  const need = LEVEL_NEEDS[code];
  return !need || need.some((e) => equipment.includes(e));
};

export function estimateLevels(experience: Experience, equipment: Equip[]): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [ladder, code] of Object.entries(START[experience])) {
    const levels = LADDER_BY_ID[ladder].levels.map((l) => l.code);
    let i = levels.indexOf(code);
    // Step down to a level the equipment allows; if none, keep the estimate (the exercise is swapped anyway).
    while (i > 0 && !usable(levels[i], equipment)) i--;
    out[ladder] = usable(levels[i], equipment) ? levels[i] : code;
  }
  return out;
}
