const { theme } = require("./theme.js");

module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: theme.colors.primary,
        background: theme.colors.background,
        textPrimary: theme.colors.textPrimary,
        textSecondary: theme.colors.textSecondary,
        border: theme.colors.border,
      },
    },
  },
  plugins: [],
};
