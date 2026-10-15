import React from "react";
import { Composition } from "remotion";
import { Background } from "./Background";
import { Presentacion } from "./Presentacion";
import { Showreel } from "./showreel/Showreel";

// Video de fondo para la portada de la página: sin texto y sin corte al repetirse.
const PortadaLoop: React.FC = () => (
  <Background focalX={0.76} focalY={0.52} fadeInFrames={0} barScale={0.7} />
);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="PortadaLoop"
        component={PortadaLoop}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="Presentacion"
        component={Presentacion}
        durationInFrames={300}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ horario: "Todos los miércoles · 13:00 hrs" }}
      />
      {/* Reel promocional de 15 s: horizontal (YouTube/web) y vertical (Reels/TikTok/Historias) */}
      <Composition
        id="Showreel"
        component={Showreel}
        durationInFrames={450}
        fps={30}
        width={1920}
        height={1080}
        defaultProps={{ voz: null, musica: null }}
      />
      <Composition
        id="ShowreelVertical"
        component={Showreel}
        durationInFrames={450}
        fps={30}
        width={1080}
        height={1920}
        defaultProps={{ voz: null, musica: null }}
      />
    </>
  );
};
