import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

const WORDS = ["Diseña", "Anima", "Renderiza", "Publica"];

const Word: React.FC<{ word: string; index: number }> = ({ word, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const delay = index * 10;
  const progress = spring({
    frame: frame - delay,
    fps,
    config: { damping: 16, stiffness: 140 },
  });

  const y = interpolate(progress, [0, 1], [60, 0]);
  const opacity = interpolate(progress, [0, 1], [0, 1]);
  const scale = interpolate(progress, [0, 1], [0.85, 1]);

  return (
    <span
      className="inline-block px-3 text-6xl font-bold text-white"
      style={{
        opacity,
        transform: `translateY(${y}px) scale(${scale})`,
      }}
    >
      {word}
    </span>
  );
};

export const TextReveal: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();

  const lineProgress = interpolate(frame, [0, durationInFrames - 20], [0, 1], {
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill className="items-center justify-center bg-black">
      <div
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-indigo-400 to-transparent"
        style={{ opacity: lineProgress }}
      />

      <div className="flex flex-wrap items-center justify-center gap-2 px-10">
        {WORDS.map((word, index) => (
          <Word key={word} word={word} index={index} />
        ))}
      </div>

      <p
        className="absolute bottom-24 text-lg text-slate-400"
        style={{
          opacity: interpolate(frame, [45, 60], [0, 1], {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }),
        }}
      >
        Tu pipeline de motion graphics con Remotion
      </p>
    </AbsoluteFill>
  );
};
