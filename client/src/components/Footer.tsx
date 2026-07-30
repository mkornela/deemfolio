import { ArrowUp } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer data-section="footer" className="border-t border-white/5 bg-bg-elevated">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-6">
        <p className="text-sm text-muted">© {year} deem & deemservices</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-muted transition-colors hover:bg-white/10 hover:text-white"
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      </div>
    </footer>
  );
}
