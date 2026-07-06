import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { COLORS } from "../../data/aerial";
import { CountUp, Overline, SceneBackground, SceneIn, SlideUp } from "./ui";

const RouteRow: React.FC<{
  from: string;
  to: string;
  codes: string;
  seats: number;
  rank: string;
  delay: number;
}> = ({ from, to, codes, seats, rank, delay }) => (
  <SlideUp delay={delay}>
    <div
      style={{
        background: COLORS.surface,
        border: `1px solid ${COLORS.hairline}`,
        borderRadius: 16,
        padding: "40px 52px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 40,
      }}
    >
      <div>
        <p
          style={{
            fontSize: 24,
            fontWeight: 600,
            color: COLORS.accent,
            letterSpacing: "0.2em",
            textTransform: "uppercase",
            marginBottom: 12,
          }}
        >
          {rank}
        </p>
        <p style={{ fontSize: 58, fontWeight: 700, color: COLORS.text, lineHeight: 1.1 }}>
          {from}
          <span style={{ color: COLORS.textSecondary, fontWeight: 400 }}> — </span>
          {to}
        </p>
        <p
          style={{
            fontSize: 26,
            fontWeight: 500,
            color: COLORS.textSecondary,
            letterSpacing: "0.18em",
            marginTop: 10,
          }}
        >
          {codes}
        </p>
      </div>
      <div style={{ textAlign: "right" }}>
        <CountUp
          target={seats}
          delay={delay + 8}
          suffix="M"
          style={{
            fontSize: 96,
            fontWeight: 700,
            color: COLORS.text,
            letterSpacing: "-0.02em",
          }}
        />
        <p
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.textSecondary,
            textTransform: "uppercase",
            letterSpacing: "0.16em",
          }}
        >
          asientos anuales
        </p>
      </div>
    </div>
  </SlideUp>
);

export const JapanScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground />
      <Sequence from={6}>
        <Audio src={staticFile("audio/japon.mp3")} volume={1.5} />
      </Sequence>

      <SceneIn>
        <AbsoluteFill style={{ flexDirection: "row", padding: "100px 100px" }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 44,
              paddingRight: 80,
            }}
          >
            <SlideUp delay={4}>
              <Overline>Mercado doméstico · Japón</Overline>
            </SlideUp>
            <SlideUp delay={12}>
              <h2
                style={{
                  fontSize: 92,
                  fontWeight: 700,
                  color: COLORS.text,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                }}
              >
                Japón concentra el segundo y tercer corredor mundial
              </h2>
            </SlideUp>
            <SlideUp delay={24}>
              <p
                style={{
                  fontSize: 34,
                  fontWeight: 400,
                  color: COLORS.textSecondary,
                  lineHeight: 1.5,
                  maxWidth: 700,
                }}
              >
                El avión compite directamente con el tren de alta velocidad, a
                menudo con tarifas más competitivas.
              </p>
            </SlideUp>
          </div>

          <div
            style={{
              width: 860,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              gap: 32,
            }}
          >
            <RouteRow
              from="Sapporo"
              to="Tokio"
              codes="CTS — HND"
              seats={12.1}
              rank="#2 mundial"
              delay={16}
            />
            <RouteRow
              from="Fukuoka"
              to="Tokio"
              codes="FUK — HND"
              seats={11.5}
              rank="#3 mundial"
              delay={26}
            />
          </div>
        </AbsoluteFill>
      </SceneIn>
    </AbsoluteFill>
  );
};
