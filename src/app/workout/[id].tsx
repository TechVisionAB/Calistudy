import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Explain } from '@/components/Explain';
import { DemoMedia, HowToToggle } from '@/components/HowTo';
import { Button, Card, Chip, H1, H2, Label, P, Row, styles, useTheme } from '@/components/ui';
import { anatomyFor } from '@/data/anatomy';
import { alternativesFor } from '@/data/alternatives';
import { LADDER_BY_ID } from '@/data/ladders';
import { GUIDED_WARMUPS, stepAmount } from '@/data/warmups';
import { SessionId, SESSIONS } from '@/data/sessions';
import { EFFORTS, effortText, LEVEL_SV, SESSION_SV, tempoText } from '@/data/sv';
import { isHoldUnit, planSession, PlannedExercise, range, unitLabel } from '@/lib/plan';
import { Suggestion, suggest } from '@/lib/progression';
import { EntryLog, newId, SetLog, useStore, WorkoutLog } from '@/lib/store';
import { useUnits } from '@/lib/units';
import { spokenDuration, useVoice } from '@/lib/voice';
import { EarnedMilestone, FirstTime, formatDelta, formatValue, newMilestones, PersonalRecord, personalRecords } from '@/lib/wins';

type Step = { ex: number; set: number };

/** Wall-clock time for event handlers (kept out of render for the React compiler). */
const clock = () => Date.now();

const haptic = (kind: 'tap' | 'success' | 'warn') => {
  if (Platform.OS === 'web') return;
  if (kind === 'tap') Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium).catch(() => {});
  else Haptics.notificationAsync(kind === 'success' ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning).catch(() => {});
};

/** Supersets (E1/E2) alternate set by set; everything else runs set after set. */
function buildSteps(plan: PlannedExercise[]): Step[] {
  const steps: Step[] = [];
  let i = 0;
  while (i < plan.length) {
    const letter = plan[i].slot.match(/^([A-Z])\d$/)?.[1];
    let j = i + 1;
    while (letter && j < plan.length && plan[j].slot.startsWith(letter)) j++;
    const group = plan.slice(i, j);
    const rounds = Math.max(...group.map((e) => e.plannedSets));
    for (let s = 0; s < rounds; s++) group.forEach((e, k) => s < e.plannedSets && steps.push({ ex: i + k, set: s }));
    i = j;
  }
  return steps;
}

/** "6 to 12 reps", "15 to 30 seconds" – targets as a coach would say them. */
function spokenTarget(e: { min: number; max: number; unit: string }): string {
  const n = e.min === e.max ? `${e.min}` : `${e.min} to ${e.max}`;
  if (e.unit.startsWith('s')) return `hold ${n} seconds${e.unit === 's/side' ? ' per side' : ''}`;
  return `${n} reps${e.unit === 'reps/side' ? ' per side' : e.unit === 'reps/leg' ? ' per leg' : ''}`;
}

const REST_TIPS = [
  'Breathe slowly – in through the nose, out through the mouth.',
  'Shake out your arms and shoulders.',
  'Sip some water.',
  'Stopping with a couple of reps left is the plan – not a failure.',
  'Good form beats more reps. Every set counts.',
  'Strength is built one set at a time. You’re doing it.',
];

