import { cn } from '@/lib/utils';

export function SectionTag({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn('section-tag', className)}>{children}</span>;
}
