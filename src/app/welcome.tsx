import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, styles, Theme, useTheme } from '@/components/ui';
import { mondayOf, shiftDate } from '@/data/program';
import { Equip, EQUIPMENT } from '@/data/sv';
import { estimateLevels, EXPERIENCES } from '@/lib/onboarding';
import { Experience, useStore } from '@/lib/store';

function Option({ t, on, title, desc, onPress }: { t: Theme; on: boolean; title: string; desc?: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{ borderWidth: 2, borderColor: on ? t.accent : t.border, backgroundColor: on ? t.accentSoft : t.card, borderRadius: 14, padding: 14, gap: 2 }}
    >
      <Text style={{ color: t.text, fontSize: 17, fontWeight: '700' }}>{title}</Text>
      {desc && <Text style={{ color: t.muted, fontSize: 14 }}>{desc}</Text>}
    </Pressable>
  );
}

export default function Welcome() {
  const { state, update } = useStore();
  const t = useTheme();
  const alreadyStarted = !!state.startMonday;
  const [step, setStep] = useState(0);
  const [exp, setExp] = useState<Experience | null>(state.profile?.experience ?? null);
  const [equip, setEquip] = useState<Equip[]>(state.profile?.equipment ?? []);

  const finish = (withTest: boolean) => {
    update((s) => ({
      ...s,
      profile: { experience: exp ?? 'some', equipment: equip },
      // Existing users keep their tested/progressed levels; new users get an estimate.
      levels: alreadyStarted ? s.levels : { ...s.levels, ...estimateLevels(exp ?? 'some', equip) },
      startMonday: alreadyStarted ? s.startMonday : shiftDate(mondayOf(), withTest ? 0 : -7),
    }));
    router.replace('/');
  };

  const dots = (
    <View style={{ flexDirection: 'row', gap: 6, justifyContent: 'center' }}>
      {[0, 1, 2, 3].slice(0, alreadyStarted ? 3 : 4).map((i) => (
        <View key={i} style={{ width: i === step ? 22 : 8, height: 8, borderRadius: 4, backgroundColor: i <= step ? t.accent : t.grid }} />
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }}>
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={[styles.screen, { flexGrow: 1, justifyContent: 'center', gap: 16 }]}>
        {step === 0 && (
          <>
            <Text style={{ fontSize: 56, textAlign: 'center' }}>💪</Text>
            <Text style={{ color: t.text, fontSize: 32, fontWeight: '800', textAlign: 'center', letterSpacing: -0.5 }}>
              {alreadyStarted ? 'Ny version!' : 'Calistudy'}
            </Text>
            <Text style={{ color: t.muted, fontSize: 17, textAlign: 'center', lineHeight: 24 }}>
              {alreadyStarted
                ? 'Två snabba frågor så anpassar appen passen efter din utrustning. Dina nivåer och loggar finns kvar.'
                : 'Bli starkare med kroppsvikt hemma. 4 pass i veckan, appen säger vad du ska göra och när det är dags att gå vidare.'}
            </Text>
            <Button title="Kom igång" onPress={() => setStep(1)} />
          </>
        )}

        {step === 1 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Hur van är du?</Text>
            {EXPERIENCES.map((e) => (
              <Option t={t} key={e.id} on={exp === e.id} title={e.title} desc={e.desc} onPress={() => setExp(e.id)} />
            ))}
            <Button title="Nästa" disabled={!exp} onPress={() => setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Vad har du hemma?</Text>
            <Text style={{ color: t.muted, fontSize: 15 }}>Välj allt som stämmer. Saknas något byter appen ut övningen.</Text>
            {EQUIPMENT.map((e) => (
              <Option t={t}
                key={e.id}
                on={equip.includes(e.id)}
                title={`${equip.includes(e.id) ? '✓ ' : ''}${e.label}`}
                desc={e.hint}
                onPress={() => setEquip((q) => (q.includes(e.id) ? q.filter((x) => x !== e.id) : [...q, e.id]))}
              />
            ))}
            {!equip.includes('bar') && !equip.includes('rings') && (
              <Text style={{ color: t.accent, fontSize: 14 }}>Tips: en dörrstång (ca 300 kr) är det viktigaste köpet – den låser upp alla dragövningar.</Text>
            )}
            <Button title={alreadyStarted ? 'Klar' : 'Nästa'} onPress={() => (alreadyStarted ? finish(false) : setStep(3))} />
          </>
        )}

        {step === 3 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Hur vill du börja?</Text>
            <Option t={t} on title="Börja träna direkt" desc="Appen gissar dina startnivåer utifrån svaren. De justeras automatiskt efter några pass." onPress={() => finish(false)} />
            <Option t={t} on={false} title="Testa mig först" desc="Tre korta tester (ca 1 h totalt) ger exakta nivåer. Passar dig som vill få ut maximalt." onPress={() => finish(true)} />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
