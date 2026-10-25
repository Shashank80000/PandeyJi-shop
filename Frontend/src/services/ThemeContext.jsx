import { createContext, useContext, useEffect, useMemo, useState } from "react";

const THEME_KEY = "theme";

function getInitialTheme() {
 if (typeof window === "undefined") return "light";
 try {
  const saved = localStorage.getItem(THEME_KEY);
  if (saved === "dark" || saved === "light") return saved;
 } catch {
  /* storage unavailable */
 }
 // First visit: respect the OS preference, never overwrite it into storage.
 return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

const ThemeContext = createContext({ theme: "light", toggleTheme: () => { }, setTheme: () => { } });

export function ThemeProvider({ children }) {
 const [theme, setThemeState] = useState(getInitialTheme);

 useEffect(() => {
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.setAttribute("data-theme", theme);
  try {
   localStorage.setItem(THEME_KEY, theme);
  } catch {
   /* storage unavailable */
  }
 }, [theme]);

 const value = useMemo(
  () => ({
   theme,
   setTheme: setThemeState,
   toggleTheme: () => setThemeState((current) => (current === "dark" ? "light" : "dark")),
  }),
  [theme]
 );

 return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
 return useContext(ThemeContext);
}
