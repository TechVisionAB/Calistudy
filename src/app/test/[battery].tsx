import { router, Stack, useLocalSearchParams } from 'expo-router';
import { ReactNode, useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Explain } from '@/components/Explain';
import { Figure } from '@/components/Figure';
import { HowToToggle } from '@/components/HowTo';
import { Button, Card, H1, H2, Label, P, styles, useTheme } from '@/components/ui';
import { activeSteps, altPlacements, GuidedStep } from '@/data/guidedTests';
import { LADDER_BY_ID } from '@/data/ladders';
import { mediaFor } from '@/data/media';
import { TestBattery } from '@/data/program';
import { LADDER_SV, LEVEL_SV, TEST_SV } from '@/data/sv';
import { placements, TEST_A, TEST_B, Values } from '@/data/tests';
import { newId, useStore } from '@/lib/store';

type Guided = Exclude<TestBattery, 'C'>;

const MOBILITY: { id: string; title: string; how: string; pass: string }[] = [
  { id: 'overhead', title: 'Armar över huvudet', how: 'Stå med rygg, huvud och rumpa mot väggen, revbenen in. Lyft raka armar över huvudet.', pass: 'Tummarna når väggen utan att du svankar.' },
  { id: 'wrist', title: 'Handleder', how: 'Stå på alla fyra med handflatorna i golvet och luta dig framåt.', pass: 'Ungefär rät vinkel mellan underarm och hand, utan smärta.' },
  { id: 'pike', title: 'Baksida lår', how: 'Sitt med raka ben och sträck dig fram.', pass: 'Fingertopparna når tårna.' },
  { id: 'ankle', title: 'Fotleder', how: 'Stå vänd mot väggen och för knät mot väggen med hälen kvar i golvet.', pass: 'Minst 10–12 cm mellan tårna och väggen.' },
  { id: 'shoulderExt', title: 'Axlar bakåt (german hang)', how: 'Häng i ringar eller stång med armarna bakom kroppen, fötterna i golvet som stöd.', pass: '20–30 s utan obehag.' },
  { id: 'pancake', title: 'Bred sittande stretch', how: 'Sitt med benen brett isär och fäll fram överkroppen.', pass: 'Bröstet kommer ungefär halvvägs ner (45°).' },
];

