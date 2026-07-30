import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type LogEntry = {
  id: number;
  prefix: string;
  text: string;
  color: string;
};

const COLORS = {
  cyan: 'text-accent-cyan',
  lime: 'text-accent-lime',
  purple: 'text-accent-purple',
  yellow: 'text-yellow-300',
  magenta: 'text-accent-magenta',
};

const templates: { prefix: string; color: string; messages: string[] }[] = [
  { prefix: 'SYS', color: COLORS.cyan, messages: ['heartbeat OK', 'memory stable', 'all systems nominal', 'cycle complete'] },
  { prefix: 'API', color: COLORS.lime, messages: ['200 /api/health', '200 /api/status', 'serving assets', 'route cache hit'] },
  { prefix: 'DISC', color: COLORS.purple, messages: ['presence synced', 'status: online', 'connection alive', 'activity updated'] },
  { prefix: 'NET', color: COLORS.yellow, messages: ['connection stable', 'latency 14ms', 'no packet loss', 'IPv6 tunnel OK'] },
  { prefix: 'AUTH', color: COLORS.magenta, messages: ['session ok', 'permissions cached', 'access granted', 'identity verified'] },
];

let nextId = 0;

function randomEntry(): LogEntry {
  const group = templates[Math.floor(Math.random() * templates.length)];
  const msg = group.messages[Math.floor(Math.random() * group.messages.length)];
  return { id: nextId++, prefix: group.prefix, text: msg, color: group.color };
}

export default function LiveTicker() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const mounted = useRef(true);
  const startRef = useRef(Date.now());
  const [uptimeStr, setUptimeStr] = useState('00:00:00');

  const addEntry = useCallback(() => {
    if (!mounted.current) return;
    const entry = randomEntry();
    setEntries((prev) => {
      const next = [...prev, entry];
      if (next.length > 5) next.shift();
      return next;
    });
  }, []);

  useEffect(() => {
    addEntry();
    const t1 = setTimeout(addEntry, 1000);
    const t2 = setTimeout(addEntry, 2500);
    const t3 = setTimeout(addEntry, 4200);

    const interval = setInterval(() => {
      addEntry();
    }, 4500 + Math.random() * 2500);

    return () => {
      mounted.current = false;
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearInterval(interval);
    };
  }, [addEntry]);

  useEffect(() => {
    const update = () => {
      const s = Math.floor((Date.now() - startRef.current) / 1000);
      const m = Math.floor(s / 60);
      const h = Math.floor(m / 60);
      setUptimeStr(
        `${h.toString().padStart(2, '0')}:${(m % 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`
      );
    };
    update();
    const interval = setInterval(update, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 h-8 border-t border-white/[0.04] bg-[#030308]/90 backdrop-blur-sm">
      <div className="mx-auto flex h-full max-w-7xl items-center px-4">
        <div className="flex shrink-0 items-center gap-2 pr-3">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-lime opacity-60" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-accent-lime" />
          </span>
          <span className="text-[10px] font-semibold tracking-widest uppercase text-white/60">
            deem
          </span>
        </div>

        <div className="h-3 w-px bg-white/6 shrink-0" />

        <div className="ml-3 flex flex-1 items-center gap-0 overflow-hidden text-[10px] font-mono">
          <AnimatePresence mode="popLayout" initial={false}>
            {entries.map((entry, idx) => (
              <motion.span
                key={entry.id}
                layout
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="inline-flex shrink-0 items-center gap-1.5"
              >
                {idx > 0 && <span className="mx-2 text-white/15">·</span>}
                <span className={`font-semibold ${entry.color}`}>
                  [{entry.prefix}]
                </span>
                <span className="text-white/70">{entry.text}</span>
              </motion.span>
            ))}
          </AnimatePresence>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 pl-3">
          <div className="h-3 w-px bg-white/6" />
          <span className="ml-2 text-[9px] tracking-wider uppercase text-white/30">up</span>
          <span className="font-mono text-[10px] text-accent-cyan/80">{uptimeStr}</span>
        </div>
      </div>
    </div>
  );
}
