/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  theme: {
    extend: {
      colors: {
        'richblack': '#0D1B2A',
        'oxfordblue': '#1B263B',
        'yblue': '#415A77',
        'silverlake': '#778DA9',
        'platinum': '#E0E1DD',
      }
    },
  },
  plugins: [],
}

