import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3182F6",
        secondary: "#4ECB71",
        background: "#F9FBFC",
        surface: "#FFFFFF",
        text: {
          primary: "#111111",
          secondary: "#4C4C4C",
          muted: "#8A94A6",
        },
        border: "#E5EAF0",
        badge: "#EFF3FA",
        warning: "#FFAA2B",
        error: "#FF5B5C",
      },
      borderRadius: {
        card: "16px",
        pill: "999px",
      },
      boxShadow: {
        card: "0 12px 32px rgba(30, 61, 116, 0.08)",
      },
      spacing: {
        xs: "8px",
        sm: "12px",
        md: "16px",
        lg: "24px",
        xl: "32px",
      },
      fontFamily: {
        sans: [
          "Pretendard",
          "-apple-system",
          "BlinkMacSystemFont",
          "Apple SD Gothic Neo",
          "sans-serif",
        ],
      },
      fontSize: {
        display: ["40px", { lineHeight: "56px" }],
        "heading-l": ["28px", { lineHeight: "40px" }],
        "heading-m": ["22px", { lineHeight: "32px" }],
        "body-l": ["18px", { lineHeight: "28px" }],
        "body-m": ["16px", { lineHeight: "26px" }],
        "body-s": ["14px", { lineHeight: "22px" }],
        caption: ["12px", { lineHeight: "18px" }],
      },
    },
  },
  plugins: [],
};
export default config;

