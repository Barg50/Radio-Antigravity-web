import React from "react";
import { AbsoluteFill, Img, random, staticFile, useCurrentFrame } from "remotion";
import { BACK_OUT, C, display, body, EXPO_OUT, IN_OUT, TAU, mix, tween, useUnits } from "./theme";

const LOGO = staticFile("logo-radio.png");
const URL_TEXT = "radionazareo.vercel.app";

// Momentos dentro del cierre (frame 0 = destello del logo)
const MOVE = [56, 74] as const; // el logo sube y deja espacio a Spotify
const DISC = 62;

/** Icono de Spotify dibujado: disco verde + tres ondas (que son las ondas del micrófono) */
const SpotifyMark: React.FC<{ size: number; f: number }> = ({ size, f }) => {
  const draw = (i: number) => tween(f, [DISC + 8 + i * 3, DISC + 22 + i * 3], [0, 1], EXPO_OUT);
  const arcs = [
    { d: "M 23 37 Q 52 27 79 42", w: 8.5 },
    { d: "M 27 53 Q 52 45 73 57", w: 7 },
    { d: "M 31 67 Q 50 61 67 70", w: 5.6 },
  ];
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{ overflow: "visible" }}>
      <circle cx={50} cy={50} r={50} fill={C.spotify} />
      {arcs.map((a, i) => (
        <path
          key={i}
          d={a.d}
          fill="none"
          stroke="#0b0b0b"
          strokeWidth={a.w}
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray={1}
          strokeDashoffset={1 - draw(i)}
        />
      ))}
    </svg>
  );
};

