import { useRef, type ReactNode } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface NeonCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number;
  glow?: 'cyan' | 'magenta' | 'purple' | 'lime' | 'none';
  border?: boolean;
}

export default function NeonCard({
  children,
  className,
  intensity = 10,
  glow = 'cyan',
  border = true,
}: NeonCardProps) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 200, damping: 20 });
  const springY = useSpring(y, { stiffness: 200, damping: 20 });
  const rotateX = useTransform(springY, [-0.5, 0.5], [intensity, -intensity]);
  const rotateY = useTransform(springX, [-0.5, 0.5], [-intensity, intensity]);

  const handleMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reduced || !ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  const glowClass =
    glow === 'cyan'
      ? 'shadow-[0_0_30px_rgba(0,240,255,0.12)]'
      : glow === 'magenta'
      ? 'shadow-[0_0_30px_rgba(255,0,110,0.12)]'
      : glow === 'purple'
      ? 'shadow-[0_0_30px_rgba(168,85,247,0.12)]'
      : glow === 'lime'
      ? 'shadow-[0_0_30px_rgba(57,255,20,0.12)]'
      : '';

  return (
    <motion.div
      ref={ref}
      className={cn('relative h-full', className)}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={reduced ? undefined : { rotateX, rotateY, transformPerspective: 1000, transformStyle: 'preserve-3d' }}
    >
      {border && (
        <div
          className={cn(
            'pointer-events-none absolute -inset-px rounded-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100',
            glow === 'cyan' && 'bg-gradient-to-br from-accent-cyan/40 via-transparent to-accent-purple/40',
            glow === 'magenta' && 'bg-gradient-to-br from-accent-magenta/40 via-transparent to-accent-purple/40',
            glow === 'purple' && 'bg-gradient-to-br from-accent-purple/40 via-transparent to-accent-cyan/40',
            glow === 'lime' && 'bg-gradient-to-br from-accent-lime/40 via-transparent to-accent-cyan/40'
          )}
          style={{ filter: 'blur(8px)' }}
        />
      )}
      <div
        className={cn(
          'relative h-full overflow-hidden rounded-2xl border border-white/[0.06] bg-bg-card/90 backdrop-blur-sm transition-all duration-300',
          glowClass,
          className
        )}
      >
        {border && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl p-px opacity-60 transition-opacity duration-300 group-hover:opacity-100"
            style={{
              background: 'linear-gradient(135deg, rgba(0,240,255,0.4), rgba(255,0,110,0.25), rgba(168,85,247,0.35))',
              WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
              WebkitMaskComposite: 'xor',
              maskComposite: 'exclude',
            }}
          />
        )}
        <div className="relative h-full p-6">{children}</div>
      </div>
    </motion.div>
  );
}
