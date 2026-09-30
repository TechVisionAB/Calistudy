import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, Vibration, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { HowToToggle } from '@/components/HowTo';
import { Button, Card, Chip, H1, H2, Label, P, Row, Stepper, styles, useTheme } from '@/components/ui';
import { SessionId, SESSIONS } from '@/data/sessions';
import { isHoldUnit, planSession, range, rirLabel, unitLabel } from '@/lib/plan';
import { Suggestion, suggest } from '@/lib/progression';
import { EntryLog, newId, SetLog, useStore, WorkoutLog } from '@/lib/store';

export default function WorkoutScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update, setLevel } = useStore();
  const t = useTheme();
  const session = SESSIONS[params.id];
  const week = Number(params.week ?? 1);
  const flags = Number(params.flags ?? 0);

  const plan = useMemo(
    () => (session ? planSession(session.id, week, flags, state.levels).filter((e) => e.plannedSets > 0) : []),
    // Levels are frozen for the duration of the workout.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [session?.id, week, flags],
  );

  const [entries, setEntries] = useState<EntryLog[]>(() =>
    plan.map((e) => ({
      slot: e.slot,
      name: e.name,
      ladder: e.ladder,
      level: e.level,
      unit: e.unit,
      min: e.min,
      max: e.max,
      sets: Array.from({ length: e.plannedSets }, (): SetLog => ({ value: null, rir: null, pain: null })),
    })),
  );
  const [doneSets, setDoneSets] = useState<Record<string, boolean>>({});
  const [notes, setNotes] = useState('');
  const [result, setResult] = useState<{ log: WorkoutLog; suggestions: Suggestion[] } | null>(null);
  const [applied, setApplied] = useState<Record<string, boolean>>({});

  // Rest timer
  const [endAt, setEndAt] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const buzzed = useRef(false);
  useEffect(() => {
    if (endAt === null) return;
    buzzed.current = false;
    const iv = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(iv);
  }, [endAt]);
  const remaining = endAt === null ? 0 : Math.max(0, Math.ceil((endAt - now) / 1000));
  useEffect(() => {
    if (endAt !== null && remaining === 0 && !buzzed.current) {
      buzzed.current = true;
      Vibration.vibrate([0, 300, 150, 300]);
    }
  }, [remaining, endAt]);

  if (!session) return null;

  const previous = (slot: string, level?: string) =>
    state.workouts.find((w) => w.session === session.id && w.entries.some((e) => e.slot === slot && e.level === level))?.entries.find((e) => e.slot === slot);

  const setField = (ei: number, si: number, field: keyof SetLog, v: number | null) =>
    setEntries((es) => es.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s, j) => (j === si ? { ...s, [field]: v } : s)) })));

  const setPain = (ei: number, v: number | null) =>
    setEntries((es) => es.map((e, i) => (i !== ei ? e : { ...e, sets: e.sets.map((s) => ({ ...s, pain: v })) })));

  const completeSet = (ei: number, si: number) => {
    const key = `${ei}:${si}`;
    const e = entries[ei];
    if (e.sets[si].value === null) setField(ei, si, 'value', plan[ei].max);
    setDoneSets((d) => ({ ...d, [key]: !d[key] }));
    if (!doneSets[key]) setEndAt(Date.now() + plan[ei].restSec * 1000);
  };

  const finish = () => {
    const log: WorkoutLog = {
      id: newId(),
      date: new Date().toISOString(),
      week,
      session: session.id,
      deload: week === 6 || week === 12,
      flags,
      entries,
      notes: notes.trim() || undefined,
    };
    const suggestions = suggest(log, state.workouts);
    update((s) => ({ ...s, workouts: [log, ...s.workouts] }));
    setEndAt(null);
    setResult({ log, suggestions });
  };

  if (result) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
        <Stack.Screen options={{ title: 'Klart!', headerBackVisible: false }} />
        <ScrollView contentContainerStyle={styles.screen}>
          <H1>Bra jobbat 💪</H1>
          <P muted>
            {session.title} loggat · {result.log.entries.reduce((n, e) => n + e.sets.filter((s) => s.value !== null).length, 0)} set
          </P>
          <H2>Progressionsförslag</H2>
          {result.suggestions.length === 0 && (
            <Card>
              <P>Behåll nivåerna och försök lägga till 1 rep på minst ett set nästa pass.</P>
            </Card>
          )}
          {result.suggestions.map((s, i) => (
            <Card key={i}>
              <Row>
                <Chip text={s.kind === 'up' ? 'Upp' : s.kind === 'down' ? 'Ner' : s.kind === 'test' ? 'Testa nästa' : 'Anpassa'} tone={s.kind === 'up' || s.kind === 'test' ? 'good' : 'warn'} />
                <Text style={{ color: t.text, fontWeight: '700' }}>
                  {s.from}
                  {s.to ? ` → ${s.to}` : ''}
                </Text>
              </Row>
              <P>{s.reason}</P>
              {s.to && (
                <Button
                  title={applied[i] ? 'Tillämpat ✓' : `Sätt nivå ${s.to}`}
                  variant="secondary"
                  disabled={applied[i]}
                  onPress={() => {
                    setLevel(s.ladder, s.to!);
                    setApplied((a) => ({ ...a, [i]: true }));
                  }}
                />
              )}
            </Card>
          ))}
          <Button title="Klar" onPress={() => router.dismissTo('/')} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  const totalSets = entries.reduce((n, e) => n + e.sets.length, 0);
  const completed = Object.values(doneSets).filter(Boolean).length;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title: `${session.title} · v${week}` }} />
      <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 140 }]} keyboardShouldPersistTaps="handled">
        <Row style={{ justifyContent: 'space-between' }}>
          <Label>
            {completed}/{totalSets} set klara
          </Label>
          <Button title="Avbryt" variant="ghost" onPress={() => router.back()} />
        </Row>

        {plan.map((p, ei) => {
          const e = entries[ei];
          const prev = previous(p.slot, p.level);
          const hold = isHoldUnit(p.unit);
          return (
            <Card key={p.slot}>
              <Row>
                <Text style={{ color: t.accent, fontWeight: '800', width: 28 }}>{p.slot}</Text>
                <Text style={{ color: t.text, fontWeight: '700', fontSize: 15, flex: 1 }}>{p.name}</Text>
              </Row>
              {p.level && (
                <Text style={{ color: t.text, fontSize: 14 }}>
                  <Text style={{ color: t.accent, fontWeight: '800' }}>{p.level}</Text> · {p.levelName}
                </Text>
              )}
              <Text style={{ color: t.muted, fontSize: 13 }}>
                Mål {p.plannedSets} × {range(p)} · {rirLabel(p.plannedRir)} · vila {p.rest} · tempo {p.tempo}
              </Text>
              <Text style={{ color: t.muted, fontSize: 13, fontStyle: 'italic' }}>“{p.cue}”</Text>
              <HowToToggle mediaKey={p.mediaKey} />
              {prev && (
                <Text style={{ color: t.muted, fontSize: 13 }}>
                  Förra: {prev.sets.map((s) => (s.value === null ? '–' : s.value)).join(' / ')} {unitLabel(prev.unit)}
                </Text>
              )}

              <View style={{ gap: 8, marginTop: 4 }}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: t.muted, fontSize: 12, width: 40 }}>SET</Text>
                  <Text style={{ color: t.muted, fontSize: 12, flex: 1, textAlign: 'center' }}>{hold ? 'SEKUNDER' : 'REPS'}</Text>
                  <Text style={{ color: t.muted, fontSize: 12, width: 104, textAlign: 'center' }}>{hold ? 'MARGINAL' : 'RIR'}</Text>
                  <View style={{ width: 40 }} />
                </Row>
                {e.sets.map((s, si) => {
                  const done = doneSets[`${ei}:${si}`];
                  return (
                    <Row key={si} style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
                      <Text style={{ color: t.text, fontWeight: '700', width: 40 }}>{si + 1}</Text>
                      <View style={{ flex: 1, alignItems: 'center' }}>
                        <Stepper value={s.value} onChange={(v) => setField(ei, si, 'value', v)} step={1} />
                      </View>
                      <View style={{ width: 104, alignItems: 'center' }}>
                        <Stepper value={s.rir} onChange={(v) => setField(ei, si, 'rir', v === null ? null : Math.min(10, v))} width={24} />
                      </View>
                      <Pressable
                        onPress={() => completeSet(ei, si)}
                        accessibilityLabel={`Markera set ${si + 1} klart`}
                        style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center', backgroundColor: done ? t.good : t.chip }}
                      >
                        <Text style={{ color: done ? '#fff' : t.muted, fontWeight: '800' }}>✓</Text>
                      </Pressable>
                    </Row>
                  );
                })}
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: t.muted, fontSize: 13 }}>Led-/senesmärta (0–10)</Text>
                  <Stepper value={e.sets[0]?.pain ?? null} onChange={(v) => setPain(ei, v === null ? null : Math.min(10, v))} width={24} />
                </Row>
                {(e.sets[0]?.pain ?? 0) >= 3 && (
                  <P style={{ color: t.warn, fontSize: 13 }}>
                    Smärta ≥3/10: överväg att avbryta övningen. Nästa pass −1 nivå och −30–50 % volym.
                  </P>
                )}
              </View>
            </Card>
          );
        })}

        <Card>
          <Label>Anteckningar</Label>
          <TextInput
            value={notes}
            onChangeText={setNotes}
            placeholder="Hur kändes passet?"
            placeholderTextColor={t.muted}
            multiline
            style={{ color: t.text, minHeight: 60, fontSize: 15 }}
          />
        </Card>
        <Button title="Avsluta & spara pass" onPress={finish} />
      </ScrollView>

      {endAt !== null && (
        <View style={{ position: 'absolute', left: 16, right: 16, bottom: 24, backgroundColor: remaining === 0 ? t.good : t.text, borderRadius: 16, padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <Text style={{ color: t.bg, fontSize: 12, fontWeight: '700' }}>{remaining === 0 ? 'VILA KLAR' : 'VILA'}</Text>
            <Text style={{ color: t.bg, fontSize: 28, fontWeight: '800', fontVariant: ['tabular-nums'] }}>
              {Math.floor(remaining / 60)}:{String(remaining % 60).padStart(2, '0')}
            </Text>
          </View>
          <Pressable onPress={() => setEndAt((x) => Math.max(x ?? 0, Date.now()) + 15000)} style={{ padding: 10 }}>
            <Text style={{ color: t.bg, fontWeight: '800' }}>+15 s</Text>
          </Pressable>
          <Pressable onPress={() => setEndAt(null)} style={{ padding: 10 }}>
            <Text style={{ color: t.bg, fontWeight: '800' }}>Stäng</Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
