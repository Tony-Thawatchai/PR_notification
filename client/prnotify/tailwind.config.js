/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'media',
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
        canadaRed: {
          DEFAULT: "hsl(5, 64%, 47%)", // Light mode color
          dark: "hsl(5, 64%, 55%)", // Dark mode color
        },
        

      },
    },
  },

  plugins: [],
};