/** Step-by-step warm-up: one movement at a time with its own demo, timer or rep target. */
function GuidedWarmup({ id, title, onDone }: { id: keyof typeof GUIDED_WARMUPS; title: string; onDone: () => void }) {
  const t = useTheme();
  const say = useVoice();
  const w = GUIDED_WARMUPS[id];
  const [i, setI] = useState(0);
  const [end, setEnd] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [showAll, setShowAll] = useState(false);
  const cued = useRef<string>('');
  const step = w.steps[i];
  const left = end === null ? null : Math.max(0, Math.ceil((end - now) / 1000));

  const go = (next: number) => {
    setEnd(null);
    if (next >= w.steps.length) {
      say('Warm-up done. Let’s train.');
      onDone();
      return;
    }
    setI(next);
    const s = w.steps[next];
    say(`Next: ${s.name}. ${s.secs ? spokenDuration(s.secs) : s.reps?.replace('×', '') ?? ''}`);
  };

  // Ticks the countdown; cues "3, 2, 1" and moves on by itself at zero.
  useEffect(() => {
    if (end === null) return;
    const iv = setInterval(() => {
      const t = Date.now();
      setNow(t);
      const l = Math.max(0, Math.ceil((end - t) / 1000));
      const key = `${i}:${l}`;
      if (cued.current === key) return;
      cued.current = key;
      if (l === 3) say('3, 2, 1');
      if (l === 0) {
        clearInterval(iv);
        Vibration.vibrate(200);
        go(i + 1);
      }
    }, 200);
    return () => clearInterval(iv);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [end, i]);

  const start = () => {
    setNow(Date.now());
    setEnd(Date.now() + (step.secs ?? 0) * 1000);
    say(`${step.name}. Go!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.screen}>
      <Stack.Screen options={{ title }} />
      <Label>
        Warm-up · step {i + 1} of {w.steps.length}
      </Label>
      <View style={{ flexDirection: 'row', gap: 4 }}>
        {w.steps.map((_, k) => (
          <View key={k} style={{ flex: 1, height: 4, borderRadius: 2, backgroundColor: k <= i ? t.accent : t.grid }} />
        ))}
      </View>
      <DemoMedia mediaKey={step.demo} />
      <HowToToggle mediaKey={step.demo} label="Video & muscles" />
      <Text style={{ color: t.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>{step.name}</Text>
      <Text style={{ color: t.accent, fontSize: 20, fontWeight: '800' }}>{stepAmount(step)}</Text>
      <P muted>{step.tip}</P>
      {step.secs ? (
        left === null ? (
          <Button title={`▶ Start ${stepAmount(step)}`} onPress={start} style={{ paddingVertical: 16 }} />
        ) : (
          <>
            <Text style={{ color: t.text, fontSize: 72, fontWeight: '800', textAlign: 'center', fontVariant: ['tabular-nums'] }}>
              {Math.floor(left / 60)}:{String(left % 60).padStart(2, '0')}
            </Text>
            <Button title="Next ›" variant="secondary" onPress={() => go(i + 1)} />
          </>
        )
      ) : (
        <Button title="Done ✓" onPress={() => go(i + 1)} style={{ paddingVertical: 16 }} />
      )}
      <Row style={{ justifyContent: 'space-between' }}>
        <Pressable onPress={() => setShowAll((x) => !x)} hitSlop={8}>
          <Text style={{ color: t.muted, fontWeight: '600' }}>{showAll ? 'Hide steps' : `All ${w.steps.length} steps · ${w.minutes} min`}</Text>
        </Pressable>
        <Pressable onPress={onDone} hitSlop={8}>
          <Text style={{ color: t.muted, fontWeight: '600' }}>Already warm – skip ›</Text>
        </Pressable>
      </Row>
      {showAll && (
        <Card>
          {w.steps.map((s, k) => (
            <Pressable key={k} onPress={() => go(k)}>
              <Text style={{ color: k === i ? t.accent : k < i ? t.muted : t.text, fontSize: 15, lineHeight: 26, fontWeight: k === i ? '700' : '400' }}>
                {k < i ? '✓' : `${k + 1}.`} {s.name} · {stepAmount(s)}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}
    </ScrollView>
  );
}

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update, setLevel } = useStore();
  const t = useTheme();
  const u = useUnits();
  const session = SESSIONS[params.id];
  const week = Number(params.week ?? 1);
  const flags = Number(params.flags ?? 0);

  // Levels and equipment are frozen for the duration of the workout.
  const plan = useMemo(
    () => (session ? planSession(session.id, week, flags, state.levels, state.profile?.equipment ?? null).filter((e) => e.plannedSets > 0) : []),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.id, week, flags],
  );
  const steps = useMemo(() => buildSteps(plan), [plan]);
  const say = useVoice();
  // Mid-workout swaps (easier level or an alternative exercise), by plan index.
  const [overrides, setOverrides] = useState<Record<number, Partial<PlannedExercise>>>({});
  const exAt = (i: number): PlannedExercise => ({ ...plan[i], ...overrides[i] });
  const [swapOpen, setSwapOpen] = useState(false);
  const [userSwapped, setUserSwapped] = useState<Record<number, boolean>>({});

  const [entries, setEntries] = useState<EntryLog[]>(() =>
    plan.map((e) => ({
      slot: e.slot,
      name: e.swapped ? e.title : e.name,
      ladder: e.ladder,
      level: e.level,
      unit: e.unit,
      min: e.min,
      max: e.max,
      sets: Array.from({ length: e.plannedSets }, (): SetLog => ({ value: null, rir: null, pain: null })),
    })),
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [phase, setPhase] = useState<'warmup' | 'work' | 'rest'>(session?.warmup ? 'warmup' : 'work');
  const [value, setValue] = useState<number | null>(() => {
    const st = steps[0];
    return st ? (isHoldUnit(plan[st.ex].unit) ? plan[st.ex].min : plan[st.ex].max) : null;
  });
  const [effort, setEffort] = useState<number | null>(null);
  const [painOpen, setPainOpen] = useState(false);
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<{
    log: WorkoutLog;
    mins: number;
    suggestions: Suggestion[];
    records: PersonalRecord[];
    firsts: FirstTime[];
    badges: EarnedMilestone[];
  } | null>(null);
  const [applied, setApplied] = useState<Record<number, boolean>>({});
  const [startedAt] = useState(() => Date.now());

  // Timers: rest countdown and hold stopwatch share one ticking clock.
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [holdStart, setHoldStart] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const buzzed = useRef(false);
  useEffect(() => {
    if (restEnd === null && holdStart === null) return;
    const iv = setInterval(() => setNow(Date.now()), 200);
    return () => clearInterval(iv);
  }, [restEnd, holdStart]);
  const remaining = restEnd === null ? 0 : Math.max(0, Math.ceil((restEnd - now) / 1000));
  const lastCue = useRef('');
  useEffect(() => {
    if (phase !== 'rest' || restEnd === null) return;
    const key = `${stepIdx}:${remaining}`;
    if (lastCue.current === key) return;
    lastCue.current = key;
    if (remaining === 10) say('10 seconds');
    if (remaining === 3) say('3, 2, 1');
    if (remaining === 0 && !buzzed.current) {
      buzzed.current = true;
      Vibration.vibrate([0, 300, 150, 300]);
      const e = steps[stepIdx] ? exAt(steps[stepIdx].ex) : undefined;
      if (e) say(`Go! ${e.title}, ${spokenTarget(e)}.`);
      setPhase('work');
      setRestEnd(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [remaining, phase, restEnd]);

  // Hold timer: call out when the target is reached.
  const holdNow = holdStart !== null ? Math.floor((now - holdStart) / 1000) : null;
  const holdCue = useRef('');
  useEffect(() => {
    if (holdNow === null || !steps[stepIdx]) return;
    const e = exAt(steps[stepIdx].ex);
    const key = `${stepIdx}:${holdNow}`;
    if (holdCue.current === key) return;
    holdCue.current = key;
    if (holdNow === e.min && e.min !== e.max) say(`${e.min} seconds. That’s the target – keep going if you can.`);
    else if (holdNow === e.max) say(`${e.max} seconds. Great – stop.`);
    else if (holdNow > 0 && holdNow % 10 === 0 && holdNow < e.max) say(`${holdNow}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holdNow]);

  const step = steps[stepIdx];
  const cur = step ? exAt(step.ex) : undefined;

  // Pre-fill the counter with last time's value for this set, else the target.
  const initialValue = (idx: number): number | null => {
    const st = steps[idx];
    if (!st) return null;
    const ex = exAt(st.ex);
    const prev = state.workouts
      .find((w) => w.session === params.id && w.entries.some((e) => e.slot === ex.slot && e.level === ex.level))
      ?.entries.find((e) => e.slot === ex.slot)?.sets[st.set]?.value;
    return prev ?? (isHoldUnit(ex.unit) ? ex.min : ex.max);
  };

  /** Move to another step and reset the per-set inputs. */
  const goTo = (idx: number) => {
    setStepIdx(idx);
    setValue(initialValue(idx));
    setEffort(null);
    setHoldStart(null);
    setPainOpen(false);
  };

  if (!session) return null;

  /** Returns the updated entries so a finishing step can save them without waiting for a re-render. */
  const record = (patch: Partial<SetLog>): EntryLog[] => {
    if (!step) return entries;
    const next = entries.map((e, i) => (i !== step.ex ? e : { ...e, sets: e.sets.map((s, j) => (j === step.set ? { ...s, ...patch } : s)) }));
    setEntries(next);
    return next;
  };

  const advance = (rest: boolean, latest: EntryLog[]) => {
    if (stepIdx >= steps.length - 1) {
      finish(latest);
      return;
    }
    goTo(stepIdx + 1);
    if (rest && cur) {
      buzzed.current = false;
      setRestEnd(clock() + cur.restSec * 1000);
      setPhase('rest');
      const ns = steps[stepIdx + 1];
      const ne = exAt(ns.ex);
      const newExercise = ns.ex !== step!.ex;
      const lastSet = ns.set === ne.plannedSets - 1;
      say(
        `Nice work. Rest ${spokenDuration(cur.restSec)}. ` +
          (newExercise ? `Next exercise: ${ne.title}.` : lastSet ? `Then the last set of ${ne.title}.` : `Then set ${ns.set + 1} of ${ne.plannedSets}.`),
      );
    }
  };

  const done = () => {
    let v = value;
    if (holdStart !== null) v = Math.round((clock() - holdStart) / 1000);
    const latest = record({ value: v, rir: effort });
    haptic('tap');
    advance(true, latest);
  };

  const setPain = (p: number) => {
    if (!step) return;
    // Pain applies to the whole exercise (it's a pattern-level rule in the guide).
    setEntries((es) => es.map((e, i) => (i !== step.ex ? e : { ...e, sets: e.sets.map((s) => ({ ...s, pain: p })) })));
    if (p >= 3) haptic('warn');
    setPainOpen(false);
  };

  /** Jump to the next step of another exercise (supersets interleave, so only this one is dropped). */
  const skipExercise = () => {
    if (!step) return;
    const nextIdx = steps.findIndex((s, k) => k > stepIdx && s.ex !== step.ex);
    if (nextIdx === -1) finish(entries);
    else goTo(nextIdx);
  };

  function finish(latest: EntryLog[]) {
    const log: WorkoutLog = {
      id: newId(),
      date: new Date().toISOString(),
      week,
      session: session.id,
      deload: !session.id.startsWith('starter') && (week === 6 || week === 12),
      flags,
      entries: latest.filter((e) => e.sets.some((s) => s.value !== null)),
      notes: notes.trim() || undefined,
    };
    const suggestions = suggest(log, state.workouts);
    const { records, firsts } = personalRecords(log, state.workouts);
    const badges = newMilestones(state.workouts, [log, ...state.workouts]);
    update((s) => ({ ...s, workouts: [log, ...s.workouts] }));
    setRestEnd(null);
    setHoldStart(null);
    haptic('success');
    say(records.length ? 'Workout complete – and a new personal record! Great job.' : 'Workout complete. Great job!');
    // A second, lighter buzz when there's something extra to celebrate.
    if (records.length || badges.length) setTimeout(() => haptic('tap'), 450);
    setResult({ log, mins: Math.max(1, Math.round((clock() - startedAt) / 60000)), suggestions, records, firsts, badges });
  }

  // ---------- Summary ----------
  if (result) {
    const sets = result.log.entries.reduce((n, e) => n + e.sets.filter((s) => s.value !== null).length, 0);
    const mins = result.mins;
    const ups = result.suggestions.filter((s) => s.kind === 'up' || s.kind === 'test');
    const { records, badges } = result;
    const newLevels = result.firsts.filter((f) => f.newLevel);
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Done!', headerBackVisible: false, gestureEnabled: false, headerRight: () => null }} />
        <ScrollView contentContainerStyle={styles.screen}>
          <Text style={{ fontSize: 64, textAlign: 'center' }}>{ups.length || badges.length ? '🎉' : records.length ? '🏆' : '💪'}</Text>
          <H1>{ups.length ? 'Time for the next level!' : records.length ? 'New personal best!' : 'Great job!'}</H1>
          <P muted>
            {SESSION_SV[session.id].title} · {sets} {sets === 1 ? 'set' : 'sets'} · {mins} min
          </P>
          {badges.map((m) => (
            <Card key={m.id} style={{ borderColor: t.accent, borderWidth: 2, backgroundColor: t.accentSoft }}>
              <Row style={{ flexWrap: 'nowrap', gap: 12 }}>
                <Text style={{ fontSize: 40 }}>{m.emoji}</Text>
                <View style={{ flex: 1, gap: 2 }}>
                  <Label>Badge unlocked</Label>
                  <Text style={{ color: t.text, fontSize: 17, fontWeight: '800' }}>{m.title}</Text>
                  <Text style={{ color: t.muted, fontSize: 14 }}>{m.desc}</Text>
                </View>
              </Row>
            </Card>
          ))}
          {(records.length > 0 || newLevels.length > 0) && (
            <Card style={{ borderColor: t.good, borderWidth: 1 }}>
              <Label>🏆 New records</Label>
              {records.map((r, i) => (
                <Row key={`r${i}`} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                  <Text style={{ color: t.text, fontSize: 15, flex: 1 }} numberOfLines={2}>
                    {u(r.name)}: <Text style={{ fontWeight: '700' }}>{formatValue(r.value, r.unit)}</Text>
                  </Text>
                  <Chip text={formatDelta(r.delta, r.unit)} tone="good" />
                </Row>
              ))}
              {newLevels.map((f, i) => (
                <Row key={`f${i}`} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                  <Text style={{ color: t.text, fontSize: 15, flex: 1 }} numberOfLines={2}>
                    {u(f.name)}: <Text style={{ fontWeight: '700' }}>{formatValue(f.value, f.unit)}</Text>
                  </Text>
                  <Chip text="First time!" tone="accent" />
                </Row>
              ))}
            </Card>
          )}
          {result.suggestions.length === 0 && (
            <Card>
              <P>Same levels next time – try to get 1 more rep on at least one set.</P>
            </Card>
          )}
          {result.suggestions.map((s, i) => {
            const good = s.kind === 'up' || s.kind === 'test';
            return (
              <Card key={i} style={good ? { borderColor: t.good, borderWidth: 2 } : undefined}>
                <Row>
                  <Chip text={s.kind === 'up' ? 'New level' : s.kind === 'down' ? 'Easier variation' : s.kind === 'test' ? 'Try the next one' : 'Take it easy'} tone={good ? 'good' : 'warn'} />
                </Row>
                <Text style={{ color: t.text, fontSize: 17, fontWeight: '700' }}>
                  {u(LEVEL_SV[s.from] ?? s.from)}
                  {s.to ? ` → ${u(LEVEL_SV[s.to] ?? s.to)}` : ''}
                </Text>
                <P muted>{s.reason}</P>
                {s.to && (
                  <Button
                    title={applied[i] ? (good ? 'New level set 🎉' : 'Changed ✓') : good ? 'Yes, level up!' : 'Switch to easier'}
                    variant={applied[i] ? 'secondary' : 'primary'}
                    disabled={applied[i]}
                    onPress={() => {
                      setLevel(s.ladder, s.to!);
                      setApplied((a) => ({ ...a, [i]: true }));
                      if (good) haptic('success');
                    }}
                  />
                )}
              </Card>
            );
          })}
          <Card>
            <Label>Note (optional)</Label>
            <TextInput
              value={notes}
              onChangeText={(x) => {
                setNotes(x);
                update((st) => ({ ...st, workouts: st.workouts.map((w) => (w.id === result.log.id ? { ...w, notes: x.trim() || undefined } : w)) }));
              }}
              placeholder="How did it feel?"
              placeholderTextColor={t.muted}
              multiline
              style={{ color: t.text, minHeight: 44, fontSize: 15 }}
            />
          </Card>
          <Button title="Done" onPress={() => router.dismissTo('/')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!cur || !step) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, padding: 16 }}>
        <P>No exercises in this workout.</P>
      </SafeAreaView>
    );
  }

  const progressPct = (stepIdx / steps.length) * 100;
  const partnerIdx = plan.findIndex((p, i) => i !== step.ex && p.slot[0] === cur.slot[0] && /\d$/.test(p.slot) && /\d$/.test(cur.slot));
  const partner = partnerIdx === -1 ? undefined : exAt(partnerIdx);
  const exNo = new Set(steps.slice(0, stepIdx + 1).map((s) => s.ex)).size;
  const hold = isHoldUnit(cur.unit);
  const pain = entries[step.ex].sets[0]?.pain ?? 0;
  const holdSecs = holdNow;
  const nextStep = steps[stepIdx];

  // Swap options: one level easier on the ladder, plus ways to do it with no equipment.
  const ladderLevels = cur.ladder && cur.level ? LADDER_BY_ID[cur.ladder]?.levels.map((l) => l.code) ?? [] : [];
  const easier = cur.level ? ladderLevels[ladderLevels.indexOf(cur.level) - 1] : undefined;
  const alts = alternativesFor(cur.ladder ?? plan[step.ex].ladder, plan[step.ex].demo ?? plan[step.ex].mediaKey).filter((a) => a.name !== cur.title);
  const applySwap = (patch: Partial<PlannedExercise>, entry: Partial<EntryLog>, spoken: string) => {
    setOverrides((o) => ({ ...o, [step.ex]: { ...o[step.ex], ...patch } }));
    setEntries((es) => es.map((e, i) => (i === step.ex ? { ...e, ...entry } : e)));
    setSwapOpen(false);
    setUserSwapped((x) => ({ ...x, [step.ex]: true }));
    haptic('tap');
    say(spoken);
  };
  const swapEasier = () =>
    easier &&
    applySwap(
      { level: easier, title: LEVEL_SV[easier] ?? easier, mediaKey: easier, levelName: LADDER_BY_ID[cur.ladder!]?.levels.find((l) => l.code === easier)?.name },
      { level: easier },
      `Switched to ${LEVEL_SV[easier] ?? 'an easier version'}. Good call.`,
    );
  const swapAlt = (a: { name: string; cue: string; demo?: string }) =>
    applySwap(
      { title: a.name, name: a.name, cueSv: a.cue, cue: a.cue, mediaKey: a.demo, ladder: undefined, level: undefined, swapped: false },
      { name: a.name, ladder: undefined, level: undefined },
      `Switched to ${a.name}.`,
    );

  // ---------- Warm-up ----------
  if (phase === 'warmup' && session.warmup) {
    const toWork = () => {
      setPhase('work');
      say(`First exercise: ${cur.title}. ${spokenTarget(cur)}.`);
    };
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <GuidedWarmup id={session.warmup} title={SESSION_SV[session.id].title} onDone={toWork} />
      </SafeAreaView>
    );
  }

  // ---------- Rest ----------
  if (phase === 'rest') {
    const upcoming = exAt(nextStep.ex);
    const prevStep = steps[stepIdx - 1];
    const newExercise = !prevStep || prevStep.ex !== nextStep.ex;
    const lastSet = nextStep.set === upcoming.plannedSets - 1;
    const lastValue = !newExercise && prevStep ? entries[prevStep.ex].sets[prevStep.set]?.value : null;
    const pct = Math.round((stepIdx / steps.length) * 100);
    const halfway = stepIdx === Math.ceil(steps.length / 2);
    const minsLeft = Math.max(1, Math.round(((steps.length - stepIdx) * (45 + upcoming.restSec)) / 60));
    const goNow = () => {
      setRestEnd(null);
      setPhase('work');
      say(`Go! ${upcoming.title}, ${spokenTarget(upcoming)}.`);
    };
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: SESSION_SV[session.id].title }} />
        <View style={{ height: 4, backgroundColor: t.grid }}>
          <View style={{ height: 4, width: `${progressPct}%`, backgroundColor: t.accent }} />
        </View>
        <ScrollView contentContainerStyle={[styles.screen, { alignItems: 'stretch', gap: 14 }]}>
          <Text style={{ color: t.muted, fontSize: 14, fontWeight: '700', textAlign: 'center' }}>
            {halfway ? 'Halfway there! 🎉' : `${pct}% done`} · about {minsLeft} min left
          </Text>
          <Text style={{ color: t.text, fontSize: 88, fontWeight: '800', textAlign: 'center', fontVariant: ['tabular-nums'] }}>
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
          </Text>
          <Row style={{ justifyContent: 'center' }}>
            <Button title="+15 s" variant="secondary" onPress={() => setRestEnd((x) => Math.max(x ?? 0, Date.now()) + 15000)} />
            <Button title="I’m ready – go" onPress={goNow} />
          </Row>

          <Card>
            <Label>{newExercise ? 'Next exercise' : lastSet ? 'Last set – finish strong 💪' : `Next: set ${nextStep.set + 1} of ${upcoming.plannedSets}`}</Label>
            <Text style={{ color: t.text, fontSize: 20, fontWeight: '800' }}>
              {u(upcoming.title)} <Text style={{ color: t.muted, fontWeight: '500', fontSize: 16 }}>· {range(upcoming)}</Text>
            </Text>
            {lastValue != null && (
              <P muted>
                Last set: {lastValue} {unitLabel(upcoming.unit)}. Matching it is a win – one more is a bonus.
              </P>
            )}
            {newExercise && (
              <>
                <DemoMedia mediaKey={upcoming.mediaKey} />
                <P muted>Have a look now so you know what’s coming. Too hard or missing equipment? You can swap it on the next screen.</P>
              </>
            )}
          </Card>
          <Text style={{ color: t.muted, fontSize: 15, textAlign: 'center', lineHeight: 21 }}>{REST_TIPS[stepIdx % REST_TIPS.length]}</Text>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- Work ----------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: SESSION_SV[session.id].title, headerRight: () => (
        <Pressable onPress={() => (entries.some((e) => e.sets.some((s) => s.value !== null)) ? finish(entries) : router.back())} hitSlop={10}>
          <Text style={{ color: t.accent, fontWeight: '700' }}>Finish</Text>
        </Pressable>
      ) }} />
      <View style={{ height: 4, backgroundColor: t.grid }}>
        <View style={{ height: 4, width: `${progressPct}%`, backgroundColor: t.accent }} />
      </View>
      <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 24 }]}>
        <Label>
          Exercise {exNo} of {plan.length} · Set {step.set + 1} of {cur.plannedSets}
        </Label>
        <Text style={{ color: t.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>{u(cur.title)}</Text>
        <Row>
          {userSwapped[step.ex] ? <Chip text="Your swap ✓" tone="good" /> : cur.swapped && <Chip text="Swapped – missing equipment" tone="accent" />}
          {partner && <Chip text={`Alternate with: ${u(partner.title)}`} />}
        </Row>

        <DemoMedia mediaKey={cur.mediaKey} />
        <HowToToggle mediaKey={cur.mediaKey} label="More: muscles & video" />

        <Card>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <Text style={{ color: t.text, fontSize: 22, fontWeight: '800' }}>
              {hold ? 'Hold ' : ''}
              {range(cur)}
            </Text>
            <Explain
              text={u(`${cur.name}${cur.level ? ` (${cur.level})` : ''}. RIR ${cur.plannedRir}, tempo ${cur.tempo}, rest ${cur.rest}. ${cur.cue}`)}
              context={`In the middle of the workout ${SESSION_SV[session.id].title}: exercise ${u(cur.title)}, set ${step.set + 1} of ${cur.plannedSets}, target ${range(cur)}`}
            />
          </Row>
          <Text style={{ color: t.muted, fontSize: 15 }}>
            {effortText(cur.plannedRir)}
            {tempoText(cur.tempo) && !hold ? ` · ${tempoText(cur.tempo)}` : ''}
          </Text>
          <Text style={{ color: t.text, fontSize: 15, fontStyle: 'italic' }}>“{u(cur.cueSv)}”</Text>
          {anatomyFor(cur.mediaKey) && (
            <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>
              💪 {u(anatomyFor(cur.mediaKey)!.feel)}
              {'\n'}⛔ {u(anatomyFor(cur.mediaKey)!.notFeel)}
            </Text>
          )}
        </Card>

        {/* Counter */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          {hold && (
            <Button
              title={holdSecs !== null ? `Stop · ${holdSecs} s` : '▶ Start timer'}
              variant={holdSecs !== null ? 'primary' : 'secondary'}
              onPress={() => {
                if (holdStart === null) {
                  setHoldStart(Date.now());
                  say('Go');
                } else {
                  setValue(Math.round((Date.now() - holdStart) / 1000));
                  setHoldStart(null);
                }
              }}
              style={{ alignSelf: 'stretch' }}
            />
          )}
          <Row style={{ justifyContent: 'center', gap: 20 }}>
            <Pressable onPress={() => setValue((v) => Math.max(0, (v ?? 0) - 1))} style={bigBtn(t.chip)} hitSlop={6}>
              <Text style={{ color: t.accent, fontSize: 30, fontWeight: '800' }}>−</Text>
            </Pressable>
            <View style={{ alignItems: 'center', minWidth: 90 }}>
              <Text style={{ color: t.text, fontSize: 56, fontWeight: '800', fontVariant: ['tabular-nums'] }}>{holdSecs ?? value ?? 0}</Text>
              <Text style={{ color: t.muted, fontSize: 14 }}>{unitLabel(cur.unit)}</Text>
            </View>
            <Pressable onPress={() => setValue((v) => (v ?? 0) + 1)} style={bigBtn(t.chip)} hitSlop={6}>
              <Text style={{ color: t.accent, fontSize: 30, fontWeight: '800' }}>+</Text>
            </Pressable>
          </Row>
        </View>

        {!hold && cur.role !== 'plyo' && (
          <View style={{ gap: 6 }}>
            <Text style={{ color: t.muted, fontSize: 13, textAlign: 'center' }}>How hard was it?</Text>
            <Row style={{ justifyContent: 'center' }}>
              {EFFORTS.map((e) => (
                <Chip key={e.label} text={`  ${e.label}  `} tone={effort === e.rir ? 'accent' : 'neutral'} onPress={() => setEffort(e.rir)} />
              ))}
            </Row>
          </View>
        )}

        <Button title="Done ✓" onPress={done} style={{ paddingVertical: 16 }} />

        <Pressable onPress={() => setSwapOpen((x) => !x)} hitSlop={8}>
          <Text style={{ color: t.accent, fontWeight: '700', textAlign: 'center' }}>⇄ Too hard or missing equipment? Swap it</Text>
        </Pressable>
        {swapOpen && (
          <Card>
            <H2>Pick another way</H2>
            <P muted>There’s always an option. Swapping is smart training, not giving up.</P>
            {easier && (
              <Pressable onPress={swapEasier} style={{ paddingVertical: 8, gap: 2 }}>
                <Text style={{ color: t.text, fontSize: 16, fontWeight: '700' }}>⬇ Easier: {u(LEVEL_SV[easier] ?? easier)}</Text>
                <Text style={{ color: t.muted, fontSize: 14 }}>Same movement, one step easier. Your level updates automatically later.</Text>
              </Pressable>
            )}
            {alts.map((a) => (
              <Pressable key={a.name} onPress={() => swapAlt(a)} style={{ paddingVertical: 8, gap: 2 }}>
                <Text style={{ color: t.text, fontSize: 16, fontWeight: '700' }}>⇄ {u(a.name)}</Text>
                <Text style={{ color: t.muted, fontSize: 14 }}>
                  {u(a.cue)}
                  {a.needs ? ` · Needs: ${a.needs.toLowerCase()}` : ' · No equipment'}
                </Text>
              </Pressable>
            ))}
          </Card>
        )}

        <Row style={{ justifyContent: 'space-between' }}>
          <Pressable onPress={() => setPainOpen((x) => !x)} hitSlop={8}>
            <Text style={{ color: pain >= 3 ? t.warn : t.muted, fontWeight: '600' }}>{pain > 0 ? `Pain ${pain}/10` : 'Does it hurt?'}</Text>
          </Pressable>
          <Pressable onPress={skipExercise} hitSlop={8}>
            <Text style={{ color: t.muted, fontWeight: '600' }}>Skip exercise ›</Text>
          </Pressable>
        </Row>

        {painOpen && (
          <Card>
            <H2>How much joint or tendon pain?</H2>
            <P muted>Muscle soreness and fatigue don’t count.</P>
            <Row>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Chip key={n} text={` ${n} `} tone={n >= 3 ? 'warn' : 'neutral'} onPress={() => setPain(n)} />
              ))}
            </Row>
          </Card>
        )}
        {pain >= 3 && (
          <Card style={{ borderColor: t.warn, borderWidth: 1 }}>
            <P style={{ color: t.warn, fontWeight: '700' }}>{pain > 5 ? 'Stop this exercise now.' : 'Take it carefully.'}</P>
            <P>
              {pain > 5
                ? "Don't train through sharp or strong pain. Skip the exercise and see a physiotherapist if it doesn't go away."
                : 'Next time you will do an easier variation with less volume. Feel free to skip the rest of this exercise.'}
            </P>
            <Button title="Skip exercise" variant="secondary" onPress={skipExercise} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const bigBtn = (bg: string) => ({ width: 64, height: 64, borderRadius: 32, backgroundColor: bg, alignItems: 'center' as const, justifyContent: 'center' as const });
