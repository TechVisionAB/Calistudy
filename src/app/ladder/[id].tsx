import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

import { HowToToggle } from '@/components/HowTo';
import { Card, Chip, H1, H2, Label, P, Screen, useTheme } from '@/components/ui';
import { LADDER_BY_ID, OTHER_LOWER_LADDERS } from '@/data/ladders';
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

  return (
    <Screen>
      <Stack.Screen options={{ title: ladder.name }} />
      <View>
        <Label>{ladder.group} · {ladder.kind === 'static' ? 'hållningar' : 'reps'}</Label>
        <H1>{ladder.name}</H1>
        <P muted>Tryck på en nivå för att sätta den som din arbetsnivå.</P>
      </View>

      {ladder.levels.map((l) => {
        const on = l.code === current;
        return (
          <Card key={l.code} onPress={() => setLevel(ladder.id, l.code)} style={on ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={{ color: on ? t.accent : t.muted, fontWeight: '800', width: 48 }}>{l.code}</Text>
              <View style={{ flex: 1, gap: 4 }}>
                <Text style={{ color: t.text, fontSize: 15, fontWeight: on ? '700' : '500' }}>{l.name}</Text>
                <Text style={{ color: t.muted, fontSize: 13 }}>Gå vidare vid: {l.advance}</Text>
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
