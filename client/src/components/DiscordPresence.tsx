import { useEffect, useState } from 'react';
import { Music, MessageCircle } from 'lucide-react';
import { useLanyard } from '@/hooks/useLanyard';
import { cn } from '@/lib/utils';

const statusColors: Record<string, string> = {
  online: 'bg-accent-lime',
  idle: 'bg-yellow-400',
  dnd: 'bg-accent-magenta',
  offline: 'bg-slate-500',
};

const statusLabels: Record<string, string> = {
  online: 'Online',
  idle: 'Idle',
  dnd: 'Do Not Disturb',
  offline: 'Offline',
};

function SpotifyProgress({ start, end }: { start: number; end: number }) {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    function update() {
      const now = Date.now();
      const total = end - start;
      const elapsed = now - start;
      setPct(Math.min(100, Math.max(0, (elapsed / total) * 100)));
    }
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, [start, end]);

  return (
    <div className="h-1 w-full overflow-hidden rounded-full bg-white/10">
      <div
        className="h-full rounded-full bg-accent-lime transition-all duration-1000 ease-linear"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

export default function DiscordPresence({ userId, className }: { userId?: string; className?: string }) {
  const { connected, avatar, status, activityText, spotify, username } = useLanyard(userId);

  return (
    <div className={cn('relative overflow-hidden rounded-2xl border border-[#5865F2]/20 bg-[#13131f] p-4', className)}>
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[#5865F2]/20 blur-3xl" />

      <div className="relative mb-3 flex items-center gap-2">
        <div className="rounded border border-[#5865F2]/30 bg-[#5865F2]/20 p-1.5">
          <MessageCircle className="text-[#5865F2]" size={16} />
        </div>
        <div className="flex-1">
          <h3 className="font-display text-sm font-bold text-white">discord_uplink</h3>
          <p className="text-[10px] font-mono text-muted">{connected ? 'WebSocket connected' : 'Connecting...'}</p>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-bold',
            status === 'online'
              ? 'border-accent-lime/30 bg-accent-lime/10 text-accent-lime'
              : status === 'idle'
              ? 'border-yellow-400/30 bg-yellow-400/10 text-yellow-400'
              : status === 'dnd'
              ? 'border-accent-magenta/30 bg-accent-magenta/10 text-accent-magenta'
              : 'border-slate-500/30 bg-slate-500/10 text-slate-400'
          )}
        >
          <span className={cn('h-1.5 w-1.5 rounded-full', statusColors[status] || 'bg-slate-500')} />
          {statusLabels[status] || status}
        </span>
      </div>

      <div className="relative">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'}
              alt={username}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <span
              className={cn(
                'absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 rounded-full border-2 border-[#13131f]',
                statusColors[status] || 'bg-slate-500'
              )}
            />
          </div>
          <div className="min-w-0">
            <p className="truncate font-display text-base font-bold text-white">{username || 'deem'}</p>
            <p className="truncate text-xs text-muted">{activityText || 'Online'}</p>
          </div>
        </div>

        {spotify && (
          <div className="mt-3 rounded-lg border border-white/5 bg-black/20 p-2.5">
            <div className="mb-2 flex items-center gap-2">
              <img
                src={spotify.album_art_url}
                alt={spotify.song}
                className="h-9 w-9 rounded-md object-cover"
              />
              <div className="min-w-0">
                <p className="flex items-center gap-1 truncate text-xs font-semibold text-white">
                  <Music size={12} className="text-accent-lime" />
                  {spotify.song}
                </p>
                <p className="truncate text-[10px] text-muted">{spotify.artist}</p>
              </div>
            </div>
            <SpotifyProgress start={spotify.timestamps.start} end={spotify.timestamps.end} />
          </div>
        )}
      </div>

      <a
        href={`https://discord.com/users/${userId || '852604404128940152'}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex items-center justify-center gap-2 rounded border border-[#5865F2]/30 bg-[#5865F2] py-2 text-xs font-bold text-white transition-all hover:bg-[#4752C4] hover:shadow-[0_0_20px_rgba(88,101,242,0.3)]"
      >
        Init Message <span aria-hidden="true">→</span>
      </a>
    </div>
  );
}
