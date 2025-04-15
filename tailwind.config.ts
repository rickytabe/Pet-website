module.exports = {
    content: [
      "./index.html",
      "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
      extend: {
        colors: {
          'indigo': {
            500: '#6366f1',
          },
          'blue': {
            600: '#2563eb',
          },
          'gray': {
            800: '#1f2937',
          }
        }
      },
    },
    plugins: [],
  }