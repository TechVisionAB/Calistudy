import { useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';

import { LADDER_BY_ID } from '@/data/ladders';
import { mediaFor, thumbnailUrl, youtubeUrl } from '@/data/media';
import { Figure } from './Figure';
import { Chip, Row, useTheme } from './ui';
import { YouTubePlayer } from './YouTubePlayer';

function levelName(code: string) {
  for (const l of Object.values(LADDER_BY_ID)) {
    const lvl = l.levels.find((x) => x.code === code);
    if (lvl) return lvl.name;
  }
  return undefined;
}

/** Animation + video demo for a level code or exercise key. */
export function HowTo({ mediaKey }: { mediaKey: string }) {
  const t = useTheme();
  const m = mediaFor(mediaKey);
  const [tab, setTab] = useState<'anim' | 'video'>(m.anim ? 'anim' : 'video');
  const [playing, setPlaying] = useState(false);
  if (!m.anim && !m.video) return null;

  return (
    <View style={{ gap: 8 }}>
      {m.anim && m.video && (
        <Row>
          <Chip text="Animation" tone={tab === 'anim' ? 'accent' : 'neutral'} onPress={() => setTab('anim')} />
          <Chip text="Video" tone={tab === 'video' ? 'accent' : 'neutral'} onPress={() => setTab('video')} />
        </Row>
      )}

      {tab === 'anim' && m.anim && (
        <>
          <Figure anim={m.anim} />
          <Text style={{ color: t.muted, fontSize: 13, lineHeight: 18 }}>{m.anim.caption}</Text>
        </>
      )}

      {tab === 'video' && m.video && (
        <>
          <View style={{ aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
            {playing ? (
              <YouTubePlayer id={m.video.id} />
            ) : (
              <Pressable onPress={() => setPlaying(true)} accessibilityLabel={`Spela video: ${m.video.title}`} style={{ flex: 1 }}>
                <Image source={{ uri: thumbnailUrl(m.video.id) }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <View style={{ width: 64, height: 44, borderRadius: 12, backgroundColor: 'rgba(0,0,0,0.7)', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#fff', fontSize: 22, marginLeft: 3 }}>▶</Text>
                  </View>
                </View>
              </Pressable>
            )}
          </View>
          <Text style={{ color: t.text, fontSize: 14, fontWeight: '600' }}>{m.video.title}</Text>
          {m.video.key !== mediaKey && levelName(m.video.key) && (
            <Text style={{ color: t.muted, fontSize: 13 }}>
              Visar närliggande nivå {m.video.key} ({levelName(m.video.key)}).
            </Text>
          )}
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.muted, fontSize: 13 }}>{m.video.channel} · YouTube</Text>
            <Pressable onPress={() => Linking.openURL(youtubeUrl(m.video!.id))} hitSlop={8}>
              <Text style={{ color: t.accent, fontSize: 13, fontWeight: '700' }}>Öppna i YouTube ↗</Text>
            </Pressable>
          </Row>
        </>
      )}
    </View>
  );
}

/** Collapsible "Se hur man gör" toggle. */
export function HowToToggle({ mediaKey, label = 'Se hur man gör' }: { mediaKey?: string; label?: string }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  if (!mediaKey) return null;
  const m = mediaFor(mediaKey);
  if (!m.anim && !m.video) return null;
  return (
    <View style={{ gap: 8 }}>
      <Pressable onPress={() => setOpen((o) => !o)} hitSlop={6} accessibilityRole="button">
        <Text style={{ color: t.accent, fontWeight: '700', fontSize: 14 }}>
          {open ? '▾' : '▶'} {label}
          <Text style={{ color: t.muted, fontWeight: '400' }}>
            {'  '}
            {[m.anim && 'animation', m.video && 'video'].filter(Boolean).join(' + ')}
          </Text>
        </Text>
      </Pressable>
      {open && <HowTo mediaKey={mediaKey} />}
    </View>
  );
}
