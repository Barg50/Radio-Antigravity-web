import React from "react";
import { AbsoluteFill, Img, random, staticFile } from "remotion";
import { C, display, body, useUnits } from "./theme";

/**
 * Portada (imagen fija) para el reel de Instagram, 1080×1920.
 * Instagram muestra la portada recortada al centro en la grilla del perfil,
 * así que todo lo importante vive en la franja central (≈ y 285–1635).
 */
export const PortadaReel: React.FC = () => {
  const { W, H } = useUnits();

  const ridge = (ground: number, peaks: { x: number; h: number; w: number }[], jag: number) => {
    const pts: string[] = [];
    for (let i = 0; i <= 140; i++) {
      const x = (i / 140) * W;
      let lift = 0;
      for (const p of peaks) {
        const d = Math.abs(x - p.x * W) / (p.w * W);
        lift = Math.max(lift, p.h * Math.max(0, 1 - d) ** 1.25);
      }
      const y = ground - lift + Math.sin(x * 0.083) * jag * Math.min(1, lift / 40);
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return `M0,${H} L${pts.join(" L")} L${W},${H} Z`;
  };

  const stars = Array.from({ length: 90 }, (_, i) => ({
    x: random(`pc-x-${i}`) * W,
    y: random(`pc-y-${i}`) * H * 0.7,
    r: 0.8 + random(`pc-r-${i}`) * 2.2,
    o: 0.2 + random(`pc-o-${i}`) * 0.6,
  }));

  const logoSize = 700;
  const logoCy = 930;

  // Onda dorada (la misma señal del reel)
  const sig: string[] = [];
  for (let i = 0; i <= 160; i++) {
    const x = (i / 160) * W;
    const env = Math.sin(Math.PI * (i / 160)) ** 1.6;
    const y = 1515 + env * 34 * (Math.sin(x * 0.03 + 1) * 0.6 + Math.sin(x * 0.071) * 0.4);
    sig.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <AbsoluteFill
      style={{
        background: `radial-gradient(ellipse 70% 40% at 50% 48%, rgba(242,185,59,0.30), transparent 70%), linear-gradient(180deg, #050c18 0%, #0a1d36 55%, #10345a 100%)`,
        overflow: "hidden",
      }}
    >
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        {stars.map((s, i) => (
          <circle key={i} cx={s.x} cy={s.y} r={s.r} fill="#fff" opacity={s.o} />
        ))}
        {[1, 2, 3, 4].map((k) => (
          <circle
            key={k}
            cx={W / 2}
            cy={logoCy}
            r={260 + k * 110}
            fill="none"
            stroke={k % 2 ? C.gold : C.sky}
            strokeWidth={4}
            opacity={0.28 - k * 0.05}
          />
        ))}
        <path
          d={ridge(H * 0.86, [
            { x: 0.2, h: 420, w: 0.42 },
            { x: 0.82, h: 470, w: 0.45 },
          ], 9)}
          fill="#1d5585"
          opacity={0.75}
        />
        <path
          d={ridge(H * 0.95, [
            { x: 0.5, h: 330, w: 0.55 },
            { x: 0.02, h: 220, w: 0.3 },
            { x: 0.98, h: 240, w: 0.3 },
          ], 6)}
          fill="#0b2443"
        />
        <polyline
          points={sig.join(" ")}
          fill="none"
          stroke={C.gold2}
          strokeWidth={5}
          style={{ filter: `drop-shadow(0 0 10px ${C.gold})` }}
        />
      </svg>

      {/* Etiqueta superior */}
      <div
        style={{
          position: "absolute",
          top: 300,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            padding: "14px 30px",
            borderRadius: 999,
            border: "2px solid rgba(255,255,255,0.22)",
            backgroundColor: "rgba(10,26,48,0.8)",
            fontFamily: body,
            fontWeight: 800,
            fontSize: 30,
            letterSpacing: "0.18em",
            color: C.text,
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: "50%",
              backgroundColor: C.live,
              boxShadow: `0 0 16px ${C.live}`,
            }}
          />
          RADIO ESCOLAR · COLEGIO NAZAREO
        </div>
      </div>

      {/* Titular */}
      <div
        style={{
          position: "absolute",
          top: 385,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: display,
          fontWeight: 800,
          fontSize: 168,
          lineHeight: 0.9,
          letterSpacing: "-0.045em",
          color: C.gold2,
          rotate: "-4deg",
          textShadow: `0 10px 0 ${C.bg}, 0 18px 40px rgba(0,0,0,0.5)`,
        }}
      >
        ¡DALE PLAY!
      </div>

      {/* Logo */}
      <Img
        src={staticFile("logo-radio.png")}
        style={{
          position: "absolute",
          left: W / 2 - logoSize / 2,
          top: logoCy - logoSize / 2 + 40,
          width: logoSize,
          height: logoSize,
          filter: "drop-shadow(0 30px 50px rgba(0,0,0,0.55))",
        }}
      />

      {/* Spotify + horario */}
      <div
        style={{
          position: "absolute",
          top: 1355,
          left: 0,
          right: 0,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 20,
            padding: "18px 40px 18px 22px",
            borderRadius: 999,
            backgroundColor: C.spotify,
            boxShadow: "0 0 50px rgba(29,185,84,0.5)",
            fontFamily: display,
            fontWeight: 800,
            fontSize: 54,
            letterSpacing: "-0.02em",
            color: "#04210f",
          }}
        >
          <svg width={70} height={70} viewBox="0 0 100 100">
            <circle cx={50} cy={50} r={50} fill="#0b0b0b" />
            <g fill="none" stroke={C.spotify} strokeLinecap="round">
              <path d="M 23 37 Q 52 27 79 42" strokeWidth={8.5} />
              <path d="M 27 53 Q 52 45 73 57" strokeWidth={7} />
              <path d="M 31 67 Q 50 61 67 70" strokeWidth={5.6} />
            </g>
          </svg>
          Escúchanos en Spotify
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          top: 1570,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 800,
          fontSize: 38,
          letterSpacing: "0.06em",
          color: C.text,
          textShadow: "0 4px 20px rgba(0,0,0,0.6)",
        }}
      >
        MIÉRCOLES · 13:00 HRS
      </div>

      {/* Fuera de la franja central: solo se ve al abrir el reel */}
      <div
        style={{
          position: "absolute",
          bottom: 110,
          left: 0,
          right: 0,
          textAlign: "center",
          fontFamily: body,
          fontWeight: 800,
          fontSize: 34,
          color: C.gold2,
          letterSpacing: "0.04em",
        }}
      >
        radionazareo.vercel.app
      </div>
    </AbsoluteFill>
  );
};
