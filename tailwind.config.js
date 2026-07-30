/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'preto-premium': '#0B0B0B',
        'preto-card': '#161616',
        'dourado-principal': '#C8A24A',
        'dourado-claro': '#E9D28C',
        'dourado-escuro': '#9B7330',
        'branco-premium': '#F5F5F5',
        'cinza-medio': '#8A8A8A',
      },
      fontFamily: {
        display: ['Cinzel', 'serif'],
        sans: ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
