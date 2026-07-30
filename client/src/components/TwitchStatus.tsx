import { Users, Gamepad2, Heart } from 'lucide-react';
import { useTwitchStatus } from '@/hooks/useTwitch';
import { cn } from '@/lib/utils';

const DEFAULT_AVATAR = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebb84563-db81-4b1c-8012-27e1e8081e7a-profile_image-150x150.png';

export default function TwitchStatus({ channel }: { channel: string }) {
  const { status } = useTwitchStatus(channel, 20000);
  const avatar = status.user?.profile_image_url || DEFAULT_AVATAR;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card p-5">
      <div
        className={cn(
          'absolute inset-x-0 top-0 h-0.5 transition-colors',
          status.live ? 'bg-accent-magenta shadow-[0_0_10px_rgba(255,0,110,0.5)]' : 'bg-slate-700'
        )}
      />

      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src={avatar}
            alt={`${channel} avatar`}
            className="h-10 w-10 rounded-lg object-cover"
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = DEFAULT_AVATAR;
            }}
          />
          <div>
            <h3 className="font-display text-sm font-bold text-white">twitch_status</h3>
            <p className="text-[10px] font-mono text-muted">@{channel}</p>
          </div>
        </div>
        <span
          className={cn(
            'inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-[10px] font-bold uppercase',
            status.live
              ? 'border-accent-magenta/30 bg-accent-magenta/10 text-accent-magenta'
              : 'border-slate-600/30 bg-slate-600/10 text-slate-400'
          )}
        >
          {status.live && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-magenta" />}
          {status.live ? 'Live' : 'Offline'}
        </span>
      </div>

      {status.live && status.thumbnail ? (
        <div className="mb-4 overflow-hidden rounded-lg border border-white/[0.06]">
          <img
            src={status.thumbnail}
            alt={`${channel} stream thumbnail`}
            className="aspect-video w-full object-cover"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <p className="font-display text-base font-bold text-white">
          {status.live ? status.title || 'Live now' : 'Not currently streaming'}
        </p>
        {status.live && status.game && (
          <p className="flex items-center gap-2 text-xs text-muted">
            <Gamepad2 size={14} className="text-[#9146FF]" />
            {status.game}
          </p>
        )}
        <div className="mt-auto flex flex-wrap items-center gap-4 pt-2">
          {status.live && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Users size={14} className="text-[#9146FF]" />
              {status.viewers.toLocaleString()} viewers
            </p>
          )}
          {status.followers != null && (
            <p className="flex items-center gap-1.5 text-xs text-muted">
              <Heart size={14} className="text-[#9146FF]" />
              {status.followers.toLocaleString()} followers
            </p>
          )}
        </div>
      </div>

      <a
        href={`https://www.twitch.tv/${channel}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-4 block w-full rounded border border-[#9146FF]/30 bg-[#9146FF] py-2 text-center text-xs font-bold text-white transition-all hover:bg-[#7d3add] hover:shadow-[0_0_20px_rgba(145,70,255,0.3)]"
      >
        Watch on Twitch
      </a>
    </div>
  );
}
