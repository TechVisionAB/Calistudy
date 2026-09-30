import { LADDER_BY_ID } from '@/data/ladders';
import { rirForWeek, setsForWeek } from '@/data/program';
import { Exercise, SessionId, SESSIONS, Unit } from '@/data/sessions';

export type PlannedExercise = Exercise & {
  plannedSets: number;
  plannedRir: string;
  level?: string;
  levelName?: string;
};

/** Resolve a session for a given week, readiness flags and the athlete's levels. */
export function planSession(id: SessionId, week: number, flags: number, levels: Record<string, string>): PlannedExercise[] {
  return SESSIONS[id].exercises.map((e) => {
    let sets = setsForWeek(e, week);
    let rir = rirForWeek(e, week);
    // Readiness: 2 flags → −1 set per exercise, RIR +1 (Section 14).
    if (flags === 2 && sets > 1) {
      sets -= 1;
      rir = `${rir} (+1)`;
    }
    const level = e.ladder ? levels[e.ladder] : undefined;
    const levelName = e.ladder ? LADDER_BY_ID[e.ladder]?.levels.find((l) => l.code === level)?.name : undefined;
    return { ...e, plannedSets: sets, plannedRir: rir, level, levelName };
  });
}

export function unitLabel(u: Unit): string {
  switch (u) {
    case 'reps':
      return 'reps';
    case 'reps/side':
      return 'reps/sida';
    case 'reps/leg':
      return 'reps/ben';
    case 's':
      return 's';
    case 's/side':
      return 's/sida';
    case 'attempts':
      return 'försök';
  }
}

/** "RIR 2" for numeric targets; RPE / hold-reserve targets are shown as written. */
export const rirLabel = (rir: string) => (/^\d/.test(rir) ? `RIR ${rir}` : rir);

export const isHoldUnit = (u: Unit) => u === 's' || u === 's/side';

export function range(e: { min: number; max: number; unit: Unit }): string {
  return `${e.min === e.max ? e.min : `${e.min}–${e.max}`} ${unitLabel(e.unit)}`;
}
