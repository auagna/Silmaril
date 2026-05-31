import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/features/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          50:  "#fafaf9",
          100: "#f4f4f2",
          200: "#e7e6e2",
          300: "#cfcec9",
          400: "#9c9b96",
          500: "#6b6b66",
          600: "#46453f",
          700: "#2b2b27",
          800: "#1a1a17",
          900: "#0e0e0c"
        },
        accent: {
          DEFAULT: "#3a5a40",  // muted forest — exploration tone
          soft:    "#a3b18a"
        }
      },
      fontFamily: {
        sans: [
          "ui-sans-serif", "system-ui", "-apple-system",
          "Pretendard", "Inter", "Helvetica Neue", "sans-serif"
        ],
        serif: [
          "ui-serif", "Iowan Old Style", "Apple Garamond",
          "Baskerville", "Times New Roman", "serif"
        ]
      },
      maxWidth: {
        prose: "68ch"
      },
      borderRadius: {
        xl2: "1.25rem"
      }
    }
  },
  plugins: []
};

export default config;
