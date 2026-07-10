import {
  ArrowDown,
  ArrowUpRight,
  Asterisk,
  Check,
  ChevronLeft,
  ChevronRight,
  Circle,
  Menu,
  MousePointer2,
  Move3d,
  Pause,
  Play,
  Rotate3d,
  Send,
  Sparkles,
  X,
} from 'lucide-react';
import {FormEvent, useEffect, useRef, useState} from 'react';
import {SculptureId, StudioScene} from './StudioScene';

const palettes = [
  {name: 'Acid pop', colors: ['#e6ff3f', '#ff4f9a', '#5b4dff']},
  {name: 'Hot signal', colors: ['#ff6534', '#ffc533', '#6e32ff']},
  {name: 'Digital ice', colors: ['#64e9ff', '#2865ff', '#f4f2ea']},
  {name: 'Night bloom', colors: ['#dc63ff', '#23d4a9', '#ff784a']},
];

const sculptures: Record<SculptureId, {number: string; name: string; detail: string}> = {
  flux: {
    number: '01',
    name: 'FLUX',
    detail: 'A living identity system that never repeats itself.',
  },
  loop: {
    number: '02',
    name: 'LOOP',
    detail: 'Endless visual rhythm built for motion-first brands.',
  },
  core: {
    number: '03',
    name: 'CORE',
    detail: 'Sharp strategy transformed into an unmistakable form.',
  },
};

type Project = {
  id: number;
  client: string;
  title: string;
  year: string;
  tags: string[];
  className: string;
  description: string;
};

const projects: Project[] = [
  {
    id: 1,
    client: 'NOMA LABS',
    title: 'A softer kind of future',
    year: '2026',
    tags: ['Strategy', 'Identity', 'Motion'],
    className: 'project-orbit',
    description:
      'A generative identity for a materials lab turning waste into objects people want to keep.',
  },
  {
    id: 2,
    client: 'SUN/SUN',
    title: 'Energy with a pulse',
    year: '2026',
    tags: ['Campaign', '3D', 'Digital'],
    className: 'project-sun',
    description:
      'A high-voltage launch system where typography, light and sound respond as one organism.',
  },
  {
    id: 3,
    client: 'COMMON GROUND',
    title: 'Culture you can touch',
    year: '2025',
    tags: ['Brand', 'Editorial', 'Space'],
    className: 'project-type',
    description:
      'Identity and environmental graphics for a new network of independent cultural spaces.',
  },
  {
    id: 4,
    client: 'KINDRED AI',
    title: 'Technology, humanized',
    year: '2025',
    tags: ['Positioning', 'Product', 'Web'],
    className: 'project-liquid',
    description:
      'A warm, expressive digital brand for an AI company built around human collaboration.',
  },
];

function Header({onContact}: {onContact: () => void}) {
  const [open, setOpen] = useState(false);
  const go = (id: string) => {
    document.getElementById(id)?.scrollIntoView({behavior: 'smooth'});
    setOpen(false);
  };
  return (
    <header className="site-header">
      <button className="wordmark" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
        FORM<span>/</span>FUNCTION<sup>®</sup>
      </button>
      <nav className={open ? 'open' : ''}>
        <button onClick={() => go('work')}>Work</button>
        <button onClick={() => go('studio')}>Studio</button>
        <button onClick={() => go('playground')}>Playground</button>
        <button className="contact-link" onClick={onContact}>
          Start a project <ArrowUpRight size={15} />
        </button>
      </nav>
      <button className="menu-button" onClick={() => setOpen(!open)} aria-label="Toggle menu">
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
    </header>
  );
}

