import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Pressable } from 'react-native';
import { ComponentProps } from 'react';

import { useTheme } from '@/components/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Idag', icon: 'flash' },
  { name: 'program', title: 'Program', icon: 'calendar' },
  { name: 'levels', title: 'Nivåer', icon: 'trending-up' },
  { name: 'log', title: 'Logg', icon: 'list' },
  { name: 'guide', title: 'Guide', icon: 'book' },
];

export default function TabLayout() {
  const t = useTheme();
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: t.accent,
        tabBarInactiveTintColor: t.muted,
        tabBarStyle: { backgroundColor: t.card, borderTopColor: t.border },
        headerStyle: { backgroundColor: t.card },
        headerTitleStyle: { color: t.text, fontWeight: '800' },
        sceneStyle: { backgroundColor: t.bg },
        headerRight: () => (
          <Pressable onPress={() => router.push('/coach')} hitSlop={10} style={{ marginRight: 16 }} accessibilityLabel="Fråga AI-coachen">
            <Ionicons name="chatbubble-ellipses-outline" size={24} color={t.accent} />
          </Pressable>
        ),
      }}
    >
      {TABS.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            headerTitle: tab.name === 'index' ? 'Calistudy' : tab.title,
            tabBarIcon: ({ color, size }) => <Ionicons name={tab.icon} color={color} size={size} />,
          }}
        />
      ))}
    </Tabs>
  );
}
