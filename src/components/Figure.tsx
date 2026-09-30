import { useEffect, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Svg, { Circle, Ellipse, G, Line, Rect } from 'react-native-svg';

import { Anim, Pose, Prop, SEG, Vec } from '@/data/animations';
import { useTheme } from './ui';

const rad = (d: number) => (d * Math.PI) / 180;
const dir = (d: number): Vec => [Math.cos(rad(d)), Math.sin(rad(d))];
const add = (a: Vec, b: Vec, k = 1): Vec => [a[0] + b[0] * k, a[1] + b[1] * k];
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const lerpV = (a: Vec, b: Vec, t: number): Vec => [lerp(a[0], b[0], t), lerp(a[1], b[1], t)];
const ease = (t: number) => t * t * (3 - 2 * t);

/** Two-bone IK: returns [joint, end]. bend = +1 / −1 picks which side the joint goes. */
function ik(root: Vec, target: Vec, l1: number, l2: number, bend: number): [Vec, Vec] {
  const dx = target[0] - root[0];
  const dy = target[1] - root[1];
  const d = Math.min(Math.max(Math.hypot(dx, dy), Math.abs(l1 - l2) + 0.01), l1 + l2 - 0.01);
  const phi = Math.atan2(dy, dx);
  const a = Math.acos((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d));
  const joint: Vec = [root[0] + Math.cos(phi + bend * a) * l1, root[1] + Math.sin(phi + bend * a) * l1];
  return [joint, [root[0] + Math.cos(phi) * d, root[1] + Math.sin(phi) * d]];
}

function interpolate(anim: Anim, time: number): Pose {
  const keys = anim.keys;
  let i = 0;
  while (i < keys.length - 2 && time > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const t = b.t === a.t ? 0 : ease(Math.min(1, Math.max(0, (time - a.t) / (b.t - a.t))));
  const pa = a.pose;
  const pb = b.pose;
  const pick = <T,>(x: T, y: T) => (t < 0.5 ? x : y);
  return {
    at: lerpV(pa.at, pb.at, t),
    anchor: pa.anchor,
    trunk: lerp(pa.trunk, pb.trunk, t),
    head: lerp(pa.head ?? 0, pb.head ?? 0, t),
    hand: lerpV(pa.hand, pb.hand, t),
    hand2: lerpV(pa.hand2 ?? pa.hand, pb.hand2 ?? pb.hand, t),
    foot: lerpV(pa.foot, pb.foot, t),
    foot2: lerpV(pa.foot2 ?? pa.foot, pb.foot2 ?? pb.foot, t),
    elbow: pick(pa.elbow, pb.elbow),
    elbow2: pick(pa.elbow2 ?? pa.elbow, pb.elbow2 ?? pb.elbow),
    knee: pick(pa.knee, pb.knee),
    knee2: pick(pa.knee2 ?? pa.knee, pb.knee2 ?? pb.knee),
  };
}

function skeleton(p: Pose) {
  const d = dir(p.trunk);
  const hip = p.anchor === 'shoulder' ? add(p.at, d, -SEG.trunk) : p.at;
  const shoulder = p.anchor === 'shoulder' ? p.at : add(p.at, d, SEG.trunk);
  const hd = dir(p.trunk + (p.head ?? 0));
  const head = add(shoulder, hd, SEG.neck + SEG.head);
  const [elbow, hand] = ik(shoulder, p.hand, SEG.upperArm, SEG.forearm, p.elbow);
  const [elbow2, hand2] = ik(shoulder, p.hand2 ?? p.hand, SEG.upperArm, SEG.forearm, p.elbow2 ?? p.elbow);
  const [knee, foot] = ik(hip, p.foot, SEG.thigh, SEG.shin, p.knee);
  const [knee2, foot2] = ik(hip, p.foot2 ?? p.foot, SEG.thigh, SEG.shin, p.knee2 ?? p.knee);
  return { hip, shoulder, head, elbow, hand, elbow2, hand2, knee, foot, knee2, foot2 };
}

function PropShape({ prop, color }: { prop: Prop; color: string }) {
  switch (prop.type) {
    case 'floor':
      return <Line x1={-50} y1={prop.y} x2={250} y2={prop.y} stroke={color} strokeWidth={1.5} />;
    case 'bar':
      return <Circle cx={prop.x} cy={prop.y} r={2.2} fill={color} />;
    case 'rings':
      return (
        <G>
          <Line x1={prop.x} y1={-60} x2={prop.x} y2={prop.y - 3} stroke={color} strokeWidth={0.8} />
          <Circle cx={prop.x} cy={prop.y} r={3} stroke={color} strokeWidth={1.4} fill="none" />
        </G>
      );
    case 'wall':
      return <Rect x={prop.x} y={-60} width={6} height={prop.y + 60} fill={color} opacity={0.35} />;
    case 'box':
      return <Rect x={prop.x} y={prop.y} width={prop.w} height={prop.h} rx={1.5} fill={color} opacity={0.35} />;
    case 'pbars':
      return (
        <G>
          <Line x1={prop.x - 16} y1={prop.y} x2={prop.x + 16} y2={prop.y} stroke={color} strokeWidth={2.4} strokeLinecap="round" />
          <Line x1={prop.x - 12} y1={prop.y} x2={prop.x - 12} y2={prop.y + 60} stroke={color} strokeWidth={1.2} />
          <Line x1={prop.x + 12} y1={prop.y} x2={prop.x + 12} y2={prop.y + 60} stroke={color} strokeWidth={1.2} />
        </G>
      );
  }
}

export function Figure({ anim, size = 1, autoplay = true, time }: { anim: Anim; size?: number; autoplay?: boolean; time?: number }) {
  const t = useTheme();
  const [clock, setClock] = useState(0);
  const [playing, setPlaying] = useState(autoplay);
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing || time !== undefined) return;
    let raf = 0;
    const tick = (ts: number) => {
      if (last.current !== null) setClock((c) => (c + (ts - last.current!) / anim.duration) % 1);
      last.current = ts;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(raf);
      last.current = null;
    };
  }, [playing, anim.duration, time]);

  const s = skeleton(interpolate(anim, time ?? clock));
  const [vx, vy, vw, vh] = anim.viewBox ?? [0, 0, 120, 80];
  const floorY = anim.props.find((p): p is Extract<Prop, { type: 'floor' }> => p.type === 'floor')?.y;
  const body = t.text;
  const far = t.muted;
  const L = (a: Vec, b: Vec, color: string, w: number) => (
    <Line x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} stroke={color} strokeWidth={w} strokeLinecap="round" />
  );

  return (
    <Pressable onPress={() => setPlaying((p) => !p)} accessibilityLabel={`Animation: ${anim.title}. Tap to pause.`}>
      <View style={{ aspectRatio: vw / vh, width: `${size * 100}%`, alignSelf: 'center', backgroundColor: t.chip, borderRadius: 12, overflow: 'hidden' }}>
        <Svg width="100%" height="100%" viewBox={`${vx} ${vy} ${vw} ${vh}`}>
          {anim.props.map((p, i) => (
            <PropShape key={i} prop={p} color={t.muted} />
          ))}
          {/* Soft floor shadow under the lowest point */}
          {floorY !== undefined && (
            <Ellipse cx={(s.hip[0] + s.shoulder[0]) / 2} cy={floorY + 0.8} rx={18} ry={1.6} fill={t.text} opacity={0.08} />
          )}
          {/* Far limbs: lighter, drawn behind the torso */}
          {L(s.hip, s.knee2, far, 6.2)}
          {L(s.knee2, s.foot2, far, 5.2)}
          {L(s.shoulder, s.elbow2, far, 5)}
          {L(s.elbow2, s.hand2, far, 4.2)}
          {/* Torso: wide at the chest, narrower at the hip */}
          {L(s.hip, s.shoulder, body, 10)}
          {L(s.shoulder, s.shoulder, body, 11)}
          {L(s.hip, s.hip, body, 9)}
          <Circle cx={s.head[0]} cy={s.head[1]} r={SEG.head + 0.6} fill={body} />
          {/* Near limbs: accent colour, tapering towards hands and feet */}
          {L(s.hip, s.knee, t.accent, 6.6)}
          {L(s.knee, s.foot, t.accent, 5.4)}
          {L(s.shoulder, s.elbow, t.accent, 5.2)}
          {L(s.elbow, s.hand, t.accent, 4.4)}
        </Svg>
        {!playing && time === undefined && (
          <Text style={{ position: 'absolute', right: 8, bottom: 6, color: t.muted, fontSize: 12, fontWeight: '700' }}>⏸ paused</Text>
        )}
      </View>
    </Pressable>
  );
}
