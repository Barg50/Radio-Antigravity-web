import React from "react";
import { AbsoluteFill, Img, useCurrentFrame } from "remotion";
import { persona } from "./equipo";
import { BACK_OUT, C, display, body, EXPO_IN, EXPO_OUT, IN_OUT, T, mix, tween, useUnits } from "./theme";
import { lineaEn } from "./voces";

// Orden en pantalla: los profes a los lados, los niños al centro
const ORDEN = ["benja", "victoria", "dakari", "fernanda", "gabriela", "gabi"];

/** Plano 6: el equipo. Cada foto se revela con una máscara y quien habla queda "en el aire" */
export const Team: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, portrait } = useUnits();
  const global = f + T.teamStart;
  const linea = lineaEn(global);
  const hablando = new Set(linea?.quien ?? []);

  const cols = portrait ? 3 : 6;
  const cardW = portrait ? W * 0.27 : W * 0.128;
  const cardH = cardW * 1.25;
  const gapX = portrait ? W * 0.035 : W * 0.018;
  const gapY = vmin * (portrait ? 14 : 9);
  const gridW = cols * cardW + (cols - 1) * gapX;
  const gridTop = portrait ? H * 0.31 : H * 0.36;

  const cam = tween(f, [0, 92], [1.04, 1], IN_OUT);
  const flashIn = tween(f, [0, 14], [1, 0], EXPO_OUT);
  const flashOut = tween(f, [78, 90], [0, 1], EXPO_IN);
  const exit = tween(f, [76, 90], [0, 1], EXPO_IN);

  const title = "LAS VOCES";
  const titleSize = Math.min(vmin * (portrait ? 17 : 13), W * 0.15);

  return (
    <AbsoluteFill
      style={{
        overflow: "hidden",
        background: `radial-gradient(ellipse 55% 45% at 22% 18%, rgba(123,108,255,0.35), transparent 70%), radial-gradient(ellipse 50% 45% at 82% 85%, rgba(242,195,90,0.25), transparent 70%), radial-gradient(ellipse 60% 50% at 70% 25%, rgba(143,211,240,0.18), transparent 70%), ${C.bg}`,
      }}
    >
      <AbsoluteFill style={{ scale: String(cam) }}>
        {/* Titular */}
        <div
          style={{
            position: "absolute",
            top: portrait ? H * 0.12 : H * 0.08,
            left: 0,
            right: 0,
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontFamily: body,
              fontWeight: 800,
              fontSize: vmin * (portrait ? 3 : 2.3),
              letterSpacing: "0.45em",
              marginRight: "-0.45em",
              color: C.gold2,
              opacity: tween(f, [2, 12], [0, 1]),
            }}
          >
            CONOCE AL EQUIPO
          </div>
          <div
            style={{
              fontFamily: display,
              fontWeight: 800,
              fontSize: titleSize,
              lineHeight: 1,
              letterSpacing: "-0.045em",
              color: C.text,
              marginTop: vmin * 0.8,
            }}
          >
            {title.split("").map((ch, i) => {
              const p = tween(f, [3 + i * 1.5, 17 + i * 1.5], [0, 1], EXPO_OUT);
              return (
                <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                  <span
                    style={{
                      display: "inline-block",
                      whiteSpace: "pre",
                      translate: `0 ${(1 - p) * 105}%`,
                      color: i >= 4 ? C.gold : C.text,
                    }}
                  >
                    {ch}
                  </span>
                </span>
              );
            })}
          </div>
        </div>

        {/* Fotos */}
        {ORDEN.map((id, i) => {
          const p = persona(id);
          const col = i % cols;
          const row = Math.floor(i / cols);
          const x = (W - gridW) / 2 + col * (cardW + gapX);
          const y = gridTop + row * (cardH + gapY);
          const start = 8 + i * 5;
          const reveal = tween(f, [start, start + 14], [0, 1], EXPO_OUT);
          const pop = tween(f, [start, start + 16], [0, 1], BACK_OUT);
          const on = hablando.has(id);
          const tilt = (i % 2 === 0 ? -1 : 1) * 2.5;
          const float = Math.sin((f + i * 11) / 13) * vmin * 0.6;
          const leave = tween(exit, [0, 1], [0, 1]) * (i % 2 === 0 ? -1 : 1);
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                left: x,
                top: y + float + (1 - pop) * vmin * 8,
                width: cardW,
                rotate: `${tilt * (1 - exit)}deg`,
                scale: String(mix(0.85, on ? 1.1 : 1, pop) * (1 - exit * 0.3)),
                translate: `0 ${leave * vmin * 4}px`,
                opacity: 1 - exit,
                zIndex: on ? 2 : 1,
              }}
            >
              <div
                style={{
                  width: cardW,
                  height: cardH,
                  borderRadius: vmin * 2.2,
                  overflow: "hidden",
                  clipPath: `inset(${(1 - reveal) * 100}% 0 0 0 round ${vmin * 2.2}px)`,
                  border: `${vmin * 0.4}px solid ${on ? C.gold : "rgba(255,255,255,0.16)"}`,
                  boxShadow: on
                    ? `0 0 0 ${vmin * 0.6}px rgba(242,195,90,0.25), 0 0 ${vmin * 6}px rgba(242,195,90,0.55)`
                    : `0 ${vmin * 2}px ${vmin * 5}px rgba(0,0,0,0.45)`,
                  backgroundColor: C.bg2,
                }}
              >
                <Img
                  src={p.foto}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    scale: String(mix(1.35, 1.02, reveal)),
                    filter: hablando.size > 0 && !on ? "saturate(0.6) brightness(0.7)" : "none",
                  }}
                />
              </div>
              {/* "En el aire" sobre la foto de quien habla */}
              <div
                style={{
                  position: "absolute",
                  top: -vmin * 2,
                  left: "50%",
                  translate: "-50% 0",
                  display: "flex",
                  alignItems: "center",
                  gap: vmin * 0.8,
                  padding: `${vmin * 0.6}px ${vmin * 1.6}px`,
                  borderRadius: 999,
                  backgroundColor: C.live,
                  color: "#fff",
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: vmin * 1.5,
                  letterSpacing: "0.12em",
                  whiteSpace: "nowrap",
                  opacity: on ? reveal : 0,
                  scale: on ? "1" : "0.6",
                }}
              >
                <span style={{ opacity: f % 16 < 10 ? 1 : 0.3 }}>●</span> EN EL AIRE
              </div>
              <div style={{ textAlign: "center", marginTop: vmin * 1.6, opacity: reveal }}>
                <div
                  style={{
                    fontFamily: display,
                    fontWeight: 800,
                    fontSize: vmin * (portrait ? 4 : 2.9),
                    letterSpacing: "-0.02em",
                    color: on ? C.gold2 : C.text,
                    lineHeight: 1.05,
                  }}
                >
                  {p.nombre}
                </div>
                <div
                  style={{
                    fontFamily: body,
                    fontWeight: 600,
                    fontSize: vmin * (portrait ? 2.2 : 1.6),
                    color: C.muted,
                    letterSpacing: "0.06em",
                  }}
                >
                  {p.rol}
                </div>
              </div>
            </div>
          );
        })}
      </AbsoluteFill>

      {/* Destellos de entrada (desde el túnel) y salida (hacia el logo) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 50%, #fff 0%, ${C.gold2} 45%, ${C.gold})`,
          opacity: Math.max(flashIn, flashOut),
        }}
      />
    </AbsoluteFill>
  );
};
