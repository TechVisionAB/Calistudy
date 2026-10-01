// "Early wins": personal records, badges and first-vs-now comparisons.
// Everything is derived from the workout logs — nothing here is persisted.

import { LADDER_BY_ID } from '@/data/ladders';
import { Unit } from '@/data/sessions';
import { LADDER_SV, LEVEL_SV } from '@/data/sv';
import { isHoldUnit, unitLabel } from './plan';
import { EntryLog, WorkoutLog } from './store';

const DAY = 24 * 60 * 60 * 1000;

const best = (e: EntryLog): number | null => {
  const vals = e.sets.map((s) => s.value).filter((v): v is number => v !== null);
  return vals.length ? Math.max(...vals) : null;
};

/** Friendly name of what was actually done: the level name for ladder work, else the exercise name. */
export const entryName = (e: Pick<EntryLog, 'name' | 'level'>) => (e.level ? LEVEL_SV[e.level] ?? e.name : e.name);

/** Same exercise at the same level (values are only comparable within a level). */
const exerciseKey = (e: EntryLog) => (e.ladder && e.level ? `L:${e.ladder}:${e.level}:${e.unit}` : `N:${e.name}:${e.unit}`);

const levelIndex = (ladder: string | undefined, code: string | undefined): number => {
  if (!ladder || !code) return -1;
  return LADDER_BY_ID[ladder]?.levels.findIndex((l) => l.code === code) ?? -1;
};

/** True when the entry is at `code` or a harder level of the same ladder. */
const atLeast = (e: EntryLog, code: string): boolean => {
  const ladder = code.match(/^[A-Za-z]+/)?.[0];
  if (!ladder || e.ladder !== ladder) return false;
  const idx = levelIndex(e.ladder, e.level);
  const target = levelIndex(ladder, code);
  return idx >= 0 && target >= 0 && idx >= target;
};

export const formatValue = (value: number, unit: Unit) => `${value} ${unitLabel(unit)}`;
export const formatDelta = (delta: number, unit: Unit) => `${delta > 0 ? '+' : ''}${delta} ${unitLabel(unit)}`;

const sortAsc = (ws: WorkoutLog[]) => [...ws].sort((a, b) => a.date.localeCompare(b.date));

// ---------- Personal records ----------

export type PersonalRecord = { name: string; value: number; previous: number; delta: number; unit: Unit; ladder?: string; level?: string };
/** A first-ever set of an exercise/level. `newLevel` = the ladder was trained before, but never at this level. */
export type FirstTime = { name: string; value: number; unit: Unit; ladder?: string; level?: string; newLevel: boolean };

/**
 * Compares each entry's best set in `log` with the best previous set of the same exercise at the
 * same level. Only strict improvements are records; never-done-before entries are returned as `firsts`.
 */
export function personalRecords(log: WorkoutLog, previous: WorkoutLog[]): { records: PersonalRecord[]; firsts: FirstTime[] } {
  const prevBest = new Map<string, number>();
  const ladders = new Set<string>();
  for (const w of previous) {
    if (w.id === log.id) continue;
    for (const e of w.entries) {
      const b = best(e);
      if (b === null) continue;
      if (e.ladder) ladders.add(e.ladder);
      const k = exerciseKey(e);
      prevBest.set(k, Math.max(prevBest.get(k) ?? -Infinity, b));
    }
  }
  const records: PersonalRecord[] = [];
  const firsts: FirstTime[] = [];
  for (const e of log.entries) {
    const b = best(e);
    if (b === null) continue;
    const p = prevBest.get(exerciseKey(e));
    const base = { name: entryName(e), unit: e.unit, ladder: e.ladder, level: e.level };
    if (p === undefined) firsts.push({ ...base, value: b, newLevel: !!e.ladder && ladders.has(e.ladder) });
    else if (b > p) records.push({ ...base, value: b, previous: p, delta: b - p });
  }
  return { records, firsts };
}

