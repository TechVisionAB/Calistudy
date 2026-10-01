import { router } from 'expo-router';
import { useMemo } from 'react';
import { Text, View } from 'react-native';

import { useStore } from '@/lib/store';
import { useUnits } from '@/lib/units';
import { describeChange, EarnedMilestone, firstVsNow, FirstVsNow, formatValue, MILESTONES, milestones } from '@/lib/wins';
import { Card, H2, Label, P, Row, useTheme } from './ui';

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/** Today-tab card: latest badges + one "you vs. day one" line. Renders nothing before the first workout. */
export function WinsCard() {
  const { state } = useStore();
  const t = useTheme();
  const u = useUnits();
  const earned = useMemo(() => milestones(state.workouts), [state.workouts]);
  const vs = useMemo(() => firstVsNow(state.workouts), [state.workouts]);
  if (state.workouts.length === 0) return null;

  const latest = earned[earned.length - 1];
  const top = vs.find((x) => x.improved);
  return (
    <Card onPress={() => router.push('/progress')}>
      <Row style={{ justifyContent: 'space-between' }}>
        <Label>Your wins</Label>
        <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>
          {earned.length} of {MILESTONES.length} badges
        </Text>
      </Row>
      <Row style={{ gap: 4 }}>
        {earned.slice(-6).map((m) => (
          <Text key={m.id} style={{ fontSize: 26 }} accessibilityLabel={m.title}>
            {m.emoji}
          </Text>
        ))}
      </Row>
      {latest && (
        <P>
          Latest: <Text style={{ fontWeight: '700' }}>{latest.title}</Text>
          <Text style={{ color: t.muted }}> · {shortDate(latest.date)}</Text>
        </P>
      )}
      {top ? (
        <P>
          <Text style={{ color: t.muted }}>You vs. your first workout: </Text>
          <Text style={{ color: t.good, fontWeight: '700' }}>{u(describeChange(top))}</Text>
        </P>
      ) : (
        <P muted>Keep going – after a week you’ll see how far you’ve come since day one.</P>
      )}
      <Text style={{ color: t.accent, fontSize: 13, fontWeight: '700' }}>See all progress ›</Text>
    </Card>
  );
}

/** "You vs. day one" list for the progress screen. */
export function FirstVsNowCard({ items }: { items: FirstVsNow[] }) {
  const t = useTheme();
  const u = useUnits();
  return (
    <Card>
      <H2>You vs. day one</H2>
      {items.length === 0 ? (
        <P muted>Train the same exercises for a week or more and you’ll see your first workout next to today, right here.</P>
      ) : (
        items.map((x) => {
          const levelChanged = x.from.levelName !== x.to.levelName;
          return (
            <View key={x.key} style={{ gap: 2, paddingVertical: 4 }}>
              <Row style={{ justifyContent: 'space-between' }}>
                <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>{x.name}</Text>
                {x.improved && <Text style={{ color: t.good, fontWeight: '700', fontSize: 13 }}>{x.levelUp ? '⬆ Level up' : '↑ Better'}</Text>}
              </Row>
              <Text style={{ color: t.muted, fontSize: 14 }}>
                {shortDate(x.from.date)}: {levelChanged && x.from.levelName ? `${u(x.from.levelName)}, ` : ''}
                {formatValue(x.from.value, x.from.unit)}
                {'  →  '}
                <Text style={{ color: x.improved ? t.good : t.text, fontWeight: '700' }}>
                  {levelChanged && x.to.levelName ? `${u(x.to.levelName)}, ` : ''}
                  {formatValue(x.to.value, x.to.unit)}
                </Text>
              </Text>
            </View>
          );
        })
      )}
    </Card>
  );
}

/** All badges: earned in color with the date, the rest greyed out with how to get them. */
export function BadgeGrid({ earned }: { earned: EarnedMilestone[] }) {
  const t = useTheme();
  const byId = new Map(earned.map((m) => [m.id, m]));
  return (
    <Card>
      <Row style={{ justifyContent: 'space-between' }}>
        <H2>Badges</H2>
        <Text style={{ color: t.muted, fontSize: 13, fontWeight: '600' }}>
          {earned.length} of {MILESTONES.length}
        </Text>
      </Row>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
        {MILESTONES.map((m) => {
          const got = byId.get(m.id);
          return (
            <View
              key={m.id}
              accessibilityLabel={`${m.title}${got ? `, earned ${shortDate(got.date)}` : `, not earned yet: ${m.desc}`}`}
              style={{
                width: '31%',
                flexGrow: 1,
                borderRadius: 12,
                padding: 8,
                gap: 2,
                alignItems: 'center',
                backgroundColor: got ? t.accentSoft : t.chip,
                opacity: got ? 1 : 0.55,
              }}
            >
              <Text style={{ fontSize: 28, opacity: got ? 1 : 0.4 }}>{m.emoji}</Text>
              <Text style={{ color: got ? t.text : t.muted, fontSize: 12, fontWeight: '700', textAlign: 'center' }}>{m.title}</Text>
              <Text style={{ color: t.muted, fontSize: 11, textAlign: 'center' }}>{got ? shortDate(got.date) : m.desc}</Text>
            </View>
          );
        })}
      </View>
    </Card>
  );
}
