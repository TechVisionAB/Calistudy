import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { Explain } from '@/components/Explain';
import { HowToToggle } from '@/components/HowTo';
import { ProgressCard } from '@/components/ProgressCard';
import { progressSeries } from '@/lib/progress';
import { Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { LADDER_BY_ID, OTHER_LOWER_LADDERS } from '@/data/ladders';
import { LADDER_SV, LEVEL_SV } from '@/data/sv';
import { useStore } from '@/lib/store';

export default function LadderScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, setLevel } = useStore();
  const t = useTheme();
  const ladder = LADDER_BY_ID[id];
  if (!ladder) return <Screen><P>Okänd stege.</P></Screen>;
  const current = state.levels[ladder.id];

  const history = state.workouts
    .flatMap((w) => w.entries.filter((e) => e.ladder === ladder.id).map((e) => ({ date: w.date, e })))
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 8);

  const series = progressSeries(state.workouts).filter((s) => s.ladder === ladder.id);

  return (
    <Screen>
      <Stack.Screen options={{ title: LADDER_SV[ladder.id] ?? ladder.name }} />
      <View>
        <Label>{ladder.group} · {ladder.kind === 'static' ? 'hållningar' : 'reps'}</Label>
        <H1>{LADDER_SV[ladder.id] ?? ladder.name}</H1>
        <P muted>Tryck på en nivå för att sätta den som din arbetsnivå.</P>
      </View>

      {ladder.levels.map((l) => {
        const on = l.code === current;
        return (
          <Card key={l.code} onPress={() => setLevel(ladder.id, l.code)} style={on ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={{ color: on ? t.accent : t.muted, fontWeight: '800', width: 48 }}>{l.code}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: t.text, fontSize: 15, fontWeight: on ? '700' : '500' }}>{LEVEL_SV[l.code] ?? l.name}</Text>
                {LEVEL_SV[l.code] && <Text style={{ color: t.muted, fontSize: 13 }}>{l.name}</Text>}
                <Row style={{ flexWrap: 'nowrap' }}>
                  <Text style={{ color: t.muted, fontSize: 13, flex: 1 }}>Gå vidare vid: {l.advance}</Text>
                  <Explain text={`${l.code}: ${l.name}. Gå vidare vid: ${l.advance}`} context={`Nivåstege ${ladder.name}, nivå ${l.code}`} size={20} />
                </Row>
              </View>
            </View>
            {on && <Chip text="Din nivå" tone="accent" />}
            <HowToToggle mediaKey={l.code} />
          </Card>
        );
      })}

      <Card>
        <P muted style={{ fontSize: 13 }}>
          Arbetsnivå = den svåraste varianten du klarar för minst botten av rep-intervallet med full ROM och angivet tempo. För hållningar: den svåraste du håller ≥6 s med rätt form.
        </P>
      </Card>

      {ladder.notes.length > 0 && (
        <Card>
          <H2>Teknik & säkerhet</H2>
          {ladder.notes.map((n) => (
            <Text key={n.label} style={{ color: t.text, fontSize: 14, lineHeight: 20 }}>
              <Text style={{ fontWeight: '700' }}>{n.label}: </Text>
              {n.text}
            </Text>
          ))}
        </Card>
      )}

      {ladder.group === 'Ben' && (
        <Card>
          <H2>Andra benstegar</H2>
          {OTHER_LOWER_LADDERS.map((o) => (
            <Text key={o.pattern} style={{ color: t.text, fontSize: 14, lineHeight: 20 }}>
              <Text style={{ fontWeight: '700' }}>{o.pattern}: </Text>
              {o.ladder} — {o.advance}
            </Text>
          ))}
        </Card>
      )}

      {series.map((s) => (
        <View key={s.key} style={{ gap: 8 }}>
          <H2>Framsteg</H2>
          <ProgressCard series={s} showTitle={false} />
        </View>
      ))}

      {history.length > 0 && (
        <Card>
          <H2>Senaste loggar</H2>
          {history.map(({ date, e }, i) => (
            <Text key={i} style={{ color: t.text, fontSize: 14 }}>
              {date.slice(0, 10)} · {e.level} · {e.sets.map((s) => (s.value === null ? '–' : s.value)).join(' / ')} {e.unit}
            </Text>
          ))}
        </Card>
      )}
    </Screen>
  );
}
