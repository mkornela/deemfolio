import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Linkedin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

const links = [
  { to: '/', label: 'Home' },
  { to: '/projects', label: 'Projects' },
  { to: '/experience', label: 'Experience' },
  { to: '/entertainment', label: 'Entertainment' },
  { to: '/status', label: 'Status' },
  { to: '/contact', label: 'Contact' },
];

function NavLink({ to, label, active }: { to: string; label: string; active: boolean }) {
  return (
    <Link
      to={to}
      className={cn(
        'group relative px-1 py-2 text-sm font-medium transition-colors',
        active ? 'text-white' : 'text-muted hover:text-white'
      )}
    >
      <span className="relative z-10">{label}</span>
      {active && (
        <motion.span
          layoutId="nav-glow"
          className="absolute inset-0 -z-10 rounded-md bg-accent-cyan/10 shadow-[0_0_20px_rgba(0,240,255,0.25)]"
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        />
      )}
      <span className="absolute -bottom-0.5 left-1/2 h-[2px] w-0 -translate-x-1/2 rounded-full bg-accent-cyan shadow-[0_0_10px_rgba(0,240,255,0.6)] transition-all duration-300 group-hover:w-4/5" />
    </Link>
  );
}

function MagneticButton({
  children,
  className,
  href,
  onClick,
  external = false,
}: {
  children: React.ReactNode;
  className?: string;
  href?: string;
  onClick?: () => void;
  external?: boolean;
}) {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) * 0.2;
    const y = (e.clientY - rect.top - rect.height / 2) * 0.2;
    setPosition({ x, y });
  };

  const handleMouseLeave = () => setPosition({ x: 0, y: 0 });

  const props = {
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    className: cn('relative inline-block overflow-hidden rounded', className),
    style: { transform: `translate(${position.x}px, ${position.y}px)` },
  };

  const inner = (
    <>
      <span className="relative z-10 flex items-center gap-2">{children}</span>
      <motion.span
        className="absolute inset-0 -z-0 rounded bg-white/10"
        initial={{ scale: 0, opacity: 0 }}
        whileHover={{ scale: 1.5, opacity: 1 }}
        transition={{ duration: 0.4 }}
        style={{ borderRadius: 'inherit' }}
      />
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noopener noreferrer' : undefined}
        {...props}
      >
        {inner}
      </a>
    );
  }

  return (
    <button onClick={onClick} {...props}>
      {inner}
    </button>
  );
}

export default function Navigation() {
  const { pathname } = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 60);
      if (y > 80 && y > last) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <motion.nav
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled ? 'py-3' : 'py-5'
        )}
        initial={false}
        animate={{ y: hidden && !mobileOpen ? -100 : 0 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        <div
          className={cn(
            'mx-auto max-w-7xl border px-6 transition-all duration-300',
            scrolled
              ? 'rounded-xl border-white/10 bg-bg/80 backdrop-blur-xl shadow-[0_0_40px_rgba(0,240,255,0.08)]'
              : 'border-transparent bg-transparent'
          )}
        >
          <div className="flex h-14 items-center justify-between">
            <Link to="/" className="group flex items-center gap-2">
              <div className="relative flex h-9 w-9 items-center justify-center rounded border border-accent-cyan/30 bg-accent-cyan/10 transition-all group-hover:border-accent-cyan group-hover:shadow-[0_0_20px_rgba(0,240,255,0.4)]">
                <span className="font-mono text-xs font-black text-accent-cyan">&gt;_</span>
              </div>
              <span className="font-display text-lg font-bold tracking-tight">
                <span className="text-accent-cyan transition-colors group-hover:text-white">DE</span>
                <span className="text-accent-magenta transition-colors group-hover:text-white">EM</span>
              </span>
              <span className="h-4 w-px animate-pulse bg-accent-cyan/50" />
            </Link>

            <ul className="hidden items-center gap-1 md:flex">
              {links.map((link) => {
                const active =
                  link.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.to);
                return (
                  <li key={link.to}>
                    <NavLink to={link.to} label={link.label} active={active} />
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:block">
              <MagneticButton
                href="https://www.linkedin.com/in/mkornela/"
                external
                className="inline-flex items-center gap-2 rounded-lg border border-accent-cyan/30 bg-accent-cyan/10 px-4 py-2 text-xs font-bold text-accent-cyan transition-all hover:border-accent-cyan hover:bg-accent-cyan/20 hover:text-white hover:shadow-[0_0_25px_rgba(0,240,255,0.35)]"
              >
                <Linkedin size={14} />
                LinkedIn
              </MagneticButton>
            </div>

            <MagneticButton
              onClick={() => setMobileOpen((o) => !o)}
              className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-ink transition-colors hover:border-accent-cyan/30 hover:text-accent-cyan md:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </MagneticButton>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col items-center justify-center bg-bg/98 backdrop-blur-xl md:hidden"
            initial={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            animate={{ opacity: 1, clipPath: 'circle(150% at top right)' }}
            exit={{ opacity: 0, clipPath: 'circle(0% at top right)' }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="absolute inset-0 bg-grid-pattern opacity-20" />
            <ul className="relative flex flex-col items-center gap-8">
              {links.map((link, i) => {
                const active =
                  link.to === '/'
                    ? pathname === '/'
                    : pathname.startsWith(link.to);
                return (
                  <motion.li
                    key={link.to}
                    initial={{ opacity: 0, x: 40 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -40 }}
                    transition={{ delay: i * 0.05, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    <Link
                      to={link.to}
                      className={cn(
                        'font-display text-2xl font-semibold transition-colors',
                        active ? 'text-accent-cyan' : 'text-muted hover:text-white'
                      )}
                    >
                      {link.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
