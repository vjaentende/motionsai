import React from 'react';
import {
  AbsoluteFill,
  Audio,
  Easing,
  interpolate,
  random,
  Sequence,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

type SolLaunchProps = {
  modelName: string;
  tagline: string;
};

const C = {
  ink: '#050608',
  white: '#F4F7F8',
  muted: '#849097',
  gold: '#FFBD4A',
  orange: '#FF6B2C',
  cyan: '#4DE8D0',
  blue: '#528DFF',
};

const FONT = 'Inter, Helvetica Neue, Arial, sans-serif';

const ease = Easing.bezier(0.16, 1, 0.3, 1);

const fade = (frame: number, duration: number, edge = 18) =>
  interpolate(frame, [0, edge, duration - edge, duration], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });

const reveal = (frame: number, delay = 0, distance = 70) => {
  const value = interpolate(frame, [delay, delay + 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return {
    opacity: value,
    transform: `translateY(${(1 - value) * distance}px)`,
  };
};

const CornerLabel: React.FC<{chapter: string; index: string}> = ({
  chapter,
  index,
}) => (
  <div
    style={{
      position: 'absolute',
      top: 58,
      left: 72,
      right: 72,
      display: 'flex',
      justifyContent: 'space-between',
      color: 'rgba(244,247,248,.58)',
      fontFamily: FONT,
      fontSize: 18,
      fontWeight: 650,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}
  >
    <span>{chapter}</span>
    <span>{index} / 05</span>
  </div>
);

const Grid: React.FC<{opacity?: number}> = ({opacity = 0.12}) => (
  <AbsoluteFill
    style={{
      opacity,
      backgroundImage:
        'linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px)',
      backgroundSize: '96px 96px',
      maskImage:
        'radial-gradient(ellipse at center, black 0%, rgba(0,0,0,.7) 38%, transparent 78%)',
    }}
  />
);

const SolarOrb: React.FC<{
  size?: number;
  x?: number;
  y?: number;
  intensity?: number;
}> = ({size = 660, x = 960, y = 540, intensity = 1}) => {
  const frame = useCurrentFrame();
  const pulse = 1 + Math.sin(frame / 15) * 0.012;
  const rotation = frame * 0.18;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: size,
        height: size,
        transform: `translate(-50%, -50%) scale(${pulse})`,
      }}
    >
      <div
        style={{
          position: 'absolute',
          inset: -90,
          borderRadius: '50%',
          background: `radial-gradient(circle, rgba(255,135,40,${
            0.21 * intensity
          }) 0%, rgba(255,96,32,${0.08 * intensity}) 38%, transparent 68%)`,
          filter: 'blur(25px)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          inset: 0,
          borderRadius: '50%',
          background:
            'radial-gradient(circle at 34% 29%, #FFF6D6 0%, #FFD06B 17%, #FF8A35 48%, #CC361D 72%, #260B08 100%)',
          boxShadow:
            'inset -50px -45px 100px rgba(45,4,2,.68), inset 28px 22px 80px rgba(255,246,190,.38), 0 0 80px rgba(255,119,37,.36)',
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: '-12%',
            transform: `rotate(${rotation}deg) scale(1.1)`,
            background:
              'repeating-radial-gradient(ellipse at 28% 34%, transparent 0 26px, rgba(255,255,210,.13) 29px 33px, transparent 38px 65px)',
            mixBlendMode: 'screen',
          }}
        />
        {Array.from({length: 18}).map((_, i) => {
          const s = 4 + random(`spark-s-${i}`) * 12;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: `${12 + random(`spark-x-${i}`) * 76}%`,
                top: `${10 + random(`spark-y-${i}`) * 80}%`,
                width: s * 2.4,
                height: s,
                borderRadius: '50%',
                background: 'rgba(255,246,202,.34)',
                filter: 'blur(3px)',
                transform: `rotate(${random(`spark-r-${i}`) * 180}deg)`,
              }}
            />
          );
        })}
      </div>
      <div
        style={{
          position: 'absolute',
          inset: -26,
          border: '1px solid rgba(255,192,99,.35)',
          borderRadius: '50%',
        }}
      />
    </div>
  );
};

