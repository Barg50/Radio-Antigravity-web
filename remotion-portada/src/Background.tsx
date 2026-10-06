import React from "react";
import {
  AbsoluteFill,
  interpolate,
  random,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

export const COLORS = {
  bg: "#060f1c",
  gold: "#f2b93b",
  gold2: "#ffd978",
  sky: "#8fd3f0",
  live: "#ff5d4d",
  text: "#f3f6fa",
};

type BackgroundProps = {
  /** Punto de donde nacen las ondas, como fracción del ancho/alto (0 a 1) */
  readonly focalX: number;
  readonly focalY: number;
  /** Frames de aparición gradual al inicio. 0 = sin fundido (necesario para un loop sin corte) */
  readonly fadeInFrames: number;
  /** Altura relativa de las barras del ecualizador (1 = completa) */
  readonly barScale?: number;
};

const RING_COUNT = 5;
const RING_CYCLES = 2; // cuántas veces se expande cada anillo durante el video
const BAR_COUNT = 56;
const PARTICLE_COUNT = 36;

const TAU = Math.PI * 2;

/**
 * Todo se calcula con "progreso del video" (0 a 1) y ciclos enteros,
 * así el último cuadro encaja con el primero y el video se repite sin corte.
 */
export const Background: React.FC<BackgroundProps> = ({
  focalX,
  focalY,
  fadeInFrames,
  barScale = 1,
}) => {
  const frame = useCurrentFrame();
  const { width, height, durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const s = width / 1920; // todas las medidas están pensadas para 1920 de ancho

  const intro =
    fadeInFrames > 0
      ? interpolate(frame, [0, fadeInFrames], [0, 1], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      : 1;

  const fx = focalX * width;
  const fy = focalY * height;
  const maxRadius = Math.hypot(width, height) * 0.62;

  const rings = Array.from({ length: RING_COUNT }, (_, i) => {
    const p = (t * RING_CYCLES + i / RING_COUNT) % 1;
    const opacity = Math.min(1, p / 0.1) * Math.pow(1 - p, 1.6) * 0.5;
    return { r: 40 * s + p * maxRadius, opacity, color: i % 2 === 0 ? COLORS.gold : COLORS.sky };
  });

  const bars = Array.from({ length: BAR_COUNT }, (_, k) => {
    const speed = 2 + Math.floor(random(`bar-speed-${k}`) * 5); // 2 a 6 ciclos enteros
    const phase = random(`bar-phase-${k}`) * TAU;
    const pos = k / (BAR_COUNT - 1);
    const wave = 0.5 + 0.5 * Math.sin(TAU * speed * t + phase);
    const beat = Math.pow(Math.max(0, Math.sin(TAU * 16 * t)), 6); // golpe a 120 bpm si dura 8 s
    const bass = 1 - pos * 0.7;
    const envelope = 0.35 + 0.65 * Math.sin(Math.PI * Math.min(1, pos * 1.05 + 0.02));
    const h = 16 * s + 190 * s * barScale * envelope * Math.min(1, wave * 0.75 + beat * bass * 0.5);
    return { h, pos };
  });

  const particles = Array.from({ length: PARTICLE_COUNT }, (_, i) => {
    const cycles = 1 + Math.floor(random(`p-cycles-${i}`) * 2); // 1 o 2 subidas por video
    const p = (t * cycles + random(`p-offset-${i}`)) % 1;
    const x =
      random(`p-x-${i}`) * width +
      Math.sin(TAU * (t * cycles + random(`p-ph-${i}`))) * 36 * s;
    const y = height + 20 * s - p * (height + 40 * s);
    const size = (4 + random(`p-size-${i}`) * 7) * s;
    const opacity = Math.sin(Math.PI * p) * 0.65;
    const color = [COLORS.gold, COLORS.gold2, COLORS.sky, "#ffffff"][i % 4];
    return { x, y, size, opacity, color };
  });

  const breathe = 0.16 + 0.05 * Math.sin(TAU * 2 * t);

  return (
    <AbsoluteFill
      name="Fondo"
      style={{
        backgroundColor: COLORS.bg,
        backgroundImage: [
          `radial-gradient(ellipse 60% 55% at 12% 18%, rgba(242,185,59,0.16), transparent 70%)`,
          `radial-gradient(ellipse 55% 50% at 92% 88%, rgba(143,211,240,0.13), transparent 70%)`,
        ].join(","),
      }}
    >
      <AbsoluteFill
        name="Resplandor"
        style={{
          opacity: intro,
          backgroundImage: `radial-gradient(circle at ${focalX * 100}% ${focalY * 100}%, rgba(242,185,59,${breathe}), transparent 42%)`,
        }}
      />

      <svg
        width={width}
        height={height}
        style={{ position: "absolute", inset: 0, opacity: intro }}
      >
        {rings.map((ring, i) => (
          <circle
            key={i}
            cx={fx}
            cy={fy}
            r={ring.r}
            fill="none"
            stroke={ring.color}
            strokeWidth={3 * s}
            opacity={ring.opacity}
          />
        ))}
      </svg>

      <AbsoluteFill name="Particulas" style={{ opacity: intro }}>
        {particles.map((pt, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pt.x,
              top: pt.y,
              width: pt.size,
              height: pt.size,
              borderRadius: "50%",
              backgroundColor: pt.color,
              opacity: pt.opacity,
            }}
          />
        ))}
      </AbsoluteFill>

      <AbsoluteFill
        name="Ecualizador"
        style={{
          opacity: intro,
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: 70 * s,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 * s }}>
          {bars.map((bar, k) => (
            <div
              key={k}
              style={{
                width: 14 * s,
                height: bar.h,
                borderRadius: 8 * s,
                backgroundImage: `linear-gradient(180deg, ${COLORS.gold2}, ${COLORS.gold})`,
                opacity: 0.55 + 0.3 * (1 - bar.pos),
              }}
            />
          ))}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
