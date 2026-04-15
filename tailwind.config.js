/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'sans-serif'],
      },
      colors: {
        s: { 50:'#fff7ed',100:'#ffedd5',200:'#fed7aa',300:'#fdba74',400:'#fb923c',500:'#f97316',600:'#ea580c',700:'#c2410c' },
        k: { 50:'#fafaf9',100:'#f0ebe0',200:'#e0d5c0',300:'#c4a882',400:'#a07850',500:'#7c5c38',600:'#5a3e22',700:'#3d2c14',800:'#2d1f0e',900:'#1a1108' },
        v: { 50:'#f5f3ff',100:'#ede9fe',400:'#a78bfa',500:'#8b5cf6',600:'#7c3aed' },
        e: { 50:'#ecfdf5',400:'#34d399',500:'#10b981',600:'#059669' },
        cr: '#fdf8f2',
      },
      animation: {
        'up': 'up 0.6s ease-out forwards',
        'in': 'in 0.4s ease-out forwards',
        'float': 'float 5s ease-in-out infinite',
        'shimmer': 'shimmer 1.8s linear infinite',
        'glow': 'glow 2s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        up: { '0%':{ opacity:'0', transform:'translateY(24px)' }, '100%':{ opacity:'1', transform:'translateY(0)' } },
        in: { '0%':{ opacity:'0' }, '100%':{ opacity:'1' } },
        float: { '0%,100%':{ transform:'translateY(0px)' }, '50%':{ transform:'translateY(-8px)' } },
        shimmer: { '0%':{ backgroundPosition:'-200% 0' }, '100%':{ backgroundPosition:'200% 0' } },
        glow: { '0%,100%':{ boxShadow:'0 0 20px rgba(249,115,22,0.3)' }, '50%':{ boxShadow:'0 0 40px rgba(249,115,22,0.6)' } },
      },
    },
  },
  plugins: [],
}
