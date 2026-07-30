import { useEffect, useRef, useState } from 'react';
import type { LanyardData } from '@/types';

const DEFAULT_ID = '852604404128940152';

function getAvatarUrl(user: LanyardData['discord_user']) {
  if (user.avatar) {
    const fmt = user.avatar.startsWith('a_') ? 'gif' : 'png';
    return `https://cdn.discordapp.com/avatars/${user.id}/${user.avatar}.${fmt}?size=128`;
  }
  const disc = Number(user.discriminator || 0) % 5;
  return `https://cdn.discordapp.com/embed/avatars/${disc}.png`;
}

export function useLanyard(userId?: string) {
  const id = userId || DEFAULT_ID;
  const [data, setData] = useState<LanyardData | null>(null);
  const [connected, setConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasDataRef = useRef(false);

  useEffect(() => {
    let cancelled = false;

    function cleanup() {
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
        reconnectRef.current = null;
      }
      if (heartbeatRef.current) {
        clearInterval(heartbeatRef.current);
        heartbeatRef.current = null;
      }
    }

    function connect() {
      cleanup();
      if (cancelled) return;

      const ws = new WebSocket(`wss://api.lanyard.rest/socket`);
      wsRef.current = ws;

      ws.onopen = () => {
        setConnected(true);
        ws.send(JSON.stringify({ op: 2, d: { subscribe_to_id: id } }));
      };

      ws.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.op === 1 && payload.d?.heartbeat_interval) {
            if (heartbeatRef.current) clearInterval(heartbeatRef.current);
            heartbeatRef.current = setInterval(() => {
              if (ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({ op: 3 }));
              }
            }, payload.d.heartbeat_interval);
          }
          if (payload.t === 'INIT_STATE' || payload.t === 'PRESENCE_UPDATE') {
            setData(payload.d);
            hasDataRef.current = true;
          }
        } catch {
        }
      };

      ws.onclose = () => {
        setConnected(false);
        if (!cancelled) {
          reconnectRef.current = setTimeout(connect, 15000);
        }
      };

      ws.onerror = () => {
        ws.close();
      };
    }

    fetch(`https://api.lanyard.rest/v1/users/${id}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((j) => {
        if (j && j.data && !hasDataRef.current) {
          setData(j.data);
          hasDataRef.current = true;
        }
      })
      .catch(() => {})
      .finally(() => {
        connect();
      });

    const visibility = () => {
      if (!document.hidden && (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN)) {
        connect();
      }
    };
    document.addEventListener('visibilitychange', visibility);

    return () => {
      cancelled = true;
      document.removeEventListener('visibilitychange', visibility);
      cleanup();
    };
  }, [id]);

  const avatar = data ? getAvatarUrl(data.discord_user) : '';
  const status = data?.discord_status || 'offline';
  const activity = data?.activities?.[0];
  const activityText = activity
    ? `${activity.emoji ? activity.emoji.name + ' ' : ''}${activity.state || activity.details || activity.name || ''}`
    : status === 'offline'
    ? 'Offline'
    : 'Online';

  return {
    data,
    connected,
    avatar,
    status,
    activityText,
    spotify: data?.spotify || null,
    username: data?.discord_user?.global_name || data?.discord_user?.username || 'Michał',
  };
}
