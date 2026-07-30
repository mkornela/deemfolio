import { cn } from '@/lib/utils';

interface SkillGroupProps {
  title: string;
  skills: string[];
  className?: string;
  accent?: 'cyan' | 'magenta' | 'purple' | 'lime';
}

export default function SkillGroup({ title, skills, className, accent = 'cyan' }: SkillGroupProps) {
  const accentColor = {
    cyan: 'text-accent-cyan border-accent-cyan/20 bg-accent-cyan/5',
    magenta: 'text-accent-magenta border-accent-magenta/20 bg-accent-magenta/5',
    purple: 'text-accent-purple border-accent-purple/20 bg-accent-purple/5',
    lime: 'text-accent-lime border-accent-lime/20 bg-accent-lime/5',
  };

  return (
    <div className={cn('h-full', className)}>
      <div className="mb-4 flex items-center gap-3">
        <span className={cn('h-2 w-2 rounded-full shadow-[0_0_8px_currentColor]', accent === 'cyan' && 'bg-accent-cyan', accent === 'magenta' && 'bg-accent-magenta', accent === 'purple' && 'bg-accent-purple', accent === 'lime' && 'bg-accent-lime')} />
        <h3 className="font-display text-lg font-semibold text-white">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span key={skill} className={cn('rounded border px-2.5 py-1 text-xs font-mono transition-colors hover:border-white/20', accentColor[accent])}>
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}
