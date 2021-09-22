module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  mode: "jit",
  theme: {
    extend: {
      boxShadow: {
        custom:
          "0 -5px 5px -5px rgba(0, 0, 0, 0.4), 0px 5px 5px -5px rgba(0, 0, 0, 0.4)",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
