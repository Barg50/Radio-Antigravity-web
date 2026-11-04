// Fotos del equipo: se importan directo desde assets/equipo de la página (sin duplicarlas)
import benja from "../../../assets/equipo/benja.jpg";
import benjaAv from "../../../assets/equipo/benja-av.jpg";
import gabi from "../../../assets/equipo/gabi.jpg";
import gabiAv from "../../../assets/equipo/gabi-av.jpg";
import victoria from "../../../assets/equipo/victoria.jpg";
import victoriaAv from "../../../assets/equipo/victoria-av.jpg";
import dakari from "../../../assets/equipo/dakari.jpg";
import dakariAv from "../../../assets/equipo/dakari-av.jpg";
import fernanda from "../../../assets/equipo/fernanda.jpg";
import fernandaAv from "../../../assets/equipo/fernanda-av.jpg";
import gabriela from "../../../assets/equipo/gabriela.jpg";
import gabrielaAv from "../../../assets/equipo/gabriela-av.jpg";

export type Persona = {
  readonly id: string;
  readonly nombre: string;
  readonly rol: string;
  readonly foto: string;
  readonly avatar: string;
};

export const EQUIPO: readonly Persona[] = [
  { id: "victoria", nombre: "Victoria", rol: "Panel estudiantil", foto: victoria, avatar: victoriaAv },
  { id: "dakari", nombre: "Dakari", rol: "Panel estudiantil", foto: dakari, avatar: dakariAv },
  { id: "fernanda", nombre: "Fernanda", rol: "Panel estudiantil", foto: fernanda, avatar: fernandaAv },
  { id: "gabriela", nombre: "Gabriela", rol: "Panel estudiantil", foto: gabriela, avatar: gabrielaAv },
  { id: "benja", nombre: "Tío Benja", rol: "Conducción", foto: benja, avatar: benjaAv },
  { id: "gabi", nombre: "Tía Gabi", rol: "Locutora", foto: gabi, avatar: gabiAv },
];

export const persona = (id: string) => EQUIPO.find((p) => p.id === id)!;
