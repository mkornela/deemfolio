import { useState, useEffect, useRef } from 'react';
import { Terminal, X, Minus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const PROJECT_MAP: Record<string, string> = {
  valorank: '/projects/deem-api',
  'deem-api': '/projects/deem-api',
  'cs2-api': '/projects/cs2-api',
  chatbox: '/projects/chatbox',
  delay: '/projects/delay',
  deemfolio: '/',
};

const neofetch = `
\x1b[36m        .-/+oossssoo+/-.\x1b[0m               \x1b[1mdeem\x1b[0m@deemfolio
\x1b[36m      \`:+ssssssssssssssssss+:\`\x1b[0m         \x1b[2m-----------------\x1b[0m
\x1b[36m    -+ssssssssssssssssssyyssss+-\x1b[0m        OS: Windows 11 Pro
\x1b[36m  .ossssssssssssssssssdMMMNysssso.\x1b[0m      Host: B650 GAMING X AX V2
\x1b[36m /ssssssssssshdmmNNmmyNMMMMhssssss/\x1b[0m     Kernel: 10.0.26200
\x1b[36m+ssssssssshmydMMMMMMMNddddyssssssss+\x1b[0m    CPU: AMD Ryzen 5 7600 (12) @ 3.8GHz
\x1b[36m/sssssssshNMMMyhhyyyyhmNMMMNhssssss/\x1b[0m    GPU: NVIDIA RTX 3070 Ti
\x1b[36m.ssssssssdMMMNhsssssssssshNMMMdssss.\x1b[0m    RAM: 32 GB 5000MHz
\x1b[36m +sssssssNMMMyhssssssssssyNMMMMsso-\x1b[0m
\x1b[36m  +sssssssdmNMMMMMMMMMMMMddmNmyo+-\x1b[0m
\x1b[36m   /sssssssssssssssssssdNmyoo/-\x1b[0m
\x1b[36m     ./+sssssssssssssoo+:-\x1b[0m
`.trim();

const helpText = [
  '╔══════════════════════════════════════╗',
  '║  \x1b[36mdeemfolio\x1b[0m — available commands          ║',
  '╠══════════════════════════════════════╣',
  '║  \x1b[33mwhoami\x1b[0m        Display user information     ║',
  '║  \x1b[33mneofetch\x1b[0m      Show system specifications  ║',
  '║  \x1b[33mls projects\x1b[0m   List featured projects      ║',
  '║  \x1b[33mnav [project]\x1b[0m  Navigate to a project page  ║',
  '║  \x1b[33muptime\x1b[0m       Show session uptime          ║',
  '║  \x1b[33mgithub\x1b[0m       Open GitHub profile          ║',
  '║  \x1b[33mcontact\x1b[0m      Show contact information     ║',
  '║  \x1b[33mhelp\x1b[0m         Show this help message       ║',
  '║  \x1b[33mclear\x1b[0m / \x1b[33mcls\x1b[0m   Clear terminal screen        ║',
  '╚══════════════════════════════════════╝',
].join('\n');

const whoami = [
  '\x1b[36m  ___  ___  ___  ___  ___  ___\x1b[0m',
  '\x1b[36m | \\x1b[36mm\x1b[0m |_ \x1b[36mi\x1b[0m | \x1b[36mc\x1b[0m| \x1b[36mh\x1b[0m| \x1b[36ma\x1b[0m| \x1b[36ml\x1b[0m|',
  '\x1b[36m |___|___|___|___|___|___|\x1b[0m',
  '',
  `  \x1b[1mMichał Kornela\x1b[0m`,
  `  \x1b[2m@\x1b[0mdeem`,
  '',
  '  \x1b[33mRole:\x1b[0m      Junior System Engineer (Applications)',
  '  \x1b[33mCompany:\x1b[0m   DXC Technology',
  '  \x1b[33mLocation:\x1b[0m  Gliwice, Poland',
  '  \x1b[33mStack:\x1b[0m     Node.js · Express · React · Go · Python',
  '  \x1b[33mInterests:\x1b[0m Live streaming · Tooling · Automation',
  '  \x1b[33mSpec:\x1b[0m      NodeJS',
  '',
  '  \x1b[2m"I build systems that keep things running."\x1b[0m',
].join('\n');

const projects = `
  \x1b[36m┌──────────────────────────────────────────────────┐\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[1mFeatured Projects\x1b[0m                                  \x1b[36m│\x1b[0m
  \x1b[36m├──────────────────────────────────────────────────┤\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[33m<span data-nav="valorank" class="cursor-pointer decoration-dotted underline decoration-accent-cyan/50 hover:text-accent-cyan">valorank</span>\x1b[0m    Real-time Valorant stats                \x1b[36m│\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[33m<span data-nav="cs2-api" class="cursor-pointer decoration-dotted underline decoration-accent-cyan/50 hover:text-accent-cyan">cs2-api</span>\x1b[0m      CS2 data aggregator                    \x1b[36m│\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[33m<span data-nav="chatbox" class="cursor-pointer decoration-dotted underline decoration-accent-cyan/50 hover:text-accent-cyan">chatbox</span>\x1b[0m      Twitch chat overlays                    \x1b[36m│\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[33m<span data-nav="delay" class="cursor-pointer decoration-dotted underline decoration-accent-cyan/50 hover:text-accent-cyan">delay</span>\x1b[0m        Local stream delay tool                 \x1b[36m│\x1b[0m
  \x1b[36m│\x1b[0m  \x1b[33m<span data-nav="deemfolio" class="cursor-pointer decoration-dotted underline decoration-accent-cyan/50 hover:text-accent-cyan">deemfolio</span>\x1b[0m   This site \x1b[2m(you are here)\x1b[0m                    \x1b[36m│\x1b[0m
  \x1b[36m└──────────────────────────────────────────────────┘\x1b[0m
  \x1b[2mTip: click a project name above, or type \x1b[33mnav &lt;project&gt;\x1b[0m \x1b[2mto navigate.\x1b[0m
`.trim();

const contactText = [
  '  \x1b[36m✉\x1b[0m  \x1b[1mContact\x1b[0m',
  '  \x1b[33mLinkedIn:\x1b[0m  https://linkedin.com/in/mkornela',
  '  \x1b[33mGitHub:\x1b[0m    https://github.com/mkornela',
  '  \x1b[33mTwitch:\x1b[0m    https://twitch.tv/9deem',
  '  \x1b[33mDiscord:\x1b[0m   @deem',
].join('\n');

type TextLine = { kind: 'text'; html: string; isCmd?: boolean };
type SuggestLine = { kind: 'suggest'; label: string; command: string };
type Line = TextLine | SuggestLine;

function ansiToHtml(text: string): string {
  return text
    .replace(/\x1b\[1m/g, '<span class="font-bold">')
    .replace(/\x1b\[2m/g, '<span class="opacity-50">')
    .replace(/\x1b\[31m/g, '<span class="text-red-400">')
    .replace(/\x1b\[33m/g, '<span class="text-yellow-300">')
    .replace(/\x1b\[36m/g, '<span class="text-accent-cyan">')
    .replace(/\x1b\[0m/g, '</span>')
    .replace(/\x1b\[m/g, '')
    .replace(/\n/g, '<br />');
}

const VALID_COMMANDS = [
  'help',
  'whoami',
  'neofetch',
  'ls',
  'ls projects',
  'nav',
  'uptime',
  'github',
  'contact',
  'clear',
  'cls',
  'chippin in',
];

function findSuggestion(input: string): string | null {
  const lower = input.trim().toLowerCase();
  if (!lower) return null;

  if (VALID_COMMANDS.includes(lower)) return null;

  const startsWith = VALID_COMMANDS.find((c) => c.startsWith(lower) && c !== lower);
  if (startsWith) return startsWith;

  const contains = VALID_COMMANDS.find(
    (c) => c.includes(lower) || lower.includes(c)
  );
  if (contains) return contains;

  const words = lower.split(/\s+/);
  for (const cmd of VALID_COMMANDS) {
    const cmdWords = cmd.split(/\s+/);
    for (const w of words) {
      if (w.length < 2) continue;
      if (cmdWords.some((cw) => cw.startsWith(w) || w.startsWith(cw))) return cmd;
    }
  }

  return null;
}

export default function MiniTerminal() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [input, setInput] = useState('');
  const [lines, setLines] = useState<Line[]>([
    { kind: 'text', html: ansiToHtml('deemfolio terminal v1.0.0 — type \x1b[33mhelp\x1b[0m for commands') },
  ]);
  const [startTime] = useState(Date.now());
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lines]);

  useEffect(() => {
    const el = outputRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('[data-nav]');
      if (target instanceof HTMLElement) {
        const path = target.getAttribute('data-nav');
        if (path) navigate(path);
      }
    };
    el.addEventListener('click', handler);
    return () => el.removeEventListener('click', handler);
  }, [navigate]);

  const addOutput = (html: string) => {
    setLines((p) => [...p, { kind: 'text', html }]);
  };

  const addSuggestion = (label: string, command: string) => {
    setLines((p) => [...p, { kind: 'suggest', label, command }]);
  };

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim();
    setLines((p) => [
      ...p,
      { kind: 'text', html: ansiToHtml(`$ \x1b[33m${trimmed}\x1b[0m`), isCmd: true },
    ]);

    const lower = trimmed.toLowerCase();

    switch (lower) {
      case 'help':
        addOutput(ansiToHtml(helpText));
        break;

      case 'whoami':
        addOutput(ansiToHtml(whoami));
        break;

      case 'neofetch':
        addOutput(ansiToHtml(neofetch));
        break;

      case 'ls':
      case 'ls projects':
        addOutput(ansiToHtml(projects));
        break;

      case 'uptime': {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);
        const h = Math.floor(elapsed / 3600);
        const m = Math.floor((elapsed % 3600) / 60);
        const s = elapsed % 60;
        addOutput(ansiToHtml(`  Session uptime: \x1b[36m${h}h ${m}m ${s}s\x1b[0m`));
        break;
      }

      case 'github':
        addOutput('  Opening GitHub...');
        window.open('https://github.com/mkornela', '_blank');
        break;

      case 'contact':
        addOutput(ansiToHtml(contactText));
        break;

      case 'chippin in':
        addOutput(
          ansiToHtml(
            '  \x1b[36mCHIPPIN\' IN — system overload initiated. Brace yourself.\x1b[0m'
          )
        );
        window.dispatchEvent(new CustomEvent('crazy-mode'));
        window.dispatchEvent(new CustomEvent('johnny-unlock'));
        break;

      case 'clear':
      case 'cls':
        setLines([]);
        break;

      case '':
        break;

      default: {
        if (lower.startsWith('nav ')) {
          const proj = lower.slice(4).trim();
          const path = PROJECT_MAP[proj];
          if (path != null) {
            addOutput(ansiToHtml(`  \x1b[36mNavigating to ${proj}...\x1b[0m`));
            navigate(path);
          } else {
            const suggestions = Object.keys(PROJECT_MAP).filter(
              (k) => k.includes(proj) || proj.includes(k)
            );
            if (suggestions.length > 0) {
              addOutput(
                ansiToHtml(`  \x1b[31mUnknown project:\x1b[0m "${proj}"`)
              );
              addSuggestion(suggestions[0], `nav ${suggestions[0]}`);
            } else {
              addOutput(
                ansiToHtml(
                  `  \x1b[31mUnknown project:\x1b[0m "${proj}". Available: valorank, cs2-api, chatbox, delay, deemfolio`
                )
              );
            }
          }
          break;
        }

        const suggest = findSuggestion(trimmed);
        if (suggest) {
          addOutput(
            ansiToHtml(`  \x1b[31mUnknown command:\x1b[0m "${trimmed}"`)
          );
          addSuggestion(suggest, suggest);
        } else {
          addOutput(
            ansiToHtml(
              `  \x1b[31mUnknown command:\x1b[0m "${trimmed}". Type \x1b[33mhelp\x1b[0m for available commands.`
            )
          );
        }
      }
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    processCommand(input);
    setInput('');
  };

  return (
    <>
      <button
        onClick={() => setOpen((o) => !o)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-xl border border-accent-cyan/30 bg-bg-card text-accent-cyan shadow-[0_0_20px_rgba(0,240,255,0.15)] transition-all hover:border-accent-cyan hover:shadow-[0_0_30px_rgba(0,240,255,0.3)]"
        aria-label="Toggle terminal"
      >
        <Terminal size={20} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[864px] max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-white/10 bg-[#050510] shadow-[0_0_40px_rgba(0,0,0,0.6)]"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={
              minimized
                ? { height: 44, opacity: 1, y: 0, scale: 1 }
                : { height: 'auto', opacity: 1, y: 0, scale: 1 }
            }
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{ maxHeight: minimized ? 44 : '60vh' }}
          >
            <div className="flex items-center justify-between border-b border-white/10 bg-white/[0.02] px-4 py-2.5">
              <div className="flex items-center gap-2">
                <Terminal size={14} className="text-accent-cyan" />
                <span className="text-xs font-bold text-white">terminal</span>
                <span className="text-[10px] text-muted">deemfolio@v1.0</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setMinimized((m) => !m)}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-white/10 hover:text-white"
                >
                  <Minus size={14} />
                </button>
                <button
                  onClick={() => setOpen(false)}
                  className="flex h-6 w-6 items-center justify-center rounded text-muted hover:bg-accent-magenta/20 hover:text-accent-magenta"
                >
                  <X size={14} />
                </button>
              </div>
            </div>

            {!minimized && (
              <div
                ref={outputRef}
                className="overflow-y-auto p-4 font-mono text-xs leading-relaxed"
                style={{ maxHeight: 'calc(60vh - 88px)' }}
              >
                {lines.map((line, i) => {
                  if (line.kind === 'text') {
                    return (
                      <div
                        key={i}
                        className={line.isCmd ? 'mb-0.5' : 'mb-1'}
                        dangerouslySetInnerHTML={{ __html: line.html }}
                      />
                    );
                  }
                  return (
                    <div key={i} className="mb-1 flex items-center gap-2">
                      <span className="text-accent-cyan">→</span>
                      <span className="text-xs text-muted">Did you mean</span>
                      <button
                        onClick={() => processCommand(line.command)}
                        className="inline-flex cursor-pointer items-center gap-1 rounded border border-accent-cyan/30 bg-accent-cyan/10 px-2 py-0.5 font-mono text-[10px] text-accent-cyan transition-colors hover:bg-accent-cyan/20 hover:text-white"
                      >
                        <Terminal size={10} />
                        {line.label}
                      </button>
                      <span className="text-[10px] text-muted">?</span>
                    </div>
                  );
                })}
                <div ref={bottomRef} />
              </div>
            )}

            {!minimized && (
              <form
                onSubmit={handleSubmit}
                className="flex items-center border-t border-white/10 bg-white/[0.02] px-4 py-2"
              >
                <span className="mr-2 text-accent-lime text-xs">$</span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="type help..."
                  className="flex-1 bg-transparent text-xs text-white outline-none placeholder:text-muted"
                  autoFocus
                />
              </form>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