function Stopwatch({ onDone, onSkip, skipLabel }: { onDone: (s: number) => void; onSkip: () => void; skipLabel?: string }) {
  const t = useTheme();
  const [start, setStart] = useState<number | null>(null);
  const [result, setResult] = useState<number | null>(null);
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    if (start === null) return;
    const iv = setInterval(() => setNow(Date.now()), 100);
    return () => clearInterval(iv);
  }, [start]);
  const secs = start !== null ? Math.floor((now - start) / 1000) : result ?? 0;

  return (
    <View style={{ gap: 12, alignItems: 'stretch' }}>
      <Text style={{ color: t.text, fontSize: 72, fontWeight: '800', textAlign: 'center', fontVariant: ['tabular-nums'] }}>{secs} s</Text>
      {result === null ? (
        <Button
          title={start === null ? '▶ Starta tidtagning' : '■ Stopp'}
          onPress={() => {
            if (start === null) {
              setNow(Date.now());
              setStart(Date.now());
            } else {
              setResult(Math.floor((Date.now() - start) / 1000));
              setStart(null);
            }
          }}
          style={{ paddingVertical: 18 }}
        />
      ) : (
        <>
          <Button title={`Spara ${result} s ›`} onPress={() => onDone(result)} style={{ paddingVertical: 16 }} />
          <Button title="Gör om" variant="secondary" onPress={() => setResult(null)} />
        </>
      )}
      {start === null && result === null && (
        <Pressable onPress={onSkip} hitSlop={8}>
          <Text style={{ color: t.muted, textAlign: 'center', fontWeight: '600' }}>{skipLabel ?? 'Klarar inte'}</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function TestScreen() {
  const { battery } = useLocalSearchParams<{ battery: TestBattery }>();
  const { state, update } = useStore();
  const t = useTheme();
  const [started, setStarted] = useState(false);
  const [values, setValues] = useState<Values>({});
  // Each answer is a group: [testKey] or [testKey, alternativeKey] when the easier variant was used.
  const [answered, setAnswered] = useState<string[][]>([]);
  const [altOpen, setAltOpen] = useState(false);
  const done = answered.flat();
  const [failed, setFailed] = useState<string[]>([]);
  const [saved, setSaved] = useState(false);
  const title = TEST_SV[battery] ?? `Test ${battery}`;

  const steps = useMemo(
    () => (battery === 'C' ? [] : activeSteps(battery as Guided, values, state.profile?.equipment ?? null)),
    [battery, values, state.profile],
  );
  const current: GuidedStep | undefined = steps.find((s) => !done.includes(s.key));
  const shown: GuidedStep | undefined = current && altOpen && current.alt ? current.alt : current;
  const mobility = battery === 'C' ? MOBILITY[answered.length] : undefined;
  const finished = started && (battery === 'C' ? !mobility : !current);

  const places = useMemo(() => {
    if (battery === 'C') return [];
    // Alternative tests carry their own scoring and win over the guide's rule for the same ladder.
    const alt = altPlacements(values);
    const all = [...placements([...TEST_A, ...TEST_B], values).filter((p) => !alt.some((a) => a.ladder === p.ladder)), ...alt];
    if (battery !== 'mini') return all;
    // The mini-retest only moves levels up; its tests are too coarse to demote.
    const idx = (ladder: string, code: string) => LADDER_BY_ID[ladder]?.levels.findIndex((l) => l.code === code) ?? -1;
    return all.filter((p) => idx(p.ladder, p.level) > idx(p.ladder, state.levels[p.ladder]));
  }, [battery, values, state.levels]);

  const answer = (value: number | undefined) => {
    if (!current || !shown) return;
    const group = shown === current ? [current.key] : [current.key, shown.key];
    setValues((v) => ({ ...v, [shown.key]: value }));
    setAnswered((a) => [...a, group]);
    setAltOpen(false);
  };
  /** "Can't" never just skips: it opens the easier variant, or counts as 0 (which still places a level). */
  const cant = () => {
    if (shown === current && current?.alt) setAltOpen(true);
    else answer(0);
  };
  const back = () => {
    if (altOpen) return setAltOpen(false);
    const last = answered[answered.length - 1];
    if (!last) return setStarted(false);
    setAnswered((a) => a.slice(0, -1));
    setValues((v) => ({ ...v, ...Object.fromEntries(last.map((k) => [k, undefined])) }));
    setFailed((f) => f.filter((x) => !last.includes(x)));
  };

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

  const remaining = battery === 'C' ? MOBILITY.length - answered.length : steps.filter((st) => !done.includes(st.key)).length;
  const progress = answered.length / Math.max(1, answered.length + remaining);

  const shell = (children: ReactNode) => (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen options={{ title }} />
      {started && !saved && (
        <View style={{ height: 4, backgroundColor: t.grid }}>
          <View style={{ height: 4, width: `${progress * 100}%`, backgroundColor: t.accent }} />
        </View>
      )}
      <ScrollView contentContainerStyle={[styles.screen, { paddingBottom: 32 }]}>{children}</ScrollView>
    </SafeAreaView>
  );

  // ---------- Saved ----------
  if (saved) {
    return shell(
      <>
        <Text style={{ fontSize: 56, textAlign: 'center' }}>✅</Text>
        <H1>Klart!</H1>
        {places.length > 0 ? (
          <Card>
            <H2>Dina nivåer</H2>
            {places.map((p) => (
              <Text key={p.ladder} style={{ color: t.text, fontSize: 15 }}>
                <Text style={{ fontWeight: '700' }}>{LADDER_SV[p.ladder]}:</Text> {LEVEL_SV[p.level] ?? p.level}
              </Text>
            ))}
          </Card>
        ) : battery === 'C' ? (
          <P>{failed.length === 0 ? 'Allt godkänt – snyggt!' : `${failed.length} saker att jobba på läggs in i din dagliga mikroträning.`}</P>
        ) : (
          <P>Inga nivåer ändrades.</P>
        )}
        <Button title="Tillbaka till Idag" onPress={() => router.dismissTo('/')} />
      </>,
    );
  }

  // ---------- Intro ----------
  if (!started) {
    return shell(
      <>
        <Label>{battery === 'mini' ? 'Lätt vecka' : 'Test'}</Label>
        <H1>{title}</H1>
        <Card>
          <Text style={{ color: t.text, fontSize: 16, lineHeight: 24 }}>
            {battery === 'C'
              ? 'Sex snabba rörlighetskontroller, ca 10 min. Du svarar bara "klarar" eller "klarar inte".'
              : `Ca ${battery === 'mini' ? 15 : 20} min. En övning i taget – tryck på hur många du klarade, eller ta tid med stoppuret.`}
          </Text>
          <Text style={{ color: t.muted, fontSize: 15, lineHeight: 22 }}>• Värm upp först{'\n'}• Vila 2–3 min mellan testerna{'\n'}• Sluta direkt om det gör ont i en led</Text>
        </Card>
        <Button title="Starta" onPress={() => setStarted(true)} style={{ paddingVertical: 16 }} />
      </>,
    );
  }

  // ---------- Summary ----------
  if (finished) {
    return shell(
      <>
        <H1>Så här blev det</H1>
        {battery !== 'C' && places.length === 0 && <P muted>Inga nivåer att ändra utifrån svaren.</P>}
        {places.map((p) => (
          <Card key={p.ladder}>
            <Text style={{ color: t.muted, fontSize: 13 }}>{LADDER_SV[p.ladder]}</Text>
            <Text style={{ color: t.text, fontSize: 18, fontWeight: '700' }}>{LEVEL_SV[p.level] ?? p.level}</Text>
            {state.levels[p.ladder] !== p.level && <Text style={{ color: t.muted, fontSize: 13 }}>Tidigare: {LEVEL_SV[state.levels[p.ladder]] ?? state.levels[p.ladder]}</Text>}
          </Card>
        ))}
        {battery === 'C' && (
          <Card>
            {MOBILITY.map((m) => (
              <Text key={m.id} style={{ color: t.text, fontSize: 15 }}>
                {failed.includes(m.id) ? '❌' : '✅'} {m.title}
              </Text>
            ))}
          </Card>
        )}
        <Button title={battery === 'C' ? 'Spara' : 'Spara mina nivåer'} onPress={save} style={{ paddingVertical: 16 }} />
        <Button title="‹ Ändra senaste svaret" variant="ghost" onPress={back} />
      </>,
    );
  }

  const stepNo = answered.length + 1;

  // ---------- Mobility step ----------
  if (battery === 'C' && mobility) {
    return shell(
      <>
        <Label>
          {stepNo} av {MOBILITY.length}
        </Label>
        <H1>{mobility.title}</H1>
        <Text style={{ color: t.text, fontSize: 17, lineHeight: 25 }}>{mobility.how}</Text>
        <Card>
          <Text style={{ color: t.muted, fontSize: 13 }}>Godkänt om</Text>
          <Text style={{ color: t.text, fontSize: 16, fontWeight: '600' }}>{mobility.pass}</Text>
        </Card>
        <Button title="✅ Klarar" onPress={() => setAnswered((a) => [...a, [mobility.id]])} style={{ paddingVertical: 16 }} />
        <Button
          title="❌ Klarar inte"
          variant="secondary"
          onPress={() => {
            setFailed((f) => [...f, mobility.id]);
            setAnswered((a) => [...a, [mobility.id]]);
          }}
          style={{ paddingVertical: 16 }}
        />
        {answered.length > 0 && <Button title="‹ Tillbaka" variant="ghost" onPress={back} />}
      </>,
    );
  }

  if (!current || !shown) return null;
  const media = shown.media ? mediaFor(shown.media) : {};
  const cantLabel = shown === current && current.alt ? `${current.skipLabel ?? 'Kan inte'} – visa lättare variant` : shown.skipLabel;

  // ---------- Guided step ----------
  return shell(
    <>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label>Test {stepNo}</Label>
        <Explain text={`${shown.title}: ${shown.how}`} context={`${title}, testet "${shown.title}"`} />
      </View>
      {(shown.noEquipment || shown !== current) && (
        <View style={{ backgroundColor: t.accentSoft, borderRadius: 12, padding: 12 }}>
          <Text style={{ color: t.text, fontSize: 14, lineHeight: 20 }}>
            {shown.noEquipment
              ? `Du har ingen utrustning för ${shown.replaces?.toLowerCase()} – det här testar samma sak hemma.`
              : `Ingen fara! Vi testar en lättare variant av ${current.title.toLowerCase()} – den blir din startnivå.`}
          </Text>
        </View>
      )}
      <H1>{shown.title}</H1>
      {media.anim && <Figure anim={media.anim} size={0.8} />}
      <Text style={{ color: t.text, fontSize: 17, lineHeight: 25 }}>{shown.how}</Text>
      {shown.media && <HowToToggle mediaKey={shown.media} label={media.anim ? 'Se video' : 'Se hur man gör'} />}

      {shown.kind === 'hold' ? (
        <Stopwatch key={shown.key} onDone={(sec) => answer(sec)} onSkip={cant} skipLabel={cantLabel} />
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10 }}>
          {shown.choices!.map((c) => (
            <Pressable
              key={c.label}
              onPress={() => answer(c.value)}
              style={({ pressed }) => ({
                flexGrow: 1,
                minWidth: '30%',
                paddingVertical: 18,
                borderRadius: 14,
                backgroundColor: pressed ? t.accentSoft : t.card,
                borderWidth: 2,
                borderColor: t.accent,
                alignItems: 'center',
              })}
            >
              <Text style={{ color: t.text, fontSize: 20, fontWeight: '800' }}>{c.label}</Text>
            </Pressable>
          ))}
        </View>
      )}
      {shown.kind === 'choice' && cantLabel && (
        <Pressable onPress={cant} hitSlop={8}>
          <Text style={{ color: t.muted, textAlign: 'center', fontWeight: '600' }}>{cantLabel}</Text>
        </Pressable>
      )}
      <Button title="‹ Tillbaka" variant="ghost" onPress={back} />
    </>,
  );
}
