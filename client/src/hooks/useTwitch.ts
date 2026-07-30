import { useEffect, useState } from 'react';
import type { TwitchStatus } from '@/types';

export function useTwitchStatus(channel: string, pollMs = 20000) {
  const [status, setStatus] = useState<TwitchStatus>({
    live: false,
    channel,
    title: null,
    game: null,
    viewers: 0,
    thumbnail: null,
    started_at: null,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchStatus() {
      try {
        const res = await fetch(`/api/twitch/status?channel=${encodeURIComponent(channel)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setStatus(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchStatus();
    const id = setInterval(fetchStatus, pollMs);

    const visibility = () => {
      if (!document.hidden) fetchStatus();
    };
    document.addEventListener('visibilitychange', visibility);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [channel, pollMs]);

  return { status, loading, error };
}

export function useTwitchBatchStatus(channels: string[], pollMs = 20000) {
  const [statuses, setStatuses] = useState<Record<string, TwitchStatus>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchBatch() {
      if (channels.length === 0) return;
      try {
        const list = channels.join(',');
        const res = await fetch(`/api/twitch/status/batch?channels=${encodeURIComponent(list)}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setStatuses(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Unknown error');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchBatch();
    const id = setInterval(fetchBatch, pollMs);

    const visibility = () => {
      if (!document.hidden) fetchBatch();
    };
    document.addEventListener('visibilitychange', visibility);

    return () => {
      cancelled = true;
      clearInterval(id);
      document.removeEventListener('visibilitychange', visibility);
    };
  }, [channels.join(','), pollMs]);

  return { statuses, loading, error };
}
