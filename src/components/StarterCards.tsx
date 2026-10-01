import { router } from 'expo-router';
import { Platform, Text, View, Alert } from 'react-native';

import { graduation, nextUnlock, startFull } from '@/lib/starter';
import { State, useStore } from '@/lib/store';
import { Button, Card, H2, P, useTheme } from './ui';

function confirm(title: string, msg: string, onYes: () => void) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title}\n\n${msg}`)) onYes();
    return;
  }
  Alert.alert(title, msg, [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Yes, switch', onPress: onYes },
  ]);
}

export function goFull(update: (fn: (s: State) => State) => void, withTests: boolean) {
  confirm(
    'Move to the full program?',
    withTests
      ? 'This week becomes the test week (3 short tests), then week 1 starts. Your levels and history are kept.'
      : 'Week 1 starts now: 4 workouts a week, 55–85 min each. Your levels and history are kept.',
    () => {
      update((s) => startFull(s, withTests));
      router.replace('/');
    },
  );
}

/** Checklist towards the full program; becomes a celebration when everything is ticked. */
export function GraduationCard({ compact = false }: { compact?: boolean }) {
  const { state, update } = useStore();
  const t = useTheme();
  const g = graduation(state);
  const done = g.checks.filter((c) => c.ok).length;

  if (compact && !g.ready) {
    return (
      <Card onPress={() => router.push('/program')}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>
          🎓 Next step: the full program <Text style={{ color: t.muted, fontWeight: '400' }}>· {done}/{g.checks.length} done</Text>
        </Text>
        <View style={{ height: 6, borderRadius: 3, backgroundColor: t.grid, overflow: 'hidden' }}>
          <View style={{ width: `${(done / g.checks.length) * 100}%`, height: 6, backgroundColor: t.good }} />
        </View>
      </Card>
    );
  }

  return (
    <Card style={g.ready ? { borderColor: t.good, borderWidth: 2 } : undefined}>
      <H2>{g.ready ? '🎓 You’re ready for the full program!' : '🎓 Road to the full program'}</H2>
      {g.ready ? (
        <P muted>You’ve built the base. The full program adds handstands, levers and more – 4 longer workouts a week.</P>
      ) : (
        <P muted>Tick these off and the app suggests the switch. You can also stay in Starter as long as you like.</P>
      )}
      {g.checks.map((c) => (
        <Text key={c.label} style={{ color: c.ok ? t.text : t.muted, fontSize: 15 }}>
          {c.ok ? '✅' : '○'} {c.label}
        </Text>
      ))}
      {g.ready && (
        <>
          <Button title="Start the full program" onPress={() => goFull(update, false)} />
          <Button title="Test me first (1 week)" variant="secondary" onPress={() => goFull(update, true)} />
        </>
      )}
    </Card>
  );
}

/** "Unlocks in week 3: Handstand prep, Planche lean". */
export function UnlockTeaser({ week }: { week: number }) {
  const t = useTheme();
  const n = nextUnlock(week);
  if (!n) return null;
  return (
    <Text style={{ color: t.muted, fontSize: 14 }}>
      🔒 Unlocks in week {n.week}: {n.names.join(', ')}
    </Text>
  );
}
