import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HowToToggle } from '@/components/HowTo';
import { Bullets, Button, Card, Chip, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { WeekRing } from '@/components/WeekRing';
import { MICRO_PRACTICE, READINESS } from '@/data/guide';
import { blockOf, isoDate, mondayOf, shiftDate, weekdayIndex } from '@/data/program';
import { SessionId, SESSIONS } from '@/data/sessions';
import { SESSION_SV, TEST_SV } from '@/data/sv';
import { weekStreak } from '@/lib/motivation';
import { HARD, nextUp, weekProgress } from '@/lib/next';
import { plateaus } from '@/lib/progression';
import { useStore } from '@/lib/store';

export default function Today() {
  const { state, update, ready } = useStore();
  const t = useTheme();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [showReadiness, setShowReadiness] = useState(false);
  const [pickOther, setPickOther] = useState(false);

  if (!ready) return <Screen><P muted>Laddar…</P></Screen>;
  if (!state.profile) return <Redirect href="/welcome" />;

  const next = nextUp(state);
  const progress = weekProgress(state);
  const streak = weekStreak(state);
  const week = progress.week;
  const today = isoDate(new Date());
  const wd = weekdayIndex();
  const microDone = state.micro[today] ?? [];
  const flagCount = Object.values(flags).filter(Boolean).length;
  const stuck = plateaus(state.workouts);
  const microBlocks = MICRO_PRACTICE.blocks.filter((b) => b.id !== 'mobility' || state.mobilityFails.length > 0);

  const startWeek1 = () => update((s) => ({ ...s, startMonday: shiftDate(mondayOf(), -7) }));
  const toggleMicro = (id: string) =>
    update((s) => {
      const cur = s.micro[today] ?? [];
      return { ...s, micro: { ...s.micro, [today]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } };
    });
  const start = (id: SessionId) => {
    const hasSets = SESSIONS[id].exercises.length > 0;
    router.push({ pathname: hasSets ? '/workout/[id]' : '/session/[id]', params: { id, week: String(week), flags: String(flagCount) } });
  };
  const preview = (id: SessionId) => router.push({ pathname: '/session/[id]', params: { id, week: String(week), flags: String(flagCount) } });

  const hero = () => {
    switch (next.kind) {
      case 'session': {
        const sv = SESSION_SV[next.session];
        return (
          <Card style={{ borderColor: t.accent, borderWidth: 2 }}>
            <Label>Dagens pass</Label>
            <Text style={{ color: t.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 }}>{sv.title}</Text>
            <P muted>
              {sv.short} · {SESSIONS[next.session].duration}
            </P>
            {next.deload && <Chip text="Lätt vecka: halva mängden" tone="accent" />}
            {next.note && <P>{next.note}</P>}
            {flagCount >= 3 && <P style={{ color: t.warn }}>{READINESS.actions[3]}</P>}
            <Button title="Starta passet" onPress={() => start(next.session)} />
            <Row style={{ justifyContent: 'space-between' }}>
              <Pressable onPress={() => preview(next.session)} hitSlop={8}>
                <Text style={{ color: t.accent, fontWeight: '700' }}>Visa övningarna</Text>
              </Pressable>
              <Pressable onPress={() => setShowReadiness((x) => !x)} hitSlop={8}>
                <Text style={{ color: t.muted, fontWeight: '600' }}>{flagCount > 0 ? `Dagsform: ${flagCount} ⚠︎` : 'Känns kroppen sliten?'}</Text>
              </Pressable>
            </Row>
            {showReadiness && (
              <View style={{ gap: 8, marginTop: 4 }}>
                {READINESS.questions.map((q) => (
                  <Pressable key={q.id} onPress={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                    <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: flags[q.id] ? t.warn : t.border, backgroundColor: flags[q.id] ? t.warn : 'transparent' }} />
                    <Text style={{ color: t.text, flex: 1, fontSize: 15 }}>{q.text}</Text>
                  </Pressable>
                ))}
                <P muted>{['Kör som vanligt.', 'Kör som vanligt, men inga maxset.', 'Passet blir lite kortare och lättare idag.', 'Vila idag: mikroträning + promenad.'][Math.min(flagCount, 3)]}</P>
              </View>
            )}
          </Card>
        );
      }
      case 'test':
        return (
          <Card style={{ borderColor: t.accent, borderWidth: 2 }}>
            <Label>{week === 0 ? 'Startvecka' : 'Dags att testa'}</Label>
            <Text style={{ color: t.text, fontSize: 28, fontWeight: '800' }}>{TEST_SV[next.battery]}</Text>
            <P muted>Ca 20 min. Appen guidar dig genom en övning i taget – du trycker bara på hur många du klarade.</P>
            <Button title="Starta testet" onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: next.battery } })} />
            {week === 0 && (
              <Pressable onPress={startWeek1} hitSlop={8}>
                <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>Hoppa över testerna och börja träna</Text>
              </Pressable>
            )}
          </Card>
        );
      case 'startWeek1':
        return (
          <Card style={{ borderColor: t.good, borderWidth: 2 }}>
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Testerna klara! 🎉</Text>
            <P muted>Dina nivåer är satta. Nu börjar programmet på riktigt.</P>
            <Button title="Börja vecka 1" onPress={startWeek1} />
          </Card>
        );
      case 'rest':
        return (
          <Card>
            <Label>Idag</Label>
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Vila & mikroträning</Text>
            <P>{next.note}</P>
            {next.then && (
              <P muted>
                Nästa: {SESSION_SV[next.then]?.title ?? TEST_SV[next.then]}
              </P>
            )}
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Screen>
      <Label>
        Vecka {week} · {blockOf(week)}
      </Label>

      {hero()}

      {week > 0 && (
        <Pressable onPress={() => setPickOther((x) => !x)} hitSlop={6}>
          <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>{pickOther ? 'Stäng' : 'Vill du köra ett annat pass?'}</Text>
        </Pressable>
      )}
      {pickOther && (
        <Card>
          {[...HARD, 'skill' as SessionId].map((id) => (
            <Pressable key={id} onPress={() => preview(id)} style={{ paddingVertical: 6 }}>
              <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>
                {progress.done.includes(id) ? '✓ ' : ''}
                {SESSION_SV[id].title} <Text style={{ color: t.muted, fontWeight: '400' }}>· {SESSION_SV[id].short}</Text>
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      {week > 0 && (
        <Card>
          <H2>Den här veckan</H2>
          <WeekRing order={week === 12 ? ['upperA', 'lowerA'] : HARD} done={progress.done} streak={streak} />
        </Card>
      )}

      <Card>
        <Row style={{ justifyContent: 'space-between' }}>
          <H2>Mikroträning</H2>
          <Chip text={`${microDone.length}/${microBlocks.length}`} tone={microDone.length >= microBlocks.length ? 'good' : 'neutral'} />
        </Row>
        <P muted style={{ fontSize: 14 }}>
          {wd === 6 ? 'Söndag: valfritt, 5 min räcker.' : '10 min, ska kännas lätt. Bocka av det du gjort.'}
        </P>
        {microBlocks.map((b) => {
          const on = microDone.includes(b.id);
          return (
            <Pressable key={b.id} onPress={() => toggleMicro(b.id)} style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ width: 24, height: 24, marginTop: 1, borderRadius: 12, borderWidth: 2, borderColor: on ? t.good : t.border, backgroundColor: on ? t.good : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
                {on && <Text style={{ color: '#fff', fontSize: 13, fontWeight: '800' }}>✓</Text>}
              </View>
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>
                  {b.title} <Text style={{ color: t.muted, fontWeight: '400' }}>· {b.duration}</Text>
                </Text>
                <HowToToggle mediaKey={b.id === 'hs' ? state.levels.HS : b.demo} label="Visa hur" />
              </View>
            </Pressable>
          );
        })}
      </Card>

      {!state.reminders.morning.enabled && !state.reminders.evening.enabled && (
        <Card onPress={() => router.push('/reminders')}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>⏰ Vill du få påminnelser?</Text>
            <Text style={{ color: t.accent, fontWeight: '700' }}>Slå på ›</Text>
          </Row>
        </Card>
      )}

      {stuck.length > 0 && (
        <Card onPress={() => router.push({ pathname: '/guide/[id]', params: { id: 'plateau' } })}>
          <H2>Står du still?</H2>
          <P muted>Ingen ökning på 3 pass i rad:</P>
          <Bullets items={stuck.map((s) => `${s.name}${s.level ? ` (${s.level})` : ''}`)} />
          <P style={{ color: t.accent, fontWeight: '700' }}>Så bryter du platån →</P>
        </Card>
      )}
    </Screen>
  );
}
