import { cn } from '@/lib/utils';

interface TerminalBadgeProps {
  children: React.ReactNode;
  className?: string;
  color?: 'cyan' | 'magenta' | 'purple' | 'lime';
}

export default function TerminalBadge({ children, className, color = 'cyan' }: TerminalBadgeProps) {
  const colorMap = {
    cyan: 'border-accent-cyan/30 text-accent-cyan bg-accent-cyan/10',
    magenta: 'border-accent-magenta/30 text-accent-magenta bg-accent-magenta/10',
    purple: 'border-accent-purple/30 text-accent-purple bg-accent-purple/10',
    lime: 'border-accent-lime/30 text-accent-lime bg-accent-lime/10',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded border px-2.5 py-1 font-mono text-xs font-medium',
        colorMap[color],
        className
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', color === 'cyan' && 'bg-accent-cyan', color === 'magenta' && 'bg-accent-magenta', color === 'purple' && 'bg-accent-purple', color === 'lime' && 'bg-accent-lime')} />
      {children}
    </span>
  );
}
