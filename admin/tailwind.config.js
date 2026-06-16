/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563EB',
        secondary: '#14B8A6',
        background: '#F8FAFC',
        accent: '#A855F7',
        'text-dark': '#1E293B',
        'text-light': '#64748B',
      }
    },
  },
  plugins: [],
}
