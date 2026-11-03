import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        rose: {
          50: "#fff5f7",
          100: "#ffe4eb",
          200: "#ffc9d8",
          300: "#ff9eb8",
          400: "#ff6993",
          500: "#ff3b72",
          600: "#ed1858",
        },
        cream: {
          50: "#fffdf9",
          100: "#fff9ee",
          200: "#ffefd6",
        },
        choco: {
          600: "#6d4c41",
          700: "#543930",
          800: "#3e2723",
        },
      },
      animation: {
        "float-slow": "float 4s ease-in-out infinite",
        "float-delayed": "float 4s ease-in-out 2s infinite",
        "pulse-soft": "pulseSoft 2.5s ease-in-out infinite",
        "wiggle": "wiggle 1s ease-in-out infinite",
        "spin-slow": "spin 8s linear infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pulseSoft: {
          "0%, 100%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.06)" },
        },
        wiggle: {
          "0%, 100%": { transform: "rotate(-3deg)" },
          "50%": { transform: "rotate(3deg)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
