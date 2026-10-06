import React from "react";
import {
  AbsoluteFill,
  Easing,
  Img,
  Interactive,
  interpolate,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/BricolageGrotesque";
import { Background, COLORS } from "./Background";

const { fontFamily } = loadFont("normal", {
  weights: ["700"],
  subsets: ["latin"],
});

type PresentacionProps = {
  readonly horario: string;
};

export const Presentacion: React.FC<PresentacionProps> = ({ horario }) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const s = width / 1920;
  const easeOut = Easing.bezier(0.16, 1, 0.3, 1);

  return (
    <AbsoluteFill name="Presentacion" style={{ backgroundColor: COLORS.bg }}>
      <Background focalX={0.5} focalY={0.38} fadeInFrames={0.8 * fps} barScale={0.7} />

      <AbsoluteFill
        name="Escena"
        style={{
          alignItems: "center",
          justifyContent: "flex-start",
          paddingTop: 90 * s,
        }}
      >
        {/* Flota suavemente: se separa del que escala para no mezclar los dos movimientos */}
        <Interactive.Div
          name="Logo flotante"
          style={{
            translate: `0px ${Math.sin(frame / 38) * 9 * s}px`,
          }}
        >
          <Img
            src={staticFile("logo-radio.png")}
            name="Logo Radio Nazareo"
            style={{
              width: 560 * s,
              height: 560 * s,
              opacity: interpolate(frame, [0.2 * fps, 0.9 * fps], [0, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              }),
              scale: interpolate(frame, [0.2 * fps, 1.4 * fps], [0.6, 1], {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: Easing.bezier(0.34, 1.4, 0.64, 1),
                output: "perceptual-scale",
              }),
              filter: `drop-shadow(0 ${24 * s}px ${50 * s}px rgba(0,0,0,0.5))`,
            }}
          />
        </Interactive.Div>

        <Interactive.Div
          name="Horario"
          style={{
            marginTop: 40 * s,
            display: "flex",
            alignItems: "center",
            gap: 26 * s,
            padding: `${26 * s}px ${58 * s}px`,
            borderRadius: 999,
            border: `${2 * s}px solid rgba(255,255,255,0.22)`,
            backgroundColor: "rgba(10,26,48,0.82)",
            color: COLORS.text,
            fontFamily,
            fontWeight: 700,
            fontSize: 76 * s,
            letterSpacing: "-0.02em",
            opacity: interpolate(frame, [2.4 * fps, 3.1 * fps], [0, 1], {
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
              easing: easeOut,
            }),
            translate: interpolate(
              frame,
              [2.4 * fps, 3.1 * fps],
              [`0px ${40 * s}px`, "0px 0px"],
              {
                extrapolateLeft: "clamp",
                extrapolateRight: "clamp",
                easing: easeOut,
              },
            ),
          }}
        >
          <div
            style={{
              width: 26 * s,
              height: 26 * s,
              borderRadius: "50%",
              backgroundColor: COLORS.live,
              boxShadow: `0 0 ${24 * s}px ${COLORS.live}`,
              opacity: 0.65 + 0.35 * Math.sin(frame / 7),
            }}
          />
          {horario}
        </Interactive.Div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
