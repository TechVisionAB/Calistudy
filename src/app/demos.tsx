import { Stack, useLocalSearchParams } from 'expo-router';

import { Figure } from '@/components/Figure';
import { Card, H2, P, Screen } from '@/components/ui';
import { ANIMATIONS } from '@/data/animations';

export default function Demos() {
  // ?t=0.5 freezes every animation at that point of its loop (handy for reviewing poses).
  const { t } = useLocalSearchParams<{ t?: string }>();
  const time = t === undefined ? undefined : Number(t);
  return (
    <Screen>
      <Stack.Screen options={{ title: 'Övningsdemos' }} />
      <P muted>Tryck på en animation för att pausa. Orange = närmsta arm/ben.</P>
      {ANIMATIONS.map((a) => (
        <Card key={a.id}>
          <H2>{a.title}</H2>
          <Figure anim={a} time={time} />
          <P muted>{a.caption}</P>
        </Card>
      ))}
    </Screen>
  );
}
