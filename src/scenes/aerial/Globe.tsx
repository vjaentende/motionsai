import React, { useMemo } from "react";
import { interpolate, useCurrentFrame } from "remotion";
import {
  geoDistance,
  geoGraticule,
  geoInterpolate,
  geoOrthographic,
  geoPath,
} from "d3-geo";
import { feature } from "topojson-client";
import type { FeatureCollection, MultiPolygon, Polygon } from "geojson";
import type { Topology, GeometryCollection } from "topojson-specification";
import landTopo from "../../data/land-110m.json";
import { PlaneIcon } from "./ui";

const topology = landTopo as unknown as Topology<{
  land: GeometryCollection;
}>;
const LAND = feature(
  topology,
  topology.objects.land,
) as unknown as FeatureCollection<Polygon | MultiPolygon>;

const GRATICULE = geoGraticule().step([15, 15])();

const easeOut = (t: number) => 1 - (1 - t) ** 2.4;

export const Globe: React.FC<{
  origin: [number, number];
  dest: [number, number];
  accent: string;
  size?: number;
  delay?: number;
  flightFrames?: number;
}> = ({ origin, dest, accent, size = 860, delay = 12, flightFrames = 80 }) => {
  const frame = useCurrentFrame();

  const rawProgress = interpolate(frame - delay, [0, flightFrames], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const progress = easeOut(rawProgress);

  const interpolator = useMemo(() => geoInterpolate(origin, dest), [origin, dest]);
  const distance = useMemo(() => geoDistance(origin, dest), [origin, dest]);

  // Zoom según la longitud de la ruta: rutas cortas → más cerca
  const zoom = Math.min(7, Math.max(1.25, 1.15 / distance));

  // La cámara sigue al avión a lo largo del gran círculo
  const camera = interpolator(progress);
  const wobble = Math.sin(frame / 55) * 2;

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([size / 2, size / 2])
        .scale((size / 2 - 28) * zoom)
        .clipAngle(90),
    [size, zoom],
  );
  projection.rotate([-camera[0] + wobble, -camera[1], 0]);

  const path = geoPath(projection);

  const SAMPLES = 80;
  const traveled: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    traveled.push(interpolator((i / SAMPLES) * progress));
  }
  const fullRoute: [number, number][] = [];
  for (let i = 0; i <= SAMPLES; i++) {
    fullRoute.push(interpolator(i / SAMPLES));
  }

  const traveledPath = path({ type: "LineString", coordinates: traveled });
  const fullRoutePath = path({ type: "LineString", coordinates: fullRoute });

  const planePos = projection(interpolator(progress));
  const ahead = projection(interpolator(Math.min(1, progress + 0.02)));
  const planeAngle =
    planePos && ahead
      ? (Math.atan2(ahead[1] - planePos[1], ahead[0] - planePos[0]) * 180) / Math.PI
      : 0;

  const isVisible = (p: [number, number]) =>
    geoDistance(p, camera) < Math.PI / 2 - 0.02;

  const originPos = isVisible(origin) ? projection(origin) : null;
  const destPos = isVisible(dest) ? projection(dest) : null;

  const pulse = 1 + 0.22 * Math.sin(frame / 4.5);
  const arrived = rawProgress >= 0.995;
  const globeR = (size / 2 - 28) * zoom;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "hidden", borderRadius: "50%" }}
    >
      <defs>
        <radialGradient id="ocean" cx="38%" cy="30%">
          <stop offset="0%" stopColor="rgba(56,88,180,0.95)" />
          <stop offset="55%" stopColor="rgba(16,30,80,0.98)" />
          <stop offset="100%" stopColor="rgba(4,10,34,1)" />
        </radialGradient>
        <radialGradient id="atmo" cx="50%" cy="50%">
          <stop offset="78%" stopColor="rgba(120,170,255,0)" />
          <stop offset="94%" stopColor="rgba(120,170,255,0.35)" />
          <stop offset="100%" stopColor="rgba(160,200,255,0.7)" />
        </radialGradient>
      </defs>

      {/* Océano */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={Math.min(globeR, size)}
        fill="url(#ocean)"
      />

      {/* Retícula */}
      <path
        d={path(GRATICULE) ?? undefined}
        fill="none"
        stroke="rgba(150,180,255,0.16)"
        strokeWidth={1.2}
      />

      {/* Continentes */}
      <path
        d={path(LAND) ?? undefined}
        fill="rgba(94,140,255,0.34)"
        stroke="rgba(170,200,255,0.75)"
        strokeWidth={1.6}
      />

      {/* Ruta completa punteada */}
      {fullRoutePath && (
        <path
          d={fullRoutePath}
          fill="none"
          stroke="rgba(255,255,255,0.28)"
          strokeWidth={5}
          strokeDasharray="3 16"
          strokeLinecap="round"
        />
      )}

      {/* Ruta recorrida con glow */}
      {traveledPath && progress > 0.005 && (
        <path
          d={traveledPath}
          fill="none"
          stroke={accent}
          strokeWidth={8}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 14px ${accent})` }}
        />
      )}

      {/* Marcador de origen */}
      {originPos && (
        <g>
          <circle
            cx={originPos[0]}
            cy={originPos[1]}
            r={16 * pulse}
            fill="none"
            stroke={accent}
            strokeWidth={3}
            opacity={0.6}
          />
          <circle cx={originPos[0]} cy={originPos[1]} r={11} fill={accent} />
        </g>
      )}

      {/* Marcador de destino */}
      {destPos && (
        <g>
          <circle
            cx={destPos[0]}
            cy={destPos[1]}
            r={arrived ? 20 * pulse : 13}
            fill="none"
            stroke="white"
            strokeWidth={3.5}
            opacity={arrived ? 0.9 : 0.55}
          />
          <circle
            cx={destPos[0]}
            cy={destPos[1]}
            r={11}
            fill={arrived ? "white" : "rgba(255,255,255,0.55)"}
            style={arrived ? { filter: "drop-shadow(0 0 18px white)" } : undefined}
          />
        </g>
      )}

      {/* Avión */}
      {planePos && !arrived && (
        <g
          transform={`translate(${planePos[0]}, ${planePos[1]}) rotate(${planeAngle + 90})`}
          style={{ filter: "drop-shadow(0 0 14px rgba(255,255,255,0.9))" }}
        >
          <g transform="translate(-32, -32)">
            <PlaneIcon size={64} color="white" />
          </g>
        </g>
      )}

      {/* Atmósfera */}
      <circle cx={size / 2} cy={size / 2} r={size / 2 - 4} fill="url(#atmo)" />
    </svg>
  );
};
