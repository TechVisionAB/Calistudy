import * as Speech from 'expo-speech';
import { useCallback } from 'react';

import { useStore } from './store';

/** Speak a short cue, cutting off whatever was being said (cues must stay in sync with the timer). */
export function speak(text: string) {
  Speech.stop();
  Speech.speak(text, { language: 'en-US', rate: 1.0 });
}

/** `const say = useVoice(); say('Rest 90 seconds')` — silent when the voice coach is off. */
export function useVoice() {
  const { state } = useStore();
  const on = state.settings.voice;
  return useCallback((text: string) => {
    if (on) speak(text);
  }, [on]);
}

/** "90 seconds", "2 minutes", "1 minute 30" — how a coach would say it. */
export function spokenDuration(secs: number): string {
  if (secs < 60) return `${secs} seconds`;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  const mins = m === 1 ? '1 minute' : `${m} minutes`;
  return s ? `${mins} ${s}` : mins;
}
