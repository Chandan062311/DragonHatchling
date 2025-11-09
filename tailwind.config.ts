import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        transformer: {
          base: "#1f2937",
          accent: "#60a5fa"
        },
        hatchling: {
          base: "#0f172a",
          accent: "#fbbf24"
        }
      }
    }
  },
  plugins: []
};

export default config;
