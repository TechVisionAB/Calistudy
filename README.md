# Calistudy

Mobilapp (iOS, Android och webb) för **The Complete Calisthenics System for an Intermediate Home Athlete (2026 Edition)** — en guide för calisthenics hemma. Källtexten ligger i [`docs/guide.md`](docs/guide.md).

Byggd med [Expo](https://expo.dev) (SDK 57), React Native och Expo Router. All data sparas lokalt på enheten (AsyncStorage); inget konto eller backend behövs.

## Funktioner

**Kom igång på 30 sekunder:** tre frågor (erfarenhet, utrustning, börja direkt eller testa först). Appen uppskattar startnivåer och byter ut övningar du saknar utrustning för – t.ex. bordsrodd i stället för ringrodd.

**Idag = nästa pass**, inte en låst veckodag: missar du måndag blir Överkropp A nästa pass. Appen håller isär överkropps- och benpass (≥44 h vila), visar en veckoring (4 pass) och en streak (veckor i rad med minst 3 pass).

**Passet en övning i taget:** uppvärmning → övning med animation, mål ("3 × 5–8 reps · Lagom – 2 reps kvar"), stor räknare, stoppur för hållningar, Lätt/Lagom/Tungt, smärtknapp → vila i helskärm → nästa. Supersets varvas automatiskt. Efteråt: sammanfattning och "Ny nivå! 🎉" när det är dags.

Allt på svenska i klarspråk; guidens originaltermer (RIR, tempo, Block 2-regler) finns under "Visa detaljer".

- **Idag** – dagens pass utifrån var du är i 12-veckorsprogrammet, dagsformskontroll (4 flaggor → åtgärd enligt återhämtningsalgoritmen), daglig mikroträning som checklista, veckans RIR-/hållningsparametrar och platåvarningar.
- **Program** – hela kalendern vecka 0–12 (testvecka, Block 1, deload + minitest, Block 2, deload + fullt omtest). Välj vecka och öppna valfritt pass. Startveckan kan flyttas.
- **Pass & träning** – uppvärmning, övningar med *din* nivå i varje stege, set/reps/vila/RIR/tempo/cue, veckojusterade set (−1 set vecka 1, +1 tillbehörsset v3–5 och v9–11, halverat i deload, ingen plyo i deload) och Block 2-reglerna. Logga reps/sekunder, RIR och smärta per set, med vilotimer som vibrerar.
- **Automatisk progression** – efter varje pass tillämpas guidens regler: toppen av intervallet 2 pass i rad → upp en nivå; set 1 under botten → ner; statiska hållningar (≥15 s) → testa nästa nivå; smärta ≥3/10 → −1 nivå och −30–50 % volym.
- **Nivåer** – 15 färdighetsstegar (push, pull, dips, handstående, planche, front/back lever, muscle-up, human flag, bål, enbensknäböj, höftfällning, knäflexion) med kriterier, vanliga fel och skaderisker.
- **Tester (guidade)** – överkropp, ben + bål, rörlighet och minitestet vecka 6. En övning i taget med animation: stora knappar för antal ("5–9") eller stoppur för hållningar; följdtester (t.ex. tuck planche) visas bara när resultatet gör dem relevanta. Knappvärdena är intervallens nedre gräns, så guidens placeringsregler ger samma nivå som exakta siffror. Underkända rörlighetstester läggs in i mikroträningen.
- **Se hur man gör** – varje övning, nivå, uppvärmning och mikroträningsblock har en demo:
  - **Animationer:** 24 egna streckgubbsanimationer i SVG (push-up, pike, HSPU, dips, handstående, planche, pull-up, rodd, muscle-up, front lever, hollow, benlyft, L-sit, knäböj, split squat, bulgarisk, pistol, bridge, SL-RDL, Nordic). Samlade under Guide → Övningsdemos.
  - **Muskler:** muskelkarta fram/bak (gratis MIT-biblioteket react-native-body-highlighter) med huvudmuskler, hjälpmuskler och leder som inte ska göra ont, plus "✅ Här ska det kännas / ⛔ Här ska det INTE kännas" per rörelse (`src/data/anatomy.ts`, baserat på guidens muskel- och skadeanteckningar).
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

## AI-coach

Chatten (💬 uppe till höger, och "Fråga AI-coachen" i varje ?-ruta) svarar utifrån hela guiden, appens funktioner och användarens nivåer/senaste pass. ?-knapparna fungerar utan internet (ordlista i `src/data/glossary.ts`); chatten kräver servern nedan.

API-nyckeln får aldrig ligga i appen, så anropen går via en Supabase Edge Function (`supabase/functions/coach`):

```bash
node scripts/build-coach-knowledge.mjs          # bygger coachens kunskap från guiden + README
supabase functions deploy coach
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

Sätt sedan `EXPO_PUBLIC_COACH_URL` och `EXPO_PUBLIC_COACH_KEY` i `.env` (se `.env.example`). Modell: Claude Opus 5.5 med effort `low` och cachad systemprompt (~30k tokens guide). Före publik lansering: lägg till inloggning/rate limiting så att ingen annan kan använda funktionen på er bekostnad.

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
