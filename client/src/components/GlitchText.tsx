import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils';

interface GlitchTextProps {
  children: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'span' | 'p';
}

export default function GlitchText({ children, className, as: Tag = 'span' }: GlitchTextProps) {
  const reduced = useReducedMotion();

  return (
    <Tag className={cn('relative inline-block', className)}>
      <span className="relative z-10">{children}</span>
      {!reduced && (
        <>
          <span
            className="pointer-events-none absolute left-0 top-0 -z-10 w-full text-accent-magenta opacity-0"
            aria-hidden="true"
            style={{
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
              animation: 'glitch-clip 3.5s infinite steps(1)',
            }}
          >
            {children}
          </span>
          <span
            className="pointer-events-none absolute left-0 top-0 -z-10 w-full text-accent-cyan opacity-0"
            aria-hidden="true"
            style={{
              clipPath: 'polygon(0 55%, 100% 55%, 100% 100%, 0 100%)',
              animation: 'glitch-clip 3.5s infinite steps(1)',
              animationDelay: '0.15s',
            }}
          >
            {children}
          </span>
        </>
      )}
    </Tag>
  );
}
