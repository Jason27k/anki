import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        first: "#F9F9FD",
        second: "#A1A7CE",
        third: "#534ED8",
        fourth: "#453F56",
        fifth: "#E0B9BB",
        sixth: "#F73D31",
        seventh: "#C48473",
      },
    },
  },
  plugins: [],
} satisfies Config;
