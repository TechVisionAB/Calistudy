import { router } from 'expo-router';
import { useState } from 'react';
import { ScrollView, Text, View } from 'react-native';

import { Button, Card, Chip, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { blockOf, dayPlan, DayPlan, programWeek, shiftDate, WEEK_PARAMS, WEEKDAYS, weekdayIndex } from '@/data/program';
import { SESSIONS } from '@/data/sessions';
import { nextUp } from '@/lib/next';
import { useStore } from '@/lib/store';

function planTitle(p: DayPlan): string {
  if (p.kind === 'session') return SESSIONS[p.session].title + (p.deload && p.session !== 'rest' ? ' · deload' : '');
  if (p.kind === 'test') return p.battery === 'mini' ? 'Minitest' + (p.extra ? ` ${p.extra}` : '') : `Test ${p.battery}`;
  return p.label;
}

export default function Program() {
  const { state, update } = useStore();
  const t = useTheme();
  const current = state.startMonday ? programWeek(state.startMonday) : 0;
  const [selected, setWeek] = useState<number | null>(null);
  const week = selected ?? current;
  const params = WEEK_PARAMS[week];
  const next = nextUp(state);
  const isNext = (p: DayPlan) =>
    (next.kind === 'session' && p.kind === 'session' && p.session === next.session) ||
    (next.kind === 'test' && p.kind === 'test' && p.battery === next.battery);
  // "Next" follows the order-based plan on Idag, not the weekday. Only fall back to
  // today's weekday when nothing is due (rest day) so the row still orients the user.
  const plans = WEEKDAYS.map((_, i) => dayPlan(week, i));
  const nextIdx = week === current ? plans.findIndex(isNext) : -1;
  const todayIdx = week === current && nextIdx === -1 ? weekdayIndex() : -1;
  const doneTest = (b: string) => !!state.startMonday && state.tests.some((x) => x.battery === b && x.date.slice(0, 10) >= state.startMonday!);

  const open = (p: DayPlan) => {
    if (p.kind === 'session') router.push({ pathname: '/session/[id]', params: { id: p.session, week: String(week) } });
    else if (p.kind === 'test') router.push({ pathname: '/test/[battery]', params: { battery: p.battery } });
    else router.push('/');
  };

  const shiftCurrent = (delta: number) => {
    setWeek(null);
    update((s) => (s.startMonday ? { ...s, startMonday: shiftDate(s.startMonday, -7 * delta) } : s));
  };

  return (
    <Screen>
      <Card>
        <Label>Du är på</Label>
        <H2>
          Vecka {current} · {blockOf(current)}
        </H2>
        {state.startMonday && <P muted>Vecka 0 startade {state.startMonday}. Efter vecka 12 börjar en ny cykel på vecka 1.</P>}
        <Row>
          <Button title="− 1 vecka" variant="secondary" disabled={!state.startMonday || current === 0} onPress={() => shiftCurrent(-1)} />
          <Button title="+ 1 vecka" variant="secondary" disabled={!state.startMonday} onPress={() => shiftCurrent(1)} />
        </Row>
      </Card>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {WEEK_PARAMS.map((p) => (
          <Chip
            key={p.week}
            text={`V${p.week}`}
            tone={p.week === week ? 'accent' : p.week === current ? 'good' : 'neutral'}
            onPress={() => setWeek(p.week)}
          />
        ))}
      </ScrollView>

      <Card>
        <Label>Vecka {week} · {blockOf(week)}</Label>
        {week > 0 && (
          <>
            <P>Styrka RIR {params.strengthRir} · Hypertrofi RIR {params.hypertrophyRir}</P>
            <P>Hållningar: {params.holds}</P>
          </>
        )}
        <P muted>
          {params.sets}
          {params.notes ? ` · ${params.notes}` : ''}
        </P>
      </Card>

      <P muted>Veckodagarna är ett förslag. Appen följer ordningen – missar du en dag blir det passet nästa, oavsett veckodag.</P>

      <View style={{ gap: 8 }}>
        {WEEKDAYS.map((d, i) => {
          const p = plans[i];
          const isToday = i === nextIdx || i === todayIdx;
          const done = week === 0 && p.kind === 'test' && doneTest(p.battery);
          const sub =
            (i === nextIdx ? 'Nästa · ' : '') +
            (done ? 'Klart ✓' : p.kind === 'session' ? SESSIONS[p.session].short : p.kind === 'test' ? 'Baslinjetest' : 'Mikroträning');
          return (
            <Card key={d} onPress={() => open(p)} style={isToday ? { borderColor: t.accent, borderWidth: 2 } : undefined}>
              <Row>
                <Text style={{ color: isToday ? t.accent : t.muted, fontWeight: '800', width: 36 }}>{d}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{planTitle(p)}</Text>
                  <Text style={{ color: t.muted, fontSize: 13 }}>{sub}</Text>
                </View>
                <Text style={{ color: t.muted, fontSize: 18 }}>›</Text>
              </Row>
            </Card>
          );
        })}
      </View>
    </Screen>
  );
}
