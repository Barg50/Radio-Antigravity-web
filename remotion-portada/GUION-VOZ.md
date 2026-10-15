# Guion de voz — Reel Radio Nazareo (15 s)

Video: composiciones `Showreel` (16:9) y `ShowreelVertical` (9:16) en `src/showreel/`.
Ritmo del video: 120 bpm → **un golpe cada 0,5 s**. Los cortes caen en los segundos marcados abajo;
si la voz entra justo en esos tiempos, todo se siente sincronizado.

**Total de texto:** ~35 palabras. Se lee con energía, sonriendo, sin apuro pero sin pausas largas.

---

## Guion con tiempos

| Tiempo | Lo que se ve | Voz | Cómo decirlo |
|---|---|---|---|
| **0,0 – 1,5 s** | Un punto dorado se enciende y se vuelve onda de audio. "Colegio Nazareo presenta". | *(silencio o sonido de radio sintonizando)* … **«¿Nos escuchan?»** (en 1,0 s) | Cerca del micrófono, casi en secreto, como probando el micro. |
| **1,5 – 3,5 s** | La onda se transforma en el cerro; aparecen las palabras. | **«Desde la punta del cerro…»** | Firme, abriendo la voz. Que "cerro" caiga cerca de 2,3 s, cuando aparece la palabra. |
| **3,5 – 5,5 s** | Explosión dorada: "Y MÁS ALLÁ" en 3D. | **«…¡y más allá!»** | El momento más alto. Sonrisa grande. Entra justo en 3,5 s. |
| **5,5 – 8,0 s** | Líquido + palabras al golpe. | **«Voces. Música. Historias. Amistad. Y fe.»** | Una palabra por golpe (cada 0,4 s): 6,0 · 6,4 · 6,8 · 7,2 · 7,6 s. Seco y rítmico. |
| **8,0 – 10,0 s** | Túnel con los 6 episodios pasando. | **«Seis episodios te están esperando.»** | Con intriga, más rápido. |
| **10,0 – 12,0 s** | Aparece el logo + "Miércoles · 13:00 hrs". | **«Radio Nazareo. Todos los miércoles, a la una.»** | Orgullo. "Radio Nazareo" bien marcado, justo en 10,0 s. |
| **12,0 – 15,0 s** | Logo de Spotify + radionazareo.vercel.app. | **«Escúchanos en Spotify… y entra a radionazareo punto vercel punto app.»** | Invitación directa, como a un amigo. Terminar antes de 14,7 s. |

---

## Texto corrido (para leer de corrido)

> ¿Nos escuchan?
> Desde la punta del cerro… ¡y más allá!
> Voces. Música. Historias. Amistad. Y fe.
> Seis episodios te están esperando.
> Radio Nazareo. Todos los miércoles, a la una.
> Escúchanos en Spotify… y entra a radionazareo punto vercel punto app.

### Versión corta (si no alcanza el tiempo)

> Desde la punta del cerro… ¡y más allá!
> Voces, música, historias, amistad y fe.
> Radio Nazareo: escúchanos en Spotify.

### Idea a varias voces (con el equipo)

- **Estudiante 1:** «¿Nos escuchan?»
- **Tío Benja / Tía Gabi:** «Desde la punta del cerro…»
- **Todos juntos:** «¡…y más allá!»
- **Las 5 voces, una palabra cada una:** «Voces.» «Música.» «Historias.» «Amistad.» «Y fe.»
- **Estudiante 2:** «Seis episodios te están esperando.»
- **Profesor/a:** «Radio Nazareo. Todos los miércoles, a la una.»
- **Todos:** «¡Escúchanos en Spotify!»

---

## Consejos para grabar

1. Graben en una sala pequeña con cortinas o ropa alrededor (menos eco). Un clóset abierto funciona muy bien.
2. Celular a un palmo de la boca, un poco de lado para que no "explote" la P de *punta*.
3. Graben 3 tomas completas y elijan la mejor. Dejen 1 segundo de silencio al inicio.
4. Prueben leer con el video corriendo en silencio, para calzar los tiempos.

## Cómo poner la voz en el video

1. Guarden el audio como `public/voz.mp3` (o `.wav`) dentro de `remotion-portada/`.
2. (Opcional) Música de fondo libre de derechos en `public/musica.mp3`; queda al 35 % de volumen.
3. Rendericen pasando las rutas como props:

```console
npx remotion render Showreel out/reel-16x9.mp4 --props='{"voz":"voz.mp3","musica":"musica.mp3"}'
npx remotion render ShowreelVertical out/reel-9x16.mp4 --props='{"voz":"voz.mp3","musica":null}'
```

Si la voz queda un poco corrida, recórtenla al inicio (no hace falta mover la animación).