function Hero({
  palette,
  energy,
  paused,
  active,
  setActive,
  paletteIndex,
  setPaletteIndex,
  setEnergy,
  setPaused,
}: {
  palette: string[];
  energy: number;
  paused: boolean;
  active: SculptureId;
  setActive: (id: SculptureId) => void;
  paletteIndex: number;
  setPaletteIndex: (index: number) => void;
  setEnergy: (energy: number) => void;
  setPaused: (paused: boolean) => void;
}) {
  return (
    <section className="hero" id="playground">
      <div className="hero-grid" />
      <div className="hero-copy">
        <span className="eyebrow">
          Independent design company <i />
          Madrid · Everywhere
        </span>
        <h1>
          WE MAKE
          <br />
          BRANDS <em>MOVE.</em>
        </h1>
        <p>
          Strategy, identity and digital experiences for companies building a more interesting
          world.
        </p>
      </div>
      <div className="canvas-wrap" aria-label="Interactive 3D sculpture playground">
        <StudioScene
          palette={palette}
          energy={energy}
          paused={paused}
          active={active}
          onActiveChange={setActive}
        />
      </div>
      <div className="scene-instructions">
        <span>
          <MousePointer2 size={14} /> Drag to orbit
        </span>
        <span>
          <Move3d size={14} /> Scroll to zoom
        </span>
        <span>
          <Sparkles size={14} /> Click the forms
        </span>
      </div>
      <aside className="object-card">
        <div>
          <span>{sculptures[active].number} / 03</span>
          <b>SELECTED FORM</b>
        </div>
        <h2>{sculptures[active].name}</h2>
        <p>{sculptures[active].detail}</p>
        <div className="object-dots">
          {(Object.keys(sculptures) as SculptureId[]).map((id) => (
            <button
              key={id}
              className={active === id ? 'active' : ''}
              onClick={() => setActive(id)}
              aria-label={`Select ${sculptures[id].name}`}
            />
          ))}
        </div>
      </aside>
      <div className="play-controls">
        <button
          className="play-button"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? 'Play animation' : 'Pause animation'}
        >
          {paused ? <Play size={15} fill="currentColor" /> : <Pause size={15} fill="currentColor" />}
        </button>
        <label className="energy-control">
          <span>ENERGY</span>
          <input
            type="range"
            min="0.25"
            max="2.5"
            step="0.05"
            value={energy}
            onChange={(event) => setEnergy(Number(event.target.value))}
          />
          <b>{energy.toFixed(2)}</b>
        </label>
        <div className="palette-control">
          <span>PALETTE</span>
          {palettes.map((item, index) => (
            <button
              key={item.name}
              className={paletteIndex === index ? 'active' : ''}
              style={{'--swatch': item.colors[0]} as React.CSSProperties}
              onClick={() => setPaletteIndex(index)}
              aria-label={item.name}
              title={item.name}
            />
          ))}
        </div>
      </div>
      <button
        className="scroll-cue"
        onClick={() => document.getElementById('work')?.scrollIntoView({behavior: 'smooth'})}
      >
        Scroll to explore <ArrowDown size={15} />
      </button>
    </section>
  );
}

function Marquee() {
  return (
    <div className="marquee" aria-hidden="true">
      <div>
        {[0, 1].map((copy) => (
          <span key={copy}>
            BRAND STRATEGY <Asterisk /> VISUAL IDENTITY <Asterisk /> DIGITAL EXPERIENCES{' '}
            <Asterisk /> MOTION &amp; 3D <Asterisk /> CAMPAIGNS <Asterisk />
          </span>
        ))}
      </div>
    </div>
  );
}

function ProjectVisual({project}: {project: Project}) {
  return (
    <div className={`project-visual ${project.className}`}>
      {project.id === 1 && (
        <>
          <i className="orbit-one" />
          <i className="orbit-two" />
          <strong>N</strong>
          <small>MATTER / REIMAGINED</small>
        </>
      )}
      {project.id === 2 && (
        <>
          <span className="sun-disc" />
          <strong>SUN</strong>
          <small>MORE POWER TO YOU</small>
        </>
      )}
      {project.id === 3 && (
        <>
          <strong>
            COM
            <br />
            MON
          </strong>
          <span>G<br />R<br />O<br />U<br />N<br />D</span>
        </>
      )}
      {project.id === 4 && (
        <>
          <i />
          <strong>K/A</strong>
          <small>INTELLIGENCE WITH EMPATHY</small>
        </>
      )}
    </div>
  );
}

