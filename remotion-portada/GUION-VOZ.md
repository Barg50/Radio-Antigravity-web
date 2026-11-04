# Guion de voz — Reel Radio Nazareo (18 s)

**Voces:** Dakari · Victoria · Fernanda
Cada uno tiene **4 frases propias** y hay **2 frases que dicen los tres juntos**.

En el video aparece una etiqueta **"● EN EL AIRE"** con la foto y el nombre de quien habla.
Si cada uno dice su frase en el segundo que marca la tabla, la voz calza con su foto.

---

## Pauta con tiempos

| # | Segundo | Quién | Frase | Cómo decirla |
|---|---|---|---|---|
| 1 | 0,3 – 1,4 | **Dakari** | «¿Nos escuchan?» | Cerca del micrófono, como probando el micro. |
| 2 | 1,7 – 3,3 | **Victoria** | «Desde la punta del cerro…» | Firme, abriendo la voz. |
| 3 | 3,5 – 5,1 | **Los tres** | «…¡y más allá!» | Juntos y con mucha energía. Es el momento más alto. |
| 4 | 6,0 | **Dakari** | «Voces.» | Una sola palabra, seca, al golpe. |
| 5 | 6,4 | **Fernanda** | «Música.» | Igual: corta y al golpe. |
| 6 | 6,8 | **Victoria** | «Historias.» | Corta y al golpe. |
| 7 | 7,2 | **Dakari** | «Amistad.» | Corta y al golpe. |
| 8 | 7,6 | **Fernanda** | «¡Y fe!» | Un poco más larga y con sonrisa. |
| 9 | 8,3 – 9,9 | **Victoria** | «Siete episodios te están esperando.» | Con intriga, un poco más rápido. |
| 10 | 10,2 – 11,6 | **Fernanda** | «Somos las voces de Radio Nazareo…» | Con orgullo. Aquí aparecen las fotos del equipo. |
| 11 | 11,7 – 12,9 | **Victoria** | «¡Y este es nuestro equipo!» | Contenta, presentando. |
| 12 | 13,3 – 14,9 | **Fernanda** | «En vivo todos los miércoles, a la una.» | Clara, que se entienda el horario. |
| 13 | 15,1 – 16,3 | **Los tres** | «¡Escúchanos en Spotify!» | Juntos, como invitación. |
| 14 | 16,4 – 17,8 | **Dakari** | «Y entra a radionazareo punto vercel punto app.» | Sin apuro, que se entienda la dirección. Terminar antes del segundo 18. |

---

## Libreto por niño (para que cada uno practique lo suyo)

### Dakari
1. «¿Nos escuchan?»
2. «Voces.»
3. «Amistad.»
4. «Y entra a radionazareo punto vercel punto app.»

### Victoria
1. «Desde la punta del cerro…»
2. «Historias.»
3. «Siete episodios te están esperando.»
4. «¡Y este es nuestro equipo!»

### Fernanda
1. «Música.»
2. «¡Y fe!»
3. «Somos las voces de Radio Nazareo…»
4. «En vivo todos los miércoles, a la una.»

### Los tres juntos
- «…¡y más allá!»
- «¡Escúchanos en Spotify!»

---

## Texto corrido (en orden)

> **Dakari:** ¿Nos escuchan?
> **Victoria:** Desde la punta del cerro…
> **Los tres:** …¡y más allá!
> **Dakari:** Voces. **Fernanda:** Música. **Victoria:** Historias. **Dakari:** Amistad. **Fernanda:** ¡Y fe!
> **Victoria:** Siete episodios te están esperando.
> **Fernanda:** Somos las voces de Radio Nazareo…
> **Victoria:** ¡Y este es nuestro equipo!
> **Fernanda:** En vivo todos los miércoles, a la una.
> **Los tres:** ¡Escúchanos en Spotify!
> **Dakari:** Y entra a radionazareo punto vercel punto app.

---

## Consejos para grabar

1. Graben **los tres juntos en la misma sala**, en una sola toma, pasándose el micrófono (o el celular) en orden. Así suena natural y es más fácil de calzar.
2. Si no se puede, cada uno graba sus frases por separado con 1 segundo de silencio entre frase y frase, y después se arman.
3. Sala chica, con cortinas o ropa alrededor para que no haya eco. Celular a un palmo de la boca, un poco de lado.
4. Practiquen mirando el video en silencio: cuando aparece su foto con "EN EL AIRE", es su turno.
5. Graben 3 tomas y elijan la mejor.

## Cómo poner la voz y la música en el video

Guarden el audio en `remotion-portada/public/` (por ejemplo `voz.mp3` y `musica.mp3`) y rendericen:

```console
npx remotion render ShowreelVertical out/reel-9x16.mp4 --props='{"voz":"voz.mp3","musica":"musica.mp3"}'
```

La música queda al 35 % para que las voces se escuchen claras. Si prefieren, me mandan los audios y yo los pongo.
