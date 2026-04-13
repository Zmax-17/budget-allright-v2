import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  setDarkMode: React.Dispatch<
    React.SetStateAction<boolean>
  >;
}
const ThemeContext = createContext<
  ThemeContextType | undefined
>(undefined);
/**
 * Theme provider for the entire application
 * Manages light/dark mode and persists choice in localStorage
 */
export default function ThemeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [darkMode, setDarkModeState] = useState<boolean>(
    () => {
      return localStorage.getItem("darkMode") === "true";
    },
  );

  const setDarkMode = useCallback(
    (value: boolean): void => {
      setDarkModeState(value);
    },
    [],
  );

  const toggleTheme = useCallback((): void => {
    setDarkModeState((prev) => !prev);
  }, []);

  useEffect(() => {
    localStorage.setItem("darkMode", String(darkMode));
    document.documentElement.classList.toggle(
      "dark",
      darkMode,
    );
  }, [darkMode]);

  return (
    <ThemeContext.Provider
      value={{ darkMode, toggleTheme, setDarkMode }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error(
      "useTheme must be used within ThemeProvider",
    );
  }

  return context;
}
// // Usage
// function ThemeToggle() {
//   const { darkMode, toggleTheme } = useTheme();

//   return (
//     <button onClick={toggleTheme}>
//       {darkMode ? "🌙" : "☀️"}
//     </button>
//   );
// }
// // toggleTheme
// <button onClick={toggleTheme}>Switch theme</button>;

// // Special cases - setDarkMode
// // Synchronization with the system theme
// useEffect(() => {
//   const prefersDark = window.matchMedia(
//     "(prefers-color-scheme: dark)",
//   ).matches;
//   setDarkMode(prefersDark);
// }, []);

// // Install from user settings
// onUserSettingsLoad((settings) => {
//   setDarkMode(settings.darkMode);
// });
