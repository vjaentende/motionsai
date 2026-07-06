import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { CountUp, PunchIn, SceneBackground, SlideUp } from "./ui";

const RouteRow: React.FC<{
  from: string;
  to: string;
  codes: string;
  seats: number;
  rank: string;
  delay: number;
}> = ({ from, to, codes, seats, rank, delay }) => (
  <SlideUp delay={delay} distance={110}>
    <div
      style={{
        background: "rgba(255,255,255,0.1)",
        border: "2px solid rgba(255,255,255,0.22)",
        borderRadius: 36,
        padding: "40px 46px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 26,
      }}
    >
      <div>
        <p style={{ fontSize: 32, fontWeight: 800, color: "#fda4af", letterSpacing: "0.1em" }}>
          {rank}
        </p>
        <p
          style={{
            fontSize: 58,
            fontWeight: 900,
            color: "white",
            lineHeight: 1.05,
            whiteSpace: "nowrap",
          }}
        >
          {from} → {to}
        </p>
        <p
          style={{
            fontSize: 30,
            fontWeight: 700,
            color: "rgba(255,255,255,0.6)",
            letterSpacing: "0.14em",
          }}
        >
          {codes}
        </p>
      </div>
      <CountUp
        target={seats}
        delay={delay + 8}
        suffix="M"
        style={{
          fontSize: 100,
          fontWeight: 900,
          color: "white",
          textShadow: "0 0 60px rgba(244,63,94,0.7)",
        }}
      />
    </div>
  </SlideUp>
);

export const JapanScene: React.FC = () => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground gradient={["#4c0519", "#e11d48"]} seed="japon" />
      <Sequence from={6}>
        <Audio src={staticFile("audio/japon.mp3")} />
      </Sequence>

      <PunchIn>
        <AbsoluteFill style={{ padding: "160px 70px", gap: 60, justifyContent: "center" }}>
          <SlideUp delay={2}>
            <h2
              style={{
                fontSize: 120,
                fontWeight: 900,
                color: "white",
                letterSpacing: "-0.03em",
                textShadow: "0 12px 60px rgba(0,0,0,0.55)",
              }}
            >
              JAPÓN
              <span style={{ color: "#fda4af" }}> DOMINA</span>
            </h2>
          </SlideUp>

          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            <RouteRow
              from="Sapporo"
              to="Tokio"
              codes="CTS → HND"
              seats={12.1}
              rank="#2 DEL MUNDO"
              delay={14}
            />
            <RouteRow
              from="Fukuoka"
              to="Tokio"
              codes="FUK → HND"
              seats={11.5}
              rank="#3 DEL MUNDO"
              delay={26}
            />
          </div>

          <SlideUp delay={60}>
            <div
              style={{
                background: "linear-gradient(135deg, rgba(253,164,175,0.25), rgba(255,255,255,0.06))",
                border: "2px solid rgba(253,164,175,0.5)",
                borderRadius: 32,
                padding: "36px 44px",
              }}
            >
              <p style={{ fontSize: 46, fontWeight: 700, color: "white", lineHeight: 1.3 }}>
                Muchos japoneses eligen el avión antes que el tren bala:
                <span style={{ color: "#fda4af", fontWeight: 900 }}>
                  {" "}
                  a menudo es más barato.
                </span>
              </p>
            </div>
          </SlideUp>
        </AbsoluteFill>
      </PunchIn>
    </AbsoluteFill>
  );
};
