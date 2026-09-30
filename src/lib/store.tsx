import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';

import { LADDERS } from '@/data/ladders';
import { SessionId, Unit } from '@/data/sessions';
import { TestBattery } from '@/data/program';
import { Equip } from '@/data/sv';
import { Values } from '@/data/tests';

export type SetLog = { value: number | null; rir: number | null; pain: number | null };

export type EntryLog = {
  slot: string;
  name: string;
  ladder?: string;
  level?: string;
  unit: Unit;
  min: number;
  max: number;
  sets: SetLog[];
};

export type WorkoutLog = {
  id: string;
  date: string;
  week: number;
  session: SessionId;
  deload: boolean;
  flags: number;
  entries: EntryLog[];
  notes?: string;
};

export type TestLog = { id: string; date: string; battery: TestBattery; values: Values; failed?: string[] };

export type ReminderTime = { enabled: boolean; hour: number; minute: number };

export type Reminders = { morning: ReminderTime; evening: ReminderTime };

export type Experience = 'new' | 'some' | 'solid';

export type Profile = { experience: Experience; equipment: Equip[] };

export type State = {
  profile: Profile | null;
  startMonday: string | null;
  levels: Record<string, string>;
  workouts: WorkoutLog[];
  tests: TestLog[];
  micro: Record<string, string[]>;
  mobilityFails: string[];
  reminders: Reminders;
};

const KEY = 'calistudy/state/v1';

const defaultLevels = () => Object.fromEntries(LADDERS.map((l) => [l.id, l.levels[0].code]));

const initial: State = {
  profile: null,
  startMonday: null,
  levels: defaultLevels(),
  workouts: [],
  tests: [],
  micro: {},
  mobilityFails: [],
  reminders: {
    morning: { enabled: false, hour: 7, minute: 30 },
    evening: { enabled: false, hour: 19, minute: 0 },
  },
};

type Ctx = {
  state: State;
  ready: boolean;
  update: (fn: (s: State) => State) => void;
  setLevel: (ladder: string, code: string) => void;
  reset: () => void;
};

const StoreContext = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<State>(initial);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(KEY)
      .then((raw) => {
        if (raw) {
          const saved = JSON.parse(raw) as Partial<State>;
          setState({ ...initial, ...saved, levels: { ...defaultLevels(), ...saved.levels } });
        }
      })
      .catch(() => {})
      .finally(() => setReady(true));
  }, []);

  useEffect(() => {
    if (ready) AsyncStorage.setItem(KEY, JSON.stringify(state)).catch(() => {});
  }, [state, ready]);

  const update = useCallback((fn: (s: State) => State) => setState(fn), []);
  const setLevel = useCallback(
    (ladder: string, code: string) => setState((s) => ({ ...s, levels: { ...s.levels, [ladder]: code } })),
    [],
  );
  const reset = useCallback(() => setState({ ...initial, levels: defaultLevels() }), []);

  const value = useMemo(() => ({ state, ready, update, setLevel, reset }), [state, ready, update, setLevel, reset]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): Ctx {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}

export const newId = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
