import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './lib/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
      },
      colors: {
        // White Gallery theme
        background: '#FDFDFC',
        ink: '#252C28',
        muted: '#67716A',
        accent: '#B84438',
        border: '#E0E5DF',
        'soft-surface': '#F5F7F3',
        'warm-surface': '#F5EBE7',
        'on-accent': '#FFFFFF',
        // Additional accent colors for auth pages
        indigo: {
          50: '#EEF2FF',
          100: '#E0E7FF',
          200: '#C7D2FE',
          300: '#A5B4FC',
          400: '#818CF8',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
          800: '#3730A3',
          900: '#312E81',
          950: '#1E1B4B',
        },
        sakura: {
          50: '#FFF1F2',
          100: '#FFE4E6',
          200: '#FECDD3',
          300: '#FDA2A8',
          400: '#FB7176',
          500: '#F43F4E',
          600: '#E11D38',
          700: '#BE123C',
          800: '#9F1239',
          900: '#881337',
          950: '#4C0519',
        },
      },
      borderRadius: {
        'card': '16px',
        'button': '28px',
        'input': '12px',
        'photo': '20px',
        'photo-bottom-right': '180px',
      },
      spacing: {
        'rhythm-8': '8px',
        'rhythm-12': '12px',
        'rhythm-16': '16px',
        'rhythm-24': '24px',
        'rhythm-32': '32px',
        'rhythm-48': '48px',
        'rhythm-64': '64px',
      },
      maxWidth: {
        'content': '1680px',
        '7xl': '1680px',
      },
      height: {
        'nav': '96px',
        'button': '56px',
        'input': '52px',
        'photo-desktop': '750px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.05), 0 1px 2px -1px rgb(0 0 0 / 0.05)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.05), 0 2px 4px -2px rgb(0 0 0 / 0.05)',
      },
      transitionDuration: {
        'scroll-blur': '16ms',
      },
    },
  },
  plugins: [],
}

export default config
