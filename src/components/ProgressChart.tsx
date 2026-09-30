import { useState } from 'react';
import { LayoutChangeEvent, Platform, Pressable, Text, View } from 'react-native';
import Svg, { Circle, Line, Path, Rect, Text as SvgText } from 'react-native-svg';

import { unitLabel } from '@/lib/plan';
import { Point } from '@/lib/progress';
import { Unit } from '@/data/sessions';
import { useTheme } from './ui';

const H = 150;
// SVG text defaults to a serif face on web; match the app's sans everywhere.
const FONT = Platform.OS === 'web' ? 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' : undefined;
const PAD = { top: 14, right: 12, bottom: 22, left: 30 };

function niceMax(v: number): number {
  if (v <= 5) return 5;
  const step = Math.pow(10, Math.floor(Math.log10(v)));
  for (const m of [1, 2, 2.5, 5, 10]) if (m * step >= v) return m * step;
  return 10 * step;
}

const shortDate = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });

/**
 * Single-series line of best set per workout. Level changes are marked with a
 * hairline + level code, since values are only comparable within one level.
 * Tap a point for its value.
 */
export function ProgressChart({ points, unit }: { points: Point[]; unit: Unit }) {
  const t = useTheme();
  const [w, setW] = useState(0);
  const [sel, setSel] = useState<number | null>(null);
  const onLayout = (e: LayoutChangeEvent) => setW(e.nativeEvent.layout.width);

  const max = niceMax(Math.max(...points.map((p) => p.value)));
  const iw = Math.max(1, w - PAD.left - PAD.right);
  const ih = H - PAD.top - PAD.bottom;
  const x = (i: number) => PAD.left + (points.length === 1 ? iw / 2 : (i / (points.length - 1)) * iw);
  const y = (v: number) => PAD.top + ih - (v / max) * ih;
  const ticks = [0, max / 2, max];

  // Break the line where the level changes: a harder level resets the numbers.
  let d = '';
  points.forEach((p, i) => {
    const newSeg = i === 0 || p.level !== points[i - 1].level;
    d += `${newSeg ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)} `;
  });
  const levelStarts = points.map((p, i) => (i > 0 && p.level !== points[i - 1].level ? i : -1)).filter((i) => i > 0);
  const last = points.length - 1;
  const selP = sel !== null ? points[sel] : null;

  return (
    <View onLayout={onLayout} style={{ height: H }}>
      {w > 0 && (
        <Svg width={w} height={H}>
          {ticks.map((v) => (
            <Line key={v} x1={PAD.left} x2={w - PAD.right} y1={y(v)} y2={y(v)} stroke={t.grid} strokeWidth={1} />
          ))}
          {ticks.map((v) => (
            <SvgText fontFamily={FONT} key={`l${v}`} x={PAD.left - 6} y={y(v) + 4} fontSize={10} fill={t.muted} textAnchor="end">
              {Number.isInteger(v) ? v : v.toFixed(1)}
            </SvgText>
          ))}
          {levelStarts.map((i) => (
            <Line key={`lv${i}`} x1={(x(i) + x(i - 1)) / 2} x2={(x(i) + x(i - 1)) / 2} y1={PAD.top} y2={PAD.top + ih} stroke={t.grid} strokeWidth={1} />
          ))}
          {levelStarts.map((i) => (
            <SvgText fontFamily={FONT} key={`lt${i}`} x={(x(i) + x(i - 1)) / 2 + 3} y={PAD.top + 8} fontSize={10} fill={t.muted}>
              {points[i].level}
            </SvgText>
          ))}
          <Path d={d} stroke={t.series} strokeWidth={2} fill="none" strokeLinejoin="round" strokeLinecap="round" />
          {points.map((p, i) => (
            <Circle key={i} cx={x(i)} cy={y(p.value)} r={i === last || i === sel ? 4.5 : 3} fill={t.series} stroke={t.card} strokeWidth={2} />
          ))}
          {/* End label: latest value only — the rest is in the tooltip. */}
          <SvgText fontFamily={FONT} x={Math.min(x(last), w - PAD.right)} y={y(points[last].value) - 9} fontSize={11} fontWeight="700" fill={t.text} textAnchor={points.length === 1 ? 'middle' : 'end'}>
            {points[last].value}
          </SvgText>
          <SvgText fontFamily={FONT} x={PAD.left} y={H - 6} fontSize={10} fill={t.muted}>
            {shortDate(points[0].date)}
          </SvgText>
          {points.length > 1 && (
            <SvgText fontFamily={FONT} x={w - PAD.right} y={H - 6} fontSize={10} fill={t.muted} textAnchor="end">
              {shortDate(points[last].date)}
            </SvgText>
          )}
          {/* Hit targets wider than the marks. */}
          {points.map((_, i) => (
            <Rect
              key={`h${i}`}
              x={x(i) - Math.max(12, iw / points.length / 2)}
              y={PAD.top}
              width={Math.max(24, iw / points.length)}
              height={ih}
              fill="transparent"
              onPress={() => setSel(sel === i ? null : i)}
            />
          ))}
          {sel !== null && <Line x1={x(sel)} x2={x(sel)} y1={PAD.top} y2={PAD.top + ih} stroke={t.muted} strokeWidth={1} />}
        </Svg>
      )}
      {selP && sel !== null && (
        <Pressable
          onPress={() => setSel(null)}
          style={{
            position: 'absolute',
            top: 0,
            left: Math.min(Math.max(0, x(sel) - 70), Math.max(0, w - 140)),
            width: 140,
            backgroundColor: t.text,
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 5,
          }}
        >
          <Text style={{ color: t.bg, fontSize: 12, fontWeight: '700' }}>
            {selP.value} {unitLabel(unit)}
            {selP.level ? ` · ${selP.level}` : ''}
          </Text>
          <Text style={{ color: t.bg, fontSize: 11 }}>{new Date(selP.date).toLocaleDateString('en-GB')}</Text>
        </Pressable>
      )}
    </View>
  );
}