const Intro: React.FC<{modelName: string}> = ({modelName}) => {
  const frame = useCurrentFrame();
  const opacity = fade(frame, 150, 22);
  const orbScale = spring({
    frame,
    fps: 30,
    config: {damping: 16, stiffness: 42, mass: 1.4},
  });
  const tracking = interpolate(frame, [8, 95], [0.72, 0.18], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <AbsoluteFill style={{opacity, background: C.ink}}>
      <Grid opacity={0.08} />
      <div style={{transform: `scale(${0.4 + orbScale * 0.6})`}}>
        <SolarOrb size={410} />
      </div>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: C.white,
          fontFamily: FONT,
          fontSize: 33,
          fontWeight: 700,
          letterSpacing: `${tracking}em`,
          textIndent: `${tracking}em`,
          opacity: interpolate(frame, [42, 76], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
          textShadow: '0 2px 30px rgba(0,0,0,.95)',
        }}
      >
        {modelName}
      </div>
      <div
        style={{
          position: 'absolute',
          bottom: 65,
          left: 0,
          right: 0,
          textAlign: 'center',
          fontFamily: FONT,
          color: 'rgba(244,247,248,.4)',
          fontSize: 16,
          letterSpacing: '.32em',
          textTransform: 'uppercase',
          opacity: interpolate(frame, [80, 110], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }),
        }}
      >
        Una nueva forma de inteligencia
      </div>
    </AbsoluteFill>
  );
};

const TitleScene: React.FC<{tagline: string}> = ({tagline}) => {
  const frame = useCurrentFrame();
  const lineWidth = interpolate(frame, [34, 85], [0, 610], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <AbsoluteFill style={{background: C.ink, opacity: fade(frame, 180)}}>
      <Grid />
      <div
        style={{
          position: 'absolute',
          width: 760,
          height: 760,
          right: -90,
          top: 160,
          borderRadius: '50%',
          background:
            'radial-gradient(circle, rgba(77,232,208,.14), rgba(82,141,255,.05) 40%, transparent 68%)',
          filter: 'blur(10px)',
        }}
      />
      <CornerLabel chapter="Horizonte" index="01" />
      <div
        style={{
          position: 'absolute',
          left: 152,
          top: 245,
          width: 1400,
          color: C.white,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            ...reveal(frame, 4),
            fontSize: 22,
            color: C.gold,
            letterSpacing: '.28em',
            fontWeight: 750,
            textTransform: 'uppercase',
            marginBottom: 34,
          }}
        >
          Presentamos GPT-5.6 SOL
        </div>
        <div
          style={{
            ...reveal(frame, 15, 110),
            fontSize: 128,
            lineHeight: 0.94,
            fontWeight: 760,
            letterSpacing: '-.072em',
            maxWidth: 1180,
          }}
        >
          {tagline.split(' ').slice(0, 4).join(' ')}
          <span style={{color: C.gold}}>.</span>
        </div>
        <div
          style={{
            width: lineWidth,
            height: 2,
            marginTop: 55,
            background: `linear-gradient(90deg, ${C.gold}, ${C.orange}, transparent)`,
          }}
        />
        <div
          style={{
            ...reveal(frame, 58),
            marginTop: 28,
            fontSize: 29,
            lineHeight: 1.5,
            color: C.muted,
            maxWidth: 730,
          }}
        >
          De una pregunta a una respuesta.
          <br />
          De una idea a algo real.
        </div>
      </div>
    </AbsoluteFill>
  );
};

const ThoughtNode: React.FC<{
  x: number;
  y: number;
  label: string;
  color: string;
  delay: number;
}> = ({x, y, label, color, delay}) => {
  const frame = useCurrentFrame();
  const scale = spring({
    frame: frame - delay,
    fps: 30,
    config: {damping: 14, stiffness: 90},
  });
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: 220,
        height: 74,
        transform: `translate(-50%, -50%) scale(${scale})`,
        borderRadius: 40,
        border: `1px solid ${color}66`,
        background: `${color}12`,
        boxShadow: `0 0 42px ${color}18`,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        color: C.white,
        fontFamily: FONT,
        fontSize: 20,
        fontWeight: 630,
        letterSpacing: '.04em',
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          background: color,
          borderRadius: '50%',
          marginRight: 13,
          boxShadow: `0 0 12px ${color}`,
        }}
      />
      {label}
    </div>
  );
};

