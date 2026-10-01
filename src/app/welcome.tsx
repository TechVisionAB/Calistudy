import { router, Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button, styles, Theme, useTheme } from '@/components/ui';
import { mondayOf, shiftDate } from '@/data/program';
import { Equip, EQUIPMENT } from '@/data/sv';
import { estimateLevels, EXPERIENCES } from '@/lib/onboarding';
import { startStarter } from '@/lib/starter';
import { usePrice } from '@/lib/units';
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

  const price = usePrice();

  type Start = 'starter' | 'train' | 'test';
  const finish = (how: Start) => {
    update((s) => {
      const next: typeof s = {
        ...s,
        profile: { experience: exp ?? 'some', equipment: equip },
        // Existing users keep their tested/progressed levels; new users get an estimate.
        levels: alreadyStarted ? s.levels : { ...s.levels, ...estimateLevels(exp ?? 'some', equip) },
      };
      if (alreadyStarted) return next;
      if (how === 'starter') return startStarter({ ...next, startMonday: mondayOf() });
      return { ...next, track: 'full', startMonday: shiftDate(mondayOf(), how === 'test' ? 0 : -7) };
    });
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
              {alreadyStarted ? 'New version!' : 'Calistudy'}
            </Text>
            <Text style={{ color: t.muted, fontSize: 17, textAlign: 'center', lineHeight: 24 }}>
              {alreadyStarted
                ? 'Two quick questions so the app can fit workouts to your equipment. Your levels and logs are kept.'
                : 'Get stronger with bodyweight training at home. No gym, no guesswork – the app tells you exactly what to do today and when you’re ready for the next step.'}
            </Text>
            <Button title="Get started" onPress={() => setStep(1)} />
          </>
        )}

        {step === 1 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>How experienced are you?</Text>
            {EXPERIENCES.map((e) => (
              <Option t={t} key={e.id} on={exp === e.id} title={e.title} desc={e.desc} onPress={() => setExp(e.id)} />
            ))}
            <Button title="Next" disabled={!exp} onPress={() => setStep(2)} />
          </>
        )}

        {step === 2 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>What do you have at home?</Text>
            <Text style={{ color: t.muted, fontSize: 15 }}>Pick everything that applies. If something is missing, the app swaps the exercise.</Text>
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
              <Text style={{ color: t.accent, fontSize: 14 }}>Tip: a doorway pull-up bar (around {price(30)}) is the most important buy – it unlocks all the pull exercises.</Text>
            )}
            <Button title={alreadyStarted ? 'Done' : 'Next'} onPress={() => (alreadyStarted ? finish('train') : setStep(3))} />
          </>
        )}

        {step === 3 && (
          <>
            {dots}
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>How do you want to start?</Text>
            {exp === 'new' ? (
              <>
                <Option t={t} on title="Starter plan (recommended)" desc="3 short full-body workouts a week, about 30 min. Easy basics first – new exercises unlock as you get stronger." onPress={() => finish('starter')} />
                <Option t={t} on={false} title="Full program" desc="4 workouts a week, 55–85 min, with skills like handstand and planche. Made for people who already train." onPress={() => finish('train')} />
              </>
            ) : (
              <>
                <Option t={t} on title="Start training right away" desc="The full program: 4 workouts a week. Starting levels are estimated from your answers and adjust after a few workouts." onPress={() => finish('train')} />
                <Option t={t} on={false} title="Test me first" desc="Three short tests (about 1 h total) give exact levels. Best if you want to get the most out of it." onPress={() => finish('test')} />
                <Option t={t} on={false} title="Easier start: Starter plan" desc="3 short full-body workouts a week, about 30 min. Good after a long break." onPress={() => finish('starter')} />
              </>
            )}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
