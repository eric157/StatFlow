/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        plasma: {
          50: "#f5f3ff",
          100: "#e1dcff",
          200: "#c4b4ff",
          300: "#a380ff",
          400: "#7f57ff",
          500: "#5b30ff",
          600: "#401bdb",
          700: "#3215a8",
          800: "#290f7d",
          900: "#1d064d",
        },
        glass: "#14141f",
      },
      fontFamily: {
        brand: ["Inter", "system-ui", "sans-serif"],
        serif: ["Space Grotesk", "ui-serif", "serif"],
      },
      boxShadow: {
        glass: "0 25px 45px rgba(5, 4, 15, 0.4)",
        neon: "0 0 30px rgba(83, 74, 183, 0.45)",
      },
      backdropBlur: {
        xl: "30px",
      },
    },
  },
  plugins: [],
}
