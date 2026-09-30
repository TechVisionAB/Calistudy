// Muscle map + "feel it here / not here" per movement pattern. Muscles follow the guide's
// own "Muscles" lines (Section 5) where it gives them; joint warnings follow its injury notes.
// Slugs are react-native-body-highlighter body parts.
import { LEVEL_ANIM } from './animations';

export type Slug =
  | 'abs' | 'adductors' | 'ankles' | 'biceps' | 'calves' | 'chest' | 'deltoids' | 'feet' | 'forearm' | 'gluteal'
  | 'hamstring' | 'hands' | 'knees' | 'lower-back' | 'neck' | 'obliques' | 'quadriceps' | 'tibialis' | 'trapezius'
  | 'triceps' | 'upper-back';

export type Anatomy = {
  primary: Slug[];
  secondary: Slug[];
  /** Joints/areas that should NOT hurt — highlighted as warnings. */
  warnAt: Slug[];
  feel: string;
  notFeel: string;
};

const A = (primary: Slug[], secondary: Slug[], warnAt: Slug[], feel: string, notFeel: string): Anatomy => ({ primary, secondary, warnAt, feel, notFeel });

export const ANATOMY: Record<string, Anatomy> = {
  pushup: A(['chest', 'triceps', 'deltoids'], ['abs', 'obliques'], ['hands'], 'Bröstet, framsidan av axlarna och baksidan av armarna. Magen jobbar för att hålla kroppen rak.', 'Handlederna eller framsidan av axelleden. Gör det ont i handlederna – använd knytnävar eller parallettes.'),
  incline: A(['chest', 'triceps', 'deltoids'], ['abs'], ['hands'], 'Bröstet och baksidan av armarna.', 'Handlederna.'),
  pseudo: A(['deltoids', 'chest', 'triceps'], ['biceps', 'abs', 'forearm'], ['hands', 'forearm'], 'Framsidan av axlarna och bröstet – mer axlar än vanliga armhävningar.', 'Handlederna eller armbågsvecket.'),
  pike: A(['deltoids', 'triceps'], ['trapezius', 'chest'], ['neck', 'hands'], 'Axlarna och baksidan av armarna.', 'Nacken – sänk huvudet kontrollerat, landa aldrig hårt på huvudet.'),
  hspu: A(['deltoids', 'triceps'], ['trapezius', 'chest', 'abs'], ['neck', 'hands'], 'Axlarna och baksidan av armarna.', 'Nacken eller handlederna.'),
  dip: A(['chest', 'triceps', 'deltoids'], ['abs'], ['deltoids'], 'Nedre bröstet och baksidan av armarna.', 'Framsidan av axelleden eller bröstbenet. Gör det ont – gå inte lika djupt.'),
  handstand: A(['deltoids', 'trapezius'], ['triceps', 'abs', 'forearm'], ['hands', 'neck'], 'Axlarna och toppen av ryggen som trycker dig uppåt, magen som håller dig rak.', 'Handlederna eller nacken.'),
  lean: A(['deltoids', 'chest'], ['biceps', 'abs', 'forearm'], ['hands', 'forearm'], 'Framsidan av axlarna och magen.', 'Armbågsvecket eller handlederna.'),
  tuckPlanche: A(['deltoids', 'chest', 'abs'], ['biceps', 'triceps', 'forearm', 'trapezius'], ['forearm', 'hands'], 'Framsidan av axlarna, bröstet och magen.', 'Armbågsvecket (bicepssenan) eller handlederna – sluta direkt om det gör ont där.'),
  pullup: A(['upper-back', 'biceps'], ['forearm', 'trapezius', 'deltoids'], ['forearm'], 'Ryggen (lats) under armhålorna och biceps.', 'Insidan av armbågen. Byt grepp om det gör ont.'),
  row: A(['upper-back', 'trapezius', 'biceps'], ['deltoids', 'forearm'], ['forearm'], 'Mitten av ryggen mellan skulderbladen och biceps.', 'Utsidan av armbågen.'),
  muscleUp: A(['upper-back', 'chest', 'triceps'], ['biceps', 'deltoids', 'abs', 'forearm'], ['forearm', 'hands'], 'Ryggen i draget, bröst och triceps i pressen upp.', 'Armbågar och handleder – max 20 reps per pass.'),
  frontLever: A(['upper-back', 'abs'], ['deltoids', 'gluteal', 'trapezius'], ['forearm'], 'Ryggen (lats), magen och sätet som håller kroppen rak.', 'Armbågsvecket.'),
  backLever: A(['deltoids', 'chest', 'biceps'], ['abs', 'lower-back', 'gluteal'], ['forearm', 'deltoids'], 'Framsidan av axlarna och bröstet i en töjd position.', 'Armbågsvecket eller framsidan av axeln – gå väldigt långsamt fram.'),
  flag: A(['obliques', 'upper-back', 'deltoids'], ['abs', 'triceps'], ['deltoids'], 'Sidan av magen och ryggen/axlarna.', 'Axelleden.'),
  hollow: A(['abs'], ['obliques', 'quadriceps'], ['lower-back'], 'Hela magen.', 'Ländryggen – släpper den från golvet, böj knäna mer.'),
  legRaise: A(['abs', 'obliques'], ['quadriceps', 'forearm'], ['lower-back'], 'Nedre delen av magen och höftböjarna.', 'Ländryggen.'),
  lsit: A(['abs', 'quadriceps', 'triceps'], ['deltoids', 'obliques'], ['hands'], 'Magen, framsidan av låren och armarna som trycker ner.', 'Handlederna.'),
  squat: A(['quadriceps', 'gluteal'], ['adductors', 'calves'], ['knees'], 'Framsidan av låren och sätet.', 'Knäna – knäna ska peka åt samma håll som tårna.'),
  splitSquat: A(['quadriceps', 'gluteal'], ['adductors', 'hamstring', 'calves'], ['knees'], 'Framsidan av låret och sätet på det främre benet.', 'Knät.'),
  bss: A(['quadriceps', 'gluteal'], ['adductors', 'hamstring'], ['knees'], 'Framsidan av låret och sätet på det främre benet.', 'Knät eller ljumsken på det bakre benet.'),
  boxPistol: A(['quadriceps', 'gluteal'], ['calves', 'abs', 'adductors'], ['knees', 'ankles'], 'Framsidan av låret och sätet.', 'Knät eller fotleden.'),
  pistol: A(['quadriceps', 'gluteal'], ['calves', 'abs', 'adductors'], ['knees', 'ankles'], 'Framsidan av låret och sätet.', 'Knät eller fotleden.'),
  bridge: A(['gluteal', 'hamstring'], ['lower-back', 'abs'], ['lower-back'], 'Sätet – kläm i toppen.', 'Ländryggen. Känns det mest i ryggen, tippa bäckenet mer.'),
  slRdl: A(['hamstring', 'gluteal'], ['lower-back', 'adductors'], ['lower-back'], 'Baksidan av låret och sätet på ståbenet.', 'Ländryggen – håll ryggen rak.'),
  nordic: A(['hamstring'], ['gluteal', 'calves'], ['knees'], 'Baksidan av låren – mycket.', 'Knäskålen (lägg något mjukt under knäna).'),
  slide: A(['hamstring', 'gluteal'], ['calves'], ['lower-back'], 'Baksidan av låren och sätet.', 'Ländryggen.'),
  calf: A(['calves'], ['feet'], ['ankles'], 'Vaderna, särskilt i den långa töjningen i botten.', 'Hälsenan eller fotleden.'),
  tibialis: A(['tibialis'], [], ['ankles'], 'Framsidan av smalbenet.', 'Fotleden.'),
  copenhagen: A(['adductors'], ['obliques', 'abs'], ['knees'], 'Insidan av låret på det övre benet.', 'Knät – börja med knät på bänken (kort hävarm).'),
  pallof: A(['obliques', 'abs'], ['deltoids'], ['lower-back'], 'Sidan av magen som stoppar vridningen.', 'Ländryggen.'),
  lateral: A(['deltoids'], ['trapezius'], ['neck'], 'Utsidan av axlarna.', 'Nacken – dra inte upp axlarna.'),
  curl: A(['biceps'], ['forearm'], ['forearm'], 'Biceps.', 'Armbågsleden.'),
  triceps: A(['triceps'], [], ['forearm'], 'Baksidan av armarna i djup töjning.', 'Armbågen.'),
  pullApart: A(['trapezius', 'deltoids', 'upper-back'], [], ['neck'], 'Baksidan av axlarna och mellan skulderbladen.', 'Nacken.'),
  pogo: A(['calves'], ['quadriceps'], ['ankles', 'knees'], 'Vaderna – studsigt och lätt.', 'Hälsenan, fotlederna eller knäna.'),
  boxjump: A(['quadriceps', 'gluteal', 'calves'], ['hamstring'], ['knees', 'ankles'], 'Benen i ett explosivt skjut.', 'Knäna vid landningen – landa mjukt.'),
  wrist: A(['forearm'], ['hands'], ['hands'], 'En lätt töjning i underarmar och handleder.', 'Skarp smärta i handleden.'),
  scap: A(['trapezius', 'upper-back'], ['chest'], ['neck'], 'Runt skulderbladen.', 'Nacken.'),
};

/** Ladders whose levels have no animation get a pattern by ladder. */
const LADDER_PATTERN: Record<string, string> = { BL: 'backLever', HF: 'flag', KF: 'slide', MU: 'muscleUp', DP: 'dip', CC: 'hollow', PL: 'lean', FL: 'frontLever', HS: 'handstand', VP: 'pike' };

export function anatomyFor(key?: string): Anatomy | undefined {
  if (!key) return undefined;
  if (ANATOMY[key]) return ANATOMY[key];
  const anim = LEVEL_ANIM[key];
  if (anim && ANATOMY[anim]) return ANATOMY[anim];
  if (key === 'KF4' || key === 'KF5' || key === 'KF6') return ANATOMY.nordic;
  const ladder = key.match(/^[A-Za-z]+/)?.[0];
  return ladder && LADDER_PATTERN[ladder] ? ANATOMY[LADDER_PATTERN[ladder]] : undefined;
}

ANATOMY.shrimp = ANATOMY.pistol;
ANATOMY.dislocates = ANATOMY.scap;
