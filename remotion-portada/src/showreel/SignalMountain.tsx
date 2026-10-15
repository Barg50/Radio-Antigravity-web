import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import {
  BACK_OUT,
  C,
  display,
  body,
  EXPO_OUT,
  IN_OUT,
  sunPos,
  TAU,
  mix,
  tween,
  useUnits,
} from "./theme";

const POINTS = 180;

type Peak = { x: number; h: number; w: number };

/** Silueta de cordillera: el máximo de varios picos + un poco de serrucho */
const ridge = (x: number, W: number, ground: number, peaks: Peak[], jag: number) => {
  let lift = 0;
  for (const p of peaks) {
    const d = Math.abs(x - p.x * W) / (p.w * W);
    lift = Math.max(lift, p.h * Math.max(0, 1 - d) ** 1.25);
  }
  const noise = Math.sin(x * 0.083) * jag + Math.sin(x * 0.21 + 1.7) * jag * 0.45;
  return ground - lift + (lift > 0 ? noise * Math.min(1, lift / 40) : 0);
};

const toPath = (pts: [number, number][], closeTo?: number) => {
  if (pts.length === 0) return "";
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    d += ` L ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)}`;
  }
  if (closeTo !== undefined) {
    d += ` L ${pts[pts.length - 1][0].toFixed(1)} ${closeTo} L ${pts[0][0].toFixed(1)} ${closeTo} Z`;
  }
  return d;
};

const Word: React.FC<{
  text: string;
  f: number;
  start: number;
  size: number;
  color: string;
}> = ({ text, f, start, size, color }) => {
  const p = tween(f, [start, start + 14], [0, 1], EXPO_OUT);
  return (
    <span
      style={{
        display: "inline-block",
        overflow: "hidden",
        verticalAlign: "top",
        lineHeight: 0.92,
        paddingBottom: size * 0.06,
        marginBottom: -size * 0.06,
        margin: `0 ${size * 0.12}px`,
        opacity: p > 0 ? 1 : 0,
      }}
    >
      <span
        style={{
          display: "inline-block",
          translate: `0 ${(1 - p) * 110}%`,
          rotate: `${(1 - p) * 8}deg`,
          color,
          fontSize: size,
        }}
      >
        {text}
      </span>
    </span>
  );
};

/**
 * Plano 1 + 2: una señal dorada se enciende, vibra como onda de audio y
 * se solidifica en el cerro. La cámara sube hacia el sol.
 */
