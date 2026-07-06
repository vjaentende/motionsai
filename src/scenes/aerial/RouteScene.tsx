import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { RouteInfo } from "../../data/aerial";
import { FlightArc } from "./FlightArc";
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
          fontSize: 130,
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
          fontSize: 38,
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
      <Sequence from={6}>
        <Audio src={staticFile(`audio/${route.id}.mp3`)} />
      </Sequence>

      <PunchIn>
        <AbsoluteFill style={{ padding: "150px 70px", justifyContent: "space-between" }}>
          <SlideUp delay={2}>
            <div
              style={{
                alignSelf: "flex-start",
                display: "inline-block",
                background: route.accent,
                color: "#0a0a0a",
                fontWeight: 900,
                fontSize: 44,
                padding: "18px 44px",
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
                marginBottom: -60,
              }}
            >
              <AirportCode
                code={route.origin.code}
                city={route.origin.city}
                delay={6}
                align="left"
              />
              <AirportCode
                code={route.dest.code}
                city={route.dest.city}
                delay={12}
                align="right"
              />
            </div>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <FlightArc accent={route.accent} delay={14} />
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 34 }}>
            <SlideUp delay={20}>
              <div style={{ display: "flex", alignItems: "baseline", gap: 24 }}>
                <CountUp
                  target={route.seats}
                  delay={22}
                  suffix="M"
                  style={{
                    fontSize: 210,
                    fontWeight: 900,
                    color: "white",
                    lineHeight: 0.9,
                    letterSpacing: "-0.04em",
                    textShadow: `0 0 80px ${route.accent}aa`,
                  }}
                />
                <span
                  style={{
                    fontSize: 46,
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

            <SlideUp delay={30}>
              <div style={{ display: "flex", gap: 26, alignItems: "stretch" }}>
                <div
                  style={{
                    background: "rgba(255,255,255,0.12)",
                    border: "2px solid rgba(255,255,255,0.25)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 28,
                    padding: "26px 38px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 30,
                      color: "rgba(255,255,255,0.65)",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.1em",
                    }}
                  >
                    Vuelo
                  </p>
                  <p style={{ fontSize: 62, fontWeight: 900, color: "white" }}>
                    {route.flightTime}
                  </p>
                </div>
                <div
                  style={{
                    flex: 1,
                    background: `linear-gradient(135deg, ${route.accent}33, rgba(255,255,255,0.08))`,
                    border: `2px solid ${route.accent}66`,
                    borderRadius: 28,
                    padding: "26px 34px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <p
                    style={{
                      fontSize: 40,
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
