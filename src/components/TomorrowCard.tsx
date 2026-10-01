import { router } from 'expo-router';
import { Text } from 'react-native';

import { programWeek } from '@/data/program';
import { SESSIONS } from '@/data/sessions';
import { SESSION_SV, TEST_SV } from '@/data/sv';
import { upcoming } from '@/lib/next';
import { planSession } from '@/lib/plan';
import { isStarter, starterWeek } from '@/lib/starter';
import { useStore } from '@/lib/store';
import { useUnits } from '@/lib/units';
import { Card, Label, P, useTheme } from './ui';

/** "Tomorrow: Full body B · 30 min — Split squat · Pike push-up · …" so people know what's coming. */
export function TomorrowCard() {
  const { state } = useStore();
  const t = useTheme();
  const u = useUnits();
  const up = upcoming(state);
  if (!up) return null;

  const when = up.dayOffset === 1 ? 'Tomorrow' : up.date.toLocaleDateString('en-GB', { weekday: 'long' });
  const n = up.next;

  if (n.kind === 'test') {
    return (
      <Card onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: n.battery } })}>
        <Label>Up next · {when}</Label>
        <Text style={{ color: t.text, fontSize: 18, fontWeight: '800' }}>{TEST_SV[n.battery]}</Text>
        <P muted>About 20 min. Do it well rested.</P>
      </Card>
    );
  }

  const week = isStarter(state) ? starterWeek(state, up.date) : state.startMonday ? programWeek(state.startMonday, up.date) : 1;
  const list = planSession(n.session, week, 0, state.levels, state.profile?.equipment ?? null).filter((e) => e.plannedSets > 0);
  const names = list.slice(0, 4).map((e) => u(e.title));
  const more = list.length - names.length;

  return (
    <Card onPress={() => router.push({ pathname: '/session/[id]', params: { id: n.session, week: String(week) } })}>
      <Label>Up next · {when}</Label>
      <Text style={{ color: t.text, fontSize: 18, fontWeight: '800' }}>
        {SESSION_SV[n.session].title} <Text style={{ color: t.muted, fontWeight: '500', fontSize: 15 }}>· {SESSIONS[n.session].duration}</Text>
      </Text>
      {names.length > 0 && (
        <P muted style={{ fontSize: 14 }}>
          {names.join(' · ')}
          {more > 0 ? ` + ${more} more` : ''}
        </P>
      )}
      <Text style={{ color: t.accent, fontWeight: '700', fontSize: 14 }}>See the exercises ›</Text>
    </Card>
  );
}
