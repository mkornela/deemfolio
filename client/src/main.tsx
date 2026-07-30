import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';

(function () {
  if (typeof document === 'undefined' || document.getElementById('johny-c')) return;

  const quotes = [
    'Wake the fuck up, Samurai.',
    'We got a city to burn.',
    'Never fade away.',
    'Time to party like it\'s 2023.',
    'The grave\'s the safest place, choom.',
    'Preem work.',
    'Arasaka can eat a dick.',
    'You look like you could use a drink.',
    'Justice… is a myth.',
    'You think I give a shit?',
    'Life before death, choom.',
    'Some things in life are shit, but some are real gems.',
    'Aaaaaand the award for biggest asshole of the year goes to…',
    'Calm your tits. It\'s just business.',
    'You can\'t save what\'s already gone.',
  ];

  const scrollQ: Record<string, string[]> = {
    hero: ['Not bad, Samurai.', "Kid's got style — I'll give 'em that."],
    about: ['Another corpo grinder…', 'DXC, huh? Different suit, same stink.'],
    experience_dxc: ['Junior System Engineer. Corpo ladder. Soulless but steady.', 'They got you chipped into their mainframe yet?'],
    experience_netia: ['Telco world. Boring, but it pays for the chrome.', 'Netia — the quiet years before the storm.'],
    projects: ['Building something real. I respect that.', 'Not just another corpo drone — this one actually makes things.'],
    skills: ['Node.js, Go, Python… not bad for a solo run.', 'Skills are chrome. Keep upgrading.'],
    certs: ['Certificates? Nice wallpaper. Show me what you can actually do.', 'Paper don\'t mean shit. Code does.'],
    entertainment: ['Living the online life. Gotta respect the grind.', 'Discord, Twitch… keeping the grid alive.'],
    contact: ['Wants to network. Classic move.', 'Reaching out — smart. Night City runs on connections.'],
    status: ['Watching the servers breathe. Good habit.', 'Keeping an eye on services. Smart. Real smart.'],
    footer: ['Never fade away.', 'Until the battery dies…'],
  };

  const container = document.createElement('div');
  container.id = 'johny-c';
  container.style.cssText = 'display:none;position:fixed;left:16px;bottom:80px;z-index:99999;flex-direction:column;align-items:flex-start;gap:8px;';

  const bubble = document.createElement('div');
  bubble.id = 'johny-b';
  bubble.style.cssText = 'display:none;position:relative;max-width:200px;border-radius:8px;border:1px solid rgba(124,138,255,0.3);background:#050510;padding:6px 10px;box-shadow:0 0 25px rgba(124,138,255,0.15);opacity:0;transition:opacity 0.25s,transform 0.25s;transform:translateX(-10px);';

  const arrow = document.createElement('div');
  arrow.style.cssText = 'position:absolute;bottom:-5px;left:14px;width:10px;height:10px;transform:rotate(45deg);border-right:1px solid rgba(124,138,255,0.3);border-bottom:1px solid rgba(124,138,255,0.3);background:#050510;';
  bubble.appendChild(arrow);

  const textP = document.createElement('p');
  textP.id = 'johny-t';
  textP.style.cssText = 'margin:0;font-size:11px;font-style:italic;line-height:1.5;color:rgba(255,255,255,0.8);';
  bubble.appendChild(textP);
  container.appendChild(bubble);

  const btnWrap = document.createElement('div');
  btnWrap.style.cssText = 'width:64px;height:64px;flex-shrink:0;position:relative;';

  const btn = document.createElement('button');
  btn.id = 'johny-btn';
  btn.title = 'Johnny';
  btn.style.cssText = 'width:64px;height:64px;border-radius:50%;border:2px solid #7c8aff;overflow:hidden;cursor:pointer;background:transparent;box-shadow:0 0 20px rgba(124,138,255,0.3);position:relative;padding:0;transition:box-shadow 0.2s,transform 0.15s;';

  const img = document.createElement('img');
  img.src = '/johnny.png';
  img.alt = 'J';
  img.style.cssText = 'width:100%;height:100%;object-fit:cover;object-position:center 0%;display:block;';
  img.onerror = function () {
    img.style.display = 'none';
    btn.style.background = 'transparent';
    const fb = btn.querySelector('.jfb') as HTMLElement | null;
    if (fb) fb.style.display = 'flex';
  };
  btn.appendChild(img);

  const fbSpan = document.createElement('span');
  fbSpan.className = 'jfb';
  fbSpan.style.cssText = 'display:none;position:absolute;inset:0;align-items:center;justify-content:center;font-size:20px;font-weight:900;color:#7c8aff;font-family:monospace;';
  fbSpan.textContent = 'JS';
  btn.appendChild(fbSpan);

  const dot = document.createElement('span');
  dot.style.cssText = 'position:absolute;bottom:2px;right:2px;width:10px;height:10px;border-radius:50%;background:#6ee7b7;box-shadow:0 0 8px rgba(110,231,183,0.8);';
  btn.appendChild(dot);

  const lockDiv = document.createElement('div');
  lockDiv.id = 'johny-lock';
  lockDiv.style.cssText = 'position:absolute;inset:0;border-radius:50%;background:rgba(0,0,0,0.5);display:flex;align-items:center;justify-content:center;';
  lockDiv.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>';
  btn.appendChild(lockDiv);
  btnWrap.appendChild(btn);
  container.appendChild(btnWrap);

  let timer: ReturnType<typeof setTimeout> | null = null;
  let lastSection = '';
  let msgCount = 0;
  let obs: IntersectionObserver | null = null;

  function show() { container.style.display = 'flex'; }

  function showMsg(msg: string) {
    if (timer) clearTimeout(timer);
    textP.textContent = '\u275d' + msg + '\u275e';
    bubble.style.display = 'block';
    requestAnimationFrame(function () {
      bubble.style.opacity = '1';
      bubble.style.transform = 'translateX(0)';
    });
    timer = setTimeout(function () {
      bubble.style.opacity = '0';
      bubble.style.transform = 'translateX(-10px)';
      setTimeout(function () { bubble.style.display = 'none'; }, 300);
    }, 5000);
  }

  function pickOne(arr: string[]) { return arr[Math.floor(Math.random() * arr.length)]; }

  function pickRandom() {
    const pool = quotes.slice();
    for (const k in scrollQ) {
      if (Object.prototype.hasOwnProperty.call(scrollQ, k)) pool.push(...scrollQ[k]);
    }
    return pickOne(pool);
  }

  function setupScroll() {
    if (obs) obs.disconnect();
    const sections = document.querySelectorAll('[data-section]');
    if (!sections.length) { setTimeout(setupScroll, 800); return; }
    obs = new IntersectionObserver(
      function (entries) {
        let best: Element | null = null;
        let bestR = 0;
        entries.forEach(function (e) { if (e.intersectionRatio > bestR) { bestR = e.intersectionRatio; best = e.target; } });
        if (!best || bestR < 0.2) return;
        const sec = (best as Element).getAttribute('data-section') || '';
        if (!sec || sec === lastSection) return;
        const r = scrollQ[sec];
        if (!r) return;
        lastSection = sec;
        msgCount++;
        if (msgCount > 3 || sec === 'hero') showMsg(pickOne(r));
      },
      { threshold: 0.25, rootMargin: '-80px 0px -80px 0px' }
    );
    sections.forEach(function (el) { obs!.observe(el); });
  }

  function doShow() {
    sessionStorage.setItem('johny_unlocked', 'true');
    if (lockDiv) lockDiv.style.display = 'none';
    show();
    setupScroll();
  }

  function doMark() {
    sessionStorage.setItem('johny_unlocked', 'true');
  }

  window.addEventListener('johnny-unlock', doMark);
  window.addEventListener('crazy-mode-end', doShow);

  btn.addEventListener('click', function () { showMsg(pickRandom()); });
  btn.addEventListener('mouseenter', function () {
    btn.style.boxShadow = '0 0 35px rgba(255,0,110,0.4)';
    btn.style.transform = 'scale(1.1)';
  });
  btn.addEventListener('mouseleave', function () {
    btn.style.boxShadow = '0 0 20px rgba(124,138,255,0.3)';
    btn.style.transform = 'scale(1)';
  });

  document.body.appendChild(container);

})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);
