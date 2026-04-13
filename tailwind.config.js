/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Clash Display"', '"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        saffron: { 50:'#fff7ed', 100:'#ffedd5', 300:'#fdba74', 400:'#fb923c', 500:'#f97316', 600:'#ea580c' },
        ink: { 50:'#fafaf9', 100:'#f5f0e8', 200:'#e8dcc8', 300:'#c4a882', 400:'#a07850', 500:'#7c5c38', 600:'#5a3e22', 700:'#3d2c14', 800:'#2d1f0e', 900:'#1a1108' },
        cream: '#fdf8f2',
        emerald: { 400:'#34d399', 500:'#10b981', 600:'#059669' },
        violet: { 400:'#a78bfa', 500:'#8b5cf6', 600:'#7c3aed' },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease-out forwards',
        'fade-in': 'fadeIn 0.4s ease-out forwards',
        'slide-in': 'slideIn 0.3s ease-out forwards',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        slideIn: { '0%': { opacity: '0', transform: 'translateX(-10px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
        shimmer: { '0%': { backgroundPosition: '-200% 0' }, '100%': { backgroundPosition: '200% 0' } },
      },
      backdropBlur: { xs: '2px' },
    },
  },
  plugins: [],
}
