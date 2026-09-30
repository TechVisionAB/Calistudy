import * as Haptics from 'expo-haptics';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Platform, Pressable, ScrollView, Text, TextInput, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Figure } from '@/components/Figure';
import { Explain } from '@/components/Explain';
import { HowToToggle } from '@/components/HowTo';
import { Button, Card, Chip, H1, H2, Label, P, Row, styles, useTheme } from '@/components/ui';
import { anatomyFor } from '@/data/anatomy';
import { mediaFor } from '@/data/media';
import { SessionId, SESSIONS } from '@/data/sessions';
import { EFFORTS, effortText, LEVEL_SV, SESSION_SV, tempoText, WARMUP_SV } from '@/data/sv';
import { isHoldUnit, planSession, PlannedExercise, range, unitLabel } from '@/lib/plan';
import { Suggestion, suggest } from '@/lib/progression';
import { EntryLog, newId, SetLog, useStore, WorkoutLog } from '@/lib/store';

type Step = { ex: number; set: number };

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

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update, setLevel } = useStore();
  const t = useTheme();
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
  const [result, setResult] = useState<{ log: WorkoutLog; suggestions: Suggestion[] } | null>(null);
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
  useEffect(() => {
    if (phase === 'rest' && restEnd !== null && remaining === 0 && !buzzed.current) {
      buzzed.current = true;
      Vibration.vibrate([0, 300, 150, 300]);
      setPhase('work');
      setRestEnd(null);
    }
  }, [remaining, phase, restEnd]);

  const step = steps[stepIdx];
  const cur = step ? plan[step.ex] : undefined;

  // Pre-fill the counter with last time's value for this set, else the target.
  const initialValue = (idx: number): number | null => {
    const st = steps[idx];
    if (!st) return null;
    const ex = plan[st.ex];
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
      setRestEnd(Date.now() + cur.restSec * 1000);
      setPhase('rest');
    }
  };

  const done = () => {
    let v = value;
    if (holdStart !== null) v = Math.round((Date.now() - holdStart) / 1000);
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
      deload: week === 6 || week === 12,
      flags,
      entries: latest.filter((e) => e.sets.some((s) => s.value !== null)),
      notes: notes.trim() || undefined,
    };
    const suggestions = suggest(log, state.workouts);
    update((s) => ({ ...s, workouts: [log, ...s.workouts] }));
    setRestEnd(null);
    setHoldStart(null);
    haptic('success');
    setResult({ log, suggestions });
  }

  // ---------- Summary ----------
  if (result) {
    const sets = result.log.entries.reduce((n, e) => n + e.sets.filter((s) => s.value !== null).length, 0);
    const mins = Math.max(1, Math.round((Date.now() - startedAt) / 60000));
    const ups = result.suggestions.filter((s) => s.kind === 'up' || s.kind === 'test');
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Klart!', headerBackVisible: false, gestureEnabled: false, headerRight: () => null }} />
        <ScrollView contentContainerStyle={styles.screen}>
          <Text style={{ fontSize: 64, textAlign: 'center' }}>{ups.length ? '🎉' : '💪'}</Text>
          <H1>{ups.length ? 'Dags för nästa nivå!' : 'Bra jobbat!'}</H1>
          <P muted>
            {SESSION_SV[session.id].title} · {sets} set · {mins} min
          </P>
          {result.suggestions.length === 0 && (
            <Card>
              <P>Samma nivåer nästa gång – försök klara 1 rep till på minst ett set.</P>
            </Card>
          )}
          {result.suggestions.map((s, i) => {
            const good = s.kind === 'up' || s.kind === 'test';
            return (
              <Card key={i} style={good ? { borderColor: t.good, borderWidth: 2 } : undefined}>
                <Row>
                  <Chip text={s.kind === 'up' ? 'Ny nivå' : s.kind === 'down' ? 'Lättare variant' : s.kind === 'test' ? 'Testa nästa' : 'Ta det lugnt'} tone={good ? 'good' : 'warn'} />
                </Row>
                <Text style={{ color: t.text, fontSize: 17, fontWeight: '700' }}>
                  {LEVEL_SV[s.from] ?? s.from}
                  {s.to ? ` → ${LEVEL_SV[s.to] ?? s.to}` : ''}
                </Text>
                <P muted>{s.reason}</P>
                {s.to && (
                  <Button
                    title={applied[i] ? (good ? 'Ny nivå satt 🎉' : 'Ändrat ✓') : good ? 'Ja, gå vidare!' : 'Byt till lättare'}
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
            <Label>Anteckning (valfritt)</Label>
            <TextInput
              value={notes}
              onChangeText={(x) => {
                setNotes(x);
                update((st) => ({ ...st, workouts: st.workouts.map((w) => (w.id === result.log.id ? { ...w, notes: x.trim() || undefined } : w)) }));
              }}
              placeholder="Hur kändes det?"
              placeholderTextColor={t.muted}
              multiline
              style={{ color: t.text, minHeight: 44, fontSize: 15 }}
            />
          </Card>
          <Button title="Klar" onPress={() => router.dismissTo('/')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  if (!cur || !step) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg, padding: 16 }}>
        <P>Inga övningar i det här passet.</P>
      </SafeAreaView>
    );
  }

  const progressPct = (stepIdx / steps.length) * 100;
  const media = cur.mediaKey ? mediaFor(cur.mediaKey) : {};
  const partner = plan.find((p, i) => i !== step.ex && p.slot[0] === cur.slot[0] && /\d$/.test(p.slot) && /\d$/.test(cur.slot));
  const exNo = new Set(steps.slice(0, stepIdx + 1).map((s) => s.ex)).size;
  const hold = isHoldUnit(cur.unit);
  const pain = entries[step.ex].sets[0]?.pain ?? 0;
  const holdSecs = holdStart !== null ? Math.floor((now - holdStart) / 1000) : null;
  const nextStep = steps[stepIdx];

  // ---------- Warm-up ----------
  if (phase === 'warmup' && session.warmup) {
    const w = WARMUP_SV[session.warmup];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: SESSION_SV[session.id].title }} />
        <ScrollView contentContainerStyle={styles.screen}>
          <Label>Innan du börjar</Label>
          <H1>{w.title}</H1>
          <Card>
            {w.steps.map((x, i) => (
              <Text key={i} style={{ color: t.text, fontSize: 16, lineHeight: 26 }}>
                {i + 1}. {x}
              </Text>
            ))}
          </Card>
          <HowToToggle mediaKey="wrist" label="Visa handledsuppvärmning" />
          <Button title="Klar – till första övningen" onPress={() => setPhase('work')} style={{ paddingVertical: 16 }} />
          <Pressable onPress={() => setPhase('work')} hitSlop={8}>
            <Text style={{ color: t.muted, textAlign: 'center', fontWeight: '600' }}>Redan uppvärmd – hoppa över</Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ---------- Rest ----------
  if (phase === 'rest') {
    const upcoming = plan[nextStep.ex];
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: SESSION_SV[session.id].title }} />
        <View style={{ height: 4, backgroundColor: t.grid }}>
          <View style={{ height: 4, width: `${progressPct}%`, backgroundColor: t.accent }} />
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 16 }}>
          <Label>Vila</Label>
          <Text style={{ color: t.text, fontSize: 88, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
            {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
          </Text>
          <P muted style={{ textAlign: 'center' }}>
            Nästa: {upcoming.title} · set {nextStep.set + 1} av {upcoming.plannedSets}
          </P>
          <Row style={{ justifyContent: 'center' }}>
            <Button title="+15 s" variant="secondary" onPress={() => setRestEnd((x) => Math.max(x ?? 0, Date.now()) + 15000)} />
            <Button
              title="Kör nu"
              onPress={() => {
                setRestEnd(null);
                setPhase('work');
              }}
            />
          </Row>
        </View>
      </SafeAreaView>
    );
  }

  // ---------- Work ----------
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: SESSION_SV[session.id].title, headerRight: () => (
        <Pressable onPress={() => (entries.some((e) => e.sets.some((s) => s.value !== null)) ? finish(entries) : router.back())} hitSlop={10}>
          <Text style={{ color: t.accent, fontWeight: '700' }}>Avsluta</Text>
        </Pressable>
      ) }} />
      <View style={{ height: 4, backgroundColor: t.grid }}>
        <View style={{ height: 4, width: `${progressPct}%`, backgroundColor: t.accent }} />
      </View>
      <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 24 }]}>
        <Label>
          Övning {exNo} av {plan.length} · Set {step.set + 1} av {cur.plannedSets}
        </Label>
        <Text style={{ color: t.text, fontSize: 28, fontWeight: '800', letterSpacing: -0.5 }}>{cur.title}</Text>
        <Row>
          {cur.swapped && <Chip text="Ersatt – du saknar utrustning" tone="accent" />}
          {partner && <Chip text={`Växla med: ${partner.title}`} />}
        </Row>

        {media.anim ? <Figure anim={media.anim} size={0.9} /> : null}
        <HowToToggle mediaKey={cur.mediaKey} label={media.anim ? 'Muskler & video' : 'Se hur man gör'} />

        <Card>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <Text style={{ color: t.text, fontSize: 22, fontWeight: '800' }}>
              {hold ? 'Håll ' : ''}
              {range(cur)}
            </Text>
            <Explain
              text={`${cur.name}${cur.level ? ` (${cur.level})` : ''}. RIR ${cur.plannedRir}, tempo ${cur.tempo}, vila ${cur.rest}. ${cur.cue}`}
              context={`Mitt i passet ${SESSION_SV[session.id].title}: övning ${cur.title}, set ${step.set + 1} av ${cur.plannedSets}, mål ${range(cur)}`}
            />
          </Row>
          <Text style={{ color: t.muted, fontSize: 15 }}>
            {effortText(cur.plannedRir)}
            {tempoText(cur.tempo) && !hold ? ` · ${tempoText(cur.tempo)}` : ''}
          </Text>
          <Text style={{ color: t.text, fontSize: 15, fontStyle: 'italic' }}>“{cur.cueSv}”</Text>
          {anatomyFor(cur.mediaKey) && (
            <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>
              💪 {anatomyFor(cur.mediaKey)!.feel}
              {'\n'}⛔ {anatomyFor(cur.mediaKey)!.notFeel}
            </Text>
          )}
        </Card>

        {/* Counter */}
        <View style={{ alignItems: 'center', gap: 10 }}>
          {hold && (
            <Button
              title={holdSecs !== null ? `Stopp · ${holdSecs} s` : '▶ Starta tidtagning'}
              variant={holdSecs !== null ? 'primary' : 'secondary'}
              onPress={() => {
                if (holdStart === null) setHoldStart(Date.now());
                else {
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
            <Text style={{ color: t.muted, fontSize: 13, textAlign: 'center' }}>Hur tungt var det?</Text>
            <Row style={{ justifyContent: 'center' }}>
              {EFFORTS.map((e) => (
                <Chip key={e.label} text={`  ${e.label}  `} tone={effort === e.rir ? 'accent' : 'neutral'} onPress={() => setEffort(e.rir)} />
              ))}
            </Row>
          </View>
        )}

        <Button title="Klart ✓" onPress={done} style={{ paddingVertical: 16 }} />

        <Row style={{ justifyContent: 'space-between' }}>
          <Pressable onPress={() => setPainOpen((x) => !x)} hitSlop={8}>
            <Text style={{ color: pain >= 3 ? t.warn : t.muted, fontWeight: '600' }}>{pain > 0 ? `Smärta ${pain}/10` : 'Gör det ont?'}</Text>
          </Pressable>
          <Pressable onPress={skipExercise} hitSlop={8}>
            <Text style={{ color: t.muted, fontWeight: '600' }}>Hoppa över övningen ›</Text>
          </Pressable>
        </Row>

        {painOpen && (
          <Card>
            <H2>Hur ont i led eller sena?</H2>
            <P muted>Träningsvärk och muskeltrötthet räknas inte.</P>
            <Row>
              {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                <Chip key={n} text={` ${n} `} tone={n >= 3 ? 'warn' : 'neutral'} onPress={() => setPain(n)} />
              ))}
            </Row>
          </Card>
        )}
        {pain >= 3 && (
          <Card style={{ borderColor: t.warn, borderWidth: 1 }}>
            <P style={{ color: t.warn, fontWeight: '700' }}>{pain > 5 ? 'Sluta med övningen nu.' : 'Ta det försiktigt.'}</P>
            <P>
              {pain > 5
                ? 'Skarp eller stark smärta ska inte tränas igenom. Hoppa över övningen och kontakta fysioterapeut om det inte går över.'
                : 'Nästa gång kör du en lättare variant med mindre volym. Hoppa gärna över resten av den här övningen.'}
            </P>
            <Button title="Hoppa över övningen" variant="secondary" onPress={skipExercise} />
          </Card>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const bigBtn = (bg: string) => ({ width: 64, height: 64, borderRadius: 32, backgroundColor: bg, alignItems: 'center' as const, justifyContent: 'center' as const });
