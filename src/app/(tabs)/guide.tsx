import { router } from 'expo-router';
import { Alert, Platform, Text } from 'react-native';

import { Button, Card, P, Screen, useTheme } from '@/components/ui';
import { GUIDE } from '@/data/guide';
import { useStore } from '@/lib/store';

export default function Guide() {
  const t = useTheme();
  const { reset } = useStore();

  const confirmReset = () => {
    const msg = 'All logs, test results and levels will be deleted.';
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Reset the app? ${msg}`)) reset();
    } else {
      Alert.alert('Reset the app?', msg, [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Reset', style: 'destructive', onPress: reset },
      ]);
    }
  };

  return (
    <Screen>
      <Card onPress={() => router.push('/demos')} style={{ borderColor: t.accent, borderWidth: 2 }}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>▶ Exercise demos</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>Animated walkthroughs of the basic exercises. Videos are available for every level and exercise.</Text>
      </Card>
      <Card onPress={() => router.push('/welcome')}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>🏠 My equipment</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>Change what you have at home – exercises are swapped automatically.</Text>
      </Card>
      <Card onPress={() => router.push('/reminders')}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>⏰ Reminders</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>Notifications for today’s workout and micro-practice.</Text>
      </Card>
      {GUIDE.map((s) => (
        <Card key={s.id} onPress={() => router.push({ pathname: '/guide/[id]', params: { id: s.id } })}>
          <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{s.title}</Text>
          <Text style={{ color: t.muted, fontSize: 14 }}>{s.summary}</Text>
        </Card>
      ))}
      <P muted style={{ fontSize: 13, marginTop: 8 }}>
        Based on “The Complete Calisthenics System for an Intermediate Home Athlete (2026 Edition)”. Much of the content is based on indirect evidence and
        coaching consensus. With pain above 5/10, sharp pain or swelling — see a physiotherapist or doctor.
      </P>
      <Button title="Reset all data" variant="danger" onPress={confirmReset} />
    </Screen>
  );
}
