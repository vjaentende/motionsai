# MotionsAI

Proyecto de **motion videos** con [Remotion](https://www.remotion.dev/) — crea videos animados con React y TypeScript.

## Composiciones incluidas

| ID | Formato | Descripción |
|---|---|---|
| `IntroTitle` | 1920×1080 | Intro con título animado y gradientes |
| `TextReveal` | 1920×1080 | Tipografía cinética palabra por palabra |
| `SocialPromo` | 1080×1080 | Promo cuadrada para redes sociales |

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
