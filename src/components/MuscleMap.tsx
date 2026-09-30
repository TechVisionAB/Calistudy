import { Text, useColorScheme, View } from 'react-native';
import Body, { ExtendedBodyPart } from 'react-native-body-highlighter';

import { Anatomy, anatomyFor } from '@/data/anatomy';
import { useTheme } from './ui';

const PRIMARY = '#E03131';
const SECONDARY = '#FF922B';
const WARN = '#7950F2';

function parts(a: Anatomy): ExtendedBodyPart[] {
  // Warnings are drawn last so a joint that is also "working" (e.g. forearm) shows as a warning.
  const map = new Map<string, string>();
  a.secondary.forEach((s) => map.set(s, SECONDARY));
  a.primary.forEach((s) => map.set(s, PRIMARY));
  a.warnAt.forEach((s) => {
    if (!a.primary.includes(s)) map.set(s, WARN);
  });
  return [...map.entries()].map(([slug, color]) => ({ slug: slug as ExtendedBodyPart['slug'], color }));
}

function Dot({ color, label }: { color: string; label: string }) {
  const t = useTheme();
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
      <View style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: color }} />
      <Text style={{ color: t.muted, fontSize: 12 }}>{label}</Text>
    </View>
  );
}

/** Front + back body with working muscles and "shouldn't hurt" areas, plus plain-language cues. */
export function MuscleMap({ mediaKey }: { mediaKey?: string }) {
  const t = useTheme();
  const dark = useColorScheme() === 'dark';
  const a = anatomyFor(mediaKey);
  if (!a) return null;
  const data = parts(a);
  const base = dark ? '#3a404b' : '#d7dbe0';

  return (
    <View style={{ gap: 10 }}>
      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 4, backgroundColor: t.chip, borderRadius: 12, paddingVertical: 8 }}>
        <Body data={data} side="front" scale={0.62} defaultFill={base} border="none" />
        <Body data={data} side="back" scale={0.62} defaultFill={base} border="none" />
      </View>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
        <Dot color={PRIMARY} label="Jobbar mest" />
        <Dot color={SECONDARY} label="Hjälper till" />
        <Dot color={WARN} label="Ska inte göra ont" />
      </View>
      <Text style={{ color: t.text, fontSize: 15, lineHeight: 21 }}>
        <Text style={{ fontWeight: '700' }}>✅ Här ska det kännas: </Text>
        {a.feel}
      </Text>
      <Text style={{ color: t.text, fontSize: 15, lineHeight: 21 }}>
        <Text style={{ fontWeight: '700' }}>⛔ Här ska det INTE kännas: </Text>
        {a.notFeel}
      </Text>
    </View>
  );
}
