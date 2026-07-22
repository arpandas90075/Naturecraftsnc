/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        moss: {
          50:  "#F3F5EC",
          100: "#E4E9D6",
          300: "#AEBD98",
          500: "#68794F",
          700: "#3D4A2F",
          800: "#2B3620",
          900: "#212B18",
          950: "#161D0F"
        },
        gold: {
          300: "#E4C588",
          400: "#D6AE64",
          500: "#C99A4B",
          600: "#A87E2F",
          700: "#8A6624"
        },
        cream: {
          50:  "#FBFAF0",
          100: "#F7F1E1",
          200: "#EFE4CB"
        },
        bark: "#5A3E24"
      },
      fontFamily: {
        display: ["Cinzel", "serif"],
        serif: ["Cormorant Garamond", "Georgia", "serif"],
        body: ["Jost", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soap: "0 18px 40px -18px rgba(22, 29, 15, 0.35)",
        lift: "0 10px 28px -12px rgba(22, 29, 15, 0.28)"
      }
    }
  },
  plugins: []
};
