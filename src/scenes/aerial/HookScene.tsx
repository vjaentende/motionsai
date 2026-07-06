import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "../../data/aerial";
import { Overline, SceneBackground, SceneIn, SlideUp } from "./ui";

export const HookScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground />
      <Sequence from={6}>
        <Audio src={staticFile("audio/hook.mp3")} volume={1.5} />
      </Sequence>

      <SceneIn>
        <AbsoluteFill
          style={{ justifyContent: "center", padding: "0 180px", gap: 52 }}
        >
          <SlideUp delay={6}>
            <Overline>Análisis · Aviación comercial 2025</Overline>
          </SlideUp>

          <SlideUp delay={14}>
            <h1
              style={{
                fontSize: 118,
                fontWeight: 700,
                color: COLORS.text,
                lineHeight: 1.08,
                letterSpacing: "-0.02em",
                maxWidth: 1450,
              }}
            >
              Las rutas aéreas más transitadas del mundo
            </h1>
          </SlideUp>

          <SlideUp delay={26}>
            <p
              style={{
                fontSize: 40,
                fontWeight: 400,
                color: COLORS.textSecondary,
                lineHeight: 1.45,
                maxWidth: 1200,
              }}
            >
              Un mapa dominado por Asia: los corredores que concentran la mayor
              capacidad de pasajeros, según datos de OAG.
            </p>
          </SlideUp>

          <SlideUp delay={40}>
            <div
              style={{
                width: 1560,
                height: 1,
                background: COLORS.hairline,
                marginTop: 30,
              }}
            />
            <p
              style={{
                fontSize: 26,
                fontWeight: 500,
                color: COLORS.textSecondary,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                marginTop: 26,
              }}
            >
              Capacidad programada · Ambas direcciones · Ene – Dic 2025
            </p>
          </SlideUp>
        </AbsoluteFill>
      </SceneIn>
    </AbsoluteFill>
  );
};
