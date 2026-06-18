import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./features/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./stores/**/*.{ts,tsx}",
    "./systems/**/*.{ts,tsx}",
    "./world/**/*.{ts,tsx}"
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      bloomInk: "#211713",
      rootUmber: "#3a241b",
      mossdeep: "#3c5b38",
      leafglow: "#93b95f",
      seedgold: "#f0c96b",
      petalcream: "#fff1cf",
      duskplum: "#39294f",
      dreamviolet: "#8764c8",
      fountainblue: "#75b7ca",
      emberberry: "#c96b5f",
      fogmilk: "#f8ead2",
      nightbloom: "#151d2e"
    },
    fontFamily: {
      body: ["var(--font-body)", "serif"],
      display: ["var(--font-display)", "serif"]
    },
    extend: {
      boxShadow: {
        lantern: "0 0 28px rgba(240, 201, 107, 0.42)",
        spore: "0 0 44px rgba(147, 185, 95, 0.34)"
      }
    }
  },
  plugins: []
};

export default config;
