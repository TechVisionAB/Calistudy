import { useState } from 'react';
import { Image, Linking, Pressable, Text, View } from 'react-native';

import { LADDER_BY_ID } from '@/data/ladders';
import { mediaFor, thumbnailUrl, youtubeUrl } from '@/data/media';
import { anatomyFor } from '@/data/anatomy';
import { useUnits } from '@/lib/units';
import { Figure } from './Figure';
import { MuscleMap } from './MuscleMap';
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
  const u = useUnits();
  const m = mediaFor(mediaKey);
  const anatomy = anatomyFor(mediaKey);
  const [tab, setTab] = useState<'anim' | 'muscles' | 'video'>(m.anim ? 'anim' : anatomy ? 'muscles' : 'video');
  const [playing, setPlaying] = useState(false);
  if (!m.anim && !m.video && !anatomy) return null;
  type Tab = 'anim' | 'muscles' | 'video';
  const tabs: [Tab, string][] = [];
  if (m.anim) tabs.push(['anim', 'Animation']);
  if (anatomy) tabs.push(['muscles', 'Muscles']);
  if (m.video) tabs.push(['video', 'Video']);

  return (
    <View style={{ gap: 8 }}>
      {tabs.length > 1 && (
        <Row>
          {tabs.map(([id, label]) => (
            <Chip key={id} text={label} tone={tab === id ? 'accent' : 'neutral'} onPress={() => setTab(id)} />
          ))}
        </Row>
      )}

      {tab === 'muscles' && <MuscleMap mediaKey={mediaKey} />}

      {tab === 'anim' && m.anim && (
        <>
          <Figure anim={m.anim} />
          <Text style={{ color: t.muted, fontSize: 13, lineHeight: 18 }}>{u(m.anim.caption)}</Text>
        </>
      )}

      {tab === 'video' && m.video && (
        <>
          <View style={{ aspectRatio: 16 / 9, borderRadius: 12, overflow: 'hidden', backgroundColor: '#000' }}>
            {playing ? (
              <YouTubePlayer id={m.video.id} />
            ) : (
              <Pressable onPress={() => setPlaying(true)} accessibilityLabel={`Play video: ${m.video.title}`} style={{ flex: 1 }}>
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
              Showing nearby level {m.video.key} ({levelName(m.video.key)}).
            </Text>
          )}
          <Row style={{ justifyContent: 'space-between' }}>
            <Text style={{ color: t.muted, fontSize: 13 }}>{m.video.channel} · YouTube</Text>
            <Pressable onPress={() => Linking.openURL(youtubeUrl(m.video!.id))} hitSlop={8}>
              <Text style={{ color: t.accent, fontSize: 13, fontWeight: '700' }}>Open in YouTube ↗</Text>
            </Pressable>
          </Row>
        </>
      )}
    </View>
  );
}

/** Collapsible "How to do it" toggle. */
export function HowToToggle({ mediaKey, label = 'How to do it' }: { mediaKey?: string; label?: string }) {
  const t = useTheme();
  const [open, setOpen] = useState(false);
  if (!mediaKey) return null;
  const m = mediaFor(mediaKey);
  const anatomy = anatomyFor(mediaKey);
  if (!m.anim && !m.video && !anatomy) return null;
  return (
    <View style={{ gap: 8 }}>
      <Pressable onPress={() => setOpen((o) => !o)} hitSlop={6} accessibilityRole="button">
        <Text style={{ color: t.accent, fontWeight: '700', fontSize: 14 }}>
          {open ? '▾' : '▶'} {label}
          <Text style={{ color: t.muted, fontWeight: '400' }}>
            {'  '}
            {[m.anim && 'animation', anatomy && 'muscles', m.video && 'video'].filter(Boolean).join(' · ')}
          </Text>
        </Text>
      </Pressable>
      {open && <HowTo mediaKey={mediaKey} />}
    </View>
  );
}
