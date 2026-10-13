import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "#080B11",
        surface: {
          DEFAULT: "rgba(15, 23, 42, 0.75)",
          hover: "rgba(30, 41, 59, 0.8)",
          glass: "rgba(15, 23, 42, 0.65)",
          border: "rgba(255, 255, 255, 0.08)",
        },
        cyber: {
          cyan: "#00F2FE",
          violet: "#A855F7",
          emerald: "#10B981",
          crimson: "#EF4444",
          amber: "#F59E0B",
          pythonBlue: "#38BDF8",
          pythonYellow: "#FACC15",
        },
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "float": "float 5s ease-in-out infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glow: {
          "0%": { filter: "drop-shadow(0 0 10px rgba(0, 242, 254, 0.3))" },
          "100%": { filter: "drop-shadow(0 0 25px rgba(0, 242, 254, 0.6))" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
