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
import { PlaneIcon, PunchIn, SceneBackground, SlideUp } from "./ui";

export const HookScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();

  const planeX = interpolate(frame, [0, 60], [-200, width + 200]);
  const planeY = 360 + Math.sin(frame / 6) * 26;

  const strikeProgress = spring({
    frame: frame - 70,
    fps,
    config: { damping: 13, stiffness: 200 },
  });

  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground gradient={["#020617", "#4f46e5"]} seed="hook" />
      <Sequence from={5}>
        <Audio src={staticFile("audio/hook.mp3")} volume={1.5} />
      </Sequence>

      <div
        style={{
          position: "absolute",
          left: planeX,
          top: planeY,
          filter: "drop-shadow(0 0 30px rgba(165,180,252,0.9))",
        }}
      >
        <PlaneIcon size={130} color="white" rotate={90} />
      </div>

      <PunchIn>
        <AbsoluteFill style={{ justifyContent: "center", padding: "0 80px", gap: 50 }}>
          <SlideUp delay={4}>
            <h1
              style={{
                fontSize: 118,
                fontWeight: 900,
                color: "white",
                lineHeight: 1.02,
                letterSpacing: "-0.03em",
                textShadow: "0 12px 60px rgba(0,0,0,0.6)",
              }}
            >
              ¿LA RUTA AÉREA
              <br />
              MÁS USADA
              <br />
              <span style={{ color: "#a5b4fc" }}>DEL PLANETA?</span>
            </h1>
          </SlideUp>

          <SlideUp delay={55}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <p
                style={{
                  fontSize: 62,
                  fontWeight: 900,
                  color: "rgba(255,255,255,0.55)",
                  whiteSpace: "nowrap",
                }}
              >
                NUEVA YORK — LONDRES
              </p>
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: 0,
                  height: 14,
                  borderRadius: 8,
                  background: "#f43f5e",
                  width: `${strikeProgress * 100}%`,
                  boxShadow: "0 0 40px #f43f5e",
                }}
              />
            </div>
          </SlideUp>

          <SlideUp delay={140}>
            <p
              style={{
                fontSize: 66,
                fontWeight: 800,
                color: "#fbbf24",
                textShadow: "0 0 50px rgba(251,191,36,0.6)",
              }}
            >
              El #1 te va a sorprender →
            </p>
          </SlideUp>
        </AbsoluteFill>
      </PunchIn>
    </AbsoluteFill>
  );
};
