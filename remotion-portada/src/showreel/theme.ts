import { continueRender, delayRender, Easing, interpolate, staticFile, useVideoConfig } from "remotion";

// Fuentes de la página (Bricolage Grotesque + Figtree) incluidas en public/fonts:
// el render no depende de que haya internet.
export const display = "ReelDisplay";
export const body = "ReelBody";

const loadLocalFont = (family: string, file: string, weight: string) => {
  if (typeof document === "undefined") return;
  const handle = delayRender(`Cargando ${family}`);
  const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format("woff2")`, { weight });
  face
    .load()
    .then(() => {
      document.fonts.add(face);
      continueRender(handle);
    })
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
};

loadLocalFont(display, "BricolageGrotesque-800.woff2", "100 900");
loadLocalFont(body, "Figtree-latin.woff2", "300 900");

// Paleta de la página (style.css) + el verde de Spotify para el cierre
export const C = {
  bg: "#060f1c",
  bg2: "#0a1a30",
  navy: "#0e2039",
  gold: "#f2b93b",
  gold2: "#ffd978",
  sky: "#8fd3f0",
  live: "#ff5d4d",
  text: "#f3f6fa",
  muted: "#9db3c8",
  spotify: "#1db954",
};

export const TAU = Math.PI * 2;

// Curvas: una sola familia para que todo el video se mueva con la misma "mano"
export const EXPO_OUT = Easing.bezier(0.16, 1, 0.3, 1);
export const EXPO_IN = Easing.bezier(0.7, 0, 0.84, 0);
export const IN_OUT = Easing.bezier(0.65, 0, 0.35, 1);
export const BACK_OUT = Easing.bezier(0.34, 1.56, 0.64, 1);

/** interpolate con clamp en ambos extremos (lo que se usa el 95% del tiempo) */
export const tween = (
  f: number,
  input: readonly number[],
  output: readonly number[],
  easing?: (t: number) => number,
) =>
  interpolate(f, input, output, {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
    easing,
  });

export const mix = (a: number, b: number, t: number) => a + (b - a) * t;

/**
 * Unidades relativas para que el mismo reel funcione en 16:9 y 9:16.
 * vmin = 1% del lado corto, vw/vh = 1% del ancho/alto.
 */
export const useUnits = () => {
  const { width, height, fps } = useVideoConfig();
  const vmin = Math.min(width, height) / 100;
  return {
    W: width,
    H: height,
    fps,
    vmin,
    vw: width / 100,
    vh: height / 100,
    portrait: height > width,
  };
};

// Momentos clave (frames a 30 fps, 120 bpm → un golpe cada 15 frames)
export const T = {
  mountainEnd: 112,
  beyondStart: 100,
  beyondEnd: 178,
  fluidStart: 165,
  fluidEnd: 250,
  tunnelStart: 236,
  tunnelEnd: 302,
  logoStart: 300,
  spotifyStart: 355,
  end: 450,
};

// Posición del sol detrás del cerro: la cámara del primer plano escala en torno a él
// para que el "iris" dorado del segundo plano nazca exactamente ahí.
export const sunPos = (portrait: boolean) => ({ x: 0.5, y: portrait ? 0.385 : 0.34 });
