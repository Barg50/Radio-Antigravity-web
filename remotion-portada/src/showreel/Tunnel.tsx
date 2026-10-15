import React from "react";
import { AbsoluteFill, random, useCurrentFrame } from "remotion";
import { C, display, body, EXPO_IN, EXPO_OUT, IN_OUT, TAU, tween, useUnits } from "./theme";

const EPISODES = [
  "La Libertad en Cristo y las Fiestas Patrias",
  "Juntos Somos Más Fuertes",
  "Pequeñas Acciones, Grandes Cambios",
  "La Amistad que Construye",
  "El Compromiso y la Fe",
  "Cuando Equivocarse También Nos Enseña",
];

const RING_COUNT = 16;
const DEPTH = 4800;

/** Plano 5: vuelo por un túnel de ondas; los episodios pasan junto a la cámara */
export const Tunnel: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, portrait } = useUnits();

  const iris = tween(f, [0, 12], [0, Math.hypot(W, H) / 2], EXPO_IN);
  const speed = tween(f, [0, 20, 60], [40, 85, 120], IN_OUT);
  // Distancia recorrida = integral aproximada de la velocidad
  let travel = 0;
  for (let i = 0; i < f; i++) travel += tween(i, [0, 20, 60], [40, 85, 120], IN_OUT);

  const roll = f * 0.7 + tween(f, [0, 72], [-10, 10], IN_OUT);
  const ringR = vmin * 52;

  const rings = Array.from({ length: RING_COUNT }, (_, i) => {
    const z = -DEPTH + ((i * (DEPTH / RING_COUNT) + travel) % DEPTH);
    const far = tween(z, [-DEPTH, -DEPTH * 0.6], [0, 1]);
    const near = tween(z, [200, 700], [1, 0]);
    return { z, o: far * near, color: i % 3 === 0 ? C.sky : C.gold, i };
  });

  const cardW = vmin * (portrait ? 62 : 46);
  const cards = EPISODES.map((title, k) => {
    const z = -2000 + (f - 4 * k) * 85;
    const a = (k / EPISODES.length) * TAU + 0.6;
    const rad = vmin * (portrait ? 26 : 30);
    const o = tween(z, [-2000, -1400], [0, 1]) * tween(z, [350, 700], [1, 0]);
    return {
      title,
      k,
      z,
      x: Math.cos(a) * rad * (portrait ? 0.7 : 1.5),
      y: Math.sin(a) * rad,
      o,
      tilt: Math.cos(a) * -18,
    };
  });
  const passed = cards.filter((c) => c.z > 0).length;

  const streaks = Array.from({ length: 70 }, (_, i) => {
    const a = random(`sk-a-${i}`) * TAU;
    const d = ((random(`sk-o-${i}`) * 1 + (f * speed) / 1400) % 1) ** 2;
    const dist = d * Math.hypot(W, H) * 0.6;
    return { a, dist, len: vmin * (2 + d * 30), o: d * 0.8 };
  });

  const flash = tween(f, [50, 64], [0, 1], EXPO_IN);
  const counterIn = tween(f, [8, 20], [0, 1], EXPO_OUT);

  return (
    <AbsoluteFill
      style={{
        clipPath: `circle(${iris}px at 50% 50%)`,
        background: `radial-gradient(circle at 50% 50%, #123a63 0%, ${C.bg2} 30%, ${C.bg} 70%)`,
        overflow: "hidden",
      }}
    >
      {/* Rayas de velocidad */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {streaks.map((s, i) => (
          <line
            key={i}
            x1={W / 2 + Math.cos(s.a) * s.dist}
            y1={H / 2 + Math.sin(s.a) * s.dist}
            x2={W / 2 + Math.cos(s.a) * (s.dist + s.len)}
            y2={H / 2 + Math.sin(s.a) * (s.dist + s.len)}
            stroke={i % 4 === 0 ? C.gold2 : "#ffffff"}
            strokeWidth={vmin * 0.18}
            strokeLinecap="round"
            opacity={s.o}
          />
        ))}
      </svg>

      {/* Escena 3D */}
      <AbsoluteFill style={{ perspective: vmin * 80, alignItems: "center", justifyContent: "center" }}>
        <div style={{ transformStyle: "preserve-3d", rotate: `${roll}deg` }}>
          {rings.map((r) => (
            <div
              key={r.i}
              style={{
                position: "absolute",
                left: -ringR,
                top: -ringR,
                width: ringR * 2,
                height: ringR * 2,
                borderRadius: "50%",
                border: `${vmin * 0.45}px solid ${r.color}`,
                boxShadow: `0 0 ${vmin * 2}px ${r.color}55, inset 0 0 ${vmin * 2}px ${r.color}33`,
                transform: `translateZ(${r.z}px)`,
                opacity: r.o,
              }}
            />
          ))}
          {cards.map((c) => (
            <div
              key={c.k}
              style={{
                position: "absolute",
                left: -cardW / 2,
                top: -vmin * 8,
                width: cardW,
                transform: `translate3d(${c.x}px, ${c.y}px, ${c.z}px) rotate(${-roll}deg) rotateY(${c.tilt}deg)`,
                opacity: c.o,
                padding: `${vmin * 2.2}px ${vmin * 2.8}px`,
                borderRadius: vmin * 2.2,
                background: "linear-gradient(135deg, rgba(20,48,84,0.92), rgba(9,24,44,0.92))",
                border: `${vmin * 0.2}px solid rgba(255,255,255,0.16)`,
                boxShadow: `0 ${vmin * 2}px ${vmin * 6}px rgba(0,0,0,0.5)`,
                display: "flex",
                gap: vmin * 2,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  flex: "none",
                  width: vmin * 9,
                  height: vmin * 9,
                  borderRadius: vmin * 1.4,
                  background: `linear-gradient(135deg, ${C.gold2}, ${C.gold})`,
                  color: C.bg,
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: vmin * 4.4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  letterSpacing: "-0.04em",
                }}
              >
                {String(c.k + 1).padStart(2, "0")}
              </div>
              <div>
                <div
                  style={{
                    fontFamily: body,
                    fontWeight: 800,
                    fontSize: vmin * 1.7,
                    letterSpacing: "0.25em",
                    color: C.spotify,
                  }}
                >
                  EPISODIO {c.k + 1}
                </div>
                <div
                  style={{
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: vmin * 3.2,
                    lineHeight: 1.05,
                    color: C.text,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {c.title}
                </div>
              </div>
            </div>
          ))}
        </div>
      </AbsoluteFill>

      {/* Contador en el punto de fuga */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "center",
          opacity: counterIn * (1 - flash),
          scale: String(0.8 + counterIn * 0.2 + flash * 0.6),
        }}
      >
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: vmin * 22,
            lineHeight: 0.9,
            color: C.gold2,
            letterSpacing: "-0.05em",
            textShadow: `0 0 ${vmin * 4}px rgba(242,185,59,0.6)`,
          }}
        >
          {String(passed).padStart(2, "0")}
        </div>
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: vmin * 2.2,
            letterSpacing: "0.45em",
            marginRight: "-0.45em",
            color: C.text,
          }}
        >
          EPISODIOS
        </div>
      </AbsoluteFill>

      {/* Destello final hacia el logo */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #fff 0%, ${C.gold2} ${flash * 40}%, transparent ${flash * 90}%)`,
          opacity: flash,
        }}
      />
    </AbsoluteFill>
  );
};
