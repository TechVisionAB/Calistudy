import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { isoDate, programWeek, weekdayIndex } from '@/data/program';
import { SESSION_SV, TEST_SV } from '@/data/sv';
import { nextUp } from './next';
import { State } from './store';

const CHANNEL = 'reminders';
const DAYS_AHEAD = 14;

export const remindersSupported = Platform.OS === 'ios' || Platform.OS === 'android';

if (remindersSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldPlaySound: false,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
}

/** Asks for permission (creating the Android channel first, which the prompt requires). */
export async function ensurePermission(): Promise<boolean> {
  if (!remindersSupported) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Träningspåminnelser',
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

/** Today's text follows the actual next session; later days get a neutral nudge. */
function morningText(state: State, dayOffset: number): string | null {
  const n = nextUp(state);
  if (dayOffset === 0) {
    if (n.kind === 'session') return `${SESSION_SV[n.session].title} idag: ${SESSION_SV[n.session].short.toLowerCase()}.`;
    if (n.kind === 'test') return `${TEST_SV[n.battery]} idag. Testa utvilad.`;
    if (n.kind === 'rest') return `Vilodag – 10 min mikroträning räcker.`;
    return null;
  }
  return 'Dags att träna? Öppna appen så ser du dagens pass.';
}

/** Micro-practice is part of the Upper A/B sessions (Mon/Thu) and optional on Sunday. */
const microDay = (weekday: number) => weekday !== 0 && weekday !== 3 && weekday !== 6;

/**
 * Replaces all scheduled reminders with one notification per day for the next two
 * weeks, each with that day's actual plan. Re-run whenever the plan or settings change.
 */
export async function reschedule(state: State): Promise<void> {
  if (!remindersSupported) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  const { morning, evening } = state.reminders;
  if (!state.startMonday || (!morning.enabled && !evening.enabled)) return;
  const perm = await Notifications.getPermissionsAsync();
  if (!perm.granted) return;

  const now = new Date();
  for (let i = 0; i < DAYS_AHEAD; i++) {
    const day = new Date(now.getFullYear(), now.getMonth(), now.getDate() + i);
    const week = programWeek(state.startMonday, day);
    const wd = weekdayIndex(day);

    if (morning.enabled) {
      const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), morning.hour, morning.minute);
      const body = morningText(state, i);
      if (body && at > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: `Calistudy · vecka ${week}`, body },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
    }

    if (evening.enabled && microDay(wd)) {
      const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), evening.hour, evening.minute);
      const done = (state.micro[isoDate(day)] ?? []).length > 0;
      if (!done && at > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Mikroträning', body: 'Har du hunnit med dagens 10 min? Handleder, skulderblad, handstående och kompression.' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
    }
  }
}