// ---------- Milestones / badges ----------

export type Milestone = { id: string; emoji: string; title: string; desc: string };
export type EarnedMilestone = Milestone & { date: string; workoutId: string };

export const MILESTONES: Milestone[] = [
  { id: 'first', emoji: '🎯', title: 'First workout', desc: 'Log your very first workout.' },
  { id: 'week', emoji: '📅', title: 'Full week', desc: 'Train 3 times in one week (Mon–Sun).' },
  { id: 'w10', emoji: '🔟', title: '10 workouts', desc: 'Finish 10 workouts.' },
  { id: 'hollow30', emoji: '🧘', title: 'Solid core', desc: 'Hold a hollow body for 30 s in one set.' },
  { id: 'pushup', emoji: '💪', title: 'Floor push-up', desc: 'Do your first full push-up on the floor.' },
  { id: 'dip', emoji: '🪑', title: 'First dip', desc: 'Do your first full dip on bars.' },
  { id: 'pullup', emoji: '🧗', title: 'First pull-up', desc: 'Do your first full pull-up from a dead hang.' },
  { id: 'w25', emoji: '🏅', title: '25 workouts', desc: 'Finish 25 workouts.' },
  { id: 'streak4', emoji: '🔥', title: '4-week streak', desc: 'Train 3+ times a week, 4 weeks in a row.' },
  { id: 'pushup10', emoji: '🚀', title: '10 push-ups', desc: '10 floor push-ups (or harder) in one set.' },
  { id: 'hold60', emoji: '⏱️', title: 'One-minute hold', desc: 'Hold any static position for 60 s in one set.' },
  { id: 'pullup5', emoji: '🦍', title: '5 pull-ups', desc: '5 pull-ups (or harder) in one set.' },
  { id: 'pistol', emoji: '🦵', title: 'First pistol', desc: 'Do your first full pistol squat.' },
];

const MILESTONE_BY_ID = Object.fromEntries(MILESTONES.map((m) => [m.id, m]));

/** Checks that only depend on a single entry's best set. */
const ENTRY_CHECKS: Record<string, (e: EntryLog, b: number) => boolean> = {
  hollow30: (e, b) => isHoldUnit(e.unit) && (/hollow/i.test(e.name) || e.level === 'CC1') && b >= 30,
  pushup: (e, b) => atLeast(e, 'HP2') && b >= 1,
  pushup10: (e, b) => atLeast(e, 'HP2') && b >= 10,
  dip: (e, b) => atLeast(e, 'DP3') && b >= 1,
  pullup: (e, b) => atLeast(e, 'VPu4') && b >= 1,
  pullup5: (e, b) => atLeast(e, 'VPu4') && b >= 5,
  hold60: (e, b) => isHoldUnit(e.unit) && b >= 60,
  pistol: (e, b) => atLeast(e, 'SL6') && b >= 1,
};

/** Local Monday (YYYY-M-D) of the week a date falls in, optionally shifted by whole weeks. */
const mondayKey = (iso: string, shiftWeeks = 0) => {
  const d = new Date(iso);
  d.setHours(12, 0, 0, 0);
  d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + shiftWeeks * 7);
  return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
};

/** Every badge earned so far, with the workout that earned it, oldest first. */
export function milestones(workouts: WorkoutLog[]): EarnedMilestone[] {
  const earned: EarnedMilestone[] = [];
  const has = new Set<string>();
  const give = (id: string, w: WorkoutLog) => {
    if (has.has(id)) return;
    has.add(id);
    earned.push({ ...MILESTONE_BY_ID[id], date: w.date, workoutId: w.id });
  };
  const perWeek = new Map<string, number>();
  let count = 0;
  for (const w of sortAsc(workouts)) {
    count++;
    const wk = mondayKey(w.date);
    perWeek.set(wk, (perWeek.get(wk) ?? 0) + 1);
    if (count >= 1) give('first', w);
    if ((perWeek.get(wk) ?? 0) >= 3) give('week', w);
    if (count >= 10) give('w10', w);
    if (count >= 25) give('w25', w);
    if ([0, -1, -2, -3].every((s) => (perWeek.get(mondayKey(w.date, s)) ?? 0) >= 3)) give('streak4', w);
    for (const e of w.entries) {
      const b = best(e);
      if (b === null) continue;
      for (const [id, check] of Object.entries(ENTRY_CHECKS)) if (!has.has(id) && check(e, b)) give(id, w);
    }
  }
  return earned;
}

