import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';

import { useTheme } from '@/components/ui';
import { isoDate } from '@/data/program';
import { reschedule } from '@/lib/reminders';
import { StoreProvider, useStore } from '@/lib/store';

/** Keeps scheduled reminders in sync with the plan, settings and today's micro-practice. */
function ReminderSync() {
  const { state, ready } = useStore();
  const today = isoDate(new Date());
  const key = JSON.stringify([state.startMonday, state.reminders, (state.micro[today] ?? []).length > 0, state.workouts.length, state.tests.length]);
  useEffect(() => {
    if (ready) reschedule(state).catch(() => {});
    // Only re-plan when something that affects the notifications changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, key]);
  return null;
}

export default function RootLayout() {
  const t = useTheme();
  const scheme = useColorScheme();
  return (
    <StoreProvider>
      <ReminderSync />
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.card },
          headerTintColor: t.accent,
          headerTitleStyle: { color: t.text },
          contentStyle: { backgroundColor: t.bg },
          headerBackTitle: 'Back',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session/[id]" options={{ title: 'Workout' }} />
        <Stack.Screen name="workout/[id]" options={{ title: 'Train', gestureEnabled: false }} />
        <Stack.Screen name="ladder/[id]" options={{ title: 'Level ladder' }} />
        <Stack.Screen name="test/[battery]" options={{ title: 'Test' }} />
        <Stack.Screen name="guide/[id]" options={{ title: 'Guide' }} />
        <Stack.Screen name="history/[id]" options={{ title: 'Logged workout' }} />
        <Stack.Screen name="demos" options={{ title: 'Exercise demos' }} />
        <Stack.Screen name="progress" options={{ title: 'Progress' }} />
        <Stack.Screen name="reminders" options={{ title: 'Reminders' }} />
        <Stack.Screen name="report" options={{ title: 'Test report' }} />
        <Stack.Screen name="welcome" options={{ headerShown: false, gestureEnabled: false }} />
        <Stack.Screen name="coach" options={{ title: 'AI coach' }} />
      </Stack>
    </StoreProvider>
  );
}