export const Finale: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H, vmin, vw, portrait } = useUnits();

  // --- Logo ---------------------------------------------------------------
  const enter = tween(f, [0, 22], [0, 1], BACK_OUT);
  const sharp = tween(f, [0, 14], [0, 1], EXPO_OUT);
  const move = tween(f, MOVE as unknown as number[], [0, 1], IN_OUT);
  const logoSize = vmin * (portrait ? 78 : 62);
  const logoY = mix(H * (portrait ? 0.42 : 0.45), H * (portrait ? 0.17 : 0.19), move);
  const logoScale = mix(mix(2.3, 1, enter), portrait ? 0.5 : 0.42, move);
  const float = Math.sin(f / 14) * vmin * 0.5;
  const sweep = tween(f, [16, 38], [-0.6, 1.6], IN_OUT);

  // Sacudida al impacto
  const shake = Math.exp(-f / 4) * vmin * 1.2;
  const sx = Math.sin(f * 2.7) * shake;
  const sy = Math.cos(f * 3.3) * shake;

  // Ráfaga de partículas
  const burst = Array.from({ length: 80 }, (_, i) => {
    const a = random(`bu-a-${i}`) * TAU;
    const v = 0.35 + random(`bu-v-${i}`) * 0.65;
    const p = tween(f, [2, 46], [0, 1], EXPO_OUT);
    const d = p * v * Math.hypot(W, H) * 0.55;
    const size = vmin * (0.4 + random(`bu-s-${i}`) * 1.1) * (1 - p * 0.7);
    return {
      x: W / 2 + Math.cos(a) * d,
      y: H * (portrait ? 0.42 : 0.45) + Math.sin(a) * d + p * p * vmin * 8,
      size,
      o: tween(f, [2, 6, 46], [0, 1, 0]),
      color: [C.gold2, C.gold, C.sky, "#ffffff"][i % 4],
    };
  });

  // Ondas de radio de fondo (siguen al logo y luego al disco de Spotify)
  const ringCy = move < 0.5 ? H * (portrait ? 0.42 : 0.45) : H * (portrait ? 0.46 : 0.465);
  const ringColor = f > DISC ? C.spotify : C.gold;
  const rings = Array.from({ length: 5 }, (_, i) => {
    const p = ((f + i * 9) % 45) / 45;
    return { s: 0.3 + p * 2.6, o: (1 - p) ** 1.5 * 0.4 };
  });

  // Horario
  const pillIn = tween(f, [20, 32], [0, 1], EXPO_OUT);
  const pillOut = tween(f, [50, 58], [1, 0]);

  // --- Spotify ------------------------------------------------------------
  const discIn = tween(f, [DISC, DISC + 16], [0, 1], BACK_OUT);
  const discSize = vmin * (portrait ? 30 : 21);
  const discY = H * (portrait ? 0.46 : 0.465);
  const word = "SPOTIFY";
  const listenIn = tween(f, [76, 88], [0, 1], EXPO_OUT);
  const typed = Math.round(tween(f, [96, 120], [0, URL_TEXT.length]));
  const pillUrlIn = tween(f, [92, 104], [0, 1], EXPO_OUT);
  const cursorOn = Math.floor(f / 8) % 2 === 0 || (f > 96 && f < 120);
  const lineIn = tween(f, [100, 124], [0, 1], EXPO_OUT);

  const spotifySize = Math.min(vw * (portrait ? 17 : 11), vmin * 17);

  // Firma: la misma señal del inicio, cerrando el círculo
  const sigY = H * 0.95;
  const sigPts: string[] = [];
  for (let i = 0; i <= 120; i++) {
    const x = (i / 120) * W;
    if (Math.abs(x - W / 2) > (W / 2) * lineIn) continue;
    const env = Math.sin(Math.PI * (i / 120)) ** 2;
    const y = sigY + env * vmin * 1.4 * (Math.sin(x * 0.03 + f * 0.4) * 0.6 + Math.sin(x * 0.07 - f * 0.6) * 0.4);
    sigPts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
  }

  return (
    <AbsoluteFill style={{ overflow: "hidden" }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(ellipse 60% 55% at 50% 45%, rgba(242,185,59,${mix(0.32, 0.1, move)}), transparent 70%), radial-gradient(ellipse 60% 50% at 50% 55%, rgba(29,185,84,${0.25 * discIn}), transparent 70%), ${C.bg}`,
        }}
      />

      <AbsoluteFill style={{ translate: `${sx}px ${sy}px` }}>
        {/* Ondas */}
        {rings.map((r, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: W / 2 - vmin * 25,
              top: ringCy - vmin * 25,
              width: vmin * 50,
              height: vmin * 50,
              borderRadius: "50%",
              border: `${vmin * 0.3}px solid ${ringColor}`,
              scale: String(r.s),
              opacity: r.o * tween(f, [0, 10], [0, 1]) * (move > 0 && move < 1 ? 0.3 : 1),
            }}
          />
        ))}

        {/* Partículas */}
        {burst.map((b, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: b.x,
              top: b.y,
              width: b.size,
              height: b.size,
              borderRadius: "50%",
              backgroundColor: b.color,
              opacity: b.o,
              boxShadow: `0 0 ${b.size * 2}px ${b.color}`,
            }}
          />
        ))}

        {/* Logo + barrido de luz enmascarado con la propia silueta del logo */}
        <div
          style={{
            position: "absolute",
            left: W / 2 - logoSize / 2,
            top: logoY - logoSize / 2 + float,
            width: logoSize,
            height: logoSize,
            scale: String(logoScale),
            rotate: `${(1 - enter) * -8}deg`,
            filter: `blur(${(1 - sharp) * vmin * 2.5}px) drop-shadow(0 ${vmin * 2}px ${vmin * 4}px rgba(0,0,0,0.5))`,
          }}
        >
          <Img src={LOGO} style={{ width: "100%", height: "100%" }} />
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `linear-gradient(105deg, transparent ${(sweep - 0.18) * 100}%, rgba(255,255,255,0.85) ${sweep * 100}%, transparent ${(sweep + 0.18) * 100}%)`,
              mixBlendMode: "overlay",
              WebkitMaskImage: `url(${LOGO})`,
              WebkitMaskSize: "100% 100%",
              maskImage: `url(${LOGO})`,
              maskSize: "100% 100%",
            }}
          />
        </div>

        {/* Horario */}
        <AbsoluteFill
          style={{
            alignItems: "center",
            justifyContent: "flex-end",
            paddingBottom: H * (portrait ? 0.16 : 0.06),
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: vmin * 2,
              padding: `${vmin * 1.8}px ${vmin * 4}px`,
              borderRadius: 999,
              border: `${vmin * 0.2}px solid rgba(255,255,255,0.22)`,
              backgroundColor: "rgba(10,26,48,0.85)",
              fontFamily: display,
              fontWeight: 800,
              fontSize: vmin * 5,
              color: C.text,
              letterSpacing: "-0.02em",
              opacity: pillIn * pillOut,
              translate: `0 ${(1 - pillIn) * vmin * 6 - (1 - pillOut) * vmin * 4}px`,
            }}
          >
            <div
              style={{
                width: vmin * 2,
                height: vmin * 2,
                borderRadius: "50%",
                backgroundColor: C.live,
                boxShadow: `0 0 ${vmin * 2}px ${C.live}`,
                opacity: 0.6 + 0.4 * Math.sin(f / 3),
              }}
            />
            MIÉRCOLES · 13:00 HRS
          </div>
        </AbsoluteFill>
      </AbsoluteFill>

      {/* Disco de Spotify */}
      <div
        style={{
          position: "absolute",
          left: W / 2 - discSize / 2,
          top: discY - discSize / 2,
          scale: String(discIn),
          rotate: `${(1 - discIn) * -90}deg`,
          filter: `drop-shadow(0 0 ${vmin * 5}px rgba(29,185,84,0.55))`,
        }}
      >
        <SpotifyMark size={discSize} f={f} />
      </div>

      {/* Texto de llamada */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          top: discY + discSize / 2 + vmin * 3,
          textAlign: "center",
        }}
      >
        <div
          style={{
            fontFamily: body,
            fontWeight: 800,
            fontSize: vmin * (portrait ? 3.4 : 2.6),
            letterSpacing: `${mix(0.9, 0.42, listenIn)}em`,
            marginRight: `-${mix(0.9, 0.42, listenIn)}em`,
            color: C.muted,
            opacity: listenIn,
          }}
        >
          ESCÚCHANOS EN
        </div>
        <div
          style={{
            fontFamily: display,
            fontWeight: 800,
            fontSize: spotifySize,
            lineHeight: 0.95,
            letterSpacing: "-0.04em",
            color: C.text,
            marginTop: vmin * 0.5,
          }}
        >
          {word.split("").map((ch, i) => {
            const p = tween(f, [80 + i * 2, 96 + i * 2], [0, 1], EXPO_OUT);
            return (
              <span key={i} style={{ display: "inline-block", overflow: "hidden", verticalAlign: "top" }}>
                <span
                  style={{
                    display: "inline-block",
                    translate: `0 ${(1 - p) * 105}%`,
                    color: i === 0 ? C.spotify : C.text,
                  }}
                >
                  {ch}
                </span>
              </span>
            );
          })}
        </div>
      </div>

      {/* URL que se escribe */}
      <AbsoluteFill
        style={{
          alignItems: "center",
          justifyContent: "flex-end",
          paddingBottom: H * (portrait ? 0.11 : 0.085),
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            padding: `${vmin * 1.3}px ${vmin * 3.2}px`,
            borderRadius: 999,
            border: `${vmin * 0.22}px solid ${C.gold}`,
            background: "rgba(242,185,59,0.1)",
            fontFamily: body,
            fontWeight: 800,
            fontSize: vmin * (portrait ? 4.6 : 3.9),
            color: C.gold2,
            opacity: pillUrlIn,
            scale: String(mix(0.85, 1, pillUrlIn)),
            minWidth: vmin * (portrait ? 60 : 48),
            justifyContent: "center",
          }}
        >
          {URL_TEXT.slice(0, typed)}
          <span
            style={{
              display: "inline-block",
              width: vmin * 0.35,
              height: vmin * 3.6,
              marginLeft: vmin * 0.4,
              backgroundColor: C.gold2,
              opacity: cursorOn ? 1 : 0,
            }}
          />
        </div>
      </AbsoluteFill>

      {/* Señal final */}
      <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
        <polyline
          points={sigPts.join(" ")}
          fill="none"
          stroke={C.gold2}
          strokeWidth={vmin * 0.25}
          opacity={0.8}
          style={{ filter: `drop-shadow(0 0 ${vmin * 0.8}px ${C.gold})` }}
        />
      </svg>

      {/* Destello de entrada (continúa el del túnel) */}
      <AbsoluteFill
        style={{
          background: `radial-gradient(circle at 50% 45%, #ffffff, ${C.gold2} 60%, ${C.gold})`,
          opacity: tween(f, [0, 16], [1, 0], EXPO_OUT),
        }}
      />
    </AbsoluteFill>
  );
};
