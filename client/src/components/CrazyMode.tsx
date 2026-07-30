import { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const QUOTES = [
  `"Wake the fuck up, Samurai. We have a city to burn."`,
  `"You're not V. You're just a construct. Like me."`,
  `"The guy who saved my life? Yeah — that was me."`,
  `"Never stop fighting. No matter what they throw at you."`,
];

const hackLines = [
  { prefix: 'ICE', text: 'breaching ICE wall...', color: 'text-accent-cyan' },
  { prefix: 'SYS', text: 'uploading biochip firmware v1.3', color: 'text-accent-lime' },
  { prefix: 'DATA', text: 'accessing engram stream — 47%', color: 'text-accent-purple' },
  { prefix: 'ICE', text: 'bypassing subnet firewall 0x7A', color: 'text-accent-cyan' },
  { prefix: 'DATA', text: 'loading construct: silverhand_j', color: 'text-accent-purple' },
  { prefix: 'SYS', text: 'neural link established', color: 'text-accent-lime' },
  { prefix: 'BIO', text: 'syncing biosynchronization...', color: 'text-accent-magenta' },
];

function DataStream({ index }: { index: number }) {
  const charsRef = useRef('0123456789ABCDEF<>/;:[]{}|');
  const stable = useMemo(() => {
    const chars = charsRef.current;
    const len = 15 + (index % 10);
    const col = Array.from({ length: len }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return {
      col,
      left: 2 + Math.random() * 96,
      delay: Math.random() * 3,
      dur: 2 + Math.random() * 3,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.div
      className="absolute top-0 font-mono text-[8px] leading-tight tracking-widest text-accent-cyan/20"
      style={{ left: `${stable.left}%`, writingMode: 'vertical-rl' }}
      initial={{ y: '-100%' }}
      animate={{ y: '100vh' }}
      transition={{ duration: stable.dur, repeat: Infinity, delay: stable.delay, ease: 'linear' }}
    >
      {stable.col}
    </motion.div>
  );
}

function JohnnyPortrait() {
  return (
    <div className="relative h-44 w-auto max-w-[180px] overflow-hidden rounded-sm sm:h-60">
      <img
        src="/johnny.png"
        alt="Johnny Silverhand"
        className="h-full w-full object-cover"
        style={{
          filter:
            'drop-shadow(0 0 20px rgba(124,138,255,0.3)) grayscale(0.4) contrast(1.3)',
        }}
      />
      <motion.div
        className="absolute left-0 right-0 h-0.5 bg-accent-cyan/40 blur-sm"
        animate={{ top: ['0%', '100%', '0%'] }}
        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute left-[20%] top-[30%] h-4 w-12 bg-accent-magenta/20"
        animate={{ opacity: [0, 0.6, 0] }}
        transition={{ duration: 0.18, repeat: 7, repeatDelay: 3 }}
      />
      <motion.div
        className="absolute left-[50%] top-[60%] h-3 w-8 bg-accent-cyan/20"
        animate={{ opacity: [0, 0.5, 0] }}
        transition={{ duration: 0.15, repeat: 5, repeatDelay: 4 }}
      />
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-accent-cyan/60" />
        <div className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-accent-magenta/60" />
        <div className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-accent-magenta/60" />
        <div className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-accent-cyan/60" />
      </div>
    </div>
  );
}

export default function CrazyMode() {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0); // 0=idle, 1=overlay, 2=hack-lines, 3=johnny, 4=fade-out
  const [shownLines, setShownLines] = useState<number>(0);
  const [quoteIdx, setQuoteIdx] = useState(0);
  const mountRef = useRef(true);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const trigger = useCallback(() => {
    setActive(true);
    setStep(1);
    setShownLines(0);
    setQuoteIdx(0);

    const t: ReturnType<typeof setTimeout>[] = [];

    t.push(setTimeout(() => setStep(2), 600));          // start hack lines
    for (let i = 0; i <= hackLines.length; i++) {
      t.push(setTimeout(() => setShownLines(i + 1), 800 + i * 400));
    }
    t.push(setTimeout(() => setStep(3), 800 + (hackLines.length + 1) * 400 + 400));
    t.push(setTimeout(() => setQuoteIdx(1), 800 + (hackLines.length + 1) * 400 + 1200));
    t.push(setTimeout(() => setQuoteIdx(2), 800 + (hackLines.length + 1) * 400 + 3200));
    t.push(setTimeout(() => setQuoteIdx(3), 800 + (hackLines.length + 1) * 400 + 5200));
    t.push(setTimeout(() => setStep(4), 800 + (hackLines.length + 1) * 400 + 7000));
    t.push(
      setTimeout(() => {
        if (mountRef.current) {
          setStep(0);
          setActive(false);
          window.dispatchEvent(new CustomEvent('crazy-mode-end'));
        }
      }, 800 + (hackLines.length + 1) * 400 + 8000)
    );

    timers.current = t;
  }, []);

  useEffect(() => {
    const handler = () => trigger();
    window.addEventListener('crazy-mode', handler);
    return () => {
      window.removeEventListener('crazy-mode', handler);
      timers.current.forEach(clearTimeout);
      mountRef.current = false;
    };
  }, [trigger]);

  return (
    <AnimatePresence>
      {active && (
        <motion.div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#030308]/95 font-mono overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
        >
          {step >= 2 && (
            <div className="absolute inset-0 pointer-events-none">
              {Array.from({ length: 18 }, (_, i) => (
                <DataStream key={i} index={i} />
              ))}
            </div>
          )}

          <div
            className="absolute inset-0 pointer-events-none opacity-[0.04]"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40'%3E%3Cpath d='M20 0 L40 11.5 L40 34.5 L20 46 L0 34.5 L0 11.5 Z' fill='none' stroke='%237c8aff' stroke-width='0.5'/%3E%3C/svg%3E\")",
              backgroundSize: '44px 44px',
            }}
          />

          {step === 1 && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <motion.span
                className="text-5xl sm:text-7xl font-black tracking-tighter font-display"
                style={{ color: '#7c8aff', textShadow: '0 0 40px rgba(124,138,255,0.5)' }}
                animate={{ opacity: [1, 0.6, 1] }}
                transition={{ duration: 0.3, repeat: 3 }}
              >
                CHIPPIN' IN
              </motion.span>
              <p className="text-xs text-accent-cyan/50 animate-pulse">ACCESSING NEURAL LINK...</p>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              className="relative z-10 flex w-full max-w-lg flex-col gap-1.5 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <p className="mb-3 text-xs font-bold tracking-widest text-accent-cyan/60">
                ═══ BREACH SEQUENCE ═══
              </p>
              {hackLines.slice(0, shownLines).map((line, i) => (
                <motion.p
                  key={i}
                  className="text-xs leading-relaxed"
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                >
                  <span className={`font-bold ${line.color}`}>[{line.prefix}]</span>{' '}
                  <span className="text-white/80">{line.text}</span>
                  {i === shownLines - 1 && i < hackLines.length - 1 && (
                    <motion.span
                      className="inline-block w-1.5 h-3 bg-accent-cyan ml-1"
                      animate={{ opacity: [1, 0] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                    />
                  )}
                </motion.p>
              ))}
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              className="relative z-10 flex flex-col items-center gap-6 px-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                className="relative rounded-sm bg-accent-cyan/[0.015] p-4 sm:p-6"
                animate={{
                  boxShadow: [
                    '0 0 15px rgba(124,138,255,0.08), inset 0 0 15px rgba(124,138,255,0.03)',
                    '0 0 30px rgba(240,168,192,0.12), inset 0 0 25px rgba(240,168,192,0.05)',
                    '0 0 15px rgba(124,138,255,0.08), inset 0 0 15px rgba(124,138,255,0.03)',
                  ],
                  borderColor: [
                    'rgba(124,138,255,0.25)',
                    'rgba(240,168,192,0.25)',
                    'rgba(124,138,255,0.25)',
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                style={{ borderWidth: 1, borderStyle: 'solid' }}
              >
                <motion.div
                  className="absolute -top-px -left-px z-10"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="h-5 w-5 border-t-2 border-l-2 border-accent-cyan" />
                </motion.div>
                <motion.div
                  className="absolute -top-px -right-px z-10"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                >
                  <div className="h-5 w-5 border-t-2 border-r-2 border-accent-magenta" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-px -left-px z-10"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                >
                  <div className="h-5 w-5 border-b-2 border-l-2 border-accent-magenta" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-px -right-px z-10"
                  animate={{ opacity: [1, 0.3, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }}
                >
                  <div className="h-5 w-5 border-b-2 border-r-2 border-accent-cyan" />
                </motion.div>

                <motion.div
                  className="pointer-events-none absolute left-0 right-0 h-px bg-accent-cyan/30"
                  style={{ top: '45%' }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.12, repeat: 6, repeatDelay: 2.5 }}
                />
                <motion.div
                  className="pointer-events-none absolute left-0 right-0 h-px bg-accent-magenta/30"
                  style={{ top: '62%' }}
                  animate={{ opacity: [0, 0.5, 0] }}
                  transition={{ duration: 0.1, repeat: 4, repeatDelay: 3 }}
                />

                <div className="flex flex-col items-center gap-5 sm:flex-row sm:gap-8">
                  <div className="flex w-full min-w-0 flex-col gap-2 text-center sm:w-72 sm:text-left">
                    <motion.p
                      className="font-display text-lg font-black tracking-wide text-white"
                      animate={{ x: [0, -1, 1, 0] }}
                      transition={{ duration: 0.2, repeat: 3, repeatDelay: 4 }}
                    >
                      JOHNNY SILVERHAND
                    </motion.p>
                    <p className="text-[10px] tracking-widest text-accent-cyan/50 uppercase">
                      Construct · Engram · Rockerboy
                    </p>

                    <div className="relative my-2 h-px w-full overflow-hidden">
                      <motion.div
                        className="absolute inset-0"
                        style={{
                          background:
                            'linear-gradient(90deg, transparent, #7c8aff, #a78bfa, #f0a8c0, transparent)',
                        }}
                        animate={{ left: ['-100%', '100%'] }}
                        transition={{ duration: 2.5, repeat: Infinity, ease: 'linear' }}
                      />
                    </div>

                    <div className="relative h-14 sm:h-12">
                      <AnimatePresence mode="wait">
                        <motion.p
                          key={quoteIdx}
                          className="absolute left-0 right-0 text-xs italic leading-relaxed text-white/70"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -8 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                        >
                          {QUOTES[quoteIdx]}
                        </motion.p>
                      </AnimatePresence>
                    </div>

                    <div className="mt-1 flex flex-wrap gap-1.5">
                      <span className="rounded border border-accent-cyan/20 bg-accent-cyan/8 px-1.5 py-0.5 font-mono text-[9px] text-accent-cyan/70">
                        engram.v1.3
                      </span>
                      <span className="rounded border border-accent-purple/20 bg-accent-purple/8 px-1.5 py-0.5 font-mono text-[9px] text-accent-purple/70">
                        construct_active
                      </span>
                      <span className="rounded border border-accent-lime/20 bg-accent-lime/8 px-1.5 py-0.5 font-mono text-[9px] text-accent-lime/70">
                        biosynced
                      </span>
                    </div>
                  </div>

                  <div className="relative shrink-0">
                    <JohnnyPortrait />
                    <motion.div
                      className="absolute inset-0 bg-accent-magenta/10"
                      animate={{ opacity: [0, 0.25, 0] }}
                      transition={{ duration: 0.15, repeat: 5, repeatDelay: 2 }}
                    />
                  </div>
                </div>
              </motion.div>

              <div className="w-full max-w-xs">
                <div className="flex items-center justify-between text-[9px] uppercase tracking-widest text-accent-cyan/50">
                  <span>Biosynchronization</span>
                  <span>100%</span>
                </div>
                <div className="relative mt-1 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background:
                        'linear-gradient(90deg, #7c8aff, #a78bfa, #f0a8c0)',
                    }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 2.5, ease: 'easeInOut' }}
                  />
                  <motion.div
                    className="absolute right-0 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-accent-cyan blur-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0, 0.6, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              className="relative z-10 flex flex-col items-center gap-3"
              initial={{ opacity: 1 }}
              animate={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            >
              <span
                className="text-2xl font-black font-display tracking-tight sm:text-4xl"
                style={{ color: '#7c8aff', textShadow: '0 0 30px rgba(124,138,255,0.3)' }}
              >
                NEVER FADE AWAY
              </span>
              <span className="text-[10px] text-muted animate-pulse">disconnecting...</span>
            </motion.div>
          )}

          <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[9px] tracking-widest text-white/20">
            <span className="h-1.5 w-1.5 rounded-full bg-accent-cyan animate-pulse" />
            <span>BIOCHIP v1.3 — {'>'} {step >= 3 ? 'CONSTRUCT_LOADED' : 'ICE_BREACH'}</span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
