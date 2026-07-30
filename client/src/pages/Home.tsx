import { Suspense, lazy } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  ArrowUpRight,
  Code2,
  Monitor,
  Zap,
  MapPin,
  Briefcase,
  Cpu,
  CheckCircle2,
  Layers,
  Radio,
  Shield,
  Gauge,
  Server,
  Terminal,
  Binary,
  Wifi,
  HardDrive,
  Linkedin,
  Github,
  Gamepad2,
  Twitch,
  Youtube,
  MessageCircle,
} from 'lucide-react';
import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import Typewriter from '@/components/Typewriter';
import ProjectCard from '@/components/ProjectCard';
import SkillGroup from '@/components/SkillGroup';
import DiscordPresence from '@/components/DiscordPresence';
import NeonCard from '@/components/NeonCard';
import IdentitySwap from '@/components/IdentitySwap';
import GridBackground from '@/components/GridBackground';
import TerminalBadge from '@/components/TerminalBadge';
import { DISCORD_USER_ID } from '@/config/env';
import { projects } from '@/data/projects';
import { experience, certifications } from '@/data/experience';
import { socials } from '@/data/socials';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

const HeroScene = lazy(() => import('@/components/HeroScene'));

const skills = [
  { title: 'Languages', skills: ['JavaScript', 'Node.js', 'HTML5', 'CSS3', 'Python', 'Go'], accent: 'cyan' as const },
  { title: 'Backend & Database', skills: ['Express', 'REST APIs', 'WebSockets', 'OAuth2', 'OpenAPI', 'SQLite', 'n8n', 'Winston'], accent: 'magenta' as const },
  { title: 'Systems & Architecture', skills: ['Linux', 'Windows Admin', 'AWS', 'Azure', 'Dynatrace', 'Docker', 'Redis'], accent: 'purple' as const },
  { title: 'Operations & Security', skills: ['JIRA', 'ServiceNow', 'Confluence', 'ITIL', 'Incident Response', 'SLA', 'MPLS', 'Git'], accent: 'lime' as const },
];

const socialIconMap: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Steam: Gamepad2,
  Twitch: Twitch,
  YouTube: Youtube,
  Discord: MessageCircle,
};

const socialColorMap: Record<string, string> = {
  LinkedIn: 'border-[#0A66C2]/30 bg-[#0A66C2]/10 text-[#0A66C2]',
  GitHub: 'border-white/20 bg-white/10 text-white',
  Steam: 'border-[#1b2838]/30 bg-[#1b2838]/30 text-[#66c0f4]',
  Twitch: 'border-[#9146FF]/30 bg-[#9146FF]/10 text-[#9146FF]',
  YouTube: 'border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000]',
  Discord: 'border-[#5865F2]/30 bg-[#5865F2]/10 text-[#5865F2]',
};

const focusCards = [
  {
    icon: Monitor,
    title: 'App Engineering',
    text: 'Enterprise Linux & Windows platforms, incident response, Dynatrace monitoring, ITIL workflows.',
  },
  {
    icon: Code2,
    title: 'RESTful Systems',
    text: 'Node.js + Express APIs with rate limiting, caching, OpenAPI specs, and defensive fallbacks.',
  },
  {
    icon: Zap,
    title: 'Streaming Pipelines',
    text: 'Real-time overlays, Twitch IRC bots, 7TV asset resolution, WebSocket event relays.',
  },
];

const tools: [string, React.ElementType][] = [
  ['Node.js', Server], ['Express', Code2], ['SQLite', Layers], ['WebSockets', Radio],
  ['OAuth2', Shield], ['OpenAPI', Terminal], ['n8n', Gauge], ['Linux', HardDrive],
  ['AWS', Cloud], ['Azure', Cloud], ['Dynatrace', Gauge], ['JIRA', CheckCircle2],
  ['ServiceNow', CheckCircle2], ['ITIL', Shield], ['REST', Code2], ['Tailwind', Layers],
  ['EJS', Code2], ['Winston', Terminal], ['Git', Code2], ['Python', Code2],
  ['tmi.js', Radio], ['MPLS', Wifi], ['Docker', Server], ['Redis', Layers],
  ['TypeScript', Code2], ['Go', Code2], ['Wails', Layers], ['FFmpeg', Gauge],
  ['React', Layers], ['Three.js', Binary],
];

