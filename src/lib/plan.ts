import { LADDER_BY_ID } from '@/data/ladders';
import { rirForWeek, setsForWeek } from '@/data/program';
import { Exercise, SessionId, SESSIONS, Unit } from '@/data/sessions';
import { Equip, EX_NEEDS, EX_SV, exKey, LEVEL_SV } from '@/data/sv';

export type PlannedExercise = Exercise & {
  plannedSets: number;
  plannedRir: string;
  level?: string;
  levelName?: string;
  /** Display name (level name for ladder exercises) and cue. */
  title: string;
  cueSv: string;
  /** True when the exercise was replaced because equipment is missing. */
  swapped: boolean;
  /** Key for HowTo demo media: the athlete's level, or the exercise's own demo key. */
  mediaKey?: string;
};

/**
 * Resolve a session for a given week, readiness flags, the athlete's levels and
 * equipment (null = unknown, no substitutions).
 */
export function planSession(
  id: SessionId,
  week: number,
  flags: number,
  levels: Record<string, string>,
  equipment: Equip[] | null = null,
): PlannedExercise[] {
  // Starter sessions: `week` is the starter week. No block periodisation; exercises
  // with unlockWeek appear once that week is reached.
  const starter = id.startsWith('starter');
  const list = SESSIONS[id].exercises.filter((e) => !starter || !e.unlockWeek || week >= e.unlockWeek);
  return list.map((e) => {
    let sets = starter ? e.sets : setsForWeek(e, week);
    let rir = starter ? e.rir : rirForWeek(e, week);
    // Readiness: 2 flags → −1 set per exercise, RIR +1 (Section 14).
    if (flags === 2 && sets > 1) {
      sets -= 1;
      const n = parseInt(rir, 10);
      rir = Number.isNaN(n) ? rir : String(n + 1);
    }
    const key = exKey(id, e.slot);
    const need = EX_NEEDS[key];
    const sv = EX_SV[key];
    if (equipment && need && !need.any.some((x) => equipment.includes(x))) {
      return {
        ...e,
        ladder: undefined,
        name: need.alt.name,
        cue: need.alt.cue,
        plannedSets: sets,
        plannedRir: rir,
        title: need.alt.name,
        cueSv: need.alt.cue,
        swapped: true,
        mediaKey: need.alt.demo,
      };
    }
    const level = e.ladder ? levels[e.ladder] : undefined;
    const levelName = e.ladder ? LADDER_BY_ID[e.ladder]?.levels.find((l) => l.code === level)?.name : undefined;
    return {
      ...e,
      plannedSets: sets,
      plannedRir: rir,
      level,
      levelName,
      title: (level && LEVEL_SV[level]) || sv?.name || e.name,
      cueSv: sv?.cue ?? e.cue,
      swapped: false,
      mediaKey: level ?? e.demo,
    };
  });
}

export function unitLabel(u: Unit): string {
  switch (u) {
    case 'reps':
      return 'reps';
    case 'reps/side':
      return 'reps/side';
    case 'reps/leg':
      return 'reps/leg';
    case 's':
      return 's';
    case 's/side':
      return 's/side';
    case 'attempts':
      return 'attempts';
  }
}

/** "RIR 2" for numeric targets; RPE / hold-reserve targets are shown as written. */
export const rirLabel = (rir: string) => (/^\d/.test(rir) ? `RIR ${rir}` : rir);

export const isHoldUnit = (u: Unit) => u === 's' || u === 's/side';

export function range(e: { min: number; max: number; unit: Unit }): string {
  return `${e.min === e.max ? e.min : `${e.min}–${e.max}`} ${unitLabel(e.unit)}`;
}
