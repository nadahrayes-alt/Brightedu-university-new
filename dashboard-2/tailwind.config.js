/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Theme-driven via CSS vars on <html>
        canvas:        'rgb(var(--canvas) / <alpha-value>)',
        surface:       'rgb(var(--surface) / <alpha-value>)',
        'surface-2':   'rgb(var(--surface-2) / <alpha-value>)',
        'border-soft': 'rgb(var(--border-soft) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--ink) / <alpha-value>)',
          muted:   'rgb(var(--ink-muted) / <alpha-value>)',
          subtle:  'rgb(var(--ink-subtle) / <alpha-value>)',
        },

        // Sidebar (kept dark in both themes per brand)
        sidebar: {
          DEFAULT: '#0B1220',
          hover: 'rgba(255,255,255,0.05)',
          active: 'rgba(255,255,255,0.10)',
          border: 'rgba(255,255,255,0.08)',
          text: 'rgba(255,255,255,0.72)',
          'text-muted': 'rgba(255,255,255,0.50)',
        },

        // Brand & status — same in both themes
        primary: {
          DEFAULT: '#2F5BFF',
          50: '#EEF4FF',
          100: '#DCE6FF',
          500: '#2F5BFF',
          600: '#1E40D8',
          700: '#1A35A8',
        },
        teal:    { DEFAULT: '#007C8A', 50: '#E6F5F7', 100: '#CCEBEF' },
        support: '#64A2D9',
        privacy: { DEFAULT: '#6D5DF6', 50: '#F1EFFF', 100: '#E4DFFE' },
        success: { DEFAULT: '#16A34A', soft: '#DCFCE7' },
        warning: { DEFAULT: '#F59E0B', soft: '#FEF3C7' },
        danger:  { DEFAULT: '#DC2626', soft: '#FEE2E2' },
        purple:  { DEFAULT: '#5D4FBE', soft: '#EFEAFA' },
      },
      fontFamily: {
        sans: ['"IBM Plex Sans Arabic"', '"IBM Plex Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: 'none',
        'card-lg': 'none',
        focus: '0 0 0 2px rgba(47,91,255,0.35)',
      },
      borderRadius: {
        sm: '8px',
        md: '12px',
        lg: '16px',
        xl: '20px',
        '2xl': '24px',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          from: { opacity: '0', transform: 'scale(0.96)' },
          to:   { opacity: '1', transform: 'scale(1)' },
        },
        slowSpin: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(360deg)' },
        },
        slowSpinReverse: {
          from: { transform: 'rotate(0deg)' },
          to:   { transform: 'rotate(-360deg)' },
        },
        softGlow: {
          '0%, 100%': { opacity: '0.45', transform: 'scale(1)' },
          '50%':      { opacity: '0.85', transform: 'scale(1.04)' },
        },
        arrowFloat: {
          '0%, 100%': { transform: 'translateY(0)', opacity: '0.35' },
          '50%':      { transform: 'translateY(-6px)', opacity: '1' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        kenBurns: {
          '0%':   { transform: 'scale(1) translate3d(0, 0, 0)' },
          '50%':  { transform: 'scale(1.08) translate3d(-1.5%, -1%, 0)' },
          '100%': { transform: 'scale(1) translate3d(0, 0, 0)' },
        },
        sheenSlide: {
          '0%':         { transform: 'translateX(-120%) skewX(-12deg)' },
          '60%, 100%':  { transform: 'translateX(420%)  skewX(-12deg)' },
        },
        arrowNudge: {
          '0%, 100%':   { transform: 'translateX(0)',   opacity: '0.75' },
          '50%':        { transform: 'translateX(5px)', opacity: '1' },
        },
        mascotFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(-1deg)' },
          '50%':      { transform: 'translateY(-14px) rotate(1deg)' },
        },
        sparkleTwinkle: {
          '0%, 100%': { transform: 'scale(0.8)', opacity: '0.4' },
          '50%':      { transform: 'scale(1.15)', opacity: '1' },
        },
      },
      animation: {
        'fade-in':           'fadeIn 240ms cubic-bezier(0,0,0,1) both',
        'scale-in':          'scaleIn 240ms cubic-bezier(0,0,0,1) both',
        'spin-slow':         'slowSpin 40s linear infinite',
        'spin-slow-reverse': 'slowSpinReverse 60s linear infinite',
        'glow-soft':         'softGlow 5s ease-in-out infinite',
        'arrow-float':       'arrowFloat 2.4s ease-in-out infinite',
        'gradient-shift':    'gradientShift 14s ease-in-out infinite',
        'ken-burns':         'kenBurns 28s ease-in-out infinite',
        'sheen-slide':       'sheenSlide 2.8s ease-in-out infinite',
        'arrow-nudge':       'arrowNudge 1.5s ease-in-out infinite',
        'mascot-float':      'mascotFloat 4s ease-in-out infinite',
        'sparkle-twinkle':   'sparkleTwinkle 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
