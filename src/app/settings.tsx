import Constants from 'expo-constants';
import { router, Stack } from 'expo-router';
import { Alert, Platform, Pressable, Text, View } from 'react-native';

import { Button, Card, H2, P, Row, Screen, useTheme } from '@/components/ui';
import { EQUIPMENT } from '@/data/sv';
import { EXPERIENCES } from '@/lib/onboarding';
import { startFull, startStarter } from '@/lib/starter';
import { Currency, Experience, State, Units, useStore } from '@/lib/store';

const EXPERIENCE_LABEL = Object.fromEntries(EXPERIENCES.map((e) => [e.id, e.title])) as Record<Experience, string>;

/** Native confirm dialog, or the browser's confirm() on web. */
function confirmThen(title: string, msg: string, action: string, onOk: () => void, destructive = false) {
  if (Platform.OS === 'web') {
    if (globalThis.confirm?.(`${title} ${msg}`)) onOk();
  } else {
    Alert.alert(title, msg, [
      { text: 'Cancel', style: 'cancel' },
      { text: action, style: destructive ? 'destructive' : 'default', onPress: onOk },
    ]);
  }
}

function Segmented<T extends string>({ value, options, onChange }: { value: T; options: { id: T; label: string }[]; onChange: (v: T) => void }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', backgroundColor: t.chip, borderRadius: 10, padding: 3, gap: 3 }}>
      {options.map((o) => {
        const on = o.id === value;
        return (
          <Pressable
            key={o.id}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            onPress={() => onChange(o.id)}
            style={{ flex: 1, paddingVertical: 9, borderRadius: 8, alignItems: 'center', backgroundColor: on ? t.card : 'transparent' }}
          >
            <Text style={{ color: on ? t.accent : t.muted, fontWeight: on ? '800' : '600', fontSize: 14 }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function LinkRow({ title, desc, onPress }: { title: string; desc: string; onPress: () => void }) {
  const t = useTheme();
  return (
    <Card onPress={onPress}>
      <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
        <View style={{ flex: 1 }}>
          <H2>{title}</H2>
          <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>{desc}</Text>
        </View>
        <Text style={{ color: t.muted, fontSize: 22 }}>›</Text>
      </Row>
    </Card>
  );
}

export default function SettingsScreen() {
  const { state, update, reset } = useStore();
  const t = useTheme();
  const starter = state.track === 'starter';
  const version = Constants.expoConfig?.version;

  const KEPT = 'Your levels, workout logs and test results are kept.';
  const switchPlan = (title: string, fn: (s: State) => State) => confirmThen(title, KEPT, 'Switch', () => update(fn));

  const setUnits = (units: Units) => update((s) => ({ ...s, settings: { ...s.settings, units } }));
  const setCurrency = (currency: Currency) => update((s) => ({ ...s, settings: { ...s.settings, currency } }));

  const equipment = state.profile?.equipment ?? [];
  const equipText = equipment.length
    ? EQUIPMENT.filter((e) => equipment.includes(e.id))
        .map((e) => e.label)
        .join(', ')
    : 'No equipment (floor only)';

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Settings' }} />

      <Card>
        <H2>Training plan</H2>
        <P>{starter ? 'Starter – 3 short full-body workouts a week' : 'Full program – 4 workouts a week, 12-week cycle'}</P>
        <P muted style={{ fontSize: 14 }}>You can switch plans at any time. {KEPT}</P>
        {starter ? (
          <>
            <Button title="Switch to full program – start with tests (week 0)" variant="secondary" onPress={() => switchPlan('Switch to the full program and start with tests?', (s) => startFull(s, true))} />
            <Button title="Switch to full program – start training (week 1)" variant="secondary" onPress={() => switchPlan('Switch to the full program and start training?', (s) => startFull(s, false))} />
          </>
        ) : (
          <Button title="Switch to Starter" variant="secondary" onPress={() => switchPlan('Switch to the Starter plan?', startStarter)} />
        )}
      </Card>

      <Card>
        <H2>Units</H2>
        <Segmented<Units>
          value={state.settings.units}
          onChange={setUnits}
          options={[
            { id: 'metric', label: 'Metric (kg, cm)' },
            { id: 'imperial', label: 'Imperial (lb, in)' },
          ]}
        />
      </Card>

      <Card>
        <H2>Currency</H2>
        <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>Used for rough prices in equipment tips.</Text>
        <Segmented<Currency>
          value={state.settings.currency}
          onChange={setCurrency}
          options={(['USD', 'EUR', 'GBP', 'SEK'] as const).map((c) => ({ id: c, label: c }))}
        />
      </Card>

      <Card>
        <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          <H2>Profile</H2>
          <Pressable onPress={() => router.push('/welcome')} hitSlop={10} accessibilityRole="button">
            <Text style={{ color: t.accent, fontWeight: '800', fontSize: 15 }}>Edit</Text>
          </Pressable>
        </Row>
        <P>
          <Text style={{ fontWeight: '700' }}>Experience: </Text>
          {state.profile ? EXPERIENCE_LABEL[state.profile.experience] : 'Not set'}
        </P>
        <P>
          <Text style={{ fontWeight: '700' }}>Equipment: </Text>
          {equipText}
        </P>
        <P muted style={{ fontSize: 14 }}>Exercises are swapped automatically to match your equipment.</P>
      </Card>

      <LinkRow title="Reminders" desc="Notifications for today’s workout and micro-practice." onPress={() => router.push('/reminders')} />

      <Card style={{ borderColor: t.warn }}>
        <H2 style={{ color: t.warn }}>Reset app</H2>
        <P muted style={{ fontSize: 14 }}>Deletes all logs, test results, levels and settings. This can’t be undone.</P>
        <Button
          title="Reset all data"
          variant="danger"
          onPress={() => confirmThen('Reset the app?', 'All logs, test results and levels will be deleted.', 'Reset', reset, true)}
        />
      </Card>

      {version ? <P muted style={{ fontSize: 12, textAlign: 'center' }}>Calistudy {version}</P> : null}
    </Screen>
  );
}
