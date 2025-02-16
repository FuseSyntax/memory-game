// tailwind.config/ts
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      rotate: {
        '180': '180deg',
      },
      perspective: {
        '1000': '1000px',
      }
    },
  },
  plugins: [],
}