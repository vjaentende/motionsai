# MotionsAI

Proyecto de **motion videos** con [Remotion](https://www.remotion.dev/) — crea videos animados con React y TypeScript.

## Composiciones incluidas

| ID | Formato | Descripción |
|---|---|---|
| `RutasAereas` | 1920×1080 | Video narrado (~102s) estilo corporativo: las rutas aéreas más transitadas del mundo, con voz en español y globo terráqueo 3D |
| `IntroTitle` | 1920×1080 | Intro con título animado y gradientes |
| `TextReveal` | 1920×1080 | Tipografía cinética palabra por palabra |
| `SocialPromo` | 1080×1080 | Promo cuadrada para redes sociales |

### RutasAereas

Video 16:9 con estética corporativa (apto para presentaciones e inversores):

- **Video final listo para usar**: [`renders/rutas-aereas.mp4`](renders/rutas-aereas.mp4)
- **Narración en español** con tono profesional, generada con TTS neuronal (`edge-tts`, voz es-ES-Álvaro), archivos en `public/audio/`
- **9 escenas** con datos reales de OAG 2025: Jeju–Seúl (#1 mundial), Japón, Hanói–Ho Chi Minh, Hong Kong–Taipéi (#1 internacional), El Cairo–Yeda, Kuala Lumpur–Singapur y JFK–Londres
- **Globo terráqueo 3D** (proyección ortográfica con `d3-geo` + datos reales de continentes) con la cámara siguiendo al avión mientras vuela de aeropuerto a aeropuerto por el gran círculo
- **Diseño sobrio**: fondo azul marino, acento dorado, tarjetas con bordes finos, transiciones de fundido y música ambiental sutil

```bash
npx remotion render RutasAereas out/rutas-aereas.mp4
# Recomendado: normalizar loudness para redes sociales (-14 LUFS).
# Importante: fijar -ar 48000, porque loudnorm sube la frecuencia de muestreo
# y el AAC a 96/192 kHz no se reproduce en muchos navegadores (se oye silencio).
ffmpeg -i out/rutas-aereas.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -ar 48000 -b:a 192k out/rutas-aereas-final.mp4
```

Para regenerar la narración (requiere `pip install edge-tts`), edita los textos y vuelve a medir duraciones en `src/data/aerial.ts`.

## Comandos

```bash
# Instalar dependencias
npm install

# Abrir Remotion Studio (preview en vivo)
npm run dev

# Renderizar un video
npx remotion render IntroTitle out/intro.mp4
npx remotion render TextReveal out/text-reveal.mp4
npx remotion render SocialPromo out/social-promo.mp4

# Lint y typecheck
npm run lint
```

## Estructura

```
src/
├── Root.tsx                 # Registro de composiciones
├── components/
│   ├── IntroTitle.tsx
│   ├── TextReveal.tsx
│   └── SocialPromo.tsx
└── index.ts
```

## Próximos pasos

- Duplica una composición en `src/components/` y regístrala en `Root.tsx`
- Ajusta `durationInFrames`, `fps`, `width` y `height` según tu formato
- Usa `spring()` e `interpolate()` de Remotion para animaciones fluidas
