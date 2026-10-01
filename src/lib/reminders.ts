import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { isoDate, programWeek, weekdayIndex } from '@/data/program';
import { SESSION_SV, TEST_SV } from '@/data/sv';
import { nextUp, upcoming } from './next';
import { isStarter, starterWeek } from './starter';
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
      name: 'Workout reminders',
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
    if (n.kind === 'session') return `${SESSION_SV[n.session].title} today: ${SESSION_SV[n.session].short.toLowerCase()}.`;
    if (n.kind === 'test') return `${TEST_SV[n.battery]} today. Test when well rested.`;
    if (n.kind === 'rest') return `Rest day – 10 min of micro-practice is enough.`;
    return null;
  }
  return 'Time to train? Open the app to see today\'s workout.';
}

/** "Tomorrow: Full body B – split squat, pike push-up …" for tonight's reminder. */
function tomorrowText(state: State): string | null {
  const up = upcoming(state);
  if (!up || up.dayOffset !== 1) return null;
  const n = up.next;
  if (n.kind === 'test') return `Tomorrow: ${TEST_SV[n.battery]}.`;
  return `Tomorrow: ${SESSION_SV[n.session].title} – ${SESSION_SV[n.session].short.toLowerCase()}.`;
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
    const starter = isStarter(state);
    const week = starter ? starterWeek(state, day) : programWeek(state.startMonday, day);
    const wd = weekdayIndex(day);

    if (morning.enabled) {
      const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), morning.hour, morning.minute);
      const body = morningText(state, i);
      if (body && at > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: starter ? `Calistudy · Starter week ${week}` : `Calistudy · week ${week}`, body },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
    }

    // Tonight: a peek at tomorrow's workout (only known for certain for today).
    const tomorrow = i === 0 && evening.enabled ? tomorrowText(state) : null;
    if (tomorrow) {
      const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), evening.hour, evening.minute);
      if (at > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Up next', body: tomorrow },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
        continue;
      }
    }

    if (evening.enabled && !starter && microDay(wd)) {
      const at = new Date(day.getFullYear(), day.getMonth(), day.getDate(), evening.hour, evening.minute);
      const done = (state.micro[isoDate(day)] ?? []).length > 0;
      if (!done && at > now) {
        await Notifications.scheduleNotificationAsync({
          content: { title: 'Micro-practice', body: 'Have you done today\'s 10 min? Wrists, shoulder blades, handstand and compression.' },
          trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: at, channelId: CHANNEL },
        });
      }
    }
  }
}