const ReasoningScene: React.FC = () => {
  const frame = useCurrentFrame();
  const path = interpolate(frame, [22, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  return (
    <AbsoluteFill style={{background: C.ink, opacity: fade(frame, 210)}}>
      <Grid opacity={0.16} />
      <CornerLabel chapter="Razonamiento" index="02" />
      <div
        style={{
          position: 'absolute',
          left: 145,
          top: 192,
          width: 620,
          fontFamily: FONT,
        }}
      >
        <div
          style={{
            ...reveal(frame, 0),
            fontSize: 84,
            fontWeight: 740,
            lineHeight: 1,
            letterSpacing: '-.055em',
            color: C.white,
          }}
        >
          Ve conexiones.
          <br />
          <span style={{color: C.cyan}}>Encuentra claridad.</span>
        </div>
        <p
          style={{
            ...reveal(frame, 28),
            fontSize: 27,
            lineHeight: 1.52,
            color: C.muted,
            maxWidth: 545,
            marginTop: 45,
          }}
        >
          Convierte problemas complejos en caminos comprensibles, conectando
          contexto, intención y ejecución.
        </p>
      </div>
      <svg
        width="920"
        height="690"
        viewBox="0 0 920 690"
        style={{position: 'absolute', right: 60, top: 190, overflow: 'visible'}}
      >
        <defs>
          <linearGradient id="pathGradient">
            <stop offset="0%" stopColor={C.blue} />
            <stop offset="50%" stopColor={C.cyan} />
            <stop offset="100%" stopColor={C.gold} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          d="M105 340 C210 100 365 105 460 340 S715 575 830 330"
          fill="none"
          stroke="url(#pathGradient)"
          strokeWidth="3"
          strokeLinecap="round"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - path}
          filter="url(#glow)"
        />
        <path
          d="M105 340 C245 510 330 520 460 340 S700 120 830 330"
          fill="none"
          stroke="rgba(255,255,255,.16)"
          strokeWidth="2"
          pathLength="1"
          strokeDasharray="1"
          strokeDashoffset={1 - path}
        />
      </svg>
      <div style={{position: 'absolute', right: 60, top: 190, width: 920, height: 690}}>
        <ThoughtNode x={105} y={340} label="Pregunta" color={C.blue} delay={14} />
        <ThoughtNode x={460} y={340} label="Comprensión" color={C.cyan} delay={50} />
        <ThoughtNode x={830} y={330} label="Solución" color={C.gold} delay={92} />
      </div>
    </AbsoluteFill>
  );
};

const CodeScene: React.FC = () => {
  const frame = useCurrentFrame();
  const code = [
    ['const', ' idea', ' = ', '"un producto extraordinario"', ';'],
    ['const', ' plan', ' = ', 'sol.reason', '(idea);'],
    ['const', ' product', ' = ', 'await sol.build', '(plan);'],
    ['', '', '', '', ''],
    ['return', ' product', '.', 'launch', '();'],
  ];
  const totalChars = code.reduce((sum, row) => sum + row.join('').length, 0);
  const visible = Math.floor(
    interpolate(frame, [28, 130], [0, totalChars], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
      easing: Easing.linear,
    }),
  );
  let cursor = 0;
  return (
    <AbsoluteFill
      style={{
        background:
          'radial-gradient(circle at 18% 80%, rgba(82,141,255,.12), transparent 38%), #050608',
        opacity: fade(frame, 180),
      }}
    >
      <CornerLabel chapter="Creación" index="03" />
      <div
        style={{
          position: 'absolute',
          left: 145,
          top: 270,
          width: 550,
          fontFamily: FONT,
          color: C.white,
        }}
      >
        <div
          style={{
            ...reveal(frame, 0),
            fontSize: 91,
            lineHeight: 0.98,
            fontWeight: 740,
            letterSpacing: '-.06em',
          }}
        >
          Imagina.
          <br />
          Construye.
          <br />
          <span style={{color: C.blue}}>Itera.</span>
        </div>
        <div
          style={{
            ...reveal(frame, 35),
            marginTop: 43,
            fontSize: 24,
            lineHeight: 1.5,
            color: C.muted,
          }}
        >
          Un colaborador para pasar
          <br />
          del concepto al código.
        </div>
      </div>
      <div
        style={{
          position: 'absolute',
          right: 120,
          top: 205,
          width: 950,
          height: 660,
          border: '1px solid rgba(255,255,255,.12)',
          borderRadius: 28,
          background: 'rgba(12,15,20,.88)',
          boxShadow: '0 45px 120px rgba(0,0,0,.5)',
          overflow: 'hidden',
          transform: `perspective(1500px) rotateY(-${interpolate(
            frame,
            [0, 45],
            [8, 1.5],
            {extrapolateRight: 'clamp'},
          )}deg)`,
        }}
      >
        <div
          style={{
            height: 74,
            borderBottom: '1px solid rgba(255,255,255,.1)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 28px',
          }}
        >
          {[C.orange, C.gold, C.cyan].map((color) => (
            <span
              key={color}
              style={{
                width: 13,
                height: 13,
                borderRadius: '50%',
                background: color,
                marginRight: 12,
                opacity: 0.8,
              }}
            />
          ))}
          <span
            style={{
              marginLeft: 25,
              color: C.muted,
              font: `500 16px ${FONT}`,
              letterSpacing: '.06em',
            }}
          >
            sol / launch.ts
          </span>
        </div>
        <div
          style={{
            padding: '66px 62px',
            fontFamily: 'SFMono-Regular, Consolas, monospace',
            fontSize: 25,
            lineHeight: 2.05,
          }}
        >
          {code.map((segments, line) => (
            <div key={line}>
              <span
                style={{
                  display: 'inline-block',
                  width: 44,
                  color: 'rgba(255,255,255,.2)',
                  userSelect: 'none',
                }}
              >
                {line + 1}
              </span>
              {segments.map((segment, i) => {
                const start = cursor;
                cursor += segment.length;
                const shown = segment.slice(0, Math.max(0, visible - start));
                const colors = [C.orange, C.white, C.muted, C.cyan, C.muted];
                return (
                  <span key={i} style={{color: colors[i]}}>
                    {shown}
                  </span>
                );
              })}
            </div>
          ))}
          <span
            style={{
              display: visible >= totalChars ? 'inline-block' : 'none',
              width: 11,
              height: 28,
              marginLeft: 52,
              background: C.cyan,
              opacity: frame % 20 < 12 ? 1 : 0,
              verticalAlign: 'middle',
            }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};

const Capability: React.FC<{
  number: string;
  title: string;
  text: string;
  color: string;
  delay: number;
}> = ({number, title, text, color, delay}) => {
  const frame = useCurrentFrame();
  return (
    <div
      style={{
        ...reveal(frame, delay, 55),
        flex: 1,
        height: 420,
        padding: '42px 38px',
        borderTop: `2px solid ${color}`,
        borderRight: '1px solid rgba(255,255,255,.1)',
        background: `linear-gradient(180deg, ${color}12, transparent 55%)`,
        fontFamily: FONT,
      }}
    >
      <div
        style={{
          color,
          fontSize: 16,
          fontWeight: 750,
          letterSpacing: '.15em',
        }}
      >
        {number}
      </div>
      <div
        style={{
          color: C.white,
          fontSize: 42,
          fontWeight: 680,
          letterSpacing: '-.035em',
          marginTop: 95,
        }}
      >
        {title}
      </div>
      <div
        style={{
          color: C.muted,
          fontSize: 21,
          lineHeight: 1.5,
          marginTop: 22,
          maxWidth: 310,
        }}
      >
        {text}
      </div>
    </div>
  );
};

const CapabilitiesScene: React.FC = () => {
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{background: C.ink, opacity: fade(frame, 180)}}>
      <Grid opacity={0.11} />
      <CornerLabel chapter="Capacidades" index="04" />
      <div
        style={{
          ...reveal(frame, 0),
          position: 'absolute',
          top: 150,
          left: 145,
          color: C.white,
          font: `730 71px/1 ${FONT}`,
          letterSpacing: '-.052em',
        }}
      >
        Una inteligencia.{' '}
        <span style={{color: C.muted}}>Múltiples dimensiones.</span>
      </div>
      <div
        style={{
          position: 'absolute',
          left: 145,
          right: 145,
          bottom: 120,
          display: 'flex',
          borderLeft: '1px solid rgba(255,255,255,.1)',
        }}
      >
        <Capability
          number="01"
          title="Razona"
          text="Estructura lo complejo y muestra un camino claro."
          color={C.cyan}
          delay={20}
        />
        <Capability
          number="02"
          title="Crea"
          text="Transforma lenguaje, ideas y código en resultados."
          color={C.blue}
          delay={34}
        />
        <Capability
          number="03"
          title="Comprende"
          text="Une contexto e intención para colaborar contigo."
          color={C.gold}
          delay={48}
        />
        <Capability
          number="04"
          title="Actúa"
          text="Avanza desde la respuesta hacia la ejecución."
          color={C.orange}
          delay={62}
        />
      </div>
    </AbsoluteFill>
  );
};

