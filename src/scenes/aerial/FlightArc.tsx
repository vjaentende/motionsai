import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { PlaneIcon } from "./ui";

const W = 900;
const H = 360;
const P0 = { x: 70, y: 300 };
const P1 = { x: W / 2, y: -40 };
const P2 = { x: W - 70, y: 300 };

const bezier = (t: number) => ({
  x: (1 - t) ** 2 * P0.x + 2 * (1 - t) * t * P1.x + t ** 2 * P2.x,
  y: (1 - t) ** 2 * P0.y + 2 * (1 - t) * t * P1.y + t ** 2 * P2.y,
});

const tangentAngle = (t: number) => {
  const dx = 2 * (1 - t) * (P1.x - P0.x) + 2 * t * (P2.x - P1.x);
  const dy = 2 * (1 - t) * (P1.y - P0.y) + 2 * t * (P2.y - P1.y);
  return (Math.atan2(dy, dx) * 180) / Math.PI;
};

export const FlightArc: React.FC<{ accent: string; delay?: number }> = ({
  accent,
  delay = 8,
}) => {
  const frame = useCurrentFrame();

  const progress = interpolate(frame - delay, [0, 55], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // easing suave al final
  const eased = 1 - (1 - progress) ** 2.4;

  const pathLength = 1100;
  const plane = bezier(eased);
  const angle = tangentAngle(eased);
  const pulse = 1 + 0.12 * Math.sin(frame / 4);

  return (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{ overflow: "visible" }}>
      <path
        d={`M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
        stroke="rgba(255,255,255,0.18)"
        strokeWidth={7}
        strokeDasharray="4 22"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d={`M ${P0.x} ${P0.y} Q ${P1.x} ${P1.y} ${P2.x} ${P2.y}`}
        stroke={accent}
        strokeWidth={9}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={pathLength}
        strokeDashoffset={pathLength * (1 - eased)}
        style={{ filter: `drop-shadow(0 0 18px ${accent})` }}
      />
      {[P0, P2].map((p, i) => (
        <circle
          key={i}
          cx={p.x}
          cy={p.y}
          r={16 * pulse}
          fill={accent}
          style={{ filter: `drop-shadow(0 0 14px ${accent})` }}
        />
      ))}
      {eased > 0.01 && eased < 0.995 && (
        <g transform={`translate(${plane.x}, ${plane.y}) rotate(${angle + 90})`}>
          <g transform="translate(-34, -34)">
            <PlaneIcon size={68} color="white" />
          </g>
        </g>
      )}
    </svg>
  );
};
