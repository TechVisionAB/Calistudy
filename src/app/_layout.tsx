import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native';

import { useTheme } from '@/components/ui';
import { StoreProvider } from '@/lib/store';

export default function RootLayout() {
  const t = useTheme();
  const scheme = useColorScheme();
  return (
    <StoreProvider>
      <StatusBar style={scheme === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: t.card },
          headerTintColor: t.accent,
          headerTitleStyle: { color: t.text },
          contentStyle: { backgroundColor: t.bg },
          headerBackTitle: 'Tillbaka',
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="session/[id]" options={{ title: 'Pass' }} />
        <Stack.Screen name="workout/[id]" options={{ title: 'Träna', gestureEnabled: false }} />
        <Stack.Screen name="ladder/[id]" options={{ title: 'Nivåstege' }} />
        <Stack.Screen name="test/[battery]" options={{ title: 'Test' }} />
        <Stack.Screen name="guide/[id]" options={{ title: 'Guide' }} />
        <Stack.Screen name="history/[id]" options={{ title: 'Loggat pass' }} />
      </Stack>
    </StoreProvider>
  );
}
