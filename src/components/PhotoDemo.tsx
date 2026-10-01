import { useEffect, useState } from 'react';
import { Image, Pressable, Text, View } from 'react-native';

import { fallbackUrls, photoFor } from '@/data/photos';
import { useTheme } from './ui';

const FRAME_MS = 900;

type Props = { mediaKey?: string; compact?: boolean; onFail?: () => void };

/**
 * Two real exercise photos (start / end position) alternating like a GIF.
 * Both images are rendered stacked and only the opacity is toggled, so they stay
 * loaded and the swap doesn't flicker. Tap to pause. Renders nothing if no photo
 * exists or both hosts fail to load (onFail lets a parent fall back to something else).
 */
export function PhotoDemo(props: Props) {
  // Keyed so all state (frame, loaded, fallback) resets when the exercise changes.
  return <PhotoDemoInner key={props.mediaKey ?? ''} {...props} />;
}

function PhotoDemoInner({ mediaKey, compact, onFail }: Props) {
  const t = useTheme();
  const photo = photoFor(mediaKey);
  const [frame, setFrame] = useState<0 | 1>(0);
  const [playing, setPlaying] = useState(true);
  const [useFallback, setUseFallback] = useState(false);
  const [failed, setFailed] = useState(false);
  const [loaded, setLoaded] = useState([false, false]);

  const ready = loaded[0] && loaded[1];
  useEffect(() => {
    if (!playing || !ready || failed) return;
    const id = setInterval(() => setFrame((f) => (f === 0 ? 1 : 0)), FRAME_MS);
    return () => clearInterval(id);
  }, [playing, ready, failed]);

  if (!photo || failed) return null;
  const urls = useFallback ? fallbackUrls(photo.id) : photo.urls;

  const onError = () => {
    if (!useFallback) {
      setUseFallback(true);
      setLoaded([false, false]);
    } else {
      setFailed(true);
      onFail?.();
    }
  };

  return (
    <View style={{ gap: 4, width: compact ? '70%' : '100%', alignSelf: 'center' }}>
      <Pressable
        onPress={() => setPlaying((p) => !p)}
        accessibilityRole="button"
        accessibilityLabel={`Photos: ${photo.name}. Tap to ${playing ? 'pause' : 'play'}.`}
      >
        <View style={{ aspectRatio: 850 / 567, borderRadius: 12, overflow: 'hidden', backgroundColor: t.chip }}>
          {urls.map((uri, i) => (
            <Image
              key={uri}
              source={{ uri }}
              resizeMode="cover"
              onLoad={() => setLoaded((l) => (i === 0 ? [true, l[1]] : [l[0], true]))}
              onError={onError}
              style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: frame === i ? 1 : 0 }}
            />
          ))}
          {!playing && (
            <View style={{ position: 'absolute', right: 6, bottom: 6, backgroundColor: 'rgba(0,0,0,0.55)', borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 }}>
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: '700' }}>⏸ paused</Text>
            </View>
          )}
        </View>
      </Pressable>
      <Text style={{ color: t.muted, fontSize: compact ? 10 : 11 }}>Photo: Free Exercise DB (public domain)</Text>
    </View>
  );
}
