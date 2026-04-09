import typography from "@tailwindcss/typography";

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
        "marsala-dark": "#481012",
        blue: "#B3D4E0",
      },
      fontFamily: {
        script: ['"Love Light"', '"Dancing Script"', "cursive"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      fontSize: {
        /* Escala útil além dos defaults do Tailwind */
        "2xs": ["0.6875rem", { lineHeight: "1rem" }],
      },
    },
  },
  plugins: [typography],
};
