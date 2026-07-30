import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useReducedMotion';

const bootLines = [
  '[POST]    System initializing...',
  '[BIOS]    AMI F36 · 2025-07-31',
  '[CPU]     AMD Ryzen 7000 Series @ 3.8 GHz (12 cores)',
  '[RAM]     32 GB @ 5000MHz — OK',
  '[GPU]     NVIDIA RTX 3070 Ti — driver loaded',
  '[STORAGE] NVMe SSD — mounting volumes...',
  '[NET]     Initializing deemos@portfolio.eth',
  '[AUTH]    Session key ••••-••••-••••-deem',
  '[DMESG]   Loading deemfolio kernel modules...',
  '[DMESG]   Mounting /about /projects /experience',
  '[INIT]    Starting user interface ...',
  '[OK]      Ready.',
];

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const reduced = useReducedMotion();
  const [visible, setVisible] = useState(true);
  const [displayed, setDisplayed] = useState<string[]>([]);
  const [typing, setTyping] = useState('');
  const [idx, setIdx] = useState(0);
  const [finished, setFinished] = useState(false);
  const mounted = useRef(true);

  useEffect(() => {
    if (reduced) {
      setDisplayed(bootLines);
      setTimeout(() => {
        setVisible(false);
        setTimeout(onComplete, 300);
      }, 400);
      return;
    }

    if (idx >= bootLines.length) {
      if (!finished) {
        setFinished(true);
        const t = setTimeout(() => {
          if (mounted.current) {
            setVisible(false);
            setTimeout(onComplete, 500);
          }
        }, 600);
        return () => clearTimeout(t);
      }
      return;
    }

    const line = bootLines[idx];
    const typingSpeed = 6 + Math.random() * 14;

    if (typing.length < line.length) {
      const t = setTimeout(() => {
        if (mounted.current) setTyping(line.slice(0, typing.length + 1));
      }, typingSpeed);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => {
      if (mounted.current) {
        setDisplayed((p) => [...p, line]);
        setTyping('');
        setIdx((i) => i + 1);
      }
    }, 80);
    return () => clearTimeout(t);
  }, [idx, typing, finished, reduced, onComplete]);

  useEffect(() => {
    return () => { mounted.current = false; };
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030308] font-mono"
          onClick={onComplete}
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="w-full max-w-2xl px-6">
            <div className="mb-6 flex items-center gap-3">
              <span className="h-3 w-3 rounded-full bg-accent-magenta shadow-[0_0_10px_rgba(255,0,110,0.6)]" />
              <span className="h-3 w-3 rounded-full bg-yellow-400 shadow-[0_0_10px_rgba(255,200,0,0.4)]" />
              <span className="h-3 w-3 rounded-full bg-accent-lime shadow-[0_0_10px_rgba(57,255,20,0.6)]" />
              <span className="ml-2 text-xs text-muted">
                deemfolio — {reduced ? 'boot.log' : 'boot.log'}
              </span>
            </div>

            <div className="space-y-1 text-xs leading-relaxed">
              {displayed.map((line, i) => (
                <motion.p
                  key={i}
                  className={
                    line.startsWith('[OK]')
                      ? 'text-accent-lime'
                      : line.startsWith('[ERR]')
                      ? 'text-accent-magenta'
                      : line.startsWith('[DMESG]')
                      ? 'text-muted'
                      : 'text-white/90'
                  }
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                >
                  {line}
                </motion.p>
              ))}
              {idx < bootLines.length && (
                <p className="text-white/90">
                  {typing}
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity }}
                    className="inline-block w-2 h-4 bg-accent-cyan ml-0.5"
                  />
                </p>
              )}
              {finished && (
                <p className="mt-4 text-accent-lime">
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                  >
                    _
                  </motion.span>
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
