import React from "react";
import { Img, useCurrentFrame } from "remotion";
import { persona } from "./equipo";
import { BACK_OUT, C, display, body, T, tween, useUnits } from "./theme";
import { LINEAS } from "./voces";

const nombres = (ids: readonly string[]) => {
  const n = ids.map((id) => persona(id).nombre);
  return n.length > 1 ? `${n.slice(0, -1).join(", ")} y ${n[n.length - 1]}` : n[0];
};

/** Etiqueta "en el aire": foto y nombre del niño que está hablando en ese momento */
export const SpeakerTag: React.FC = () => {
  const f = useCurrentFrame();
  const { vmin, portrait } = useUnits();

  // En el plano del equipo las fotos grandes ya muestran quién habla
  if (f >= T.teamStart && f < T.teamEnd) return null;

  return (
    <>
      {LINEAS.map((l, idx) => {
        // Si la siguiente frase sigue de inmediato, esta etiqueta se va antes para no encimarse
        const next = LINEAS[idx + 1];
        const end = next && next.desde - l.hasta < 12 ? next.desde - 2 : l.hasta + 8;
        if (f < l.desde - 2 || f >= end) return null;
        const inP = tween(f, [l.desde - 2, l.desde + 6], [0, 1], BACK_OUT);
        const outP = tween(f, [end - 8, end], [1, 0]);
        const o = Math.min(inP, outP);
        const av = vmin * (portrait ? 8.5 : 7);
        const bars = Array.from({ length: 5 }, (_, i) =>
          0.35 + 0.65 * Math.abs(Math.sin(f * 0.55 + i * 1.3)),
        );
        return (
          <div
            key={idx}
            style={{
              position: "absolute",
              left: vmin * 4,
              bottom: vmin * (portrait ? 6 : 8),
              display: "flex",
              alignItems: "center",
              gap: vmin * 1.6,
              padding: `${vmin * 0.9}px ${vmin * 2.6}px ${vmin * 0.9}px ${vmin * 0.9}px`,
              borderRadius: 999,
              backgroundColor: "rgba(7,11,22,0.78)",
              border: `${vmin * 0.2}px solid rgba(255,255,255,0.16)`,
              boxShadow: `0 ${vmin}px ${vmin * 4}px rgba(0,0,0,0.45)`,
              opacity: o,
              scale: String(0.7 + 0.3 * inP),
              transformOrigin: "left center",
              translate: `${(1 - inP) * -vmin * 6}px 0`,
            }}
          >
            <div style={{ display: "flex" }}>
              {l.quien.map((id, i) => (
                <Img
                  key={id}
                  src={persona(id).avatar}
                  style={{
                    width: av,
                    height: av,
                    borderRadius: "50%",
                    border: `${vmin * 0.35}px solid ${C.gold}`,
                    marginLeft: i === 0 ? 0 : -av * 0.35,
                    objectFit: "cover",
                  }}
                />
              ))}
            </div>
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: vmin * 0.7,
                  fontFamily: body,
                  fontWeight: 800,
                  fontSize: vmin * (portrait ? 1.9 : 1.5),
                  letterSpacing: "0.2em",
                  color: C.live,
                }}
              >
                <span style={{ opacity: f % 16 < 10 ? 1 : 0.3 }}>●</span> EN EL AIRE
                <span style={{ display: "flex", alignItems: "flex-end", gap: vmin * 0.25, height: vmin * 1.6, marginLeft: vmin * 0.4 }}>
                  {bars.map((b, i) => (
                    <span
                      key={i}
                      style={{
                        width: vmin * 0.35,
                        height: `${b * 100}%`,
                        borderRadius: 9,
                        backgroundColor: C.gold,
                      }}
                    />
                  ))}
                </span>
              </div>
              <div
                style={{
                  fontFamily: display,
                  fontWeight: 800,
                  fontSize: vmin * (portrait ? 3.6 : 2.9),
                  letterSpacing: "-0.02em",
                  color: C.text,
                  lineHeight: 1.1,
                  whiteSpace: "nowrap",
                }}
              >
                {nombres(l.quien)}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
