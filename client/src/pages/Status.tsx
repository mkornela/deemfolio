import { Activity, Server, Globe, Clock, RefreshCw, Cpu, HardDrive } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import NeonCard from '@/components/NeonCard';
import { useStatus } from '@/hooks/useStatus';
import { cn } from '@/lib/utils';

function StatusDot({ up }: { up: boolean }) {
  return (
    <span
      className={cn(
        'h-2.5 w-2.5 rounded-full',
        up ? 'bg-accent-lime shadow-[0_0_8px_rgba(57,255,20,0.6)]' : 'bg-accent-magenta shadow-[0_0_8px_rgba(255,0,110,0.6)]'
      )}
    />
  );
}

function StatusBadge({ up }: { up: boolean }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase',
        up
          ? 'border-accent-lime/30 bg-accent-lime/10 text-accent-lime'
          : 'border-accent-magenta/30 bg-accent-magenta/10 text-accent-magenta'
      )}
    >
      <StatusDot up={up} />
      {up ? 'Operational' : 'Down'}
    </span>
  );
}

function formatTime(iso: string | null) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

function formatMs(ms: number | null) {
  if (ms == null) return '—';
  return `${ms}ms`;
}

function formatDuration(seconds: number | null | undefined) {
  if (seconds == null) return '—';
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  if (days > 0) return `${days}d ${hours}h ${mins}m`;
  if (hours > 0) return `${hours}h ${mins}m`;
  return `${mins}m`;
}

function ProgressBar({ percent, color = 'lime' }: { percent: number; color?: 'lime' | 'magenta' | 'cyan' | 'purple' }) {
  const safe = Math.max(0, Math.min(100, percent || 0));
  const colorClass =
    color === 'magenta' ? 'bg-accent-magenta' : color === 'cyan' ? 'bg-accent-cyan' : color === 'purple' ? 'bg-accent-purple' : 'bg-accent-lime';
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/10">
      <div className={cn('h-full transition-all', colorClass)} style={{ width: `${safe}%` }} />
    </div>
  );
}

