import { ReactNode } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextStyle, useColorScheme, View, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const light = {
  bg: '#F4F5F7',
  card: '#FFFFFF',
  text: '#101418',
  muted: '#5B6470',
  border: '#E3E6EA',
  accent: '#E8590C',
  accentSoft: '#FFE8D9',
  good: '#2B8A3E',
  goodSoft: '#E3F5E7',
  warn: '#C92A2A',
  warnSoft: '#FDE7E7',
  chip: '#EEF0F3',
};

const dark: typeof light = {
  bg: '#0E1116',
  card: '#171B22',
  text: '#F1F3F5',
  muted: '#98A2B0',
  border: '#262C36',
  accent: '#FF7A2E',
  accentSoft: '#3A2518',
  good: '#51CF66',
  goodSoft: '#16301D',
  warn: '#FF6B6B',
  warnSoft: '#3A1C1C',
  chip: '#222833',
};

export type Theme = typeof light;

export function useTheme(): Theme {
  return useColorScheme() === 'dark' ? dark : light;
}

export function Screen({ children, scroll = true }: { children: ReactNode; scroll?: boolean }) {
  const t = useTheme();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right']}>
      {scroll ? (
        <ScrollView contentContainerStyle={styles.screen} keyboardShouldPersistTaps="handled">
          {children}
        </ScrollView>
      ) : (
        <View style={[styles.screen, { flex: 1 }]}>{children}</View>
      )}
    </SafeAreaView>
  );
}

export function Card({ children, style, onPress }: { children: ReactNode; style?: ViewStyle; onPress?: () => void }) {
  const t = useTheme();
  const base = [styles.card, { backgroundColor: t.card, borderColor: t.border }, style];
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [...base, pressed && { opacity: 0.7 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={base}>{children}</View>;
}

export function H1({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.h1, { color: t.text }]}>{children}</Text>;
}

export function H2({ children, style }: { children: ReactNode; style?: TextStyle }) {
  const t = useTheme();
  return <Text style={[styles.h2, { color: t.text }, style]}>{children}</Text>;
}

export function P({ children, muted, style }: { children: ReactNode; muted?: boolean; style?: TextStyle }) {
  const t = useTheme();
  return <Text style={[styles.p, { color: muted ? t.muted : t.text }, style]}>{children}</Text>;
}

export function Label({ children }: { children: ReactNode }) {
  const t = useTheme();
  return <Text style={[styles.label, { color: t.muted }]}>{children}</Text>;
}

export function Button({
  title,
  onPress,
  variant = 'primary',
  disabled,
  style,
}: {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  disabled?: boolean;
  style?: ViewStyle;
}) {
  const t = useTheme();
  const bg = variant === 'primary' ? t.accent : variant === 'danger' ? t.warnSoft : variant === 'secondary' ? t.chip : 'transparent';
  const fg = variant === 'primary' ? '#FFFFFF' : variant === 'danger' ? t.warn : variant === 'ghost' ? t.accent : t.text;
  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [styles.button, { backgroundColor: bg, opacity: disabled ? 0.4 : pressed ? 0.75 : 1 }, style]}
    >
      <Text style={[styles.buttonText, { color: fg }]}>{title}</Text>
    </Pressable>
  );
}

export function Chip({ text, tone = 'neutral', onPress }: { text: string; tone?: 'neutral' | 'accent' | 'good' | 'warn'; onPress?: () => void }) {
  const t = useTheme();
  const map = {
    neutral: [t.chip, t.muted],
    accent: [t.accentSoft, t.accent],
    good: [t.goodSoft, t.good],
    warn: [t.warnSoft, t.warn],
  } as const;
  const [bg, fg] = map[tone];
  return (
    <Pressable onPress={onPress} disabled={!onPress} style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.chipText, { color: fg }]}>{text}</Text>
    </Pressable>
  );
}

export function Row({ children, style }: { children: ReactNode; style?: ViewStyle }) {
  return <View style={[styles.row, style]}>{children}</View>;
}

export function Bullets({ items }: { items: string[] }) {
  const t = useTheme();
  return (
    <View style={{ gap: 6 }}>
      {items.map((it, i) => (
        <View key={i} style={{ flexDirection: 'row', gap: 8 }}>
          <Text style={{ color: t.accent, lineHeight: 21 }}>•</Text>
          <Text style={[styles.p, { color: t.text, flex: 1 }]}>{it}</Text>
        </View>
      ))}
    </View>
  );
}

export function Stepper({ value, onChange, step = 1, width = 44 }: { value: number | null; onChange: (v: number | null) => void; step?: number; width?: number }) {
  const t = useTheme();
  const v = value ?? 0;
  return (
    <View style={[styles.stepper, { borderColor: t.border }]}>
      <Pressable hitSlop={6} onPress={() => onChange(Math.max(0, v - step))} style={styles.stepBtn}>
        <Text style={[styles.stepTxt, { color: t.accent }]}>−</Text>
      </Pressable>
      <Text style={[styles.stepVal, { color: value === null ? t.muted : t.text, width }]}>{value === null ? '–' : value}</Text>
      <Pressable hitSlop={6} onPress={() => onChange(value === null ? step : v + step)} style={styles.stepBtn}>
        <Text style={[styles.stepTxt, { color: t.accent }]}>+</Text>
      </Pressable>
    </View>
  );
}

export const styles = StyleSheet.create({
  screen: { padding: 16, gap: 12, paddingBottom: 40 },
  card: { borderRadius: 14, borderWidth: StyleSheet.hairlineWidth, padding: 14, gap: 8 },
  h1: { fontSize: 26, fontWeight: '800', letterSpacing: -0.5 },
  h2: { fontSize: 17, fontWeight: '700' },
  p: { fontSize: 15, lineHeight: 21 },
  label: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6 },
  button: { borderRadius: 12, paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center' },
  buttonText: { fontSize: 15, fontWeight: '700' },
  chip: { borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  chipText: { fontSize: 12, fontWeight: '700' },
  row: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap' },
  stepper: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 10 },
  stepBtn: { paddingHorizontal: 10, paddingVertical: 6 },
  stepTxt: { fontSize: 20, fontWeight: '700' },
  stepVal: { textAlign: 'center', fontSize: 16, fontWeight: '700', fontVariant: ['tabular-nums'] },
});
