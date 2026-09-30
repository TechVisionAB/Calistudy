import { Stack } from 'expo-router';
import { useState } from 'react';
import { Pressable, Switch, Text, View } from 'react-native';

import { Card, H2, P, Row, Screen, useTheme } from '@/components/ui';
import { ensurePermission, remindersSupported } from '@/lib/reminders';
import { ReminderTime, Reminders, useStore } from '@/lib/store';

const pad = (n: number) => String(n).padStart(2, '0');

function TimeStepper({ value, onChange }: { value: ReminderTime; onChange: (v: ReminderTime) => void }) {
  const t = useTheme();
  const shift = (mins: number) => {
    const total = (((value.hour * 60 + value.minute + mins) % 1440) + 1440) % 1440;
    onChange({ ...value, hour: Math.floor(total / 60), minute: total % 60 });
  };
  const btn = (label: string, mins: number) => (
    <Pressable onPress={() => shift(mins)} hitSlop={6} style={{ paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: t.chip }}>
      <Text style={{ color: t.accent, fontWeight: '800' }}>{label}</Text>
    </Pressable>
  );
  return (
    <Row>
      {btn('−1 h', -60)}
      {btn('−15', -15)}
      <Text style={{ color: t.text, fontSize: 22, fontWeight: '700', fontVariant: ['tabular-nums'], minWidth: 70, textAlign: 'center' }}>
        {pad(value.hour)}:{pad(value.minute)}
      </Text>
      {btn('+15', 15)}
      {btn('+1 h', 60)}
    </Row>
  );
}

export default function RemindersScreen() {
  const { state, update } = useStore();
  const t = useTheme();
  const [denied, setDenied] = useState(false);

  const set = (key: keyof Reminders, v: ReminderTime) => update((s) => ({ ...s, reminders: { ...s.reminders, [key]: v } }));

  const toggle = async (key: keyof Reminders, on: boolean) => {
    if (on && !(await ensurePermission())) {
      setDenied(true);
      return;
    }
    setDenied(false);
    set(key, { ...state.reminders[key], enabled: on });
  };

  if (!remindersSupported) {
    return (
      <Screen>
        <Stack.Screen options={{ title: 'Påminnelser' }} />
        <P>Påminnelser fungerar i mobilappen (iPhone/Android), inte i webbläsaren.</P>
      </Screen>
    );
  }

  const items: { key: keyof Reminders; title: string; desc: string }[] = [
    { key: 'morning', title: 'Dagens pass', desc: 'En notis på morgonen med dagens pass enligt programmet (inte på vilodagar).' },
    { key: 'evening', title: 'Mikroträning', desc: 'Påminner på kvällen om du inte bockat av mikroträningen (tis, ons, fre, lör).' },
  ];

  return (
    <Screen>
      <Stack.Screen options={{ title: 'Påminnelser' }} />
      {!state.startMonday && <P muted>Starta programmet på Idag-fliken först, så vet appen vilket pass som gäller.</P>}
      {items.map((it) => {
        const r = state.reminders[it.key];
        return (
          <Card key={it.key}>
            <Row style={{ justifyContent: 'space-between', flexWrap: 'nowrap' }}>
              <View style={{ flex: 1 }}>
                <H2>{it.title}</H2>
                <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>{it.desc}</Text>
              </View>
              <Switch value={r.enabled} onValueChange={(v) => toggle(it.key, v)} trackColor={{ true: t.accent }} />
            </Row>
            {r.enabled && <TimeStepper value={r} onChange={(v) => set(it.key, v)} />}
          </Card>
        );
      })}
      {denied && (
        <Card>
          <P style={{ color: t.warn }}>Notiser är avstängda för appen. Slå på dem i telefonens inställningar och försök igen.</P>
        </Card>
      )}
      <P muted style={{ fontSize: 13 }}>Notiserna planeras två veckor framåt och uppdateras varje gång du öppnar appen.</P>
    </Screen>
  );
}
