import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HowToToggle } from '@/components/HowTo';
import { Bullets, Button, Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { READINESS } from '@/data/guide';
import { SessionId, SESSIONS, WARMUPS } from '@/data/sessions';
import { effortText, SESSION_SV, WARMUP_SV } from '@/data/sv';
import { planSession, range } from '@/lib/plan';
import { newId, useStore } from '@/lib/store';

export default function SessionScreen() {
  const params = useLocalSearchParams<{ id: SessionId; week?: string; flags?: string }>();
  const { state, update } = useStore();
  const t = useTheme();
  const [advanced, setAdvanced] = useState(false);
  const session = SESSIONS[params.id];
  if (!session) return <Screen><P>Okänt pass.</P></Screen>;

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
        <Label>Vecka {week} · {session.duration}</Label>
        <H1>{sv.title}</H1>
        <P muted>{sv.short}</P>
      </View>
      <Row>
        {deload && <Chip text="Lätt vecka: halva mängden, inga hopp" tone="accent" />}
        {flags > 0 && <Chip text={`Dagsform: ${flags} ⚠︎`} tone={flags >= 3 ? 'warn' : 'accent'} />}
      </Row>
      {hasSets && flags < 3 && <Button title="Starta passet" onPress={startWorkout} />}
      {flags > 0 && <P>{READINESS.actions[Math.min(flags, 3)]}</P>}
      {session.intro && <P muted>{session.intro}</P>}

      {session.warmup && (
        <Card>
          <H2>{WARMUP_SV[session.warmup].title}</H2>
          <Bullets items={WARMUP_SV[session.warmup].steps} />
          {WARMUPS[session.warmup].demos.map((d) => (
            <HowToToggle key={d.key} mediaKey={d.key} label={d.label} />
          ))}
        </Card>
      )}

      {plan.map((e) => (
        <Card key={e.slot} style={e.plannedSets === 0 ? { opacity: 0.5 } : undefined}>
          <Text style={{ color: t.text, fontWeight: '700', fontSize: 17 }}>{e.title}</Text>
          {e.swapped && <Chip text="Ersatt – du saknar utrustning" tone="accent" />}
          {e.plannedSets === 0 ? (
            <P muted>Hoppas över den här veckan.</P>
          ) : (
            <Text style={{ color: t.text, fontSize: 15 }}>
              {e.plannedSets} × {range(e)} <Text style={{ color: t.muted }}>· {effortText(e.plannedRir)}</Text>
            </Text>
          )}
          <Text style={{ color: t.muted, fontSize: 14, fontStyle: 'italic' }}>“{e.cueSv}”</Text>
          {advanced && (
            <Text style={{ color: t.muted, fontSize: 13 }}>
              {e.slot} · {e.name}
              {e.level ? ` · ${e.level}` : ''} · vila {e.rest} · RIR {e.plannedRir} · tempo {e.tempo}
            </Text>
          )}
          <HowToToggle mediaKey={e.mediaKey} />
        </Card>
      ))}

      <Pressable onPress={() => setAdvanced((x) => !x)} hitSlop={8}>
        <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>{advanced ? 'Dölj detaljer' : 'Visa detaljer (RIR, tempo, vila, Block 2)'}</Text>
      </Pressable>

      {session.steps && (
        <Card>
          <Bullets items={session.steps} />
        </Card>
      )}

      {advanced && session.block2 && (
        <Card style={week >= 7 && week <= 11 ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
          <H2>Block 2-regler (vecka 7–11)</H2>
          {week >= 7 && week <= 11 ? <P muted>Gäller denna vecka — tillämpa innan du börjar.</P> : <P muted>Gäller från vecka 7.</P>}
          <Bullets items={session.block2} />
        </Card>
      )}

      {flags >= 3 && hasSets ? (
        <Card>
          <P>3+ flaggor: gör bara mikroträning + Zon 2 idag och flytta det hårda passet 24 h.</P>
          <Button title="Starta ändå" variant="secondary" onPress={startWorkout} />
        </Card>
      ) : hasSets ? (
        <Button title="Starta passet" onPress={startWorkout} />
      ) : session.id !== 'rest' ? (
        <Button title="Markera som genomfört" onPress={markDone} />
      ) : null}
    </Screen>
  );
}
