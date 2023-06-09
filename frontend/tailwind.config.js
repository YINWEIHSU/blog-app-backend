/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}'
  ],
  theme: {
    extend: {
      flexGrow: {
        2: '2',
        3: '3',
        4: '4',
        5: '5'
      },
      width: {
        md: '763px'
      },
      maxWidth: {
        md: '763px'
      }
    }
  },
  plugins: []
}
