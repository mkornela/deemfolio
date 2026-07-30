import { useEffect, useState } from 'react';
import { Radio, ExternalLink } from 'lucide-react';
import { useTwitchBatchStatus } from '@/hooks/useTwitch';
import { cn } from '@/lib/utils';
import type { TwitchUser } from '@/types';

const channels = ['szzalony', 'imow', 'hossyfps', 'shainersxd'];

const DEFAULT_AVATAR = 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebb84563-db81-4b1c-8012-27e1e8081e7a-profile_image-150x150.png';

function useTwitchAvatars(logins: string[]) {
  const [avatars, setAvatars] = useState<Record<string, string>>({});

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const entries = await Promise.all(
        logins.map(async (login) => {
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
  }, [logins.join(',')]);

  return avatars;
}

export default function ModeratedChannels() {
  const { statuses } = useTwitchBatchStatus(channels, 20000);
  const avatars = useTwitchAvatars(channels);

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {channels.map((login) => {
        const status = statuses[login];
        const live = status?.live ?? false;
        const avatar = avatars[login] || DEFAULT_AVATAR;
        return (
          <div
            key={login}
            className={cn(
              'relative overflow-hidden rounded-xl border bg-bg-card p-4 transition-all duration-300 hover:-translate-y-1',
              live ? 'border-accent-magenta/30 shadow-[0_0_20px_rgba(255,0,110,0.1)]' : 'border-white/[0.06]'
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
                      LIVE · {status.viewers.toLocaleString()} viewers
                    </>
                  ) : (
                    <>
                      <Radio size={12} />
                      Offline
                    </>
                  )}
                </p>
                {status?.followers != null && (
                  <p className="mt-0.5 text-[10px] text-muted">
                    {status.followers.toLocaleString()} followers
                  </p>
                )}
              </div>
              <a
                href={`https://www.twitch.tv/${login}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded border border-white/10 bg-white/5 p-1.5 text-muted transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan"
                aria-label={`Watch ${login} on Twitch`}
              >
                <ExternalLink size={14} />
              </a>
            </div>
            {live && status.title && (
              <p className="relative mt-2 truncate text-xs text-muted">{status.title}</p>
            )}
          </div>
        );
      })}
    </div>
  );
}
