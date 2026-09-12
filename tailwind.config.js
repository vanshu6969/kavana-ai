/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#050608',
        foreground: '#F8FAFC',
        surface: '#0D0E15',
        'surface-hover': '#151722',
        primary: {
          DEFAULT: '#FF2E55',
          dark: '#E00034',
          glow: 'rgba(255, 46, 85, 0.5)',
        },
        crimson: {
          400: '#FF5C7A',
          500: '#FF2E55',
          600: '#E00034',
          700: '#B20710',
        },
        auraflex: {
          bg: '#050608',
          card: '#0D0E15',
          cardHover: '#151722',
          border: 'rgba(255, 255, 255, 0.08)',
          crimson: '#FF2E55',
          crimsonDark: '#E00034',
          textMuted: '#94A3B8',
          textDim: '#64748B',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'glow-crimson': '0 0 25px rgba(255, 46, 85, 0.55)',
        'glow-crimson-lg': '0 0 40px rgba(255, 46, 85, 0.7)',
        'glow-card': '0 12px 36px rgba(0, 0, 0, 0.8)',
      },
    },
  },
  plugins: [],
};
