import {
  ArrowDownRight,
  ArrowUpRight,
  Bell,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleDollarSign,
  Clock3,
  Code2,
  Compass,
  CreditCard,
  FileText,
  Globe2,
  LayoutDashboard,
  Menu,
  MessageCircle,
  MoreHorizontal,
  Plus,
  Search,
  Send,
  Sparkles,
  WalletCards,
  X,
} from 'lucide-react';
import {FormEvent, ReactNode, useEffect, useMemo, useRef, useState} from 'react';

type Tab = 'home' | 'messages' | 'discover' | 'wallet' | 'projects';
type ProjectStatus = 'Paid' | 'Pending';

type Project = {
  id: number;
  title: string;
  rate: number;
  status: ProjectStatus;
  description: string;
  location: string;
  updated: string;
  category: string;
  accent: string;
};

type Person = {
  id: number;
  name: string;
  role: string;
  level: string;
  color: string;
};

const seedProjects: Project[] = [
  {
    id: 1,
    title: 'Web Development Project',
    rate: 10,
    status: 'Paid',
    description:
      'Implementación frontend y backend, además de integración con APIs de terceros.',
    location: 'Germany',
    updated: '2h ago',
    category: 'Development',
    accent: '#d85b2d',
  },
  {
    id: 2,
    title: 'Copywriting Project',
    rate: 10,
    status: 'Pending',
    description:
      'Sistema editorial, estrategia de contenidos y copy para una nueva plataforma.',
    location: 'United Kingdom',
    updated: 'Yesterday',
    category: 'Content',
    accent: '#798291',
  },
  {
    id: 3,
    title: 'Web Design Project',
    rate: 10,
    status: 'Paid',
    description:
      'Diseño de experiencia, interfaz responsive y librería de componentes.',
    location: 'Spain',
    updated: '3d ago',
    category: 'Design',
    accent: '#4c90cc',
  },
];

const people: Person[] = [
  {
    id: 1,
    name: 'Randy Gouse',
    role: 'Cybersecurity specialist',
    level: 'Senior',
    color: '#8b553f',
  },
  {
    id: 2,
    name: 'Giana Schleifer',
    role: 'UX/UI Designer',
    level: 'Middle',
    color: '#506f88',
  },
  {
    id: 3,
    name: 'Marta Ochoa',
    role: 'Product strategist',
    level: 'Senior',
    color: '#8b6d9d',
  },
  {
    id: 4,
    name: 'Elliot Kim',
    role: 'Full-stack developer',
    level: 'Expert',
    color: '#627764',
  },
];

const weekData = [56, 72, 42, 68, 38, 63, 41];
const monthData = [36, 62, 48, 82, 58, 91, 69];
const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key);
      return stored ? (JSON.parse(stored) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
}

const Logo = () => (
  <div className="logo" aria-label="Twisty">
    <span className="logo-mark">
      <span />
    </span>
    <span>TWISTY</span>
  </div>
);

function Avatar({name, color, size = 'md'}: {name: string; color: string; size?: 'sm' | 'md' | 'lg'}) {
  const initials = name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2);
  return (
    <span className={`avatar avatar-${size}`} style={{'--avatar': color} as React.CSSProperties}>
      {initials}
    </span>
  );
}

