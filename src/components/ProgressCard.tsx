import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { unitLabel } from '@/lib/plan';
import { deltaAtLevel, Series } from '@/lib/progress';
import { ProgressChart } from './ProgressChart';
import { Card, Chip, Row, useTheme } from './ui';

export function ProgressCard({ series, showTitle = true }: { series: Series; showTitle?: boolean }) {
  const t = useTheme();
  const [table, setTable] = useState(false);
  const last = series.points[series.points.length - 1];
  const d = deltaAtLevel(series);
  const u = unitLabel(series.unit);

  return (
    <Card>
      {showTitle && <Text style={{ color: t.text, fontWeight: '700', fontSize: 16 }}>{series.title}</Text>}
      <Row>
        <Text style={{ color: t.text, fontSize: 22, fontWeight: '700' }}>
          {last.value} <Text style={{ fontSize: 14, fontWeight: '500', color: t.muted }}>{u} latest{last.level ? ` · ${last.level}` : ''}</Text>
        </Text>
      </Row>
      {d && (
        <Chip
          text={`${d.delta > 0 ? '+' : ''}${d.delta} ${u} at ${d.level ?? 'same exercise'} (${d.since} workouts)`}
          tone={d.delta > 0 ? 'good' : d.delta < 0 ? 'warn' : 'neutral'}
        />
      )}
      {series.points.length >= 2 ? (
        <ProgressChart points={series.points} unit={series.unit} />
      ) : (
        <Text style={{ color: t.muted, fontSize: 13 }}>Log one more workout to see a chart.</Text>
      )}
      <Pressable onPress={() => setTable((x) => !x)} hitSlop={6}>
        <Text style={{ color: t.accent, fontSize: 13, fontWeight: '700' }}>{table ? '▾ Hide table' : '▸ Show as table'}</Text>
      </Pressable>
      {table && (
        <View style={{ gap: 2 }}>
          {[...series.points].reverse().map((p, i) => (
            <Row key={i} style={{ justifyContent: 'space-between' }}>
              <Text style={{ color: t.muted, fontSize: 13 }}>{new Date(p.date).toLocaleDateString('en-GB')}</Text>
              <Text style={{ color: t.muted, fontSize: 13 }}>{p.level ?? ''}</Text>
              <Text style={{ color: t.text, fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] }}>
                {p.value} {u}
              </Text>
            </Row>
          ))}
        </View>
      )}
    </Card>
  );
}
