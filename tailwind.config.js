/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        font: "var(--font-color)",
        background: "var(--background-color)",
        primary1: "var(--primary1-color)",
        primary2: "var(--primary2-color)",
        primary3: "var(--primary3-color)",
      },
    },
  },
  plugins: [],
};
