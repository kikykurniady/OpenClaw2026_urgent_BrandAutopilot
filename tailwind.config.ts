import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          DEFAULT: "#0a0a0f",
          soft: "#0f0f17",
          card: "#12121b",
        },
        border: {
          DEFAULT: "rgba(255,255,255,0.08)",
          strong: "rgba(255,255,255,0.14)",
        },
        primary: {
          DEFAULT: "#7c5cfc",
          glow: "rgba(124,92,252,0.45)",
        },
        accent: {
          blue: "#3884ff",
          amber: "#fbb040",
          green: "#34d399",
        },
        muted: "#8a8aa3",
      },
      fontFamily: {
        sans: ["DM Sans", "system-ui", "sans-serif"],
        display: ["Syne", "DM Sans", "sans-serif"],
      },
      borderRadius: {
        card: "12px",
        input: "8px",
      },
      boxShadow: {
        glow: "0 0 0 1px rgba(124,92,252,0.55), 0 0 32px rgba(124,92,252,0.35)",
        "glow-green": "0 0 0 1px rgba(52,211,153,0.55), 0 0 24px rgba(52,211,153,0.25)",
      },
      backgroundImage: {
        grid: "linear-gradient(rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.035) 1px, transparent 1px)",
      },
      keyframes: {
        pulseDot: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.85)" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        pulseDot: "pulseDot 1.2s ease-in-out infinite",
        fadeUp: "fadeUp 0.4s ease-out both",
        shimmer: "shimmer 2.2s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
