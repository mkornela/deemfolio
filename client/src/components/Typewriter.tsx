import { useEffect, useState } from 'react';

const phrases = [
  'building CHATBOX for streamers',
  'unifying CS2 data from 4 platforms',
  'tracking Valorant ranks in real time',
  'keeping apps alive on Linux & Windows',
  'shipping a live stream delay tool',
];

export default function Typewriter() {
  const [text, setText] = useState('');
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = phrases[phraseIndex];
    let timer: ReturnType<typeof setTimeout>;

    if (deleting) {
      timer = setTimeout(() => {
        setText((prev) => {
          if (prev.length === 0) {
            setDeleting(false);
            setPhraseIndex((i) => (i + 1) % phrases.length);
            return '';
          }
          return prev.slice(0, -1);
        });
      }, 35);
    } else {
      timer = setTimeout(() => {
        setText((prev) => {
          if (prev.length === current.length) {
            setDeleting(true);
            return prev;
          }
          return current.slice(0, prev.length + 1);
        });
      }, 60);
    }

    return () => clearTimeout(timer);
  }, [text, deleting, phraseIndex]);

  return (
    <span className="font-mono text-sm text-accent/90">
      {text}
      <span className="ml-0.5 inline-block h-4 w-0.5 animate-pulse bg-accent align-middle" />
    </span>
  );
}
