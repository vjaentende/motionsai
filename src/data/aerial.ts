export const FPS = 30;
export const TRANSITION_FRAMES = 14;
export const SCENE_PADDING = 40;

// Duración real de cada mp3 de narración (segundos), medida con ffprobe
const NARRATION_SECONDS: Record<string, number> = {
  hook: 9.144,
  jeju: 15.48,
  japon: 13.512,
  hanoi: 7.632,
  hongkong: 10.296,
  cairo: 8.304,
  kuala: 9.096,
  jfk: 12.936,
  outro: 3.84,
};

export const narrationFrames = (id: string): number =>
  Math.ceil(NARRATION_SECONDS[id] * FPS);

export const sceneDuration = (id: string): number =>
  narrationFrames(id) + SCENE_PADDING;

export const SCENE_IDS = [
  "hook",
  "jeju",
  "japon",
  "hanoi",
  "hongkong",
  "cairo",
  "kuala",
  "jfk",
  "outro",
] as const;

export const totalDuration = (): number =>
  SCENE_IDS.reduce((sum, id) => sum + sceneDuration(id), 0) -
  (SCENE_IDS.length - 1) * TRANSITION_FRAMES;

export type RouteInfo = {
  id: string;
  rankLabel: string;
  origin: { code: string; city: string };
  dest: { code: string; city: string };
  seats: number; // millones
  flightTime: string;
  fact: string;
  gradient: [string, string];
  accent: string;
};

export const ROUTES: Record<string, RouteInfo> = {
  jeju: {
    id: "jeju",
    rankLabel: "#1 DEL MUNDO",
    origin: { code: "CJU", city: "Jeju" },
    dest: { code: "GMP", city: "Seúl" },
    seats: 14.5,
    flightTime: "1h 10m",
    fact: "En horas punta despega un avión cada 2 minutos. Un autobús con alas.",
    gradient: ["#1e1b4b", "#7c3aed"],
    accent: "#c4b5fd",
  },
  hanoi: {
    id: "hanoi",
    rankLabel: "#4 DEL MUNDO",
    origin: { code: "HAN", city: "Hanói" },
    dest: { code: "SGN", city: "Ho Chi Minh" },
    seats: 11.1,
    flightTime: "2h 05m",
    fact: "Crece un +4% cada año. Vietnam vuela más que nunca.",
    gradient: ["#7f1d1d", "#f97316"],
    accent: "#fed7aa",
  },
  hongkong: {
    id: "hongkong",
    rankLabel: "#1 INTERNACIONAL",
    origin: { code: "HKG", city: "Hong Kong" },
    dest: { code: "TPE", city: "Taipéi" },
    seats: 6.8,
    flightTime: "1h 55m",
    fact: "La reina indiscutible de las rutas internacionales, año tras año.",
    gradient: ["#0c4a6e", "#06b6d4"],
    accent: "#a5f3fc",
  },
  cairo: {
    id: "cairo",
    rankLabel: "#2 INTERNACIONAL",
    origin: { code: "CAI", city: "El Cairo" },
    dest: { code: "JED", city: "Yeda" },
    seats: 5.8,
    flightTime: "2h 25m",
    fact: "Impulsada por la peregrinación a La Meca, sobre el Mar Rojo.",
    gradient: ["#78350f", "#eab308"],
    accent: "#fde68a",
  },
  kuala: {
    id: "kuala",
    rankLabel: "#3 INTERNACIONAL",
    origin: { code: "KUL", city: "Kuala Lumpur" },
    dest: { code: "SIN", city: "Singapur" },
    seats: 5.6,
    flightTime: "1h 05m",
    fact: "Cambiar de país en menos de lo que tardas en llegar al trabajo.",
    gradient: ["#14532d", "#22c55e"],
    accent: "#bbf7d0",
  },
  jfk: {
    id: "jfk",
    rankLabel: "ÚNICA INTERCONTINENTAL",
    origin: { code: "JFK", city: "Nueva York" },
    dest: { code: "LHR", city: "Londres" },
    seats: 4.0,
    flightTime: "7h 00m",
    fact: "Récord con jet stream: cruzó el Atlántico en 4h 56m.",
    gradient: ["#1e3a8a", "#ec4899"],
    accent: "#fbcfe8",
  },
};
