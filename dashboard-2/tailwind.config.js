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
      },
      animation: {
        'fade-in':  'fadeIn 240ms cubic-bezier(0,0,0,1) both',
        'scale-in': 'scaleIn 240ms cubic-bezier(0,0,0,1) both',
      },
    },
  },
  plugins: [],
};
