/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dashboard: {
          bg: '#1a1a1a',
          card: '#2d2d2d',
          text: '#e0e0e0',
          border: '#404040',
        }
      }
    },
  },
  plugins: [],
}
