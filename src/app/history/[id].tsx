import { router, Stack, useLocalSearchParams } from 'expo-router';
import { Alert, Platform, Text } from 'react-native';

import { Button, Card, H1, Label, P, Screen, useTheme } from '@/components/ui';
import { SESSIONS } from '@/data/sessions';
import { unitLabel } from '@/lib/plan';
import { useStore } from '@/lib/store';

export default function HistoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { state, update } = useStore();
  const t = useTheme();
  const w = state.workouts.find((x) => x.id === id);
  if (!w) return <Screen><P>Passet finns inte längre.</P></Screen>;

  const remove = () => {
    const doIt = () => {
      update((s) => ({ ...s, workouts: s.workouts.filter((x) => x.id !== id) }));
      router.back();
    };
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.('Ta bort passet?')) doIt();
    } else {
      Alert.alert('Ta bort passet?', 'Det går inte att ångra.', [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Ta bort', style: 'destructive', onPress: doIt },
      ]);
    }
  };

  return (
    <Screen>
      <Stack.Screen options={{ title: SESSIONS[w.session]?.title ?? 'Pass' }} />
      <Label>
        {new Date(w.date).toLocaleString('sv-SE')} · Vecka {w.week}
        {w.deload ? ' · deload' : ''}
      </Label>
      <H1>{SESSIONS[w.session]?.title}</H1>
      {w.flags > 0 && <P muted>Dagsformsflaggor: {w.flags}</P>}
      {w.entries.length === 0 && <P muted>Genomfört (inga set loggade).</P>}
      {w.entries.map((e) => (
        <Card key={e.slot}>
          <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>
            {e.slot} · {e.name}
          </Text>
          {e.level && <Text style={{ color: t.accent, fontWeight: '700' }}>{e.level}</Text>}
          <Text style={{ color: t.text }}>
            {e.sets.map((s) => (s.value === null ? '–' : s.value)).join(' / ')} {unitLabel(e.unit)}
            {e.sets.some((s) => s.rir !== null) ? `  ·  RIR ${e.sets.map((s) => s.rir ?? '–').join('/')}` : ''}
          </Text>
          {(e.sets[0]?.pain ?? 0) > 0 && <Text style={{ color: t.warn }}>Smärta {e.sets[0].pain}/10</Text>}
        </Card>
      ))}
      {w.notes && (
        <Card>
          <Label>Anteckningar</Label>
          <P>{w.notes}</P>
        </Card>
      )}
      <Button title="Ta bort pass" variant="danger" onPress={remove} />
    </Screen>
  );
}
