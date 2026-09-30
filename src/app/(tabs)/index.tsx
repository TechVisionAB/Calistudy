import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';

import { Bullets, Button, Card, Chip, H1, H2, Label, P, Row, Screen, useTheme } from '@/components/ui';
import { MICRO_PRACTICE, READINESS } from '@/data/guide';
import { blockOf, dayPlan, isoDate, mondayOf, programWeek, shiftDate, WEEK_PARAMS, WEEKDAYS, weekdayIndex } from '@/data/program';
import { SESSIONS } from '@/data/sessions';
import { DAY1_ORDER } from '@/data/tests';
import { plateaus } from '@/lib/progression';
import { useStore } from '@/lib/store';

export default function Today() {
  const { state, update, ready } = useStore();
  const t = useTheme();
  const [flags, setFlags] = useState<Record<string, boolean>>({});

  if (!ready) return <Screen><P muted>Laddar…</P></Screen>;

  if (!state.startMonday) {
    const start = (weeksAgo: number) => update((s) => ({ ...s, startMonday: shiftDate(mondayOf(), -7 * weeksAgo) }));
    return (
      <Screen>
        <H1>Välkommen till Calistudy</H1>
        <P muted>The Complete Calisthenics System for an Intermediate Home Athlete — som app.</P>
        <Card>
          <H2>Så funkar det</H2>
          <Bullets
            items={[
              'Vecka 0: baslinjetest som placerar dig på rätt nivå i varje färdighetsstege.',
              '12 veckor: två block à 5 veckor med deload vecka 6 och 12. Upper/Lower 4× i veckan.',
              'Daglig mikroträning 10–15 min för handstående, handleder, skulderblad och kompression.',
              'Appen loggar dina set och föreslår automatiskt när du ska gå upp eller ner en nivå.',
            ]}
          />
        </Card>
        <Button title="Börja med vecka 0 (test) denna vecka" onPress={() => start(0)} />
        <Button title="Jag har redan nivåer — börja på vecka 1" variant="secondary" onPress={() => start(1)} />
        <P muted>Du kan ändra startvecka när som helst under fliken Program.</P>
      </Screen>
    );
  }

  const week = programWeek(state.startMonday);
  const wd = weekdayIndex();
  const plan = dayPlan(week, wd);
  const today = isoDate(new Date());
  const microDone = state.micro[today] ?? [];
  const flagCount = Object.values(flags).filter(Boolean).length;
  const params = WEEK_PARAMS[week];
  const stuck = plateaus(state.workouts);
  const doneToday = state.workouts.find((w) => w.date.startsWith(today));

  const hardSession = plan.kind === 'session' && ['upperA', 'upperB', 'lowerA', 'lowerB'].includes(plan.session);
  const microBlocks = MICRO_PRACTICE.blocks.filter((b) => b.id !== 'mobility' || state.mobilityFails.length > 0);

  const toggleMicro = (id: string) =>
    update((s) => {
      const cur = s.micro[today] ?? [];
      return { ...s, micro: { ...s.micro, [today]: cur.includes(id) ? cur.filter((x) => x !== id) : [...cur, id] } };
    });

  return (
    <Screen>
      <View>
        <Label>
          {WEEKDAYS[wd]} · Vecka {week} · {blockOf(week)}
        </Label>
        <H1>
          {plan.kind === 'session'
            ? SESSIONS[plan.session].title + (plan.deload ? ' (deload)' : '')
            : plan.kind === 'test'
              ? plan.battery === 'mini'
                ? 'Minitest'
                : `Test ${plan.battery}`
              : plan.label}
        </H1>
      </View>

      {plan.kind === 'session' && (
        <Card>
          <P muted>{SESSIONS[plan.session].short} · {SESSIONS[plan.session].duration}</P>
          {plan.deload && <Chip text="Deload: ~halva seten, RIR 4, ingen plyo" tone="accent" />}
          {doneToday && <Chip text="✓ Pass loggat idag" tone="good" />}
          <Button
            title={hardSession ? 'Visa & starta pass' : 'Visa pass'}
            onPress={() => router.push({ pathname: '/session/[id]', params: { id: plan.session, week: String(week), flags: String(flagCount) } })}
          />
        </Card>
      )}

      {plan.kind === 'test' && (
        <Card>
          {plan.battery === 'A' && week === 0 && (
            <>
              <H2>Dag 1: gör detta nu</H2>
              <P muted>Uppvärmning 8 min, sedan testerna i denna ordning med 3–5 min vila:</P>
              <Bullets items={DAY1_ORDER.map((x, i) => `${i + 1}. ${x}`)} />
            </>
          )}
          {plan.extra && <P muted>{plan.extra}</P>}
          <Button
            title={plan.battery === 'mini' ? 'Öppna minitest' : `Öppna test ${plan.battery}`}
            onPress={() => router.push({ pathname: '/test/[battery]', params: { battery: plan.battery } })}
          />
        </Card>
      )}

      {hardSession && (
        <Card>
          <H2>Dagsform (30 s)</H2>
          {READINESS.questions.map((q) => (
            <Pressable key={q.id} onPress={() => setFlags((f) => ({ ...f, [q.id]: !f[q.id] }))} style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
              <View style={{ width: 22, height: 22, borderRadius: 6, borderWidth: 2, borderColor: flags[q.id] ? t.warn : t.border, backgroundColor: flags[q.id] ? t.warn : 'transparent' }} />
              <Text style={{ color: t.text, flex: 1, fontSize: 15 }}>{q.text}</Text>
            </Pressable>
          ))}
          <Chip text={`${flagCount} flagg${flagCount === 1 ? 'a' : 'or'}`} tone={flagCount === 0 ? 'good' : flagCount >= 3 ? 'warn' : 'accent'} />
          <P>{READINESS.actions[Math.min(flagCount, 3)]}</P>
        </Card>
      )}

      <Card>
          <Row style={{ justifyContent: 'space-between' }}>
            <H2>Mikroträning</H2>
            <Chip text={`${microDone.length}/${microBlocks.length}`} tone={microDone.length >= microBlocks.length ? 'good' : 'neutral'} />
          </Row>
          {(wd === 0 || wd === 3) && <P muted>Mån/tor ingår handståendet i passet — mikroträning ersätts.</P>}
          {wd === 6 && <P muted>Söndag: valfritt 5 min (handleder + skulderblad).</P>}
          {microBlocks.map((b) => {
            const on = microDone.includes(b.id);
            return (
              <Pressable key={b.id} onPress={() => toggleMicro(b.id)} style={{ flexDirection: 'row', gap: 10 }}>
                <View style={{ width: 22, height: 22, marginTop: 2, borderRadius: 11, borderWidth: 2, borderColor: on ? t.good : t.border, backgroundColor: on ? t.good : 'transparent' }} />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: t.text, fontWeight: '700', fontSize: 15 }}>
                    {b.title} <Text style={{ color: t.muted, fontWeight: '400' }}>· {b.duration}</Text>
                  </Text>
                  <Text style={{ color: t.muted, fontSize: 14, lineHeight: 20 }}>{b.content}</Text>
                </View>
              </Pressable>
            );
          })}
          <P muted style={{ fontSize: 13 }}>RPE ≤5–6, aldrig till failure. Avbryt om kvaliteten sjunker två försök i rad.</P>
      </Card>

      {week > 0 && params && (
        <Card>
          <H2>Veckans parametrar</H2>
          <P>Styrka RIR {params.strengthRir} · Hypertrofi RIR {params.hypertrophyRir}</P>
          <P>Statiska hållningar: {params.holds}</P>
          <P muted>{params.sets}{params.notes ? ` · ${params.notes}` : ''}</P>
        </Card>
      )}

      {stuck.length > 0 && (
        <Card onPress={() => router.push({ pathname: '/guide/[id]', params: { id: 'plateau' } })}>
          <H2>Möjlig platå</H2>
          <P muted>Ingen ökning på 3 pass i rad:</P>
          <Bullets items={stuck.map((s) => `${s.name}${s.level ? ` (${s.level})` : ''}`)} />
          <P style={{ color: t.accent, fontWeight: '700' }}>Öppna platåalgoritmen →</P>
        </Card>
      )}
    </Screen>
  );
}
