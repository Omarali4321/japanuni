/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Outfit"', 'system-ui', 'sans-serif'],
      },
      colors: {
        sakura: { 50: '#fff5f7', 100: '#ffe4ec', 200: '#ffc9d9', 500: '#e85d8a', 600: '#c93d6a' },
        ink: { 50: '#f8f9fb', 100: '#eef1f6', 800: '#1a1f2e', 900: '#0f1219', 950: '#080a0f' },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #0f1219 0%, #1a2744 40%, #2d1b3d 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.02) 100%)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.6s ease-out',
      },
      keyframes: {
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
}
