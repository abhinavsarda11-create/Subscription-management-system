/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        display: ["'Clash Display'", "sans-serif"],
        body:    ["'Satoshi'", "sans-serif"],
        mono:    ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50:  "#f0f0ff",
          100: "#e4e3ff",
          200: "#cccbff",
          300: "#b0adff",
          400: "#9b94ff",
          500: "#8b7bff",
          600: "#7c5af6",
          700: "#6b44e0",
          800: "#5838b8",
          900: "#4a3090",
          950: "#2c1a5e",
        },
        surface: {
          50:  "#f8fafc",
          100: "#f1f5f9",
          200: "#e2e8f0",
          300: "#cbd5e1",
          800: "#1e293b",
          850: "#172032",
          900: "#0f172a",
          950: "#070d1c",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "mesh-1": "radial-gradient(at 40% 20%, #4f35bd 0px, transparent 50%), radial-gradient(at 80% 0%, #7c3aed 0px, transparent 50%), radial-gradient(at 0% 50%, #1e1b4b 0px, transparent 50%)",
      },
      animation: {
        "float":    "float 6s ease-in-out infinite",
        "shimmer":  "shimmer 2s linear infinite",
        "glow":     "glow 2s ease-in-out infinite alternate",
        "slide-up": "slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        "fade-in":  "fadeIn 0.3s ease",
        "pulse-slow":"pulse 3s ease-in-out infinite",
      },
      keyframes: {
        float:    { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-8px)" } },
        shimmer:  { "0%": { backgroundPosition: "-200% 0" }, "100%": { backgroundPosition: "200% 0" } },
        glow:     { "0%": { boxShadow: "0 0 20px rgba(124,90,246,0.3)" }, "100%": { boxShadow: "0 0 40px rgba(124,90,246,0.7)" } },
        slideUp:  { "0%": { opacity: 0, transform: "translateY(16px)" }, "100%": { opacity: 1, transform: "translateY(0)" } },
        fadeIn:   { "0%": { opacity: 0 }, "100%": { opacity: 1 } },
      },
      boxShadow: {
        "glass":      "0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)",
        "brand":      "0 0 40px rgba(124,90,246,0.35)",
        "brand-lg":   "0 0 60px rgba(124,90,246,0.5)",
        "card":       "0 4px 24px rgba(0,0,0,0.2)",
        "card-hover": "0 16px 48px rgba(0,0,0,0.35)",
      },
    },
  },
  plugins: [],
};
