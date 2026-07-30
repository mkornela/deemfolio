import { useEffect, useState } from 'react';
import type { StatusData } from '@/types';

const DEFAULT_DATA: StatusData = {
  apps: [],
  vps: { up: false, host: '', port: 22, name: 'VPS', responseTimeMs: null, checkedAt: '', error: 'Not configured' },
  checkedAt: null,
};

export function useStatus(pollMs = 30_000) {
  const [data, setData] = useState<StatusData>(DEFAULT_DATA);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const res = await fetch('/api/status');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) {
          setData(json);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Failed to load status');
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    const id = setInterval(load, pollMs);
    const onVisible = () => { if (!document.hidden) load(); };
    document.addEventListener('visibilitychange', onVisible);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', onVisible);
    };
  }, [pollMs]);

  return { data, loading, error };
}
