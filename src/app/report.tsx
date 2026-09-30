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
      const res = await Share.share({ message, title: 'Calistudy testrapport' });
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
      <Stack.Screen options={{ title: 'Testrapport' }} />
      <P>Tack för att du testar! Skicka rapporten till den som bjöd in dig, gärna varje vecka. Den innehåller bara siffror om din träning och dina svar här — inget namn.</P>

      <Card>
        <H2>Din träning hittills</H2>
        {stats.length === 0 && <P muted>Inget program startat ännu.</P>}
        {stats.map((s, i) => (
          <Row key={s.week} style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.muted, fontSize: 14 }}>
              Vecka {i} ({s.week})
            </Text>
            <Text style={{ color: t.text, fontSize: 14, fontWeight: '700' }}>
              {s.workouts} pass · {s.microDays} mikro
            </Text>
          </Row>
        ))}
      </Card>

      <Card>
        <Label>Hur gillar du appen? (1–5)</Label>
        <Row>
          {[1, 2, 3, 4, 5].map((n) => (
            <Chip key={n} text={` ${n} `} tone={rating === n ? 'accent' : 'neutral'} onPress={() => setRating(n)} />
          ))}
        </Row>
        <View style={{ gap: 6 }}>
          <Label>Det bästa</Label>
          {input(best, setBest, 'Vad fick dig att öppna appen igen?')}
          <Label>Det sämsta / det som saknas</Label>
          {input(worst, setWorst, 'Vad var krångligt, tråkigt eller för mycket text?')}
        </View>
      </Card>

      <Button title={shared ? 'Skickad ✓ – skicka igen' : 'Skicka testrapport'} onPress={share} />
    </Screen>
  );
}
