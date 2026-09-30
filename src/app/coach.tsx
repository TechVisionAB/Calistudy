import { Stack, useLocalSearchParams } from 'expo-router';
import { useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Card, Chip, P, Row, styles, useTheme } from '@/components/ui';
import { appContext, askCoach, ChatMsg, coachEnabled, getChat, setChat } from '@/lib/coach';
import { useStore } from '@/lib/store';

const SUGGESTIONS = [
  'What do RIR and Easy/Just right/Hard mean?',
  'Why is week 6 easier?',
  'How do I know when to move up a level?',
  'What should I do if my wrist hurts?',
];

export default function Coach() {
  const { context, q } = useLocalSearchParams<{ context?: string; q?: string }>();
  const { state } = useStore();
  const t = useTheme();
  const [msgs, setMsgs] = useState<ChatMsg[]>(getChat);
  const [input, setInput] = useState(q ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroll = useRef<ScrollView>(null);

  const send = async (text: string) => {
    const content = text.trim();
    if (!content || busy) return;
    const next: ChatMsg[] = [...msgs, { role: 'user', content }];
    setMsgs(next);
    setChat(next);
    setInput('');
    setError(null);
    setBusy(true);
    try {
      const reply = await askCoach(next, appContext(state, context));
      const withReply: ChatMsg[] = [...next, { role: 'assistant', content: reply }];
      setMsgs(withReply);
      setChat(withReply);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.');
    } finally {
      setBusy(false);
      setTimeout(() => scroll.current?.scrollToEnd({ animated: true }), 50);
    }
  };

  const clear = () => {
    setChat([]);
    setMsgs([]);
    setError(null);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: t.bg }} edges={['left', 'right', 'bottom']}>
      <Stack.Screen
        options={{
          title: 'AI coach',
          headerRight: () =>
            msgs.length ? (
              <Pressable onPress={clear} hitSlop={10}>
                <Text style={{ color: t.accent, fontWeight: '700' }}>New chat</Text>
              </Pressable>
            ) : null,
        }}
      />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
        <ScrollView ref={scroll} contentContainerStyle={styles.screen} onContentSizeChange={() => scroll.current?.scrollToEnd({ animated: false })}>
          {!coachEnabled && (
            <Card>
              <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>The AI coach isn’t enabled yet</Text>
              <P muted>
                It needs a server with an API key (see README → AI coach). Until then, the ? buttons in the app explain the terms offline.
              </P>
            </Card>
          )}
          {msgs.length === 0 && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: t.text, fontSize: 22, fontWeight: '800' }}>Ask anything 💬</Text>
              <P muted>The coach knows the whole program, the exercises and the app – and can see your levels and recent workouts.</P>
              {context && (
                <Card>
                  <Text style={{ color: t.muted, fontSize: 13 }}>You’re asking about:</Text>
                  <Text style={{ color: t.text, fontSize: 14 }} numberOfLines={4}>
                    {context}
                  </Text>
                </Card>
              )}
              <Row>
                {SUGGESTIONS.map((s) => (
                  <Chip key={s} text={s} onPress={() => send(s)} />
                ))}
              </Row>
            </View>
          )}
          {msgs.map((m, i) => (
            <View
              key={i}
              style={{
                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '88%',
                backgroundColor: m.role === 'user' ? t.accent : t.card,
                borderColor: t.border,
                borderWidth: m.role === 'user' ? 0 : 1,
                borderRadius: 16,
                paddingHorizontal: 14,
                paddingVertical: 10,
              }}
            >
              <Text selectable style={{ color: m.role === 'user' ? '#fff' : t.text, fontSize: 15, lineHeight: 22 }}>
                {m.content}
              </Text>
            </View>
          ))}
          {busy && (
            <Row>
              <ActivityIndicator color={t.accent} />
              <Text style={{ color: t.muted }}>The coach is thinking…</Text>
            </Row>
          )}
          {error && <Text style={{ color: t.warn }}>{error}</Text>}
        </ScrollView>

        <View style={{ flexDirection: 'row', gap: 8, padding: 12, borderTopWidth: 1, borderColor: t.border, backgroundColor: t.card }}>
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder={coachEnabled ? 'Type a question…' : 'The coach is not enabled'}
            placeholderTextColor={t.muted}
            editable={coachEnabled}
            multiline
            onSubmitEditing={() => send(input)}
            style={{ flex: 1, color: t.text, fontSize: 16, maxHeight: 120, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 18, backgroundColor: t.chip }}
          />
          <Pressable
            onPress={() => send(input)}
            disabled={!coachEnabled || busy || !input.trim()}
            style={{ width: 44, height: 44, borderRadius: 22, backgroundColor: t.accent, alignItems: 'center', justifyContent: 'center', opacity: !coachEnabled || busy || !input.trim() ? 0.4 : 1 }}
            accessibilityLabel="Send"
          >
            <Text style={{ color: '#fff', fontSize: 20, fontWeight: '800' }}>↑</Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
