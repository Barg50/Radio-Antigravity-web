import React from "react";
import { AbsoluteFill, Html5Audio, Sequence, staticFile, useCurrentFrame } from "remotion";
import { Beyond } from "./Beyond";
import { Finale } from "./Finale";
import { Fluid } from "./Fluid";
import { SignalMountain } from "./SignalMountain";
import { C, body, T, tween, useUnits } from "./theme";
import { Tunnel } from "./Tunnel";

export type ShowreelProps = {
  /** Archivo en public/ con la voz grabada (ver GUION-VOZ.md). null = sin audio */
  readonly voz: string | null;
  /** Archivo en public/ con música de fondo. null = sin música */
  readonly musica: string | null;
};

// Golpes de cámara en los cortes fuertes
const IMPACTS = [T.beyondStart + 2, T.fluidStart + 12, T.tunnelStart + 4];

const Grain: React.FC = () => {
  const f = useCurrentFrame();
  const { W, H } = useUnits();
  return (
    <svg
      width={W}
      height={H}
      style={{ position: "absolute", inset: 0, opacity: 0.09, mixBlendMode: "overlay" }}
    >
      <filter id="grain">
        <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves={2} seed={f % 24} />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width={W} height={H} filter="url(#grain)" />
    </svg>
  );
};

/** Interfaz de "cámara grabando": se mezcla en modo difference para leerse sobre cualquier fondo */
const Hud: React.FC = () => {
  const f = useCurrentFrame();
  const { vmin } = useUnits();
  const o = tween(f, [14, 26], [0, 0.75]) * tween(f, [T.logoStart - 6, T.logoStart], [1, 0]);
  if (o <= 0) return null;
  const pad = vmin * 4;
  const arm = vmin * 3;
  const line = vmin * 0.22;
  const sec = Math.floor(f / 30);
  const fr = f % 30;
  const tc = `00:00:${String(sec).padStart(2, "0")}:${String(fr).padStart(2, "0")}`;
  const label: React.CSSProperties = {
    position: "absolute",
    fontFamily: body,
    fontWeight: 600,
    fontSize: vmin * 1.6,
    letterSpacing: "0.28em",
    color: "#fff",
    mixBlendMode: "difference",
    opacity: o,
    fontVariantNumeric: "tabular-nums",
  };
  const corner = (top: boolean, left: boolean): React.CSSProperties => ({
    position: "absolute",
    [top ? "top" : "bottom"]: pad,
    [left ? "left" : "right"]: pad,
    width: arm,
    height: arm,
    [top ? "borderTop" : "borderBottom"]: `${line}px solid #fff`,
    [left ? "borderLeft" : "borderRight"]: `${line}px solid #fff`,
    mixBlendMode: "difference",
    opacity: o,
  });
  return (
    <>
      <div style={corner(true, true)} />
      <div style={corner(true, false)} />
      <div style={corner(false, true)} />
      <div style={corner(false, false)} />
      <div style={{ ...label, top: pad + arm * 0.35, left: pad + arm * 1.3 }}>
        <span style={{ color: C.live, opacity: f % 30 < 18 ? 1 : 0.2 }}>●</span> REC
      </div>
      <div style={{ ...label, top: pad + arm * 0.35, right: pad + arm * 1.3 }}>{tc}</div>
      <div style={{ ...label, bottom: pad + arm * 0.35, left: pad + arm * 1.3 }}>RADIO NAZAREO</div>
      <div style={{ ...label, bottom: pad + arm * 0.35, right: pad + arm * 1.3 }}>REEL 2026</div>
    </>
  );
};

export const Showreel: React.FC<ShowreelProps> = ({ voz, musica }) => {
  const f = useCurrentFrame();
  const { vmin } = useUnits();

  let shake = 0;
  for (const at of IMPACTS) {
    if (f >= at) shake += Math.exp(-(f - at) / 3.5);
  }
  const sx = Math.sin(f * 2.3) * shake * vmin * 0.9;
  const sy = Math.cos(f * 3.1) * shake * vmin * 0.9;

  return (
    <AbsoluteFill style={{ backgroundColor: C.bg }}>
      <AbsoluteFill style={{ translate: `${sx}px ${sy}px`, scale: String(1 + shake * 0.015) }}>
        <Sequence name="1-2 Señal → Cerro" durationInFrames={T.mountainEnd}>
          <SignalMountain />
        </Sequence>
        <Sequence name="3 Y más allá" from={T.beyondStart} durationInFrames={T.beyondEnd - T.beyondStart}>
          <Beyond />
        </Sequence>
        <Sequence name="4 Líquido + palabras" from={T.fluidStart} durationInFrames={T.fluidEnd - T.fluidStart}>
          <Fluid />
        </Sequence>
        <Sequence name="5 Túnel de episodios" from={T.tunnelStart} durationInFrames={T.tunnelEnd - T.tunnelStart}>
          <Tunnel />
        </Sequence>
        <Sequence name="6-7 Logo + Spotify" from={T.logoStart}>
          <Finale />
        </Sequence>
      </AbsoluteFill>

      {/* Viñeta */}
      <AbsoluteFill
        style={{
          background: "radial-gradient(ellipse 75% 70% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)",
        }}
      />
      <Grain />
      <Hud />

      {voz ? <Html5Audio src={staticFile(voz)} /> : null}
      {musica ? <Html5Audio src={staticFile(musica)} volume={0.35} /> : null}
    </AbsoluteFill>
  );
};
