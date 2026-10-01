import { Text, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { SessionId } from '@/data/sessions';
import { SESSION_SV } from '@/data/sv';
import { useTheme } from './ui';

const SIZE = 92;
const STROKE = 9;
const R = (SIZE - STROKE) / 2;
const C = 2 * Math.PI * R;

/** Weekly goal ring: segments per planned session, filled as they are done. */
export function WeekRing({ order, done, streak }: { order: SessionId[]; done: SessionId[]; streak: number }) {
  const t = useTheme();
  const n = order.length;
  const gap = n > 1 ? 6 : 0;
  const seg = C / n - gap;
  // Match done sessions one-to-one, so a plan with repeats (Full body A, B, A) fills correctly.
  const left = [...done];
  const filled = order.map((s) => {
    const i = left.indexOf(s);
    if (i === -1) return false;
    left.splice(i, 1);
    return true;
  });
  const count = filled.filter(Boolean).length;
  const complete = count >= n;

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
      <View style={{ width: SIZE, height: SIZE }}>
        <Svg width={SIZE} height={SIZE} style={{ transform: [{ rotate: '-90deg' }] }}>
          {order.map((s, i) => (
            <Circle
              key={i}
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={R}
              stroke={filled[i] ? (complete ? t.good : t.series) : t.grid}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={`${seg} ${C - seg}`}
              strokeDashoffset={-(i * (seg + gap))}
            />
          ))}
        </Svg>
        <View style={{ position: 'absolute', inset: 0, alignItems: 'center', justifyContent: 'center' }}>
          <Text style={{ color: t.text, fontSize: 22, fontWeight: '800' }}>
            {count}/{n}
          </Text>
          <Text style={{ color: t.muted, fontSize: 11 }}>workouts</Text>
        </View>
      </View>
      <View style={{ flex: 1, gap: 4 }}>
        {order.map((s, i) => (
          <Text key={i} style={{ color: filled[i] ? t.text : t.muted, fontSize: 14, fontWeight: filled[i] ? '700' : '400' }}>
            {filled[i] ? '✓' : '○'} {SESSION_SV[s].title}
          </Text>
        ))}
        {streak > 0 && (
          <Text style={{ color: t.accent, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
            🔥 {streak} {streak === 1 ? 'week' : 'weeks'} in a row
          </Text>
        )}
      </View>
    </View>
  );
}
