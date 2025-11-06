/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./lib/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        beige: "#FAF8F2",
        marsala: "#5A0F11",
        blue: "#B3D4E0",
      },
      fontFamily: {
        script: ['"Love Light"', '"Dancing Script"', "cursive"],
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
