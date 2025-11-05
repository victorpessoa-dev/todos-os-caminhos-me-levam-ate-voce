/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{js,jsx}', './app/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        beige: '#FAF8F2',
        gold: '#5A0F11',
        blue: '#B3D4E0',
      },
      fontFamily: {
        script: ['"Love Light"', '"Dancing Script"', 'cursive'],
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