const Finale: React.FC<{modelName: string}> = ({modelName}) => {
  const frame = useCurrentFrame();
  const orbIn = spring({
    frame,
    fps: 30,
    config: {damping: 18, stiffness: 38, mass: 1.6},
  });
  const title = interpolate(frame, [45, 78], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: ease,
  });
  const endFade = interpolate(frame, [185, 210], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <AbsoluteFill style={{background: C.ink, opacity: endFade}}>
      <Grid opacity={0.07} />
      <div
        style={{
          transform: `translateY(${(1 - orbIn) * 180}px) scale(${
            0.7 + orbIn * 0.3
          })`,
          opacity: orbIn,
        }}
      >
        <SolarOrb size={650} x={960} y={470} intensity={1.2} />
      </div>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 126,
          textAlign: 'center',
          fontFamily: FONT,
          color: C.white,
          opacity: title,
          transform: `translateY(${(1 - title) * 45}px)`,
        }}
      >
        <div
          style={{
            fontSize: 76,
            fontWeight: 760,
            letterSpacing: '-.05em',
            textShadow: '0 8px 35px rgba(0,0,0,.9)',
          }}
        >
          {modelName}
        </div>
        <div
          style={{
            marginTop: 22,
            color: C.gold,
            fontSize: 20,
            fontWeight: 720,
            letterSpacing: '.32em',
            textTransform: 'uppercase',
          }}
        >
          Tu próxima gran idea empieza aquí
        </div>
      </div>
    </AbsoluteFill>
  );
};

export const SolLaunch: React.FC<SolLaunchProps> = ({
  modelName,
  tagline,
}) => {
  return (
    <AbsoluteFill style={{background: C.ink}}>
      <Audio src={staticFile('score.wav')} volume={0.82} />
      <Sequence from={0} durationInFrames={150}>
        <Intro modelName={modelName} />
      </Sequence>
      <Sequence from={135} durationInFrames={180}>
        <TitleScene tagline={tagline} />
      </Sequence>
      <Sequence from={300} durationInFrames={210}>
        <ReasoningScene />
      </Sequence>
      <Sequence from={495} durationInFrames={180}>
        <CodeScene />
      </Sequence>
      <Sequence from={660} durationInFrames={180}>
        <CapabilitiesScene />
      </Sequence>
      <Sequence from={825} durationInFrames={285}>
        <Finale modelName={modelName} />
      </Sequence>
      <div
        style={{
          position: 'absolute',
          left: 72,
          bottom: 55,
          color: 'rgba(255,255,255,.28)',
          font: `650 14px ${FONT}`,
          letterSpacing: '.2em',
          textTransform: 'uppercase',
        }}
      >
        OpenAI · Concept film
      </div>
    </AbsoluteFill>
  );
};
