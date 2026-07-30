import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

function Letters({ chars, startIndex, gradient }: { chars: string[]; startIndex: number; gradient: boolean }) {
  return (
    <motion.span className="block" layout>
      {chars.map((char, i) => {
        const idx = startIndex + i;
        const randomX = (Math.random() - 0.5) * 120;
        const randomY = (Math.random() - 0.5) * 120;
        const randomR = (Math.random() - 0.5) * 60;

        return (
          <motion.span
            key={`${char}-${idx}`}
            layout
            initial={{ opacity: 0, x: randomX, y: randomY, rotateZ: randomR, scale: 0.5 }}
            animate={{ opacity: 1, x: 0, y: 0, rotateZ: 0, scale: 1 }}
            exit={{ opacity: 0, x: -randomX, y: randomY, rotateZ: -randomR, scale: 0.3 }}
            transition={{
              duration: 0.55,
              delay: i * 0.035,
              ease: [0.22, 1, 0.36, 1],
              layout: { duration: 0.5 },
            }}
            className={`inline-block ${gradient ? 'text-gradient' : ''}`}
          >
            {char === ' ' ? '\u00A0' : char}
          </motion.span>
        );
      })}
    </motion.span>
  );
}

export default function IdentitySwap() {
  const [showDeem, setShowDeem] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setShowDeem((p) => !p), 7000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex flex-col">
      <AnimatePresence mode="popLayout">
        {showDeem ? (
          <motion.div key="deem" layout>
            <Letters chars={['I', '\u00A0', 'a', 'm']} startIndex={0} gradient />
            <Letters chars={'deem'.split('')} startIndex={10} gradient />
          </motion.div>
        ) : (
          <motion.div key="name" layout>
            <Letters chars={'Michał'.split('')} startIndex={0} gradient={false} />
            <Letters chars={'Kornela'.split('')} startIndex={10} gradient />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
