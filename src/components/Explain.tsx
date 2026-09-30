import { router } from 'expo-router';
import { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { explain } from '@/data/glossary';
import { Button, useTheme } from './ui';

/**
 * A small "?" that explains the jargon and level codes in `text`, with a shortcut
 * to ask the AI coach about it. `context` tells the coach what the user is looking at.
 */
export function Explain({ text, context, size = 22 }: { text: string; context?: string; size?: number }) {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const [open, setOpen] = useState(false);
  const found = open ? explain(text) : [];

  const ask = () => {
    setOpen(false);
    router.push({ pathname: '/coach', params: { context: `${context ? context + '\n' : ''}Texten: "${text}"`, q: 'Förklara det här enkelt för mig.' } });
  };

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={10}
        accessibilityLabel="Förklara"
        style={{ width: size, height: size, borderRadius: size / 2, borderWidth: 1.5, borderColor: t.accent, alignItems: 'center', justifyContent: 'center' }}
      >
        <Text style={{ color: t.accent, fontSize: size * 0.6, fontWeight: '800', lineHeight: size * 0.75 }}>?</Text>
      </Pressable>
      <Modal visible={open} transparent animationType="slide" onRequestClose={() => setOpen(false)}>
        <Pressable style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.35)' }} onPress={() => setOpen(false)} />
        <View style={{ backgroundColor: t.card, borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 16, paddingBottom: 16 + insets.bottom, maxHeight: '75%', gap: 12 }}>
          <View style={{ alignSelf: 'center', width: 40, height: 5, borderRadius: 3, backgroundColor: t.grid }} />
          <Text style={{ color: t.muted, fontSize: 14, fontStyle: 'italic' }}>“{text}”</Text>
          <ScrollView contentContainerStyle={{ gap: 12 }}>
            {found.length === 0 && <Text style={{ color: t.text, fontSize: 15 }}>Inga kända termer här – fråga coachen!</Text>}
            {found.map((f) => (
              <View key={f.term} style={{ gap: 2 }}>
                <Text style={{ color: t.text, fontSize: 16, fontWeight: '700' }}>{f.term}</Text>
                <Text style={{ color: t.text, fontSize: 15, lineHeight: 21 }}>{f.text}</Text>
              </View>
            ))}
          </ScrollView>
          <Button title="💬 Fråga AI-coachen om detta" onPress={ask} />
          <Button title="Stäng" variant="ghost" onPress={() => setOpen(false)} />
        </View>
      </Modal>
    </>
  );
}
