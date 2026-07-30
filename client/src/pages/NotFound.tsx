import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import GlitchText from '@/components/GlitchText';

export default function NotFound() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="mb-4 font-mono text-7xl font-black text-accent-cyan glow-text">404</p>
      <h1 className="mb-3 font-display text-3xl font-black text-white">
        <GlitchText as="span">Page not found</GlitchText>
      </h1>
      <p className="mb-8 text-sm text-muted">The route you requested does not exist in this system.</p>
      <Link to="/" className="btn-primary">
        <Home size={16} /> cd /
      </Link>
    </section>
  );
}
