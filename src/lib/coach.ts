import { LADDERS } from '@/data/ladders';
import { SESSION_SV, LEVEL_SV } from '@/data/sv';
import { nextUp, weekProgress } from './next';
import { State } from './store';

// Set in .env (see .env.example). Without a URL the chat shows setup instructions
// and the offline "?" explanations still work.
const URL = process.env.EXPO_PUBLIC_COACH_URL;
const KEY = process.env.EXPO_PUBLIC_COACH_KEY;

export const coachEnabled = !!URL;

export type ChatMsg = { role: 'user' | 'assistant'; content: string };

// The conversation lives for the app session, so leaving and reopening the chat keeps it.
let chat: ChatMsg[] = [];
export const getChat = () => chat;
export const setChat = (msgs: ChatMsg[]) => {
  chat = msgs;
};

/** What the coach should know about this user right now (sent with each question). */
export function appContext(state: State, screen?: string): string {
  const p = weekProgress(state);
  const n = nextUp(state);
  const levels = LADDERS.map((l) => `${l.id}: ${state.levels[l.id]} (${LEVEL_SV[state.levels[l.id]] ?? ''})`).join(', ');
  const last = [...state.workouts]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 3)
    .map((w) => `${w.date.slice(0, 10)} ${SESSION_SV[w.session]?.title ?? w.session}: ${w.entries.map((e) => `${e.level ?? e.name} ${e.sets.map((s) => s.value ?? '–').join('/')}`).join('; ')}`)
    .join('\n');
  return [
    `${state.track === 'starter' ? 'Plan: Starter (3 short full-body workouts/week), starter week' : 'Plan: full program, week'} ${p.week} (workouts done this week: ${p.done.length}/${p.goal})`,
    `Next in the app: ${n.kind === 'session' ? SESSION_SV[n.session].title : n.kind === 'test' ? `test ${n.battery}` : n.kind}`,
    `Experience: ${state.profile?.experience ?? 'unknown'} · Equipment: ${state.profile?.equipment.join(', ') || 'none'}`,
    `Levels: ${levels}`,
    last && `Recent workouts:\n${last}`,
    screen && `The user is looking at:\n${screen}`,
  ]
    .filter(Boolean)
    .join('\n');
}

export async function askCoach(messages: ChatMsg[], context: string): Promise<string> {
  if (!URL) throw new Error('The coach is not enabled.');
  const res = await fetch(URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(KEY ? { Authorization: `Bearer ${KEY}`, apikey: KEY } : {}),
    },
    body: JSON.stringify({ messages, context }),
  });
  const data = (await res.json().catch(() => ({}))) as { reply?: string; error?: string };
  if (!res.ok || !data.reply) throw new Error(data.error ?? `Error ${res.status}`);
  return data.reply;
}
