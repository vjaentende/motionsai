import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS, narrationFrames, RouteInfo } from "../../data/aerial";
import { Globe } from "./Globe";
import { CountUp, Overline, SceneBackground, SceneIn, SlideUp } from "./ui";

const DataCard: React.FC<{ label: string; value: string; wide?: boolean }> = ({
  label,
  value,
  wide,
}) => (
  <div
    style={{
      background: COLORS.surface,
      border: `1px solid ${COLORS.hairline}`,
      borderRadius: 14,
      padding: "26px 32px",
      flex: wide ? 1 : undefined,
      minWidth: 240,
    }}
  >
    <p
      style={{
        fontSize: 22,
        fontWeight: 600,
        color: COLORS.textSecondary,
        textTransform: "uppercase",
        letterSpacing: "0.18em",
        marginBottom: 10,
      }}
    >
      {label}
    </p>
    <p style={{ fontSize: 34, fontWeight: 600, color: COLORS.text, lineHeight: 1.3 }}>
      {value}
    </p>
  </div>
);

export const RouteScene: React.FC<{ route: RouteInfo }> = ({ route }) => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground />
      <Sequence from={6}>
        <Audio src={staticFile(`audio/${route.id}.mp3`)} volume={1.5} />
      </Sequence>

      <SceneIn>
        <AbsoluteFill style={{ flexDirection: "row", padding: "90px 100px" }}>
          {/* Columna de datos */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 46,
              paddingRight: 60,
            }}
          >
            <SlideUp delay={4}>
              <Overline>{route.rankLabel}</Overline>
            </SlideUp>

            <SlideUp delay={10}>
              <h1
                style={{
                  fontSize: 96,
                  fontWeight: 700,
                  color: COLORS.text,
                  lineHeight: 1.08,
                  letterSpacing: "-0.02em",
                }}
              >
                {route.origin.city}
                <span style={{ color: COLORS.textSecondary, fontWeight: 400 }}> — </span>
                {route.dest.city}
              </h1>
              <p
                style={{
                  fontSize: 32,
                  fontWeight: 500,
                  color: COLORS.textSecondary,
                  letterSpacing: "0.22em",
                  marginTop: 18,
                }}
              >
                {route.origin.code} · {route.dest.code}
              </p>
            </SlideUp>

            <SlideUp delay={18}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 22 }}>
                <CountUp
                  target={route.seats}
                  delay={20}
                  suffix="M"
                  style={{
                    fontSize: 150,
                    fontWeight: 700,
                    color: COLORS.text,
                    lineHeight: 1,
                    letterSpacing: "-0.03em",
                  }}
                />
                <span
                  style={{
                    fontSize: 30,
                    fontWeight: 500,
                    color: COLORS.textSecondary,
                    textTransform: "uppercase",
                    letterSpacing: "0.16em",
                  }}
                >
                  asientos anuales
                </span>
              </div>
            </SlideUp>

            <SlideUp delay={26}>
              <div style={{ display: "flex", gap: 24 }}>
                <DataCard label="Duración de vuelo" value={route.flightTime} />
                <DataCard label="Dato clave" value={route.fact} wide />
              </div>
            </SlideUp>
          </div>

          {/* Globo */}
          <SlideUp delay={8} distance={26}>
            <div
              style={{
                width: 830,
                height: 900,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Globe
                origin={route.origin.coords}
                dest={route.dest.coords}
                size={800}
                delay={16}
                flightFrames={Math.max(70, narrationFrames(route.id) - 50)}
              />
            </div>
          </SlideUp>
        </AbsoluteFill>
      </SceneIn>
    </AbsoluteFill>
  );
};
