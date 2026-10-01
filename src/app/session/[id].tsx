import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Explain } from '@/components/Explain';
import { HowToToggle } from '@/components/HowTo';
import { Bullets, Button, Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { READINESS } from '@/data/guide';
import { SessionId, SESSIONS, WARMUPS } from '@/data/sessions';
import { effortText, SESSION_SV, WARMUP_SV } from '@/data/sv';
import { planSession, range } from '@/lib/plan';
import { newId, useStore } from '@/lib/store';
import { useUnits } from '@/lib/units';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update } = useStore();
  const t = useTheme();
  const u = useUnits();
  const [advanced, setAdvanced] = useState(false);
  const session = SESSIONS[params.id];
  if (!session) return <Screen><P>Unknown workout.</P></Screen>;

  const week = Number(params.week ?? 1);
  const flags = Number(params.flags ?? 0);
  const deload = week === 6 || week === 12;
  const plan = planSession(session.id, week, flags, state.levels, state.profile?.equipment ?? null);
  const sv = SESSION_SV[session.id];
  const startWorkout = () => router.push({ pathname: '/workout/[id]', params: { id: session.id, week: String(week), flags: String(flags) } });
  const hasSets = plan.length > 0;

  const markDone = () => {
    update((s) => ({
      ...s,
      workouts: [{ id: newId(), date: new Date().toISOString(), week, session: session.id, deload, flags, entries: [] }, ...s.workouts],
    }));
    router.back();
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: sv.title }} />
      <View>
        <Label>Week {week} · {session.duration}</Label>
        <H1>{sv.title}</H1>
        <P muted>{u(sv.short)}</P>
      </View>
      <Row>
        {deload && <Chip text="Easy week: half the volume, no jumps" tone="accent" />}
        {flags > 0 && <Chip text={`Readiness: ${flags} ⚠︎`} tone={flags >= 3 ? 'warn' : 'accent'} />}
      </Row>
      {hasSets && flags < 3 && <Button title="Start workout" onPress={startWorkout} />}
      {flags > 0 && <P>{u(READINESS.actions[Math.min(flags, 3)])}</P>}
      {session.intro && <P muted>{u(session.intro)}</P>}

      {session.warmup && (
        <Card>
          <H2>{WARMUP_SV[session.warmup].title}</H2>
          <Bullets items={WARMUP_SV[session.warmup].steps.map(u)} />
          {WARMUPS[session.warmup].demos.map((d) => (
            <HowToToggle key={d.key} mediaKey={d.key} label={d.label} />
          ))}
        </Card>
      )}

      {plan.map((e) => (
        <Card key={e.slot} style={e.plannedSets === 0 ? { opacity: 0.5 } : undefined}>
          <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
            <Text style={{ color: t.text, fontWeight: '700', fontSize: 17, flex: 1 }}>{u(e.title)}</Text>
            <Explain text={`${e.name}${e.level ? ` (${e.level})` : ''}. RIR ${e.plannedRir}, tempo ${e.tempo}, rest ${e.rest}. ${e.cue}`} context={`Workout overview ${sv.title}: ${e.title}`} />
          </Row>
          {e.swapped && <Chip text="Swapped – missing equipment" tone="accent" />}
          {e.plannedSets === 0 ? (
            <P muted>Skipped this week.</P>
          ) : (
            <Text style={{ color: t.text, fontSize: 15 }}>
              {e.plannedSets} × {u(range(e))} <Text style={{ color: t.muted }}>· {effortText(e.plannedRir)}</Text>
            </Text>
          )}
          <Text style={{ color: t.muted, fontSize: 14, fontStyle: 'italic' }}>“{u(e.cueSv)}”</Text>
          {advanced && (
            <Text style={{ color: t.muted, fontSize: 13 }}>
              {e.slot} · {u(e.name)}
              {e.level ? ` · ${e.level}` : ''} · rest {e.rest} · RIR {e.plannedRir} · tempo {e.tempo}
            </Text>
          )}
          <HowToToggle mediaKey={e.mediaKey} />
        </Card>
      ))}

      <Pressable onPress={() => setAdvanced((x) => !x)} hitSlop={8}>
        <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>{advanced ? 'Hide details' : 'Show details (RIR, tempo, rest, Block 2)'}</Text>
      </Pressable>

      {session.steps && (
        <Card>
          <Bullets items={session.steps.map(u)} />
        </Card>
      )}

      {advanced && session.block2 && (
        <Card style={week >= 7 && week <= 11 ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
          <H2>Block 2 rules (weeks 7–11)</H2>
          {week >= 7 && week <= 11 ? <P muted>Applies this week — apply before you start.</P> : <P muted>Applies from week 7.</P>}
          <Bullets items={session.block2.map(u)} />
        </Card>
      )}

      {flags >= 3 && hasSets ? (
        <Card>
          <P>3+ flags: do only micro-practice + Zone 2 today and push the hard workout back 24 h.</P>
          <Button title="Start anyway" variant="secondary" onPress={startWorkout} />
        </Card>
      ) : hasSets ? (
        <Button title="Start workout" onPress={startWorkout} />
      ) : session.id !== 'rest' ? (
        <Button title="Mark as done" onPress={markDone} />
      ) : null}
    </Screen>
  );
}
