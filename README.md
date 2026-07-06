# MotionsAI

Proyecto de **motion videos** con [Remotion](https://www.remotion.dev/) — crea videos animados con React y TypeScript.

## Composiciones incluidas

| ID | Formato | Descripción |
|---|---|---|
| `RutasAereas` | 1080×1920 | Video narrado (~99s): las rutas aéreas más usadas del mundo, con voz en español, música y transiciones rápidas |
| `IntroTitle` | 1920×1080 | Intro con título animado y gradientes |
| `TextReveal` | 1920×1080 | Tipografía cinética palabra por palabra |
| `SocialPromo` | 1080×1080 | Promo cuadrada para redes sociales |

### RutasAereas

Video vertical estilo redes sociales (2026: ritmo rápido, mucha dopamina) con:

- **Narración en español** generada con TTS neuronal (`edge-tts`, voz es-ES-Álvaro), archivos en `public/audio/`
- **9 escenas** con datos reales de OAG 2025: Jeju–Seúl (#1 mundial), Japón, Hanói–Ho Chi Minh, Hong Kong–Taipéi (#1 internacional), El Cairo–Yeda, Kuala Lumpur–Singapur y JFK–Londres
- **Globo terráqueo 3D** (proyección ortográfica con `d3-geo` + datos reales de continentes) con la cámara siguiendo al avión mientras vuela de aeropuerto a aeropuerto por el gran círculo
- **Animaciones**: zoom de impacto con micro-shake, contadores con overshoot, partículas y transiciones slide/fade con whoosh
- **Música de fondo** sintetizada y efectos de transición

```bash
npx remotion render RutasAereas out/rutas-aereas.mp4
# Recomendado: normalizar loudness para redes sociales (-14 LUFS)
ffmpeg -i out/rutas-aereas.mp4 -c:v copy -af "loudnorm=I=-14:TP=-1.5:LRA=11" -c:a aac -b:a 256k out/rutas-aereas-final.mp4
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
