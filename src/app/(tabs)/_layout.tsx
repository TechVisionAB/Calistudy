import Ionicons from '@expo/vector-icons/Ionicons';
import { router, Tabs } from 'expo-router';
import { Pressable, View } from 'react-native';
import { ComponentProps } from 'react';

import { useTheme } from '@/components/ui';

type IconName = ComponentProps<typeof Ionicons>['name'];

const TABS: { name: string; title: string; icon: IconName }[] = [
  { name: 'index', title: 'Today', icon: 'flash' },
  { name: 'program', title: 'Program', icon: 'calendar' },
  { name: 'levels', title: 'Levels', icon: 'trending-up' },
  { name: 'log', title: 'Log', icon: 'list' },
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
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18, marginRight: 16 }}>
            <Pressable onPress={() => router.push('/coach')} hitSlop={8} accessibilityLabel="Ask the AI coach">
              <Ionicons name="chatbubble-ellipses-outline" size={24} color={t.accent} />
            </Pressable>
            <Pressable onPress={() => router.push('/settings')} hitSlop={8} accessibilityLabel="Settings">
              <Ionicons name="settings-outline" size={24} color={t.accent} />
            </Pressable>
          </View>
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
