/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a12',
        'bg-elevated': '#12121c',
        'bg-card': '#1a1a26',
        surface: '#222230',
        'surface-light': '#2a2a3a',
        ink: '#e2e4e9',
        muted: '#8b8fa3',
        accent: {
          DEFAULT: '#7c8aff',
          cyan: '#7c8aff',
          magenta: '#f0a8c0',
          purple: '#a78bfa',
          lime: '#6ee7b7',
          orange: '#fb923c',
          pink: '#f9a8d4',
          teal: '#2dd4bf',
          blue: '#60a5fa',
          green: '#4ade80',
          red: '#f87171',
        },
      },
      fontFamily: {
        sans: ['DM Sans', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'marquee': 'marquee 30s linear infinite',
        'spin-slow': 'spin 12s linear infinite',
        'glitch': 'glitch 1s linear infinite',
        'radar': 'radar 4s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
        },
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      backgroundImage: {
        'grid-pattern':
          'linear-gradient(to right, rgba(124,138,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(124,138,255,0.04) 1px, transparent 1px)',
      },
    },
  },
  plugins: [],
};
