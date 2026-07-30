import { Reveal, Stagger, StaggerItem } from '@/components/Reveal';
import { SectionTag } from '@/components/SectionTag';
import NeonCard from '@/components/NeonCard';
import { experience, certifications } from '@/data/experience';
import { cn } from '@/lib/utils';

export default function Experience() {
  return (
    <section data-section="experience" className="min-h-screen px-6 pt-32 pb-24">
      <div className="mx-auto max-w-5xl">
        <Reveal>
          <SectionTag className="mb-3">LOG_HISTORY</SectionTag>
          <h1 className="mb-3 font-display text-4xl font-black text-white sm:text-5xl">
            Career <span className="text-gradient">Trace</span>
          </h1>
          <p className="mb-14 max-w-2xl text-sm text-muted">
            From enterprise network operations to application engineering, with a parallel focus on Node.js backend and streaming tooling.
          </p>
        </Reveal>

        <div className="relative mb-20">
          <div className="absolute left-3 top-0 bottom-0 w-px bg-gradient-to-b from-accent-cyan/50 via-accent-purple/30 to-transparent md:left-1/2 md:-translate-x-1/2" />
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 0.1}>
              <div data-section={`experience_${job.id}`} className={cn('relative mb-12 md:flex md:items-start', i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse')}>
                <div className="hidden md:block md:w-1/2" />
                <div className="absolute left-3 top-1 z-10 h-3 w-3 -translate-x-1/2 rounded-full border border-bg bg-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)] md:left-1/2" />
                <div className={cn('pl-10 md:w-1/2', i % 2 === 0 ? 'md:pr-10 md:pl-0 md:text-right' : 'md:pl-10')}>
                  <div className={cn('mb-3 flex flex-wrap items-center gap-2 text-[10px] font-mono uppercase tracking-wider text-muted', i % 2 === 0 ? 'md:justify-end' : '')}>
                    <span className="rounded border border-white/10 bg-white/5 px-2 py-1">{job.date}</span>
                    <span>{job.type}</span>
                    <span>·</span>
                    <span>{job.location}</span>
                  </div>
                  <NeonCard glow={i === 0 ? 'cyan' : 'purple'}>
                    <h2 className="mb-1 font-display text-xl font-bold text-white">{job.role}</h2>
                    <p className="mb-3 text-xs font-bold text-accent-cyan">{job.company}</p>
                    <p className="mb-3 text-sm leading-relaxed text-muted">{job.description}</p>
                    <ul className={cn('space-y-2 text-sm text-ink/80', i % 2 === 0 ? 'md:ml-auto' : '')}>
                      {job.bullets.map((b, idx) => (
                        <li key={idx} className="flex gap-2">
                          <span className="text-accent-cyan">›</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </NeonCard>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div data-section="certs">
          <Reveal>
            <SectionTag className="mb-3">VERIFIED_CREDENTIALS</SectionTag>
            <h2 className="mb-6 font-display text-3xl font-black text-white">
              <span className="text-gradient">Certifications</span>
            </h2>
          </Reveal>

          <Stagger className="grid auto-rows-fr gap-3 sm:grid-cols-2 lg:grid-cols-4" staggerDelay={0.05}>
            {certifications.map((cert, i) => {
              const colors = ['cyan', 'magenta', 'purple', 'lime'] as const;
              return (
                <StaggerItem key={cert.name} className="h-full">
                  <NeonCard glow={colors[i % 4]} className="h-full">
                    <p className="text-sm font-bold text-white">{cert.name}</p>
                    <p className="mt-2 text-[10px] font-mono text-muted">{cert.year}</p>
                  </NeonCard>
                </StaggerItem>
              );
            })}
          </Stagger>
        </div>
      </div>
    </section>
  );
}
