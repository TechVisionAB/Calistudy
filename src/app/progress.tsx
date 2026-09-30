import { Stack } from 'expo-router';
import { useMemo } from 'react';

import { ProgressCard } from '@/components/ProgressCard';
import { P, Screen } from '@/components/ui';
import { progressSeries } from '@/lib/progress';
import { useStore } from '@/lib/store';

export default function Progress() {
  const { state } = useStore();
  const series = useMemo(() => progressSeries(state.workouts), [state.workouts]);
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Progress' }} />
      <P muted>
        Best set per workout. A vertical line marks a level change — a harder level gives lower numbers, so compare within the same level. Tap a point for details.
      </P>
      {series.length === 0 && <P>No sets logged yet. Do a workout and your charts will show up here.</P>}
      {series.map((s) => (
        <ProgressCard key={s.key} series={s} />
      ))}
    </Screen>
  );
}
