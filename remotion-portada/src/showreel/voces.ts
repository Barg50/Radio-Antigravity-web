// Pauta de voces: qué niño habla, cuándo (frames a 30 fps) y qué dice.
// La usa el video para mostrar quién está "en el aire" y es la misma que va en GUION-VOZ.md.
export type Linea = {
  readonly quien: readonly string[];
  readonly desde: number;
  readonly hasta: number;
  readonly texto: string;
};

export const LINEAS: readonly Linea[] = [
  { quien: ["dakari"], desde: 10, hasta: 42, texto: "¿Nos escuchan?" },
  { quien: ["victoria"], desde: 50, hasta: 98, texto: "Desde la punta del cerro…" },
  { quien: ["dakari", "victoria", "fernanda"], desde: 104, hasta: 152, texto: "…¡y más allá!" },
  { quien: ["dakari"], desde: 179, hasta: 190, texto: "Voces." },
  { quien: ["fernanda"], desde: 191, hasta: 202, texto: "Música." },
  { quien: ["victoria"], desde: 203, hasta: 214, texto: "Historias." },
  { quien: ["dakari"], desde: 215, hasta: 226, texto: "Amistad." },
  { quien: ["fernanda"], desde: 227, hasta: 244, texto: "¡Y fe!" },
  { quien: ["victoria"], desde: 250, hasta: 296, texto: "Siete episodios te están esperando." },
  { quien: ["fernanda"], desde: 306, hasta: 348, texto: "Somos las voces de Radio Nazareo…" },
  { quien: ["victoria"], desde: 352, hasta: 386, texto: "¡Y este es nuestro equipo!" },
  { quien: ["fernanda"], desde: 398, hasta: 446, texto: "En vivo todos los miércoles, a la una." },
  { quien: ["dakari", "victoria", "fernanda"], desde: 452, hasta: 488, texto: "¡Escúchanos en Spotify!" },
  { quien: ["dakari"], desde: 492, hasta: 534, texto: "Y entra a radionazareo punto vercel punto app." },
];

export const lineaEn = (frame: number) =>
  LINEAS.find((l) => frame >= l.desde && frame < l.hasta) ?? null;
