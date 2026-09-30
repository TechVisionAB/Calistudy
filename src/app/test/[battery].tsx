import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { Bullets, Button, Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { LADDER_BY_ID } from '@/data/ladders';
import { TestBattery } from '@/data/program';
import { GENERAL_RULES, MINI_RETEST, placements, TEST_A, TEST_B, TEST_C, TestItem, Values } from '@/data/tests';
import { newId, useStore } from '@/lib/store';

const MINI_ITEMS: TestItem[] = [
  ...TEST_A.filter((x) => ['pullups', 'dips', 'hs'].includes(x.id)).map((x) => ({ ...x, inputs: x.inputs.slice(0, 1) })),
  { id: 'pushLevel', name: 'Max push-ups at your HP level', how: '', interpretation: 'Record; compare with last cycle.', inputs: [{ key: 'pushLevel', label: 'Reps', unit: 'reps' }] },
  { id: 'statics', name: 'Best planche / FL level holds', how: '', interpretation: 'Apply the static rule per ladder.', inputs: [{ key: 'plHold', label: 'Planche-nivå, hålltid', unit: 's' }, { key: 'flHold', label: 'FL-nivå, hålltid', unit: 's' }] },
  { id: 'lsit', name: 'L-sit max', how: '', interpretation: 'Record.', inputs: [{ key: 'lsitFull', label: 'Hålltid', unit: 's' }] },
  ...TEST_B.filter((x) => x.id === 'sl').map((x) => ({ ...x, name: 'Box pistol lowest height ×5', inputs: x.inputs.filter((i) => i.key === 'boxHeight' || i.key === 'pistol') })),
  ...TEST_B.filter((x) => x.id === 'nordic'),
];

export default function TestScreen() {
  const { battery } = useLocalSearchParams<{ battery: TestBattery }>();
  const { state, update } = useStore();
  const t = useTheme();
  const [values, setValues] = useState<Values>({});
  const [failed, setFailed] = useState<string[]>(battery === 'C' ? state.mobilityFails : []);
  const [saved, setSaved] = useState(false);

  const items = useMemo(() => (battery === 'A' ? TEST_A : battery === 'B' ? TEST_B : battery === 'mini' ? MINI_ITEMS : []), [battery]);
  const places = useMemo(() => {
    const all = placements(items, values);
    if (battery !== 'mini') return all;
    // The mini-retest only moves levels up; its tests are too coarse to demote (e.g. CTW vs freestanding HS).
    const idx = (ladder: string, code: string) => LADDER_BY_ID[ladder]?.levels.findIndex((l) => l.code === code) ?? -1;
    return all.filter((p) => idx(p.ladder, p.level) > idx(p.ladder, state.levels[p.ladder]));
  }, [items, values, battery, state.levels]);
  const title = battery === 'mini' ? 'Minitest (vecka 6)' : `Test ${battery}`;

  const save = () => {
    update((s) => {
      const levels = { ...s.levels };
      places.forEach((p) => (levels[p.ladder] = p.level));
      return {
        ...s,
        levels,
        mobilityFails: battery === 'C' ? failed : s.mobilityFails,
        tests: [{ id: newId(), date: new Date().toISOString(), battery, values, failed: battery === 'C' ? failed : undefined }, ...s.tests],
      };
    });
    setSaved(true);
  };

  const setVal = (key: string, text: string) => {
    const n = text.trim() === '' ? undefined : Number(text.replace(',', '.'));
    setValues((v) => ({ ...v, [key]: n !== undefined && Number.isNaN(n) ? undefined : n }));
  };

  if (saved) {
    return (
      <Screen>
        <Stack.Screen options={{ title }} />
        <H1>Sparat ✓</H1>
        {places.length > 0 && (
          <Card>
            <H2>Nya nivåer</H2>
            <Bullets items={places.map((p) => `${LADDER_BY_ID[p.ladder]?.name}: ${p.level}${p.note ? ` — ${p.note}` : ''}`)} />
          </Card>
        )}
        {battery === 'C' && <P>{failed.length === 0 ? 'Alla rörlighetstester godkända.' : `${failed.length} underkända tester läggs in som riktad rörlighet i mikroträningen.`}</P>}
        <Button title="Till nivåerna" onPress={() => router.replace('/levels')} />
        <Button title="Tillbaka" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  return (
    <Screen>
      <Stack.Screen options={{ title }} />
      <View>
        <Label>{battery === 'A' ? 'Överkropp' : battery === 'B' ? 'Underkropp + bål' : battery === 'C' ? 'Rörlighet + färdigheter' : 'Deloadvecka, lördag'}</Label>
        <H1>{title}</H1>
      </View>

      {battery !== 'C' && (
        <Card>
          <H2>Regler</H2>
          <Bullets items={battery === 'mini' ? [...MINI_RETEST, 'Update every level using the Week 0 rules.'] : GENERAL_RULES} />
        </Card>
      )}

      {battery === 'C' &&
        TEST_C.map((c) => {
          const fail = failed.includes(c.id);
          return (
            <Card key={c.id}>
              <H2>{c.name}</H2>
              <P muted>{c.how}</P>
              <P>Godkänt: {c.pass}</P>
              <Row>
                <Chip text="Godkänt" tone={!fail ? 'good' : 'neutral'} onPress={() => setFailed((f) => f.filter((x) => x !== c.id))} />
                <Chip text="Underkänt" tone={fail ? 'warn' : 'neutral'} onPress={() => setFailed((f) => (f.includes(c.id) ? f : [...f, c.id]))} />
              </Row>
              {fail && <P muted>→ {c.fail}</P>}
            </Card>
          );
        })}

      {items.map((it) => {
        const p = it.place?.(values);
        return (
          <Card key={it.id}>
            <H2>{it.name}</H2>
            {!!it.how && <P muted>{it.how}</P>}
            {(it.counts || it.stop) && (
              <Text style={{ color: t.muted, fontSize: 13 }}>
                {it.counts ? `Räknas: ${it.counts}. ` : ''}
                {it.stop ? `Stoppa: ${it.stop}.` : ''}
              </Text>
            )}
            <Text style={{ color: t.text, fontSize: 13 }}>{it.interpretation}</Text>
            {it.inputs.map((inp) => (
              <View key={inp.key} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Text style={{ color: t.text, flex: 1, fontSize: 14 }}>{inp.label}</Text>
                <TextInput
                  keyboardType="numeric"
                  inputMode="numeric"
                  value={values[inp.key] === undefined ? '' : String(values[inp.key])}
                  onChangeText={(x) => setVal(inp.key, x)}
                  placeholder="–"
                  placeholderTextColor={t.muted}
                  style={{ width: 70, borderWidth: 1, borderColor: t.border, borderRadius: 10, padding: 8, textAlign: 'center', color: t.text, fontSize: 16, fontWeight: '700' }}
                />
                <Text style={{ color: t.muted, width: 60, fontSize: 13 }}>{inp.unit}</Text>
              </View>
            ))}
            {p && <Chip text={`→ ${p.level}${p.note ? ` · ${p.note}` : ''}`} tone="accent" />}
          </Card>
        );
      })}

      {places.length > 0 && (
        <Card>
          <H2>Placering</H2>
          {places.map((p) => (
            <Pressable key={p.ladder} onPress={() => router.push({ pathname: '/ladder/[id]', params: { id: p.ladder } })}>
              <Text style={{ color: t.text, fontSize: 15 }}>
                {LADDER_BY_ID[p.ladder]?.name}: <Text style={{ fontWeight: '800', color: t.accent }}>{p.level}</Text>
                {state.levels[p.ladder] !== p.level ? <Text style={{ color: t.muted }}> (nu {state.levels[p.ladder]})</Text> : null}
              </Text>
            </Pressable>
          ))}
        </Card>
      )}

      <Button title={places.length > 0 ? 'Spara & tillämpa nivåer' : 'Spara resultat'} onPress={save} />
    </Screen>
  );
}
