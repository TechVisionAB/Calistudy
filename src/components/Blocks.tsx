import { Linking, Pressable, Text, View } from 'react-native';

import { Block } from '@/data/guide';
import { Explain } from './Explain';
import { Bullets, H2, P, useTheme } from './ui';

export function Blocks({ blocks, context }: { blocks: Block[]; context?: string }) {
  const t = useTheme();
  return (
    <View style={{ gap: 12 }}>
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return <P key={i}>{b.text}</P>;
          case 'h':
            return <H2 key={i} style={{ marginTop: 8 }}>{b.text}</H2>;
          case 'list':
            return <Bullets key={i} items={b.items} />;
          case 'table':
            // Tables are rendered as stacked cards so they stay readable on a phone.
            return (
              <View key={i} style={{ gap: 8 }}>
                {b.rows.map((row, r) => (
                  <View key={r} style={{ backgroundColor: t.card, borderColor: t.border, borderWidth: 1, borderRadius: 12, padding: 12, gap: 4 }}>
                    <View style={{ flexDirection: 'row', gap: 8, alignItems: 'flex-start' }}>
                      <Text style={{ color: t.text, fontWeight: '700', fontSize: 15, flex: 1 }}>{row[0]}</Text>
                      <Explain text={row.join(' · ')} context={context ? `Guide: ${context}` : undefined} size={20} />
                    </View>
                    {row.slice(1).map((cell, c) => (
                      <Text key={c} style={{ color: t.text, fontSize: 14, lineHeight: 20 }}>
                        <Text style={{ color: t.muted, fontWeight: '600' }}>{b.head[c + 1]}: </Text>
                        {cell}
                      </Text>
                    ))}
                  </View>
                ))}
              </View>
            );
          case 'links':
            return (
              <View key={i} style={{ gap: 8 }}>
                {b.items.map((l) => (
                  <Pressable
                    key={l.url}
                    onPress={() => Linking.openURL(l.url)}
                    style={({ pressed }) => ({ backgroundColor: t.card, borderColor: t.border, borderWidth: 1, borderRadius: 12, padding: 12, gap: 2, opacity: pressed ? 0.7 : 1 })}
                  >
                    <Text style={{ color: t.accent, fontWeight: '700', fontSize: 15 }}>{l.title} ↗</Text>
                    <Text style={{ color: t.muted, fontSize: 13 }}>{l.source}</Text>
                    <Text style={{ color: t.text, fontSize: 14 }}>{l.cue}</Text>
                  </Pressable>
                ))}
              </View>
            );
        }
      })}
    </View>
  );
}
