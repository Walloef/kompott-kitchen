import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

export default {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)"],
      },
      keyframes: {
        rock: {
          "0%, 100%": { rotate: "-3deg" },
          "40%, 60%": { rotate: "2deg" },
        },
      },
      animation: {
        rock: "rock 1s cubic-bezier(.82,-0.12,.4,1.66) infinite",
      },
    },
  },
  future: {
    hoverOnlyWhenSupported: true,
  },
  plugins: [typography],
} satisfies Config;
