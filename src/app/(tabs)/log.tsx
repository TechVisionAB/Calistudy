import { router } from 'expo-router';
import { useState } from 'react';
import { Text, View } from 'react-native';

import { Card, Chip, H2, P, Row, Screen, useTheme } from '@/components/ui';
import { SESSIONS } from '@/data/sessions';
import { useStore } from '@/lib/store';

export default function Log() {
  const { state } = useStore();
  const t = useTheme();
  const workouts = [...state.workouts].sort((a, b) => b.date.localeCompare(a.date));
  const tests = [...state.tests].sort((a, b) => b.date.localeCompare(a.date));

  const [now] = useState(() => Date.now());
  const last7 = workouts.filter((w) => now - new Date(w.date).getTime() < 7 * 86400000).length;
  const microDays = Object.values(state.micro).filter((x) => x.length > 0).length;

  return (
    <Screen>
      <Row>
        <Card style={{ flex: 1 }}>
          <Text style={{ color: t.accent, fontSize: 28, fontWeight: '800' }}>{workouts.length}</Text>
          <P muted>pass totalt</P>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={{ color: t.accent, fontSize: 28, fontWeight: '800' }}>{last7}</Text>
          <P muted>senaste 7 dagar</P>
        </Card>
        <Card style={{ flex: 1 }}>
          <Text style={{ color: t.accent, fontSize: 28, fontWeight: '800' }}>{microDays}</Text>
          <P muted>mikrodagar</P>
        </Card>
      </Row>

      <Card onPress={() => router.push('/progress')} style={{ borderColor: t.accent, borderWidth: 2 }}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>📈 Framsteg</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>Kurvor över bästa set per övning och nivå.</Text>
      </Card>

      <H2>Pass</H2>
      {workouts.length === 0 && <P muted>Inga pass loggade ännu.</P>}
      {workouts.map((w) => {
        const sets = w.entries.reduce((n, e) => n + e.sets.filter((s) => s.value !== null).length, 0);
        const maxPain = Math.max(0, ...w.entries.flatMap((e) => e.sets.map((s) => s.pain ?? 0)));
        return (
          <Card key={w.id} onPress={() => router.push({ pathname: '/history/[id]', params: { id: w.id } })}>
            <Row style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{SESSIONS[w.session]?.title ?? w.session}</Text>
              <Text style={{ color: t.muted }}>{new Date(w.date).toLocaleDateString('sv-SE')}</Text>
            </Row>
            <Row>
              <Chip text={`Vecka ${w.week}`} />
              {w.deload && <Chip text="Deload" tone="accent" />}
              {sets > 0 && <Chip text={`${sets} set`} />}
              {maxPain >= 3 && <Chip text={`Smärta ${maxPain}/10`} tone="warn" />}
            </Row>
          </Card>
        );
      })}

      {tests.length > 0 && (
        <View style={{ gap: 8 }}>
          <H2>Tester</H2>
          {tests.map((x) => (
            <Card key={x.id}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: t.text, fontWeight: '700' }}>{x.battery === 'mini' ? 'Minitest' : `Test ${x.battery}`}</Text>
                <Text style={{ color: t.muted }}>{new Date(x.date).toLocaleDateString('sv-SE')}</Text>
              </Row>
              <P muted>
                {Object.entries(x.values)
                  .filter(([, v]) => v !== undefined)
                  .map(([k, v]) => `${k}: ${v}`)
                  .join(' · ') || (x.failed ? `Underkända: ${x.failed.length}` : '—')}
              </P>
            </Card>
          ))}
        </View>
      )}
    </Screen>
  );
}
