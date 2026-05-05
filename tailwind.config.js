/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        gold: {
          50:  '#fdf8e7',
          100: '#f9edbb',
          200: '#f3d97a',
          300: '#e8c23a',
          400: '#d4af37',
          500: '#b8960c',
          600: '#9a7a09',
          700: '#7a5f07',
          800: '#5c4706',
          900: '#3d2f04',
        },
        dark: {
          50:  '#f5f5f5',
          100: '#e0e0e0',
          200: '#bdbdbd',
          300: '#9e9e9e',
          400: '#757575',
          500: '#424242',
          600: '#2c2c2c',
          700: '#1e1e1e',
          800: '#141414',
          900: '#0a0a0a',
        },
        cream: '#faf6f0',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans:  ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #d4af37 0%, #f3d97a 50%, #b8960c 100%)',
        'dark-gradient': 'linear-gradient(135deg, #0a0a0a 0%, #1e1e1e 100%)',
      },
      boxShadow: {
        gold:    '0 4px 24px rgba(212, 175, 55, 0.25)',
        'gold-lg': '0 8px 40px rgba(212, 175, 55, 0.35)',
      },
    },
  },
  plugins: [],
}
