import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
import { slide } from "@remotion/transitions/slide";
import { loadFont } from "@remotion/google-fonts/Archivo";
import {
  ROUTES,
  SCENE_IDS,
  sceneDuration,
  totalDuration,
  TRANSITION_FRAMES,
} from "./data/aerial";
import { HookScene } from "./scenes/aerial/HookScene";
import { JapanScene } from "./scenes/aerial/JapanScene";
import { OutroScene } from "./scenes/aerial/OutroScene";
import { RouteScene } from "./scenes/aerial/RouteScene";

loadFont("normal", { weights: ["400", "600", "700", "800", "900"] });

const SCENE_COMPONENTS: Record<string, React.ReactNode> = {
  hook: <HookScene />,
  jeju: <RouteScene route={ROUTES.jeju} />,
  japon: <JapanScene />,
  hanoi: <RouteScene route={ROUTES.hanoi} />,
  hongkong: <RouteScene route={ROUTES.hongkong} />,
  cairo: <RouteScene route={ROUTES.cairo} />,
  kuala: <RouteScene route={ROUTES.kuala} />,
  jfk: <RouteScene route={ROUTES.jfk} />,
  outro: <OutroScene />,
};

const DIRECTIONS = ["from-right", "from-bottom", "from-left", "from-bottom"] as const;

// Frame absoluto en el que empieza cada escena (para colocar los whoosh)
const sceneStarts = SCENE_IDS.map((_, i) =>
  SCENE_IDS.slice(0, i).reduce((sum, id) => sum + sceneDuration(id), 0) -
  i * TRANSITION_FRAMES,
);

export const AerialRoutes: React.FC = () => {
  const total = totalDuration();

  return (
    <AbsoluteFill style={{ background: "#020617" }}>
      <TransitionSeries>
        {SCENE_IDS.map((id, i) => (
          <React.Fragment key={id}>
            <TransitionSeries.Sequence durationInFrames={sceneDuration(id)}>
              {SCENE_COMPONENTS[id]}
            </TransitionSeries.Sequence>
            {i < SCENE_IDS.length - 1 && (
              <TransitionSeries.Transition
                presentation={
                  i % 3 === 2
                    ? fade()
                    : slide({ direction: DIRECTIONS[i % DIRECTIONS.length] })
                }
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* Música de fondo con fade final */}
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 30, total - 60, total - 5], [0, 0.22, 0.22, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />

      {/* Whoosh en cada cambio de escena */}
      {sceneStarts.slice(1).map((start, i) => (
        <Sequence key={i} from={start - 6} durationInFrames={30}>
          <Audio src={staticFile("audio/whoosh.mp3")} volume={0.5} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
