# Calistudy

Mobilapp (iOS, Android och webb) för **The Complete Calisthenics System for an Intermediate Home Athlete (2026 Edition)** — en guide för calisthenics hemma. Källtexten ligger i [`docs/guide.md`](docs/guide.md).

Byggd med [Expo](https://expo.dev) (SDK 57), React Native och Expo Router. All data sparas lokalt på enheten (AsyncStorage); inget konto eller backend behövs.

## Funktioner

- **Idag** – dagens pass utifrån var du är i 12-veckorsprogrammet, dagsformskontroll (4 flaggor → åtgärd enligt återhämtningsalgoritmen), daglig mikroträning som checklista, veckans RIR-/hållningsparametrar och platåvarningar.
- **Program** – hela kalendern vecka 0–12 (testvecka, Block 1, deload + minitest, Block 2, deload + fullt omtest). Välj vecka och öppna valfritt pass. Startveckan kan flyttas.
- **Pass & träning** – uppvärmning, övningar med *din* nivå i varje stege, set/reps/vila/RIR/tempo/cue, veckojusterade set (−1 set vecka 1, +1 tillbehörsset v3–5 och v9–11, halverat i deload, ingen plyo i deload) och Block 2-reglerna. Logga reps/sekunder, RIR och smärta per set, med vilotimer som vibrerar.
- **Automatisk progression** – efter varje pass tillämpas guidens regler: toppen av intervallet 2 pass i rad → upp en nivå; set 1 under botten → ner; statiska hållningar (≥15 s) → testa nästa nivå; smärta ≥3/10 → −1 nivå och −30–50 % volym.
- **Nivåer** – 15 färdighetsstegar (push, pull, dips, handstående, planche, front/back lever, muscle-up, human flag, bål, enbensknäböj, höftfällning, knäflexion) med kriterier, vanliga fel och skaderisker.
- **Baslinjetest** – Test A (överkropp), B (underkropp + bål), C (rörlighet) och minitestet vecka 6. Resultaten placerar dig automatiskt på rätt nivå; underkända rörlighetstester läggs in i mikroträningen.
- **Logg** – historik över pass och tester.
- **Guide** – översikt, veckoupplägg, progressions-, platå- och återhämtningsalgoritmer, smärtregler och prehab, mikroträning, utrustning, långsiktig plan, videobibliotek och myter.

Gränssnittet är på svenska; övningsnamn, kriterier och cues är kvar på guidens engelska.

## Kom igång

```bash
npm install
npx expo start        # skanna QR-koden med Expo Go, eller tryck i / a / w
```

Kontroller:

```bash
npm run typecheck
npm run lint
```

Bygga för App Store / Google Play görs med EAS: `npx eas-cli@latest build`.

## Struktur

```
src/
  app/            Skärmar (Expo Router). (tabs)/ = flikarna, övriga = detaljvyer
  data/           Innehåll från guiden: ladders, sessions, program, tests, guide
  lib/            store (AsyncStorage), plan (veckojustering), progression (regler)
  components/     UI-komponenter
docs/guide.md     Originalguiden
```

> Guiden hänvisar till uppvärmningar i "Section 15" som inte beskrivs i detalj. Appens uppvärmningar bygger därför på Dag 1-uppvärmningen (Section 19) plus prehab-noten i Section 15.

Innehållet är till stor del indirekt evidens och coachkonsensus. Vid smärta över 5/10, skarp smärta eller svullnad: kontakta fysioterapeut eller läkare.
