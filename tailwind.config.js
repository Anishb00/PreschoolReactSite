/** @type {import('tailwindcss').Config} */
// tailwind.config.ts
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: { lato: ["Lato", "sans-serif"] },
      keyframes: {
        growCircle: {
          "0%": { transform: "scale(0)" },
          "100%": { transform: "scale(1)" },
        },
        drawPath: {
          "0%": { strokeDashoffset: "1" },
          "100%": { strokeDashoffset: "0" },
        },
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        growCircle: "growCircle 0.5s ease-out forwards",
        drawPath: "drawPath 0.6s ease-out forwards",
        fadeUp: "fadeUp 0.6s ease-out forwards",
      },
    },
  },
  plugins: [],
};
