/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "primary": "#06e0f9",
        "primary-dark": "#05b3c7",
        "primary-dim": "rgba(6, 224, 249, 0.1)",
        "accent": "#00FF94",
        "background-light": "#f5f8f8",
        "background-dark": "#050505",
        "surface": "#0E1217",
        "surface-border": "#1F2937",
        "surface-highlight": "#1F2937",
        "navy": "#001B31",
        "deep-navy": "#001B31",
        "text-main": "#E1E7EF",
        "text-primary": "#E1E7EF",
        "text-muted": "#9CA3AF"
      },
      fontFamily: {
        "display": ["Space Grotesk", "sans-serif"],
        "body": ["Inter", "sans-serif"],
        "mono": ["Fira Code", "monospace"],
      },
      backgroundImage: {
        'grid-pattern': "linear-gradient(to right, #1F2937 1px, transparent 1px), linear-gradient(to bottom, #1F2937 1px, transparent 1px)",
      },
      boxShadow: {
        'glow-primary': '0 0 20px rgba(0, 229, 255, 0.4)',
        'glow-accent': '0 0 20px rgba(0, 255, 148, 0.4)',
        'glow': '0 0 20px rgba(6, 224, 249, 0.25)',
        'glow-active': '0 0 30px rgba(6, 224, 249, 0.5)',
        'glow-hover': '0 0 30px rgba(6, 224, 249, 0.25)'
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out infinite 1s',
        'pulse-glow': 'pulse-glow 3s infinite ease-in-out',
        'flow': 'flow 3s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { opacity: '0.5', transform: 'scale(1)', boxShadow: '0 0 10px rgba(0, 229, 255, 0.2)' },
          '50%': { opacity: '1', transform: 'scale(1.1)', boxShadow: '0 0 25px rgba(0, 229, 255, 0.6)' },
        },
        flow: {
          '0%': { strokeDashoffset: '1000' },
          '100%': { strokeDashoffset: '0' },
        }
      }
    },
  },
  plugins: [],
}
