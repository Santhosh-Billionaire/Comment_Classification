/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#A855F7',
          light: '#C084FC',
          dark: '#8A2BE2'
        },
        background: {
          DEFAULT: '#0D0D0D',
          lighter: '#1A1A1A',
          card: '#202020'
        },
        accent: {
          blue: '#3B82F6',
          pink: '#EC4899',
          purple: '#8B5CF6'
        },
        text: {
          primary: '#E5E5E5',
          secondary: '#B3B3B3',
          muted: '#6B7280'
        },
        success: '#10B981',
        warning: '#F59E0B',
        error: '#EF4444'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px rgba(168, 85, 247, 0.5)' },
          '100%': { boxShadow: '0 0 20px rgba(168, 85, 247, 0.8)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};