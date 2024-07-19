/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./**/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        'anton': ['Anton', 'sans-serif'],
        'manrope': ['Manrope', 'sans-serif'],
      },
      colors: {
        'custom-yellow': '#FFD15B',
        'custom-grey': '#E5E5E5',
      },
      backgroundImage: theme => ({
        'custom-image': "url('../photos/Petits-plats-maquette.png')",
      }),
    },
  },
  plugins: [],
}

