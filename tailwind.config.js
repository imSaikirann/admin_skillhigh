/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        main: "#0D8267",
        purple: "#818CF8",
        darkColor: "#1B1B1A",
        primary: '#0D8267',
        secondary: '#8E8F8F',
        accent: '#38b2ac',
        dark: '#010101',
        light: '#edf2f7',
        danger: '#e53e3e',
        darkBg: "#121213", 
      },
      fontFamily: {
        poppins: ["Poppins", "serif"],
      },
    },
  },
  plugins: [],
}