import { useRef } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Project } from '@/types';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const MotionLink = motion(Link);

export default function ProjectCard({ project }: { project: Project }) {
  const reduced = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 180, damping: 18 });
  const springY = useSpring(y, { stiffness: 180, damping: 18 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [8, -8]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-8, 8]);

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (reduced || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <MotionLink
      ref={cardRef}
      to={`/projects/${project.slug}`}
      className="group relative block h-full rounded-2xl focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-cyan/50"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000 }}
    >
      <div
        className="relative flex h-full flex-col overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card p-6 transition-all duration-300"
        style={{ '--accent': project.accent } as React.CSSProperties}
      >
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${project.accent}12, transparent 60%)`,
          }}
        />
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background: `linear-gradient(135deg, ${project.accent}80, transparent 60%)`,
            WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            maskComposite: 'exclude',
          }}
        />

        <div className="relative flex flex-1 flex-col">
          <div className="mb-4 flex items-center justify-between">
            <span className="text-xs font-mono text-muted">{project.tagline}</span>
          </div>

          <h3 className="mb-2 font-display text-2xl font-bold text-white">
            {project.brand ? (
              project.brand.map((part, i) => (
                <span key={i} style={part.accent ? { color: '#ff3333' } : { color: '#ffffff' }}>
                  {part.text}
                </span>
              ))
            ) : (
              project.name
            )}
            {project.version && <span className="ml-2 text-lg text-muted">{project.version}</span>}
          </h3>

          <p className="mb-4 text-sm leading-relaxed text-muted">{project.description}</p>

          <ul className="mb-4 space-y-1.5">
            {project.features.slice(0, 3).map((f, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink/80">
                <span style={{ color: project.accent }}>›</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>

          <div className="mb-4 mt-auto flex flex-wrap gap-2">
            {project.tech.slice(0, 5).map((t) => (
              <span key={t} className="chip">
                {t}
              </span>
            ))}
            {project.tech.length > 5 && (
              <span className="chip">+{project.tech.length - 5}</span>
            )}
          </div>

          <div className="border-t border-white/5 pt-4">
            {project.progress !== undefined && (
              <div className="mb-3">
                <div className="mb-1 flex items-center justify-between text-[10px] font-mono">
                  <span className="text-muted">PROGRESS</span>
                  <span className="font-bold text-white">{project.progress}%</span>
                </div>
                <div className="h-1.5 w-full overflow-hidden rounded-full border border-white/[0.06] bg-white/[0.04]">
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
            <div className="flex items-center justify-between">
              <span
                className="rounded border px-2 py-0.5 text-[10px] font-semibold"
                style={{
                  background: `${project.accent}12`,
                  color: project.accent,
                  borderColor: `${project.accent}30`,
                }}
              >
                {project.status}
              </span>
              <span className="flex items-center gap-1 text-xs font-bold transition-colors" style={{ color: project.accent }}>
                Open <ArrowUpRight size={14} />
              </span>
            </div>
          </div>
        </div>
      </div>
    </MotionLink>
  );
}
