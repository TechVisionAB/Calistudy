import { router } from 'expo-router';
import { Text, View } from 'react-native';

import { Button, Card, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { LADDERS, LadderGroup } from '@/data/ladders';
import { useStore } from '@/lib/store';

const GROUPS: LadderGroup[] = ['Tryck', 'Drag', 'Färdigheter', 'Bål', 'Ben'];

export default function Levels() {
  const { state } = useStore();
  const t = useTheme();
  const lastTest = [...state.tests].sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <Screen>
      <Card>
        <H2>Baslinjetest</H2>
        <P muted>
          Testa utvilad (48 h efter senaste hårda pass). Resultaten placerar dig automatiskt i stegarna.
          {lastTest ? ` Senaste test: ${lastTest.date.slice(0, 10)} (${lastTest.battery === 'mini' ? 'minitest' : lastTest.battery}).` : ''}
        </P>
        <Row>
          {(['A', 'B', 'C'] as const).map((b) => (
            <Button key={b} title={`Test ${b}`} variant="secondary" onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: b } })} />
          ))}
          <Button title="Minitest" variant="secondary" onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: 'mini' } })} />
        </Row>
      </Card>

      {GROUPS.map((g) => (
        <View key={g} style={{ gap: 8 }}>
          <Label>{g}</Label>
          {LADDERS.filter((l) => l.group === g).map((l) => {
            const code = state.levels[l.id];
            const idx = l.levels.findIndex((x) => x.code === code);
            const lvl = l.levels[idx];
            return (
              <Card key={l.id} onPress={() => router.push({ pathname: '/ladder/[id]', params: { id: l.id } })}>
                <Row style={{ justifyContent: 'space-between' }}>
                  <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{l.name}</Text>
                  <Text style={{ color: t.accent, fontWeight: '800' }}>{code}</Text>
                </Row>
                <Text style={{ color: t.muted, fontSize: 14 }}>{lvl?.name}</Text>
                <View style={{ flexDirection: 'row', gap: 3 }}>
                  {l.levels.map((x, i) => (
                    <View key={x.code} style={{ flex: 1, height: 5, borderRadius: 3, backgroundColor: i <= idx ? t.accent : t.chip }} />
                  ))}
                </View>
              </Card>
            );
          })}
        </View>
      ))}
    </Screen>
  );
}
