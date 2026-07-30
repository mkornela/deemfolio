import { Radio, Tv, Heart, Gamepad2 } from 'lucide-react';
import { Reveal } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import DiscordPresence from '@/components/DiscordPresence';
import { DISCORD_USER_ID } from '@/config/env';
import TwitchStatus from '@/components/TwitchStatus';
import ModeratedChannels from '@/components/ModeratedChannel';
import NeonCard from '@/components/NeonCard';

export default function Entertainment() {
  return (
    <section data-section="entertainment" className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <SectionTag className="mb-3">LIVE_DASHBOARD</SectionTag>
          <h1 className="mb-3 font-display text-4xl font-black text-white sm:text-5xl">
            Live <span className="text-gradient">Dashboard</span>
          </h1>
          <p className="mb-12 max-w-2xl text-sm text-muted">
            Discord presence, Twitch stream status, and moderated channels. Updates automatically via WebSocket and server-side Twitch proxy.
          </p>
        </Reveal>

        <div className="grid items-start gap-4 lg:grid-cols-2">
          <Reveal>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded border border-[#5865F2]/30 bg-[#5865F2]/20 p-1.5">
                <Gamepad2 className="text-[#5865F2]" size={16} />
              </div>
              <h2 className="font-display text-lg font-bold text-white">Discord Presence</h2>
            </div>
            <p className="mb-3 text-xs text-muted">Live presence via Lanyard. REST fallback upgrades to WebSocket.</p>
            <DiscordPresence userId={DISCORD_USER_ID} />
          </Reveal>

          <Reveal delay={0.1}>
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded border border-[#9146FF]/30 bg-[#9146FF]/20 p-1.5">
                <Tv className="text-[#9146FF]" size={16} />
              </div>
              <h2 className="font-display text-lg font-bold text-white">Twitch Stream</h2>
            </div>
            <p className="mb-3 text-xs text-muted">My channel status, proxied through the Express server.</p>
            <TwitchStatus channel="9deem" />
          </Reveal>
        </div>

        <Reveal delay={0.2}>
          <div className="mt-12">
            <div className="mb-2 flex items-center gap-2">
              <div className="rounded border border-accent-magenta/30 bg-accent-magenta/10 p-1.5">
                <Radio className="text-accent-magenta" size={16} />
              </div>
              <h2 className="font-display text-lg font-bold text-white">Where I Moderate</h2>
            </div>
            <p className="mb-4 text-xs text-muted">Channels I mod on Twitch. Status updates every ~20 seconds.</p>
            <ModeratedChannels />
          </div>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-8">
            <NeonCard glow="magenta">
              <div className="flex items-center gap-3">
                <Heart className="text-accent-magenta" size={18} />
                <h3 className="font-display text-lg font-bold text-white">Offline too</h3>
              </div>
              <p className="mt-2 text-xs text-muted">
                When I'm not building systems or streaming tools, I'm usually gaming, watching CS2/Valorant tournaments, or testing new overlay ideas.
              </p>
            </NeonCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
