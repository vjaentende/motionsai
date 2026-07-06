import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const IntroTitle: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const titleSpring = spring({
    frame,
    fps,
    config: { damping: 14, stiffness: 120 },
  });

  const subtitleSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 18, stiffness: 100 },
  });

  const glowPulse = interpolate(Math.sin(frame / 18), [-1, 1], [0.35, 0.8]);

  const titleY = interpolate(titleSpring, [0, 1], [80, 0]);
  const titleOpacity = interpolate(titleSpring, [0, 1], [0, 1]);
  const subtitleY = interpolate(subtitleSpring, [0, 1], [40, 0]);
  const subtitleOpacity = interpolate(subtitleSpring, [0, 1], [0, 1]);

  return (
    <AbsoluteFill className="items-center justify-center bg-[#05070f]">
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(99,102,241,0.35), transparent 45%), radial-gradient(circle at 80% 80%, rgba(236,72,153,0.25), transparent 40%)",
        }}
      />

      <div
        className="absolute h-[420px] w-[420px] rounded-full blur-3xl"
        style={{
          background: "rgba(99,102,241,0.25)",
          opacity: glowPulse,
          transform: `scale(${interpolate(glowPulse, [0.35, 0.8], [0.9, 1.15])})`,
        }}
      />

      <div className="relative z-10 flex flex-col items-center gap-4 px-8 text-center">
        <div
          style={{
            opacity: titleOpacity,
            transform: `translateY(${titleY}px)`,
          }}
        >
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.35em] text-indigo-300">
            MotionsAI
          </p>
          <h1 className="bg-gradient-to-r from-white via-indigo-100 to-pink-200 bg-clip-text text-7xl font-black tracking-tight text-transparent">
            Motion Videos
          </h1>
        </div>

        <p
          className="max-w-2xl text-2xl font-light text-slate-300"
          style={{
            opacity: subtitleOpacity,
            transform: `translateY(${subtitleY}px)`,
          }}
        >
          Crea videos con animaciones programáticas en React
        </p>
      </div>
    </AbsoluteFill>
  );
};
