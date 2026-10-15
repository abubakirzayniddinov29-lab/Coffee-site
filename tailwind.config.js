/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 🎨 SWAP COLORS: keep in sync with src/config/brand.ts → COLORS
      colors: {
        espresso: { DEFAULT: '#2B1B12', 900: '#1C110B', 800: '#2B1B12', 700: '#3A2619', 600: '#4A3222' },
        cream: { DEFAULT: '#F5EBDD', 200: '#EFE2CF', 300: '#E6D4BC' },
        caramel: { DEFAULT: '#C68B59', 600: '#A8703F' },
        gold: { DEFAULT: '#D4A24C', 300: '#E6C285' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        sans: ['Inter', '"DM Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: { widest2: '0.32em' },
      boxShadow: {
        soft: '0 30px 60px -20px rgba(28,17,11,0.35)',
        lift: '0 50px 80px -30px rgba(28,17,11,0.55)',
      },
      transitionTimingFunction: { expo: 'cubic-bezier(0.16, 1, 0.3, 1)' },
    },
  },
  plugins: [],
};
