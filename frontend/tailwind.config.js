module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./index.html"
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#06b6d4',
          50: '#ecfeff',
          100: '#cffafe',
          200: '#a5f3fc',
          300: '#67e8f9',
          400: '#22d3ee',
          500: '#06b6d4',
          600: '#0891b2',
          700: '#0e7490',
          800: '#155e75',
          900: '#164e63',
        },
        secondary: '#14b8a6',   // teal-500 - xanh lá biển
        accent: '#0ea5e9',      // sky-500 - xanh trời
        dark: {
          bg: '#0b1120',
          card: '#131e36',
          border: '#1e293b',
          muted: '#94a3b8',
        }
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(6, 182, 212, 0.35)',
        'glow-accent': '0 0 25px -5px rgba(14, 165, 233, 0.35)',
        'glass': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        }
      },
      screens: {
        'xs': '480px',  // Extra small devices (large phones)
      },
    },
  },
  plugins: [],
};