export const SignalMountain: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, vw, portrait } = useUnits();
  const SUN = sunPos(portrait);
  const cx = W / 2;
  const cy = H * 0.5;

  // --- La señal -----------------------------------------------------------
  const dot = tween(f, [0, 7], [0, 1], BACK_OUT);
  const halfLen = tween(f, [5, 22], [0, W / 2 + 40], EXPO_OUT);
  const amp = tween(f, [16, 38], [0, H * 0.13], EXPO_OUT);
  const morph = tween(f, [38, 58], [0, 1], IN_OUT);

  const ground = H * (portrait ? 0.74 : 0.8);
  const mainPeaks: Peak[] = [
    { x: 0.5, h: ground - H * (portrait ? 0.4 : 0.36), w: portrait ? 0.42 : 0.26 },
    { x: 0.18, h: H * 0.2, w: 0.2 },
    { x: 0.83, h: H * 0.24, w: 0.22 },
  ];

  const signal: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * W;
    if (Math.abs(x - cx) > halfLen) continue;
    const xn = x / W;
    const env = Math.sin(Math.PI * xn) ** 1.6;
    const wave =
      Math.sin(x * 0.019 + f * 0.42) * 0.55 +
      Math.sin(x * 0.047 - f * 0.61) * 0.3 +
      Math.sin(x * 0.11 + f * 0.9) * 0.15;
    const yWave = cy + amp * env * wave;
    const yMountain = ridge(x, W, ground, mainPeaks, 7);
    signal.push([x, mix(yWave, yMountain, morph)]);
  }

  // --- Cordillera con profundidad -----------------------------------------
  const rise = tween(f, [44, 80], [1, 0], EXPO_OUT);
  const backPts: [number, number][] = [];
  const frontPts: [number, number][] = [];
  for (let i = 0; i < POINTS; i++) {
    const x = (i / (POINTS - 1)) * W;
    backPts.push([
      x,
      ridge(
        x,
        W,
        ground - H * 0.04,
        [
          { x: 0.3, h: H * 0.34, w: 0.24 },
          { x: 0.68, h: H * 0.38, w: 0.26 },
          { x: 0.98, h: H * 0.22, w: 0.2 },
        ],
        9,
      ),
    ]);
    frontPts.push([
      x,
      ridge(
        x,
        W,
        H * 1.02,
        [
          { x: 0.08, h: H * 0.2, w: 0.3 },
          { x: 0.92, h: H * 0.17, w: 0.28 },
          { x: 0.5, h: H * 0.06, w: 0.5 },
        ],
        4,
      ),
    ]);
  }
  const peakY = ridge(cx, W, ground, mainPeaks, 7);

  // Cámara: empuja hacia el sol (el sol queda fijo en pantalla)
  const cam = tween(f, [46, 112], [1, 1.22], IN_OUT);
  const camRot = tween(f, [46, 112], [-1.2, 0.6], IN_OUT);

  // Sol que asoma detrás del cerro
  const sunR = vmin * 9;
  const sunRise = tween(f, [58, 96], [0, 1], EXPO_OUT);
  const sunY = mix(peakY + sunR * 1.4, SUN.y * H, sunRise);

  // Cruz que se dibuja sobre la cumbre
  const crossDraw = tween(f, [70, 88], [0, 1], EXPO_OUT);
  const crossH = vmin * 7;

  // Pinos del primer plano
  const trees = Array.from({ length: 22 }, (_, i) => {
    const x = random(`tree-x-${i}`) * W;
    const base = ridge(x, W, H * 1.02, [
      { x: 0.08, h: H * 0.2, w: 0.3 },
      { x: 0.92, h: H * 0.17, w: 0.28 },
      { x: 0.5, h: H * 0.06, w: 0.5 },
    ], 4);
    const h = vmin * (5 + random(`tree-h-${i}`) * 6);
    const grow = tween(f, [56 + (i % 7) * 2, 70 + (i % 7) * 2], [0, 1], BACK_OUT);
    return { x, base, h: h * grow };
  });

  // Estrellas
  const stars = Array.from({ length: 70 }, (_, i) => {
    const x = random(`st-x-${i}`) * W;
    const y = random(`st-y-${i}`) * H * 0.55;
    const tw = 0.5 + 0.5 * Math.sin(f * 0.25 + random(`st-p-${i}`) * TAU);
    const on = tween(f, [44 + random(`st-d-${i}`) * 20, 60 + random(`st-d-${i}`) * 20], [0, 1]);
    return { x, y, r: (0.6 + random(`st-r-${i}`) * 1.8) * (vmin / 10), o: on * (0.25 + tw * 0.6) };
  });

  // Tipografía de apertura
  const pre = "COLEGIO NAZAREO PRESENTA";
  const preIn = tween(f, [8, 26], [0, 1], EXPO_OUT);
  const preOut = tween(f, [34, 44], [1, 0]);

  const titleSize = Math.min(vw * (portrait ? 13 : 7.6), vmin * 15);
  const glow = 0.5 + 0.5 * Math.sin(f * 0.3);

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg, overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          scale: String(cam),
          rotate: `${camRot}deg`,
          transformOrigin: `${SUN.x * 100}% ${SUN.y * 100}%`,
        }}
      >
        {/* Cielo */}
        <AbsoluteFill
          style={{
            opacity: tween(f, [40, 70], [0, 1]),
            background: `radial-gradient(ellipse 70% 60% at ${SUN.x * 100}% ${SUN.y * 100 + 10}%, rgba(242,185,59,0.28), transparent 70%), linear-gradient(180deg, #050c18 0%, #0b2240 70%, #10345a 100%)`,
          }}
        />
        <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
          {stars.map((s, i) => (
            <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
          ))}
        </svg>

        {/* Sol (detrás de todo el relieve) */}
        <div
          style={{
            position: "absolute",
            left: SUN.x * W - sunR,
            top: sunY - sunR,
            width: sunR * 2,
            height: sunR * 2,
            borderRadius: "50%",
            background: `radial-gradient(circle at 40% 35%, ${C.gold2}, ${C.gold} 70%)`,
            boxShadow: `0 0 ${vmin * 8}px ${vmin * 3}px rgba(242,185,59,0.55)`,
            opacity: sunRise > 0 ? 1 : 0,
          }}
        />

        {/* Capa lejana */}
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, translate: `0 ${rise * H * 0.45}px` }}
        >
          <defs>
            <linearGradient id="back" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#2c6fa0" />
              <stop offset="1" stopColor="#0d2a4a" />
            </linearGradient>
          </defs>
          <path d={toPath(backPts, H)} fill="url(#back)" opacity={0.85 * tween(f, [44, 66], [0, 1])} />
        </svg>

        {/* Título entre la capa lejana y la cumbre: la montaña lo tapa → profundidad */}
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: H * (portrait ? 0.1 : 0.11),
            fontFamily: display,
            fontWeight: 800,
            letterSpacing: "-0.035em",
            lineHeight: 0.92,
            textAlign: "center",
            textShadow: `0 ${vmin * 0.6}px ${vmin * 3}px rgba(0,0,0,0.35)`,
            translate: `0 ${tween(f, [56, 112], [0, H * 0.02])}px`,
          }}
        >
          {portrait ? (
            <>
              <div>
                <Word text="DESDE LA" f={f} start={54} size={titleSize} color={C.text} />
              </div>
              <div>
                <Word text="PUNTA" f={f} start={60} size={titleSize} color={C.gold2} />
                <Word text="DEL" f={f} start={64} size={titleSize} color={C.text} />
              </div>
              <div>
                <Word text="CERRO" f={f} start={68} size={titleSize * 1.12} color={C.text} />
              </div>
            </>
          ) : (
            <>
              <div>
                <Word text="DESDE" f={f} start={54} size={titleSize} color={C.text} />
                <Word text="LA" f={f} start={57} size={titleSize} color={C.text} />
                <Word text="PUNTA" f={f} start={60} size={titleSize} color={C.gold2} />
              </div>
              <div>
                <Word text="DEL" f={f} start={64} size={titleSize} color={C.text} />
                <Word text="CERRO" f={f} start={68} size={titleSize} color={C.text} />
              </div>
            </>
          )}
        </AbsoluteFill>

        {/* La señal convertida en cumbre */}
        <svg width={W} height={H} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <defs>
            <linearGradient id="main" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#1b4f7e" />
              <stop offset="0.6" stopColor="#0c2442" />
              <stop offset="1" stopColor={C.bg} />
            </linearGradient>
            <linearGradient id="snow" gradientUnits="userSpaceOnUse" x1="0" y1={peakY} x2="0" y2={peakY + H * 0.14}>
              <stop offset="0" stopColor="#ffffff" stopOpacity={0.95} />
              <stop offset="1" stopColor="#ffffff" stopOpacity={0} />
            </linearGradient>
            <clipPath id="snowClip">
              <rect x={0} y={0} width={W} height={peakY + H * 0.14} />
            </clipPath>
            <filter id="lineGlow" x="-10%" y="-50%" width="120%" height="200%">
              <feGaussianBlur stdDeviation={vmin * 0.6} result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          {signal.length > 1 ? (
            <>
              <path d={toPath(signal, H)} fill="url(#main)" opacity={tween(f, [46, 66], [0, 1])} />
              {/* Nieve en la cumbre: la misma silueta recortada arriba */}
              <path
                d={toPath(signal, H)}
                fill="url(#snow)"
                clipPath="url(#snowClip)"
                opacity={tween(f, [60, 80], [0, 0.55])}
              />
              <path
                d={toPath(signal)}
                fill="none"
                stroke={C.gold2}
                strokeWidth={vmin * mix(0.42, 0.25, morph)}
                strokeLinejoin="round"
                filter="url(#lineGlow)"
                opacity={mix(1, 0.9, morph)}
              />
            </>
          ) : null}
          {/* Punto inicial */}
          <circle
            cx={cx}
            cy={cy}
            r={vmin * 1.1 * dot * tween(f, [8, 20], [1, 0.35])}
            fill={C.gold2}
            filter="url(#lineGlow)"
            opacity={tween(f, [18, 26], [1, 0])}
          />
          {/* Cruz */}
          <g
            stroke={C.text}
            strokeWidth={vmin * 0.55}
            strokeLinecap="round"
            filter="url(#lineGlow)"
          >
            <line
              x1={cx}
              y1={peakY - vmin * 0.4}
              x2={cx}
              y2={peakY - vmin * 0.4 - crossH * crossDraw}
            />
            <line
              x1={cx - crossH * 0.3 * crossDraw}
              y1={peakY - crossH * 0.7}
              x2={cx + crossH * 0.3 * crossDraw}
              y2={peakY - crossH * 0.7}
              opacity={crossDraw > 0.5 ? 1 : 0}
            />
          </g>
        </svg>

        {/* Primer plano con pinos: sube más rápido (parallax) */}
        <svg
          width={W}
          height={H}
          style={{ position: "absolute", inset: 0, translate: `0 ${rise * H * 0.6}px` }}
        >
          <path d={toPath(frontPts, H * 1.1)} fill="#04101f" />
          {trees.map((t, i) => (
            <path
              key={i}
              d={`M ${t.x} ${t.base - t.h} L ${t.x + t.h * 0.32} ${t.base + 2} L ${t.x - t.h * 0.32} ${t.base + 2} Z`}
              fill="#071a2e"
            />
          ))}
        </svg>
      </AbsoluteFill>

      {/* "Colegio Nazareo presenta": tracking que se cierra */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          paddingTop: vmin * 16,
          opacity: preIn * preOut,
        }}
      >
        <div
          style={{
            fontFamily: body,
            fontWeight: 600,
            fontSize: vmin * 2.2,
            color: C.muted,
            letterSpacing: `${mix(1.2, 0.5, preIn)}em`,
            marginRight: `-${mix(1.2, 0.5, preIn)}em`,
            filter: `blur(${(1 - preIn) * 6}px)`,
          }}
        >
          {pre}
        </div>
      </AbsoluteFill>

      {/* Pulso del punto: halo que se expande al encender */}
      <AbsoluteFill style={{ pointerEvents: "none" }}>
        <div
          style={{
            position: "absolute",
            left: cx,
            top: cy,
            width: vmin * 30,
            height: vmin * 30,
            translate: "-50% -50%",
            borderRadius: "50%",
            border: `${vmin * 0.25}px solid ${C.gold}`,
            scale: String(tween(f, [2, 22], [0.05, 1.6], EXPO_OUT)),
            opacity: tween(f, [2, 22], [0.9, 0]) * (0.7 + glow * 0.3),
          }}
        />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