function IconButton({
  children,
  label,
  onClick,
  active = false,
}: {
  children: ReactNode;
  label: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      className={`icon-button ${active ? 'active' : ''}`}
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function Header({
  tab,
  setTab,
  query,
  setQuery,
  onMenu,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  query: string;
  setQuery: (query: string) => void;
  onMenu: () => void;
}) {
  const nav: {id: Tab; label: string}[] = [
    {id: 'home', label: 'Home'},
    {id: 'messages', label: 'Messages'},
    {id: 'discover', label: 'Discover'},
    {id: 'wallet', label: 'Wallet'},
    {id: 'projects', label: 'Projects'},
  ];

  return (
    <header className="topbar">
      <button className="mobile-menu" onClick={onMenu} aria-label="Abrir menú">
        <Menu size={20} />
      </button>
      <Logo />
      <nav className="nav-tabs" aria-label="Navegación principal">
        {nav.map((item) => (
          <button
            key={item.id}
            className={tab === item.id ? 'active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>
      <div className="header-actions">
        <label className="search-box">
          <Search size={17} />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search projects, people..."
          />
          {query && (
            <button onClick={() => setQuery('')} aria-label="Limpiar búsqueda">
              <X size={14} />
            </button>
          )}
        </label>
        <IconButton label="Mensajes" onClick={() => setTab('messages')}>
          <MessageCircle size={18} />
        </IconButton>
        <IconButton label="Notificaciones" active>
          <Bell size={18} />
        </IconButton>
        <button className="profile-button" onClick={() => setTab('wallet')} aria-label="Abrir perfil">
          <Avatar name="Alex Morgan" color="#2f3e51" size="sm" />
        </button>
      </div>
    </header>
  );
}

function MobileNav({
  tab,
  setTab,
  open,
  close,
}: {
  tab: Tab;
  setTab: (tab: Tab) => void;
  open: boolean;
  close: () => void;
}) {
  const items: {id: Tab; label: string; icon: ReactNode}[] = [
    {id: 'home', label: 'Dashboard', icon: <LayoutDashboard size={19} />},
    {id: 'messages', label: 'Messages', icon: <MessageCircle size={19} />},
    {id: 'discover', label: 'Discover', icon: <Compass size={19} />},
    {id: 'wallet', label: 'Wallet', icon: <WalletCards size={19} />},
    {id: 'projects', label: 'Projects', icon: <BriefcaseBusiness size={19} />},
  ];
  return (
    <>
      <button className={`drawer-scrim ${open ? 'open' : ''}`} onClick={close} aria-label="Cerrar menú" />
      <aside className={`mobile-drawer ${open ? 'open' : ''}`}>
        <div className="drawer-head">
          <Logo />
          <IconButton label="Cerrar" onClick={close}>
            <X size={18} />
          </IconButton>
        </div>
        {items.map((item) => (
          <button
            className={tab === item.id ? 'active' : ''}
            key={item.id}
            onClick={() => {
              setTab(item.id);
              close();
            }}
          >
            {item.icon}
            {item.label}
          </button>
        ))}
      </aside>
    </>
  );
}

function IncomeCard() {
  const [period, setPeriod] = useState<'Week' | 'Month'>('Week');
  const [active, setActive] = useState(2);
  const data = period === 'Week' ? weekData : monthData;
  const amount = Math.round((data[active] / data.reduce((a, b) => a + b, 0)) * 15420);

  return (
    <section className="card income-card">
      <div className="card-title-row">
        <div>
          <div className="title-with-icon">
            <span className="soft-icon">
              <CreditCard size={17} />
            </span>
            <h2>Income Tracker</h2>
          </div>
          <p>Track changes in income over time and access detailed data on each project.</p>
        </div>
        <button
          className="select-button"
          onClick={() => setPeriod(period === 'Week' ? 'Month' : 'Week')}
        >
          {period} <ChevronDown size={15} />
        </button>
      </div>
      <div className="income-body">
        <div className="income-change">
          <strong>+20%</strong>
          <span>This {period.toLowerCase()}'s income is higher than last {period.toLowerCase()}'s</span>
        </div>
        <div className="chart" aria-label="Income chart">
          {data.map((height, index) => (
            <button
              className={`bar-wrap ${active === index ? 'active' : ''}`}
              key={`${period}-${index}`}
              onClick={() => setActive(index)}
              aria-label={`${days[index]}: $${amount}`}
            >
              {active === index && <span className="chart-tooltip">${`$${amount.toLocaleString()}`}</span>}
              <span className="bar-area">
                <span className="bar-line" style={{height: `${height}%`}} />
                <span className="bar-dot" style={{bottom: `${height}%`}} />
              </span>
              <span className="day">{days[index]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProjectIcon({project}: {project: Project}) {
  return (
    <span className="project-icon" style={{background: project.accent}}>
      {project.category === 'Development' ? (
        <Code2 size={18} />
      ) : project.category === 'Content' ? (
        <FileText size={18} />
      ) : (
        <Sparkles size={18} />
      )}
    </span>
  );
}

function ProjectRow({
  project,
  expanded,
  onToggle,
}: {
  project: Project;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <article className={`project-row ${expanded ? 'expanded' : ''}`}>
      <button className="project-summary" onClick={onToggle}>
        <ProjectIcon project={project} />
        <span className="project-name">
          <span>
            {project.title}
            <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span>
          </span>
          <small>${project.rate}/hour</small>
        </span>
        <span className="project-chevron">
          <ChevronDown size={18} />
        </span>
      </button>
      <div className="project-details">
        <p>{project.description}</p>
        <div>
          <span>
            <Globe2 size={14} /> {project.location}
          </span>
          <span>
            <Clock3 size={14} /> {project.updated}
          </span>
        </div>
      </div>
    </article>
  );
}

function ProjectsCard({
  projects,
  query,
  onSeeAll,
}: {
  projects: Project[];
  query: string;
  onSeeAll: () => void;
}) {
  const [expanded, setExpanded] = useState<number | null>(projects[0]?.id ?? null);
  const filtered = projects.filter((project) =>
    `${project.title} ${project.description} ${project.category}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <section className="projects-panel">
      <div className="section-head">
        <h2>Your Recent Projects</h2>
        <button onClick={onSeeAll}>See all Projects</button>
      </div>
      <div className="projects-list">
        {filtered.length ? (
          filtered.slice(0, 3).map((project) => (
            <ProjectRow
              key={project.id}
              project={project}
              expanded={expanded === project.id}
              onToggle={() => setExpanded(expanded === project.id ? null : project.id)}
            />
          ))
        ) : (
          <div className="empty-state compact">
            <Search size={21} />
            No projects match “{query}”
          </div>
        )}
      </div>
    </section>
  );
}

function ConnectCard({
  connected,
  setConnected,
  onSeeAll,
}: {
  connected: number[];
  setConnected: (ids: number[]) => void;
  onSeeAll: () => void;
}) {
  const toggle = (id: number) =>
    setConnected(connected.includes(id) ? connected.filter((item) => item !== id) : [...connected, id]);
  return (
    <section className="simple-section connect-section">
      <div className="section-head">
        <h2>Let&apos;s Connect</h2>
        <button onClick={onSeeAll}>See all</button>
      </div>
      <div className="people-list">
        {people.slice(0, 2).map((person) => {
          const isConnected = connected.includes(person.id);
          return (
            <article className="person-row" key={person.id}>
              <Avatar name={person.name} color={person.color} />
              <span className="person-info">
                <strong>
                  {person.name}
                  <small style={{'--level': person.color} as React.CSSProperties}>{person.level}</small>
                </strong>
                <span>{person.role}</span>
              </span>
              <button
                className={`connect-button ${isConnected ? 'connected' : ''}`}
                onClick={() => toggle(person.id)}
                aria-label={isConnected ? `Desconectar de ${person.name}` : `Conectar con ${person.name}`}
              >
                {isConnected ? <Check size={16} /> : <Plus size={16} />}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

function PremiumCard({
  premium,
  upgrade,
}: {
  premium: boolean;
  upgrade: () => void;
}) {
  return (
    <section className={`card premium-card ${premium ? 'is-premium' : ''}`}>
      <div className="premium-orb orb-one" />
      <div className="premium-orb orb-two" />
      <div className="premium-copy">
        <span className="premium-kicker">{premium ? 'TWISTY PRO' : 'LEVEL UP'}</span>
        <h2>{premium ? 'Premium Unlocked' : 'Unlock Premium Features'}</h2>
        <p>
          {premium
            ? 'Unlimited proposals and advanced analytics are now active.'
            : 'Get access to exclusive benefits and expand your freelancing opportunities.'}
        </p>
      </div>
      <button onClick={upgrade} disabled={premium}>
        {premium ? (
          <>
            Active <Check size={17} />
          </>
        ) : (
          <>
            Upgrade now <ChevronRight size={17} />
          </>
        )}
      </button>
    </section>
  );
}

function ProposalCard({
  metrics,
  onAdvance,
}: {
  metrics: number[];
  onAdvance: () => void;
}) {
  const labels = ['Proposals sent', 'Interviews', 'Hires'];
  const colors = ['#6f767f', '#cf754f', '#3f444c'];
  return (
    <section className="card proposal-card">
      <div className="card-title-row proposal-head">
        <h2>Proposal Progress</h2>
        <button className="date-button">
          <CalendarDays size={16} /> April 11, 2024 <ChevronDown size={14} />
        </button>
      </div>
      <div className="metrics">
        {metrics.map((metric, index) => (
          <div className="metric" key={labels[index]}>
            <span>{labels[index]}</span>
            <strong>{metric}</strong>
            <div className="mini-bars">
              {Array.from({length: 12}).map((_, bar) => (
                <i key={bar} style={{background: colors[index], opacity: 0.25 + bar / 17}} />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="advance-button" onClick={onAdvance}>
        Log new proposal <Plus size={14} />
      </button>
    </section>
  );
}

function Dashboard({
  projects,
  query,
  setTab,
  connected,
  setConnected,
  premium,
  upgrade,
  metrics,
  setMetrics,
}: {
  projects: Project[];
  query: string;
  setTab: (tab: Tab) => void;
  connected: number[];
  setConnected: (ids: number[]) => void;
  premium: boolean;
  upgrade: () => void;
  metrics: number[];
  setMetrics: (values: number[]) => void;
}) {
  return (
    <main className="dashboard">
      <IncomeCard />
      <ProjectsCard projects={projects} query={query} onSeeAll={() => setTab('projects')} />
      <ConnectCard
        connected={connected}
        setConnected={setConnected}
        onSeeAll={() => setTab('discover')}
      />
      <PremiumCard premium={premium} upgrade={upgrade} />
      <ProposalCard
        metrics={metrics}
        onAdvance={() => setMetrics([metrics[0] + 1, metrics[1], metrics[2]])}
      />
    </main>
  );
}

function PageHeader({
  eyebrow,
  title,
  text,
  action,
}: {
  eyebrow: string;
  title: string;
  text: string;
  action?: ReactNode;
}) {
  return (
    <div className="page-header">
      <div>
        <span>{eyebrow}</span>
        <h1>{title}</h1>
        <p>{text}</p>
      </div>
      {action}
    </div>
  );
}

function MessagesPage() {
  const [selected, setSelected] = useState(people[0]);
  const [draft, setDraft] = useState('');
  const [sent, setSent] = useState<string[]>([]);
  const submit = (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim()) return;
    setSent([...sent, draft.trim()]);
    setDraft('');
  };
  return (
    <main className="inner-page">
      <PageHeader
        eyebrow="INBOX"
        title="Messages"
        text="Keep every project conversation in one place."
      />
      <section className="messages-layout card">
        <aside className="conversation-list">
          {people.slice(0, 3).map((person, index) => (
            <button
              className={selected.id === person.id ? 'active' : ''}
              key={person.id}
              onClick={() => setSelected(person)}
            >
              <Avatar name={person.name} color={person.color} />
              <span>
                <strong>{person.name}</strong>
                <small>{index ? 'Can you send the latest files?' : 'Sounds great, thank you!'}</small>
              </span>
              <time>{index + 2}m</time>
            </button>
          ))}
        </aside>
        <div className="chat">
          <div className="chat-head">
            <Avatar name={selected.name} color={selected.color} />
            <span>
              <strong>{selected.name}</strong>
              <small>Online now</small>
            </span>
            <IconButton label="Más opciones">
              <MoreHorizontal size={19} />
            </IconButton>
          </div>
          <div className="chat-body">
            <div className="bubble theirs">Hi Alex! I reviewed the latest project update.</div>
            <div className="bubble mine">Perfect. Is everything ready for the next milestone?</div>
            <div className="bubble theirs">It is. The direction looks really strong.</div>
            {sent.map((message, index) => (
              <div className="bubble mine" key={index}>
                {message}
              </div>
            ))}
          </div>
          <form className="message-input" onSubmit={submit}>
            <input
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
              placeholder={`Message ${selected.name.split(' ')[0]}...`}
            />
            <button type="submit" aria-label="Enviar mensaje">
              <Send size={17} />
            </button>
          </form>
        </div>
      </section>
    </main>
  );
}

function DiscoverPage({
  connected,
  setConnected,
  query,
}: {
  connected: number[];
  setConnected: (ids: number[]) => void;
  query: string;
}) {
  const visible = people.filter((person) =>
    `${person.name} ${person.role}`.toLowerCase().includes(query.toLowerCase()),
  );
  const toggle = (id: number) =>
    setConnected(connected.includes(id) ? connected.filter((item) => item !== id) : [...connected, id]);
  return (
    <main className="inner-page">
      <PageHeader
        eyebrow="NETWORK"
        title="Discover talent"
        text="Build your trusted network of independent specialists."
      />
      <section className="talent-grid">
        {visible.map((person) => {
          const active = connected.includes(person.id);
          return (
            <article className="talent-card card" key={person.id}>
              <Avatar name={person.name} color={person.color} size="lg" />
              <span className="availability">Available</span>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <div className="skill-pills">
                <span>{person.level}</span>
                <span>Remote</span>
              </div>
              <button className={active ? 'secondary-button' : 'primary-button'} onClick={() => toggle(person.id)}>
                {active ? (
                  <>
                    <Check size={16} /> Connected
                  </>
                ) : (
                  <>
                    <Plus size={16} /> Connect
                  </>
                )}
              </button>
            </article>
          );
        })}
      </section>
    </main>
  );
}

function WalletPage() {
  const transactions = [
    {title: 'Web Development Project', date: 'Today, 10:42', amount: 1250, incoming: true},
    {title: 'Figma Professional', date: 'Yesterday, 16:20', amount: 15, incoming: false},
    {title: 'Copywriting Project', date: 'Apr 9, 09:10', amount: 680, incoming: true},
  ];
  return (
    <main className="inner-page">
      <PageHeader
        eyebrow="FINANCES"
        title="Wallet"
        text="A clear view of cash flow across your freelance business."
        action={<button className="primary-button"><Plus size={16} /> Add funds</button>}
      />
      <div className="wallet-grid">
        <section className="balance-card">
          <span>Available balance</span>
          <strong>$12,840.50</strong>
          <small>+$1,915 this month</small>
          <div>
            <button>Send</button>
            <button>Withdraw</button>
          </div>
        </section>
        <section className="card transaction-card">
          <div className="section-head">
            <h2>Recent activity</h2>
            <button>View statement</button>
          </div>
          {transactions.map((item) => (
            <article key={item.title}>
              <span className={`transaction-icon ${item.incoming ? 'income' : 'expense'}`}>
                {item.incoming ? <ArrowDownRight size={17} /> : <ArrowUpRight size={17} />}
              </span>
              <span>
                <strong>{item.title}</strong>
                <small>{item.date}</small>
              </span>
              <b className={item.incoming ? 'positive' : ''}>
                {item.incoming ? '+' : '-'}${item.amount.toLocaleString()}
              </b>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}

function ProjectsPage({
  projects,
  query,
  onAdd,
}: {
  projects: Project[];
  query: string;
  onAdd: () => void;
}) {
  const [status, setStatus] = useState<'All' | ProjectStatus>('All');
  const filtered = projects.filter(
    (project) =>
      (status === 'All' || project.status === status) &&
      `${project.title} ${project.description}`.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <main className="inner-page">
      <PageHeader
        eyebrow="WORKSPACE"
        title="Projects"
        text="Manage active work, payments and delivery in one view."
        action={
          <button className="primary-button" onClick={onAdd}>
            <Plus size={16} /> New project
          </button>
        }
      />
      <div className="filter-tabs">
        {(['All', 'Paid', 'Pending'] as const).map((item) => (
          <button className={status === item ? 'active' : ''} onClick={() => setStatus(item)} key={item}>
            {item}
          </button>
        ))}
      </div>
      <section className="project-board">
        {filtered.map((project) => (
          <article className="project-card card" key={project.id}>
            <div>
              <ProjectIcon project={project} />
              <span className={`status ${project.status.toLowerCase()}`}>{project.status}</span>
            </div>
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="project-card-meta">
              <span>
                <CircleDollarSign size={15} /> ${project.rate}/hour
              </span>
              <span>
                <Globe2 size={15} /> {project.location}
              </span>
            </div>
            <button>Open workspace <ChevronRight size={15} /></button>
          </article>
        ))}
      </section>
    </main>
  );
}

function NewProjectModal({
  open,
  close,
  add,
}: {
  open: boolean;
  close: () => void;
  add: (project: Project) => void;
}) {
  const modalRef = useRef<HTMLDivElement>(null);
  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    add({
      id: Date.now(),
      title: String(data.get('title')),
      rate: Number(data.get('rate')),
      status: 'Pending',
      description: String(data.get('description')),
      location: String(data.get('location')),
      updated: 'Just now',
      category: String(data.get('category')),
      accent: '#6e70a7',
    });
    event.currentTarget.reset();
    close();
  };
  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => event.key === 'Escape' && close();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, close]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div className="modal" ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="project-modal-title">
        <div className="modal-head">
          <div>
            <span>NEW WORKSPACE</span>
            <h2 id="project-modal-title">Create a project</h2>
          </div>
          <IconButton label="Cerrar" onClick={close}>
            <X size={18} />
          </IconButton>
        </div>
        <form onSubmit={submit}>
          <label>
            Project title
            <input name="title" required autoFocus placeholder="e.g. Mobile app redesign" />
          </label>
          <div className="form-row">
            <label>
              Hourly rate
              <div className="input-prefix">
                <span>$</span>
                <input name="rate" required min="1" type="number" defaultValue="45" />
              </div>
            </label>
            <label>
              Category
              <select name="category" defaultValue="Design">
                <option>Design</option>
                <option>Development</option>
                <option>Content</option>
                <option>Strategy</option>
              </select>
            </label>
          </div>
          <label>
            Location
            <input name="location" required placeholder="Remote" defaultValue="Remote" />
          </label>
          <label>
            Description
            <textarea name="description" required rows={4} placeholder="What are you building?" />
          </label>
          <div className="modal-actions">
            <button type="button" className="secondary-button" onClick={close}>
              Cancel
            </button>
            <button type="submit" className="primary-button">
              Create project <ChevronRight size={16} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function Toast({message, visible}: {message: string; visible: boolean}) {
  return (
    <div className={`toast ${visible ? 'visible' : ''}`} role="status">
      <span>
        <Check size={15} />
      </span>
      {message}
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState<Tab>('home');
  const [query, setQuery] = useState('');
  const [drawer, setDrawer] = useState(false);
  const [modal, setModal] = useState(false);
  const [projects, setProjects] = useStoredState<Project[]>('twisty-projects', seedProjects);
  const [connected, setConnected] = useStoredState<number[]>('twisty-connections', []);
  const [premium, setPremium] = useStoredState('twisty-premium', false);
  const [metrics, setMetrics] = useStoredState('twisty-metrics', [64, 12, 10]);
  const [toast, setToast] = useState('');

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(''), 2400);
  };

  const addProject = (project: Project) => {
    setProjects([project, ...projects]);
    notify('Project created successfully');
  };

  const page = useMemo(() => {
    if (tab === 'messages') return <MessagesPage />;
    if (tab === 'discover')
      return <DiscoverPage connected={connected} setConnected={setConnected} query={query} />;
    if (tab === 'wallet') return <WalletPage />;
    if (tab === 'projects')
      return <ProjectsPage projects={projects} query={query} onAdd={() => setModal(true)} />;
    return (
      <Dashboard
        projects={projects}
        query={query}
        setTab={setTab}
        connected={connected}
        setConnected={setConnected}
        premium={premium}
        upgrade={() => {
          setPremium(true);
          notify('Welcome to Twisty Premium');
        }}
        metrics={metrics}
        setMetrics={(values) => {
          setMetrics(values);
          notify('Proposal logged');
        }}
      />
    );
  }, [tab, connected, setConnected, query, projects, premium, setPremium, metrics, setMetrics]);

  return (
    <div className="app">
      <Header
        tab={tab}
        setTab={setTab}
        query={query}
        setQuery={setQuery}
        onMenu={() => setDrawer(true)}
      />
      <MobileNav tab={tab} setTab={setTab} open={drawer} close={() => setDrawer(false)} />
      {page}
      <NewProjectModal open={modal} close={() => setModal(false)} add={addProject} />
      <Toast message={toast} visible={Boolean(toast)} />
    </div>
  );
}
