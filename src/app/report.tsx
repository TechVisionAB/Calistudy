import { Stack } from 'expo-router';
import { useState } from 'react';
import { Share, Text, TextInput, View } from 'react-native';

import { Button, Card, Chip, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { buildReport, weeklyStats } from '@/lib/report';
import { useStore } from '@/lib/store';

export default function ReportScreen() {
  const { state } = useStore();
  const t = useTheme();
  const [rating, setRating] = useState<number | null>(null);
  const [best, setBest] = useState('');
  const [worst, setWorst] = useState('');
  const [shared, setShared] = useState(false);
  const stats = weeklyStats(state);

  const share = async () => {
    const message = buildReport(state, { rating, best, worst });
    try {
      const res = await Share.share({ message, title: 'Calistudy test report' });
      if (res.action === Share.sharedAction) setShared(true);
    } catch {
      // The share sheet can be unavailable (e.g. some browsers); nothing to recover.
    }
  };

  const input = (value: string, set: (v: string) => void, placeholder: string) => (
    <TextInput
      value={value}
      onChangeText={set}
      placeholder={placeholder}
      placeholderTextColor={t.muted}
      multiline
      style={{ color: t.text, fontSize: 15, minHeight: 44, borderWidth: 1, borderColor: t.border, borderRadius: 10, padding: 10 }}
    />
  );

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Test report' }} />
      <P>Thanks for testing! Send the report to whoever invited you, ideally every week. It only contains numbers about your training and your answers here — no name.</P>

      <Card>
        <H2>Your training so far</H2>
        {stats.length === 0 && <P muted>No program started yet.</P>}
        {stats.map((s, i) => (
          <Row key={s.week} style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.muted, fontSize: 14 }}>
              Week {i} ({s.week})
            </Text>
            <Text style={{ color: t.text, fontSize: 14, fontWeight: '700' }}>
              {s.workouts} workouts · {s.microDays} micro
            </Text>
          </Row>
        ))}
      </Card>

      <Card>
        <Label>How do you like the app? (1–5)</Label>
        <Row>
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} text={` ${n} `} tone={rating === n ? 'accent' : 'neutral'} onPress={() => setRating(n)} />
          ))}
        </Row>
        <View style={{ gap: 6 }}>
          <Label>The best part</Label>
          {input(best, setBest, 'What made you open the app again?')}
          <Label>The worst part / what’s missing</Label>
          {input(worst, setWorst, 'What was confusing, boring or too much text?')}
        </View>
      </Card>

      <Button title={shared ? 'Sent ✓ – send again' : 'Send test report'} onPress={share} />
    </Screen>
  );
}
