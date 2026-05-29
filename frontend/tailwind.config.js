/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef9ff', 100: '#d8f1ff', 200: '#b9e6ff', 300: '#87d8ff',
          400: '#4dc0fc', 500: '#23a6f8', 600: '#0d87ee', 700: '#0a6fdb',
          800: '#0e58b3', 900: '#114b8c', 950: '#0c2f57',
        },
        surface: { DEFAULT: '#0a0f1e', 50: '#111827', 100: '#1a2235', 200: '#222d42' },
        accent: { gold: '#f59e0b', emerald: '#10b981', rose: '#f43f5e' },
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui'],
        body: ['var(--font-body)', 'system-ui'],
        mono: ['var(--font-mono)', 'monospace'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'glass': 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #0d87ee 0%, #0a6fdb 100%)',
      },
      boxShadow: {
        'glass': '0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08)',
        'brand': '0 4px 24px rgba(13,135,238,0.35)',
        'glow': '0 0 40px rgba(13,135,238,0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'pulse-slow': 'pulse 3s infinite',
      },
      keyframes: {
        fadeIn: { from: { opacity: '0' }, to: { opacity: '1' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(16px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
      },
    },
  },
  plugins: [],
};