function Work({onProject}: {onProject: (project: Project) => void}) {
  return (
    <section className="work-section" id="work">
      <div className="section-label">
        <span>(01)</span>
        <span>SELECTED WORK</span>
        <span>2025—26</span>
      </div>
      <div className="work-intro">
        <h2>
          Built to be
          <br />
          <em>felt.</em> Made to last.
        </h2>
        <p>
          We partner with ambitious teams at moments of change — turning strategy into identities,
          products and experiences people remember.
        </p>
      </div>
      <div className="project-grid">
        {projects.map((project, index) => (
          <button className={`project-tile project-${index + 1}`} key={project.id} onClick={() => onProject(project)}>
            <ProjectVisual project={project} />
            <div className="project-meta">
              <div>
                <span>{project.client}</span>
                <h3>{project.title}</h3>
              </div>
              <span>{project.year}</span>
            </div>
            <div className="project-tags">
              {project.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
              <ArrowUpRight size={18} />
            </div>
          </button>
        ))}
      </div>
    </section>
  );
}

function Studio() {
  const [service, setService] = useState(0);
  const services = [
    {
      number: '01',
      title: 'STRATEGY',
      text: 'Positioning, research, naming and a sharp point of view that creates momentum.',
    },
    {
      number: '02',
      title: 'IDENTITY',
      text: 'Flexible visual and verbal systems made to stay recognizable across every touchpoint.',
    },
    {
      number: '03',
      title: 'EXPERIENCE',
      text: 'Websites, products and spaces that turn brand thinking into something people can use.',
    },
    {
      number: '04',
      title: 'MOTION',
      text: '3D worlds, motion languages and campaigns designed for a screen-native culture.',
    },
  ];
  return (
    <section className="studio-section" id="studio">
      <div className="section-label inverse">
        <span>(02)</span>
        <span>WHAT WE DO</span>
        <span>FULL SPECTRUM</span>
      </div>
      <div className="studio-heading">
        <p>WE MIX RIGOR WITH PLAY.</p>
        <h2>
          CLEAR THINKING.
          <br />
          <span>UNEXPECTED FORM.</span>
        </h2>
      </div>
      <div className="services">
        <div className="service-list">
          {services.map((item, index) => (
            <button
              className={service === index ? 'active' : ''}
              key={item.number}
              onClick={() => setService(index)}
            >
              <span>{item.number}</span>
              <strong>{item.title}</strong>
              <ChevronRight size={25} />
            </button>
          ))}
        </div>
        <div className="service-detail">
          <span>{services[service].number} / 04</span>
          <p>{services[service].text}</p>
          <div className={`service-shape shape-${service}`}>
            <i />
            <i />
            <i />
          </div>
        </div>
      </div>
      <div className="manifesto">
        <p>
          Small by design.
          <br />
          Global by default.
        </p>
        <blockquote>
          “FORM/FUNCTION brought strategic clarity without sanding off the weirdness. They gave us a
          brand that feels alive.”
        </blockquote>
        <span>— MAYA LIN, FOUNDER AT NOMA</span>
      </div>
    </section>
  );
}

function Footer({onContact}: {onContact: () => void}) {
  return (
    <footer>
      <span className="footer-kicker">HAVE A GOOD PROBLEM?</span>
      <button className="footer-cta" onClick={onContact}>
        LET&apos;S MAKE
        <br />
        <em>SOMETHING</em> <ArrowUpRight />
      </button>
      <div className="footer-bottom">
        <span>FORM/FUNCTION® — 2026</span>
        <div>
          <a href="https://www.instagram.com" target="_blank" rel="noreferrer">
            INSTAGRAM
          </a>
          <a href="https://www.behance.net" target="_blank" rel="noreferrer">
            BEHANCE
          </a>
          <a href="https://www.linkedin.com" target="_blank" rel="noreferrer">
            LINKEDIN
          </a>
        </div>
        <button onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
          BACK TO TOP <ArrowDown size={14} />
        </button>
      </div>
    </footer>
  );
}

function ProjectModal({project, close}: {project: Project | null; close: () => void}) {
  useEffect(() => {
    if (!project) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    document.body.classList.add('modal-open');
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.classList.remove('modal-open');
    };
  }, [project, close]);
  if (!project) return null;
  const index = projects.findIndex((item) => item.id === project.id);
  return (
    <div className="project-modal" role="dialog" aria-modal="true" aria-label={project.client}>
      <div className="modal-top">
        <span>
          CASE STUDY {String(index + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </span>
        <button onClick={close} aria-label="Close project">
          <X size={22} />
        </button>
      </div>
      <div className="modal-project-visual">
        <ProjectVisual project={project} />
      </div>
      <div className="modal-project-copy">
        <div>
          <span>{project.client}</span>
          <h2>{project.title}</h2>
        </div>
        <div>
          <p>{project.description}</p>
          <div>
            {project.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
      <div className="project-pager">
        <button onClick={() => close()}>
          <ChevronLeft /> Close
        </button>
        <span>{project.year}</span>
      </div>
    </div>
  );
}

function ContactPanel({open, close}: {open: boolean; close: () => void}) {
  const [sent, setSent] = useState(false);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSent(true);
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);
  return (
    <>
      <button
        className={`contact-scrim ${open ? 'open' : ''}`}
        onClick={close}
        aria-label="Close contact panel"
      />
      <aside className={`contact-panel ${open ? 'open' : ''}`} aria-hidden={!open}>
        <div className="contact-head">
          <span>NEW BUSINESS / 2026</span>
          <button onClick={close} aria-label="Close contact panel">
            <X size={22} />
          </button>
        </div>
        {sent ? (
          <div className="sent-state">
            <span>
              <Check size={25} />
            </span>
            <h2>GOOD THINGS<br />START HERE.</h2>
            <p>Thanks for reaching out. We&apos;ll get back to you within two working days.</p>
            <button onClick={close}>Back to the studio</button>
          </div>
        ) : (
          <>
            <h2>
              TELL US WHAT
              <br />
              YOU&apos;RE <em>BUILDING.</em>
            </h2>
            <form onSubmit={submit}>
              <label>
                YOUR NAME
                <input name="name" required placeholder="Name / Company" />
              </label>
              <label>
                EMAIL
                <input name="email" required type="email" placeholder="you@company.com" />
              </label>
              <label>
                WHAT DO YOU NEED?
                <select name="need" defaultValue="">
                  <option value="" disabled>
                    Select a service
                  </option>
                  <option>Brand strategy</option>
                  <option>Visual identity</option>
                  <option>Digital experience</option>
                  <option>Motion &amp; 3D</option>
                </select>
              </label>
              <label>
                THE SHORT VERSION
                <textarea name="message" required rows={4} placeholder="A little about the project..." />
              </label>
              <button type="submit">
                Send inquiry <Send size={17} />
              </button>
            </form>
          </>
        )}
      </aside>
    </>
  );
}

export default function App() {
  const [paletteIndex, setPaletteIndex] = useState(0);
  const [energy, setEnergy] = useState(1);
  const [paused, setPaused] = useState(false);
  const [active, setActive] = useState<SculptureId>('flux');
  const [project, setProject] = useState<Project | null>(null);
  const [contact, setContact] = useState(false);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onPointer = (event: PointerEvent) => {
      if (!cursorRef.current) return;
      cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };
    window.addEventListener('pointermove', onPointer);
    return () => window.removeEventListener('pointermove', onPointer);
  }, []);

  return (
    <>
      <div className="cursor-dot" ref={cursorRef} />
      <Header onContact={() => setContact(true)} />
      <Hero
        palette={palettes[paletteIndex].colors}
        energy={energy}
        paused={paused}
        active={active}
        setActive={setActive}
        paletteIndex={paletteIndex}
        setPaletteIndex={setPaletteIndex}
        setEnergy={setEnergy}
        setPaused={setPaused}
      />
      <Marquee />
      <Work onProject={setProject} />
      <Studio />
      <Footer onContact={() => setContact(true)} />
      <ProjectModal project={project} close={() => setProject(null)} />
      <ContactPanel open={contact} close={() => setContact(false)} />
    </>
  );
}
