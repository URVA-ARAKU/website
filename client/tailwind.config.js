/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#5A3825",
        primaryDark: "#3F2618",
        primaryMid: "#8B5A2B",
        secondary: "#8B5A2B",
        tertiary: "#F4F1EA",
        cream: "#F4F1EA",
        cream2: "#FAF8F4",
        creamSurface: "#EAE5D9",
        creamBorder: "#E2D9CC",
        ink: "#5A3825",
        muted: "#8C7364",
        terracotta: {
          DEFAULT: "#5A3825",
          warm: "#8B5A2B",
          dark: "#3F2618",
          light: "#A77343",
          50: "#FDFBF7",
          100: "#F4F1EA",
          200: "#E2D9CC",
          300: "#CCA887",
          500: "#8B5A2B",
          700: "#5A3825",
          800: "#4A2B1B",
          900: "#3F2618",
        },
        earth: {
          bg: "#F4F1EA",
          card: "#FAF8F4",
          surface: "#EAE5D9",
          border: "#E2D9CC",
          dark: "#3F2618",
        },
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', '"Inter"', '-apple-system', 'BlinkMacSystemFont', 'system-ui', 'sans-serif'],
        ui: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        headline: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        display: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        serif: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        accent: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        price: ['"Plus Jakarta Sans"', '"Inter"', 'sans-serif'],
        mono: ['monospace'],
      },
    },
  },
  plugins: [],
}

