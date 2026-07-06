import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "../../data/aerial";
import { PlaneIcon, SceneBackground, SceneIn, SlideUp } from "./ui";

export const OutroScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground />
      <Sequence from={4}>
        <Audio src={staticFile("audio/outro.mp3")} volume={1.5} />
      </Sequence>

      <SceneIn>
        <AbsoluteFill
          style={{ justifyContent: "center", alignItems: "center", gap: 48 }}
        >
          <SlideUp delay={6}>
            <div
              style={{
                width: 108,
                height: 108,
                borderRadius: "50%",
                border: `1px solid ${COLORS.hairline}`,
                background: COLORS.surface,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <PlaneIcon size={52} color={COLORS.accent} rotate={45} />
            </div>
          </SlideUp>

          <SlideUp delay={14}>
            <h2
              style={{
                fontSize: 84,
                fontWeight: 700,
                color: COLORS.text,
                textAlign: "center",
                letterSpacing: "-0.02em",
              }}
            >
              Gracias por su atención
            </h2>
          </SlideUp>

          <SlideUp delay={24}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 24,
              }}
            >
              <div style={{ width: 44, height: 1, background: COLORS.hairline }} />
              <p
                style={{
                  fontSize: 27,
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                }}
              >
                Fuente: OAG · Capacidad programada 2025
              </p>
              <div style={{ width: 44, height: 1, background: COLORS.hairline }} />
            </div>
          </SlideUp>
        </AbsoluteFill>
      </SceneIn>
    </AbsoluteFill>
  );
};
