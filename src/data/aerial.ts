export const FPS = 30;
export const TRANSITION_FRAMES = 10;
export const SCENE_PADDING = 26;

// Duración real de cada mp3 de narración (segundos), medida con ffprobe
const NARRATION_SECONDS: Record<string, number> = {
  hook: 8.952,
  jeju: 14.256,
  japon: 11.664,
  hanoi: 7.416,
  hongkong: 7.608,
  cairo: 4.992,
  kuala: 7.296,
  jfk: 11.112,
  outro: 3.336,
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

export type Airport = {
  code: string;
  city: string;
  coords: [number, number]; // [lon, lat]
};

export type RouteInfo = {
  id: string;
  rankLabel: string;
  origin: Airport;
  dest: Airport;
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
    origin: { code: "CJU", city: "Jeju", coords: [126.49, 33.51] },
    dest: { code: "GMP", city: "Seúl", coords: [126.79, 37.56] },
    seats: 14.5,
    flightTime: "1h 10m",
    fact: "Un avión cada 2 minutos en hora punta. Un autobús con alas.",
    gradient: ["#1e1b4b", "#7c3aed"],
    accent: "#c4b5fd",
  },
  hanoi: {
    id: "hanoi",
    rankLabel: "#4 DEL MUNDO",
    origin: { code: "HAN", city: "Hanói", coords: [105.8, 21.22] },
    dest: { code: "SGN", city: "Ho Chi Minh", coords: [106.65, 10.82] },
    seats: 11.1,
    flightTime: "2h 05m",
    fact: "Crece un +4% cada año. Vietnam vuela más que nunca.",
    gradient: ["#7f1d1d", "#f97316"],
    accent: "#fed7aa",
  },
  hongkong: {
    id: "hongkong",
    rankLabel: "#1 INTERNACIONAL",
    origin: { code: "HKG", city: "Hong Kong", coords: [113.91, 22.31] },
    dest: { code: "TPE", city: "Taipéi", coords: [121.23, 25.08] },
    seats: 6.8,
    flightTime: "1h 55m",
    fact: "La reina indiscutible de las rutas internacionales.",
    gradient: ["#0c4a6e", "#06b6d4"],
    accent: "#a5f3fc",
  },
  cairo: {
    id: "cairo",
    rankLabel: "#2 INTERNACIONAL",
    origin: { code: "CAI", city: "El Cairo", coords: [31.41, 30.12] },
    dest: { code: "JED", city: "Yeda", coords: [39.15, 21.68] },
    seats: 5.8,
    flightTime: "2h 25m",
    fact: "Impulsada por la peregrinación a La Meca.",
    gradient: ["#78350f", "#eab308"],
    accent: "#fde68a",
  },
  kuala: {
    id: "kuala",
    rankLabel: "#3 INTERNACIONAL",
    origin: { code: "KUL", city: "Kuala Lumpur", coords: [101.71, 2.75] },
    dest: { code: "SIN", city: "Singapur", coords: [103.99, 1.36] },
    seats: 5.6,
    flightTime: "1h 05m",
    fact: "Cambias de país antes de que se enfríe tu café.",
    gradient: ["#14532d", "#22c55e"],
    accent: "#bbf7d0",
  },
  jfk: {
    id: "jfk",
    rankLabel: "ÚNICA INTERCONTINENTAL",
    origin: { code: "JFK", city: "Nueva York", coords: [-73.78, 40.64] },
    dest: { code: "LHR", city: "Londres", coords: [-0.46, 51.47] },
    seats: 4.0,
    flightTime: "7h 00m",
    fact: "Récord con jet stream: 4h 56m de travesía.",
    gradient: ["#1e3a8a", "#ec4899"],
    accent: "#fbcfe8",
  },
};
