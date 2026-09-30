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
- **Se hur man gör** – varje övning, nivå, uppvärmning och mikroträningsblock har en demo:
  - **Animationer:** 24 egna streckgubbsanimationer i SVG (push-up, pike, HSPU, dips, handstående, planche, pull-up, rodd, muscle-up, front lever, hollow, benlyft, L-sit, knäböj, split squat, bulgarisk, pistol, bridge, SL-RDL, Nordic). Samlade under Guide → Övningsdemos.
  - **Videor:** 86 instruktionsvideor från YouTube (FitnessFAQs, GMB, Antranik, Squat University, Calisthenicmovement m.fl.) som spelas inne i appen. Varje video-ID är kontrollerat mot YouTubes oEmbed. Saknar en nivå egen video visas närmaste lättare nivås video, med en markering om det.
- **Framsteg** – kurva per övning (bästa set per pass) med nivåbyten markerade, förändring på nuvarande nivå och tabellvy. Nås från Logg-fliken och från varje nivåstege.
- **Påminnelser** – morgonnotis med dagens faktiska pass och kvällsnotis om mikroträningen inte är avbockad. Planeras två veckor framåt och uppdateras automatiskt (Guide → Påminnelser).
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

## Testversion (Android)

```bash
npx eas-cli@latest init                                   # första gången: kopplar projektet till ditt Expo-konto
npx eas-cli@latest build --profile preview --platform android
```

Bygget tar 10–20 min i Expos moln. Du får en länk/QR-kod till en APK som testarna installerar direkt (de behöver tillåta installation från okänd källa). Profilen `preview` i `eas.json` ger intern distribution. iPhone kräver ett Apple-utvecklarkonto och registrerade enheter (eller TestFlight).

**Mätning:** testarna skickar Logg → 📤 Skicka testrapport (anonym veckostatistik + betyg + fritext) via valfri app. Nyckeltal: tränar de fortfarande vecka 3?

## Struktur

```
src/
  app/            Skärmar (Expo Router). (tabs)/ = flikarna, övriga = detaljvyer
  data/           Innehåll från guiden: ladders, sessions, program, tests, guide
                  + animations.ts (streckgubbar), videos.json (YouTube-ID:n), media.ts (uppslag)
  lib/            store (AsyncStorage), plan (veckojustering), progression (regler)
  components/     UI-komponenter
docs/guide.md     Originalguiden
```

> Guiden hänvisar till uppvärmningar i "Section 15" som inte beskrivs i detalj. Appens uppvärmningar bygger därför på Dag 1-uppvärmningen (Section 19) plus prehab-noten i Section 15.

Innehållet är till stor del indirekt evidens och coachkonsensus. Vid smärta över 5/10, skarp smärta eller svullnad: kontakta fysioterapeut eller läkare.
