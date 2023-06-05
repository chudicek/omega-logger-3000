export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
      backgroundImage: {
        'login-background': "url('/src/assets/images/login-image.jpg')",
        'signup-background': "url('/src/assets/images/signup-image.png')",
      },
    },
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      'white-smoke': '#FDFDFD',
      'dark-grey': '#333333',
      'dark-red': '#A60B08',
      'default-green': '#00A692',
      'light-orange': '#F29A18',
      'light-grey': '#DBDBDB',
      'sand-orange': '#A66608',
    },
  },
  plugins: [],
};
