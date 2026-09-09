/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        command: {
          950: '#070b12',
          900: '#0b111d',
          850: '#101827',
          800: '#141e30',
          750: '#1a263d',
          700: '#202f4a',
          600: '#2c3f61',
          500: '#3d547f',
          400: '#647ea9',
        },
        risk: {
          low: '#10B981',      // Emerald Green
          moderate: '#F59E0B', // Amber Yellow
          high: '#F97316',     // Bright Orange
          critical: '#EF4444', // Crimson / Red
        },
        radar: {
          cyan: '#06B6D4',
          blue: '#38BDF8',
          glow: 'rgba(6, 182, 212, 0.25)',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'Courier New', 'monospace'],
      },
      boxShadow: {
        'glow-critical': '0 0 20px -3px rgba(239, 68, 68, 0.35)',
        'glow-high': '0 0 20px -3px rgba(249, 115, 22, 0.35)',
        'glow-moderate': '0 0 20px -3px rgba(245, 158, 11, 0.35)',
        'glow-low': '0 0 20px -3px rgba(16, 185, 129, 0.35)',
        'glow-cyan': '0 0 20px -3px rgba(6, 182, 212, 0.35)',
        'card-dark': '0 4px 20px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.06)',
      },
      animation: {
        'pulse-subtle': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar-sweep': 'radarSweep 4s linear infinite',
      },
      keyframes: {
        radarSweep: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [],
}