export default function Status() {
  const { data, loading } = useStatus(30_000);
  const system = data.vps.data?.system;
  const pm2 = data.vps.data?.pm2;
  const hasPm2Data = Array.isArray(pm2);

  const vpsConfigured = data.vps.error !== 'Not configured';
  const hasApps = data.apps.length > 0;
  const hasAnyServices = hasApps || vpsConfigured;
  const allUp = data.apps.every((a) => a.up) && data.vps.up;

  return (
    <section data-section="status" className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-4xl">
        <Reveal>
          <SectionTag className="mb-3">SYSTEM_MONITOR</SectionTag>
          <div className="mb-3 flex flex-wrap items-center gap-3">
            <h1 className="font-display text-4xl font-black text-white sm:text-5xl">
              <span className="text-gradient">Status</span> Dashboard
            </h1>
            {!loading && <StatusBadge up={allUp} />}
          </div>
          <p className="mb-10 max-w-2xl text-sm text-muted">
            Live health checks for apps and VPS. Data is polled every ~30 seconds from the server.
          </p>
        </Reveal>

        <Reveal delay={0.05}>
          <div className="mb-6 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded border border-white/[0.06] bg-bg-card px-4 py-3">
              <Globe size={18} className="text-accent-cyan" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Services</p>
                <p className="text-lg font-bold text-white">{data.apps.length + (vpsConfigured ? 1 : 0)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border border-white/[0.06] bg-bg-card px-4 py-3">
              <Activity size={18} className={allUp ? 'text-accent-lime' : 'text-accent-magenta'} />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Operational</p>
                <p className="text-lg font-bold text-white">
                  {[...data.apps, data.vps].filter((s) => s.up).length}/{data.apps.length + (vpsConfigured ? 1 : 0)}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded border border-white/[0.06] bg-bg-card px-4 py-3">
              <Clock size={18} className="text-accent-purple" />
              <div>
                <p className="text-[10px] font-mono uppercase tracking-wider text-muted">Last Check</p>
                <p className="text-lg font-bold text-white">{formatTime(data.checkedAt)}</p>
              </div>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="mb-3 font-display text-lg font-bold text-white">Services</h2>
        </Reveal>

        {!hasAnyServices ? (
          <Reveal delay={0.15}>
            <NeonCard glow="purple">
              <div className="flex items-center gap-3">
                <RefreshCw size={18} className="text-accent-purple" />
                <div>
                  <h2 className="font-display text-base font-bold text-white">No services configured</h2>
                  <p className="text-xs text-muted">
                    Add <code className="rounded bg-white/5 px-1 py-0.5 text-accent-cyan">STATUS_APPS</code> and/or{' '}
                    <code className="rounded bg-white/5 px-1 py-0.5 text-accent-cyan">VPS_HEALTH_URL</code> to your{' '}
                    <code className="rounded bg-white/5 px-1 py-0.5 text-accent-cyan">.env</code>.
                  </p>
                </div>
              </div>
            </NeonCard>
          </Reveal>
        ) : (
          <div className="space-y-3">
            {data.apps.map((app, index) => (
              <Reveal key={app.id} delay={0.15 + index * 0.04}>
                <NeonCard glow={app.up ? 'lime' : 'magenta'}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'rounded border p-2.5',
                          app.up ? 'border-accent-lime/30 bg-accent-lime/10' : 'border-accent-magenta/30 bg-accent-magenta/10'
                        )}
                      >
                        <Globe size={20} className={app.up ? 'text-accent-lime' : 'text-accent-magenta'} />
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-white">{app.name}</p>
                        <p className="text-[10px] font-mono text-muted">{app.id}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge up={app.up} />
                      <div className="rounded border border-white/5 bg-white/[0.02] px-3 py-1.5 text-center">
                        <p className="text-[10px] text-muted">Response</p>
                        <p
                          className={cn(
                            'font-mono text-xs font-bold',
                            app.up ? 'text-accent-lime' : 'text-accent-magenta'
                          )}
                        >
                          {formatMs(app.responseTimeMs)}
                        </p>
                      </div>
                      <div className="rounded border border-white/5 bg-white/[0.02] px-3 py-1.5 text-center">
                        <p className="text-[10px] text-muted">HTTP</p>
                        <p className="font-mono text-xs font-bold text-white">{app.statusCode ?? '—'}</p>
                      </div>
                    </div>
                  </div>

                  {app.error && <p className="mt-3 text-xs text-accent-magenta">{app.error}</p>}
                </NeonCard>
              </Reveal>
            ))}

            {vpsConfigured && (
              <Reveal delay={0.15 + data.apps.length * 0.04}>
                <NeonCard glow={data.vps.up ? 'lime' : 'magenta'}>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'rounded border p-2.5',
                          data.vps.up ? 'border-accent-lime/30 bg-accent-lime/10' : 'border-accent-magenta/30 bg-accent-magenta/10'
                        )}
                      >
                        <Server size={20} className={data.vps.up ? 'text-accent-lime' : 'text-accent-magenta'} />
                      </div>
                      <div>
                        <p className="font-display text-base font-bold text-white">{data.vps.name}</p>
                        <p className="text-[10px] font-mono text-muted">
                          {system?.platform ?? 'VPS'} · {system?.arch ?? ''}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <StatusBadge up={data.vps.up} />
                      <div className="rounded border border-white/5 bg-white/[0.02] px-3 py-1.5 text-center">
                        <p className="text-[10px] text-muted">Response</p>
                        <p
                          className={cn(
                            'font-mono text-xs font-bold',
                            data.vps.up ? 'text-accent-lime' : 'text-accent-magenta'
                          )}
                        >
                          {formatMs(data.vps.responseTimeMs)}
                        </p>
                      </div>
                      <div className="rounded border border-white/5 bg-white/[0.02] px-3 py-1.5 text-center">
                        <p className="text-[10px] text-muted">Uptime</p>
                        <p className="font-mono text-xs font-bold text-white">{formatDuration(system?.uptimeSeconds)}</p>
                      </div>
                    </div>
                  </div>

                  {system && (
                    <div className="mt-5 grid gap-3 sm:grid-cols-3">
                      <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Cpu size={14} className="text-accent-cyan" />
                          <p className="text-[10px] font-bold uppercase text-muted">CPU</p>
                        </div>
                        <p className="font-display text-2xl font-bold text-white">{system.cpu?.usagePercent ?? '—'}%</p>
                        <p className="text-[10px] text-muted">{system.cpu?.count ?? '—'} cores</p>
                        <div className="mt-2">
                          <ProgressBar percent={system.cpu?.usagePercent ?? 0} color="cyan" />
                        </div>
                      </div>

                      <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <Server size={14} className="text-accent-purple" />
                          <p className="text-[10px] font-bold uppercase text-muted">RAM</p>
                        </div>
                        <p className="font-display text-2xl font-bold text-white">{system.memory?.usagePercent ?? '—'}%</p>
                        <p className="text-[10px] text-muted">
                          {system.memory?.usedGb ?? '—'} / {system.memory?.totalGb ?? '—'} GB
                        </p>
                        <div className="mt-2">
                          <ProgressBar percent={system.memory?.usagePercent ?? 0} color="purple" />
                        </div>
                      </div>

                      <div className="rounded border border-white/5 bg-white/[0.02] p-3">
                        <div className="mb-2 flex items-center gap-2">
                          <HardDrive size={14} className="text-accent-magenta" />
                          <p className="text-[10px] font-bold uppercase text-muted">Disk</p>
                        </div>
                        <p className="font-display text-2xl font-bold text-white">{system.disk?.usagePercent ?? '—'}%</p>
                        <p className="text-[10px] text-muted">
                          {system.disk?.usedGb ?? '—'} / {system.disk?.totalGb ?? '—'} GB
                        </p>
                        <div className="mt-2">
                          <ProgressBar percent={system.disk?.usagePercent ?? 0} color="magenta" />
                        </div>
                      </div>
                    </div>
                  )}

                  {data.vps.error && <p className="mt-3 text-xs text-accent-magenta">{data.vps.error}</p>}
                </NeonCard>
              </Reveal>
            )}
          </div>
        )}

        {hasPm2Data && (
          <>
            <Reveal delay={0.3}>
              <h2 className="mb-3 mt-10 font-display text-lg font-bold text-white">PM2 Processes</h2>
            </Reveal>
            <div className="space-y-2">
              {pm2.map((proc, index) => (
                <Reveal key={proc.name} delay={0.3 + index * 0.04}>
                  <div className="flex items-center gap-3 rounded border border-white/[0.06] bg-bg-card px-4 py-3 transition-colors hover:border-white/10">
                    <div
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded border',
                        proc.status === 'online'
                          ? 'border-accent-lime/30 bg-accent-lime/10'
                          : 'border-accent-magenta/30 bg-accent-magenta/10'
                      )}
                    >
                      <Activity size={18} className={proc.status === 'online' ? 'text-accent-lime' : 'text-accent-magenta'} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-display text-sm font-bold text-white">{proc.name}</p>
                      <p className="truncate text-[10px] font-mono text-muted">
                        pid {proc.pid ?? '—'} · uptime {formatDuration(proc.uptimeSeconds)}
                      </p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block sm:w-20">
                      <p className="text-[10px] text-muted">CPU</p>
                      <p className="font-mono text-xs font-bold text-white">{proc.cpuPercent ?? '—'}%</p>
                    </div>
                    <div className="hidden shrink-0 text-right sm:block sm:w-20">
                      <p className="text-[10px] text-muted">Memory</p>
                      <p className="font-mono text-xs font-bold text-white">{proc.memoryMb ? `${proc.memoryMb}MB` : '—'}</p>
                    </div>
                    <div className="shrink-0">
                      <StatusBadge up={proc.status === 'online'} />
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
