import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { HowToToggle } from '@/components/HowTo';
import { Bullets, Button, Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { READINESS } from '@/data/guide';
import { SessionId, SESSIONS, WARMUPS } from '@/data/sessions';
import { planSession, range, rirLabel } from '@/lib/plan';
import { newId, useStore } from '@/lib/store';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update } = useStore();
  const t = useTheme();
  const session = SESSIONS[params.id];
  if (!session) return <Screen><P>Okänt pass.</P></Screen>;

  const week = Number(params.week ?? 1);
  const flags = Number(params.flags ?? 0);
  const deload = week === 6 || week === 12;
  const plan = planSession(session.id, week, flags, state.levels);
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
      <Stack.Screen options={{ title: session.title }} />
      <View>
        <Label>Vecka {week} · {session.duration}</Label>
        <H1>{session.title}</H1>
        <P muted>{session.short}</P>
      </View>
      <Row>
        {deload && <Chip text="Deload: ~50 % set, RIR 4, ingen plyo" tone="accent" />}
        {week === 1 && hasSets && <Chip text="Vecka 1: −1 set på huvudlyft" />}
        {flags > 0 && <Chip text={`${flags} dagsformsflagg${flags === 1 ? 'a' : 'or'}`} tone={flags >= 3 ? 'warn' : 'accent'} />}
      </Row>
      {flags > 0 && <P>{READINESS.actions[Math.min(flags, 3)]}</P>}
      {session.intro && <P muted>{session.intro}</P>}

      {session.warmup && (
        <Card>
          <H2>Uppvärmning: {WARMUPS[session.warmup].title}</H2>
          <Bullets items={WARMUPS[session.warmup].steps} />
          {WARMUPS[session.warmup].demos.map((d) => (
            <HowToToggle key={d.key} mediaKey={d.key} label={d.label} />
          ))}
        </Card>
      )}

      {plan.map((e) => (
        <Card key={e.slot} style={e.plannedSets === 0 ? { opacity: 0.5 } : undefined}>
          <Row>
            <Text style={{ color: t.accent, fontWeight: '800', width: 28 }}>{e.slot}</Text>
            <Text style={{ color: t.text, fontWeight: '700', fontSize: 15, flex: 1 }}>{e.name}</Text>
          </Row>
          {e.level && (
            <Text style={{ color: t.text, fontSize: 14 }}>
              <Text style={{ color: t.accent, fontWeight: '800' }}>{e.level}</Text> · {e.levelName}
            </Text>
          )}
          {e.plannedSets === 0 ? (
            <P muted>Hoppas över denna vecka (ingen plyometri i deload).</P>
          ) : (
            <Text style={{ color: t.text, fontSize: 14 }}>
              {e.plannedSets} × {range(e)} · vila {e.rest} · {rirLabel(e.plannedRir)} · tempo {e.tempo}
            </Text>
          )}
          <Text style={{ color: t.muted, fontSize: 14, fontStyle: 'italic' }}>“{e.cue}”</Text>
          <HowToToggle mediaKey={e.mediaKey} />
        </Card>
      ))}

      {session.steps && (
        <Card>
          <Bullets items={session.steps} />
        </Card>
      )}

      {session.block2 && (
        <Card style={week >= 7 && week <= 11 ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
          <H2>Block 2-regler (vecka 7–11)</H2>
          {week >= 7 && week <= 11 ? <P muted>Gäller denna vecka — tillämpa innan du börjar.</P> : <P muted>Gäller från vecka 7.</P>}
          <Bullets items={session.block2} />
        </Card>
      )}

      {flags >= 3 && hasSets ? (
        <Card>
          <P>3+ flaggor: gör bara mikroträning + Zon 2 idag och flytta det hårda passet 24 h.</P>
          <Button title="Starta ändå" variant="secondary" onPress={() => router.push({ pathname: '/workout/[id]', params: { id: session.id, week: String(week), flags: String(flags) } })} />
        </Card>
      ) : hasSets ? (
        <Button title="Starta pass" onPress={() => router.push({ pathname: '/workout/[id]', params: { id: session.id, week: String(week), flags: String(flags) } })} />
      ) : session.id !== 'rest' ? (
        <Button title="Markera som genomfört" onPress={markDone} />
      ) : null}
    </Screen>
  );
}
