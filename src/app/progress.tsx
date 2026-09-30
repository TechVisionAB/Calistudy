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
      <Stack.Screen options={{ title: 'Framsteg' }} />
      <P muted>
        Bästa set per pass. En lodrät linje markerar nivåbyte — en svårare nivå ger lägre siffror, så jämför inom samma nivå. Tryck på en punkt för detaljer.
      </P>
      {series.length === 0 && <P>Inga loggade set ännu. Kör ett pass så dyker kurvorna upp här.</P>}
      {series.map((s) => (
        <ProgressCard key={s.key} series={s} />
      ))}
    </Screen>
  );
}
