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

// Fondo con gradiente animado, pulso al beat y partículas rápidas
export const SceneBackground: React.FC<{
  gradient: [string, string];
  seed: string;
}> = ({ gradient, seed }) => {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();

  const drift = interpolate(frame, [0, 300], [0, 55]);
  // Pulso sutil sincronizado con el beat (130 bpm ≈ cada 13.8 frames)
  const beatPulse = Math.exp(-((frame % 13.8) / 4)) * 0.06;

  const particles = Array.from({ length: 30 }, (_, i) => {
    const x = random(`${seed}-x-${i}`) * width;
    const speed = 3 + random(`${seed}-s-${i}`) * 6;
    const y = ((random(`${seed}-y-${i}`) * height + frame * speed) % (height + 80)) - 40;
    const size = 3 + random(`${seed}-r-${i}`) * 7;
    const opacity = 0.15 + random(`${seed}-o-${i}`) * 0.45;
    return { x, y, size, opacity, key: i };
  });

  return (
    <AbsoluteFill style={{ transform: `scale(${1 + beatPulse})` }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at ${50 + drift * 0.5}% ${32 - drift * 0.25}%, ${gradient[1]}, ${gradient[0]} 78%)`,
        }}
      />
      <svg width={width} height={height} style={{ position: "absolute", opacity: 0.13 }}>
        {Array.from({ length: 14 }, (_, i) => (
          <line
            key={`v${i}`}
            x1={(i / 13) * width + (drift % 80)}
            y1={0}
            x2={(i / 13) * width - 220 + (drift % 80)}
            y2={height}
            stroke="white"
            strokeWidth={1}
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

// Zoom de impacto + shake + flash blanco al entrar la escena
export const PunchIn: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const zoom = spring({ frame, fps, config: { damping: 14, stiffness: 170 } });
  const scale = interpolate(zoom, [0, 1], [1.4, 1]);
  const shakeAmp = interpolate(frame, [0, 11], [11, 0], {
    extrapolateRight: "clamp",
  });
  const shakeX = Math.sin(frame * 3.1) * shakeAmp;
  const shakeY = Math.cos(frame * 3.9) * shakeAmp;
  const flash = interpolate(frame, [0, 7], [0.85, 0], {
    extrapolateRight: "clamp",
  });

  return (
    <>
      <AbsoluteFill
        style={{ transform: `scale(${scale}) translate(${shakeX}px, ${shakeY}px)` }}
      >
        {children}
      </AbsoluteFill>
      <AbsoluteFill style={{ background: "white", opacity: flash, pointerEvents: "none" }} />
    </>
  );
};

// Contador que sube con overshoot y pop
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
    config: { damping: 28, stiffness: 70 },
    durationInFrames: 38,
  });
  const pop = spring({
    frame: frame - delay,
    fps,
    config: { damping: 9, stiffness: 190 },
  });
  const scale = interpolate(pop, [0, 1], [0.35, 1]);

  return (
    <span style={{ ...style, display: "inline-block", transform: `scale(${scale})` }}>
      {(target * progress).toFixed(decimals)}
      {suffix}
    </span>
  );
};

export const SlideUp: React.FC<{
  delay?: number;
  children: React.ReactNode;
  distance?: number;
}> = ({ delay = 0, children, distance = 80 }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 15, stiffness: 160 },
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
