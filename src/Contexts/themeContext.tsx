import { createContext, useContext, useEffect, useState } from "react";

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
  resetTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setThemeState] = useState<string>(
    localStorage.getItem("theme") || ""
  );

  useEffect(() => {
    if (theme) {
      document.documentElement.classList.add(theme); //
      localStorage.setItem("theme", theme);
    } else {
      document.documentElement.classList.remove("event1", "event2");
      localStorage.removeItem("theme");
    }
  }, [theme]);

  const setTheme = (newTheme: string) => {
    document.documentElement.classList.remove("event1", "event2"); // 🗑️ Elimina temas anteriores
    document.documentElement.classList.add(newTheme); // 🟢 Agrega el nuevo tema
    setThemeState(newTheme);
  };

  const resetTheme = () => {
    document.documentElement.classList.remove("event1", "event2"); // ❌ Elimina cualquier tema activo
    setThemeState(""); // Restablece el estado
    localStorage.removeItem("theme");
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resetTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }
  return context;
};
