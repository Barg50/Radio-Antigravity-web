import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C, display, body, EXPO_IN, EXPO_OUT, TAU, tween, useUnits } from "./theme";

const WORDS = ["VOCES", "MÚSICA", "HISTORIAS", "AMISTAD", "FE"];
const WORD_START = 14;
const WORD_LEN = 12; // 0,4 s por palabra: van al golpe

/** Filtro "goo": desenfoque + contraste alto en alfa = metaballs que se funden */
const Goo: React.FC<{ id: string; blur: number }> = ({ id, blur }) => (
  <filter id={id} x="-20%" y="-20%" width="140%" height="140%">
    <feGaussianBlur in="SourceGraphic" stdDeviation={blur} result="b" />
    <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 28 -11" />
  </filter>
);

/** Plano 4: inundación líquida → metaballs → palabras al golpe con distorsión */
export const Fluid: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, vw, portrait } = useUnits();
  const cx = W / 2;
  const cy = H / 2;

  // --- Inundación azul que se come el plano dorado -----------------------
  const flood = Array.from({ length: 26 }, (_, i) => {
    const x = (i / 25) * W + (random(`fl-x-${i}`) - 0.5) * vmin * 8;
    const delay = random(`fl-d-${i}`) * 6;
    const p = tween(f, [delay, delay + 14], [0, 1], EXPO_IN);
    const r = vmin * (8 + random(`fl-r-${i}`) * 10);
    return { x, y: H + r - p * (H + r * 2.2), r };
  });
  const floodBase = tween(f, [3, 16], [0, 1], EXPO_IN);

  // --- Metaballs ----------------------------------------------------------
  const live = tween(f, [14, 26], [0, 1], EXPO_OUT);
  const collapse = tween(f, [62, 76], [0, 1], EXPO_IN);
  const orbit = (1 - collapse) * live;

  const blobs = (seed: string, n: number, spread: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = random(`${seed}-a-${i}`) * TAU + f * (0.02 + random(`${seed}-s-${i}`) * 0.03);
      const b = random(`${seed}-b-${i}`) * TAU + f * 0.017;
      const rx = vmin * spread * (0.4 + random(`${seed}-rx-${i}`) * 0.6) * (portrait ? 0.8 : 1.5);
      const ry = vmin * spread * (0.4 + random(`${seed}-ry-${i}`) * 0.6);
      const r = vmin * (6 + random(`${seed}-r-${i}`) * 9) * (1 - collapse * 0.75) * live;
      return { x: cx + Math.cos(a) * rx * orbit, y: cy + Math.sin(b) * ry * orbit, r };
    });
  const gold = blobs("g", 9, 34);
  const sky = blobs("s", 6, 40);

  // --- Palabras -----------------------------------------------------------
  const idx = Math.min(WORDS.length - 1, Math.max(0, Math.floor((f - WORD_START) / WORD_LEN)));
  const local = f - WORD_START - idx * WORD_LEN;
  const wordOn = f >= WORD_START && f < 76;
  const hit = Math.exp(-Math.max(0, local) / 2.6); // golpe de distorsión al cambiar
  const disp = vmin * 9 * hit;
  const split = vmin * 1.6 * hit;
  const word = WORDS[idx];
  const isLast = idx === WORDS.length - 1;
  const wordScale = (isLast ? 1.35 : 1) * (1 + hit * 0.12) * (1 - collapse);
  const wordSize = Math.min(
    (vw * (portrait ? 150 : 120)) / Math.max(5, word.length),
    vmin * (isLast ? 30 : 24),
  );

  const textStyle: React.CSSProperties = {
    position: "absolute",
    fontFamily: display,
    fontWeight: 800,
    fontSize: wordSize,
    letterSpacing: "-0.04em",
    lineHeight: 1,
    whiteSpace: "nowrap",
    // Escala y filtro van en cada capa (no en el contenedor) para que el blend
    // se mezcle con el líquido en vez de quedar aislado
    scale: String(wordScale),
    filter: "url(#glitch)",
  };

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <Goo id="goo-flood" blur={vmin * 2.2} />
          <Goo id="goo-blobs" blur={vmin * 2.6} />
          <filter id="glitch" x="-20%" y="-40%" width="140%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.004 0.09"
              numOctaves={2}
              seed={Math.floor(f / 2)}
              result="n"
            />
            <feDisplacementMap in="SourceGraphic" in2="n" scale={disp} xChannelSelector="R" yChannelSelector="G" />
          </filter>
        </defs>
      </svg>

      {/* Fondo azul: visible solo cuando la inundación ya cubrió */}
      <AbsoluteFill
        style={{
          opacity: f >= 16 ? 1 : 0,
          background: `radial-gradient(ellipse at 50% 50%, ${C.bg2}, ${C.bg} 75%)`,
        }}
      />

      {/* Metaballs dorados y celestes */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <g filter="url(#goo-blobs)" opacity={0.95}>
          {sky.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={C.sky} />
          ))}
        </g>
        <g filter="url(#goo-blobs)">
          {gold.map((b, i) => (
            <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={C.gold} />
          ))}
        </g>
      </svg>

      {/* Palabra: separación RGB + desplazamiento + blend "difference" sobre el líquido */}
      {wordOn ? (
        <AbsoluteFill
          style={{ alignItems: "center", justifyContent: "center" }}
        >
          <div style={{ ...textStyle, color: C.live, translate: `${-split}px 0`, mixBlendMode: "screen", opacity: hit }}>
            {word}
          </div>
          <div style={{ ...textStyle, color: C.sky, translate: `${split}px 0`, mixBlendMode: "screen", opacity: hit }}>
            {word}
          </div>
          <div style={{ ...textStyle, color: "#ffffff", mixBlendMode: "difference" }}>{word}</div>
        </AbsoluteFill>
      ) : null}

      {/* Índice tipo UI */}
      <AbsoluteFill
        style={{
          justifyContent: "flex-end",
          alignItems: "center",
          paddingBottom: H * (portrait ? 0.2 : 0.12),
          opacity: tween(f, [14, 20], [0, 1]) * (1 - collapse),
        }}
      >
        <div style={{ display: "flex", gap: vmin * 1.2 }}>
          {WORDS.map((_, i) => (
            <div
              key={i}
              style={{
                width: i === idx ? vmin * 5 : vmin * 1.2,
                height: vmin * 0.6,
                borderRadius: 99,
                backgroundColor: i <= idx ? C.gold : "rgba(255,255,255,0.25)",
              }}
            />
          ))}
        </div>
        <div
          style={{
            marginTop: vmin * 1.6,
            fontFamily: body,
            fontWeight: 600,
            fontSize: vmin * 1.8,
            letterSpacing: "0.4em",
            color: C.muted,
          }}
        >
          CADA MIÉRCOLES EN LA RADIO
        </div>
      </AbsoluteFill>

      {/* Inundación (encima de todo; desaparece tras cubrir) */}
      {f < 18 ? (
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          <g filter="url(#goo-flood)">
            {flood.map((b, i) => (
              <circle key={i} cx={b.x} cy={b.y} r={b.r} fill={C.bg} />
            ))}
            <rect x={-50} y={H * (1 - floodBase) + vmin * 4} width={W + 100} height={H} fill={C.bg} />
          </g>
        </svg>
      ) : null}
    </AbsoluteFill>
  );
};
