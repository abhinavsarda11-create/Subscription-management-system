/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "'Syne'", "sans-serif"],
        body:    ["'Satoshi'", "'Inter'", "system-ui", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        gold: {
          50:  "#fffbeb",
          100: "#fef3c7",
          200: "#fde68a",
          300: "#fcd34d",
          400: "#fbbf24",
          500: "#f59e0b",
          600: "#d97706",
          700: "#b45309",
          800: "#92400e",
          900: "#78350f",
        },
        rose: {
          400: "#fb7185",
          500: "#f43f5e",
          600: "#e11d48",
        },
        teal: {
          400: "#2dd4bf",
          500: "#14b8a6",
          600: "#0d9488",
        },
        violet: {
          400: "#a78bfa",
          500: "#8b5cf6",
          600: "#7c3aed",
        },
        brand: {
          400: "#818cf8",
          500: "#6366f1",
          600: "#4f46e5",
        },
      },
      boxShadow: {
        "3d":       "0 20px 60px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05) inset, 0 1px 0 rgba(255,255,255,0.1) inset",
        "3d-gold":  "0 20px 60px -12px rgba(245,158,11,0.3), 0 0 0 1px rgba(251,191,36,0.15) inset",
        "3d-rose":  "0 20px 60px -12px rgba(244,63,94,0.3),  0 0 0 1px rgba(251,113,133,0.15) inset",
        "3d-teal":  "0 20px 60px -12px rgba(20,184,166,0.3), 0 0 0 1px rgba(45,212,191,0.15) inset",
        "3d-brand": "0 20px 60px -12px rgba(99,102,241,0.4), 0 0 0 1px rgba(129,140,248,0.2) inset",
        "glow-gold":"0 0 40px rgba(245,158,11,0.4)",
        "glow-rose":"0 0 40px rgba(244,63,94,0.4)",
        "glow-teal":"0 0 40px rgba(20,184,166,0.4)",
        "glow-brand":"0 0 40px rgba(99,102,241,0.4)",
      },
      keyframes: {
        float:     { "0%,100%": { transform: "translateY(0px) rotate(0deg)" }, "50%": { transform: "translateY(-12px) rotate(1deg)" } },
        floatSlow: { "0%,100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer:   { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        spin3d:    { "0%": { transform: "rotateY(0deg)" }, "100%": { transform: "rotateY(360deg)" } },
        glowPulse: { "0%,100%": { opacity: 0.6 }, "50%": { opacity: 1 } },
        orbit:     { "0%": { transform: "rotate(0deg) translateX(120px) rotate(0deg)" }, "100%": { transform: "rotate(360deg) translateX(120px) rotate(-360deg)" } },
        pageIn:    { "0%": { opacity: 0, transform: "translateY(12px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        pulseDot:  { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.35 } },
      },
      animation: {
        "float":       "float 6s ease-in-out infinite",
        "float-slow":  "floatSlow 8s ease-in-out infinite",
        "shimmer":     "shimmer 2s linear infinite",
        "glow-pulse":  "glowPulse 2.5s ease-in-out infinite",
        "orbit":       "orbit 12s linear infinite",
        "page-in":     "pageIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) both",
        "pulse-dot":   "pulseDot 1.8s ease infinite",
      },
    },
  },
  plugins: [],
};