export default function Home() {
  const reduced = useReducedMotion();
  const featuredProjects = projects.slice(0, 3);

  return (
    <>
      <section data-section="hero" className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 pt-24">
        <Suspense fallback={<div className="absolute inset-0 -z-10 bg-bg" />}>
          <HeroScene />
        </Suspense>
        <GridBackground />

        <div className="relative z-10 mx-auto max-w-7xl">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="mb-5 inline-flex items-center gap-2 rounded border border-accent-cyan/20 bg-accent-cyan/5 px-3 py-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-cyan" />
                <Typewriter />
              </div>

              <h1 className="mb-4 font-display text-6xl font-black leading-[0.9] tracking-tight text-white sm:text-7xl lg:text-8xl">
                <IdentitySwap />
              </h1>

              <div className="mb-5 flex flex-wrap gap-2 text-xs font-mono font-medium">
                <TerminalBadge color="cyan">System Engineer</TerminalBadge>
                <TerminalBadge color="magenta">Node.js Dev</TerminalBadge>
                <TerminalBadge color="purple">Gliwice, PL</TerminalBadge>
              </div>

              <p className="mb-7 max-w-md text-base leading-relaxed text-muted">
                Building enterprise systems by day, streaming tools by night.
              </p>

              <div className="flex flex-wrap gap-3">
                <Link to="/projects" className="btn-primary">
                  ./projects <ArrowRight size={16} />
                </Link>
                <Link to="/contact" className="btn-ghost">
                  ./contact
                </Link>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden lg:block"
              initial={{ opacity: 0, scale: 0.9, rotateY: -12 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
              style={{ perspective: 1200 }}
            >
              <div className="relative grid grid-cols-2 gap-3">
                {[
                  { num: '3', label: 'Services', color: 'text-accent-cyan', border: 'border-accent-cyan/30' },
                  { num: '2', label: 'Years IT', color: 'text-accent-magenta', border: 'border-accent-magenta/30' },
                  { num: '10', label: 'Years Coding', color: 'text-accent-purple', border: 'border-accent-purple/30' },
                  { num: '10', label: 'Certs', color: 'text-accent-lime', border: 'border-accent-lime/30' },
                ].map((card, i) => (
                  <motion.div
                    key={card.label}
                    className={cn(
                      'glass rounded-xl border p-5 text-center transition-all duration-300 hover:-translate-y-1',
                      card.border
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1, duration: 0.6 }}
                    whileHover={reduced ? {} : { scale: 1.03, rotateX: 4, rotateY: -4 }}
                    style={{ transformStyle: 'preserve-3d' }}
                  >
                    <p className={cn('font-display text-4xl font-black', card.color)}>
                      {card.num}
                      <span className="text-lg">+</span>
                    </p>
                    <p className="text-xs font-mono text-muted">{card.label}</p>
                  </motion.div>
                ))}
              </div>
              <div className="absolute -inset-8 -z-10 rounded-full bg-accent-cyan/5 blur-3xl" />
            </motion.div>
          </div>
        </div>

        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="flex h-9 w-5 items-start justify-center rounded-full border border-accent-cyan/30 p-1">
            <div className="h-1.5 w-0.5 rounded-full bg-accent-cyan/70" />
          </div>
        </motion.div>
      </section>

      <section data-section="about" className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTag className="mb-3">SYS_INFO</SectionTag>
            <h2 className="mb-10 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">whoami</span>
            </h2>
          </Reveal>

          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-8">
              <NeonCard glow="cyan" className="h-full">
                <div className="flex h-full flex-col">
                  <div className="mb-4 flex items-center justify-between border-b border-white/[0.06] pb-3">
                    <div className="flex items-center gap-2">
                      <Terminal size={16} className="text-accent-cyan" />
                      <span className="font-mono text-xs text-muted">user@deem:~$ whoami</span>
                    </div>
                    <TerminalBadge color="lime">ONLINE</TerminalBadge>
                  </div>

                  <div>
                    <h3 className="mb-2 font-display text-2xl font-black text-white">
                      Michał <span className="text-gradient">Kornela</span>
                    </h3>
                    <p className="mb-3 text-sm leading-relaxed text-muted">
                      23-year-old <strong className="text-white">Junior System Engineer</strong> at{' '}
                      <strong className="text-white">DXC Technology</strong> and{' '}
                      <strong className="text-white">Node.js backend developer</strong> from Gliwice, Poland.
                    </p>
                    <p className="mb-4 text-sm leading-relaxed text-muted">
                      I build real-time game-facing tools — Valorant stats platforms for partnered streamers, CS2 data APIs, Twitch IRC/WebSocket integrations, and OBS overlays.
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Node.js', 'Express', 'SQLite', 'WebSockets', 'OAuth2', 'OpenAPI', 'n8n', 'Linux', 'AWS', 'Azure'].map((t) => (
                        <span key={t} className="chip">{t}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </NeonCard>
            </div>

            <Reveal delay={0.1} className="lg:col-span-4">
              <DiscordPresence userId={DISCORD_USER_ID} className="h-full" />
            </Reveal>

            <div className="lg:col-span-12">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[
                  { icon: MapPin, label: 'Location', value: 'Gliwice, Poland' },
                  { icon: Briefcase, label: 'Role', value: 'App Engineer @ DXC' },
                  { icon: Cpu, label: 'Spec', value: 'NodeJS' },
                  { icon: CheckCircle2, label: 'Status', value: 'Open to Collab' },
                ].map((fact) => (
                  <div key={fact.label} className="flex items-center gap-2 rounded border border-white/[0.06] bg-bg-card px-3 py-2">
                    <fact.icon size={14} className="text-accent-cyan" />
                    <div className="min-w-0">
                      <p className="text-[9px] font-mono uppercase tracking-wider text-muted">{fact.label}</p>
                      <p className="truncate text-xs font-bold text-white">{fact.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTag className="mb-3">CORE_FIELDS</SectionTag>
            <h2 className="mb-10 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">focus</span> modes
            </h2>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-4 md:grid-cols-3" staggerDelay={0.1}>
            {focusCards.map((card, i) => {
              const Icon = card.icon;
              const colors = ['cyan', 'magenta', 'purple'] as const;
              const color = colors[i];
              return (
                <StaggerItem key={card.title} className="h-full">
                  <NeonCard glow={color} className="h-full">
                    <div className="mb-4 flex items-center gap-3">
                      <div className={cn('rounded border p-2', color === 'cyan' && 'border-accent-cyan/30 bg-accent-cyan/10 text-accent-cyan', color === 'magenta' && 'border-accent-magenta/30 bg-accent-magenta/10 text-accent-magenta', color === 'purple' && 'border-accent-purple/30 bg-accent-purple/10 text-accent-purple')}>
                        <Icon size={20} />
                      </div>
                      <span className="font-mono text-xs text-muted">0{i + 1}</span>
                    </div>
                    <h3 className="mb-2 font-display text-lg font-bold text-white">{card.title}</h3>
                    <p className="text-sm leading-relaxed text-muted">{card.text}</p>
                  </NeonCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="relative overflow-hidden border-y border-white/5 bg-bg-elevated py-10">
        <div className="mx-auto mb-5 max-w-7xl px-6">
          <div className="flex items-center gap-2">
            <Layers size={16} className="text-accent-cyan" />
            <span className="font-mono text-xs uppercase tracking-widest text-muted">Toolchain</span>
          </div>
        </div>
        <div className="animate-marquee flex w-max gap-3 whitespace-nowrap">
          {tools.map(([t, Icon], i) => (
            <span key={i} className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-muted hover:border-accent-cyan/30 hover:text-accent-cyan">
              <Icon size={13} /> {t}
            </span>
          ))}
          {tools.map(([t, Icon], i) => (
            <span key={`dup-${i}`} className="inline-flex items-center gap-2 rounded border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-mono text-muted hover:border-accent-cyan/30 hover:text-accent-cyan">
              <Icon size={13} /> {t}
            </span>
          ))}
        </div>
      </section>

      <section data-section="skills" className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTag className="mb-3">DEPS_MANIFEST</SectionTag>
            <h2 className="mb-10 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">stack</span> modules
            </h2>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-4 md:grid-cols-2" staggerDelay={0.1}>
            {skills.map((group) => (
              <StaggerItem key={group.title} className="h-full">
                <NeonCard glow={group.accent} className="h-full">
                  <SkillGroup title={group.title} skills={group.skills} accent={group.accent} />
                </NeonCard>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      <section data-section="projects" className="relative px-6 py-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_80%_30%,rgba(255,0,110,0.05),transparent_40%)]" />
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTag className="mb-3">PRODUCTION_LOG</SectionTag>
            <h2 className="mb-3 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">deployed</span> units
            </h2>
            <p className="mb-10 max-w-xl text-sm text-muted">High-performance real-time services for gaming infrastructures.</p>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-4 md:grid-cols-2 lg:grid-cols-3" staggerDelay={0.1}>
            {featuredProjects.map((project) => (
              <StaggerItem key={project.slug} className="h-full">
                <ProjectCard project={project} />
              </StaggerItem>
            ))}
          </Stagger>

          <Reveal delay={0.2}>
            <div className="mt-10 text-center">
              <Link to="/projects" className="btn-ghost">
                view all <ArrowRight size={16} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionTag className="mb-3">LOG_HISTORY</SectionTag>
            <h2 className="mb-8 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">career</span> trace
            </h2>
          </Reveal>

          <div className="grid gap-4 md:grid-cols-2">
            {experience.map((job, i) => (
              <Reveal key={job.id} delay={i * 0.1}>
                <NeonCard glow={i === 0 ? 'cyan' : 'magenta'}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-display text-lg font-bold text-white">{job.role}</h3>
                      <p className="text-xs font-bold text-accent-cyan">{job.company}</p>
                    </div>
                    <span className="shrink-0 rounded border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-mono text-muted whitespace-nowrap">
                      {job.date}
                    </span>
                  </div>
                  <p className="my-3 text-xs text-muted">{job.location} · {job.type}</p>
                  <ul className="space-y-1.5 text-sm text-muted">
                    {job.bullets.slice(0, 3).map((b, idx) => (
                      <li key={idx} className="flex gap-2">
                        <span className="text-accent-cyan">›</span>
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </NeonCard>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.2}>
            <div className="mt-8 text-center">
              <Link to="/experience" className="btn-ghost text-xs">
                full trace <ArrowRight size={14} />
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <SectionTag className="mb-3">VERIFIED_CREDENTIALS</SectionTag>
            <h2 className="mb-10 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">certs</span>
            </h2>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
            {certifications.map((cert, i) => {
              const colors = ['cyan', 'magenta', 'purple', 'lime'] as const;
              const color = colors[i % 4];
              return (
                <StaggerItem key={cert.name} className="h-full">
                  <NeonCard glow={color} className="h-full">
                    <p className="text-sm font-bold text-white">{cert.name}</p>
                    <p className="mt-2 text-[10px] font-mono text-muted">{cert.year}</p>
                  </NeonCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section className="relative px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <SectionTag className="mb-3">NETWORK_NODES</SectionTag>
            <h2 className="mb-8 font-display text-3xl font-black text-white sm:text-4xl">
              <span className="text-gradient">social</span> uplinks
            </h2>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
            {socials.map((social) => {
              const Icon = socialIconMap[social.name] || MessageCircle;
              const color = socialColorMap[social.name] || 'border-white/10 bg-white/5 text-muted';
              return (
                <StaggerItem key={social.name} className="h-full">
                  <a
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex h-full items-center gap-3 rounded-xl border border-white/[0.06] bg-bg-card p-4 transition-all hover:-translate-y-1 hover:border-accent-cyan/30"
                  >
                    <div className={cn('rounded border p-2.5 transition-all group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]', color)}>
                      <Icon size={18} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-bold text-white">{social.name}</p>
                      <p className="truncate text-xs text-muted">{social.handle}</p>
                    </div>
                    <ArrowUpRight size={14} className="text-muted transition-colors group-hover:text-accent-cyan" />
                  </a>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </section>

      <section data-section="contact" className="px-6 py-20">
        <div className="mx-auto max-w-4xl">
          <Reveal>
            <NeonCard glow="magenta" className="text-center">
              <div className="relative overflow-hidden py-8 sm:py-12">
                <div className="absolute -left-20 -top-20 h-56 w-56 rounded-full bg-accent-magenta/10 blur-3xl" />
                <div className="absolute -right-20 -bottom-20 h-56 w-56 rounded-full bg-accent-cyan/10 blur-3xl" />
                <SectionTag className="relative mb-4">READY_TO_CONNECT</SectionTag>
                <h2 className="relative mb-3 font-display text-3xl font-black text-white sm:text-5xl">
                  Initialize<br />New Project?
                </h2>
                <p className="relative mx-auto mb-6 max-w-md text-sm text-muted">
                  Collaborate on real-time tooling, system workflows, or high-performance APIs.
                </p>
                <Link to="/contact" className="relative btn-primary">
                  ./contact <ArrowRight size={16} />
                </Link>
              </div>
            </NeonCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}

function Cloud({ size, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M17.5 19c0-3.037-2.463-5.5-5.5-5.5S6.5 15.963 6.5 19" />
      <path d="M17.5 19H19c2.209 0 4-1.791 4-4 0-2.209-1.791-4-4-4-.388 0-.762.056-1.118.16A5.002 5.002 0 0 0 9.5 8.5c-2.761 0-5 2.239-5 5 0 .598.105 1.171.298 1.704A4.002 4.002 0 0 0 5.5 19h2" />
    </svg>
  );
}
