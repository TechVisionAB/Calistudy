import { Redirect, router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { HowToToggle } from '@/components/HowTo';
import { GraduationCard, UnlockTeaser } from '@/components/StarterCards';
import { TomorrowCard } from '@/components/TomorrowCard';
import { WinsCard } from '@/components/WinsCard';
import { Bullets, Button, Card, Chip, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { WeekRing } from '@/components/WeekRing';
import { MICRO_PRACTICE, READINESS } from '@/data/guide';
import { blockOf, isoDate, mondayOf, shiftDate, weekdayIndex } from '@/data/program';
import { SessionId, SESSIONS } from '@/data/sessions';
import { SESSION_SV, TEST_SV } from '@/data/sv';
import { weekStreak } from '@/lib/motivation';
import { HARD, nextUp, weekProgress } from '@/lib/next';
import { plateaus } from '@/lib/progression';
import { graduation, isStarter, STARTER, unlocksAt } from '@/lib/starter';
import { useStore } from '@/lib/store';

export default function Today() {
  const { state, update, ready } = useStore();
  const t = useTheme();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [showReadiness, setShowReadiness] = useState(false);
  const [pickOther, setPickOther] = useState(false);

  if (!ready) return <Screen><P muted>Loading…</P></Screen>;
  if (!state.profile) return <Redirect href="/welcome" />;

  const next = nextUp(state);
  const progress = weekProgress(state);
  const streak = weekStreak(state);
  const starter = isStarter(state);
  // In Starter mode `week` is the starter week (1, 2, …); otherwise the program week.
  const week = progress.week;
  const newThisWeek = starter ? unlocksAt(week) : [];
  const grad = starter ? graduation(state) : null;
  // Starter ring: what's done this week, then the alternation continues (A, B, A …).
  const ringOrder: SessionId[] = starter
    ? (() => {
        const order = [...progress.done];
        let nextId: SessionId = next.kind === 'session' ? next.session : next.kind === 'rest' && next.then && STARTER.includes(next.then as SessionId) ? (next.then as SessionId) : 'starterA';
        while (order.length < progress.goal) {
          order.push(nextId);
          nextId = nextId === 'starterA' ? 'starterB' : 'starterA';
        }
        return order;
      })()
    : week === 12
      ? ['upperA', 'lowerA']
      : HARD;
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
    // Starter workouts are planned by starter week (unlocks); program workouts by program week.
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
            <Label>Today’s workout</Label>
            <Text style={{ color: t.text, fontSize: 30, fontWeight: '800', letterSpacing: -0.5 }}>{sv.title}</Text>
            <P muted>
              {sv.short} · {SESSIONS[next.session].duration}
            </P>
            {next.deload && <Chip text="Easy week: half the volume" tone="accent" />}
            {newThisWeek.some((n) => n.session === next.session) && (
              <Chip text={`🔓 New this week: ${newThisWeek.filter((n) => n.session === next.session).map((n) => n.name).join(', ')}`} tone="good" />
            )}
            {next.note && <P>{next.note}</P>}
            {flagCount >= 3 && <P style={{ color: t.warn }}>{READINESS.actions[3]}</P>}
            <Button title="Start workout" onPress={() => start(next.session)} />
            <Row style={{ justifyContent: 'space-between' }}>
              <Pressable onPress={() => preview(next.session)} hitSlop={8}>
                <Text style={{ color: t.accent, fontWeight: '700' }}>Show exercises</Text>
              </Pressable>
              <Pressable onPress={() => setShowReadiness((x) => !x)} hitSlop={8}>
                <Text style={{ color: t.muted, fontWeight: '600' }}>{flagCount > 0 ? `Readiness: ${flagCount} ⚠︎` : 'Feeling worn out?'}</Text>
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
                <P muted>{['Train as usual.', 'Train as usual, but no max sets.', "Today's workout will be a bit shorter and easier.", 'Rest today: micro-practice + a walk.'][Math.min(flagCount, 3)]}</P>
              </View>
            )}
          </Card>
        );
      }
      case 'test':
        return (
          <Card style={{ borderColor: t.accent, borderWidth: 2 }}>
            <Label>{week === 0 ? 'Starting week' : 'Time to test'}</Label>
            <Text style={{ color: t.text, fontSize: 28, fontWeight: '800' }}>{TEST_SV[next.battery]}</Text>
            <P muted>About 20 min. The app guides you through one exercise at a time – just tap how many you managed.</P>
            <Button title="Start test" onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: next.battery } })} />
            {week === 0 && (
              <Pressable onPress={startWeek1} hitSlop={8}>
                <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>Skip the tests and start training</Text>
              </Pressable>
            )}
          </Card>
        );
      case 'startWeek1':
        return (
          <Card style={{ borderColor: t.good, borderWidth: 2 }}>
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>Tests done! 🎉</Text>
            <P muted>Your levels are set. Now the program starts for real.</P>
            <Button title="Start week 1" onPress={startWeek1} />
          </Card>
        );
      case 'rest':
        return (
          <Card>
            <Label>Today</Label>
            <Text style={{ color: t.text, fontSize: 26, fontWeight: '800' }}>{starter ? 'Rest day' : 'Rest & micro-practice'}</Text>
            <P>{next.note}</P>
          </Card>
        );
      default:
        return null;
    }
  };

  return (
    <Screen>
      <Label>{starter ? `Starter · week ${week}` : `Week ${week} · ${blockOf(week)}`}</Label>

      {hero()}

      <TomorrowCard />

      {grad?.ready && <GraduationCard />}

      {(starter || week > 0) && (
        <Pressable onPress={() => setPickOther((x) => !x)} hitSlop={6}>
          <Text style={{ color: t.muted, fontWeight: '600', textAlign: 'center' }}>{pickOther ? 'Close' : 'Choose another workout'}</Text>
        </Pressable>
      )}
      {pickOther && (
        <Card>
          {(starter ? STARTER : [...HARD, 'skill' as SessionId]).map((id) => (
            <Pressable key={id} onPress={() => preview(id)} style={{ paddingVertical: 6 }}>
              <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>
                {progress.done.includes(id) ? '✓ ' : ''}
                {SESSION_SV[id].title} <Text style={{ color: t.muted, fontWeight: '400' }}>· {SESSION_SV[id].short}</Text>
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      {(starter || week > 0) && (
        <Card>
          <H2>This week</H2>
          <WeekRing order={ringOrder} done={progress.done} streak={streak} />
          {starter && <UnlockTeaser week={week} />}
        </Card>
      )}

      <WinsCard />

      {grad && !grad.ready && <GraduationCard compact />}

      {!starter && (
        <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <H2>Micro-practice</H2>
            <Chip text={`${microDone.length}/${microBlocks.length}`} tone={microDone.length >= microBlocks.length ? 'good' : 'neutral'} />
          </Row>
          <P muted style={{ fontSize: 14 }}>
            {wd === 6 ? 'Sunday: optional, 5 min is enough.' : '10 min, should feel easy. Tick off what you did.'}
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
                  <HowToToggle mediaKey={b.id === 'hs' ? state.levels.HS : b.demo} label="How to do it" />
                </View>
              </Pressable>
            );
          })}
        </Card>
      )}

      {!state.reminders.morning.enabled && !state.reminders.evening.enabled && (
        <Card onPress={() => router.push('/reminders')}>
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>⏰ Want reminders?</Text>
            <Text style={{ color: t.accent, fontWeight: '700' }}>Turn on ›</Text>
          </Row>
        </Card>
      )}

      {stuck.length > 0 && (
        <Card onPress={() => router.push({ pathname: '/guide/[id]', params: { id: 'plateau' } })}>
          <H2>Stuck?</H2>
          <P muted>No progress in 3 workouts in a row:</P>
          <Bullets items={stuck.map((s) => `${s.name}${s.level ? ` (${s.level})` : ''}`)} />
          <P style={{ color: t.accent, fontWeight: '700' }}>How to break the plateau →</P>
        </Card>
      )}
    </Screen>
  );
}
