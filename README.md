# Calistudy

Mobile app (iOS, Android and web) for **The Complete Calisthenics System for an Intermediate Home Athlete (2026 Edition)** — a guide to calisthenics at home. The source text is in [`docs/guide.md`](docs/guide.md).

Built with [Expo](https://expo.dev) (SDK 57), React Native and Expo Router. All data is stored locally on the device (AsyncStorage); no account or backend is needed.

## Features

**Get started in 30 seconds:** three questions (experience, equipment, how to start). Beginners get the **Starter plan** by default. The app estimates starting levels and swaps out exercises you lack the equipment for – e.g. table rows instead of ring rows.

**Starter plan (for complete beginners):** 3 full-body workouts a week, ≈30 min, 5 basics (squat, push-up, row, bridge, core) that alternate between Full body A and B with a rest day in between. Training starts on day one, no test week. Handstand prep and planche lean unlock in week 3. Starter uses the bottom rungs of the guide's ladders, so levels and progression carry straight over. After 6 weeks + 15 workouts + basic levels (floor push-ups, split squats, rows) the app suggests moving to the full program (with or without tests). Switch any time in Settings.

**In the workout:** guided warm-up one step at a time (own photo/video per step, timer or rep target). A **voice coach** (expo-speech, toggle in Settings) calls out rest, "10 seconds", "3, 2, 1", "Go! Push-up, 6 to 12 reps", hold targets and the next exercise. The rest screen keeps people going: progress ("Halfway there! 🎉 · about 12 min left"), last set's result ("Matching it is a win"), a photo preview of the next exercise and calm tips. **⇄ Swap it** on every exercise: one level easier, or an equipment-free alternative (table row, door towel row, chair dips, knee push-up …) – never just "skip".

**Up next:** Today shows the next workout or test after today ("Tomorrow: Full body B · ≈30 min – Split squat · Pike push-up · …"), and the evening reminder says what's on tomorrow.

**Early wins:** personal records after every workout ("Push-up: 9 reps +2"), 13 badges (first workout, full week, first floor push-up, first pull-up, 4-week streak …), and a "You vs. day one" comparison on the Progress screen and Today.

**Settings (⚙️):** training plan (Starter/Full), units (metric/imperial – cm and kg in guide text are converted), currency for price tips (USD/EUR/GBP/SEK), profile, reminders and reset.

**Today = the next workout**, not a locked weekday: if you miss Monday, Upper A becomes the next workout. The app keeps upper-body and leg workouts apart (≥44 h rest), shows a week ring (4 workouts) and a streak (weeks in a row with at least 3 workouts).

**The workout one exercise at a time:** warm-up → exercise with animation, target ("3 × 5–8 reps · Just right – 2 reps left"), big counter, stopwatch for holds, Easy/Just right/Hard, pain button → full-screen rest → next. Supersets alternate automatically. Afterwards: a summary and "New level! 🎉" when it's time.

Everything in plain English; the guide's original terms (RIR, tempo, Block 2 rules) are under "Show details".

- **Today** – today's workout based on where you are in the 12-week program, a readiness check (4 flags → action according to the recovery algorithm), daily micro-practice as a checklist, the week's RIR/hold parameters and plateau warnings.
- **Program** – the full calendar, weeks 0–12 (test week, Block 1, deload + mini test, Block 2, deload + full retest). Pick a week and open any workout. The start week can be moved.
- **Workouts & training** – warm-up, exercises at *your* level on each ladder, sets/reps/rest/RIR/tempo/cue, week-adjusted sets (−1 set in week 1, +1 accessory set in w3–5 and w9–11, halved in deload, no plyo in deload) and the Block 2 rules. Log reps/seconds, RIR and pain per set, with a rest timer that vibrates.
- **Automatic progression** – after each workout the guide's rules are applied: top of the range 2 workouts in a row → up one level; set 1 below the bottom → down; static holds (≥15 s) → test the next level; pain ≥3/10 → −1 level and −30–50% volume.
- **Levels** – 15 skill ladders (push, pull, dips, handstand, planche, front/back lever, muscle-up, human flag, core, single-leg squat, hip hinge, knee flexion) with criteria, common faults and injury risks.
- **Tests (guided)** – upper body, legs + core, mobility and the week 6 mini test. One exercise at a time with animation: big buttons for counts ("5–9") or a stopwatch for holds; follow-up tests (e.g. tuck planche) are only shown when the result makes them relevant. The button values are the lower bounds of the ranges, so the guide's placement rules give the same level as exact numbers. Failed mobility tests are added to micro-practice.
- **How to do it** – every exercise, level, warm-up and micro-practice block has a demo:
  - **Photos (shown first):** real start/end photos for ~40 levels, exercises and warm-up steps, alternating like a GIF (`src/data/photos.ts`). Credit: [Free Exercise DB](https://github.com/yuhonas/free-exercise-db) by yuhonas, public domain (Unlicense), served via jsDelivr.
  - **Animations:** 24 custom stick-figure animations in SVG (push-up, pike, HSPU, dips, handstand, planche, pull-up, row, muscle-up, front lever, hollow, leg raise, L-sit, squat, split squat, Bulgarian, pistol, bridge, SL-RDL, Nordic). Collected under Guide → Exercise demos.
  - **Muscles:** front/back muscle map (the free MIT library react-native-body-highlighter) with primary muscles, assisting muscles and joints that should not hurt, plus "✅ You should feel it here / ⛔ You should NOT feel it here" per movement (`src/data/anatomy.ts`, based on the guide's muscle and injury notes).
  - **Videos:** 86 instructional videos from YouTube (FitnessFAQs, GMB, Antranik, Squat University, Calisthenicmovement and others) that play inside the app. Every video ID has been checked against YouTube's oEmbed. If a level has no video of its own, the video for the nearest easier level is shown, with a note saying so.
- **Progress** – a chart per exercise (best set per workout) with level changes marked, change at the current level, and a table view. Reached from the Log tab and from each level ladder.
- **Reminders** – a morning notification with the day's actual workout and an evening notification if micro-practice hasn't been checked off. Scheduled two weeks ahead and updated automatically (Guide → Reminders).
- **Log** – history of workouts and tests.
- **Guide** – overview, weekly structure, progression, plateau and recovery algorithms, pain rules and prehab, micro-practice, equipment, long-term plan, video library and myths.

The interface is in English and uses the guide's exercise names, criteria and cues.

## Getting started

```bash
npm install
npx expo start        # scan the QR code with Expo Go, or press i / a / w
```

Checks:

```bash
npm run typecheck
npm run lint
```

Builds for the App Store / Google Play are made with EAS: `npx eas-cli@latest build`.

## Test build (Android)

```bash
npx eas-cli@latest init                                   # first time: links the project to your Expo account
npx eas-cli@latest build --profile preview --platform android
```

The build takes 10–20 min in Expo's cloud. You get a link/QR code to an APK that testers install directly (they need to allow installs from unknown sources). The `preview` profile in `eas.json` gives internal distribution. iPhone requires an Apple developer account and registered devices (or TestFlight).

**Measurement:** testers send Log → 📤 Send test report (anonymous weekly stats + rating + free text) via any app. Key metric: are they still training in week 3?

## AI coach

The chat (💬 top right, and "Ask the AI coach" in every ? box) answers based on the whole guide, the app's features and the user's levels/recent workouts. The ? buttons work offline (glossary in `src/data/glossary.ts`); the chat requires the server below.

The API key must never live in the app, so calls go through a Supabase Edge Function (`supabase/functions/coach`):

```bash
node scripts/build-coach-knowledge.mjs          # builds the coach's knowledge from the guide + README
supabase functions deploy coach
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

Then set `EXPO_PUBLIC_COACH_URL` and `EXPO_PUBLIC_COACH_KEY` in `.env` (see `.env.example`). Model: Claude Opus 5.5 with effort `low` and a cached system prompt (~30k tokens of guide). Before a public launch: add sign-in/rate limiting so that nobody else can use the function at your expense.

## Structure

```
src/
  app/            Screens (Expo Router). (tabs)/ = the tabs, others = detail views
  data/           Content from the guide: ladders, sessions, program, tests, guide
                  + animations.ts (stick figures), videos.json (YouTube IDs), media.ts (lookup)
  lib/            store (AsyncStorage), plan (weekly adjustment), progression (rules)
  components/     UI components
docs/guide.md     The original guide
```

> The guide refers to warm-ups in "Section 15" that are not described in detail. The app's warm-ups are therefore based on the Day 1 warm-up (Section 19) plus the prehab note in Section 15.

The content is largely indirect evidence and coaching consensus. With pain above 5/10, sharp pain or swelling: see a physiotherapist or doctor.
