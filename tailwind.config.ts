import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: '#080d1a',
          surface: 'rgba(15,22,41,0.65)'
        },
        gold: {
          DEFAULT: '#f5b72f',
          light: '#ffd166',
          dim: 'rgba(245,183,47,0.14)'
        },
        ink: {
          DEFAULT: '#eef1f8',
          soft: '#8892a8',
          muted: '#5a6478'
        },
        ok: '#34d399',
        bad: '#f87171',
        warn: '#fbbf24',
        plum: '#a78bfa',
        cyan2: '#22d3ee'
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-outfit)', 'system-ui', 'sans-serif']
      },
      borderRadius: {
        glass: '20px'
      },
      backdropBlur: {
        glass: '20px'
      },
      boxShadow: {
        glass: '0 10px 40px -12px rgba(0,0,0,0.6)',
        glow: '0 0 40px rgba(245,183,47,0.25)',
        lift: '0 30px 60px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(245,183,47,0.25)'
      },
      keyframes: {
        meshFloat: {
          '0%,100%': { transform: 'translate(0,0) scale(1)' },
          '33%': { transform: 'translate(40px,-30px) scale(1.1)' },
          '66%': { transform: 'translate(-30px,40px) scale(0.95)' }
        },
        starDrift: {
          '0%': { transform: 'translateY(100vh) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.6' },
          '90%': { opacity: '0.6' },
          '100%': { transform: 'translateY(-10vh) rotate(360deg)', opacity: '0' }
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        fadeRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        pulseGold: {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(245,183,47,0.6)' },
          '50%': { boxShadow: '0 0 0 20px rgba(245,183,47,0)' }
        },
        spin: {
          to: { transform: 'rotate(360deg)' }
        }
      },
      animation: {
        meshFloat: 'meshFloat 22s ease-in-out infinite',
        starDrift: 'starDrift 15s linear infinite',
        fadeUp: 'fadeUp 0.8s ease-out both',
        fadeRight: 'fadeRight 0.8s ease-out both',
        pulseGold: 'pulseGold 2s ease-in-out infinite',
        spin: 'spin 1s linear infinite'
      }
    }
  },
  plugins: []
};

export default config;
