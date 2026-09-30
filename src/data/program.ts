// 12-week program structure — Sections 10.2, 10.3, 10.5 and 10.7 of docs/guide.md.
import { Exercise, SessionId } from './sessions';

export type WeekParams = {
  week: number;
  strengthRir: string;
  hypertrophyRir: string;
  holds: string;
  sets: string;
  notes: string;
};

export const WEEK_PARAMS: WeekParams[] = [
  { week: 0, strengthRir: '—', hypertrophyRir: '—', holds: '—', sets: 'Testing', notes: 'Mon/Tue/Thu tests; micro-practice other days' },
  { week: 1, strengthRir: '3', hypertrophyRir: '2', holds: '60% max', sets: 'As listed −1 set on main lifts', notes: 'Technique, tempo learning' },
  { week: 2, strengthRir: '2', hypertrophyRir: '1–2', holds: '70% max', sets: 'As listed', notes: '' },
  { week: 3, strengthRir: '2', hypertrophyRir: '1', holds: '70–80%', sets: 'As listed; +1 set on F/G accessories', notes: '' },
  { week: 4, strengthRir: '1–2', hypertrophyRir: '1', holds: '80%', sets: 'As listed +1 accessory set', notes: 'Conditioning: intervals allowed Sat' },
  { week: 5, strengthRir: '1', hypertrophyRir: '0–1 (last set only, safe exercises)', holds: '80%', sets: 'As listed +1 accessory set', notes: 'Peak week of Block 1' },
  { week: 6, strengthRir: '4 (deload)', hypertrophyRir: '3–4', holds: '50–60% max', sets: '~50% of sets (round down, min 1)', notes: 'No plyo; Sat mini-retest' },
  { week: 7, strengthRir: '2', hypertrophyRir: '1–2', holds: '70%', sets: 'Block 2 layout', notes: 'Apply retest levels' },
  { week: 8, strengthRir: '2', hypertrophyRir: '1', holds: '75%', sets: 'Block 2', notes: '' },
  { week: 9, strengthRir: '1–2', hypertrophyRir: '1', holds: '80%', sets: 'Block 2 +1 accessory set', notes: '' },
  { week: 10, strengthRir: '1–2', hypertrophyRir: '0–1', holds: '80%', sets: 'Block 2 +1 accessory set', notes: '' },
  { week: 11, strengthRir: '1', hypertrophyRir: '0–1', holds: '80–85%', sets: 'Block 2 +1 accessory set', notes: 'Peak' },
  { week: 12, strengthRir: '4 (deload)', hypertrophyRir: '3–4', holds: '50–60%', sets: '~50%', notes: 'Thu–Sat full re-test' },
];

export const WEEKDAYS = ['Mån', 'Tis', 'Ons', 'Tor', 'Fre', 'Lör', 'Sön'];

export type TestBattery = 'A' | 'B' | 'C' | 'mini';

export type DayPlan =
  | { kind: 'session'; session: SessionId; deload: boolean }
  | { kind: 'test'; battery: TestBattery; extra?: string }
  | { kind: 'micro'; label: string; extra?: string };

const WEEKLY: SessionId[] = ['upperA', 'lowerA', 'recovery', 'upperB', 'lowerB', 'skill', 'rest'];

/** weekday: 0 = Monday … 6 = Sunday */
export function dayPlan(week: number, weekday: number): DayPlan {
  if (week === 0) {
    const w0: DayPlan[] = [
      { kind: 'test', battery: 'A' },
      { kind: 'test', battery: 'B' },
      { kind: 'micro', label: 'Mikroträning + promenad', extra: '30 min easy walk' },
      { kind: 'test', battery: 'C' },
      { kind: 'micro', label: 'Mikroträning' },
      { kind: 'micro', label: 'Mikroträning + lätt Zon 2', extra: 'Easy Zone 2' },
      { kind: 'session', session: 'rest', deload: false },
    ];
    return w0[weekday];
  }
  if (week === 6 && weekday === 5) return { kind: 'test', battery: 'mini', extra: '+ Zone 2' };
  if (week === 12 && weekday >= 3 && weekday <= 5) {
    return { kind: 'test', battery: (['A', 'B', 'C'] as const)[weekday - 3] };
  }
  const deload = week === 6 || week === 12;
  return { kind: 'session', session: WEEKLY[weekday], deload };
}

export function blockOf(week: number): string {
  if (week === 0) return 'Test';
  if (week <= 5) return 'Block 1';
  if (week === 6) return 'Deload + minitest';
  if (week <= 11) return 'Block 2';
  return 'Deload + fullt omtest';
}

/** Sets for an exercise in a given week (Section 10.2 / 10.5). 0 = skip. */
export function setsForWeek(e: Exercise, week: number): number {
  if (week === 6 || week === 12) {
    if (e.role === 'plyo') return 0;
    return Math.max(1, Math.floor(e.sets / 2));
  }
  if (week === 1 && e.role === 'main') return Math.max(1, e.sets - 1);
  if ([3, 4, 5, 9, 10, 11].includes(week) && e.role === 'accessory') return e.sets + 1;
  return e.sets;
}

export function rirForWeek(e: Exercise, week: number): string {
  const p = WEEK_PARAMS[week];
  if (!p || week === 0) return e.rir;
  if (e.role === 'main') return p.strengthRir;
  if (e.role === 'accessory' && !e.unit.startsWith('s')) return p.hypertrophyRir;
  if (e.role === 'skill' || e.unit.startsWith('s')) return `${e.rir} · holds ${p.holds}`;
  return e.rir;
}

/** Program week for a date, given the Monday that started Week 0. Cycles back to week 1 after week 12. */
export function programWeek(startMonday: string, now = new Date()): number {
  const start = new Date(startMonday + 'T00:00:00');
  const days = Math.floor((startOfDay(now).getTime() - start.getTime()) / 86400000);
  if (days < 0) return 0;
  const w = Math.floor(days / 7);
  return w <= 12 ? w : ((w - 13) % 12) + 1;
}

export function weekdayIndex(d = new Date()): number {
  return (d.getDay() + 6) % 7;
}

export function startOfDay(d: Date): Date {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

export function isoDate(d: Date): string {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

export function mondayOf(d = new Date()): string {
  const s = startOfDay(d);
  s.setDate(s.getDate() - weekdayIndex(s));
  return isoDate(s);
}

export function shiftDate(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return isoDate(d);
}
