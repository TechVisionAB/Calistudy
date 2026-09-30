import { router } from 'expo-router';
import { Alert, Platform, Text } from 'react-native';

import { Button, Card, P, Screen, useTheme } from '@/components/ui';
import { GUIDE } from '@/data/guide';
import { useStore } from '@/lib/store';

export default function Guide() {
  const t = useTheme();
  const { reset } = useStore();

  const confirmReset = () => {
    const msg = 'All loggning, testresultat och nivåer raderas.';
    if (Platform.OS === 'web') {
      if (globalThis.confirm?.(`Nollställ appen? ${msg}`)) reset();
    } else {
      Alert.alert('Nollställ appen?', msg, [
        { text: 'Avbryt', style: 'cancel' },
        { text: 'Nollställ', style: 'destructive', onPress: reset },
      ]);
    }
  };

  return (
    <Screen>
      <Card onPress={() => router.push('/demos')} style={{ borderColor: t.accent, borderWidth: 2 }}>
        <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>▶ Övningsdemos</Text>
        <Text style={{ color: t.muted, fontSize: 14 }}>Animerade genomgångar av grundövningarna. Videor finns på varje nivå och övning.</Text>
      </Card>
      {GUIDE.map((s) => (
        <Card key={s.id} onPress={() => router.push({ pathname: '/guide/[id]', params: { id: s.id } })}>
          <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{s.title}</Text>
          <Text style={{ color: t.muted, fontSize: 14 }}>{s.summary}</Text>
        </Card>
      ))}
      <P muted style={{ fontSize: 13, marginTop: 8 }}>
        Baserat på “The Complete Calisthenics System for an Intermediate Home Athlete (2026 Edition)”. Mycket av innehållet bygger på indirekt evidens och
        coachkonsensus. Vid smärta över 5/10, skarp smärta eller svullnad — kontakta fysioterapeut eller läkare.
      </P>
      <Button title="Nollställ all data" variant="danger" onPress={confirmReset} />
    </Screen>
  );
}
