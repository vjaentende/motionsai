import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const SocialPromo: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const cardSpring = spring({
    frame,
    fps,
    config: { damping: 18, stiffness: 110 },
  });

  const badgeSpring = spring({
    frame: frame - 18,
    fps,
    config: { damping: 14, stiffness: 130 },
  });

  const cardScale = interpolate(cardSpring, [0, 1], [0.8, 1]);
  const cardOpacity = interpolate(cardSpring, [0, 1], [0, 1]);
  const badgeY = interpolate(badgeSpring, [0, 1], [30, 0]);
  const badgeOpacity = interpolate(badgeSpring, [0, 1], [0, 1]);
  const rotation = interpolate(frame, [0, 90], [-4, 4]);

  return (
    <AbsoluteFill className="items-center justify-center bg-[#0b1020]">
      <div
        className="absolute h-[700px] w-[700px] rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(168,85,247,0.35), rgba(59,130,246,0.15))",
          transform: `rotate(${rotation}deg)`,
        }}
      />

      <div
        className="relative flex h-[760px] w-[760px] flex-col justify-between rounded-[48px] border border-white/10 bg-white/5 p-12 backdrop-blur-md"
        style={{
          opacity: cardOpacity,
          transform: `scale(${cardScale})`,
        }}
      >
        <div>
          <p className="text-sm uppercase tracking-[0.3em] text-violet-300">
            MotionsAI
          </p>
          <h1 className="mt-4 text-6xl font-black leading-tight text-white">
            Videos que se mueven solos
          </h1>
        </div>

        <div
          className="inline-flex w-fit rounded-full bg-violet-500 px-6 py-3 text-xl font-semibold text-white"
          style={{
            opacity: badgeOpacity,
            transform: `translateY(${badgeY}px)`,
          }}
        >
          Hecho con Remotion
        </div>
      </div>
    </AbsoluteFill>
  );
};
