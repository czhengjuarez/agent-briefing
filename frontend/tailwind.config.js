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
        primary: '#8E1F5A',
        secondary: '#DD388B',
        'dark-bg': '#0D1533',
      },
    },
  },
  plugins: [],
}
