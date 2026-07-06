import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { narrationFrames, RouteInfo } from "../../data/aerial";
import { Globe } from "./Globe";
import { CountUp, PunchIn, SceneBackground, SlideUp } from "./ui";

const AirportCode: React.FC<{
  code: string;
  city: string;
  delay: number;
  align: "left" | "right";
}> = ({ code, city, delay, align }) => (
  <SlideUp delay={delay} distance={90}>
    <div style={{ textAlign: align === "left" ? "left" : "right" }}>
      <p
        style={{
          fontSize: 128,
          fontWeight: 900,
          color: "white",
          lineHeight: 0.95,
          letterSpacing: "-0.03em",
          textShadow: "0 10px 50px rgba(0,0,0,0.55)",
        }}
      >
        {code}
      </p>
      <p
        style={{
          fontSize: 37,
          fontWeight: 600,
          color: "rgba(255,255,255,0.75)",
          textTransform: "uppercase",
          letterSpacing: "0.14em",
        }}
      >
        {city}
      </p>
    </div>
  </SlideUp>
);

export const RouteScene: React.FC<{ route: RouteInfo }> = ({ route }) => {
  return (
    <AbsoluteFill style={{ fontFamily: "Archivo, sans-serif" }}>
      <SceneBackground gradient={route.gradient} seed={route.id} />
      <Sequence from={5}>
        <Audio src={staticFile(`audio/${route.id}.mp3`)} volume={1.5} />
      </Sequence>

      <PunchIn>
        <AbsoluteFill style={{ padding: "130px 70px", justifyContent: "space-between" }}>
          <SlideUp delay={2}>
            <div
              style={{
                alignSelf: "flex-start",
                display: "inline-block",
                background: route.accent,
                color: "#0a0a0a",
                fontWeight: 900,
                fontSize: 46,
                padding: "18px 46px",
                borderRadius: 999,
                letterSpacing: "0.06em",
                boxShadow: `0 0 60px ${route.accent}88`,
              }}
            >
              {route.rankLabel}
            </div>
          </SlideUp>

          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                marginBottom: 8,
              }}
            >
              <AirportCode
                code={route.origin.code}
                city={route.origin.city}
                delay={4}
                align="left"
              />
              <AirportCode
                code={route.dest.code}
                city={route.dest.city}
                delay={8}
                align="right"
              />
            </div>
            <SlideUp delay={6} distance={60}>
              <div style={{ display: "flex", justifyContent: "center" }}>
                <Globe
                  origin={route.origin.coords}
                  dest={route.dest.coords}
                  accent={route.accent}
                  size={800}
                  delay={12}
                  flightFrames={Math.max(55, narrationFrames(route.id) - 45)}
                />
              </div>
            </SlideUp>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 30 }}>
            <SlideUp delay={14}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
                <CountUp
                  target={route.seats}
                  delay={16}
                  suffix="M"
                  style={{
                    fontSize: 175,
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    textShadow: `0 0 80px ${route.accent}aa`,
                  }}
                />
                <span
                  style={{
                    fontSize: 44,
                    fontWeight: 700,
                    color: "rgba(255,255,255,0.8)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  asientos / año
                </span>
              </div>
            </SlideUp>

            <SlideUp delay={22}>
              <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    borderRadius: 28,
                    padding: "24px 36px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 28,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Vuelo
                  </p>
                  <p style={{ fontSize: 58, fontWeight: 900, color: "white" }}>
                    {route.flightTime}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${route.accent}33, rgba(255,255,255,0.08))`,
                    border: `2px solid ${route.accent}66`,
                    borderRadius: 28,
                    padding: "24px 34px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      color: "white",
                      lineHeight: 1.25,
                    }}
                  >
                    {route.fact}
                  </p>
                </div>
              </div>
            </SlideUp>
          </div>
        </AbsoluteFill>
      </PunchIn>
    </AbsoluteFill>
  );
};
