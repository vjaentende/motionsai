import React from "react";
import {
  AbsoluteFill,
  Audio,
  interpolate,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { PlaneIcon, PunchIn, SceneBackground } from "./ui";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const pop = spring({ frame: frame - 4, fps, config: { damping: 10, stiffness: 180 } });
  const ringScale = interpolate(frame % 34, [0, 34], [1, 1.9]);
  const ringOpacity = interpolate(frame % 34, [0, 34], [0.6, 0]);

  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground gradient={["#0f172a", "#6d28d9"]} seed="outro" />
      <Sequence from={3}>
        <Audio src={staticFile("audio/outro.mp3")} volume={1.5} />
      </Sequence>

      <PunchIn>
        <AbsoluteFill style={{ justifyContent: "center", alignItems: "center", gap: 56 }}>
          <div style={{ position: "relative" }}>
            <div
              style={{
                position: "absolute",
                inset: -30,
                borderRadius: "50%",
                border: "4px solid #c4b5fd",
                transform: `scale(${ringScale})`,
                opacity: ringOpacity,
              }}
            />
            <div
              style={{
                width: 220,
                height: 220,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #8b5cf6, #ec4899)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transform: `scale(${interpolate(pop, [0, 1], [0, 1])})`,
                boxShadow: "0 0 90px rgba(139,92,246,0.8)",
              }}
            >
              <PlaneIcon size={120} color="white" rotate={45} />
            </div>
          </div>

          <h2
            style={{
              fontSize: 92,
              fontWeight: 900,
              color: "white",
              textAlign: "center",
              lineHeight: 1.1,
              padding: "0 70px",
              transform: `translateY(${interpolate(pop, [0, 1], [60, 0])}px)`,
              opacity: pop,
              textShadow: "0 12px 60px rgba(0,0,0,0.6)",
            }}
          >
            SÍGUEME PARA
            <br />
            <span style={{ color: "#c4b5fd" }}>MÁS DATOS ASÍ</span>
          </h2>
        </AbsoluteFill>
      </PunchIn>
    </AbsoluteFill>
  );
};
