import React from "react";
import { AbsoluteFill, Audio, interpolate, staticFile } from "remotion";
import { TransitionSeries, linearTiming } from "@remotion/transitions";
import { fade } from "@remotion/transitions/fade";
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

loadFont("normal", { weights: ["400", "500", "600", "700"] });

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

export const AerialRoutes: React.FC = () => {
  const total = totalDuration();

  return (
    <AbsoluteFill style={{ background: "#0B0F17" }}>
      <TransitionSeries>
        {SCENE_IDS.map((id, i) => (
          <React.Fragment key={id}>
            <TransitionSeries.Sequence durationInFrames={sceneDuration(id)}>
              {SCENE_COMPONENTS[id]}
            </TransitionSeries.Sequence>
            {i < SCENE_IDS.length - 1 && (
              <TransitionSeries.Transition
                presentation={fade()}
                timing={linearTiming({ durationInFrames: TRANSITION_FRAMES })}
              />
            )}
          </React.Fragment>
        ))}
      </TransitionSeries>

      {/* Música ambiental de fondo con fade final */}
      <Audio
        src={staticFile("audio/music.mp3")}
        volume={(f) =>
          interpolate(f, [0, 40, total - 70, total - 8], [0, 0.13, 0.13, 0], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          })
        }
      />
    </AbsoluteFill>
  );
};
