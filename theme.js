// theme.js
import React, { createContext, useState, useContext } from "react";

export const imdbTheme = {
  name: "dark", // dark mode
  colors: {
    primary: "#f5c518",      // IMDb Yellow
    background: "#121212",   // Dark background
    textPrimary: "#ffffff",  // White text
    textSecondary: "#b3b3b3",// Light gray text
    border: "#333333",       // Dark gray border
  },
};

export const lightTheme = {
  name: "light", // light mode
  colors: {
    primary: "#f5c518",
    background: "#ffffff",
    textPrimary: "#000000",
    textSecondary: "#555555",
    border: "#dddddd",
  },
};

const ThemeContext = createContext({
  theme: imdbTheme,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(imdbTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme.name === "dark" ? lightTheme : imdbTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
