import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import NeonCard from '@/components/NeonCard';
import { socials } from '@/data/socials';
import { Linkedin, Github, Twitch, Youtube, MessageCircle, Gamepad2, MapPin, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, React.ElementType> = {
  LinkedIn: Linkedin,
  GitHub: Github,
  Steam: Gamepad2,
  Twitch: Twitch,
  YouTube: Youtube,
  Discord: MessageCircle,
};

const colors: Record<string, string> = {
  LinkedIn: 'border-[#0A66C2]/30 bg-[#0A66C2]/10 text-[#0A66C2]',
  GitHub: 'border-white/20 bg-white/10 text-white',
  Steam: 'border-[#1b2838]/30 bg-[#1b2838]/30 text-[#66c0f4]',
  Twitch: 'border-[#9146FF]/30 bg-[#9146FF]/10 text-[#9146FF]',
  YouTube: 'border-[#FF0000]/30 bg-[#FF0000]/10 text-[#FF0000]',
  Discord: 'border-[#5865F2]/30 bg-[#5865F2]/10 text-[#5865F2]',
};

export default function Contact() {
  return (
    <section data-section="contact" className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionTag className="mb-3">READY_TO_CONNECT</SectionTag>
          <h1 className="mb-3 font-display text-4xl font-black text-white sm:text-5xl">
            Initialize <span className="text-gradient">New Project?</span>
          </h1>
          <p className="mb-10 max-w-2xl text-sm text-muted">
            Looking to collaborate on real-time tooling, system workflows, or high-performance APIs. Reach out on any of these platforms.
          </p>
        </Reveal>

        <Stagger className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-3" staggerDelay={0.08}>
          {socials.map((social) => {
            const Icon = iconMap[social.name] || MessageCircle;
            return (
              <StaggerItem key={social.name} className="h-full">
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex h-full items-center gap-4 rounded-xl border border-white/[0.06] bg-bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-cyan/30"
                >
                  <div className={cn('rounded border p-2.5 transition-all group-hover:shadow-[0_0_15px_rgba(0,240,255,0.15)]', colors[social.name] || 'border-white/10 bg-white/5 text-muted')}>
                    <Icon size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-display text-sm font-bold text-white">{social.name}</p>
                    <p className="truncate text-xs text-muted">{social.handle}</p>
                  </div>
                  <ArrowUpRight size={16} className="text-muted transition-colors group-hover:text-accent-cyan" />
                </a>
              </StaggerItem>
            );
          })}
        </Stagger>

        <Reveal delay={0.2}>
          <div className="mt-8">
            <NeonCard glow="cyan">
              <div className="flex items-center gap-3 text-muted">
                <MapPin size={18} className="text-accent-cyan" />
                <span className="text-sm">Gliwice, Woj. Śląskie, Poland</span>
              </div>
            </NeonCard>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

