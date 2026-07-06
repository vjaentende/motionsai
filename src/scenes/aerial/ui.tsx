import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../../data/aerial";

export const PlaneIcon: React.FC<{
  size?: number;
  color?: string;
  rotate?: number;
}> = ({ size = 64, color = "white", rotate = 0 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill={color}
    style={{ transform: `rotate(${rotate}deg)` }}
  >
    <path d="M21.5 15.5v-2l-8.5-5V3a1.5 1.5 0 0 0-3 0v5.5l-8.5 5v2l8.5-2.5v5.5l-2.5 1.5V22l4-1 4 1v-2l-2.5-1.5V13z" />
  </svg>
);

// Fondo sobrio: color plano con viñeta y retícula de puntos muy tenue
export const SceneBackground: React.FC = () => {
  const { width, height } = useVideoConfig();

  const dots: React.ReactNode[] = [];
  const step = 72;
  for (let x = step; x < width; x += step) {
    for (let y = step; y < height; y += step) {
      dots.push(
        <circle key={`${x}-${y}`} cx={x} cy={y} r={1.1} fill="rgba(255,255,255,0.05)" />,
      );
    }
  }

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ background: COLORS.background }} />
      <svg width={width} height={height} style={{ position: "absolute" }}>
        {dots}
      </svg>
      <AbsoluteFill
        style={{
          background:
            "radial-gradient(ellipse at 50% 40%, rgba(255,255,255,0.045), transparent 65%)",
        }}
      />
    </AbsoluteFill>
  );
};

// Entrada de escena discreta: leve zoom-out y fundido
export const SceneIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({ frame, fps, config: { damping: 30, stiffness: 80 } });
  const scale = interpolate(progress, [0, 1], [1.025, 1]);
  const opacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill style={{ transform: `scale(${scale})`, opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const CountUp: React.FC<{
  target: number;
  decimals?: number;
  delay?: number;
  suffix?: string;
  style?: React.CSSProperties;
}> = ({ target, decimals = 1, delay = 0, suffix = "", style }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 40, stiffness: 50 },
    durationInFrames: 50,
  });

  return (
    <span style={{ ...style, display: "inline-block" }}>
      {(target * progress).toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const SlideUp: React.FC<{
  delay?: number;
  children: React.ReactNode;
  distance?: number;
}> = ({ delay = 0, children, distance = 34 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 26, stiffness: 90 },
  });
  return (
    <div
      style={{
        opacity: interpolate(progress, [0, 1], [0, 1]),
        transform: `translateY(${interpolate(progress, [0, 1], [distance, 0])}px)`,
      }}
    >
      {children}
    </div>
  );
};

// Etiqueta corporativa en mayúsculas con regla dorada
export const Overline: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
    <div style={{ width: 44, height: 2, background: COLORS.accent }} />
    <span
      style={{
        fontSize: 26,
        fontWeight: 600,
        color: COLORS.accent,
        textTransform: "uppercase",
        letterSpacing: "0.28em",
      }}
    >
      {children}
    </span>
  </div>
);
