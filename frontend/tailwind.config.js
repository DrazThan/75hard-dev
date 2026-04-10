/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Midnight blue dark-mode surfaces
        mid: {
          bg:       '#0b0f1a',
          surface:  '#111827',
          card:     '#1a2235',
          border:   '#1e2d45',
          muted:    '#8892a4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        pop: {
          '0%,100%': { transform: 'scale(1)' },
          '40%':     { transform: 'scale(1.08)' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(6px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        pop:      'pop 0.25s ease-out',
        'fade-in': 'fade-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
}
