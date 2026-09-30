import { router, Stack, useLocalSearchParams } from 'expo-router';

import { Blocks } from '@/components/Blocks';
import { Button, H1, P, Screen } from '@/components/ui';
import { GUIDE } from '@/data/guide';

export default function GuideSectionScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const section = GUIDE.find((s) => s.id === id);
  if (!section) return <Screen><P>Unknown section.</P></Screen>;
  return (
    <Screen>
      <Stack.Screen options={{ title: section.title }} />
      <H1>{section.title}</H1>
      <P muted>{section.summary}</P>
      <Button title="💬 Ask the AI coach about this" variant="secondary" onPress={() => router.push({ pathname: '/coach', params: { context: `The guide section "${section.title}" (${section.summary})` } })} />
      <Blocks blocks={section.blocks} context={section.title} />
    </Screen>
  );
}
