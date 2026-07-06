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
import { COLORS } from "../../data/aerial";
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
  size?: number;
  delay?: number;
  flightFrames?: number;
}> = ({ origin, dest, size = 860, delay = 14, flightFrames = 85 }) => {
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
  const wobble = Math.sin(frame / 70) * 1.2;

  const projection = useMemo(
    () =>
      geoOrthographic()
        .translate([size / 2, size / 2])
        .scale((size / 2 - 26) * zoom)
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

  const arrived = rawProgress >= 0.995;
  const globeR = (size / 2 - 26) * zoom;

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      style={{ overflow: "hidden", borderRadius: "50%" }}
    >
      <defs>
        <radialGradient id="ocean" cx="42%" cy="34%">
          <stop offset="0%" stopColor="#1B2436" />
          <stop offset="60%" stopColor="#121A2A" />
          <stop offset="100%" stopColor="#0A0F1B" />
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
        stroke="rgba(255,255,255,0.07)"
        strokeWidth={1}
      />

      {/* Continentes */}
      <path
        d={path(LAND) ?? undefined}
        fill="#26334B"
        stroke="rgba(190,205,230,0.4)"
        strokeWidth={1.2}
      />

      {/* Ruta completa punteada */}
      {fullRoutePath && (
        <path
          d={fullRoutePath}
          fill="none"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth={3}
          strokeDasharray="2 12"
          strokeLinecap="round"
        />
      )}

      {/* Ruta recorrida */}
      {traveledPath && progress > 0.005 && (
        <path
          d={traveledPath}
          fill="none"
          stroke={COLORS.accent}
          strokeWidth={4.5}
          strokeLinecap="round"
          style={{ filter: `drop-shadow(0 0 6px ${COLORS.accent}66)` }}
        />
      )}

      {/* Marcador de origen */}
      {originPos && (
        <g>
          <circle
            cx={originPos[0]}
            cy={originPos[1]}
            r={14}
            fill="none"
            stroke={COLORS.accent}
            strokeWidth={2}
            opacity={0.45}
          />
          <circle cx={originPos[0]} cy={originPos[1]} r={7.5} fill={COLORS.accent} />
        </g>
      )}

      {/* Marcador de destino */}
      {destPos && (
        <g>
          <circle
            cx={destPos[0]}
            cy={destPos[1]}
            r={14}
            fill="none"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth={2}
            opacity={arrived ? 0.9 : 0.4}
          />
          <circle
            cx={destPos[0]}
            cy={destPos[1]}
            r={7.5}
            fill={arrived ? "white" : "rgba(255,255,255,0.5)"}
          />
        </g>
      )}

      {/* Avión */}
      {planePos && !arrived && (
        <g
          transform={`translate(${planePos[0]}, ${planePos[1]}) rotate(${planeAngle + 90})`}
          style={{ filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.6))" }}
        >
          <g transform="translate(-26, -26)">
            <PlaneIcon size={52} color="#E8EAF0" />
          </g>
        </g>
      )}

      {/* Sombra interior del limbo */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={size / 2 - 3}
        fill="none"
        stroke="rgba(255,255,255,0.14)"
        strokeWidth={1.5}
      />
    </svg>
  );
};
