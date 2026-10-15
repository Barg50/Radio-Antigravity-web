import React from "react";
import { AbsoluteFill, useCurrentFrame } from "remotion";
import {
  C,
  display,
  EXPO_IN,
  EXPO_OUT,
  IN_OUT,
  sunPos,
  T,
  tween,
  useUnits,
} from "./theme";

const ECHOES = 9;

const Marquee: React.FC<{
  f: number;
  y: number;
  angle: number;
  dir: 1 | -1;
  bg: string;
  color: string;
  size: number;
  W: number;
}> = ({ f, y, angle, dir, bg, color, size, W }) => {
  const text = "RADIO NAZAREO ✦ DESDE LA PUNTA DEL CERRO ✦ Y MÁS ALLÁ ✦ ";
  const enter = tween(f, [6, 22], [1, 0], EXPO_OUT);
  return (
    <div
      style={{
        position: "absolute",
        left: -W * 0.5,
        width: W * 2,
        top: y,
        rotate: `${angle}deg`,
        translate: `${enter * dir * W}px 0`,
        backgroundColor: bg,
        padding: `${size * 0.32}px 0`,
        overflow: "hidden",
        whiteSpace: "nowrap",
      }}
    >
      <div
        style={{
          fontFamily: display,
          fontWeight: 800,
          fontSize: size,
          color,
          letterSpacing: "0.02em",
          translate: `${(dir * f * 9) % (size * 30) - size * 15}px 0`,
        }}
      >
        {text.repeat(4)}
      </div>
    </div>
  );
};

/** Plano 3: el sol se abre como un iris dorado y aparece "Y MÁS ALLÁ" en 3D */
export const Beyond: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, vw, portrait } = useUnits();
  const SUN = sunPos(portrait);

  // Radio del sol al final del plano anterior (sol 9vmin × cámara 1.22)
  const startR = vmin * 9 * 1.22;
  const r = tween(f, [0, 13], [startR, Math.hypot(W, H)], EXPO_IN);

  // Cámara 3D
  const rotY = tween(f, [4, 60], [-38, 14], EXPO_OUT);
  const rotX = tween(f, [4, 60], [22, -8], EXPO_OUT);
  const z = tween(f, [4, 40], [-900, 0], EXPO_OUT);
  const drift = tween(f, [40, T.beyondEnd - T.beyondStart], [0, 1], IN_OUT);

  const size = Math.min(vw * (portrait ? 30 : 21), vmin * 34);

  const lines = ["Y MÁS", "ALLÁ"];

  const rings = Array.from({ length: 6 }, (_, i) => {
    const p = ((f + i * 12) % 72) / 72;
    return { scale: 0.2 + p * 2.4, o: (1 - p) * 0.35 };
  });

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${r}px at ${SUN.x * 100}% ${SUN.y * 100}%)`,
        background: `radial-gradient(circle at 50% 45%, ${C.gold2} 0%, ${C.gold} 55%, #d99a1e 100%)`,
        overflow: "hidden",
      }}
    >
      {/* Ondas de radio */}
      <AbsoluteFill style={{ alignItems: "center", justifyContent: "center" }}>
        {rings.map((ring, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              width: vmin * 60,
              height: vmin * 60,
              borderRadius: "50%",
              border: `${vmin * 0.35}px solid ${C.bg}`,
              scale: String(ring.scale),
              opacity: ring.o,
            }}
          />
        ))}
      </AbsoluteFill>

      <Marquee
        f={f}
        y={H * (portrait ? 0.16 : 0.1)}
        angle={-7}
        dir={1}
        bg={C.bg}
        color={C.gold}
        size={vmin * 3.2}
        W={W}
      />
      <Marquee
        f={f}
        y={H * (portrait ? 0.8 : 0.82)}
        angle={-7}
        dir={-1}
        bg="transparent"
        color="rgba(6,15,28,0.6)"
        size={vmin * 3.2}
        W={W}
      />

      {/* Tipografía 3D con eco extruido */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          perspective: vmin * 120,
        }}
      >
        <div
          style={{
            transformStyle: "preserve-3d",
            transform: `translateZ(${z + drift * 160}px) rotateX(${rotX}deg) rotateY(${rotY + drift * 6}deg)`,
          }}
        >
          {Array.from({ length: ECHOES + 1 }, (_, e) => {
            const echo = ECHOES - e; // pinta del fondo hacia adelante
            const front = echo === 0;
            return (
              <div
                key={echo}
                style={{
                  position: front ? "relative" : "absolute",
                  inset: 0,
                  transform: `translateZ(${-echo * vmin * 1.6}px)`,
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: size,
                  lineHeight: 0.86,
                  letterSpacing: "-0.045em",
                  textAlign: "center",
                  color: front ? C.bg : "transparent",
                  WebkitTextStroke: front ? undefined : `${vmin * 0.18}px rgba(6,15,28,${0.55 - echo * 0.05})`,
                  whiteSpace: "nowrap",
                }}
              >
                {lines.map((line, li) => (
                  <div key={li}>
                    {line.split("").map((ch, ci) => {
                      const start = 3 + li * 6 + ci * 1.6;
                      const p = tween(f, [start, start + 16], [0, 1], EXPO_OUT);
                      return (
                        <span
                          key={ci}
                          style={{
                            display: "inline-block",
                            translate: `0 ${(1 - p) * 70}%`,
                            rotate: `${(1 - p) * -14}deg`,
                            opacity: p,
                            whiteSpace: "pre",
                          }}
                        >
                          {ch}
                        </span>
                      );
                    })}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
