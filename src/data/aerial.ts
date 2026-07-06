export const FPS = 30;
export const TRANSITION_FRAMES = 12;
export const SCENE_PADDING = 34;

// Paleta corporativa
export const COLORS = {
  background: "#0B0F17",
  surface: "rgba(255,255,255,0.04)",
  hairline: "rgba(255,255,255,0.12)",
  text: "#E8EAF0",
  textSecondary: "#8A93A6",
  accent: "#C9A961",
};

// Duración real de cada mp3 de narración (segundos), medida con ffprobe
const NARRATION_SECONDS: Record<string, number> = {
  hook: 12.192,
  jeju: 13.272,
  japon: 16.368,
  hanoi: 8.376,
  hongkong: 8.304,
  cairo: 7.776,
  kuala: 7.704,
  jfk: 14.232,
  outro: 6.984,
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
};

export const ROUTES: Record<string, RouteInfo> = {
  jeju: {
    id: "jeju",
    rankLabel: "Ruta doméstica · #1 mundial",
    origin: { code: "CJU", city: "Jeju", coords: [126.49, 33.51] },
    dest: { code: "GMP", city: "Seúl", coords: [126.79, 37.56] },
    seats: 14.5,
    flightTime: "1 h 10 min",
    fact: "Despegues cada pocos minutos en horas punta.",
  },
  hanoi: {
    id: "hanoi",
    rankLabel: "Ruta doméstica · #4 mundial",
    origin: { code: "HAN", city: "Hanói", coords: [105.8, 21.22] },
    dest: { code: "SGN", city: "Ho Chi Minh", coords: [106.65, 10.82] },
    seats: 11.1,
    flightTime: "2 h 05 min",
    fact: "Crecimiento anual del +4 % en capacidad.",
  },
  hongkong: {
    id: "hongkong",
    rankLabel: "Ruta internacional · #1",
    origin: { code: "HKG", city: "Hong Kong", coords: [113.91, 22.31] },
    dest: { code: "TPE", city: "Taipéi", coords: [121.23, 25.08] },
    seats: 6.8,
    flightTime: "1 h 55 min",
    fact: "Líder internacional por segundo año consecutivo.",
  },
  cairo: {
    id: "cairo",
    rankLabel: "Ruta internacional · #2",
    origin: { code: "CAI", city: "El Cairo", coords: [31.41, 30.12] },
    dest: { code: "JED", city: "Yeda", coords: [39.15, 21.68] },
    seats: 5.8,
    flightTime: "2 h 25 min",
    fact: "Impulsada por el tráfico religioso hacia La Meca.",
  },
  kuala: {
    id: "kuala",
    rankLabel: "Ruta internacional · #3",
    origin: { code: "KUL", city: "Kuala Lumpur", coords: [101.71, 2.75] },
    dest: { code: "SIN", city: "Singapur", coords: [103.99, 1.36] },
    seats: 5.6,
    flightTime: "1 h 05 min",
    fact: "Uno de los cruces fronterizos aéreos más cortos del mundo.",
  },
  jfk: {
    id: "jfk",
    rankLabel: "Única intercontinental del top",
    origin: { code: "JFK", city: "Nueva York", coords: [-73.78, 40.64] },
    dest: { code: "LHR", city: "Londres", coords: [-0.46, 51.47] },
    seats: 4.0,
    flightTime: "7 h 00 min",
    fact: "Récord con jet stream: 4 h 56 min de travesía.",
  },
};