/** Badges in `after` that weren't earned in `before` (e.g. right after finishing a workout). */
export function newMilestones(before: WorkoutLog[], after: WorkoutLog[]): EarnedMilestone[] {
  const old = new Set(milestones(before).map((m) => m.id));
  return milestones(after).filter((m) => !old.has(m.id));
}

// ---------- You vs. day one ----------

export type Snapshot = { levelName?: string; value: number; unit: Unit; date: string };
export type FirstVsNow = { key: string; name: string; from: Snapshot; to: Snapshot; improved: boolean; levelUp: boolean };

/**
 * Per ladder (or per exercise without a ladder): the first logged best set vs the latest one.
 * Only included once there are ≥2 workouts with it spanning at least 7 days. Improvements first.
 */
export function firstVsNow(workouts: WorkoutLog[]): FirstVsNow[] {
  type Pt = { date: string; level?: string; value: number; unit: Unit; name: string; ladder?: string };
  const groups = new Map<string, Pt[]>();
  for (const w of sortAsc(workouts)) {
    for (const e of w.entries) {
      const b = best(e);
      if (b === null) continue;
      const key = e.ladder ? `ladder:${e.ladder}:${e.unit}` : `ex:${e.name}:${e.unit}`;
      const list = groups.get(key) ?? [];
      // One point per workout (supersets can log the same ladder twice).
      const last = list[list.length - 1];
      if (last && last.date === w.date) last.value = Math.max(last.value, b);
      else list.push({ date: w.date, level: e.level, value: b, unit: e.unit, name: e.name, ladder: e.ladder });
      groups.set(key, list);
    }
  }
  const out: FirstVsNow[] = [];
  for (const [key, pts] of groups) {
    if (pts.length < 2) continue;
    const a = pts[0];
    const z = pts[pts.length - 1];
    if (new Date(z.date).getTime() - new Date(a.date).getTime() < 7 * DAY) continue;
    const ia = levelIndex(a.ladder, a.level);
    const iz = levelIndex(z.ladder, z.level);
    const levelUp = iz > ia && ia >= 0;
    const sameLevel = a.level === z.level;
    const snap = (p: Pt): Snapshot => ({ levelName: p.level ? LEVEL_SV[p.level] ?? p.level : undefined, value: p.value, unit: p.unit, date: p.date });
    out.push({
      key,
      name: a.ladder ? LADDER_SV[a.ladder] ?? LADDER_BY_ID[a.ladder]?.name ?? a.name : a.name,
      from: snap(a),
      to: snap(z),
      levelUp,
      improved: levelUp || (sameLevel && z.value > a.value),
    });
  }
  return out.sort((x, y) => Number(y.improved) - Number(x.improved) || y.to.date.localeCompare(x.to.date));
}

/** "Push-ups 5 → 9 reps" at the same level, or "Push-ups: Incline push-up → Push-up" after a level-up. */
export function describeChange(item: FirstVsNow): string {
  const { from, to } = item;
  if (from.levelName && to.levelName && from.levelName !== to.levelName) {
    return `${item.name}: ${from.levelName} → ${to.levelName} (${formatValue(to.value, to.unit)})`;
  }
  return `${item.name} ${from.value} → ${formatValue(to.value, to.unit)}`;
}
