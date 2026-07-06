import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

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

// Fondo con gradiente animado, rejilla en perspectiva y partículas
export const SceneBackground: React.FC<{
  gradient: [string, string];
  seed: string;
}> = ({ gradient, seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const drift = interpolate(frame, [0, 300], [0, 40]);

  const particles = Array.from({ length: 26 }, (_, i) => {
    const x = random(`${seed}-x-${i}`) * width;
    const speed = 1.5 + random(`${seed}-s-${i}`) * 3.5;
    const y = ((random(`${seed}-y-${i}`) * height + frame * speed) % (height + 80)) - 40;
    const size = 3 + random(`${seed}-r-${i}`) * 7;
    const opacity = 0.15 + random(`${seed}-o-${i}`) * 0.4;
    return { x, y, size, opacity, key: i };
  });

  return (
    <AbsoluteFill>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + drift * 0.4}% ${30 - drift * 0.2}%, ${gradient[1]}, ${gradient[0]} 75%)`,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.14 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={(i / 13) * width + (drift % 80)}
            y1={0}
            x2={(i / 13) * width - 200 + (drift % 80)}
            y2={height}
            stroke="white"
            strokeWidth={1}
          />
        ))}
        {Array.from({ length: 20 }, (_, i) => (
          <line
            key={`h${i}`}
            x1={0}
            y1={(i / 19) * height}
            x2={width}
            y2={(i / 19) * height}
            stroke="white"
            strokeWidth={0.5}
          />
        ))}
      </svg>
      {particles.map((p) => (
        <div
          key={p.key}
          style={{
            position: "absolute",
            left: p.x,
            top: p.y,
            width: p.size,
            height: p.size,
            borderRadius: "50%",
            background: "white",
            opacity: p.opacity,
          }}
        />
      ))}
    </AbsoluteFill>
  );
};

// Zoom de impacto + micro-shake al entrar la escena
export const PunchIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = spring({ frame, fps, config: { damping: 15, stiffness: 160 } });
  const scale = interpolate(zoom, [0, 1], [1.35, 1]);
  const shakeAmp = interpolate(frame, [0, 12], [9, 0], {
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 2.9) * shakeAmp;
  const shakeY = Math.cos(frame * 3.7) * shakeAmp;

  return (
    <AbsoluteFill
      style={{ transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)` }}
    >
      {children}
    </AbsoluteFill>
  );
};

// Contador que sube con overshoot
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
    config: { damping: 30, stiffness: 60 },
    durationInFrames: 45,
  });
  const value = (target * progress).toFixed(decimals);
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 10, stiffness: 170 },
  });
  const scale = interpolate(pop, [0, 1], [0.4, 1]);

  return (
    <span style={{ ...style, display: "inline-block", transform: `scale(${scale})` }}>
      {value}
      {suffix}
    </span>
  );
};

export const SlideUp: React.FC<{
  delay?: number;
  children: React.ReactNode;
  distance?: number;
}> = ({ delay = 0, children, distance = 70 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 150 },
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
