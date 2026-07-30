import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Lock, Unlock, Terminal, ExternalLink, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { Reveal } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import NeonCard from '@/components/NeonCard';
import { projects } from '@/data/projects';
import { useTwitchBatchStatus } from '@/hooks/useTwitch';
import { cn } from '@/lib/utils';
import type { TwitchUser } from '@/types';

export default function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>();
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    return (
      <section data-section="projects" className="min-h-screen px-6 pt-32 pb-24 text-center">
        <h1 className="mb-4 font-display text-4xl font-black text-white">Project not found</h1>
        <Link to="/projects" className="btn-primary">Back to projects</Link>
      </section>
    );
  }

  return (
    <>
      <section
        className="relative overflow-hidden px-6 pt-32 pb-16"
        style={{ backgroundColor: project.accent + '08' }}
      >
        <div
          className="absolute inset-0 -z-10 opacity-30"
          style={{
            background: `radial-gradient(circle at 50% 100%, ${project.accent}25, transparent 60%)`,
          }}
        />
        <div className="absolute -right-20 -top-20 h-96 w-96 rounded-full opacity-20 blur-3xl" style={{ background: project.accent }} />

        <div className="mx-auto max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link to="/projects" className="mb-5 inline-flex items-center gap-2 text-xs font-mono text-muted transition-colors hover:text-accent-cyan">
              <ArrowLeft size={14} /> cd ../projects
            </Link>

            <div className="mb-3 flex flex-wrap items-center gap-3">
              <span className="text-xs font-mono text-muted">{project.tagline}</span>
            </div>

            <h1 className="mb-3 font-display text-4xl font-black text-white sm:text-5xl lg:text-6xl">
              {project.brand ? (
                project.brand.map((part, i) => (
                  <span key={i} style={part.accent ? { color: '#ff3333' } : { color: '#ffffff' }}>
                    {part.text}
                  </span>
                ))
              ) : (
                project.name
              )}
              {project.version && <span className="ml-3 text-3xl text-muted">{project.version}</span>}
            </h1>
            <p className="max-w-3xl text-base leading-relaxed text-muted">{project.longDescription}</p>
          </motion.div>
        </div>
      </section>

      <section data-section="projects" className="px-6 py-14">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-8">
              <Reveal>
                <SectionTag className="mb-3">FEATURE_BREAKDOWN</SectionTag>
                <h2 className="mb-5 font-display text-2xl font-bold text-white">Features</h2>
                <ul className="space-y-3">
                  {project.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 rounded border border-white/[0.06] bg-bg-card p-4">
                      <span className="mt-0.5 text-lg" style={{ color: project.accent }}>›</span>
                      <span className="text-sm text-ink/90">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Reveal>

              {project.details?.architecture && (
                <Reveal>
                  <SectionTag className="mb-3">ARCHITECTURE</SectionTag>
                  <h2 className="mb-5 font-display text-2xl font-bold text-white">How it's built</h2>
                  <NeonCard glow="purple" className="h-full">
                    <ul className="space-y-3">
                      {project.details.architecture.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-sm text-muted">
                          <span className="text-accent-cyan">→</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </NeonCard>
                </Reveal>
              )}

              {project.details?.endpoints && project.details.endpoints.length > 0 && (
                <Reveal>
                  <SectionTag className="mb-3">ENDPOINTS</SectionTag>
                  <h2 className="mb-5 font-display text-2xl font-bold text-white">Key API surface</h2>
                  <div className="overflow-hidden rounded border border-white/[0.06] bg-bg-card">
                    <table className="w-full text-left text-sm">
                      <thead className="border-b border-white/10 bg-white/5">
                        <tr>
                          <th className="px-4 py-3 font-mono text-xs text-muted">Method</th>
                          <th className="px-4 py-3 font-mono text-xs text-muted">Path</th>
                          <th className="px-4 py-3 font-mono text-xs text-muted">Description</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.details.endpoints.map((ep, i) => (
                          <tr key={i} className="border-b border-white/5 last:border-0">
                            <td className="px-4 py-3 font-mono text-xs" style={{ color: project.accent }}>{ep.method}</td>
                            <td className="px-4 py-3 font-mono text-xs text-white">{ep.path}</td>
                            <td className="px-4 py-3 text-xs text-muted">{ep.desc}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Reveal>
              )}
            </div>

            <aside className="space-y-4">
              <Reveal>
                <NeonCard glow="cyan">
                  <h3 className="mb-3 font-display text-lg font-bold text-white">Tech Stack</h3>
                  <div className="flex flex-wrap gap-2">
                    {project.tech.map((t) => (
                      <span
                        key={t}
                        className="rounded border px-2 py-0.5 text-xs font-medium"
                        style={{ background: project.accent + '10', color: project.accent, borderColor: project.accent + '30' }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </NeonCard>
              </Reveal>

              <Reveal>
                <NeonCard glow="magenta">
                  <h3 className="mb-3 font-display text-lg font-bold text-white">Links</h3>
                  <div className="space-y-2">
                    {project.urls.length > 0 ? (
                      project.urls.map((url) => (
                        <a
                          key={url.url}
                          href={url.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-xs font-bold transition-colors hover:text-white"
                          style={{ color: project.accent }}
                        >
                          <ArrowUpRight size={14} /> {url.label}
                        </a>
                      ))
                    ) : (
                      <p className="text-xs text-muted">No public links yet.</p>
                    )}
                  </div>
                </NeonCard>
              </Reveal>

              <Reveal>
                <NeonCard glow="lime">
                  <h3 className="mb-3 font-display text-lg font-bold text-white">Repository</h3>
                  <div className="flex items-center gap-2 text-xs text-muted">
                    {project.repo === 'Private' ? <Lock size={14} /> : <Unlock size={14} />}
                    <span>{project.repo} Repo</span>
                  </div>
                </NeonCard>
              </Reveal>

              {project.details?.stackDetails && (
                <Reveal>
                  <NeonCard glow="purple">
                    <h3 className="mb-3 font-display text-lg font-bold text-white">Stack Details</h3>
                    <dl className="space-y-3">
                      {project.details.stackDetails.map((group) => (
                        <div key={group.category}>
                          <dt className="text-[10px] font-mono uppercase tracking-wider text-muted">{group.category}</dt>
                          <dd className="text-xs text-ink">{group.items.join(', ')}</dd>
                        </div>
                      ))}
                    </dl>
                  </NeonCard>
                </Reveal>
              )}

              <Reveal>
                <NeonCard glow="magenta">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono uppercase tracking-wider text-muted">STATUS</span>
                      <span
                        className="rounded border px-2 py-0.5 text-xs font-bold"
                        style={{ background: project.accent + '15', color: project.accent, borderColor: project.accent + '40' }}
                      >
                        {project.status}
                      </span>
                    </div>
                    {project.progress !== undefined && (
                      <div>
                        <div className="mb-1.5 flex items-center justify-between text-xs">
                          <span className="font-mono text-muted">PROJECT_PROGRESS</span>
                          <span className="font-mono font-bold text-white">{project.progress}%</span>
                        </div>
                        <div className="h-2 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.04]">
                          <motion.div
                            className="h-full rounded-full"
                            style={{
                              background: `linear-gradient(90deg, ${project.progress === 100 ? '#6ee7b7' : project.accent}, ${project.progress === 100 ? '#4ade80' : project.accent + 'aa'})`,
                              width: `${project.progress}%`,
                            }}
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                          />
                        </div>
                      </div>
                    )}
                    {project.progress === undefined && (
                      <p className="text-xs text-muted">Project has been released.</p>
                    )}
                  </div>
                </NeonCard>
              </Reveal>
            </aside>
          </div>
        </div>
      </section>

      {project.slug === 'deem-api' && <ValorankStreamers />}

      <section className="px-6 pb-24">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <NeonCard glow="magenta">
              <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">
                <div>
                  <h3 className="font-display text-xl font-bold text-white">Want to see more?</h3>
                  <p className="text-xs text-muted">Browse all projects or get in touch.</p>
                </div>
                <div className="flex gap-3">
                  <Link to="/projects" className="btn-ghost text-xs">All projects</Link>
                  <Link to="/contact" className="btn-primary text-xs"><Terminal size={14} /> Contact</Link>
                </div>
              </div>
            </NeonCard>
          </Reveal>
        </div>
      </section>
    </>
  );
}

const VALORANK_CHANNELS = ['szzalony', 'synekfps', 'hossyfps'];
const VALORANK_EMBEDS: Record<string, string> = {
    szzalony: 'https://api.deem.my/o/kmEkBxpPgZSNf2J69bk81AUHhjg--UhK',
    synekfps: 'https://api.deem.my/o/2iADXliWLYlDpUJaBqi64fHsnW_Min4M',
    hossyfps: 'https://api.deem.my/o/FhxukStTYZfKbk4_TYlWspn2_-ybSzDe',
  };

const DEFAULT_AVATAR =
  'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebb84563-db81-4b1c-8012-27e1e8081e7a-profile_image-150x150.png';

function roundUpClean(n: number): number {
  if (n <= 0) return 0;
  if (n >= 50000) {
    return Math.ceil(n / 10000) * 10000;
  }
  if (n >= 10000) {
    return Math.ceil(n / 5000) * 5000;
  }
  if (n >= 1000) {
    return Math.ceil(n / 1000) * 1000;
  }
  if (n >= 100) {
    return Math.ceil(n / 100) * 100;
  }
  return Math.ceil(n / 10) * 10;
}

function ValorankStreamers() {
  const { statuses } = useTwitchBatchStatus(VALORANK_CHANNELS, 20000);
  const [avatars, setAvatars] = useState<Record<string, string>>({});
  const [avgViewers, setAvgViewers] = useState<number | null>(null);
  const followersRef = useRef<Record<string, number>>({});

  useEffect(() => {
    const f: Record<string, number> = {};
    for (const c of VALORANK_CHANNELS) {
      const followers = statuses[c]?.followers;
      if (followers != null && followers > 0) f[c] = followers;
    }
    if (Object.keys(f).length > 0) followersRef.current = f;
  }, [statuses]);

  useEffect(() => {
    let cancelled = false;
    async function fetchAvg() {
      try {
        const res = await fetch(
          `/api/twitch/average-viewers?channels=${VALORANK_CHANNELS.join(',')}`
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const avgs: Record<string, number> = await res.json();
        if (cancelled) return;

        const followers = followersRef.current;

        const liveChannels = VALORANK_CHANNELS.filter((c) => (avgs[c] ?? 0) > 0);

        let total: number;

        if (liveChannels.length === 1) {
          const liveChan = liveChannels[0];
          const liveFollowers = followers[liveChan] ?? 0;
          if (liveFollowers > 0) {
            const ratio = avgs[liveChan]! / liveFollowers;
            total = VALORANK_CHANNELS.reduce((sum, c) => {
              const avg = avgs[c] ?? 0;
              if (avg > 0) return sum + avg;
              return sum + Math.round(ratio * (followers[c] ?? 0));
            }, 0);
          } else {
            total = Object.values(avgs).reduce((s, v) => s + v, 0);
          }
        } else if (liveChannels.length > 1) {
          total = Object.values(avgs).reduce((s, v) => s + v, 0);
        } else {
          total = 0;
        }

        setAvgViewers(total > 0 ? roundUpClean(total) : null);
      } catch {
      }
    }
    fetchAvg();
    const interval = setInterval(fetchAvg, 60000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const entries = await Promise.all(
        VALORANK_CHANNELS.map(async (login) => {
          try {
            const res = await fetch(`/api/twitch/users?login=${encodeURIComponent(login)}`);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const user: TwitchUser = await res.json();
            return [login, user.profile_image_url] as const;
          } catch {
            return [login, DEFAULT_AVATAR] as const;
          }
        })
      );
      if (!cancelled) setAvatars(Object.fromEntries(entries));
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="px-6 py-14">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionTag className="mb-3">STREAMER_DEPLOYMENTS</SectionTag>
          <h2 className="mb-2 font-display text-3xl font-black text-white">
            Seen by{' '}
            <span className="text-gradient">{avgViewers != null ? avgViewers.toLocaleString() + '+' : '...'}</span> viewers{' '}
            <span className="text-ink">daily</span>
          </h2>
          <p className="mb-8 text-sm text-muted">
            Valorank powers rank overlays for these partnered streamers — give them a follow!
          </p>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALORANK_CHANNELS.map((login) => {
              const avatar = avatars[login] || DEFAULT_AVATAR;
              const status = statuses[login];
              const live = status?.live ?? false;
              return (
                <a
                  key={login}
                  href={`https://www.twitch.tv/${login}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'relative block overflow-hidden rounded-xl border bg-bg-card p-4 transition-all duration-300 hover:-translate-y-1',
                    live
                      ? 'border-accent-magenta/40 shadow-[0_0_25px_rgba(255,0,110,0.12)]'
                      : 'border-white/[0.06] hover:border-accent-purple/30 hover:shadow-[0_0_25px_rgba(168,85,247,0.1)]'
                  )}
                >
                  {live && (
                    <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-accent-magenta/10 blur-2xl" />
                  )}
                  <div className="relative flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={avatar}
                        alt={login}
                        className="h-12 w-12 rounded-lg object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
                        }}
                      />
                      <span
                        className={cn(
                          'absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-bg-card',
                          live ? 'bg-accent-magenta' : 'bg-slate-500'
                        )}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-display text-sm font-bold text-white">{login}</p>
                      <p className="flex items-center gap-1.5 text-[10px] font-mono text-muted">
                        {live ? (
                          <>
                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-magenta" />
                            LIVE · {status?.viewers?.toLocaleString() ?? '?'} viewers
                          </>
                        ) : (
                          <>Offline</>
                        )}
                      </p>
                      {status?.followers != null && (
                        <p className="mt-0.5 text-[10px] text-muted">
                          {status.followers.toLocaleString()} followers
                        </p>
                      )}
                    </div>
                    <ExternalLink size={14} className="shrink-0 text-muted" />
                  </div>
                </a>
              );
            })}
          </div>

          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {VALORANK_CHANNELS.map((login) => {
              const embed = VALORANK_EMBEDS[login];
              return (
                <div key={login} className="overflow-hidden rounded-xl border border-white/[0.06] bg-bg-card">
                  <iframe
                    src={embed}
                    title={`${login}'s Valorank overlay`}
                    className="h-36 w-full"
                    sandbox="allow-scripts allow-same-origin"
                    loading="lazy"
                  />
                </div>
              );
            })}
          </div>

          <div className="mb-10 rounded-xl border border-accent-purple/10 bg-accent-purple/[0.03] px-6 py-5 text-center">
            <p className="text-sm text-ink/90">
              I can make a <span className="font-bold text-white">custom overlay</span> based on your input — just shoot me a message below!
            </p>
          </div>

          <NeonCard glow="purple">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex-1">
                <h3 className="font-display text-lg font-bold text-white">
                  Want to have one on your stream?
                </h3>
                <p className="text-xs text-muted">
                  Let me know! Drop a message and I'll set you up with your own Valorank overlay.
                </p>
              </div>
              <a
                href="https://discord.com/users/852604404128940152"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-accent-purple/30 bg-accent-purple/10 px-5 py-2.5 text-sm font-bold text-accent-purple transition-colors hover:bg-accent-purple/20"
              >
                <MessageCircle size={18} /> Discord
              </a>
            </div>
          </NeonCard>
        </Reveal>
      </div>
    </section>
  );
}
